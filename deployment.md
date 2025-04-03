# Tacitus Swap Deployment Guide

This document outlines how to deploy Tacitus Swap to Vercel, both manually and automatically.

## Manual Deployment

### Prerequisites
- Node.js (v16+)
- Yarn package manager
- Vercel CLI (optional)

### Deployment Steps

#### Option 1: Deploy with Vercel CLI

1. Build the project locally:
   ```bash
   # Make the build script executable
   chmod +x build-for-vercel.sh
   
   # Run the build script
   ./build-for-vercel.sh
   ```

2. Deploy using Vercel CLI:
   ```bash
   npx vercel deploy --prebuilt
   ```

#### Option 2: Deploy via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your Git repository (GitHub, GitLab, or Bitbucket)
4. Configure with these settings:
   - Framework Preset: Other
   - Build Command: `bash build-for-vercel.sh`
   - Output Directory: (leave blank, as it's configured in build script)
5. Click "Deploy"

## How It Works

Our deployment strategy uses a custom build script (`build-for-vercel.sh`) that:

1. Creates a local production build with `yarn build:production`
2. Places build artifacts in the `.vercel/output/static` directory (required for Vercel's prebuilt deployments)
3. Creates a proper `config.json` that configures SPA routing
4. Validates the build output before completion

The `vercel.json` file is minimal and just points to our build script:
```json
{
  "buildCommand": "bash build-for-vercel.sh"
}
```

## Setting Up Continuous Deployment

To enable automatic deployments whenever you push to the main branch:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your Tacitus Swap project
3. Go to "Settings" → "Git"
4. Under "Production Branch", make sure "main" is selected
5. Ensure "Auto-Deploy" is enabled

With this configuration:
- Pushing to `main` will trigger a production deployment
- Pull requests will generate preview deployments automatically
- You can configure additional branches in the Git settings

## Environment Variables

If your app requires environment variables, you can set them:
1. Go to your project in the Vercel dashboard
2. Go to "Settings" → "Environment Variables"
3. Add required variables for both Production and Preview environments

## Troubleshooting

- **404 errors**: Make sure the SPA routing is correctly configured in `.vercel/output/config.json`
- **Build failures**: Check the build logs for errors; common issues include missing dependencies or environment variables
- **Blank screen**: Verify that the build output includes all static assets and the correct index.html

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [Static Site SPA Routing](https://vercel.com/docs/frameworks/spa) 