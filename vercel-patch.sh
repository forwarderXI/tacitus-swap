#!/bin/bash

# This script creates mock workerd/wrangler binaries to prevent errors during build
echo "Patching Cloudflare dependencies..."

# Create all possible mock Cloudflare binary directories
mkdir -p node_modules/@cloudflare/workerd-linux-64/bin
mkdir -p node_modules/workerd/bin
mkdir -p node_modules/wrangler/bin
mkdir -p apps/web/node_modules/@cloudflare/workerd-linux-64/bin
mkdir -p apps/web/node_modules/workerd/bin
mkdir -p apps/web/node_modules/wrangler/bin

# Create mock binaries
echo '#!/bin/sh
echo "Mock workerd running"
exit 0' > node_modules/@cloudflare/workerd-linux-64/bin/workerd

echo '#!/bin/sh
echo "Mock workerd running"
exit 0' > node_modules/workerd/bin/workerd

echo '#!/bin/sh
echo "Mock wrangler running"
exit 0' > node_modules/wrangler/bin/wrangler

echo '#!/bin/sh
echo "Mock workerd running"
exit 0' > apps/web/node_modules/@cloudflare/workerd-linux-64/bin/workerd

echo '#!/bin/sh
echo "Mock workerd running"
exit 0' > apps/web/node_modules/workerd/bin/workerd

echo '#!/bin/sh
echo "Mock wrangler running"
exit 0' > apps/web/node_modules/wrangler/bin/wrangler

# Make them executable
chmod +x node_modules/@cloudflare/workerd-linux-64/bin/workerd
chmod +x node_modules/workerd/bin/workerd
chmod +x node_modules/wrangler/bin/wrangler
chmod +x apps/web/node_modules/@cloudflare/workerd-linux-64/bin/workerd
chmod +x apps/web/node_modules/workerd/bin/workerd
chmod +x apps/web/node_modules/wrangler/bin/wrangler

# Create empty postinstall scripts for these packages
mkdir -p node_modules/workerd/node_modules/.bin
mkdir -p node_modules/wrangler/node_modules/.bin
touch node_modules/workerd/node_modules/.bin/postinstall
touch node_modules/wrangler/node_modules/.bin/postinstall
chmod +x node_modules/workerd/node_modules/.bin/postinstall
chmod +x node_modules/wrangler/node_modules/.bin/postinstall

# Fix package.json to remove postinstall scripts
if [ -f "node_modules/workerd/package.json" ]; then
  sed -i 's/"postinstall": ".*"/"postinstall": "exit 0"/g' node_modules/workerd/package.json
fi

if [ -f "node_modules/wrangler/package.json" ]; then
  sed -i 's/"postinstall": ".*"/"postinstall": "exit 0"/g' node_modules/wrangler/package.json
fi

echo "Patch complete!" 