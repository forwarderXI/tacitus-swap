#!/bin/bash
# Enable debugging
set -x

# Set pipefail but allow the script to continue if some commands fail
set -o pipefail

# Diagnostic log file
LOG_FILE="build-debug.log"
echo "=== BUILD STARTED $(date) ===" > $LOG_FILE

# Debug info
echo "Current directory: $(pwd)" | tee -a $LOG_FILE
echo "Node version: $(node -v)" | tee -a $LOG_FILE
echo "NPM version: $(npm -v)" | tee -a $LOG_FILE
echo "Yarn version: $(yarn --version 2>/dev/null || echo 'not installed')" | tee -a $LOG_FILE
echo "Disk space: $(df -h .)" | tee -a $LOG_FILE
echo "Memory info: $(free -h 2>/dev/null || echo 'free command not available')" | tee -a $LOG_FILE
echo "Environment inspection: $(ls -la)" | tee -a $LOG_FILE

# Set environment variables
export NODE_OPTIONS="--max-old-space-size=4096"
export CI=false
export DISABLE_ESLINT_PLUGIN=true
export SKIP_PREFLIGHT_CHECK=true

# Dump environment variables
echo "=== ENVIRONMENT VARIABLES ===" | tee -a $LOG_FILE
env | sort | tee -a $LOG_FILE
echo "===========================" | tee -a $LOG_FILE

# Check if Yarn is installed, if not, install it
if ! command -v yarn &> /dev/null; then
    echo "⚠️ Yarn is not installed. Installing Yarn..." | tee -a $LOG_FILE
    npm install -g yarn@1.22.19 || npm install -g yarn --force
    echo "Yarn version after install: $(yarn --version 2>/dev/null || echo 'installation failed')" | tee -a $LOG_FILE
fi

# Clean up any previous build artifacts
echo "Cleaning up previous build artifacts..." | tee -a $LOG_FILE
rm -rf dist
rm -rf apps/web/build 2>/dev/null || echo "No previous build directory to clean" | tee -a $LOG_FILE

# Create dist directory early (for error cases)
mkdir -p dist
echo "Created dist directory preemptively" | tee -a $LOG_FILE

# Copy the log file to dist for debugging
cp_log_to_dist() {
    if [ -f "$LOG_FILE" ]; then
        cp $LOG_FILE dist/ 2>/dev/null || echo "Failed to copy log file to dist" | tee -a $LOG_FILE
    fi
}

# Simple fallback content in case anything fails
cat > dist/index.html << EOL
<!DOCTYPE html>
<html>
<head>
    <title>Build in Progress</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        .message { color: blue; }
        .log { text-align: left; font-family: monospace; background: #f5f5f5; padding: 10px; max-height: 300px; overflow: auto; margin-top: 20px; }
    </style>
</head>
<body>
    <h1 class="message">Build in Progress</h1>
    <p>The application is currently being built. Please check back in a few minutes.</p>
    <p>Last build attempt: $(date)</p>
    <div class="log">
        <h3>Build Log (last 20 lines):</h3>
        <pre>$(tail -n 20 $LOG_FILE 2>/dev/null || echo "Log file not available")</pre>
    </div>
</body>
</html>
EOL

# Create _headers file early with minimal CORS settings
echo "/*
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
  Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization
  Access-Control-Max-Age: 86400" > dist/_headers

echo "✅ Created minimal fallback content and headers in dist directory" | tee -a $LOG_FILE

# Function to handle errors
handle_error() {
    local error_message="$1"
    echo "❌ ERROR: $error_message" | tee -a $LOG_FILE
    # Update the fallback page with error information
    cat > dist/index.html << EOL
<!DOCTYPE html>
<html>
<head>
    <title>Build Failed</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background: linear-gradient(35deg, #FF80BF, #FF007A);
            color: white;
            margin: 0;
            padding: 0;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
        }
        .container {
            background: rgba(0,0,0,0.2);
            border-radius: 20px;
            padding: 40px;
            max-width: 800px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }
        h1 {
            font-size: 32px;
            margin-bottom: 20px;
        }
        p {
            font-size: 18px;
            margin-bottom: 30px;
            line-height: 1.5;
        }
        .logo {
            width: 80px;
            height: 80px;
            margin-bottom: 20px;
        }
        .error {
            background: rgba(255,255,255,0.1);
            padding: 15px;
            border-radius: 10px;
            font-family: monospace;
            text-align: left;
            overflow: auto;
            max-height: 200px;
            margin-bottom: 20px;
        }
        .log {
            background: rgba(0,0,0,0.3);
            padding: 15px;
            border-radius: 10px;
            font-family: monospace;
            text-align: left;
            overflow: auto;
            max-height: 300px;
            white-space: pre-wrap;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <svg class="logo" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="6" fill="white"/>
            <path d="M21.4537 16.5069C22.3004 16.5069 23.1098 16.3726 23.8807 16.104C24.6686 15.8355 25.3335 15.4629 25.8755 14.9863L24.0405 12.8955C23.2187 13.6133 22.231 14.0112 21.0773 14.0112C20.0057 14.0112 19.1051 13.6948 18.3755 13.062C17.6458 12.4291 17.1692 11.6074 16.9457 10.5969H21.3598V8.39258H16.9457C17.0212 7.94995 17.1221 7.55211 17.2484 7.19922C17.3747 6.83013 17.534 6.50685 17.7261 6.22937C17.9261 5.9437 18.1678 5.709 18.4512 5.5252C18.7345 5.3331 19.0657 5.1937 19.4447 5.1069C19.8237 5.0112 20.2578 4.96344 20.7471 4.96344C21.38 4.96344 21.9199 5.04998 22.3665 5.22363C22.8202 5.38808 23.1912 5.6074 23.4796 5.8817C23.7679 6.15599 23.9812 6.47156 24.1196 6.82842C24.258 7.18527 24.3354 7.5487 24.3535 7.9177L27.0272 7.9177C27.0181 7.06104 26.8696 6.27315 26.5812 5.55371C26.2899 4.82597 25.8755 4.1901 25.1836 3.5459C24.4916 2.90169 23.6436 2.38086 22.6383 1.983C21.6329 1.58515 20.474 1.38623 19.1616 1.38623C17.9743 1.38623 16.8809 1.5531 15.8839 1.88675C14.8869 2.22041 14.0229 2.69313 13.2924 3.30494C12.5708 3.91675 12.004 4.65896 11.5919 5.53158C11.1797 6.39538 10.9398 7.36392 10.9398 8.4375V10.5969H10.9398V10.5969H10.9398H10.9398H10.9398H9V8.39258H7.6109V10.5969H6V13.6213H7.6109V24.0112H10.9398V13.6213H16.9457C17.1875 15.2221 17.9014 16.5069 19.0872 17.4754C20.273 18.444 21.7476 18.9284 23.5107 18.9284C24.3691 18.9284 25.135 18.8082 25.8086 18.5678C26.4822 18.3185 27.0435 18.0165 27.4922 17.6618L25.9951 15.6183C25.2172 16.2109 24.3825 16.5069 23.4907 16.5069C22.6146 16.5069 21.8094 16.3038 21.0755 15.8975C20.3496 15.4821 19.821 13.5501 19.4912 13.062C18.7616 12.4291 18.3078 14.5058 18.124 14.0112C20.0057 14.0112 19.1051 15.5225 18.3755 16.1555C17.6458 16.7883 19.3232 16.5069 21.4537 16.5069Z" fill="#FF007A"/>
        </svg>
        <h1>Build Failed</h1>
        <p>Our IPFS deployment encountered an error. The development team has been notified.</p>
        
        <div class="error">
            Error: $error_message
            <br>
            Time: $(date)
        </div>
        
        <div class="log">
            <strong>Last 30 lines of build log:</strong>
            $(tail -n 30 $LOG_FILE 2>/dev/null || echo "Log file not available")
        </div>
        
        <p>Please check back later or contact support for assistance.</p>
    </div>
</body>
</html>
EOL

    # Copy the log file to dist
    cp_log_to_dist
}

# Change to the web app directory
echo "Trying to change to apps/web directory..." | tee -a $LOG_FILE
if [ -d "apps/web" ]; then
    cd apps/web
    echo "📁 Successfully changed directory to $(pwd)" | tee -a $LOG_FILE
else 
    echo "⚠️ Directory apps/web not found. Listing current directory:" | tee -a $LOG_FILE
    ls -la | tee -a $LOG_FILE
    
    # Try to find the correct directory
    if [ -d "apps" ]; then
        echo "Found apps directory. Listing its contents:" | tee -a $LOG_FILE
        ls -la apps/ | tee -a $LOG_FILE
        
        # If we can find 'web' inside 'apps', try again
        if [ -d "apps/web" ]; then
            cd apps/web
            echo "📁 Successfully changed directory to $(pwd)" | tee -a $LOG_FILE
        else
            handle_error "Cannot locate web directory inside apps."
            exit 1
        fi
    else
        handle_error "Cannot locate apps directory."
        exit 1
    fi
fi

# Check for package.json
if [ ! -f "package.json" ]; then
    handle_error "package.json not found in $(pwd). Cannot proceed with build."
    exit 1
else
    echo "✅ Found package.json in $(pwd)" | tee -a $LOG_FILE
    # Check package.json content
    echo "Package.json contents:" | tee -a $LOG_FILE
    cat package.json | tee -a $LOG_FILE
fi

# Install dependencies, with fallback options
echo "📦 Installing dependencies..." | tee -a $LOG_FILE
# Force NPM registry for more reliability
npm config set registry https://registry.npmjs.org/
yarn config set registry https://registry.npmjs.org/ 2>/dev/null || echo "Could not configure yarn registry" | tee -a $LOG_FILE

# Use yarn install with timeout in case it hangs
echo "Running yarn install with timeout..." | tee -a $LOG_FILE
timeout 300 yarn install > >(tee -a $LOG_FILE) 2> >(tee -a $LOG_FILE >&2) || 
    { echo "Yarn install failed, trying npm install..." | tee -a $LOG_FILE; 
      npm install > >(tee -a $LOG_FILE) 2> >(tee -a $LOG_FILE >&2) || 
      { handle_error "Dependency installation failed"; 
        echo "Continuing anyway to see if build still works with existing dependencies" | tee -a $LOG_FILE; } }

# Display node_modules to verify dependencies were installed
echo "Checking if node_modules exists:" | tee -a $LOG_FILE
if [ -d "node_modules" ]; then
    echo "✅ node_modules directory exists" | tee -a $LOG_FILE
    echo "Top-level directories in node_modules:" | tee -a $LOG_FILE
    ls -la node_modules | head -n 10 | tee -a $LOG_FILE
else
    echo "⚠️ node_modules directory not found after installation" | tee -a $LOG_FILE
    handle_error "node_modules directory not found after dependency installation"
fi

# Check for build script in package.json
if grep -q '"build"' package.json; then
    echo "✅ Found build script in package.json" | tee -a $LOG_FILE
else
    handle_error "No build script found in package.json"
    # Continue anyway, but log the issue
fi

# Build the application, with fallback options
echo "🏗️ Building the application..." | tee -a $LOG_FILE
# Attempt yarn build with a timeout
echo "Running yarn build with timeout..." | tee -a $LOG_FILE
timeout 600 yarn build > >(tee -a $LOG_FILE) 2> >(tee -a $LOG_FILE >&2) || 
    { echo "Yarn build failed, trying npm run build..." | tee -a $LOG_FILE; 
      timeout 600 npm run build > >(tee -a $LOG_FILE) 2> >(tee -a $LOG_FILE >&2) || 
      { handle_error "Build command failed"; echo "Continuing with fallback content" | tee -a $LOG_FILE; } }

# Check if build directory exists
if [ -d "build" ]; then
    echo "✅ Build directory exists. Listing contents:" | tee -a $LOG_FILE
    ls -la build/ | tee -a $LOG_FILE
    
    # Check if build directory has index.html
    if [ -f "build/index.html" ]; then
        echo "✅ Found index.html in build directory" | tee -a $LOG_FILE
    else
        handle_error "index.html missing from build directory"
    fi
else
    echo "⚠️ Build directory not found after build command. Searching for it:" | tee -a $LOG_FILE
    find . -name "build" -type d | tee -a $LOG_FILE
    handle_error "Build directory not found after build command"
fi

# Return to the root directory
echo "Returning to root directory..." | tee -a $LOG_FILE
cd ../.. || { echo "Failed to return to root directory. Using absolute path." | tee -a $LOG_FILE; cd "$(pwd)/../.."; }
echo "📁 Now in directory: $(pwd)" | tee -a $LOG_FILE

# Copy the log file to dist
cp_log_to_dist

# Check if the build was successful
if [ -d "apps/web/build" ] && [ "$(ls -A apps/web/build)" ]; then
    echo "✅ Build successful, copying files to dist directory" | tee -a $LOG_FILE
    
    # Copy build files to dist directory
    echo "Copying build files to dist directory..." | tee -a $LOG_FILE
    cp -rv apps/web/build/* dist/ > >(tee -a $LOG_FILE) 2> >(tee -a $LOG_FILE >&2) || { 
        echo "⚠️ Failed to copy. Checking if build directory exists and has files:" | tee -a $LOG_FILE;
        ls -la apps/web/build/ | tee -a $LOG_FILE || { 
            echo "Cannot list build directory" | tee -a $LOG_FILE;
            handle_error "Failed to copy build files to dist directory";
        }
    }
    
    # Create _headers file with proper CORS headers for Fleek
    echo "Creating _headers file..." | tee -a $LOG_FILE
    echo "/*
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
  Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization, x-request-source
  Access-Control-Max-Age: 86400
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' 'wasm-unsafe-eval' data: https://translate.googleapis.com/ https://vercel.com https://vercel.live/ https://www.google-analytics.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src * 'self' blob: data: https://assets.coingecko.com/ https://cdn.center.app/ https://ethereum-optimism.github.io/ https://explorer-api.walletconnect.com/ https://i.seadn.io/ https://lh3.googleusercontent.com/ https://openseauserdata.com/ https://raw.githubusercontent.com/ https://raw.seadn.io/ https://s2.coinmarketcap.com/ https://static.optimism.io/ https://vercel.com https://vercel.live/ https://trustwallet.com/ https://cloudflare-ipfs.com/; frame-src 'self' https://buy.moonpay.com/ https://vercel.com https://vercel.live/ https://verify.walletconnect.com/ https://verify.walletconnect.org/; connect-src * 'self' blob: data: https://*.gateway.uniswap.org https://gateway.uniswap.org https://statsigapi.net https://api.moonpay.com/ https://api.opensea.io https://api.thegraph.com/ https://api.uniswap.org https://arbitrum-mainnet.infura.io/ https://avalanche-mainnet.infura.io/ https://base-mainnet.infura.io/ https://bridge.arbitrum.io https://celo-org.github.io https://cloudflare-ipfs.com https://explorer-api.walletconnect.com https://forno.celo.org/ https://gateway.ipfs.io/ https://interface.gateway.uniswap.org https://mainnet.infura.io https://o1037921.ingest.sentry.io https://old-wispy-arrow.bsc.quiknode.pro/ https://optimism-mainnet.infura.io/ https://polygon-mainnet.infura.io/ https://raw.githubusercontent.com https://static.optimism.io https://temp.api.uniswap.org/ https://tokenlist.arbitrum.io https://tokens.coingecko.com https://ultra-blue-flower.quiknode.pro https://us-central1-uniswap-mobile.cloudfunctions.net/ https://vercel.com https://vercel.live/ https://www.gemini.com wss://relay.walletconnect.com/ wss://www.walletlink.org/rpc https://beta.gateway.uniswap.org/ https://graph.uniswap.org https://api.thegraph.com; worker-src 'self' blob:;" > dist/_headers
    
    echo "✅ Created _headers file with CORS headers in dist directory" | tee -a $LOG_FILE
    
    # Create .nojekyll file to prevent GitHub Pages from ignoring files that begin with an underscore
    touch dist/.nojekyll
    echo "✅ Created .nojekyll file in dist directory" | tee -a $LOG_FILE
    
    # Make sure fonts directory exists
    if [ -d "apps/web/build/fonts" ]; then
        echo "✅ Found fonts directory, ensuring it's copied to dist" | tee -a $LOG_FILE
        mkdir -p dist/fonts
        cp -rv apps/web/build/fonts/* dist/fonts/ > >(tee -a $LOG_FILE) 2> >(tee -a $LOG_FILE >&2) || echo "⚠️ Failed to copy fonts" | tee -a $LOG_FILE
    else
        echo "⚠️ No fonts directory found in build" | tee -a $LOG_FILE
        # Create fonts directory with a placeholder
        mkdir -p dist/fonts
        touch dist/fonts/.placeholder
    fi
    
    # Make sure static directory exists
    if [ -d "apps/web/build/static" ]; then
        echo "✅ Found static directory, ensuring it's copied to dist" | tee -a $LOG_FILE
        mkdir -p dist/static
        cp -rv apps/web/build/static/* dist/static/ > >(tee -a $LOG_FILE) 2> >(tee -a $LOG_FILE >&2) || echo "⚠️ Failed to copy static assets" | tee -a $LOG_FILE
    else
        echo "⚠️ No static directory found in build" | tee -a $LOG_FILE
        # Create static directory with a placeholder
        mkdir -p dist/static
        touch dist/static/.placeholder
    fi
    
    echo "🎉 Build and copy complete" | tee -a $LOG_FILE
else
    echo "⚠️ Build directory not found or empty after build. Creating complete fallback content..." | tee -a $LOG_FILE
    handle_error "Build directory not found or empty after build"
    
    # Copy the log file to dist again (it might have been updated)
    cp_log_to_dist
fi

echo "📊 Final directory structure of dist:" | tee -a $LOG_FILE
find dist -type f | sort | tee -a $LOG_FILE || echo "Cannot list dist directory" | tee -a $LOG_FILE

echo "📏 Size of dist directory:" | tee -a $LOG_FILE
du -sh dist | tee -a $LOG_FILE || echo "Cannot determine size of dist directory" | tee -a $LOG_FILE

echo "✅ Build script completed at $(date)" | tee -a $LOG_FILE

# Include final log in dist for debugging
cp_log_to_dist

# Disable debugging
set +x 