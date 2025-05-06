#!/bin/bash
set -eo pipefail

# Debug info
echo "Current directory: $(pwd)"
echo "Node version: $(node -v)"

# Set environment variables
export NODE_OPTIONS="--max-old-space-size=4096"
export NODE_VERSION="18.0.0"
export YARN_VERSION="1.22.19"
export PATH="$HOME/.volta/bin:$PATH"

# Check if Yarn is installed
if ! command -v yarn &> /dev/null; then
    echo "⚠️ Yarn is not installed. Installing Yarn..."
    npm install -g yarn
fi

# Configure Yarn to avoid caching issues
yarn config set network-timeout 300000
yarn config set cache-folder .yarn-cache

# Clean up any previous build artifacts
rm -rf dist

# Change to the web app directory
cd apps/web || exit 1
echo "📁 Changed directory to $(pwd)"

# Install dependencies
echo "📦 Installing dependencies..."
yarn install

# Build the application
echo "🏗️ Building the application..."
yarn build

# Create dist directory at root level for IPFS deployment
cd ../.. || exit 1
mkdir -p dist
echo "📁 Created dist directory at $(pwd)/dist"

# Check if build was successful
if [ -d "apps/web/build" ]; then
    echo "✅ Build successful, copying files to dist directory"
    
    # Copy build files to dist directory
    cp -r apps/web/build/* dist/
    
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
    echo "⚠️ Build failed, creating minimal content for IPFS"
    
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
    
    echo "✅ Created minimal index.html in dist directory"
fi

echo "📊 Directory structure of dist:"
find dist -type f | sort

echo "📏 Size of dist directory:"
du -sh dist

echo "✅ Done" 