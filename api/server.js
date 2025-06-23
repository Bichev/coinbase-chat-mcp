// Vercel serverless wrapper for the full Express API server
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import the built API server
let app;

try {
  // Try to import the built TypeScript version
  const apiServerPath = join(__dirname, '..', 'api-server', 'dist', 'index.js');
  app = (await import(apiServerPath)).default;
} catch (error) {
  console.error('Failed to import built API server, falling back to simple implementation:', error);
  
  // Fallback to simple Express app if the full server fails
  const express = require('express');
  const cors = require('cors');
  
  app = express();
  app.use(cors());
  app.use(express.json());
  
  // Simple health check
  app.get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'coinbase-mcp-api-fallback'
    });
  });
  
  // Simple Bitcoin price endpoint
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
  
  // Fallback for other endpoints
  app.use('/api/*', (req, res) => {
    res.status(503).json({
      error: 'API server not fully loaded',
      message: 'Please try again in a moment'
    });
  });
}

// Export for Vercel
export default app; 