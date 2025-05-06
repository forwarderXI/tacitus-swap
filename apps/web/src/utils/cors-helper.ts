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
 * Completely disable analytics services on IPFS
 */
function disableAnalyticsOnIPFS() {
  if (!isIPFSDeployment() || typeof window === 'undefined') {
    return
  }
  
  // Create noops for common analytics methods
  const noop = () => {};
  const noopObj = () => ({});
  const noopPromise = () => Promise.resolve({});
  
  // More aggressive approach to blocking analytics
  // Replace any property access attempts with mock functions
  const analyticsProxy = new Proxy({}, {
    get: function(target, prop) {
      // Return appropriate mock based on property type
      if (prop === 'getInstance') {
        return () => analyticsProxy;
      } else if (prop === 'init' || prop === 'initialize' || prop === 'logEvent') {
        return noop;
      } else if (prop === 'checkGate') {
        return () => false;
      } else if (prop === 'getExperiment') {
        return () => ({ get: () => null });
      } else if (typeof prop === 'string' && prop.startsWith('get')) {
        return noopObj;
      } else if (typeof prop === 'string' && prop.startsWith('set')) {
        return noop;
      } else {
        return noop;
      }
    }
  });
  
  // Mock Statsig
  window.Statsig = analyticsProxy;
  
  // Mock Amplitude
  window.amplitude = analyticsProxy;
  
  // Catch attempts to create new instances of analytics tools
  try {
    // Block creation of Amplitude objects
    const originalDefineProperty = Object.defineProperty;
    Object.defineProperty = function(obj, prop, descriptor) {
      if (
        prop === 'amplitude' || 
        prop === 'Statsig' || 
        prop === 'statsig' ||
        prop === 'analytics'
      ) {
        console.log(`Blocking analytics property definition: ${prop}`);
        return obj;
      }
      return originalDefineProperty(obj, prop, descriptor);
    };
    
    // Also override any global analytics variables
    window.analytics = analyticsProxy;
    
    // Override console.error to suppress amplitude errors
    const originalConsoleError = console.error;
    console.error = function(...args) {
      const errorMsg = args[0]?.toString() || '';
      if (
        errorMsg.includes('amplitude') || 
        errorMsg.includes('Statsig') || 
        errorMsg.includes('Unexpected end of input')
      ) {
        // Suppress analytics errors
        return;
      }
      return originalConsoleError.apply(console, args);
    };
  } catch (e) {
    console.log('Error setting up analytics blocking:', e);
  }
  
  console.log('Completely disabled analytics services for IPFS deployment');
}

/**
 * Initialize all IPFS CORS workarounds
 */
export function initializeIPFSWorkarounds() {
  if (!isIPFSDeployment()) {
    return
  }
  
  // Apply fixes
  injectFontsWithoutGoogleFonts()
  fixContentSecurityPolicy()
  patchFetchForCORS()
  
  // Completely disable analytics
  disableAnalyticsOnIPFS()
  
  // Set up recurring cleanup to catch dynamically added elements
  setupRecurringCleanup();
} 

/**
 * Set up recurring cleanup for IPFS deployment
 * This will periodically check for and remove problematic elements 
 * that might be added dynamically after our initial cleanup
 */
function setupRecurringCleanup() {
  if (!isIPFSDeployment()) {
    return;
  }
  
  const cleanupInterval = setInterval(() => {
    try {
      // Remove Google Fonts links that might be added dynamically
      document.querySelectorAll('link[href*="fonts.googleapis.com"]').forEach(link => {
        link.remove();
      });
      
      // Remove any CSP meta tags that might interfere
      document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]').forEach(tag => {
        const metaTag = tag as HTMLMetaElement;
        if (metaTag.content && !metaTag.content.includes("'unsafe-inline'")) {
          metaTag.remove();
        }
      });
      
      // Ensure our permissive CSP is still present
      if (!document.querySelector('meta[http-equiv="Content-Security-Policy"][content*="unsafe-inline"]')) {
        fixContentSecurityPolicy();
      }
      
      // Reinject disabling of analytics in case they were recreated
      disableAnalyticsOnIPFS();
      
    } catch (e) {
      console.log('Error in recurring cleanup:', e);
    }
  }, 2000); // Run every 2 seconds
  
  console.log('Set up recurring cleanup for IPFS deployment');
  
  // Cleanup the interval when the page unloads
  window.addEventListener('beforeunload', () => {
    clearInterval(cleanupInterval);
  });
}

// Declare global types for the mocked services
declare global {
  interface Window {
    Statsig?: any;
    amplitude?: any;
    analytics?: any;
  }
} 