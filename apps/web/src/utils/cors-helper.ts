/**
 * Utility functions to help with CORS issues on IPFS deployments
 */

import { getMockResponseForUrl, shouldUseMockResponse } from './ipfs-fallbacks'

/**
 * Check if the app is running on IPFS/Fleek
 */
export function isIPFSDeployment(): boolean {
  return typeof window !== 'undefined' && (
    window.location.hostname.includes('.eth.limo') || 
    window.location.hostname.includes('.ipfs.') ||
    window.location.hostname.endsWith('.eth') ||
    window.location.hostname.includes('.on-fleek.app') ||
    window.location.hostname.includes('.fleek.co')
  )
}

/**
 * Injects the Space Grotesk font without using Google Fonts (avoids CSP issues)
 */
export function injectFontsWithoutGoogleFonts() {
  if (!isIPFSDeployment() || document.getElementById('ipfs-font-style')) {
    return
  }
  
  // Create style element
  const style = document.createElement('style')
  style.id = 'ipfs-font-style'
  style.textContent = `
    /* Space Grotesk font */
    @font-face {
      font-family: 'Space Grotesk';
      font-style: normal;
      font-weight: 300;
      src: url('https://fonts.gstatic.com/s/spacegrotesk/v15/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-gOoraIAEj7oUXskPMBBSSJLm2E.woff2') format('woff2');
    }
    @font-face {
      font-family: 'Space Grotesk';
      font-style: normal;
      font-weight: 400;
      src: url('https://fonts.gstatic.com/s/spacegrotesk/v15/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-gOoraIAEj7oUXskPMBBSSJLm2E.woff2') format('woff2');
    }
    @font-face {
      font-family: 'Space Grotesk';
      font-style: normal;
      font-weight: 500;
      src: url('https://fonts.gstatic.com/s/spacegrotesk/v15/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-gOoraIAEj7oUXskPMBBSSJLm2E.woff2') format('woff2');
    }
    @font-face {
      font-family: 'Space Grotesk';
      font-style: normal;
      font-weight: 600;
      src: url('https://fonts.gstatic.com/s/spacegrotesk/v15/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-gOoraIAEj7oUXskPMBBSSJLm2E.woff2') format('woff2');
    }
    @font-face {
      font-family: 'Space Grotesk';
      font-style: normal;
      font-weight: 700;
      src: url('https://fonts.gstatic.com/s/spacegrotesk/v15/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-gOoraIAEj7oUXskPMBBSSJLm2E.woff2') format('woff2');
    }
  `
  document.head.appendChild(style)
}

/**
 * Fix Content Security Policy for IPFS deployment
 */
export function fixContentSecurityPolicy() {
  if (!isIPFSDeployment()) {
    return
  }
  
  // Log IPFS deployment detected
  console.log('IPFS deployment detected, applying most aggressive fixes...')

  // Remove existing CSP meta tags to avoid conflicts
  document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]').forEach(tag => {
    console.log('Removing conflicting CSP tag:', tag.outerHTML)
    tag.remove()
  })

  // Remove Google Fonts links to avoid CORS issues
  document.querySelectorAll('link[href*="fonts.googleapis.com"]').forEach(link => {
    console.log('Removing Google Fonts link:', link.outerHTML)
    link.remove()
  })

  // Create a meta tag with completely permissive CSP for IPFS deployments
  const meta = document.createElement('meta')
  meta.httpEquiv = 'Content-Security-Policy'
  meta.content = "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;"
  document.head.appendChild(meta)
}

/**
 * Patch global fetch to handle CORS for IPFS deployments
 */
export function patchFetchForCORS() {
  if (!isIPFSDeployment() || typeof window === 'undefined' || !window.fetch) {
    return
  }
  
  const originalFetch = window.fetch;
  
  // Replace the global fetch with our patched version
  window.fetch = function(input, init) {
    // Get the URL from the input
    let url = input;
    if (input instanceof Request) {
      url = input.url;
    }
    
    if (typeof url === 'string') {
      // Check if this is a URL that should return mock data on IPFS
      if (shouldUseMockResponse(url)) {
        return getMockResponseForUrl(url);
      }
      
      // For Uniswap API requests, add proper headers
      if (url.includes('gateway.uniswap.org') || url.includes('api.uniswap.org')) {
        const headers = new Headers(init?.headers || {});
        headers.set('Origin', 'https://app.uniswap.org');
        headers.set('Referer', 'https://app.uniswap.org/');
        
        const newInit = { 
          ...init, 
          mode: 'no-cors' as RequestMode,
          headers 
        };
        return originalFetch(input, newInit);
      }
    }
    
    // For all other requests, use the original fetch
    return originalFetch(input, init);
  };
  
  console.log('Patched global fetch for CORS workarounds');
}

/**
 * Initialize all IPFS CORS workarounds
 */
export function initializeIPFSWorkarounds() {
  if (!isIPFSDeployment()) {
    return
  }
  
  injectFontsWithoutGoogleFonts()
  fixContentSecurityPolicy()
  patchFetchForCORS()
  
  // Disable analytics services on IPFS
  disableAnalyticsOnIPFS()
} 

/**
 * Completely disable analytics services on IPFS
 */
function disableAnalyticsOnIPFS() {
  if (!isIPFSDeployment() || typeof window === 'undefined') {
    return
  }
  
  // Create noops for common analytics methods
  const noop = () => {};
  
  // Mock Statsig
  if (!window.Statsig) {
    window.Statsig = {
      initialize: noop,
      logEvent: noop,
      checkGate: () => false,
      getExperiment: () => ({ get: () => null }),
    };
  }
  
  // Mock Amplitude
  if (!window.amplitude) {
    window.amplitude = {
      getInstance: () => ({
        init: noop,
        logEvent: noop,
        setUserId: noop,
      }),
    };
  }
  
  console.log('Disabled analytics services for IPFS deployment');
}

// Declare global types for the mocked services
declare global {
  interface Window {
    Statsig?: any;
    amplitude?: any;
  }
} 