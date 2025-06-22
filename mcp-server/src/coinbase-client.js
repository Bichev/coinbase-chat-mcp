import axios from 'axios';
import { CoinbaseAPIError, RateLimitError } from './types.js';
export class CoinbaseClient {
    client;
    baseUrl;
    requestCount = 0;
    requestWindow = Date.now();
    maxRequestsPerMinute = 100;
    constructor(apiUrl = 'https://api.coinbase.com/v2') {
        this.baseUrl = apiUrl;
        this.client = axios.create({
            baseURL: this.baseUrl,
            timeout: 10000,
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Coinbase-MCP-Server/1.0.0'
            }
        });
        // Add request interceptor for rate limiting
        this.client.interceptors.request.use((config) => {
            this.checkRateLimit();
            return config;
        }, (error) => Promise.reject(error));
        // Add response interceptor for error handling
        this.client.interceptors.response.use((response) => response, (error) => {
            if (error.response) {
                throw new CoinbaseAPIError(error.response.data?.message || error.message, error.response.status, error.response.data);
            }
            throw error;
        });
    }
    checkRateLimit() {
        const now = Date.now();
        const oneMinute = 60 * 1000;
        // Reset counter if window has passed
        if (now - this.requestWindow > oneMinute) {
            this.requestCount = 0;
            this.requestWindow = now;
        }
        if (this.requestCount >= this.maxRequestsPerMinute) {
            throw new RateLimitError('Rate limit exceeded. Please wait before making more requests.', Math.ceil((oneMinute - (now - this.requestWindow)) / 1000));
        }
        this.requestCount++;
    }
    /**
     * Get current spot price for a currency pair
     */
    async getSpotPrice(currencyPair) {
        try {
            const response = await this.client.get(`/prices/${currencyPair}/spot`);
            return response.data;
        }
        catch (error) {
            throw this.handleError(error, 'Failed to fetch spot price');
        }
    }
    /**
     * Get historical prices for a currency pair
     */
    async getHistoricalPrices(currencyPair, start, end, period = 'day') {
        try {
            const params = { period };
            if (start)
                params.start = start;
            if (end)
                params.end = end;
            const response = await this.client.get(`/prices/${currencyPair}/historic`, { params });
            return response.data;
        }
        catch (error) {
            throw this.handleError(error, 'Failed to fetch historical prices');
        }
    }
    /**
     * Get exchange rates for a currency
     */
    async getExchangeRates(currency) {
        try {
            const response = await this.client.get(`/exchange-rates?currency=${currency}`);
            return response.data;
        }
        catch (error) {
            throw this.handleError(error, 'Failed to fetch exchange rates');
        }
    }
    /**
     * List all currencies (both fiat and crypto)
     */
    async getCurrencies() {
        try {
            const response = await this.client.get('/currencies');
            return response.data;
        }
        catch (error) {
            throw this.handleError(error, 'Failed to fetch currencies');
        }
    }
    /**
     * Get 24hr stats for a currency pair
     */
    async getStats(currencyPair) {
        try {
            const response = await this.client.get(`/prices/${currencyPair}/stats`);
            return response.data;
        }
        catch (error) {
            throw this.handleError(error, 'Failed to fetch market stats');
        }
    }
    /**
     * Get current server time
     */
    async getTime() {
        try {
            const response = await this.client.get('/time');
            return response.data;
        }
        catch (error) {
            throw this.handleError(error, 'Failed to fetch server time');
        }
    }
    /**
     * Search for assets by name or symbol
     */
    async searchAssets(query, limit = 10) {
        try {
            const currencies = await this.getCurrencies();
            const searchTerm = query.toLowerCase();
            return currencies.data
                .filter(asset => asset.name.toLowerCase().includes(searchTerm) ||
                asset.code.toLowerCase().includes(searchTerm) ||
                asset.id.toLowerCase().includes(searchTerm))
                .slice(0, limit);
        }
        catch (error) {
            throw this.handleError(error, 'Failed to search assets');
        }
    }
    /**
     * Get detailed information about a specific asset
     */
    async getAssetDetails(assetId) {
        try {
            const currencies = await this.getCurrencies();
            return currencies.data.find(asset => asset.id.toLowerCase() === assetId.toLowerCase() ||
                asset.code.toLowerCase() === assetId.toLowerCase()) || null;
        }
        catch (error) {
            throw this.handleError(error, 'Failed to fetch asset details');
        }
    }
    /**
     * Analyze price data for trends and patterns
     */
    async analyzePriceData(currencyPair, period, metrics = ['volatility', 'trend']) {
        try {
            // Get current price and stats
            const [spotPrice, stats] = await Promise.all([
                this.getSpotPrice(currencyPair),
                this.getStats(currencyPair)
            ]);
            const currentPrice = parseFloat(spotPrice.data.amount);
            const open = parseFloat(stats.data.open);
            const high = parseFloat(stats.data.high);
            const low = parseFloat(stats.data.low);
            const volume = parseFloat(stats.data.volume);
            // Calculate basic metrics
            const priceChange24h = currentPrice - open;
            const priceChangePercent24h = ((currentPrice - open) / open) * 100;
            // Calculate volatility (simplified using high-low range)
            const volatility = ((high - low) / open) * 100;
            // Determine trend
            let trend = 'sideways';
            if (priceChangePercent24h > 2)
                trend = 'bullish';
            else if (priceChangePercent24h < -2)
                trend = 'bearish';
            // Basic support and resistance levels
            const supportLevel = metrics.includes('support_resistance') ? low * 0.98 : undefined;
            const resistanceLevel = metrics.includes('support_resistance') ? high * 1.02 : undefined;
            return {
                currentPrice,
                volatility,
                trend,
                supportLevel,
                resistanceLevel,
                volume24h: metrics.includes('volume') ? volume : undefined,
                priceChange24h,
                priceChangePercent24h
            };
        }
        catch (error) {
            throw this.handleError(error, 'Failed to analyze price data');
        }
    }
    /**
     * Get popular trading pairs
     */
    async getPopularPairs() {
        // Return commonly traded pairs with USD
        return [
            'BTC-USD', 'ETH-USD', 'LTC-USD', 'BCH-USD', 'ADA-USD',
            'DOT-USD', 'UNI-USD', 'LINK-USD', 'XLM-USD', 'USDC-USD',
            'AAVE-USD', 'SOL-USD', 'MATIC-USD', 'AVAX-USD', 'ALGO-USD'
        ];
    }
    handleError(error, message) {
        if (error instanceof CoinbaseAPIError || error instanceof RateLimitError) {
            return error;
        }
        return new Error(`${message}: ${error.message}`);
    }
}
//# sourceMappingURL=coinbase-client.js.map