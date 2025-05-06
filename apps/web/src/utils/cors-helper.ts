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
    
    /* Basel-Grotesk font fallbacks */
    @font-face {
      font-family: 'Basel-Grotesk';
      font-style: normal;
      font-weight: 400;
      src: url('https://fonts.gstatic.com/s/sourcesanspro/v22/6xK3dSBYKcSV-LCoeQqfX1RYOo3qOK7l.woff2') format('woff2');
    }
    @font-face {
      font-family: 'Basel-Grotesk';
      font-style: normal;
      font-weight: 500;
      src: url('https://fonts.gstatic.com/s/sourcesanspro/v22/6xKydSBYKcSV-LCoeQqfX1RYOo3ig4vwlxdu.woff2') format('woff2');
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
 * Create missing favicon and manifest files
 */
export function createMissingAssets() {
  if (!isIPFSDeployment()) {
    return
  }
  
  // Fix favicon issues
  const createFallbackFavicon = () => {
    const link = document.createElement('link')
    link.rel = 'icon'
    link.type = 'image/svg+xml'
    link.href = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHJ4PSI2IiBmaWxsPSIjZmY3YTdlIi8+PHBhdGggZD0iTTIxLjQ1MzcgMTYuNTA2OUMyMi4zMDA0IDE2LjUwNjkgMjMuMTA5OCAxNi4zNzI2IDIzLjg4MDcgMTYuMTA0QzI0LjY2ODYgMTUuODM1NSAyNS4zMzM1IDE1LjQ2MjkgMjUuODc1NSAxNC45ODYzTDI0LjA0MDUgMTIuODk1NUMyMy4yMTg3IDEzLjYxMzMgMjIuMjMxIDE0LjAxMTIgMjEuMDc3MyAxNC4wMTEyQzIwLjAwNTcgMTQuMDExMiAxOS4xMDUxIDEzLjY5NDggMTguMzc1NSAxMy4wNjJDMTcuNjQ1OCAxMi40MjkxIDE3LjE2OTIgMTEuNjA3NCAxNi45NDU3IDEwLjU5NjlIMjEuMzU5OFY4LjM5MjU4SDE2Ljk0NTdDMTcuMDIxMiA3Ljk0OTk1IDE3LjEyMjEgNy41NTIxMSAxNy4yNDg0IDcuMTk5MjJDMTcuMzc0NyA2LjgzMDEzIDE3LjUzNCA2LjUwNjg1IDE3LjcyNjEgNi4yMjkzN0MxNy45MjYxIDUuOTQzNyAxOC4xNjc4IDUuNzA5IDE4LjQ1MTIgNS41MjUyQzE4LjczNDUgNS4zMzMxIDE5LjA2NTcgNS4xOTM3IDE5LjQ0NDcgNS4xMDY5QzE5LjgyMzcgNS4wMTEyIDIwLjI1NzggNC45NjM0NCAyMC43NDcxIDQuOTYzNDRDMjEuMzggNC45NjM0NCAyMS45MTk5IDUuMDQ5OTggMjIuMzY2NSA1LjIyMzYzQzIyLjgyMDIgNS4zODgwOCAyMy4xOTEyIDUuNjA3NCAyMy40Nzk2IDUuODgxN0MyMy43Njc5IDYuMTU1OTkgMjMuOTgxMiA2LjQ3MTU2IDI0LjExOTYgNi44Mjg0MkMyNC4yNTggNy4xODUyNyAyNC4zMzU0IDcuNTQ4NyAyNC4zNTM1IDcuOTE3N0wyNy4wMjcyIDcuOTE3N0MyNy4wMTgxIDcuMDYxMDQgMjYuODY5NiA2LjI3MzE1IDI2LjU4MTIgNS41NTM3MUMyNi4yODk5IDQuODI1OTcgMjUuODc1NSA0LjE5MDEgMjUuMTgzNiAzLjU0NTlDMjQuNDkxNiAyLjkwMTY5IDIzLjY0MzYgMi4zODA4NiAyMi42MzgzIDEuOTgzQzIxLjYzMjkgMS41ODUxNSAyMC40NzQgMS4zODYyMyAxOS4xNjE2IDEuMzg2MjNDMTcuOTc0MyAxLjM4NjIzIDE2Ljg4MDkgMS41NTMxIDE1Ljg4MzkgMS44ODY3NUMxNC44ODY5IDIuMjIwNDEgMTQuMDIyOSAyLjY5MzEzIDEzLjI5MjQgMy4zMDQ5NEMxMi41NzA4IDMuOTE2NzUgMTIuMDA0IDQuNjU4OTYgMTEuNTkxOSA1LjUzMTU4QzExLjE3OTcgNi4zOTUzOCAxMC45Mzk4IDcuMzYzOTIgMTAuOTM5OCA4LjQzNzVWMTAuNTk2OUgxMC45Mzk4VjEwLjU5NjlIMTAuOTM5OEgxMC45Mzk4SDEwLjkzOThIOVY4LjM5MjU4SDcuNjEwOVYxMC41OTY5SDZ2My4wMjQ0SDcuNjEwOVYyNC4wMTEySDEwLjkzOThWMTMuNjIxM0gxNi45NDU3QzE3LjE4NzUgMTUuMjIyMSAxNy45MDE0IDE2LjUwNjkgMTkuMDg3MiAxNy40NzU0QzIwLjI3MyAxOC40NDQgMjEuNzQ3NiAxOC45Mjg0IDIzLjUxMDcgMTguOTI4NEMyNC4zNjkxIDE4LjkyODQgMjUuMTM1IDE4LjgwODIgMjUuODA4NiAxOC41Njc4QzI2LjQ4MjIgMTguMzE4NSAyNy4wNDM1IDE4LjAxNjUgMjcuNDkyMiAxNy42NjE4TDI1Ljk5NTEgMTUuNjE4M0MyNS4yMTcyIDE2LjIxMDkgMjQuMzgyNSAxNi41MDY5IDIzLjQ5MDcgMTYuNTA2OUMyMi42MTQ2IDE2LjUwNjkgMjEuODA5NCAxNi4zMDM4IDIxLjA3NTUgMTUuODk3NUMyMC4zNDk2IDE1LjQ4MjEgMTkuODIxIDEzLjU1MDEgMTkuNDkxMiAxMy4wNjJDMTguNzYxNiAxMi40MjkxIDE4LjMwNzggMTQuNTA1OCAxOC4xMjQgMTQuMDExMkMyMC4wMDU3IDE0LjAxMTIgMTkuMTA1MSAxNS41MjI1IDE4LjM3NTUgMTYuMTU1NUMxNy42NDU4IDE2Ljc4ODMgMTkuMzIzMiAxNi41MDY5IDIxLjQ1MzcgMTYuNTA2OVoiIGZpbGw9IndoaXRlIi8+PC9zdmc+'
    document.head.appendChild(link)
    console.log('Created fallback favicon using SVG data URL')
  }

  // Create a manifest file reference
  const createFallbackManifest = () => {
    const link = document.createElement('script')
    link.type = 'application/json'
    link.id = 'manifest-placeholder'
    link.textContent = JSON.stringify({
      "name": "Uniswap Interface (IPFS)",
      "short_name": "Uniswap",
      "icons": [
        {
          "src": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHJ4PSI2IiBmaWxsPSIjZmY3YTdlIi8+PHBhdGggZD0iTTIxLjQ1MzcgMTYuNTA2OUMyMi4zMDA0IDE2LjUwNjkgMjMuMTA5OCAxNi4zNzI2IDIzLjg4MDcgMTYuMTA0QzI0LjY2ODYgMTUuODM1NSAyNS4zMzM1IDE1LjQ2MjkgMjUuODc1NSAxNC45ODYzTDI0LjA0MDUgMTIuODk1NUMyMy4yMTg3IDEzLjYxMzMgMjIuMjMxIDE0LjAxMTIgMjEuMDc3MyAxNC4wMTEyQzIwLjAwNTcgMTQuMDExMiAxOS4xMDUxIDEzLjY5NDggMTguMzc1NSAxMy4wNjJDMTcuNjQ1OCAxMi40MjkxIDE3LjE2OTIgMTEuNjA3NCAxNi45NDU3IDEwLjU5NjlIMjEuMzU5OFY4LjM5MjU4SDE2Ljk0NTdDMTcuMDIxMiA3Ljk0OTk1IDE3LjEyMjEgNy41NTIxMSAxNy4yNDg0IDcuMTk5MjJDMTcuMzc0NyA2LjgzMDEzIDE3LjUzNCA2LjUwNjg1IDE3LjcyNjEgNi4yMjkzN0MxNy45MjYxIDUuOTQzNyAxOC4xNjc4IDUuNzA5IDE4LjQ1MTIgNS41MjUyQzE4LjczNDUgNS4zMzMxIDE5LjA2NTcgNS4xOTM3IDE5LjQ0NDcgNS4xMDY5QzE5LjgyMzcgNS4wMTEyIDIwLjI1NzggNC45NjM0NCAyMC43NDcxIDQuOTYzNDRDMjEuMzggNC45NjM0NCAyMS45MTk5IDUuMDQ5OTggMjIuMzY2NSA1LjIyMzYzQzIyLjgyMDIgNS4zODgwOCAyMy4xOTEyIDUuNjA3NCAyMy40Nzk2IDUuODgxN0MyMy43Njc5IDYuMTU1OTkgMjMuOTgxMiA2LjQ3MTU2IDI0LjExOTYgNi44Mjg0MkMyNC4yNTggNy4xODUyNyAyNC4zMzU0IDcuNTQ4NyAyNC4zNTM1IDcuOTE3N0wyNy4wMjcyIDcuOTE3N0MyNy4wMTgxIDcuMDYxMDQgMjYuODY5NiA2LjI3MzE1IDI2LjU4MTIgNS41NTM3MUMyNi4yODk5IDQuODI1OTcgMjUuODc1NSA0LjE5MDEgMjUuMTgzNiAzLjU0NTlDMjQuNDkxNiAyLjkwMTY5IDIzLjY0MzYgMi4zODA4NiAyMi42MzgzIDEuOTgzQzIxLjYzMjkgMS41ODUxNSAyMC40NzQgMS4zODYyMyAxOS4xNjE2IDEuMzg2MjNDMTcuOTc0MyAxLjM4NjIzIDE2Ljg4MDkgMS41NTMxIDE1Ljg4MzkgMS44ODY3NUMxNC44ODY5IDIuMjIwNDEgMTQuMDIyOSAyLjY5MzEzIDEzLjI5MjQgMy4zMDQ5NEMxMi41NzA4IDMuOTE2NzUgMTIuMDA0IDQuNjU4OTYgMTEuNTkxOSA1LjUzMTU4QzExLjE3OTcgNi4zOTUzOCAxMC45Mzk4IDcuMzYzOTIgMTAuOTM5OCA4LjQzNzVWMTAuNTk2OUgxMC45Mzk4VjEwLjU5NjlIMTAuOTM5OEgxMC45Mzk4SDEwLjkzOThIOVY4LjM5MjU4SDcuNjEwOVYxMC41OTY5SDZ2My4wMjQ0SDcuNjEwOVYyNC4wMTEySDEwLjkzOThWMTMuNjIxM0gxNi45NDU3QzE3LjE4NzUgMTUuMjIyMSAxNy45MDE0IDE2LjUwNjkgMTkuMDg3MiAxNy40NzU0QzIwLjI3MyAxOC40NDQgMjEuNzQ3NiAxOC45Mjg0IDIzLjUxMDcgMTguOTI4NEMyNC4zNjkxIDE4LjkyODQgMjUuMTM1IDE4LjgwODIgMjUuODA4NiAxOC41Njc4QzI2LjQ4MjIgMTguMzE4NSAyNy4wNDM1IDE4LjAxNjUgMjcuNDkyMiAxNy42NjE4TDI1Ljk5NTEgMTUuNjE4M0MyNS4yMTcyIDE2LjIxMDkgMjQuMzgyNSAxNi41MDY5IDIzLjQ5MDcgMTYuNTA2OUMyMi42MTQ2IDE2LjUwNjkgMjEuODA5NCAxNi4zMDM4IDIxLjA3NTUgMTUuODk3NUMyMC4zNDk2IDE1LjQ4MjEgMTkuODIxIDEzLjU1MDEgMTkuNDkxMiAxMy4wNjJDMTguNzYxNiAxMi40MjkxIDE4LjMwNzggMTQuNTA1OCAxOC4xMjQgMTQuMDExMkMyMC4wMDU3IDE0LjAxMTIgMTkuMTA1MSAxNS41MjI1IDE4LjM3NTUgMTYuMTU1NUMxNy42NDU4IDE2Ljc4ODMgMTkuMzIzMiAxNi41MDY5IDIxLjQ1MzcgMTYuNTA2OVoiIGZpbGw9IndoaXRlIi8+PC9zdmc+",
          "sizes": "32x32",
          "type": "image/svg+xml"
        }
      ],
      "theme_color": "#ff007a",
      "background_color": "#fff",
      "display": "standalone"
    })
    document.head.appendChild(link)
    console.log('Created fallback manifest data')
    
    // Fix manifest link
    const manifestLink = document.querySelector('link[rel="manifest"]') as HTMLLinkElement | null
    if (manifestLink) {
      manifestLink.href = 'data:application/json;base64,' + btoa(document.getElementById('manifest-placeholder')?.textContent || '')
      console.log('Updated manifest link to use inline data')
    } else {
      const newManifestLink = document.createElement('link')
      newManifestLink.rel = 'manifest'
      newManifestLink.href = 'data:application/json;base64,' + btoa(document.getElementById('manifest-placeholder')?.textContent || '')
      document.head.appendChild(newManifestLink)
      console.log('Added new manifest link with inline data')
    }
  }
  
  // Fix CSS MIME type issues
  const fixCssMimeType = () => {
    // Monitor any CSS links that fail to load
    document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
      const originalHref = (link as HTMLLinkElement).getAttribute('href')
      if (!originalHref) return
      
      // Create an error handler
      const handleLinkError = () => {
        console.log('CSS link failed to load due to MIME type issues:', originalHref)
        
        // Remove the original link element
        link.remove()
        
        // Create a new link element with the same href but use a different approach
        fetch(originalHref)
          .then(response => response.text())
          .then(cssContent => {
            // Create a style element instead of a link
            const style = document.createElement('style')
            style.textContent = cssContent
            document.head.appendChild(style)
            console.log('Successfully loaded CSS content as inline style')
          })
          .catch(error => {
            console.error('Failed to fetch CSS content:', error)
          })
      }
      
      // Add error event listener
      link.addEventListener('error', handleLinkError)
    })
    
    console.log('Set up CSS MIME type error handling')
  }
  
  // Execute all fixes
  createFallbackFavicon()
  createFallbackManifest()
  fixCssMimeType()
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
  window.fetch = async function(input, init) {
    // Get the URL from the input
    let url = input;
    if (input instanceof Request) {
      url = input.url;
    }
    
    if (typeof url === 'string') {
      // Check if this is a URL that should return mock data on IPFS
      if (shouldUseMockResponse(url)) {
        // For GraphQL endpoints, we need to extract the request body to determine what data to mock
        let requestBody = null;
        
        // Try to get the request body from init if it exists
        if (init?.body) {
          try {
            // If it's a string, use it directly, otherwise try to read it from the object
            if (typeof init.body === 'string') {
              requestBody = init.body;
            } else if (init.body instanceof FormData || init.body instanceof URLSearchParams) {
              // Skip for now, these aren't typically used for GraphQL
            } else if (init.body instanceof ReadableStream) {
              // Skip for now, these can only be read once
            } else {
              // Try to convert to string
              requestBody = JSON.stringify(init.body);
            }
          } catch (e) {
            console.log('Error extracting request body:', e);
          }
        }
        
        console.log(`Intercepting request with method: ${init?.method || 'GET'}`);
        return getMockResponseForUrl(url, requestBody);
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
  
  console.log('Patched global fetch for CORS workarounds with GraphQL support');
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
 * Set up recurring cleanup for Amplitude errors and other issues
 */
function setupRecurringCleanup() {
  if (!isIPFSDeployment() || typeof window === 'undefined') {
    return
  }
  
  // Process DOM regularly to fix any dynamically added elements
  const cleanupInterval = setInterval(() => {
    // Clean CSP tags that might have been added dynamically
    document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]').forEach(tag => {
      if (!tag.id || tag.id !== 'ipfs-permissive-csp') {
        console.log('Removing conflicting CSP tag:', tag.outerHTML)
        tag.remove()
      }
    })

    // Fix any dynamically added links to remote resources
    document.querySelectorAll('link[href^="http"]').forEach(link => {
      const href = link.getAttribute('href')
      if (href && href.includes('fonts.googleapis.com')) {
        console.log('Removing Google Fonts link:', link.outerHTML)
        link.remove()
      }
    })
    
    // Reset amplitude variables that might have been recreated
    if (window.amplitude && window.amplitude !== window.Statsig) {
      console.log('Resetting amplitude object that was recreated')
      window.amplitude = window.Statsig // both are the same analytics proxy
    }
  }, 2000)
  
  console.log('Set up recurring cleanup for IPFS deployment')
  
  return cleanupInterval
}

/**
 * Initialize all IPFS CORS workarounds
 */
export function initializeIPFSWorkarounds() {
  if (!isIPFSDeployment()) {
    return
  }
  
  // Safety check to avoid double initialization
  if (window.__IPFS_CORS_WORKAROUNDS_INITIALIZED__) {
    return;
  }
  
  window.__IPFS_CORS_WORKAROUNDS_INITIALIZED__ = true;
  
  // Apply all fixes
  console.log('IPFS deployment detected, applying fixes before app initialization...');
  fixContentSecurityPolicy();
  injectFontsWithoutGoogleFonts();
  createMissingAssets();
  patchFetchForCORS();
  disableAnalyticsOnIPFS();
  setupRecurringCleanup();
}

// Add to Window type
declare global {
  interface Window {
    Statsig?: any;
    amplitude?: any;
    analytics?: any;
    __IPFS_CORS_WORKAROUNDS_INITIALIZED__?: boolean;
  }
} 