import { z } from 'zod';
export interface CoinbaseAsset {
    id: string;
    name: string;
    code: string;
    color: string;
    type: 'fiat' | 'crypto';
    sort_index: number;
    exponent: number;
    slug?: string;
}
export interface CoinbaseSpotPrice {
    data: {
        amount: string;
        base: string;
        currency: string;
    };
}
export interface CoinbaseHistoricalPrice {
    data: {
        prices: Array<[string, string]>;
    };
}
export interface CoinbaseExchangeRate {
    data: {
        currency: string;
        rates: Record<string, string>;
    };
}
export interface CoinbaseStats {
    data: {
        open: string;
        high: string;
        low: string;
        volume: string;
        last: string;
        volume_30day: string;
    };
}
export interface CoinbaseTime {
    data: {
        iso: string;
        epoch: number;
    };
}
export interface PriceAnalysis {
    currentPrice: number;
    volatility: number;
    trend: 'bullish' | 'bearish' | 'sideways';
    supportLevel?: number;
    resistanceLevel?: number;
    volume24h?: number;
    priceChange24h: number;
    priceChangePercent24h: number;
}
export declare class CoinbaseAPIError extends Error {
    statusCode: number;
    errorId?: string | undefined;
    constructor(message: string, statusCode: number, errorId?: string | undefined);
}
export declare class RateLimitError extends Error {
    retryAfter: number;
    constructor(message: string, retryAfter: number);
}
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
    metrics: ("volatility" | "trend" | "support_resistance" | "volume")[];
}, {
    currencyPair: string;
    period: "1d" | "7d" | "30d" | "1y";
    metrics: ("volatility" | "trend" | "support_resistance" | "volume")[];
}>;
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
