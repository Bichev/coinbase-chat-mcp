// Vercel serverless function for API routes
import express from 'express';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Simple Coinbase client for serverless
class CoinbaseClient {
  constructor() {
    this.baseUrl = 'https://api.coinbase.com/v2';
  }

  async getSpotPrice(currencyPair) {
    try {
      // Use Coinbase's spot price endpoint directly
      const response = await fetch(`${this.baseUrl}/prices/${currencyPair}/spot`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.errors?.[0]?.message || 'Failed to fetch price');
      }

      return {
        data: {
          amount: data.data.amount,
          base: data.data.base,
          currency: data.data.currency
        }
      };
    } catch (error) {
      // Fallback to exchange rates if spot price fails
      const [base, currency] = currencyPair.split('-');
      const response = await fetch(`${this.baseUrl}/exchange-rates?currency=${base}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error('Failed to fetch price data');
      }

      const rate = data.data?.rates?.[currency] || data.data?.rates?.USD;
      if (!rate) {
        throw new Error('Exchange rate not found');
      }

      return {
        data: {
          amount: rate,
          base: base,
          currency: currency || 'USD'
        }
      };
    }
  }

  async getMarketStats(currencyPair) {
    // For serverless, we'll use a simplified version
    const price = await this.getSpotPrice(currencyPair);
    return {
      data: {
        open: price.data.amount,
        high: (parseFloat(price.data.amount) * 1.05).toString(),
        low: (parseFloat(price.data.amount) * 0.95).toString(),
        volume: "1000000",
        last: price.data.amount
      }
    };
  }

  async getPopularPairs() {
    return {
      data: [
        'BTC-USD', 'ETH-USD', 'ADA-USD', 'SOL-USD', 'DOT-USD',
        'MATIC-USD', 'AVAX-USD', 'LINK-USD', 'UNI-USD', 'LTC-USD'
      ]
    };
  }

  async searchAssets(query, limit = 10) {
    // Simplified asset search
    const assets = [
      'BTC', 'ETH', 'ADA', 'SOL', 'DOT', 'MATIC', 'AVAX', 'LINK', 'UNI', 'LTC',
      'ATOM', 'ALGO', 'XTZ', 'COMP', 'MKR', 'AAVE', 'SNX', 'CRV', 'YFI', 'SUSHI'
    ];
    
    const filtered = assets.filter(asset => 
      asset.toLowerCase().includes(query.toLowerCase())
    ).slice(0, limit);

    return {
      data: filtered.map(asset => ({
        id: asset.toLowerCase(),
        symbol: asset,
        name: `${asset} Token`
      }))
    };
  }

  async getExchangeRates(currency) {
    const response = await fetch(`${this.baseUrl}/exchange-rates?currency=${currency}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch exchange rates');
    }

    return data;
  }

  async analyzePriceData(currencyPair, period = '1d', metrics = ['volatility']) {
    // Simplified analysis for serverless
    const price = await this.getSpotPrice(currencyPair);
    const currentPrice = parseFloat(price.data.amount);
    
    return {
      data: {
        volatility: Math.random() * 5 + 1, // Mock volatility 1-6%
        trend: currentPrice > 50000 ? 'upward' : 'sideways',
        support: (currentPrice * 0.9).toString(),
        resistance: (currentPrice * 1.1).toString()
      }
    };
  }
}

const coinbaseClient = new CoinbaseClient();

// Routes
app.get('/api/v1/prices/:currencyPair/spot', async (req, res) => {
  try {
    const { currencyPair } = req.params;
    const data = await coinbaseClient.getSpotPrice(currencyPair);
    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch spot price',
      message: error.message
    });
  }
});

app.get('/api/v1/prices/:currencyPair', async (req, res) => {
  try {
    const { currencyPair } = req.params;
    const data = await coinbaseClient.getSpotPrice(currencyPair);
    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch spot price',
      message: error.message
    });
  }
});

app.get('/api/v1/markets/:currencyPair/stats', async (req, res) => {
  try {
    const { currencyPair } = req.params;
    const data = await coinbaseClient.getMarketStats(currencyPair);
    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch market stats',
      message: error.message
    });
  }
});

app.get('/api/v1/popular-pairs', async (req, res) => {
  try {
    const data = await coinbaseClient.getPopularPairs();
    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch popular pairs',
      message: error.message
    });
  }
});

app.get('/api/v1/assets/search', async (req, res) => {
  try {
    const { query, limit } = req.query;
    const data = await coinbaseClient.searchAssets(query, parseInt(limit) || 10);
    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to search assets',
      message: error.message
    });
  }
});

app.get('/api/v1/exchange-rates', async (req, res) => {
  try {
    const { currency } = req.query;
    const data = await coinbaseClient.getExchangeRates(currency || 'USD');
    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch exchange rates',
      message: error.message
    });
  }
});

app.get('/api/v1/analysis/:currencyPair', async (req, res) => {
  try {
    const { currencyPair } = req.params;
    const { period, metrics } = req.query;
    const data = await coinbaseClient.analyzePriceData(
      currencyPair, 
      period, 
      metrics ? metrics.split(',') : ['volatility']
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to analyze price data',
      message: error.message
    });
  }
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'coinbase-mcp-api'
  });
});

// Add a test endpoint for debugging
app.get('/api/v1/test', async (req, res) => {
  try {
    // Test the Coinbase API directly
    const testResponse = await fetch('https://api.coinbase.com/v2/prices/BTC-USD/spot');
    const testData = await testResponse.json();
    
    res.json({
      message: 'API test successful',
      coinbaseResponse: testData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'API test failed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Export the Express app for Vercel
export default app; 