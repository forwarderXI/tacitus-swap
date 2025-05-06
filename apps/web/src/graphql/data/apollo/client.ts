import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { Reference, relayStylePagination } from '@apollo/client/utilities'
import { createSubscriptionLink } from 'utilities/src/apollo/SubscriptionLink'
import { splitSubscription } from 'utilities/src/apollo/splitSubscription'
import { isIPFSDeployment } from 'utils/cors-helper'

const API_URL = process.env.REACT_APP_AWS_API_ENDPOINT
const REALTIME_URL = process.env.REACT_APP_AWS_REALTIME_ENDPOINT
const REALTIME_TOKEN = process.env.REACT_APP_AWS_REALTIME_TOKEN
if (!API_URL || !REALTIME_URL || !REALTIME_TOKEN) {
  throw new Error('AWS CONFIG MISSING FROM ENVIRONMENT')
}

// Enhanced fetch function for IPFS deployments
const customFetch = (input: RequestInfo | URL, options: RequestInit = {}) => {
  // Check if we're running on IPFS/Fleek
  const onIPFS = isIPFSDeployment()
  
  // If on IPFS and request is to Uniswap gateway
  if (onIPFS && typeof input === 'string' && (
    input.includes('gateway.uniswap.org') ||
    input.includes('api.uniswap.org') ||
    input.includes('beta.gateway.uniswap.org')
  )) {
    // For Uniswap API, add proper headers but still use no-cors
    console.log('IPFS GraphQL fix: Adding headers for Uniswap API request');
    
    // Create enhanced headers with proper origin
    const enhancedHeaders = new Headers(options.headers || {});
    enhancedHeaders.set('Origin', 'https://app.uniswap.org');
    enhancedHeaders.set('Referer', 'https://app.uniswap.org/');
    enhancedHeaders.set('x-request-source', 'uniswap-web');
    
    // Create enhanced options
    const enhancedOptions = {
      ...options,
      headers: enhancedHeaders,
      mode: 'no-cors' as RequestMode,
      credentials: 'omit' as RequestCredentials
    };
    
    return fetch(input, enhancedOptions);
  }
  
  // Otherwise use normal fetch
  return fetch(input, options);
};

// Create HTTP link with custom fetch function
const httpLink = new HttpLink({ 
  uri: API_URL,
  fetch: customFetch,
  headers: {
    'Content-Type': 'application/json',
    'Origin': 'https://app.uniswap.org',
    'Referer': 'https://app.uniswap.org/',
    'x-request-source': 'uniswap-web'
  }
});

export const apolloClient = new ApolloClient({
  connectToDevTools: true,
  link: httpLink,
  headers: {
    'Content-Type': 'application/json',
    'Origin': 'https://app.uniswap.org',
    'Referer': 'https://app.uniswap.org/',
    'x-request-source': 'uniswap-web'
  },
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          nftBalances: relayStylePagination(['ownerAddress', 'filter']),
          nftAssets: relayStylePagination(),
          nftActivity: relayStylePagination(),
          token: {
            // Tokens should be cached by their chain/address, *not* by the ID returned by the server.
            // This is because the ID may change depending on fields requested.
            read(_, { args, toReference }): Reference | undefined {
              return toReference({
                __typename: 'Token',
                chain: args?.chain,
                address: args?.address,
              })
            },
          },
        },
      },
      Token: {
        // Tokens are cached by their chain/address (see Query.fields.token, above).
        // In any query for `token` or `tokens`, you *must* include `chain` and `address` fields in order
        // to properly normalize the result in the cache.
        keyFields: ['chain', 'address'],
        fields: {
          address: {
            // Always cache lowercased for consistency (backend sometimes returns checksummed).
            read(address: string | null): string | null {
              return address?.toLowerCase() ?? null
            },
          },
        },
      },
      TokenProject: {
        fields: {
          tokens: {
            // Cache data may be lost when replacing the tokens array, so retain all known tokens.
            merge(existing: unknown[] | undefined, incoming: unknown[] | undefined, { toReference }) {
              if (!existing || !incoming) {
                return existing ?? incoming
              } else {
                // Arrays must not be concatenated, or the cached array will grow indefinitely.
                // Instead, only append *new* elements to the array.
                const refs: Reference[] = existing.map((token: any) => toReference(token, true) as Reference)
                const refSet = refs.reduce((refSet, ref) => refSet.add(ref.__ref), new Set<string>())
                const newRefs = incoming
                  .map((token: any) => toReference(token, true) as Reference)
                  .filter((ref) => !refSet.has(ref.__ref))
                return [...refs, ...newRefs]
              }
            },
          },
        },
      },
      TokenMarket: {
        keyFields: ['id'],
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
})

// This is done after creating the client so that client may be passed to `createSubscriptionLink`.
const subscriptionLink = createSubscriptionLink({ uri: REALTIME_URL, token: REALTIME_TOKEN }, apolloClient)
apolloClient.setLink(splitSubscription(subscriptionLink, httpLink))
