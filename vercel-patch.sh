#!/bin/bash

# This script creates a mock workerd binary to prevent errors during build
echo "Patching Cloudflare workerd dependency..."

# Create mock Cloudflare binary directories
mkdir -p node_modules/@cloudflare/workerd-linux-64/bin
mkdir -p apps/web/node_modules/@cloudflare/workerd-linux-64/bin

# Create mock workerd binary files
echo '#!/bin/sh
echo "Mock workerd running"
exit 0' > node_modules/@cloudflare/workerd-linux-64/bin/workerd
echo '#!/bin/sh
echo "Mock workerd running"
exit 0' > apps/web/node_modules/@cloudflare/workerd-linux-64/bin/workerd

# Make them executable
chmod +x node_modules/@cloudflare/workerd-linux-64/bin/workerd
chmod +x apps/web/node_modules/@cloudflare/workerd-linux-64/bin/workerd

echo "Patch complete!" 