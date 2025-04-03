#!/bin/bash
set -e

echo "Building tacitus-swap for Vercel deployment..."

# Ensure required directories exist
mkdir -p apps/web/src/utils/__generated__
mkdir -p vercel-output

# Build the web app locally
echo "Running web app build..."
cd apps/web
yarn build:production

echo "Build completed! Now preparing for Vercel..."

# Copy the build output to a vercel-output directory
cp -r build/* ../../vercel-output/

echo "✅ Build successful! The 'vercel-output' directory contains the files for Vercel."
echo "You can now deploy using the Vercel CLI with:"
echo "vercel deploy --prebuilt" 