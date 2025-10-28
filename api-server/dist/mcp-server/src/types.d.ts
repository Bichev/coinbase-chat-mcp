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
    code: string;
    type: "fiat" | "crypto";
    id: string;
    name: string;
    color?: string | undefined;
    sort_index?: number | undefined;
    exponent?: number | undefined;
    address_regex?: string | undefined;
    asset_id?: string | undefined;
    slug?: string | undefined;
}, {
    code: string;
    type: "fiat" | "crypto";
    id: string;
    name: string;
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
    currency: string;
    amount: string;
}, {
    currency: string;
    amount: string;
}>;
export declare const CoinbaseSpotPriceSchema: z.ZodObject<{
    data: z.ZodObject<{
        amount: z.ZodString;
        base: z.ZodString;
        currency: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        currency: string;
        amount: string;
        base: string;
    }, {
        currency: string;
        amount: string;
        base: string;
    }>;
}, "strip", z.ZodTypeAny, {
    data: {
        currency: string;
        amount: string;
        base: string;
    };
}, {
    data: {
        currency: string;
        amount: string;
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
        volume: string;
        open: string;
        high: string;
        low: string;
        last: string;
        volume_30day: string;
    }, {
        volume: string;
        open: string;
        high: string;
        low: string;
        last: string;
        volume_30day: string;
    }>;
}, "strip", z.ZodTypeAny, {
    data: {
        volume: string;
        open: string;
        high: string;
        low: string;
        last: string;
        volume_30day: string;
    };
}, {
    data: {
        volume: string;
        open: string;
        high: string;
        low: string;
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
    metrics: ("volatility" | "trend" | "support_resistance" | "volume")[];
}, {
    currencyPair: string;
    period: "1d" | "7d" | "30d" | "1y";
    metrics: ("volatility" | "trend" | "support_resistance" | "volume")[];
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
export interface DemoWallet {
    balances: {
        [currency: string]: number;
    };
    transactions: DemoTransaction[];
    inventory: VirtualInventory;
    createdAt: Date;
    lastUpdated: Date;
}
export interface VirtualInventory {
    beers: number;
    items: VirtualItem[];
}
export interface VirtualItem {
    id: string;
    name: string;
    emoji: string;
    quantity: number;
    purchasePrice: number;
    purchaseCurrency: string;
    purchaseDate: Date;
}
export interface DemoTransaction {
    id: string;
    type: 'buy' | 'sell' | 'transfer';
    fromCurrency: string;
    toCurrency: string;
    fromAmount: number;
    toAmount: number;
    price: number;
    description: string;
    timestamp: Date;
    status: 'completed' | 'pending' | 'failed';
}
export interface PurchaseCalculation {
    usdAmount: number;
    cryptoAmount: number;
    cryptoCurrency: string;
    currentPrice: number;
    description: string;
}
export declare const CalculateBeerCostInputSchema: z.ZodObject<{
    currency: z.ZodOptional<z.ZodString>;
    beerCount: z.ZodOptional<z.ZodNumber>;
    pricePerBeer: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    currency?: string | undefined;
    beerCount?: number | undefined;
    pricePerBeer?: number | undefined;
}, {
    currency?: string | undefined;
    beerCount?: number | undefined;
    pricePerBeer?: number | undefined;
}>;
export declare const SimulatePurchaseInputSchema: z.ZodObject<{
    fromCurrency: z.ZodString;
    toCurrency: z.ZodString;
    amount: z.ZodNumber;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    fromCurrency: string;
    toCurrency: string;
    amount: number;
    description?: string | undefined;
}, {
    fromCurrency: string;
    toCurrency: string;
    amount: number;
    description?: string | undefined;
}>;
export declare const GetTransactionHistoryInputSchema: z.ZodObject<{
    limit: z.ZodOptional<z.ZodNumber>;
    currency: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    currency?: string | undefined;
    limit?: number | undefined;
}, {
    currency?: string | undefined;
    limit?: number | undefined;
}>;
export declare const BuyVirtualBeerInputSchema: z.ZodObject<{
    quantity: z.ZodOptional<z.ZodNumber>;
    currency: z.ZodOptional<z.ZodString>;
    pricePerBeer: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    currency?: string | undefined;
    pricePerBeer?: number | undefined;
    quantity?: number | undefined;
}, {
    currency?: string | undefined;
    pricePerBeer?: number | undefined;
    quantity?: number | undefined;
}>;
export type CalculateBeerCostInput = z.infer<typeof CalculateBeerCostInputSchema>;
export type SimulatePurchaseInput = z.infer<typeof SimulatePurchaseInputSchema>;
export type GetTransactionHistoryInput = z.infer<typeof GetTransactionHistoryInputSchema>;
export type BuyVirtualBeerInput = z.infer<typeof BuyVirtualBeerInputSchema>;
