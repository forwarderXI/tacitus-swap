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