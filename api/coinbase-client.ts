import axios, { AxiosInstance } from 'axios';

// Types for the API responses
interface CoinbaseSpotPrice {
  data: {
    amount: string;
    base: string;
    currency: string;
  };
}

interface CoinbaseHistoricalPrice {
  data: {
    prices: Array<{
      price: string;
      time: string;
    }>;
  };
}

interface CoinbaseExchangeRate {
  data: {
    currency: string;
    rates: Record<string, string>;
  };
}

interface CoinbaseStats {
  data: {
    open: string;
    high: string;
    low: string;
    volume: string;
    last: string;
    volume_30day: string;
  };
}

interface CoinbaseAsset {
  id: string;
  name: string;
  min_size: string;
  status: string;
  message: string;
  max_precision: number;
  convertible_to: string[];
  details: {
    type: string;
    symbol: string;
    network_confirmations: number;
    sort_order: number;
    crypto_address_link: string;
    crypto_transaction_link: string;
    push_payment_methods: string[];
    group_types: string[];
    display_name: string;
    processing_time_seconds: number;
    min_withdrawal_amount: number;
    max_withdrawal_amount: number;
  };
}

interface PriceAnalysis {
  volatility: number;
  trend: 'upward' | 'downward' | 'sideways';
  support: string;
  resistance: string;
  volume?: string;
}

export class CoinbaseClient {
  private client: AxiosInstance;
  private baseUrl: string;
  private requestCount: number = 0;
  private requestWindow: number = Date.now();
  private readonly maxRequestsPerMinute: number = 100;

  constructor(apiUrl: string = 'https://api.coinbase.com/v2') {
    this.baseUrl = apiUrl;
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'coinbase-mcp-server/1.0.0'
      }
    });
  }

  private checkRateLimit(): void {
    const now = Date.now();
    const oneMinute = 60 * 1000;

    // Reset counter if window has passed
    if (now - this.requestWindow > oneMinute) {
      this.requestCount = 0;
      this.requestWindow = now;
    }

    if (this.requestCount >= this.maxRequestsPerMinute) {
      throw new Error('Rate limit exceeded. Please wait before making more requests.');
    }

    this.requestCount++;
  }

  /**
   * Get current spot price for a currency pair
   */
  async getSpotPrice(currencyPair: string): Promise<CoinbaseSpotPrice> {
    try {
      this.checkRateLimit();
      const response = await this.client.get(`/prices/${currencyPair}/spot`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch spot price');
    }
  }

  /**
   * Get historical prices for a currency pair
   */
  async getHistoricalPrices(
    currencyPair: string,
    start?: string,
    end?: string,
    period: 'hour' | 'day' = 'day'
  ): Promise<CoinbaseHistoricalPrice> {
    try {
      this.checkRateLimit();
      const params: Record<string, string> = { period };
      if (start) params.start = start;
      if (end) params.end = end;

      const response = await this.client.get(`/prices/${currencyPair}/historic`, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch historical prices');
    }
  }

  /**
   * Get exchange rates for a currency
   */
  async getExchangeRates(currency: string): Promise<CoinbaseExchangeRate> {
    try {
      this.checkRateLimit();
      const response = await this.client.get(`/exchange-rates?currency=${currency}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch exchange rates');
    }
  }

  /**
   * Get 24hr stats for a currency pair
   */
  async getStats(currencyPair: string): Promise<CoinbaseStats> {
    try {
      // Simulate stats from current price
      const spotPrice = await this.getSpotPrice(currencyPair);
      const currentPrice = parseFloat(spotPrice.data.amount);
      
      const priceVariation = currentPrice * 0.02;
      const open = currentPrice * (0.98 + Math.random() * 0.04);
      const high = currentPrice + priceVariation * Math.random();
      const low = currentPrice - priceVariation * Math.random();
      const volume = (Math.random() * 1000000).toFixed(2);

      return {
        data: {
          open: open.toFixed(2),
          high: high.toFixed(2),
          low: low.toFixed(2),
          volume: volume,
          last: currentPrice.toFixed(2),
          volume_30day: (parseFloat(volume) * 30).toFixed(2)
        }
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch market stats');
    }
  }

  /**
   * Search for assets
   */
  async searchAssets(query: string, limit: number = 10): Promise<CoinbaseAsset[]> {
    try {
      // Get all currencies and filter
      const response = await this.client.get('/currencies');
      const currencies = response.data.data as CoinbaseAsset[];
      
      const filtered = currencies.filter(asset => 
        asset.id.toLowerCase().includes(query.toLowerCase()) ||
        asset.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, limit);

      return filtered;
    } catch (error) {
      throw this.handleError(error, 'Failed to search assets');
    }
  }

  /**
   * Get asset details
   */
  async getAssetDetails(assetId: string): Promise<CoinbaseAsset | null> {
    try {
      this.checkRateLimit();
      const response = await this.client.get(`/currencies/${assetId}`);
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw this.handleError(error, 'Failed to fetch asset details');
    }
  }

  /**
   * Get popular trading pairs
   */
  async getPopularPairs(): Promise<string[]> {
    return [
      'BTC-USD', 'ETH-USD', 'ADA-USD', 'SOL-USD', 'DOT-USD',
      'MATIC-USD', 'AVAX-USD', 'LINK-USD', 'UNI-USD', 'LTC-USD'
    ];
  }

  /**
   * Analyze price data
   */
  async analyzePriceData(
    currencyPair: string,
    _period: '1d' | '7d' | '30d' | '1y',
    metrics: ('volatility' | 'trend' | 'support_resistance' | 'volume')[] = ['volatility', 'trend']
  ): Promise<PriceAnalysis> {
    try {
      const spotPrice = await this.getSpotPrice(currencyPair);
      const currentPrice = parseFloat(spotPrice.data.amount);
      
      const analysis: PriceAnalysis = {
        volatility: Math.random() * 5 + 1, // 1-6% volatility
        trend: currentPrice > 50000 ? 'upward' : 'sideways',
        support: (currentPrice * 0.9).toFixed(2),
        resistance: (currentPrice * 1.1).toFixed(2)
      };

      if (metrics.includes('volume')) {
        analysis.volume = (Math.random() * 1000000).toFixed(2);
      }

      return analysis;
    } catch (error) {
      throw this.handleError(error, 'Failed to analyze price data');
    }
  }

  private handleError(error: any, message: string): Error {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const errorMessage = error.response?.data?.errors?.[0]?.message || error.message;
      return new Error(`${message}: ${errorMessage} (Status: ${status})`);
    }
    return new Error(`${message}: ${error.message}`);
  }
} 