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
    'interface.gateway.uniswap.org'
  ];
  
  // Check if URL matches any of the patterns
  return patternsToMock.some(pattern => url.includes(pattern));
}

// Get a mock response based on URL pattern
export function getMockResponseForUrl(url: string) {
  console.log(`Intercepting URL for IPFS deployment: ${url}`);
  
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