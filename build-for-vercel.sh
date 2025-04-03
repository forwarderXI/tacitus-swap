#!/bin/bash
set -e

echo "Building tacitus-swap for Vercel deployment..."

# Ensure required directories exist
mkdir -p apps/web/src/utils/__generated__
rm -rf vercel-output
mkdir -p vercel-output

# Build the web app locally
echo "Running web app build..."
cd apps/web
yarn build:production

echo "Build completed! Now preparing for Vercel..."

# Copy the build output to a vercel-output directory
cp -r build/. ../../vercel-output/

# Go back to project root
cd ../../

# Create a simple _redirects file for SPA routing
echo "/* /index.html 200" > vercel-output/_redirects

# Check if index.html exists
if [ -f "vercel-output/index.html" ]; then
  echo "✅ index.html found in vercel-output directory"
else
  echo "❌ ERROR: index.html not found in vercel-output directory"
  exit 1
fi

echo "✅ Build successful! The 'vercel-output' directory contains the files for Vercel."
echo "You can now deploy using the Vercel CLI with:"
echo "vercel deploy --prebuilt" 