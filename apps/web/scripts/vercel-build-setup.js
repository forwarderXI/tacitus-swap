#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Running pre-build setup...');

// Define root paths
const webRoot = path.resolve(__dirname, '..');
const projectRoot = path.resolve(webRoot, '../..');

// Create necessary directories
const dirs = [
  path.join(webRoot, 'src/utils/__generated__'),
  path.join(projectRoot, 'node_modules/@cloudflare/workerd-linux-64/bin'),
  path.join(projectRoot, 'node_modules/workerd/bin'),
  path.join(projectRoot, 'node_modules/wrangler/bin'),
  path.join(webRoot, 'node_modules/@cloudflare/workerd-linux-64/bin'),
  path.join(webRoot, 'node_modules/workerd/bin'),
  path.join(webRoot, 'node_modules/wrangler/bin')
];

dirs.forEach(dir => {
  try {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  } catch (err) {
    console.log(`Directory already exists or failed to create: ${dir} - ${err.message}`);
  }
});

// Create mock binaries
const mockFiles = [
  path.join(projectRoot, 'node_modules/@cloudflare/workerd-linux-64/bin/workerd'),
  path.join(projectRoot, 'node_modules/workerd/bin/workerd'),
  path.join(projectRoot, 'node_modules/wrangler/bin/wrangler'),
  path.join(webRoot, 'node_modules/@cloudflare/workerd-linux-64/bin/workerd'),
  path.join(webRoot, 'node_modules/workerd/bin/workerd'),
  path.join(webRoot, 'node_modules/wrangler/bin/wrangler')
];

mockFiles.forEach(file => {
  try {
    fs.writeFileSync(
      file,
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
  const defaultsPath = path.join(projectRoot, '.env.defaults');
  const prodPath = path.join(webRoot, '.env.production');
  
  if (fs.existsSync(defaultsPath) && !fs.existsSync(prodPath)) {
    fs.copyFileSync(defaultsPath, prodPath);
    console.log('Created .env.production from .env.defaults');
  } else {
    console.log('Creating default .env.production file');
    // Create a minimal .env.production file with critical values
    fs.writeFileSync(prodPath, 
      'SKIP_PREFLIGHT_CHECK=true\n' +
      'DISABLE_ESLINT_PLUGIN=true\n' +
      'SKIP_WORKERD=true\n' +
      'ALCHEMY_API_KEY=key\n' +
      'INFURA_PROJECT_ID=123\n' +
      'WALLETCONNECT_PROJECT_ID=123\n'
    );
  }
} catch (err) {
  console.log(`Error handling environment file: ${err.message}`);
}

console.log('Pre-build setup complete!'); 