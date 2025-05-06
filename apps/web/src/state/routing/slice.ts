import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Protocol } from '@uniswap/router-sdk'
import { sendAnalyticsEvent } from 'analytics'
import { isUniswapXSupportedChain } from 'constants/chains'
import ms from 'ms'
import { logSwapQuoteRequest } from 'tracing/swapFlowLoggers'
import { trace } from 'tracing/trace'
import { isIPFSDeployment } from 'utils/cors-helper'

import {
  GetQuoteArgs,
  INTERNAL_ROUTER_PREFERENCE_PRICE,
  QuoteIntent,
  QuoteMethod,
  QuoteState,
  RouterPreference,
  RoutingConfig,
  TradeResult,
  URAQuoteResponse,
  URAQuoteType,
} from './types'
import { isExactInput, transformQuoteToTrade } from './utils'

const UNISWAP_API_URL = process.env.REACT_APP_UNISWAP_API_URL
const UNISWAP_GATEWAY_DNS_URL = process.env.REACT_APP_UNISWAP_GATEWAY_DNS
if (UNISWAP_API_URL === undefined || UNISWAP_GATEWAY_DNS_URL === undefined) {
  throw new Error(`UNISWAP_API_URL and UNISWAP_GATEWAY_DNS_URL must be defined environment variables`)
}

const CLIENT_PARAMS = {
  protocols: [Protocol.V2, Protocol.V3, Protocol.MIXED],
}

const protocols: Protocol[] = [Protocol.V2, Protocol.V3, Protocol.MIXED]

// routing API quote query params: https://github.com/Uniswap/routing-api/blob/main/lib/handlers/quote/schema/quote-schema.ts
const DEFAULT_QUERY_PARAMS = {
  protocols,
  // this should be removed once BE fixes issue where enableUniversalRouter is required for fees to work
  enableUniversalRouter: true,
}

function getRoutingAPIConfig(args: GetQuoteArgs): RoutingConfig {
  const { account, tokenInChainId, uniswapXForceSyntheticQuotes, routerPreference } = args

  const uniswapx = {
    useSyntheticQuotes: uniswapXForceSyntheticQuotes,
    // Protocol supports swap+send to different destination address, but
    // for now recipient === swapper
    recipient: account,
    swapper: account,
    routingType: URAQuoteType.DUTCH_LIMIT,
  }

  const classic = {
    ...DEFAULT_QUERY_PARAMS,
    routingType: URAQuoteType.CLASSIC,
    recipient: account,
    enableFeeOnTransferFeeFetching: true,
  }

  if (
    // If the user has opted out of UniswapX during the opt-out transition period, we should respect that preference and only request classic quotes.
    routerPreference === RouterPreference.API ||
    routerPreference === INTERNAL_ROUTER_PREFERENCE_PRICE ||
    !isUniswapXSupportedChain(tokenInChainId)
  ) {
    return [classic]
  }

  return [uniswapx, classic]
}

// Create a standard fetchBaseQuery to use when not on IPFS
const standardBaseQuery = fetchBaseQuery();

// Custom fetch function for routing API with IPFS support
const customFetch = async (args: any, api: any, extraOptions: any) => {
  const isIPFS = isIPFSDeployment();
  const originalFetch = fetch;

  // If on IPFS deployment, add headers to mimic app.uniswap.org
  if (isIPFS) {
    console.log('IPFS routing fix: Adding headers to routing API request');
    
    // Add all necessary headers to make it look like the request comes from app.uniswap.org
    const enhancedHeaders = {
      ...args.headers,
      'Origin': 'https://app.uniswap.org',
      'Referer': 'https://app.uniswap.org/',
      'x-request-source': 'uniswap-web',
      'Content-Type': 'application/json'
    };
    
    // Try first with no-cors mode removed (which might work with our CSP overrides)
    try {
      const response = await originalFetch(args.url, {
        method: args.method,
        headers: enhancedHeaders,
        body: args.body,
        credentials: 'omit'
      });
      
      return { data: await response.json(), status: response.status };
    } catch (error) {
      console.log('Routing API primary request failed, trying fallback', error);
      
      // Fallback to client-side router
      return { 
        error: { 
          status: 'FETCH_ERROR',
          data: { detail: 'IPFS deployment request failed' }
        } 
      };
    }
  }
  
  // For non-IPFS deployments, use the standard fetch implementation
  return standardBaseQuery(args, api, extraOptions);
};

export const routingApi = createApi({
  reducerPath: 'routingApi',
  baseQuery: customFetch,
  endpoints: (build) => ({
    getQuote: build.query<TradeResult, GetQuoteArgs>({
      queryFn(args, _api, _extraOptions, fetch) {
        return trace({ name: 'Quote', op: 'quote', data: { ...args } }, async (trace) => {
          logSwapQuoteRequest(args.tokenInChainId, args.routerPreference, false)
          const {
            tokenInAddress: tokenIn,
            tokenInChainId,
            tokenOutAddress: tokenOut,
            tokenOutChainId,
            amount,
            tradeType,
            sendPortionEnabled,
            gatewayDNSUpdateEnabled,
          } = args

          const requestBody = {
            tokenInChainId,
            tokenIn,
            tokenOutChainId,
            tokenOut,
            amount,
            sendPortionEnabled,
            type: isExactInput(tradeType) ? 'EXACT_INPUT' : 'EXACT_OUTPUT',
            intent:
              args.routerPreference === INTERNAL_ROUTER_PREFERENCE_PRICE ? QuoteIntent.Pricing : QuoteIntent.Quote,
            configs: getRoutingAPIConfig(args),
          }

          const baseURL = gatewayDNSUpdateEnabled ? UNISWAP_GATEWAY_DNS_URL : UNISWAP_API_URL
          try {
            return trace.child({ name: 'Quote on server', op: 'quote.server' }, async (serverTrace) => {
              const response = await fetch({
                method: 'POST',
                url: `${baseURL}/quote`,
                body: JSON.stringify(requestBody),
                headers: {
                  'x-request-source': 'uniswap-web',
                  'Origin': 'https://app.uniswap.org',
                  'Referer': 'https://app.uniswap.org/'
                },
              })

              if (response.error) {
                try {
                  // cast as any here because we do a runtime check on it being an object before indexing into .errorCode
                  const errorData = response.error.data as {
                    errorCode?: string
                    detail?: string
                  }
                  // NO_ROUTE should be treated as a valid response to prevent retries.
                  if (
                    typeof errorData === 'object' &&
                    (errorData?.errorCode === 'NO_ROUTE' || errorData?.detail === 'No quotes available')
                  ) {
                    serverTrace.setStatus('not_found')
                    trace.setStatus('not_found')
                    sendAnalyticsEvent('No quote received from routing API', {
                      requestBody,
                      response,
                      routerPreference: args.routerPreference,
                    })
                    return {
                      data: {
                        state: QuoteState.NOT_FOUND,
                        latencyMs: trace.now(),
                      },
                    }
                  }
                } catch {
                  throw response.error
                }
              }

              const uraQuoteResponse = response.data as URAQuoteResponse
              const tradeResult = await transformQuoteToTrade(args, uraQuoteResponse, QuoteMethod.ROUTING_API)
              return { data: { ...tradeResult, latencyMs: trace.now() } }
            })
          } catch (error: any) {
            console.warn(
              `GetQuote failed on Unified Routing API, falling back to client: ${
                error?.message ?? error?.detail ?? error
              }`
            )
          }

          try {
            return trace.child({ name: 'Quote on client', op: 'quote.client' }, async (clientTrace) => {
              const { getRouter, getClientSideQuote } = await import('lib/hooks/routing/clientSideSmartOrderRouter')
              const router = getRouter(args.tokenInChainId)
              const quoteResult = await getClientSideQuote(args, router, CLIENT_PARAMS)
              if (quoteResult.state === QuoteState.SUCCESS) {
                const trade = await transformQuoteToTrade(args, quoteResult.data, QuoteMethod.CLIENT_SIDE_FALLBACK)
                return {
                  data: { ...trade, latencyMs: trace.now() },
                }
              } else {
                clientTrace.setStatus('not_found')
                trace.setStatus('not_found')
                return { data: { ...quoteResult, latencyMs: trace.now() } }
              }
            })
          } catch (error: any) {
            console.warn(`GetQuote failed on client: ${error}`)
            trace.setError(error)
            return {
              error: {
                status: 'CUSTOM_ERROR',
                error: error?.detail ?? error?.message ?? error,
              },
            }
          }
        })
      },
      keepUnusedDataFor: ms(`10s`),
      extraOptions: {
        maxRetries: 0,
      } as any,
    }),
  }),
})

export const { useGetQuoteQuery } = routingApi
export const useGetQuoteQueryState = routingApi.endpoints.getQuote.useQueryState
