#!/usr/bin/env node
import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { CoinbaseClient } from './coinbase-client.js';
import { DemoWalletClient } from './demo-wallet-client.js';
import { GetSpotPriceInputSchema, GetHistoricalPricesInputSchema, GetExchangeRatesInputSchema, SearchAssetsInputSchema, GetAssetDetailsInputSchema, GetMarketStatsInputSchema, AnalyzePriceDataInputSchema, CalculateBeerCostInputSchema, SimulatePurchaseInputSchema, GetTransactionHistoryInputSchema } from './types.js';
class CoinbaseMCPServer {
    server;
    coinbaseClient;
    demoWalletClient;
    config;
    constructor(config) {
        this.config = {
            apiUrl: 'https://api.coinbase.com/v2',
            rateLimit: {
                requestsPerMinute: 100,
                requestsPerHour: 1000
            },
            cache: {
                enabled: true,
                ttl: 60000 // 1 minute
            },
            ...config
        };
        this.coinbaseClient = new CoinbaseClient(this.config.apiUrl);
        this.demoWalletClient = new DemoWalletClient(this.coinbaseClient);
        this.server = new McpServer({
            name: this.config.name,
            version: this.config.version
        });
        this.setupTools();
        this.setupResources();
        this.setupPrompts();
    }
    setupTools() {
        // Get current spot price for a currency pair
        this.server.registerTool('get_spot_price', {
            title: 'Get Spot Price',
            description: 'Get the current spot price for a cryptocurrency pair',
            inputSchema: GetSpotPriceInputSchema.shape
        }, async ({ currencyPair }) => {
            try {
                const result = await this.coinbaseClient.getSpotPrice(currencyPair);
                return {
                    content: [{
                            type: 'text',
                            text: `Current ${currencyPair} price: $${result.data.amount} ${result.data.currency}\nBase: ${result.data.base}`
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: 'text',
                            text: `Error fetching spot price: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        // Get historical prices
        this.server.registerTool('get_historical_prices', {
            title: 'Get Historical Prices',
            description: 'Get historical price data for a cryptocurrency pair',
            inputSchema: GetHistoricalPricesInputSchema.shape
        }, async ({ currencyPair, start, end, period }) => {
            try {
                const result = await this.coinbaseClient.getHistoricalPrices(currencyPair, start, end, period);
                const prices = result.data.prices.slice(0, 10); // Limit for readability
                const priceList = prices.map(([timestamp, price]) => `${new Date(timestamp).toLocaleDateString()}: $${price}`).join('\n');
                return {
                    content: [{
                            type: 'text',
                            text: `Historical prices for ${currencyPair}:\n${priceList}\n\n(Showing last 10 data points)`
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: 'text',
                            text: `Error fetching historical prices: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        // Get exchange rates
        this.server.registerTool('get_exchange_rates', {
            title: 'Get Exchange Rates',
            description: 'Get exchange rates for a base currency',
            inputSchema: GetExchangeRatesInputSchema.shape
        }, async ({ currency }) => {
            try {
                const result = await this.coinbaseClient.getExchangeRates(currency);
                const rates = Object.entries(result.data.rates)
                    .slice(0, 15) // Show top 15 rates
                    .map(([code, rate]) => `${code}: ${rate}`)
                    .join('\n');
                return {
                    content: [{
                            type: 'text',
                            text: `Exchange rates for ${currency}:\n${rates}\n\n(Showing top 15 rates)`
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: 'text',
                            text: `Error fetching exchange rates: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        // Search assets
        this.server.registerTool('search_assets', {
            title: 'Search Assets',
            description: 'Search for cryptocurrency and fiat assets',
            inputSchema: SearchAssetsInputSchema.shape
        }, async ({ query, limit = 10 }) => {
            try {
                const results = await this.coinbaseClient.searchAssets(query, limit);
                if (results.length === 0) {
                    return {
                        content: [{
                                type: 'text',
                                text: `No assets found matching "${query}"`
                            }]
                    };
                }
                const assetList = results.map(asset => `${asset.name} (${asset.code}) - Type: ${asset.type}`).join('\n');
                return {
                    content: [{
                            type: 'text',
                            text: `Assets matching "${query}":\n${assetList}`
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: 'text',
                            text: `Error searching assets: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        // Get asset details
        this.server.registerTool('get_asset_details', {
            title: 'Get Asset Details',
            description: 'Get detailed information about a specific asset',
            inputSchema: GetAssetDetailsInputSchema.shape
        }, async ({ assetId }) => {
            try {
                const asset = await this.coinbaseClient.getAssetDetails(assetId);
                if (!asset) {
                    return {
                        content: [{
                                type: 'text',
                                text: `Asset "${assetId}" not found`
                            }]
                    };
                }
                const content = `Asset Information: ${asset.name}

Code: ${asset.code}
Type: ${asset.type}
ID: ${asset.id}
${asset.slug ? `Slug: ${asset.slug}\n` : ''}${asset.exponent ? `Exponent: ${asset.exponent}\n` : ''}${asset.color ? `Color: ${asset.color}\n` : ''}`;
                return {
                    content: [{
                            type: 'text',
                            text: content
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: 'text',
                            text: `Error fetching asset details: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        // Get market stats
        this.server.registerTool('get_market_stats', {
            title: 'Get Market Statistics',
            description: 'Get 24-hour market statistics for a currency pair',
            inputSchema: GetMarketStatsInputSchema.shape
        }, async ({ currencyPair }) => {
            try {
                const result = await this.coinbaseClient.getStats(currencyPair);
                const stats = `24-Hour Statistics for ${currencyPair}:
Open: $${result.data.open}
High: $${result.data.high}
Low: $${result.data.low}
Volume: ${result.data.volume}
Last: $${result.data.last}`;
                return {
                    content: [{
                            type: 'text',
                            text: stats
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: 'text',
                            text: `Error fetching market stats: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        // Get popular pairs
        this.server.registerTool('get_popular_pairs', {
            title: 'Get Popular Trading Pairs',
            description: 'Get list of popular cryptocurrency trading pairs'
        }, async () => {
            try {
                const pairs = await this.coinbaseClient.getPopularPairs();
                return {
                    content: [{
                            type: 'text',
                            text: `Popular Trading Pairs:\n${pairs.join('\n')}`
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: 'text',
                            text: `Error fetching popular pairs: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        // Analyze price data
        this.server.registerTool('analyze_price_data', {
            title: 'Analyze Price Data',
            description: 'Perform technical analysis on price data',
            inputSchema: AnalyzePriceDataInputSchema.shape
        }, async ({ currencyPair, period, metrics }) => {
            try {
                const result = await this.coinbaseClient.analyzePriceData(currencyPair, period, metrics);
                const analysisText = `Price Analysis for ${currencyPair} (${period}):

Volatility: ${result.volatility.toFixed(2)}%
Trend: ${result.trend}
${result.volume24h ? `Volume: ${result.volume24h.toLocaleString()}` : ''}
${result.supportLevel ? `Support Level: $${result.supportLevel.toFixed(2)}` : ''}
${result.resistanceLevel ? `Resistance Level: $${result.resistanceLevel.toFixed(2)}` : ''}

Price Change: ${result.priceChange24h >= 0 ? '+' : ''}$${result.priceChange24h.toFixed(2)}
Price Change %: ${result.priceChangePercent24h >= 0 ? '+' : ''}${result.priceChangePercent24h.toFixed(2)}%`;
                return {
                    content: [{
                            type: 'text',
                            text: analysisText
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: 'text',
                            text: `Error analyzing price data: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        // 🍺 DEMO TRANSACTION TOOLS 🍺
        // Calculate beer cost in crypto
        this.server.registerTool('calculate_beer_cost', {
            title: 'Calculate Beer Cost in Crypto',
            description: 'Calculate how much crypto you can buy with the price of beer(s) - fun way to understand crypto value!',
            inputSchema: CalculateBeerCostInputSchema.shape
        }, async ({ currency = 'BTC', beerCount = 1, pricePerBeer = 5 }) => {
            try {
                const calculation = await this.demoWalletClient.calculateBeerCost(currency, beerCount, pricePerBeer);
                const text = `🍺 Beer-to-Crypto Calculator 🍺

${beerCount} beer${beerCount > 1 ? 's' : ''} at $${pricePerBeer} each = $${calculation.usdAmount} USD

Current ${calculation.cryptoCurrency} Price: $${calculation.currentPrice.toLocaleString()}

You can buy: ${calculation.cryptoAmount.toFixed(8)} ${calculation.cryptoCurrency}

${calculation.description}

💡 That's your beer money in crypto!`;
                return {
                    content: [{
                            type: 'text',
                            text
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: 'text',
                            text: `Error calculating beer cost: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        // Simulate crypto purchase
        this.server.registerTool('simulate_btc_purchase', {
            title: 'Simulate Crypto Purchase',
            description: 'Demo tool to simulate buying cryptocurrency (like buying a beer\'s worth of Bitcoin!)',
            inputSchema: SimulatePurchaseInputSchema.shape
        }, async ({ fromCurrency, toCurrency, amount, description }) => {
            try {
                const transaction = await this.demoWalletClient.simulatePurchase(fromCurrency, toCurrency, amount, description);
                const text = `✅ Transaction Successful!

Transaction ID: ${transaction.id}
Type: ${transaction.type.toUpperCase()}

From: ${transaction.fromAmount.toFixed(2)} ${transaction.fromCurrency}
To: ${transaction.toAmount.toFixed(8)} ${transaction.toCurrency}

Price: $${transaction.price.toLocaleString()} per ${transaction.toCurrency}
Description: ${transaction.description}

Status: ${transaction.status}
Time: ${transaction.timestamp.toLocaleString()}

🎉 ${description || `You now own ${transaction.toAmount.toFixed(8)} ${transaction.toCurrency}!`}`;
                return {
                    content: [{
                            type: 'text',
                            text
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: 'text',
                            text: `❌ Transaction failed: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        // Get virtual wallet balance
        this.server.registerTool('get_virtual_wallet', {
            title: 'Get Virtual Wallet',
            description: 'View your demo wallet balance and holdings'
        }, async () => {
            try {
                const wallet = this.demoWalletClient.getWallet();
                const stats = this.demoWalletClient.getWalletStats();
                const balanceList = Object.entries(wallet.balances)
                    .filter(([_, balance]) => balance > 0)
                    .map(([currency, balance]) => {
                    if (currency === 'USD') {
                        return `  💵 ${currency}: $${balance.toFixed(2)}`;
                    }
                    else {
                        return `  🪙 ${currency}: ${balance.toFixed(8)}`;
                    }
                })
                    .join('\n');
                const text = `👛 Demo Wallet Overview

📊 Balances:
${balanceList}

📈 Statistics:
  Total Transactions: ${stats.totalTransactions}
  Total Spent (USD): $${stats.totalSpentUSD.toFixed(2)}
  
🗓️ Account Info:
  Created: ${wallet.createdAt.toLocaleDateString()}
  Last Updated: ${wallet.lastUpdated.toLocaleString()}

💡 This is a demo wallet for educational purposes
   Use 'simulate_btc_purchase' to buy crypto!`;
                return {
                    content: [{
                            type: 'text',
                            text
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: 'text',
                            text: `Error fetching wallet: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        // Get transaction history
        this.server.registerTool('get_transaction_history', {
            title: 'Get Transaction History',
            description: 'View your demo transaction history',
            inputSchema: GetTransactionHistoryInputSchema.shape
        }, async ({ limit = 10, currency }) => {
            try {
                const transactions = this.demoWalletClient.getTransactionHistory(limit, currency);
                if (transactions.length === 0) {
                    return {
                        content: [{
                                type: 'text',
                                text: `📝 Transaction History

No transactions yet. Start by buying some crypto with 'simulate_btc_purchase'!

Example: Buy $5 worth of Bitcoin (a beer's worth!)
  From: USD
  To: BTC  
  Amount: 5`
                            }]
                    };
                }
                const txList = transactions.map((tx, index) => {
                    const emoji = tx.type === 'buy' ? '🟢' : '🔴';
                    return `${emoji} ${index + 1}. ${tx.type.toUpperCase()} - ${tx.timestamp.toLocaleDateString()}
   ${tx.fromAmount.toFixed(2)} ${tx.fromCurrency} → ${tx.toAmount.toFixed(8)} ${tx.toCurrency}
   Price: $${tx.price.toLocaleString()}
   ${tx.description}
   Status: ${tx.status}`;
                }).join('\n\n');
                const text = `📝 Transaction History${currency ? ` (${currency})` : ''}

${txList}

${transactions.length >= limit ? `\nShowing last ${limit} transactions` : ''}`;
                return {
                    content: [{
                            type: 'text',
                            text
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: 'text',
                            text: `Error fetching transaction history: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
    }
    setupResources() {
        // Market overview resource
        this.server.registerResource('market-overview', 'coinbase://market/overview', {
            title: 'Coinbase Market Overview',
            description: 'Overview of major cryptocurrency markets',
            mimeType: 'text/plain'
        }, async () => {
            try {
                const popularPairs = await this.coinbaseClient.getPopularPairs();
                const pricePromises = popularPairs.slice(0, 5).map(pair => this.coinbaseClient.getSpotPrice(pair).then(result => ({
                    pair,
                    price: result.data.amount,
                    currency: result.data.currency
                })).catch(() => null));
                const prices = (await Promise.all(pricePromises)).filter(Boolean);
                const overview = prices.map(p => `${p.pair}: $${p.price} ${p.currency}`).join('\n');
                return {
                    contents: [{
                            uri: 'coinbase://market/overview',
                            text: `Coinbase Market Overview\n\nTop Cryptocurrency Prices:\n${overview}`
                        }]
                };
            }
            catch (error) {
                return {
                    contents: [{
                            uri: 'coinbase://market/overview',
                            text: `Error loading market overview: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }]
                };
            }
        });
        // Asset information resource
        this.server.registerResource('asset-info', new ResourceTemplate('coinbase://assets/{assetId}', { list: undefined }), {
            title: 'Asset Information',
            description: 'Detailed information about a specific cryptocurrency or fiat asset'
        }, async (uri) => {
            try {
                const assetId = uri.pathname.split('/').pop();
                if (!assetId) {
                    return {
                        contents: [{
                                uri: uri.href,
                                text: 'Invalid asset ID'
                            }]
                    };
                }
                const asset = await this.coinbaseClient.getAssetDetails(assetId);
                if (!asset) {
                    return {
                        contents: [{
                                uri: uri.href,
                                text: `Asset "${assetId}" not found`
                            }]
                    };
                }
                const content = `Asset Information: ${asset.name}

Code: ${asset.code}
Type: ${asset.type}
ID: ${asset.id}
${asset.slug ? `Slug: ${asset.slug}\n` : ''}${asset.exponent ? `Exponent: ${asset.exponent}\n` : ''}${asset.color ? `Color: ${asset.color}\n` : ''}`;
                return {
                    contents: [{
                            uri: uri.href,
                            text: content
                        }]
                };
            }
            catch (error) {
                return {
                    contents: [{
                            uri: uri.href,
                            text: `Error loading asset information: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }]
                };
            }
        });
    }
    setupPrompts() {
        // Price analysis prompt
        this.server.registerPrompt('analyze-crypto-price', {
            title: 'Analyze Cryptocurrency Price',
            description: 'Analyze the price movement and trends of a cryptocurrency',
            argsSchema: {
                currencyPair: z.string().describe('Currency pair to analyze (e.g., BTC-USD)'),
                timeframe: z.enum(['1d', '7d', '30d', '1y']).describe('Analysis timeframe')
            }
        }, ({ currencyPair, timeframe }) => ({
            messages: [{
                    role: 'user',
                    content: {
                        type: 'text',
                        text: `Please analyze the price movement of ${currencyPair} over the ${timeframe} timeframe. 

Use the following tools to gather data:
1. get_spot_price - Get current price
2. get_market_stats - Get 24h statistics  
3. analyze_price_data - Get technical analysis

Provide insights on:
- Current price level and recent changes
- Volatility and trend direction
- Support and resistance levels
- Overall market sentiment
- Potential trading opportunities or risks

Format your analysis in a clear, structured way suitable for both technical and non-technical users.`
                    }
                }]
        }));
        // Market comparison prompt
        this.server.registerPrompt('compare-cryptocurrencies', {
            title: 'Compare Cryptocurrencies',
            description: 'Compare multiple cryptocurrencies across various metrics',
            argsSchema: {
                currencies: z.string().describe('Comma-separated list of currency pairs to compare (e.g., "BTC-USD,ETH-USD")')
            }
        }, ({ currencies }) => {
            const currencyList = Array.isArray(currencies) ? currencies : [currencies];
            return {
                messages: [{
                        role: 'user',
                        content: {
                            type: 'text',
                            text: `Please compare the following cryptocurrencies: ${currencyList.join(', ')}

For each currency, gather:
1. Current spot price
2. 24-hour market statistics
3. Price analysis and trends

Then provide a comprehensive comparison covering:
- Price performance and volatility
- Market capitalization considerations
- Trading volume and liquidity
- Technical indicators and trends
- Risk assessment for each asset
- Investment recommendations based on different risk profiles

Present the comparison in a table format where possible, followed by detailed analysis.`
                        }
                    }]
            };
        });
        // Portfolio diversification prompt
        this.server.registerPrompt('portfolio-diversification-advice', {
            title: 'Portfolio Diversification Advice',
            description: 'Get advice on cryptocurrency portfolio diversification',
            argsSchema: {
                riskTolerance: z.string().describe('Risk tolerance level (conservative, moderate, aggressive)'),
                investmentAmount: z.string().describe('Total investment amount in USD')
            }
        }, ({ riskTolerance, investmentAmount }) => ({
            messages: [{
                    role: 'user',
                    content: {
                        type: 'text',
                        text: `Please provide cryptocurrency portfolio diversification advice for:
- Risk tolerance: ${riskTolerance}
- Investment amount: $${investmentAmount}

Use the available tools to:
1. Get popular trading pairs
2. Analyze price data for major cryptocurrencies
3. Get current market statistics

Provide recommendations for:
- Asset allocation percentages
- Specific cryptocurrencies to consider
- Diversification across different crypto categories (Bitcoin, Ethereum, DeFi, Layer 1s, etc.)
- Risk management strategies
- Entry points and timing considerations
- Long-term vs short-term allocation

Consider the current market conditions and tailor advice to the specified risk tolerance.`
                    }
                }]
        }));
    }
    async start() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error('Coinbase MCP Server running on stdio');
    }
}
// Main execution
async function main() {
    const server = new CoinbaseMCPServer({
        name: 'coinbase-mcp-server',
        version: '1.0.0'
    });
    await server.start();
}
// Handle graceful shutdown
process.on('SIGINT', () => {
    console.error('Received SIGINT, shutting down gracefully...');
    process.exit(0);
});
process.on('SIGTERM', () => {
    console.error('Received SIGTERM, shutting down gracefully...');
    process.exit(0);
});
// Run the server if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch((error) => {
        console.error('Failed to start server:', error);
        process.exit(1);
    });
}
export { CoinbaseMCPServer };
