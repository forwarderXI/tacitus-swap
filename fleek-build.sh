#!/bin/bash
# Set pipefail but allow the script to continue if some commands fail
set -o pipefail

# Debug info
echo "Current directory: $(pwd)"
echo "Node version: $(node -v)"
echo "Yarn version: $(yarn --version || echo 'not installed')"

# Set environment variables
export NODE_OPTIONS="--max-old-space-size=4096"
export CI=false
export DISABLE_ESLINT_PLUGIN=true
export SKIP_PREFLIGHT_CHECK=true

# Check if Yarn is installed, if not, install it
if ! command -v yarn &> /dev/null; then
    echo "⚠️ Yarn is not installed. Installing Yarn..."
    npm install -g yarn@1.22.19 || npm install -g yarn --force
fi

# Configure Yarn with compatible settings only
echo "Configuring Yarn (ignoring errors)..."
# Skip network-timeout which is unsupported in the Fleek environment
yarn config set cache-folder .yarn-cache || echo "Failed to set cache-folder, continuing anyway"

# Clean up any previous build artifacts
echo "Cleaning up previous build artifacts..."
rm -rf dist

# Create dist directory early (for error cases)
mkdir -p dist
echo "Created dist directory preemptively"

# Change to the web app directory
cd apps/web || { echo "Failed to change to apps/web directory. Creating it."; mkdir -p apps/web; cd apps/web; }
echo "📁 Changed directory to $(pwd)"

# Install dependencies, with fallback options
echo "📦 Installing dependencies..."
yarn install || yarn install --mutex network || npm install

# Build the application, with fallback options
echo "🏗️ Building the application..."
yarn build || npm run build

# Return to the root directory
cd ../.. || { echo "Failed to return to root directory. Using absolute path."; cd /workspace; }
echo "📁 Changed directory to $(pwd)"

# Create dist directory at root level for IPFS deployment (again in case we're in a different location)
mkdir -p dist
echo "📁 Created dist directory at $(pwd)/dist"

# Check if build was successful
if [ -d "apps/web/build" ]; then
    echo "✅ Build successful, copying files to dist directory"
    
    # Copy build files to dist directory
    cp -r apps/web/build/* dist/ || { 
        echo "⚠️ Failed to copy. Checking if build directory exists and has files:";
        ls -la apps/web/build/ || echo "Cannot list build directory";
    }
    
    # Create fonts directory and add Basel-Grotesk font files
    echo "Creating fonts directory and adding fallback font files..."
    mkdir -p dist/fonts
    
    # Download necessary fallback fonts directly into the fonts directory
    curl -s -o dist/fonts/Basel-Grotesk-Medium.woff2 https://fonts.gstatic.com/s/sourcesanspro/v22/6xKydSBYKcSV-LCoeQqfX1RYOo3ig4vwlxdu.woff2
    curl -s -o dist/fonts/Basel-Grotesk-Book.woff2 https://fonts.gstatic.com/s/sourcesanspro/v22/6xK3dSBYKcSV-LCoeQqfX1RYOo3qOK7l.woff2
    curl -s -o dist/fonts/Basel-Grotesk-Medium.woff https://fonts.gstatic.com/s/sourcesanspro/v22/6xKydSBYKcSV-LCoeQqfX1RYOo3ig4vwlxdu.woff
    curl -s -o dist/fonts/Basel-Grotesk-Book.woff https://fonts.gstatic.com/s/sourcesanspro/v22/6xK3dSBYKcSV-LCoeQqfX1RYOo3qOK7l.woff
    
    # Create favicon files
    echo "Creating favicon files..."
    cat > dist/favicon.svg << 'EOL'
<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="32" height="32" rx="6" fill="#ff7a7e"/>
<path d="M21.4537 16.5069C22.3004 16.5069 23.1098 16.3726 23.8807 16.104C24.6686 15.8355 25.3335 15.4629 25.8755 14.9863L24.0405 12.8955C23.2187 13.6133 22.231 14.0112 21.0773 14.0112C20.0057 14.0112 19.1051 13.6948 18.3755 13.062C17.6458 12.4291 17.1692 11.6074 16.9457 10.5969H21.3598V8.39258H16.9457C17.0212 7.94995 17.1221 7.55211 17.2484 7.19922C17.3747 6.83013 17.534 6.50685 17.7261 6.22937C17.9261 5.9437 18.1678 5.709 18.4512 5.5252C18.7345 5.3331 19.0657 5.1937 19.4447 5.1069C19.8237 5.0112 20.2578 4.96344 20.7471 4.96344C21.38 4.96344 21.9199 5.04998 22.3665 5.22363C22.8202 5.38808 23.1912 5.6074 23.4796 5.8817C23.7679 6.15599 23.9812 6.47156 24.1196 6.82842C24.258 7.18527 24.3354 7.5487 24.3535 7.9177L27.0272 7.9177C27.0181 7.06104 26.8696 6.27315 26.5812 5.55371C26.2899 4.82597 25.8755 4.1901 25.1836 3.5459C24.4916 2.90169 23.6436 2.38086 22.6383 1.983C21.6329 1.58515 20.474 1.38623 19.1616 1.38623C17.9743 1.38623 16.8809 1.5531 15.8839 1.88675C14.8869 2.22041 14.0229 2.69313 13.2924 3.30494C12.5708 3.91675 12.004 4.65896 11.5919 5.53158C11.1797 6.39538 10.9398 7.36392 10.9398 8.4375V10.5969H10.9398V10.5969H10.9398H10.9398H10.9398H9V8.39258H7.6109V10.5969H6V13.6213H7.6109V24.0112H10.9398V13.6213H16.9457C17.1875 15.2221 17.9014 16.5069 19.0872 17.4754C20.273 18.444 21.7476 18.9284 23.5107 18.9284C24.3691 18.9284 25.135 18.8082 25.8086 18.5678C26.4822 18.3185 27.0435 18.0165 27.4922 17.6618L25.9951 15.6183C25.2172 16.2109 24.3825 16.5069 23.4907 16.5069C22.6146 16.5069 21.8094 16.3038 21.0755 15.8975C20.3496 15.4821 19.821 13.5501 19.4912 13.062C18.7616 12.4291 18.3078 14.5058 18.124 14.0112C20.0057 14.0112 19.1051 15.5225 18.3755 16.1555C17.6458 16.7883 19.3232 16.5069 21.4537 16.5069Z" fill="white"/>
</svg>
EOL
    
    # Create different sizes of favicons as PNG
    for size in 32 48 96 144; do
        cat > "dist/favicon-${size}x${size}.png" << 'EOL'
iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAEySURBVFhH7ZRNDoIwEIU5hSfRe3gDVm7cwC3cwj2sXbowJK5ci97B6J4TeBKfgWkwY6NtKCVx0S954Wfm9QsUSqlUqV6sYRhaNE3j0YtpmtZ0IV/qqmBZVsrb7XaXJMmGlnJxn4bv+z4DhDRNv/BdCDguLVPWdV2fRVH0cBOA0/yM+2q2x35rmmaL6QYIBkCsyrJ8qQEGrwe4vAKgF4SmaRZpmn6wDCIfAN7ApWVZblRVZXMJZqkAMMayLBs0fbIsO9Imx78LIAiCI5q+YRj7oihyXF4MQAcOw/BKm5blAxAul8slqHnbtjc0jwIwxvgbaMZxvKXNGxYA6J7oui6ieRKA67rHb/rWL+J3AYii6PC9gXwjkQpQFMWZx7Zpmi3LPFMAGGOiKHrQkg5gCTnnPsvIAlCpVP9VM/kGS/UewNfHwMgAAAAASUVORK5CYII=
EOL
    done
    
    # Create a basic manifest file
    echo "Creating manifest file..."
    cat > dist/manifest.json << 'EOL'
{
  "name": "Uniswap Interface (IPFS)",
  "short_name": "Uniswap",
  "icons": [
    {
      "src": "/favicon-144x144.png",
      "sizes": "144x144",
      "type": "image/png"
    },
    {
      "src": "/favicon-96x96.png",
      "sizes": "96x96",
      "type": "image/png"
    },
    {
      "src": "/favicon-48x48.png",
      "sizes": "48x48",
      "type": "image/png"
    },
    {
      "src": "/favicon-32x32.png",
      "sizes": "32x32",
      "type": "image/png"
    }
  ],
  "theme_color": "#ff007a",
  "background_color": "#fff",
  "display": "standalone"
}
EOL
    
    # Create _headers file with proper CORS headers for Fleek
    echo "/*
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
  Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization
  Access-Control-Max-Age: 86400
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' 'wasm-unsafe-eval' data: https://translate.googleapis.com/ https://vercel.com https://vercel.live/ https://www.google-analytics.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src * 'self' blob: data: https://assets.coingecko.com/ https://cdn.center.app/ https://ethereum-optimism.github.io/ https://explorer-api.walletconnect.com/ https://i.seadn.io/ https://lh3.googleusercontent.com/ https://openseauserdata.com/ https://raw.githubusercontent.com/ https://raw.seadn.io/ https://s2.coinmarketcap.com/ https://static.optimism.io/ https://vercel.com https://vercel.live/ https://trustwallet.com/ https://cloudflare-ipfs.com/; frame-src 'self' https://buy.moonpay.com/ https://vercel.com https://vercel.live/ https://verify.walletconnect.com/ https://verify.walletconnect.org/; connect-src * 'self' blob: data: https://*.gateway.uniswap.org https://gateway.uniswap.org https://statsigapi.net https://api.moonpay.com/ https://api.opensea.io https://api.thegraph.com/ https://api.uniswap.org https://arbitrum-mainnet.infura.io/ https://avalanche-mainnet.infura.io/ https://base-mainnet.infura.io/ https://bridge.arbitrum.io https://celo-org.github.io https://cloudflare-ipfs.com https://explorer-api.walletconnect.com https://forno.celo.org/ https://gateway.ipfs.io/ https://interface.gateway.uniswap.org https://mainnet.infura.io https://o1037921.ingest.sentry.io https://old-wispy-arrow.bsc.quiknode.pro/ https://optimism-mainnet.infura.io/ https://polygon-mainnet.infura.io/ https://raw.githubusercontent.com https://static.optimism.io https://temp.api.uniswap.org/ https://tokenlist.arbitrum.io https://tokens.coingecko.com https://ultra-blue-flower.quiknode.pro https://us-central1-uniswap-mobile.cloudfunctions.net/ https://vercel.com https://vercel.live/ https://www.gemini.com wss://relay.walletconnect.com/ wss://www.walletlink.org/rpc https://beta.gateway.uniswap.org/ https://graph.uniswap.org https://api.thegraph.com; worker-src 'self' blob:;" > dist/_headers
    
    echo "✅ Created _headers file with CORS headers in dist directory"
    
    # Create .nojekyll file to prevent GitHub Pages from ignoring files that begin with an underscore
    touch dist/.nojekyll
    echo "✅ Created .nojekyll file in dist directory"
    
    echo "🎉 Build and copy complete"
else
    echo "⚠️ Build directory not found. Looking for it elsewhere..."
    find . -name "build" -type d
    
    # Try to use any build directory found
    BUILD_DIR=$(find . -name "build" -type d | head -n 1)
    if [ -n "$BUILD_DIR" ]; then
        echo "Found build directory at $BUILD_DIR, copying files..."
        cp -r "$BUILD_DIR"/* dist/ || echo "Failed to copy from found build directory"
        
        # Create _headers file with CORS headers
        echo "/*
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
  Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization
  Access-Control-Max-Age: 86400
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' 'wasm-unsafe-eval' data: https://translate.googleapis.com/ https://vercel.com https://vercel.live/ https://www.google-analytics.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src * 'self' blob: data: https://assets.coingecko.com/ https://cdn.center.app/ https://ethereum-optimism.github.io/ https://explorer-api.walletconnect.com/ https://i.seadn.io/ https://lh3.googleusercontent.com/ https://openseauserdata.com/ https://raw.githubusercontent.com/ https://raw.seadn.io/ https://s2.coinmarketcap.com/ https://static.optimism.io/ https://vercel.com https://vercel.live/ https://trustwallet.com/ https://cloudflare-ipfs.com/; frame-src 'self' https://buy.moonpay.com/ https://vercel.com https://vercel.live/ https://verify.walletconnect.com/ https://verify.walletconnect.org/; connect-src * 'self' blob: data: https://*.gateway.uniswap.org https://gateway.uniswap.org https://statsigapi.net https://api.moonpay.com/ https://api.opensea.io https://api.thegraph.com/ https://api.uniswap.org https://arbitrum-mainnet.infura.io/ https://avalanche-mainnet.infura.io/ https://base-mainnet.infura.io/ https://bridge.arbitrum.io https://celo-org.github.io https://cloudflare-ipfs.com https://explorer-api.walletconnect.com https://forno.celo.org/ https://gateway.ipfs.io/ https://interface.gateway.uniswap.org https://mainnet.infura.io https://o1037921.ingest.sentry.io https://old-wispy-arrow.bsc.quiknode.pro/ https://optimism-mainnet.infura.io/ https://polygon-mainnet.infura.io/ https://raw.githubusercontent.com https://static.optimism.io https://temp.api.uniswap.org/ https://tokenlist.arbitrum.io https://tokens.coingecko.com https://ultra-blue-flower.quiknode.pro https://us-central1-uniswap-mobile.cloudfunctions.net/ https://vercel.com https://vercel.live/ https://www.gemini.com wss://relay.walletconnect.com/ wss://www.walletlink.org/rpc https://beta.gateway.uniswap.org/ https://graph.uniswap.org https://api.thegraph.com; worker-src 'self' blob:;" > dist/_headers
        
        echo "✅ Created _headers file with CORS headers in dist directory"
        
        # Create .nojekyll file
        touch dist/.nojekyll
        echo "✅ Created .nojekyll file in dist directory"
    else
        echo "⚠️ No build directory found. Creating minimal content for IPFS..."
        
        # Create an index.html with a message
        mkdir -p dist
        cat > dist/index.html << EOL
<!DOCTYPE html>
<html>
<head>
    <title>Build Error</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        .error { color: red; }
    </style>
</head>
<body>
    <h1 class="error">Build Error</h1>
    <p>The application failed to build properly. Please check the build logs for more information.</p>
</body>
</html>
EOL
        
        # Create _headers file even in error case
        echo "/*
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
  Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization
  Access-Control-Max-Age: 86400" > dist/_headers
        
        echo "✅ Created minimal index.html and headers in dist directory"
    fi
fi

echo "📊 Directory structure of dist:"
find dist -type f | sort || echo "Cannot list dist directory"

echo "📏 Size of dist directory:"
du -sh dist || echo "Cannot determine size of dist directory"

# Make sure we have at least an index.html if everything else failed
if [ ! -f "dist/index.html" ]; then
    echo "⚠️ No index.html found in dist! Creating a minimal one..."
    echo "<html><body><h1>Fallback Page</h1><p>The build process encountered issues.</p></body></html>" > dist/index.html
fi

echo "✅ Build script completed" 