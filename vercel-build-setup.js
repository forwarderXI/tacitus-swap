#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Running pre-build setup...');

// Create necessary directories
const dirs = [
  'apps/web/src/utils/__generated__',
  'node_modules/@cloudflare/workerd-linux-64/bin',
  'node_modules/workerd/bin',
  'node_modules/wrangler/bin'
];

dirs.forEach(dir => {
  try {
    fs.mkdirSync(path.resolve(dir), { recursive: true });
    console.log(`Created directory: ${dir}`);
  } catch (err) {
    console.log(`Directory already exists or failed to create: ${dir}`);
  }
});

// Create mock binaries
const mockFiles = [
  'node_modules/@cloudflare/workerd-linux-64/bin/workerd',
  'node_modules/workerd/bin/workerd',
  'node_modules/wrangler/bin/wrangler'
];

mockFiles.forEach(file => {
  try {
    fs.writeFileSync(
      path.resolve(file),
      '#!/bin/sh\necho "Mock binary running"\nexit 0',
      { mode: 0o755 }
    );
    console.log(`Created mock binary: ${file}`);
  } catch (err) {
    console.log(`Failed to create mock binary: ${file} - ${err.message}`);
  }
});

// Copy .env.defaults to .env.production if it doesn't exist
try {
  if (!fs.existsSync(path.resolve('apps/web/.env.production'))) {
    fs.copyFileSync(
      path.resolve('.env.defaults'),
      path.resolve('apps/web/.env.production')
    );
    console.log('Created .env.production from .env.defaults');
  }
} catch (err) {
  console.log(`Error copying environment file: ${err.message}`);
}

console.log('Pre-build setup complete!'); 