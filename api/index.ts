// Vercel serverless function that uses the full API server
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { createLogger, format, transports } from 'winston';
import { CoinbaseClient } from './coinbase-client.js';

// Logger setup for Vercel (simplified)
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    })
  ]
});

// Express app setup
const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/', limiter);

// Coinbase client
const coinbaseClient = new CoinbaseClient(process.env.COINBASE_API_URL || 'https://api.coinbase.com/v2');

// Swagger documentation setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Coinbase Chat MCP API',
      version: '1.0.0',
      description: 'REST API for Coinbase public cryptocurrency data',
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'https://coinbase-chat-mcp-frontend.vercel.app',
        description: 'Production server'
      }
    ]
  },
  apis: ['./api/*.ts']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes - All the endpoints from your original api-server

// Get spot price
app.get('/api/v1/prices/:currencyPair/spot', async (req, res) => {
  try {
    const { currencyPair } = req.params;
    const data = await coinbaseClient.getSpotPrice(currencyPair);
    res.json(data);
  } catch (error) {
    logger.error('Error fetching spot price:', error);
    res.status(500).json({
      error: 'Failed to fetch spot price',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Legacy route for compatibility
app.get('/api/v1/prices/:currencyPair', async (req, res) => {
  try {
    const { currencyPair } = req.params;
    const data = await coinbaseClient.getSpotPrice(currencyPair);
    res.json(data);
  } catch (error) {
    logger.error('Error fetching spot price:', error);
    res.status(500).json({
      error: 'Failed to fetch spot price',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Historical prices
app.get('/api/v1/prices/:currencyPair/historical', async (req, res) => {
  try {
    const { currencyPair } = req.params;
    const { start, end, period } = req.query;
    const data = await coinbaseClient.getHistoricalPrices(
      currencyPair,
      start as string,
      end as string,
      period as 'hour' | 'day'
    );
    res.json(data);
  } catch (error) {
    logger.error('Error fetching historical prices:', error);
    res.status(500).json({
      error: 'Failed to fetch historical prices',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Exchange rates
app.get('/api/v1/exchange-rates', async (req, res) => {
  try {
    const { currency } = req.query;
    const data = await coinbaseClient.getExchangeRates(currency as string);
    res.json(data);
  } catch (error) {
    logger.error('Error fetching exchange rates:', error);
    res.status(500).json({
      error: 'Failed to fetch exchange rates',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Search assets
app.get('/api/v1/assets/search', async (req, res) => {
  try {
    const { query, limit } = req.query;
    const data = await coinbaseClient.searchAssets(
      query as string,
      limit ? parseInt(limit as string) : 10
    );
    res.json({ data });
  } catch (error) {
    logger.error('Error searching assets:', error);
    res.status(500).json({
      error: 'Failed to search assets',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Asset details
app.get('/api/v1/assets/:assetId', async (req, res) => {
  try {
    const { assetId } = req.params;
    const data = await coinbaseClient.getAssetDetails(assetId);
    
    if (!data) {
      return res.status(404).json({
        error: 'Asset not found'
      });
    }
    
    res.json({ data });
  } catch (error) {
    logger.error('Error fetching asset details:', error);
    res.status(500).json({
      error: 'Failed to fetch asset details',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Market stats
app.get('/api/v1/markets/:currencyPair/stats', async (req, res) => {
  try {
    const { currencyPair } = req.params;
    const data = await coinbaseClient.getStats(currencyPair);
    res.json(data);
  } catch (error) {
    logger.error('Error fetching market stats:', error);
    res.status(500).json({
      error: 'Failed to fetch market stats',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Popular pairs
app.get('/api/v1/popular-pairs', async (_req, res) => {
  try {
    const data = await coinbaseClient.getPopularPairs();
    res.json({ data });
  } catch (error) {
    logger.error('Error fetching popular pairs:', error);
    res.status(500).json({
      error: 'Failed to fetch popular pairs',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Price analysis
app.get('/api/v1/analysis/:currencyPair', async (req, res) => {
  try {
    const { currencyPair } = req.params;
    const { period = '1d', metrics } = req.query;
    
    const validMetrics = ['volatility', 'trend', 'support_resistance', 'volume'] as const;
    const metricsArray = metrics 
      ? (Array.isArray(metrics) ? metrics : [metrics]).filter((m): m is typeof validMetrics[number] => 
          validMetrics.includes(m as any))
      : ['volatility', 'trend'] as ('volatility' | 'trend' | 'support_resistance' | 'volume')[];
    
    const data = await coinbaseClient.analyzePriceData(
      currencyPair,
      period as '1d' | '7d' | '30d' | '1y',
      metricsArray
    );
    
    res.json({ data });
  } catch (error) {
    logger.error('Error analyzing price data:', error);
    res.status(500).json({
      error: 'Failed to analyze price data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Export for Vercel (no server.listen() for serverless)
export default app; 