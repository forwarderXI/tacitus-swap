#!/bin/bash
set -e

# Debug info
echo "Current directory: $(pwd)"
echo "Node version: $(node -v)"

# Install specific Yarn version
echo "Installing Yarn globally..."
npm install -g yarn@1.22.19
echo "Yarn version: $(yarn --version)"

# Configure Yarn
echo "Configuring Yarn..."
yarn config set nodeLinker node-modules
yarn config set npmRegistryServer "https://registry.npmjs.org/"

# Install dependencies at the root level
echo "Installing dependencies at root level..."
yarn install

# Move to the web app directory
cd apps/web

# Install dependencies in the web app
echo "Installing web app dependencies..."
yarn install

# Build the app
echo "Building the app..."
export NODE_OPTIONS="--max-old-space-size=4096"
export CI=false
yarn craco build

# Verify the build directory exists
if [ ! -d "build" ]; then
  echo "Error: Build directory not found!"
  exit 1
fi

# Create dist directory and copy files
echo "Creating dist directory..."
mkdir -p dist

echo "Copying build files to dist..."
cp -r build/* dist/ || { echo "Error: Failed to copy build files to dist!"; exit 1; }

# List contents of both directories for debugging
echo "Contents of build directory:"
ls -la build/
echo "Contents of dist directory:"
ls -la dist/

echo "Build completed successfully!" 