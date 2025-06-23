# Firebase Deployment Guide

This guide walks you through deploying the Coinbase Chat MCP project to Firebase, including both the React frontend (Firebase Hosting) and Node.js API server (Firebase Cloud Functions).

## Prerequisites

1. **Firebase CLI**: Install globally
   ```bash
   npm install -g firebase-tools
   ```

2. **Firebase Project**: Create a new project at [Firebase Console](https://console.firebase.google.com)

3. **Google Cloud Billing**: Enable billing for your project (required for Cloud Functions)

## Step 1: Firebase Project Setup

1. **Login to Firebase**:
   ```bash
   firebase login
   ```

2. **Initialize Firebase in your project**:
   ```bash
   firebase init
   ```

   Select these options:
   - ✅ **Hosting**: Configure files for Firebase Hosting
   - ✅ **Functions**: Configure a Cloud Functions directory
   - Choose **Use an existing project** and select your Firebase project
   - **Functions setup**:
     - Language: **TypeScript**
     - ESLint: **Yes**
     - Install dependencies: **Yes**
   - **Hosting setup**:
     - Public directory: **dist** (this will be our built frontend)
     - Single-page app: **Yes**
     - Automatic builds and deploys with GitHub: **No** (for now)

## Step 2: Configure Firebase Functions

1. **Create firebase functions directory structure**:
   ```bash
   mkdir -p functions/src
   ```

2. **Update functions/package.json**:
   ```json
   {
     "name": "functions",
     "scripts": {
       "build": "tsc",
       "build:watch": "tsc --watch",
       "serve": "npm run build && firebase emulators:start --only functions",
       "shell": "npm run build && firebase functions:shell",
       "start": "npm run shell",
       "deploy": "firebase deploy --only functions",
       "logs": "firebase functions:log"
     },
     "engines": {
       "node": "18"
     },
     "main": "lib/index.js",
     "dependencies": {
       "express": "^4.18.2",
       "cors": "^2.8.5",
       "helmet": "^7.1.0",
       "compression": "^1.7.4",
       "axios": "^1.6.2",
       "winston": "^3.11.0",
       "dotenv": "^16.3.1",
       "firebase-admin": "^11.11.0",
       "firebase-functions": "^4.5.0"
     },
     "devDependencies": {
       "@types/express": "^4.17.21",
       "@types/cors": "^2.8.17",
       "@types/compression": "^1.7.5",
       "typescript": "^5.3.0"
     },
     "private": true
   }
   ```

3. **Create functions/src/index.ts** (Firebase Functions entry point):
   ```typescript
   import { onRequest } from 'firebase-functions/v2/https';
   import { setGlobalOptions } from 'firebase-functions/v2';
   import express from 'express';
   import cors from 'cors';
   import helmet from 'helmet';
   import compression from 'compression';
   import { config } from 'dotenv';

   // Load environment variables
   config();

   // Set global options for all functions
   setGlobalOptions({
     region: 'us-central1',
     maxInstances: 10,
   });

   // Import your existing API server
   import apiApp from '../../api-server/src/index.js';

   // Cloud Function for API
   export const api = onRequest({
     cors: true,
     memory: '256MiB',
     timeoutSeconds: 60,
   }, apiApp);

   // Health check function
   export const health = onRequest((req, res) => {
     res.json({
       status: 'healthy',
       timestamp: new Date().toISOString(),
       service: 'firebase-functions'
     });
   });
   ```

4. **Update functions/tsconfig.json**:
   ```json
   {
     "compilerOptions": {
       "module": "NodeNext",
       "moduleResolution": "NodeNext",
       "noImplicitReturns": true,
       "noUnusedLocals": false,
       "outDir": "lib",
       "sourceMap": true,
       "strict": true,
       "target": "ES2020",
       "esModuleInterop": true,
       "allowSyntheticDefaultImports": true,
       "resolveJsonModule": true
     },
     "compileOnSave": true,
     "include": [
       "src",
       "../api-server/src"
     ]
   }
   ```

## Step 3: Update Firebase Configuration

1. **Update firebase.json**:
   ```json
   {
     "hosting": {
       "public": "dist",
       "ignore": [
         "firebase.json",
         "**/.*",
         "**/node_modules/**"
       ],
       "rewrites": [
         {
           "source": "/api/**",
           "function": "api"
         },
         {
           "source": "**",
           "destination": "/index.html"
         }
       ],
       "headers": [
         {
           "source": "/api/**",
           "headers": [
             {
               "key": "Cache-Control",
               "value": "no-cache, no-store, must-revalidate"
             }
           ]
         }
       ]
     },
     "functions": [
       {
         "source": "functions",
         "codebase": "default",
         "ignore": [
           "node_modules",
           ".git",
           "firebase-debug.log",
           "firebase-debug.*.log"
         ]
       }
     ],
     "emulators": {
       "functions": {
         "port": 5001
       },
       "hosting": {
         "port": 5000
       },
       "ui": {
         "enabled": true
       },
       "singleProjectMode": true
     }
   }
   ```

## Step 4: Environment Variables

1. **Set Firebase environment variables**:
   ```bash
   # Set your Coinbase API URL
   firebase functions:config:set coinbase.api_url="https://api.coinbase.com/v2"
   
   # Set other environment variables as needed
   firebase functions:config:set app.environment="production"
   ```

2. **Update your API server to use Firebase config**:
   In `api-server/src/index.ts`, add Firebase config support:
   ```typescript
   import { config } from 'firebase-functions';
   
   // Use Firebase config in production, fallback to process.env for local
   const COINBASE_API_URL = config().coinbase?.api_url || process.env.COINBASE_API_URL;
   ```

## Step 5: Update Build Scripts

1. **Update root package.json scripts**:
   ```json
   {
     "scripts": {
       "build": "npm run build --workspace=api-server && npm run build --workspace=frontend && mkdir -p dist && cp -r frontend/dist/* dist/",
       "build:firebase": "npm run build && cd functions && npm install && npm run build",
       "deploy:firebase": "npm run build:firebase && firebase deploy",
       "serve:firebase": "npm run build:firebase && firebase emulators:start"
     }
   }
   ```

## Step 6: Update Frontend API URLs

1. **Update frontend environment variables**:
   Create `frontend/.env.production`:
   ```
   VITE_API_URL=https://your-project-id.web.app/api
   ```

   Update `frontend/.env.local` for local development:
   ```
   VITE_API_URL=http://localhost:5001/your-project-id/us-central1/api
   ```

## Step 7: Deploy to Firebase

1. **Build the project**:
   ```bash
   npm run build:firebase
   ```

2. **Test locally with Firebase emulators**:
   ```bash
   npm run serve:firebase
   ```
   
   Visit:
   - Frontend: http://localhost:5000
   - API: http://localhost:5001/your-project-id/us-central1/api/health
   - Firebase UI: http://localhost:4000

3. **Deploy to production**:
   ```bash
   npm run deploy:firebase
   ```

## Step 8: Verify Deployment

After deployment, test these URLs (replace `your-project-id` with your actual Firebase project ID):

- **Frontend**: https://your-project-id.web.app
- **API Health**: https://your-project-id.web.app/api/health
- **API Endpoint**: https://your-project-id.web.app/api/v1/prices/BTC-USD/spot

## Troubleshooting

### Common Issues:

1. **Function timeout**: Increase timeout in firebase.json
2. **CORS errors**: Ensure cors is properly configured in your API
3. **Build errors**: Check that all dependencies are installed in functions/
4. **Environment variables**: Use `firebase functions:config:get` to verify

### Logs and Debugging:

```bash
# View function logs
firebase functions:log

# View specific function logs
firebase functions:log --only api

# Local debugging
firebase emulators:start --inspect-functions
```

## Cost Optimization

- **Firebase Hosting**: Free tier includes 10GB storage, 10GB/month transfer
- **Cloud Functions**: Free tier includes 2M invocations/month, 400k GB-seconds/month
- **Monitor usage**: Check Firebase Console for usage analytics

## Security Considerations

1. **Firebase Security Rules**: Configure appropriate security rules
2. **Environment Variables**: Use Firebase config for sensitive data
3. **CORS**: Configure CORS properly for your domain
4. **Rate Limiting**: Implement rate limiting in your API functions

## Continuous Deployment (Optional)

Set up GitHub Actions for automatic deployment:

```yaml
# .github/workflows/firebase-deploy.yml
name: Deploy to Firebase
on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
    - run: npm install
    - run: npm run build:firebase
    - uses: FirebaseExtended/action-hosting-deploy@v0
      with:
        repoToken: '${{ secrets.GITHUB_TOKEN }}'
        firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
        projectId: your-project-id
```

---

**Next Steps**: Follow this guide step by step, and your Coinbase Chat MCP application will be deployed on Firebase with both frontend hosting and serverless API functions! 