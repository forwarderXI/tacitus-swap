/**
 * This script is used by Vercel to prepare the environment
 * It helps bypass Cloudflare dependencies that cause build issues
 */

const fs = require('fs');
const path = require('path');

// Create mock Cloudflare workerd dependencies
const mockDir = path.join(__dirname, '..', 'node_modules', '@cloudflare', 'workerd-linux-64', 'bin');

try {
  // Create directory structure if it doesn't exist
  fs.mkdirSync(mockDir, { recursive: true });
  
  // Create empty mock workerd file
  const workerdPath = path.join(mockDir, 'workerd');
  fs.writeFileSync(workerdPath, '#!/usr/bin/env node\nconsole.log("Mock workerd");\nprocess.exit(0);');
  
  // Make it executable
  fs.chmodSync(workerdPath, '755');
  
  console.log('Successfully created mock workerd');
} catch (error) {
  console.error('Error setting up mock workerd:', error);
} 