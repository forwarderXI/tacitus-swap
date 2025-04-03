#!/bin/bash
set -e

echo "Building tacitus-swap for Vercel deployment..."

# Ensure required directories exist
mkdir -p apps/web/src/utils/__generated__
rm -rf .vercel/output
mkdir -p .vercel/output/static

# Build the web app locally
echo "Running web app build..."
cd apps/web
yarn build:production

echo "Build completed! Now preparing for Vercel..."

# Copy the build output to Vercel's expected output directory
cp -r build/. ../../.vercel/output/static/

# Go back to project root
cd ../../

# Create config.json required by Vercel
cat > .vercel/output/config.json << EOF
{
  "version": 3,
  "routes": [
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
EOF

# Check if index.html exists
if [ -f ".vercel/output/static/index.html" ]; then
  echo "✅ index.html found in .vercel/output/static directory"
else
  echo "❌ ERROR: index.html not found in .vercel/output/static directory"
  exit 1
fi

echo "✅ Build successful! You can now deploy using:"
echo "vercel deploy --prebuilt" 