#!/bin/bash
set -e

# Debug info
echo "Current directory: $(pwd)"
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Move to the web app directory
cd apps/web

# Install dependencies with npm instead of yarn
echo "Installing dependencies..."
npm install

# Build the app
echo "Building the app..."
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build

# Create dist directory and copy files
echo "Creating dist directory..."
mkdir -p dist
echo "Copying build files to dist..."
cp -r build/* dist/

echo "Build completed successfully!" 