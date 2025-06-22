# Coinbase MCP Server

A professional Model Context Protocol (MCP) server for Coinbase's public API, enabling AI agents to securely interact with cryptocurrency data.

## Overview

This MCP server provides a standardized interface for AI agents to access Coinbase's public cryptocurrency data through:

- **Tools**: Execute API calls to get prices, market data, and analysis
- **Resources**: Access static data about assets and market overviews  
- **Prompts**: Pre-built templates for common crypto analysis tasks

## Features

### 🔧 Tools

| Tool | Description | Parameters |
|------|-------------|------------|
| `get_spot_price` | Get current spot price for any trading pair | `currencyPair` (e.g., "BTC-USD") |
| `get_historical_prices` | Get historical price data | `currencyPair`, `start`, `end`, `period` |
| `get_exchange_rates` | Get exchange rates for a base currency | `currency` (e.g., "USD") |
| `search_assets` | Search for cryptocurrencies and fiat assets | `query`, `limit` |
| `get_asset_details` | Get detailed asset information | `assetId` |
| `get_market_stats` | Get 24-hour market statistics | `currencyPair` |
| `analyze_price_data` | Perform technical analysis | `currencyPair`, `period`, `metrics` |
| `get_popular_pairs` | Get list of popular trading pairs | None |

### 📄 Resources

| Resource | URI | Description |
|----------|-----|-------------|
| Market Overview | `coinbase://market/overview` | Overview of major cryptocurrency markets |
| Asset Information | `coinbase://assets/{assetId}` | Detailed information about specific assets |

### 💬 Prompts

| Prompt | Description | Arguments |
|--------|-------------|-----------|
| `analyze-crypto-price` | Analyze cryptocurrency price movements | `currencyPair`, `timeframe` |
| `compare-cryptocurrencies` | Compare multiple cryptocurrencies | `currencies` array |
| `portfolio-diversification-advice` | Get portfolio diversification advice | `riskTolerance`, `investmentAmount` |

## Installation

```bash
# Install dependencies
npm install

# Build the server
npm run build

# Start the server
npm start
```

## Development

```bash
# Start in development mode with hot reloading
npm run dev

# Run tests
npm test

# Lint code
npm run lint
```

## Usage

### With Claude Desktop

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "coinbase": {
      "command": "node",
      "args": ["path/to/coinbase-chat-mcp/mcp-server/dist/index.js"],
      "env": {}
    }
  }
}
```

### Programmatic Usage

```typescript
import { CoinbaseMCPServer } from './src/index.js';

const server = new CoinbaseMCPServer({
  name: 'coinbase-mcp',
  version: '1.0.0'
});

await server.start();
```

### Command Line

```bash
# Run directly
node dist/index.js

# Or with npm
npm start
```

## Configuration

The server can be configured through environment variables or constructor options:

```typescript
const server = new CoinbaseMCPServer({
  name: 'coinbase-mcp',
  version: '1.0.0',
  apiUrl: 'https://api.coinbase.com/v2',
  rateLimit: {
    requestsPerMinute: 100,
    requestsPerHour: 1000
  },
  cache: {
    enabled: true,
    ttl: 60000 // 1 minute
  }
});
```

## Environment Variables

Create a `.env` file:

```bash
COINBASE_API_URL=https://api.coinbase.com/v2
LOG_LEVEL=info
PORT=3001
RATE_LIMIT_REQUESTS_PER_MINUTE=100
RATE_LIMIT_REQUESTS_PER_HOUR=1000
CACHE_ENABLED=true
CACHE_TTL=60000
```

## Examples

### Getting Bitcoin Price

```
User: What's the current Bitcoin price?
Agent: I'll get the current Bitcoin price for you.

[Tool: get_spot_price with currencyPair: "BTC-USD"]

The current BTC-USD price is $45,123.45 USD.
```

### Price Analysis

```
User: Analyze Bitcoin's price trend over the last day
Agent: I'll analyze Bitcoin's price movement over the last 24 hours.

[Tool: analyze_price_data with currencyPair: "BTC-USD", period: "1d", metrics: ["volatility", "trend"]]

Price Analysis for BTC-USD (1d period):
- Current Price: $45,123.45
- 24h Change: +$1,234.56 (+2.81%)
- Volatility: 3.24%
- Trend: bullish
```

### Asset Search

```
User: Find information about Ethereum
Agent: I'll search for Ethereum asset information.

[Tool: search_assets with query: "ethereum", limit: 5]
[Tool: get_asset_details with assetId: "ETH"]

Asset Details:
Name: Ethereum
Code: ETH
Type: crypto
ID: ETH
```

## API Reference

### Tool Schemas

All tools use Zod schemas for input validation:

```typescript
import { GetSpotPriceInputSchema } from './types.js';

// Validates: { currencyPair: "BTC-USD" }
GetSpotPriceInputSchema.parse({ currencyPair: "BTC-USD" });
```

### Error Handling

The server includes comprehensive error handling:

- **CoinbaseAPIError**: API-specific errors with status codes
- **RateLimitError**: Rate limiting with retry information
- **ValidationError**: Input validation failures

### Rate Limiting

Built-in rate limiting protects against API abuse:

- 100 requests per minute
- 1000 requests per hour
- Configurable limits
- Automatic retry suggestions

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- coinbase-client.test.ts
```

## Architecture

```
mcp-server/
├── src/
│   ├── index.ts           # Main server implementation
│   ├── coinbase-client.ts # Coinbase API client
│   └── types.ts           # TypeScript types & schemas
├── dist/                  # Compiled JavaScript
├── tests/                 # Test files
└── package.json
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

See [CONTRIBUTING.md](../CONTRIBUTING.md) for detailed guidelines.

## License

MIT License - see [LICENSE](../LICENSE) for details.

## Security

This server only accesses Coinbase's public API endpoints. No authentication keys or private data are required or used.

## Support

- 🐛 [Report Issues](https://github.com/your-username/coinbase-chat-mcp/issues)
- 💬 [Discussions](https://github.com/your-username/coinbase-chat-mcp/discussions)
- 📖 [Documentation](https://github.com/your-username/coinbase-chat-mcp)

## Changelog

### v1.0.0
- Initial release
- Full MCP specification compliance
- 8 tools for crypto data access
- 2 resource types
- 3 prompt templates
- Rate limiting and error handling 