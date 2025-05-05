/**
 * Utility functions to help with CORS issues on IPFS deployments
 */

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
  console.log('IPFS deployment detected. Applying CORS workarounds...')

  // Create a meta tag to modify CSP for IPFS deployments
  const meta = document.createElement('meta')
  meta.httpEquiv = 'Content-Security-Policy'
  meta.content = "default-src 'self'; connect-src * 'self' data: blob: https://beta.gateway.uniswap.org; img-src * data: blob:; media-src * data:; font-src * data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; script-src 'self' 'unsafe-inline' 'unsafe-eval';"
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
    
    // Check if this is a Uniswap API or gateway request
    if (typeof url === 'string' && (
      url.includes('gateway.uniswap.org') || 
      url.includes('api.uniswap.org') ||
      url.includes('beta.gateway.uniswap.org')
    )) {
      // For Uniswap API requests, use no-cors mode
      const newInit = { ...init, mode: 'no-cors' };
      console.log(`IPFS CORS workaround: Setting no-cors mode for request to ${url}`);
      return originalFetch(input, newInit);
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
} 