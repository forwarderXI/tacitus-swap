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
    window.location.hostname.endsWith('.eth')
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
  meta.content = "default-src 'self'; connect-src *; img-src * data:; media-src * data:; font-src * data:; style-src 'self' 'unsafe-inline' *; script-src 'self' 'unsafe-inline' 'unsafe-eval';"
  document.head.appendChild(meta)
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
} 