import { z } from 'zod';
export declare const CoinbaseAssetSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    code: z.ZodString;
    color: z.ZodOptional<z.ZodString>;
    sort_index: z.ZodOptional<z.ZodNumber>;
    exponent: z.ZodOptional<z.ZodNumber>;
    type: z.ZodEnum<["fiat", "crypto"]>;
    address_regex: z.ZodOptional<z.ZodString>;
    asset_id: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    code: string;
    type: "fiat" | "crypto";
    color?: string | undefined;
    sort_index?: number | undefined;
    exponent?: number | undefined;
    address_regex?: string | undefined;
    asset_id?: string | undefined;
    slug?: string | undefined;
}, {
    id: string;
    name: string;
    code: string;
    type: "fiat" | "crypto";
    color?: string | undefined;
    sort_index?: number | undefined;
    exponent?: number | undefined;
    address_regex?: string | undefined;
    asset_id?: string | undefined;
    slug?: string | undefined;
}>;
export declare const CoinbasePriceSchema: z.ZodObject<{
    amount: z.ZodString;
    currency: z.ZodString;
}, "strip", z.ZodTypeAny, {
    amount: string;
    currency: string;
}, {
    amount: string;
    currency: string;
}>;
export declare const CoinbaseSpotPriceSchema: z.ZodObject<{
    data: z.ZodObject<{
        amount: z.ZodString;
        base: z.ZodString;
        currency: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        amount: string;
        currency: string;
        base: string;
    }, {
        amount: string;
        currency: string;
        base: string;
    }>;
}, "strip", z.ZodTypeAny, {
    data: {
        amount: string;
        currency: string;
        base: string;
    };
}, {
    data: {
        amount: string;
        currency: string;
        base: string;
    };
}>;
export declare const CoinbaseExchangeRateSchema: z.ZodObject<{
    data: z.ZodObject<{
        currency: z.ZodString;
        rates: z.ZodRecord<z.ZodString, z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        currency: string;
        rates: Record<string, string>;
    }, {
        currency: string;
        rates: Record<string, string>;
    }>;
}, "strip", z.ZodTypeAny, {
    data: {
        currency: string;
        rates: Record<string, string>;
    };
}, {
    data: {
        currency: string;
        rates: Record<string, string>;
    };
}>;
export declare const CoinbaseHistoricalPriceSchema: z.ZodObject<{
    data: z.ZodObject<{
        prices: z.ZodArray<z.ZodArray<z.ZodString, "many">, "many">;
    }, "strip", z.ZodTypeAny, {
        prices: string[][];
    }, {
        prices: string[][];
    }>;
}, "strip", z.ZodTypeAny, {
    data: {
        prices: string[][];
    };
}, {
    data: {
        prices: string[][];
    };
}>;
export declare const CoinbaseStatsSchema: z.ZodObject<{
    data: z.ZodObject<{
        open: z.ZodString;
        high: z.ZodString;
        low: z.ZodString;
        volume: z.ZodString;
        last: z.ZodString;
        volume_30day: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        open: string;
        high: string;
        low: string;
        volume: string;
        last: string;
        volume_30day: string;
    }, {
        open: string;
        high: string;
        low: string;
        volume: string;
        last: string;
        volume_30day: string;
    }>;
}, "strip", z.ZodTypeAny, {
    data: {
        open: string;
        high: string;
        low: string;
        volume: string;
        last: string;
        volume_30day: string;
    };
}, {
    data: {
        open: string;
        high: string;
        low: string;
        volume: string;
        last: string;
        volume_30day: string;
    };
}>;
export declare const CoinbaseTimeSchema: z.ZodObject<{
    data: z.ZodObject<{
        iso: z.ZodString;
        epoch: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        iso: string;
        epoch: number;
    }, {
        iso: string;
        epoch: number;
    }>;
}, "strip", z.ZodTypeAny, {
    data: {
        iso: string;
        epoch: number;
    };
}, {
    data: {
        iso: string;
        epoch: number;
    };
}>;
export declare const GetSpotPriceInputSchema: z.ZodObject<{
    currencyPair: z.ZodString;
}, "strip", z.ZodTypeAny, {
    currencyPair: string;
}, {
    currencyPair: string;
}>;
export declare const GetHistoricalPricesInputSchema: z.ZodObject<{
    currencyPair: z.ZodString;
    start: z.ZodOptional<z.ZodString>;
    end: z.ZodOptional<z.ZodString>;
    period: z.ZodOptional<z.ZodEnum<["hour", "day"]>>;
}, "strip", z.ZodTypeAny, {
    currencyPair: string;
    start?: string | undefined;
    end?: string | undefined;
    period?: "hour" | "day" | undefined;
}, {
    currencyPair: string;
    start?: string | undefined;
    end?: string | undefined;
    period?: "hour" | "day" | undefined;
}>;
export declare const GetExchangeRatesInputSchema: z.ZodObject<{
    currency: z.ZodString;
}, "strip", z.ZodTypeAny, {
    currency: string;
}, {
    currency: string;
}>;
export declare const SearchAssetsInputSchema: z.ZodObject<{
    query: z.ZodString;
    limit: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    query: string;
    limit?: number | undefined;
}, {
    query: string;
    limit?: number | undefined;
}>;
export declare const GetAssetDetailsInputSchema: z.ZodObject<{
    assetId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    assetId: string;
}, {
    assetId: string;
}>;
export declare const GetMarketStatsInputSchema: z.ZodObject<{
    currencyPair: z.ZodString;
}, "strip", z.ZodTypeAny, {
    currencyPair: string;
}, {
    currencyPair: string;
}>;
export declare const AnalyzePriceDataInputSchema: z.ZodObject<{
    currencyPair: z.ZodString;
    period: z.ZodEnum<["1d", "7d", "30d", "1y"]>;
    metrics: z.ZodArray<z.ZodEnum<["volatility", "trend", "support_resistance", "volume"]>, "many">;
}, "strip", z.ZodTypeAny, {
    currencyPair: string;
    period: "1d" | "7d" | "30d" | "1y";
    metrics: ("volume" | "volatility" | "trend" | "support_resistance")[];
}, {
    currencyPair: string;
    period: "1d" | "7d" | "30d" | "1y";
    metrics: ("volume" | "volatility" | "trend" | "support_resistance")[];
}>;
export type CoinbaseAsset = z.infer<typeof CoinbaseAssetSchema>;
export type CoinbasePrice = z.infer<typeof CoinbasePriceSchema>;
export type CoinbaseSpotPrice = z.infer<typeof CoinbaseSpotPriceSchema>;
export type CoinbaseExchangeRate = z.infer<typeof CoinbaseExchangeRateSchema>;
export type CoinbaseHistoricalPrice = z.infer<typeof CoinbaseHistoricalPriceSchema>;
export type CoinbaseStats = z.infer<typeof CoinbaseStatsSchema>;
export type CoinbaseTime = z.infer<typeof CoinbaseTimeSchema>;
export type GetSpotPriceInput = z.infer<typeof GetSpotPriceInputSchema>;
export type GetHistoricalPricesInput = z.infer<typeof GetHistoricalPricesInputSchema>;
export type GetExchangeRatesInput = z.infer<typeof GetExchangeRatesInputSchema>;
export type SearchAssetsInput = z.infer<typeof SearchAssetsInputSchema>;
export type GetAssetDetailsInput = z.infer<typeof GetAssetDetailsInputSchema>;
export type GetMarketStatsInput = z.infer<typeof GetMarketStatsInputSchema>;
export type AnalyzePriceDataInput = z.infer<typeof AnalyzePriceDataInputSchema>;
export interface CoinbaseMCPConfig {
    name: string;
    version: string;
    apiUrl?: string;
    rateLimit?: {
        requestsPerMinute: number;
        requestsPerHour: number;
    };
    cache?: {
        enabled: boolean;
        ttl: number;
    };
}
export declare class CoinbaseAPIError extends Error {
    status: number;
    response?: any | undefined;
    constructor(message: string, status: number, response?: any | undefined);
}
export declare class RateLimitError extends Error {
    retryAfter?: number | undefined;
    constructor(message: string, retryAfter?: number | undefined);
}
export interface PriceAnalysis {
    currentPrice: number;
    volatility: number;
    trend: 'bullish' | 'bearish' | 'sideways';
    supportLevel?: number | undefined;
    resistanceLevel?: number | undefined;
    volume24h?: number | undefined;
    priceChange24h: number;
    priceChangePercent24h: number;
}
//# sourceMappingURL=types.d.ts.map