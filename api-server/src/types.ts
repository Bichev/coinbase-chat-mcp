import { z } from 'zod';

// Coinbase API Types
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
    prices: Array<[string, string]>; // [timestamp, price]
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

// Error Classes
export class CoinbaseAPIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errorId?: string
  ) {
    super(message);
    this.name = 'CoinbaseAPIError';
  }
}

export class RateLimitError extends Error {
  constructor(
    message: string,
    public retryAfter: number
  ) {
    super(message);
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