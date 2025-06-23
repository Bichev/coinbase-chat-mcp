// Vercel serverless wrapper for the compiled api-server
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let app;

try {
  // Import the compiled API server
  const apiServerPath = join(__dirname, '..', 'api-server', 'dist', 'index.js');
  const apiServerModule = await import(apiServerPath);
  
  // Get the Express app (should be the default export)
  app = apiServerModule.default;
  
  if (!app) {
    throw new Error('No default export found from api-server');
  }
  
  console.log('✅ Successfully loaded api-server');
  
} catch (error) {
  console.error('❌ Failed to load api-server:', error);
  
  // Fallback: create a simple Express app
  const express = require('express');
  const cors = require('cors');
  
  app = express();
  app.use(cors());
  app.use(express.json());
  
  app.get('/health', (req, res) => {
    res.json({
      status: 'fallback',
      message: 'API server not loaded, using fallback',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  });
  
  app.get('/api/v1/prices/:currencyPair/spot', async (req, res) => {
    try {
      const { currencyPair } = req.params;
      const response = await fetch(`https://api.coinbase.com/v2/prices/${currencyPair}/spot`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch price',
        message: error.message
      });
    }
  });
  
  app.use('*', (req, res) => {
    res.status(503).json({
      error: 'API server not fully loaded',
      message: 'Using fallback implementation',
      path: req.originalUrl
    });
  });
}

// Export for Vercel
export default app; 