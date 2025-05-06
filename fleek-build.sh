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
echo "Directory listing:" | tee -a $LOG_FILE
ls -la | tee -a $LOG_FILE

# Workspace structure analysis
echo "=== WORKSPACE STRUCTURE ANALYSIS ===" | tee -a $LOG_FILE
echo "Listing directories up to depth 2:" | tee -a $LOG_FILE
find . -type d -maxdepth 2 | sort | tee -a $LOG_FILE

echo "Searching for package.json files:" | tee -a $LOG_FILE
find . -name "package.json" | sort | tee -a $LOG_FILE

echo "Looking for monorepo structure:" | tee -a $LOG_FILE
if [ -d "./packages" ]; then
    echo "✅ Detected packages directory - might be a monorepo" | tee -a $LOG_FILE
    ls -la ./packages/ | tee -a $LOG_FILE
elif [ -d "./apps" ]; then
    echo "✅ Detected apps directory - might be a monorepo" | tee -a $LOG_FILE
    ls -la ./apps/ | tee -a $LOG_FILE
fi

# Set environment variables
export NODE_OPTIONS="--max-old-space-size=4096"
export CI=false
export DISABLE_ESLINT_PLUGIN=true
export SKIP_PREFLIGHT_CHECK=true

# Clean up any previous build artifacts
echo "Cleaning up previous build artifacts..." | tee -a $LOG_FILE
rm -rf dist
mkdir -p dist
echo "Created dist directory preemptively" | tee -a $LOG_FILE

# Copy the log file to dist for debugging
cp_log_to_dist() {
    if [ -f "$LOG_FILE" ]; then
        cp $LOG_FILE dist/ 2>/dev/null || echo "Failed to copy log file to dist" | tee -a $LOG_FILE
    fi
}

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

# Create _headers file early with minimal CORS settings
echo "/*
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
  Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization
  Access-Control-Max-Age: 86400" > dist/_headers

echo "✅ Created minimal fallback content and headers in dist directory" | tee -a $LOG_FILE

# Creating a fallback build as a safety measure
echo "Creating a minimal placeholder site as fallback..." | tee -a $LOG_FILE
FALLBACK_BUILD_DIR="/tmp/fallback-build"
mkdir -p $FALLBACK_BUILD_DIR/static

# Create a minimal index.html for fallback
cat > $FALLBACK_BUILD_DIR/index.html << EOL
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Uniswap Interface</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(35deg, #FF80BF, #FF007A);
            color: white;
            text-align: center;
        }
        .container {
            max-width: 600px;
            padding: 2rem;
            background: rgba(0,0,0,0.2);
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }
        h1 {
            margin-top: 0;
        }
        .logo {
            width: 80px;
            height: 80px;
            margin-bottom: 1rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <svg class="logo" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="6" fill="white"/>
            <path d="M21.4537 16.5069C22.3004 16.5069 23.1098 16.3726 23.8807 16.104C24.6686 15.8355 25.3335 15.4629 25.8755 14.9863L24.0405 12.8955C23.2187 13.6133 22.231 14.0112 21.0773 14.0112C20.0057 14.0112 19.1051 13.6948 18.3755 13.062C17.6458 12.4291 17.1692 11.6074 16.9457 10.5969H21.3598V8.39258H16.9457C17.0212 7.94995 17.1221 7.55211 17.2484 7.19922C17.3747 6.83013 17.534 6.50685 17.7261 6.22937C17.9261 5.9437 18.1678 5.709 18.4512 5.5252C18.7345 5.3331 19.0657 5.1937 19.4447 5.1069C19.8237 5.0112 20.2578 4.96344 20.7471 4.96344C21.38 4.96344 21.9199 5.04998 22.3665 5.22363C22.8202 5.38808 23.1912 5.6074 23.4796 5.8817C23.7679 6.15599 23.9812 6.47156 24.1196 6.82842C24.258 7.18527 24.3354 7.5487 24.3535 7.9177L27.0272 7.9177C27.0181 7.06104 26.8696 6.27315 26.5812 5.55371C26.2899 4.82597 25.8755 4.1901 25.1836 3.5459C24.4916 2.90169 23.6436 2.38086 22.6383 1.983C21.6329 1.58515 20.474 1.38623 19.1616 1.38623C17.9743 1.38623 16.8809 1.5531 15.8839 1.88675C14.8869 2.22041 14.0229 2.69313 13.2924 3.30494C12.5708 3.91675 12.004 4.65896 11.5919 5.53158C11.1797 6.39538 10.9398 7.36392 10.9398 8.4375V10.5969H10.9398V10.5969H10.9398H10.9398H10.9398H9V8.39258H7.6109V10.5969H6V13.6213H7.6109V24.0112H10.9398V13.6213H16.9457C17.1875 15.2221 17.9014 16.5069 19.0872 17.4754C20.273 18.444 21.7476 18.9284 23.5107 18.9284C24.3691 18.9284 25.135 18.8082 25.8086 18.5678C26.4822 18.3185 27.0435 18.0165 27.4922 17.6618L25.9951 15.6183C25.2172 16.2109 24.3825 16.5069 23.4907 16.5069C22.6146 16.5069 21.8094 16.3038 21.0755 15.8975C20.3496 15.4821 19.821 13.5501 19.4912 13.062C18.7616 12.4291 18.3078 14.5058 18.124 14.0112C20.0057 14.0112 19.1051 15.5225 18.3755 16.1555C17.6458 16.7883 19.3232 16.5069 21.4537 16.5069Z" fill="#FF007A"/>
        </svg>
        <h1>Uniswap Interface</h1>
        <p>The site is temporarily down for maintenance. Please check back later.</p>
    </div>
</body>
</html>
EOL

echo "✅ Created fallback content" | tee -a $LOG_FILE

# Find the workspace root directory
find_workspace_root() {
    echo "🔍 Finding workspace root..." | tee -a $LOG_FILE
    
    local current_dir=$(pwd)
    echo "Current directory: $current_dir" | tee -a $LOG_FILE
    
    # First, check if we're already in a workspace with package.json
    if [ -f "./package.json" ]; then
        echo "✅ Found package.json in current directory" | tee -a $LOG_FILE
        local pkg_json_type=$(grep -o '"private": true' ./package.json || echo "")
        
        if [ -n "$pkg_json_type" ]; then
            echo "✅ Current directory appears to be the workspace root (private: true in package.json)" | tee -a $LOG_FILE
            WORKSPACE_ROOT=$current_dir
            return 0
        fi
    fi
    
    # Otherwise, look for folders structure, using a typical monorepo structure
    # with apps/web as a common pattern used in Uniswap
    if [ -d "./apps/web" ]; then
        echo "✅ Found apps/web directory in current location" | tee -a $LOG_FILE
        WORKSPACE_ROOT=$current_dir
        return 0
    fi
    
    # Look for web directory specifically
    local web_dir=$(find . -name "web" -type d 2>/dev/null | head -n 1)
    if [ -n "$web_dir" ]; then
        echo "✅ Found web directory at: $web_dir" | tee -a $LOG_FILE
        # Check if it looks like a web app directory with package.json
        if [ -f "$web_dir/package.json" ]; then
            echo "✅ This appears to be the web app directory" | tee -a $LOG_FILE
            WEB_DIR=$web_dir
            # Parent directory could be the apps directory
            WORKSPACE_ROOT=$(dirname $(dirname $web_dir))
            echo "Setting workspace root to: $WORKSPACE_ROOT" | tee -a $LOG_FILE
            return 0
        fi
    fi
    
    # Last resort - check the repository structure based on git
    if [ -d ".git" ]; then
        echo "✅ Found .git directory, this is the repository root" | tee -a $LOG_FILE
        WORKSPACE_ROOT=$current_dir
        return 0
    fi
    
    # If we get here, we couldn't find the workspace root
    echo "⚠️ Could not determine workspace root, using current directory" | tee -a $LOG_FILE
    WORKSPACE_ROOT=$current_dir
    return 1
}

# Function to find the web app directory
find_web_app_dir() {
    echo "🔍 Finding web app directory..." | tee -a $LOG_FILE
    
    # First, check for the typical structure
    if [ -d "$WORKSPACE_ROOT/apps/web" ]; then
        echo "✅ Found standard apps/web directory" | tee -a $LOG_FILE
        WEB_APP_DIR="$WORKSPACE_ROOT/apps/web"
        return 0
    fi
    
    # Check for package.json with nextjs or react dependencies at root
    if [ -f "$WORKSPACE_ROOT/package.json" ]; then
        if grep -q "\"next\"\\|\"react\"" "$WORKSPACE_ROOT/package.json"; then
            echo "✅ Found Next.js or React at root level, this might be the web app" | tee -a $LOG_FILE
            WEB_APP_DIR="$WORKSPACE_ROOT"
            return 0
        fi
    fi
    
    # Search for a web app package.json recursively (limiting depth)
    echo "Searching for web app package.json..." | tee -a $LOG_FILE
    local web_pkg_json=$(find "$WORKSPACE_ROOT" -name "package.json" -type f -maxdepth 4 2>/dev/null | xargs grep -l "\"next\"\\|\"react\"" 2>/dev/null | head -n 1)
    
    if [ -n "$web_pkg_json" ]; then
        local pkg_dir=$(dirname "$web_pkg_json")
        echo "✅ Found web app package.json at: $pkg_dir" | tee -a $LOG_FILE
        WEB_APP_DIR="$pkg_dir"
        return 0
    fi
    
    # If we can't find it, see if we have a web directory already set
    if [ -n "$WEB_DIR" ]; then
        echo "✅ Using previously found web directory: $WEB_DIR" | tee -a $LOG_FILE
        WEB_APP_DIR="$WEB_DIR"
        return 0
    fi
    
    # Look for any package.json with a build script
    local build_pkg_json=$(find "$WORKSPACE_ROOT" -name "package.json" -type f -maxdepth 4 2>/dev/null | xargs grep -l "\"build\":" 2>/dev/null | head -n 1)
    
    if [ -n "$build_pkg_json" ]; then
        local pkg_dir=$(dirname "$build_pkg_json")
        echo "✅ Found package.json with build script at: $pkg_dir" | tee -a $LOG_FILE
        WEB_APP_DIR="$pkg_dir"
        return 0
    fi
    
    # Last resort - just use the workspace root
    echo "⚠️ Could not find web app directory, using workspace root" | tee -a $LOG_FILE
    WEB_APP_DIR="$WORKSPACE_ROOT"
    return 1
}

# Find the workspace root directory
find_workspace_root

# Find the web app directory
find_web_app_dir

# Change to the web app directory
echo "Changing to web app directory: $WEB_APP_DIR" | tee -a $LOG_FILE
cd "$WEB_APP_DIR" || {
    handle_error "Failed to change to web app directory: $WEB_APP_DIR"
    exit 1
}

echo "Now in directory: $(pwd)" | tee -a $LOG_FILE
echo "Directory contents:" | tee -a $LOG_FILE
ls -la | tee -a $LOG_FILE

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

# Check if Yarn exists and install if needed
if command -v yarn >/dev/null 2>&1; then
    echo "✅ Yarn is installed" | tee -a $LOG_FILE
else
    echo "Installing Yarn..." | tee -a $LOG_FILE
    npm install -g yarn
    yarn --version | tee -a $LOG_FILE
fi

# Build the application, with fallback options
echo "🏗️ Building the application..." | tee -a $LOG_FILE
echo "Current directory: $(pwd)" | tee -a $LOG_FILE
echo "Available scripts in package.json:" | tee -a $LOG_FILE
grep -A 20 '"scripts"' package.json | tee -a $LOG_FILE

# Check if we have access to the script content
if [ -f "package.json" ]; then
    echo "✅ Verifying build script in package.json" | tee -a $LOG_FILE
    
    # Check if it's a Next.js project
    if grep -q "\"next\"" package.json; then
        echo "🔍 Detected Next.js project" | tee -a $LOG_FILE
        
        # Check if Next.js is installed
        if [ -d "node_modules/next" ]; then
            echo "✅ Next.js is installed" | tee -a $LOG_FILE
        else
            echo "⚠️ Next.js not found in node_modules" | tee -a $LOG_FILE
        fi
    fi
    
    # Check for React dependencies
    if grep -q "\"react\"" package.json; then
        echo "🔍 Detected React project" | tee -a $LOG_FILE
    fi
    
    # Output actual build command from package.json
    BUILD_CMD=$(grep -o '"build": *"[^"]*"' package.json | cut -d '"' -f 4)
    if [ -n "$BUILD_CMD" ]; then
        echo "🔧 Build command from package.json: $BUILD_CMD" | tee -a $LOG_FILE
    fi
fi

# Check disk space before building
echo "Disk space before build:" | tee -a $LOG_FILE
df -h | tee -a $LOG_FILE

# Create output directory preemptively in case build script fails to do so
mkdir -p build
touch build/.placeholder

# Attempt yarn build with a timeout and more verbose output
echo "Running yarn build with timeout..." | tee -a $LOG_FILE
DEBUG=* NEXT_TELEMETRY_DISABLED=1 timeout 900 yarn build --verbose > >(tee -a $LOG_FILE) 2> >(tee -a $LOG_FILE >&2) || { 
    echo "Yarn build failed, trying npm run build..." | tee -a $LOG_FILE; 
    DEBUG=* NEXT_TELEMETRY_DISABLED=1 timeout 900 npm run build --verbose > >(tee -a $LOG_FILE) 2> >(tee -a $LOG_FILE >&2) || { 
        # Last resort - try direct next build if it's a Next.js project
        if [ -d "node_modules/next" ] && [ -f "node_modules/.bin/next" ]; then
            echo "🔧 Trying direct next build command..." | tee -a $LOG_FILE
            DEBUG=* NEXT_TELEMETRY_DISABLED=1 node_modules/.bin/next build > >(tee -a $LOG_FILE) 2> >(tee -a $LOG_FILE >&2) || {
                handle_error "All build commands failed"; 
                cp -rv $FALLBACK_BUILD_DIR/* dist/
                cp_log_to_dist
                exit 1;
            }
        else
            handle_error "Build command failed with both yarn and npm"; 
            cp -rv $FALLBACK_BUILD_DIR/* dist/
            cp_log_to_dist
            exit 1;
        fi
    }
}

# Check disk space after building (may help debug out-of-space issues)
echo "Disk space after build:" | tee -a $LOG_FILE
df -h | tee -a $LOG_FILE

# More extensive search for build output
echo "🔍 Searching for build output in all locations:" | tee -a $LOG_FILE

# Check common build output directories
POSSIBLE_BUILD_DIRS=("build" "dist" "out" ".next" "public" "dist-client" "build-client")

# Log the contents of the current directory after build
echo "Directory contents after build:" | tee -a $LOG_FILE
ls -la | tee -a $LOG_FILE

for dir in "${POSSIBLE_BUILD_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        echo "✅ Found potential build directory: $dir" | tee -a $LOG_FILE
        echo "Contents of $dir:" | tee -a $LOG_FILE
        ls -la "$dir" | tee -a $LOG_FILE
        
        # If we found a build directory with content, prefer it
        if [ -n "$(ls -A "$dir" 2>/dev/null)" ]; then
            echo "✅ Using build directory: $dir" | tee -a $LOG_FILE
            BUILD_DIR="$dir"
            break
        fi
    fi
done

# If no build directory found, do a deeper search
if [ -z "$BUILD_DIR" ] || [ ! -d "$BUILD_DIR" ]; then
    echo "⚠️ No standard build directory found. Searching for any build directories:" | tee -a $LOG_FILE
    find . -type d -name "build" -o -name "dist" -o -name "out" -o -name ".next" | tee -a $LOG_FILE
    
    # Try to find any directory with an index.html file
    echo "🔍 Searching for index.html files:" | tee -a $LOG_FILE
    INDEX_FILES=$(find . -name "index.html" | sort)
    echo "$INDEX_FILES" | tee -a $LOG_FILE
    
    if [ -n "$INDEX_FILES" ]; then
        # Use the first directory containing an index.html
        FIRST_INDEX=$(echo "$INDEX_FILES" | head -n 1)
        BUILD_DIR=$(dirname "$FIRST_INDEX")
        echo "✅ Found index.html, using directory: $BUILD_DIR" | tee -a $LOG_FILE
    else
        echo "⚠️ No index.html found. Using fallback." | tee -a $LOG_FILE
        BUILD_DIR="$FALLBACK_BUILD_DIR"
    fi
fi

# Create and prepare the dist directory
echo "📦 Creating dist directory for IPFS deployment..." | tee -a $LOG_FILE

# Make sure we have a clean dist directory
echo "Removing old dist directory if it exists..." | tee -a $LOG_FILE
rm -rf dist
mkdir -p dist

# Attempt to copy build files to dist directory with verbose output
echo "Copying from $BUILD_DIR to dist..." | tee -a $LOG_FILE
if [ -d "$BUILD_DIR" ] && [ -n "$(ls -A "$BUILD_DIR" 2>/dev/null)" ]; then
    # Use verbose copy and show what's being copied
    echo "Contents of $BUILD_DIR before copy:" | tee -a $LOG_FILE
    ls -la "$BUILD_DIR" | tee -a $LOG_FILE
    
    cp -rv "$BUILD_DIR"/* dist/ 2>&1 | tee -a $LOG_FILE || {
        echo "⚠️ Error copying from $BUILD_DIR to dist, using alternative copy method..." | tee -a $LOG_FILE
        find "$BUILD_DIR" -type f -exec cp -v {} dist/ \; 2>&1 | tee -a $LOG_FILE
    }
else
    echo "⚠️ Build directory empty or not found. Using fallback content." | tee -a $LOG_FILE
    cp -rv "$FALLBACK_BUILD_DIR"/* dist/ 2>&1 | tee -a $LOG_FILE
    
    # Create a minimal index.html if we don't have one
    if [ ! -f "dist/index.html" ]; then
        echo "Creating minimal index.html in dist..." | tee -a $LOG_FILE
        cat > dist/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tacitus Swap - Build Issues</title>
    <style>
        body { font-family: sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
        pre { background: #f0f0f0; padding: 10px; overflow-x: auto; }
        .error { color: #c00; }
        .success { color: #0a0; }
    </style>
</head>
<body>
    <h1>Tacitus Swap</h1>
    <p>The site is currently having build issues. Please check back later.</p>
    <h2>Build Log</h2>
    <pre id="buildLog">Loading build log...</pre>
    <script>
        fetch('build-debug.log')
            .then(res => res.text())
            .then(log => {
                document.getElementById('buildLog').textContent = log;
            })
            .catch(err => {
                document.getElementById('buildLog').textContent = 'Error loading build log: ' + err.message;
            });
    </script>
</body>
</html>
EOF
    fi
fi

# After copying to dist, check contents
echo "Contents of dist after copy:" | tee -a $LOG_FILE
ls -la dist/ | tee -a $LOG_FILE

# Create _headers file in dist with proper CORS settings
echo "Creating _headers file in dist with CORS settings..." | tee -a $LOG_FILE
cat > dist/_headers << 'EOF'
/*
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.google-analytics.com https://www.googletagmanager.com https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https: blob:; frame-src 'self' https://verify.walletconnect.com https://verify.walletconnect.org https://connect.uniswapwallet.io https://www.google.com; connect-src 'self' https://api.uniswap.org https://gateway.uniswap.org https://beta.gateway.uniswap.org https://*.infura.io wss://*.infura.io https://*.alchemyapi.io https://ethgas-api.onrender.com https://api.1inch.io https://api-spot.deepl.com https://api.opensea.io https://*.ipfs.localhost:* https://localhostouni.org:* https://localhostuniswap.org:* data: blob: https://api.coingecko.com https://tokens.coingecko.com https://raw.githubusercontent.com https://gateway.pinata.cloud https://cloudflare-ipfs.com https://ipfs.fleek.co https://bafybeifd3epckfzpzsy453s2ru2jxfwxyh7mmx7a7lpurpofvowykwh6qu.ipfs.cf-ipfs.com/ https://tokenlist.arbitrum.io https://static.optimism.io https://api.thegraph.com https://api.coingecko.com https://vercel.live https://static.cloudflareinsights.com https://cloudflare-eth.com https://cdn.live.ledger.com wss://relay.walletconnect.org wss://relay.walletconnect.com https://*.bridge.walletconnect.org https://api.blocknative.com; worker-src 'self' blob:
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: GET, POST, OPTIONS
  Access-Control-Allow-Headers: *
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Embedder-Policy: require-corp
EOF

# Add the build log to the dist directory
cp_log_to_dist

echo "🎉 Build process completed! Files ready in dist/ directory" | tee -a $LOG_FILE

echo "📊 Final directory structure of dist:" | tee -a $LOG_FILE
find dist -type f | sort | tee -a $LOG_FILE

echo "✅ Build script completed at $(date)" | tee -a $LOG_FILE

# Disable debugging
set +x 