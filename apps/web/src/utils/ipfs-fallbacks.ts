/**
 * Fallback data for IPFS deployments with limited network access
 * This provides static data when network requests fail
 */

import { isIPFSDeployment } from './cors-helper'

// Mock popular tokens when token lists can't be fetched
export const FALLBACK_POPULAR_TOKENS = [
  {
    "chainId": 1,
    "address": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    "name": "Wrapped Ether",
    "symbol": "WETH",
    "decimals": 18,
    "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png"
  },
  {
    "chainId": 1,
    "address": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    "name": "USD Coin",
    "symbol": "USDC",
    "decimals": 6,
    "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png"
  },
  {
    "chainId": 1,
    "address": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    "name": "Tether USD",
    "symbol": "USDT",
    "decimals": 6,
    "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png"
  },
  {
    "chainId": 1,
    "address": "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    "name": "Wrapped BTC",
    "symbol": "WBTC",
    "decimals": 8,
    "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png"
  },
  {
    "chainId": 1,
    "address": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    "name": "Dai Stablecoin",
    "symbol": "DAI",
    "decimals": 18,
    "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png"
  },
  {
    "chainId": 1,
    "address": "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    "name": "Uniswap",
    "symbol": "UNI",
    "decimals": 18,
    "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/logo.png"
  },
  {
    "chainId": 1,
    "address": "0x514910771AF9Ca656af840dff83E8264EcF986CA",
    "name": "ChainLink Token",
    "symbol": "LINK",
    "decimals": 18,
    "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x514910771AF9Ca656af840dff83E8264EcF986CA/logo.png"
  },
  {
    "chainId": 1,
    "address": "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
    "name": "Polygon",
    "symbol": "MATIC",
    "decimals": 18,
    "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0/logo.png"
  },
  {
    "chainId": 1,
    "address": "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE",
    "name": "SHIBA INU",
    "symbol": "SHIB",
    "decimals": 18,
    "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE/logo.png"
  },
  {
    "chainId": 1,
    "address": "0x4d224452801ACEd8B2F0aebE155379bb5D594381",
    "name": "ApeCoin",
    "symbol": "APE",
    "decimals": 18,
    "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x4d224452801ACEd8B2F0aebE155379bb5D594381/logo.png"
  }
];

// Mock token list response
export function getMockTokenList() {
  return {
    "name": "Uniswap Default List (IPFS Fallback)",
    "timestamp": new Date().toISOString(),
    "version": {
      "major": 1,
      "minor": 0,
      "patch": 0
    },
    "tokens": FALLBACK_POPULAR_TOKENS
  };
}

// Mock token price data
export const FALLBACK_TOKEN_PRICES = {
  "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2": 3000, // WETH
  "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48": 1,    // USDC
  "0xdAC17F958D2ee523a2206206994597C13D831ec7": 1,    // USDT
  "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599": 50000, // WBTC
  "0x6B175474E89094C44Da98b954EedeAC495271d0F": 1,    // DAI
  "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984": 5,    // UNI
  "0x514910771AF9Ca656af840dff83E8264EcF986CA": 15,   // LINK
  "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0": 0.5,  // MATIC
  "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE": 0.00001, // SHIB
  "0x4d224452801ACEd8B2F0aebE155379bb5D594381": 1.5   // APE
};

// Generate mock chart data for historical TVL and volume
function generateMockChartData(days = 30, baseValue = 1000000, volatility = 0.1) {
  const now = Date.now();
  const millisecondsPerDay = 86400000;
  const data = [];
  
  let currentValue = baseValue;
  
  for (let i = days; i >= 0; i--) {
    const timestamp = now - (i * millisecondsPerDay);
    // Add some random fluctuation to make the chart look natural
    const change = (Math.random() - 0.5) * volatility;
    currentValue = currentValue * (1 + change);
    
    data.push({
      timestamp,
      value: currentValue,
      date: new Date(timestamp).toISOString().split('T')[0],
    });
  }
  
  return data;
}

// Mock historical TVL data
export const MOCK_TVL_DATA = generateMockChartData(30, 2000000000, 0.05);

// Mock historical volume data
export const MOCK_VOLUME_DATA = generateMockChartData(30, 500000000, 0.15);

// Mock popular pools data
export const MOCK_TOP_POOLS = [
  {
    id: "0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640",
    feeTier: "500",
    token0: {
      id: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      symbol: "USDC",
      name: "USD Coin",
    },
    token1: {
      id: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      symbol: "WETH",
      name: "Wrapped Ether",
    },
    volumeUSD: "1250000000",
    txCount: "12500",
    totalValueLockedUSD: "450000000",
    totalValueLockedToken0: "250000000",
    totalValueLockedToken1: "70000",
  },
  {
    id: "0x4e68ccd3e89f51c3074ca5072bbac773960dfa36",
    feeTier: "3000",
    token0: {
      id: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
      symbol: "WBTC",
      name: "Wrapped BTC",
    },
    token1: {
      id: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      symbol: "WETH",
      name: "Wrapped Ether",
    },
    volumeUSD: "950000000",
    txCount: "8200",
    totalValueLockedUSD: "380000000",
    totalValueLockedToken0: "8000",
    totalValueLockedToken1: "55000",
  },
  {
    id: "0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8",
    feeTier: "3000",
    token0: {
      id: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      symbol: "USDC",
      name: "USD Coin",
    },
    token1: {
      id: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      symbol: "WETH",
      name: "Wrapped Ether",
    },
    volumeUSD: "820000000",
    txCount: "7500",
    totalValueLockedUSD: "320000000",
    totalValueLockedToken0: "180000000",
    totalValueLockedToken1: "45000",
  },
  {
    id: "0xcbcdf9626bc03e24f779434178a73a0b4bad62ed",
    feeTier: "3000",
    token0: {
      id: "0x6b175474e89094c44da98b954eedeac495271d0f",
      symbol: "DAI",
      name: "Dai Stablecoin",
    },
    token1: {
      id: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      symbol: "WETH",
      name: "Wrapped Ether",
    },
    volumeUSD: "620000000",
    txCount: "5200",
    totalValueLockedUSD: "280000000",
    totalValueLockedToken0: "155000000",
    totalValueLockedToken1: "40000",
  },
  {
    id: "0x5777d92f208679db4b9778590fa3cab3ac9e2168",
    feeTier: "100",
    token0: {
      id: "0x6b175474e89094c44da98b954eedeac495271d0f",
      symbol: "DAI",
      name: "Dai Stablecoin",
    },
    token1: {
      id: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      symbol: "USDC",
      name: "USD Coin",
    },
    volumeUSD: "520000000",
    txCount: "4800",
    totalValueLockedUSD: "220000000",
    totalValueLockedToken0: "110000000",
    totalValueLockedToken1: "110000000",
  }
];

// Function to create a mock response
export function createMockResponse(data: any, status = 200) {
  return Promise.resolve(new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  }));
}

// Determine if a URL should use a mock response in IPFS deployments
export function shouldUseMockResponse(url: string): boolean {
  if (!isIPFSDeployment()) return false;
  
  // Create specific patterns for URLs to mock
  const patternsToMock = [
    // Token lists
    'cloudflare-ipfs.com',
    'ipns/tokens',
    'ipns/extendedtokens',
    'ipns/unsupportedtokens',
    'tokens.uniswap.org',
    'extendedtokens.uniswap.org',
    'unsupportedtokens.uniswap.org',
    'ipfs/Qm', // IPFS content hashes
    
    // Analytics
    'statsig',
    'amplitude',
    'statsigapi.net',
    
    // API gateways
    'gateway.uniswap.org',
    'api.uniswap.org',
    'interface.gateway.uniswap.org',
    'graph.uniswap.org',
    'thegraph.com',
    'graphql',
    'data.uniswap.org'
  ];
  
  // Check if URL matches any of the patterns
  return patternsToMock.some(pattern => url.includes(pattern));
}

// Detect GraphQL queries based on request body
function detectGraphQLQueryType(body: string): string {
  // Parse the GraphQL query to determine what it's asking for
  if (!body) return 'unknown';
  
  try {
    // Look for key terms in the query
    if (body.includes('totalValueLocked') || body.includes('TVL') || body.includes('historicalTVL')) {
      return 'tvl';
    }
    if (body.includes('volumeUSD') || body.includes('historicalVolume')) {
      return 'volume';
    }
    if (body.includes('pools') || body.includes('topPools')) {
      return 'pools';
    }
    if (body.includes('tokens') || body.includes('topTokens')) {
      return 'tokens';
    }
    if (body.includes('protocol')) {
      return 'protocol';
    }
  } catch (e) {
    console.log('Error parsing GraphQL query:', e);
  }
  
  return 'unknown';
}

// Get a mock GraphQL response based on query type
function getMockGraphQLResponse(body: string) {
  const queryType = detectGraphQLQueryType(body);
  console.log(`Detected GraphQL query type: ${queryType}`);
  
  switch (queryType) {
    case 'tvl':
      return {
        data: {
          protocolData: {
            totalValueLockedUSD: "2150000000",
            totalValueLockedETH: "715000"
          },
          historicalTVL: MOCK_TVL_DATA.map(item => ({
            timestamp: Math.floor(item.timestamp / 1000),
            totalValueLockedUSD: item.value.toString()
          }))
        }
      };
    
    case 'volume':
      return {
        data: {
          protocolData: {
            volumeUSD: "3250000000"
          },
          historicalVolume: MOCK_VOLUME_DATA.map(item => ({
            timestamp: Math.floor(item.timestamp / 1000),
            volumeUSD: item.value.toString()
          }))
        }
      };
      
    case 'pools':
      return {
        data: {
          pools: MOCK_TOP_POOLS
        }
      };
      
    case 'tokens':
      return {
        data: {
          tokens: FALLBACK_POPULAR_TOKENS.map(token => ({
            id: token.address.toLowerCase(),
            symbol: token.symbol,
            name: token.name,
            volumeUSD: (Math.random() * 10000000).toFixed(0),
            txCount: (Math.random() * 10000).toFixed(0),
            totalValueLockedUSD: (Math.random() * 100000000).toFixed(0)
          }))
        }
      };
      
    case 'protocol':
      return {
        data: {
          protocol: {
            id: "uniswap-v3",
            totalValueLockedUSD: "2150000000",
            totalVolumeUSD: "325000000000",
            txCount: "12500000"
          }
        }
      };
      
    default:
      // Generic response for unknown GraphQL queries
      return {
        data: {}
      };
  }
}

// Get a mock response based on URL pattern
export function getMockResponseForUrl(url: string, requestBody?: string | null) {
  console.log(`Intercepting URL for IPFS deployment: ${url}`);
  
  // GraphQL endpoints
  if (
    url.includes('graphql') || 
    url.includes('graph.uniswap.org') || 
    url.includes('api.thegraph.com') ||
    url.includes('data.uniswap.org')
  ) {
    console.log(`Mocking GraphQL response for: ${url}`);
    return createMockResponse(getMockGraphQLResponse(requestBody || ''));
  }
  
  // Token lists
  if (
    url.includes('tokens') || 
    url.includes('tokenlist') || 
    url.includes('cloudflare-ipfs') ||
    url.includes('ipfs/Qm')
  ) {
    console.log(`Returning mock token list for: ${url}`);
    return createMockResponse(getMockTokenList());
  }
  
  // Analytics services - return empty successful responses
  if (url.includes('statsig')) {
    console.log(`Mocking statsig response for: ${url}`);
    if (url.includes('initialize')) {
      return createMockResponse({
        "feature_gates": {},
        "dynamic_configs": {},
        "layer_configs": {},
        "time": Date.now(),
        "has_updates": false,
        "evaluated_keys": {},
        "sticky_experiments": {}
      });
    }
    return createMockResponse({ success: true });
  }
  
  if (url.includes('amplitude') || url.includes('statsigapi.net')) {
    console.log(`Mocking analytics response for: ${url}`);
    return createMockResponse({ success: true, data: {} });
  }
  
  // Uniswap API/Gateway requests
  if (url.includes('gateway.uniswap.org') || url.includes('api.uniswap.org')) {
    console.log(`Mocking Uniswap API response for: ${url}`);
    
    if (url.includes('quote')) {
      return createMockResponse({
        error: {
          data: {
            errorCode: "NO_ROUTE",
            detail: "No quotes available on IPFS deployment"
          }
        }
      }, 200);
    }
    
    // Generic success response for other API calls
    return createMockResponse({ status: "success", message: "Mocked for IPFS deployment" });
  }
  
  // Default mock for unknown URLs
  console.log(`Using default mock for: ${url}`);
  return createMockResponse({ ipfsDeployment: true, mockData: true });
} 