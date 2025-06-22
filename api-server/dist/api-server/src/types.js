import { z } from 'zod';
// Error Classes
export class CoinbaseAPIError extends Error {
    statusCode;
    errorId;
    constructor(message, statusCode, errorId) {
        super(message);
        this.statusCode = statusCode;
        this.errorId = errorId;
        this.name = 'CoinbaseAPIError';
    }
}
export class RateLimitError extends Error {
    retryAfter;
    constructor(message, retryAfter) {
        super(message);
        this.retryAfter = retryAfter;
        this.name = 'RateLimitError';
    }
}
// Input validation schemas
export const GetSpotPriceInputSchema = z.object({
    currencyPair: z.string().describe('Currency pair (e.g., BTC-USD)')
});
export const GetHistoricalPricesInputSchema = z.object({
    currencyPair: z.string().describe('Currency pair (e.g., BTC-USD)'),
    start: z.string().optional().describe('Start date (ISO format)'),
    end: z.string().optional().describe('End date (ISO format)'),
    period: z.enum(['hour', 'day']).optional().describe('Price period granularity')
});
export const GetExchangeRatesInputSchema = z.object({
    currency: z.string().describe('Base currency code (e.g., USD)')
});
export const SearchAssetsInputSchema = z.object({
    query: z.string().describe('Search query for asset name or code'),
    limit: z.number().optional().describe('Maximum number of results')
});
export const GetAssetDetailsInputSchema = z.object({
    assetId: z.string().describe('Asset ID or code (e.g., BTC)')
});
export const GetMarketStatsInputSchema = z.object({
    currencyPair: z.string().describe('Currency pair (e.g., BTC-USD)')
});
export const AnalyzePriceDataInputSchema = z.object({
    currencyPair: z.string().describe('Currency pair (e.g., BTC-USD)'),
    period: z.enum(['1d', '7d', '30d', '1y']).describe('Analysis period'),
    metrics: z.array(z.enum(['volatility', 'trend', 'support_resistance', 'volume']))
        .describe('Analysis metrics to include')
});
