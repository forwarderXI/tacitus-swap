// Script to prepare the repository for Vercel deployment
const fs = require('fs');
const path = require('path');

console.log('Preparing project for Vercel deployment...');

// Function to read and parse package.json
function readPackageJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

// Function to write modified package.json
function writePackageJson(filePath, content) {
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
}

// Process the main package.json
const rootPkgPath = path.resolve('./package.json');
const rootPkg = readPackageJson(rootPkgPath);

// Create web app .env.production if it doesn't exist
const webEnvPath = path.resolve('./apps/web/.env.production');
if (!fs.existsSync(webEnvPath)) {
  console.log('Creating web app .env.production file');
  const envContent = `
SKIP_WORKERD=true
SKIP_PREFLIGHT_CHECK=true
DISABLE_ESLINT_PLUGIN=true
ALCHEMY_API_KEY=key
INFURA_PROJECT_ID=123
WALLETCONNECT_PROJECT_ID=123
FIAT_ON_RAMP_API_URL=https://api.uniswap.org
MOONPAY_API_KEY=key
MOONPAY_API_URL=https://api.moonpay.com
MOONPAY_WIDGET_API_URL=https://api.moonpay.com
ONESIGNAL_APP_ID=123
QUICKNODE_BNB_RPC_URL=https://api.uniswap.org
SENTRY_DSN=http://sentry.com
SHAKE_CLIENT_ID=123
SHAKE_CLIENT_SECRET=123
SIMPLEHASH_API_KEY=key
SIMPLEHASH_API_URL=https://api.simplehash.com
STATSIG_PROXY_URL=https://api.statsig.com
TEMP_SCANTASTIC_URL=https://api.uniswap.org
TRADING_API_KEY=key
TRADING_API_URL=https://api.uniswap.org
UNISWAP_API_KEY=key
UNISWAP_API_BASE_URL=https://api.uniswap.org
UNISWAP_APP_URL=https://app.uniswap.org
UNITAGS_API_URL=https://api.uniswap.org/unitags
FIREBASE_APP_CHECK_DEBUG_TOKEN=token
`;
  fs.writeFileSync(webEnvPath, envContent.trim(), 'utf8');
}

// Create required directories for the build
const genDirPath = path.resolve('./apps/web/src/utils/__generated__');
if (!fs.existsSync(genDirPath)) {
  console.log('Creating generated directory:', genDirPath);
  fs.mkdirSync(genDirPath, { recursive: true });
}

// Ensure build output directory exists
const buildDirPath = path.resolve('./apps/build');
if (!fs.existsSync(buildDirPath)) {
  console.log('Creating build directory:', buildDirPath);
  fs.mkdirSync(buildDirPath, { recursive: true });
}

// Fix the web package.json to not use workspace references
const webPkgPath = path.resolve('./apps/web/package.json');
if (fs.existsSync(webPkgPath)) {
  console.log('Modifying web app package.json for Vercel compatibility');
  
  const webPkg = readPackageJson(webPkgPath);
  
  // Add env-cmd if not present
  if (!webPkg.devDependencies['env-cmd']) {
    webPkg.devDependencies['env-cmd'] = '10.1.0';
  }
  
  // Replace workspace references
  for (const depSection of ['dependencies', 'devDependencies']) {
    if (!webPkg[depSection]) continue;
    
    for (const [dep, version] of Object.entries(webPkg[depSection])) {
      if (typeof version === 'string' && version.startsWith('workspace:')) {
        webPkg[depSection][dep] = '1.0.0'; // Use a fixed version
      }
    }
  }
  
  writePackageJson(webPkgPath, webPkg);
}

console.log('Vercel setup completed successfully!'); 