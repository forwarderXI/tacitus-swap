#!/bin/bash

# Create generated directory
mkdir -p apps/web/src/utils/__generated__

# Build the web app
cd apps/web
yarn add -D env-cmd
SKIP_WORKERD=true NODE_OPTIONS='--max-old-space-size=4096' DISABLE_ESLINT_PLUGIN=true CI=false yarn build:production

# Move build output to expected location
mkdir -p ../build
mv build/* ../build/
rmdir build

echo "Build completed successfully!" 