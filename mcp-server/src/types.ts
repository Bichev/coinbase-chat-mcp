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

// Exported Types
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

// Configuration Types
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

// Error Types
export class CoinbaseAPIError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message);
    this.name = 'CoinbaseAPIError';
  }
}

export class RateLimitError extends Error {
  constructor(message: string, public retryAfter?: number) {
    super(message);
    this.name = 'RateLimitError';
  }
}

// Utility Types
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

// Demo Wallet & Transaction Types
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

// Transaction Tool Input Schemas
export const CalculateBeerCostInputSchema = z.object({
  currency: z.string().optional().describe('Crypto currency to buy (default: BTC)'),
  beerCount: z.number().optional().describe('Number of beers (default: 1)'),
  pricePerBeer: z.number().optional().describe('Price per beer in USD (default: 5)')
});

export const SimulatePurchaseInputSchema = z.object({
  fromCurrency: z.string().describe('Currency to spend (e.g., USD)'),
  toCurrency: z.string().describe('Currency to buy (e.g., BTC, ETH)'),
  amount: z.number().describe('Amount in fromCurrency to spend'),
  description: z.string().optional().describe('Purchase description (e.g., "Beer at local pub")')
});

export const GetTransactionHistoryInputSchema = z.object({
  limit: z.number().optional().describe('Maximum number of transactions to return (default: 10)'),
  currency: z.string().optional().describe('Filter by currency')
});

export const BuyVirtualBeerInputSchema = z.object({
  quantity: z.number().optional().describe('Number of beers to buy (default: 1)'),
  currency: z.string().optional().describe('Cryptocurrency to pay with (default: BTC)'),
  pricePerBeer: z.number().optional().describe('Price per beer in USD (default: 5)')
});

export type CalculateBeerCostInput = z.infer<typeof CalculateBeerCostInputSchema>;
export type SimulatePurchaseInput = z.infer<typeof SimulatePurchaseInputSchema>;
export type GetTransactionHistoryInput = z.infer<typeof GetTransactionHistoryInputSchema>;
export type BuyVirtualBeerInput = z.infer<typeof BuyVirtualBeerInputSchema>; 