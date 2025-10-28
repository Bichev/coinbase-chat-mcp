import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { config } from 'dotenv';
import { createLogger, format, transports } from 'winston';
import { CoinbaseClient } from './coinbase-client.js';
import { DemoWalletClient } from './demo-wallet-client.js';
import path from 'path';
import { fileURLToPath } from 'url';
// Load environment variables
config();
// Logger setup
const logger = createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: format.combine(format.timestamp(), format.errors({ stack: true }), format.json()),
    transports: [
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/combined.log' }),
        new transports.Console({
            format: format.combine(format.colorize(), format.simple())
        })
    ]
});
// Express app setup
const app = express();
const PORT = process.env.PORT || 3002;
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
const coinbaseClient = new CoinbaseClient(process.env.COINBASE_API_URL);
// Demo Wallet client
const demoWalletClient = new DemoWalletClient(coinbaseClient);
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
                url: `http://localhost:${PORT}`,
                description: 'Development server'
            }
        ]
    },
    apis: ['./src/routes/*.ts', './src/index.ts']
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Health check endpoint
/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the health status of the API server
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "healthy"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptime:
 *                   type: number
 *                   description: Server uptime in seconds
 */
app.get('/health', (_req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});
// API Routes
/**
 * @swagger
 * /api/v1/prices/{currencyPair}:
 *   get:
 *     summary: Get current spot price
 *     description: Get the current spot price for a cryptocurrency pair
 *     parameters:
 *       - in: path
 *         name: currencyPair
 *         required: true
 *         schema:
 *           type: string
 *         description: Currency pair (e.g., BTC-USD)
 *         example: BTC-USD
 *     responses:
 *       200:
 *         description: Current spot price
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     amount:
 *                       type: string
 *                       example: "45000.00"
 *                     base:
 *                       type: string
 *                       example: "BTC"
 *                     currency:
 *                       type: string
 *                       example: "USD"
 *       400:
 *         description: Invalid currency pair
 *       500:
 *         description: Internal server error
 */
// Get spot price
app.get('/api/v1/prices/:currencyPair/spot', async (req, res) => {
    try {
        const { currencyPair } = req.params;
        const data = await coinbaseClient.getSpotPrice(currencyPair);
        res.json(data);
    }
    catch (error) {
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
    }
    catch (error) {
        logger.error('Error fetching spot price:', error);
        res.status(500).json({
            error: 'Failed to fetch spot price',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
/**
 * @swagger
 * /api/v1/prices/{currencyPair}/historical:
 *   get:
 *     summary: Get historical prices
 *     description: Get historical price data for a cryptocurrency pair
 *     parameters:
 *       - in: path
 *         name: currencyPair
 *         required: true
 *         schema:
 *           type: string
 *         description: Currency pair (e.g., BTC-USD)
 *       - in: query
 *         name: start
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date (YYYY-MM-DD)
 *       - in: query
 *         name: end
 *         schema:
 *           type: string
 *           format: date
 *         description: End date (YYYY-MM-DD)
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [hour, day]
 *           default: day
 *         description: Data granularity
 *     responses:
 *       200:
 *         description: Historical price data
 *       400:
 *         description: Invalid parameters
 *       500:
 *         description: Internal server error
 */
// Get historical prices - new route
app.get('/api/v1/prices/:currencyPair/historic', async (req, res) => {
    try {
        const { currencyPair } = req.params;
        const { start, end, period = 'day' } = req.query;
        const data = await coinbaseClient.getHistoricalPrices(currencyPair, start, end, period);
        res.json(data);
    }
    catch (error) {
        logger.error('Error fetching historical prices:', error);
        res.status(500).json({
            error: 'Failed to fetch historical prices',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Legacy route
app.get('/api/v1/prices/:currencyPair/historical', async (req, res) => {
    try {
        const { currencyPair } = req.params;
        const { start, end, period = 'day' } = req.query;
        const data = await coinbaseClient.getHistoricalPrices(currencyPair, start, end, period);
        res.json(data);
    }
    catch (error) {
        logger.error('Error fetching historical prices:', error);
        res.status(500).json({
            error: 'Failed to fetch historical prices',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
/**
 * @swagger
 * /api/v1/exchange-rates:
 *   get:
 *     summary: Get exchange rates
 *     description: Get exchange rates for a base currency
 *     parameters:
 *       - in: query
 *         name: currency
 *         required: true
 *         schema:
 *           type: string
 *         description: Base currency code
 *         example: USD
 *     responses:
 *       200:
 *         description: Exchange rates data
 *       400:
 *         description: Missing currency parameter
 *       500:
 *         description: Internal server error
 */
app.get('/api/v1/exchange-rates', async (req, res) => {
    try {
        const { currency } = req.query;
        if (!currency) {
            return res.status(400).json({
                error: 'Currency parameter is required'
            });
        }
        const data = await coinbaseClient.getExchangeRates(currency);
        res.json(data);
    }
    catch (error) {
        logger.error('Error fetching exchange rates:', error);
        res.status(500).json({
            error: 'Failed to fetch exchange rates',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
/**
 * @swagger
 * /api/v1/assets:
 *   get:
 *     summary: Get all available assets
 *     description: Get list of all available cryptocurrencies and fiat currencies
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search query for asset filtering
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Maximum number of results
 *     responses:
 *       200:
 *         description: List of assets
 *       500:
 *         description: Internal server error
 */
// Search assets route
app.get('/api/v1/assets/search', async (req, res) => {
    try {
        const { query, limit = '50' } = req.query;
        if (!query) {
            return res.status(400).json({
                error: 'Query parameter is required'
            });
        }
        const data = await coinbaseClient.searchAssets(query, parseInt(limit));
        res.json({ data });
    }
    catch (error) {
        logger.error('Error searching assets:', error);
        res.status(500).json({
            error: 'Failed to search assets',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
app.get('/api/v1/assets', async (req, res) => {
    try {
        const { search, limit = '50' } = req.query;
        if (search) {
            const data = await coinbaseClient.searchAssets(search, parseInt(limit));
            res.json({ data });
        }
        else {
            const data = await coinbaseClient.getCurrencies();
            const limitedData = {
                ...data,
                data: data.data.slice(0, parseInt(limit))
            };
            res.json(limitedData);
        }
    }
    catch (error) {
        logger.error('Error fetching assets:', error);
        res.status(500).json({
            error: 'Failed to fetch assets',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
/**
 * @swagger
 * /api/v1/assets/{assetId}:
 *   get:
 *     summary: Get asset details
 *     description: Get detailed information about a specific asset
 *     parameters:
 *       - in: path
 *         name: assetId
 *         required: true
 *         schema:
 *           type: string
 *         description: Asset ID or symbol
 *         example: BTC
 *     responses:
 *       200:
 *         description: Asset details
 *       404:
 *         description: Asset not found
 *       500:
 *         description: Internal server error
 */
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
    }
    catch (error) {
        logger.error('Error fetching asset details:', error);
        res.status(500).json({
            error: 'Failed to fetch asset details',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
/**
 * @swagger
 * /api/v1/markets/{currencyPair}/stats:
 *   get:
 *     summary: Get market statistics
 *     description: Get 24-hour market statistics for a currency pair
 *     parameters:
 *       - in: path
 *         name: currencyPair
 *         required: true
 *         schema:
 *           type: string
 *         description: Currency pair
 *         example: BTC-USD
 *     responses:
 *       200:
 *         description: Market statistics
 *       500:
 *         description: Internal server error
 */
app.get('/api/v1/markets/:currencyPair/stats', async (req, res) => {
    try {
        const { currencyPair } = req.params;
        const data = await coinbaseClient.getStats(currencyPair);
        res.json(data);
    }
    catch (error) {
        logger.error('Error fetching market stats:', error);
        res.status(500).json({
            error: 'Failed to fetch market stats',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
/**
 * @swagger
 * /api/v1/popular-pairs:
 *   get:
 *     summary: Get popular trading pairs
 *     description: Get a list of popular cryptocurrency trading pairs
 *     responses:
 *       200:
 *         description: List of popular trading pairs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "BTC-USD"
 */
app.get('/api/v1/popular-pairs', async (_req, res) => {
    try {
        const data = await coinbaseClient.getPopularPairs();
        res.json({ data });
    }
    catch (error) {
        logger.error('Error fetching popular pairs:', error);
        res.status(500).json({
            error: 'Failed to fetch popular pairs',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
/**
 * @swagger
 * /api/v1/analysis/{currencyPair}:
 *   get:
 *     summary: Analyze price data
 *     description: Perform technical analysis on cryptocurrency price data
 *     parameters:
 *       - in: path
 *         name: currencyPair
 *         required: true
 *         schema:
 *           type: string
 *         description: Currency pair
 *         example: BTC-USD
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [1d, 7d, 30d, 1y]
 *           default: 1d
 *         description: Analysis period
 *       - in: query
 *         name: metrics
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum: [volatility, trend, support_resistance, volume]
 *         description: Analysis metrics to include
 *         style: form
 *         explode: false
 *     responses:
 *       200:
 *         description: Price analysis results
 *       500:
 *         description: Internal server error
 */
app.get('/api/v1/analysis/:currencyPair', async (req, res) => {
    try {
        const { currencyPair } = req.params;
        const { period = '1d', metrics } = req.query;
        const validMetrics = ['volatility', 'trend', 'support_resistance', 'volume'];
        const metricsArray = metrics
            ? (Array.isArray(metrics) ? metrics : [metrics]).filter((m) => validMetrics.includes(m))
            : ['volatility', 'trend'];
        const data = await coinbaseClient.analyzePriceData(currencyPair, period, metricsArray);
        res.json({ data });
    }
    catch (error) {
        logger.error('Error analyzing price data:', error);
        res.status(500).json({
            error: 'Failed to analyze price data',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// 🍺₿ DEMO TRANSACTION ENDPOINTS 🍺₿
/**
 * @swagger
 * /api/v1/wallet/calculate-beer-cost:
 *   get:
 *     summary: Calculate beer cost in crypto
 *     description: Calculate how much crypto you can buy with beer money
 *     parameters:
 *       - in: query
 *         name: currency
 *         schema:
 *           type: string
 *           default: BTC
 *         description: Cryptocurrency to calculate
 *       - in: query
 *         name: beerCount
 *         schema:
 *           type: number
 *           default: 1
 *         description: Number of beers
 *       - in: query
 *         name: pricePerBeer
 *         schema:
 *           type: number
 *           default: 5
 *         description: Price per beer in USD
 *     responses:
 *       200:
 *         description: Beer cost calculation
 *       500:
 *         description: Internal server error
 */
app.get('/api/v1/wallet/calculate-beer-cost', async (req, res) => {
    try {
        const { currency = 'BTC', beerCount = '1', pricePerBeer = '5' } = req.query;
        const calculation = await demoWalletClient.calculateBeerCost(currency, parseInt(beerCount), parseFloat(pricePerBeer));
        res.json({ data: calculation });
    }
    catch (error) {
        logger.error('Error calculating beer cost:', error);
        res.status(500).json({
            error: 'Failed to calculate beer cost',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
/**
 * @swagger
 * /api/v1/wallet/purchase:
 *   post:
 *     summary: Simulate crypto purchase
 *     description: Simulate buying cryptocurrency with USD
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fromCurrency
 *               - toCurrency
 *               - amount
 *             properties:
 *               fromCurrency:
 *                 type: string
 *                 example: USD
 *               toCurrency:
 *                 type: string
 *                 example: BTC
 *               amount:
 *                 type: number
 *                 example: 5
 *               description:
 *                 type: string
 *                 example: Beer money investment
 *     responses:
 *       200:
 *         description: Transaction successful
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Internal server error
 */
app.post('/api/v1/wallet/purchase', async (req, res) => {
    try {
        const { fromCurrency, toCurrency, amount, description } = req.body;
        if (!fromCurrency || !toCurrency || !amount) {
            return res.status(400).json({
                error: 'Missing required fields: fromCurrency, toCurrency, amount'
            });
        }
        const transaction = await demoWalletClient.simulatePurchase(fromCurrency, toCurrency, parseFloat(amount), description);
        res.json({ data: transaction });
    }
    catch (error) {
        logger.error('Error simulating purchase:', error);
        res.status(500).json({
            error: 'Failed to simulate purchase',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
/**
 * @swagger
 * /api/v1/wallet:
 *   get:
 *     summary: Get virtual wallet
 *     description: Get demo wallet balance and statistics
 *     responses:
 *       200:
 *         description: Wallet information
 *       500:
 *         description: Internal server error
 */
app.get('/api/v1/wallet', async (_req, res) => {
    try {
        const wallet = demoWalletClient.getWallet();
        const stats = demoWalletClient.getWalletStats();
        res.json({
            data: {
                wallet,
                stats
            }
        });
    }
    catch (error) {
        logger.error('Error fetching wallet:', error);
        res.status(500).json({
            error: 'Failed to fetch wallet',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
/**
 * @swagger
 * /api/v1/wallet/transactions:
 *   get:
 *     summary: Get transaction history
 *     description: Get demo transaction history with optional filtering
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 10
 *         description: Maximum number of transactions
 *       - in: query
 *         name: currency
 *         schema:
 *           type: string
 *         description: Filter by currency
 *     responses:
 *       200:
 *         description: Transaction history
 *       500:
 *         description: Internal server error
 */
app.get('/api/v1/wallet/transactions', async (req, res) => {
    try {
        const { limit = '10', currency } = req.query;
        const transactions = demoWalletClient.getTransactionHistory(parseInt(limit), currency);
        res.json({ data: transactions });
    }
    catch (error) {
        logger.error('Error fetching transactions:', error);
        res.status(500).json({
            error: 'Failed to fetch transactions',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
/**
 * @swagger
 * /api/v1/wallet/reset:
 *   post:
 *     summary: Reset virtual wallet
 *     description: Reset demo wallet to initial state
 *     responses:
 *       200:
 *         description: Wallet reset successful
 *       500:
 *         description: Internal server error
 */
app.post('/api/v1/wallet/reset', async (_req, res) => {
    try {
        demoWalletClient.resetWallet();
        const wallet = demoWalletClient.getWallet();
        res.json({
            data: wallet,
            message: 'Wallet reset to initial state'
        });
    }
    catch (error) {
        logger.error('Error resetting wallet:', error);
        res.status(500).json({
            error: 'Failed to reset wallet',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
/**
 * @swagger
 * /api/v1/wallet/buy-beer:
 *   post:
 *     summary: Buy virtual beer with cryptocurrency
 *     description: Purchase virtual beer using crypto (creates circular economy - BTC → Beer)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *                 example: 1
 *                 default: 1
 *               currency:
 *                 type: string
 *                 example: BTC
 *                 default: BTC
 *               pricePerBeer:
 *                 type: number
 *                 example: 5
 *                 default: 5
 *     responses:
 *       200:
 *         description: Beer purchase successful or needs more crypto
 *       500:
 *         description: Internal server error
 */
app.post('/api/v1/wallet/buy-beer', async (req, res) => {
    try {
        const { quantity = 1, currency = 'BTC', pricePerBeer = 5 } = req.body;
        const result = await demoWalletClient.buyVirtualBeer(quantity, currency, pricePerBeer);
        if (!result.success) {
            return res.status(200).json({
                success: false,
                needsMoreCrypto: result.needsMoreCrypto,
                suggestedAmount: result.suggestedAmount,
                message: result.message
            });
        }
        res.json({
            success: true,
            data: result.transaction,
            message: result.message
        });
    }
    catch (error) {
        logger.error('Error buying virtual beer:', error);
        res.status(500).json({
            error: 'Failed to buy virtual beer',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Serve static files from frontend (for Vercel deployment)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Serve static files from the frontend build
app.use(express.static(path.join(__dirname, '../../frontend/dist')));
// Handle React routing - serve index.html for all non-API routes
app.get('*', (req, res) => {
    // Don't serve index.html for API routes
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({
            error: 'API route not found',
            path: req.originalUrl
        });
    }
    // Serve index.html for all other routes (React app)
    res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});
// Error handling middleware
app.use((err, _req, res, _next) => {
    logger.error('Unhandled error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});
// For local development, start server
if (process.env.NODE_ENV !== 'production') {
    const server = app.listen(PORT, () => {
        logger.info(`API Server running on port ${PORT}`);
        logger.info(`API Documentation available at http://localhost:${PORT}/api-docs`);
    });
    // Graceful shutdown
    process.on('SIGTERM', () => {
        logger.info('SIGTERM received, shutting down gracefully');
        server.close(() => {
            logger.info('Process terminated');
            process.exit(0);
        });
    });
    process.on('SIGINT', () => {
        logger.info('SIGINT received, shutting down gracefully');
        server.close(() => {
            logger.info('Process terminated');
            process.exit(0);
        });
    });
}
export default app;
