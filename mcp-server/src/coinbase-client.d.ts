import { CoinbaseAsset, CoinbaseSpotPrice, CoinbaseExchangeRate, CoinbaseHistoricalPrice, CoinbaseStats, CoinbaseTime, PriceAnalysis } from './types.js';
export declare class CoinbaseClient {
    private client;
    private baseUrl;
    private requestCount;
    private requestWindow;
    private readonly maxRequestsPerMinute;
    constructor(apiUrl?: string);
    private checkRateLimit;
    /**
     * Get current spot price for a currency pair
     */
    getSpotPrice(currencyPair: string): Promise<CoinbaseSpotPrice>;
    /**
     * Get historical prices for a currency pair
     */
    getHistoricalPrices(currencyPair: string, start?: string, end?: string, period?: 'hour' | 'day'): Promise<CoinbaseHistoricalPrice>;
    /**
     * Get exchange rates for a currency
     */
    getExchangeRates(currency: string): Promise<CoinbaseExchangeRate>;
    /**
     * List all currencies (both fiat and crypto)
     */
    getCurrencies(): Promise<{
        data: CoinbaseAsset[];
    }>;
    /**
     * Get 24hr stats for a currency pair
     */
    getStats(currencyPair: string): Promise<CoinbaseStats>;
    /**
     * Get current server time
     */
    getTime(): Promise<CoinbaseTime>;
    /**
     * Search for assets by name or symbol
     */
    searchAssets(query: string, limit?: number): Promise<CoinbaseAsset[]>;
    /**
     * Get detailed information about a specific asset
     */
    getAssetDetails(assetId: string): Promise<CoinbaseAsset | null>;
    /**
     * Analyze price data for trends and patterns
     */
    analyzePriceData(currencyPair: string, period: '1d' | '7d' | '30d' | '1y', metrics?: ('volatility' | 'trend' | 'support_resistance' | 'volume')[]): Promise<PriceAnalysis>;
    /**
     * Get popular trading pairs
     */
    getPopularPairs(): Promise<string[]>;
    private handleError;
}
//# sourceMappingURL=coinbase-client.d.ts.map