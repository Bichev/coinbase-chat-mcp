import { z } from 'zod';
// Coinbase API Types
export const CoinbaseAssetSchema = z.object({
    id: z.string(),
    name: z.string(),
    code: z.string(),
    color: z.string().optional(),
    sort_index: z.number().optional(),
    exponent: z.number().optional(),
    type: z.enum(['fiat', 'crypto']),
    address_regex: z.string().optional(),
    asset_id: z.string().optional(),
    slug: z.string().optional()
});
export const CoinbasePriceSchema = z.object({
    amount: z.string(),
    currency: z.string()
});
export const CoinbaseSpotPriceSchema = z.object({
    data: z.object({
        amount: z.string(),
        base: z.string(),
        currency: z.string()
    })
});
export const CoinbaseExchangeRateSchema = z.object({
    data: z.object({
        currency: z.string(),
        rates: z.record(z.string())
    })
});
export const CoinbaseHistoricalPriceSchema = z.object({
    data: z.object({
        prices: z.array(z.array(z.string()))
    })
});
export const CoinbaseStatsSchema = z.object({
    data: z.object({
        open: z.string(),
        high: z.string(),
        low: z.string(),
        volume: z.string(),
        last: z.string(),
        volume_30day: z.string()
    })
});
export const CoinbaseTimeSchema = z.object({
    data: z.object({
        iso: z.string(),
        epoch: z.number()
    })
});
// Tool Input Schemas
export const GetSpotPriceInputSchema = z.object({
    currencyPair: z.string().describe('Currency pair in format BASE-QUOTE (e.g., BTC-USD)')
});
export const GetHistoricalPricesInputSchema = z.object({
    currencyPair: z.string().describe('Currency pair in format BASE-QUOTE (e.g., BTC-USD)'),
    start: z.string().optional().describe('Start date in YYYY-MM-DD format'),
    end: z.string().optional().describe('End date in YYYY-MM-DD format'),
    period: z.enum(['hour', 'day']).optional().describe('Data granularity')
});
export const GetExchangeRatesInputSchema = z.object({
    currency: z.string().describe('Base currency code (e.g., USD, EUR, BTC)')
});
export const SearchAssetsInputSchema = z.object({
    query: z.string().describe('Search query for asset name or symbol'),
    limit: z.number().optional().describe('Maximum number of results (default: 10)')
});
export const GetAssetDetailsInputSchema = z.object({
    assetId: z.string().describe('Asset ID or symbol (e.g., BTC, ETH, bitcoin)')
});
export const GetMarketStatsInputSchema = z.object({
    currencyPair: z.string().describe('Currency pair in format BASE-QUOTE (e.g., BTC-USD)')
});
export const AnalyzePriceDataInputSchema = z.object({
    currencyPair: z.string().describe('Currency pair in format BASE-QUOTE (e.g., BTC-USD)'),
    period: z.enum(['1d', '7d', '30d', '1y']).describe('Analysis period'),
    metrics: z.array(z.enum(['volatility', 'trend', 'support_resistance', 'volume'])).describe('Metrics to analyze')
});
// Error Types
export class CoinbaseAPIError extends Error {
    status;
    response;
    constructor(message, status, response) {
        super(message);
        this.status = status;
        this.response = response;
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
//# sourceMappingURL=types.js.map