# Coinbase MCP Server Setup Notes

## Overview
This project includes a custom MCP (Model Context Protocol) server that provides real-time cryptocurrency data from Coinbase's public API.

## MCP Configuration
- **Config File**: `.cursor/mcp.json`
- **Server Path**: `./mcp-server/dist/index.js`
- **Status**: ✅ Configured and working

## Available MCP Tools
1. `get_spot_price` - Current crypto prices
2. `get_historical_prices` - Historical price data
3. `get_exchange_rates` - Currency exchange rates
4. `search_assets` - Find cryptocurrencies
5. `get_asset_details` - Detailed asset info
6. `get_market_stats` - 24h trading statistics
7. `analyze_price_data` - Technical analysis
8. `get_popular_pairs` - Popular trading pairs

## Test Commands for Cursor
```
• "What's the current Bitcoin price?"
• "Show me popular cryptocurrency trading pairs"
• "Get market statistics for Ethereum"
• "Analyze Bitcoin's price trend"
```

## Project Structure
- **Frontend**: React app with chat interface, API explorer
- **API Server**: Express REST API (port 3002)
- **MCP Server**: Custom MCP implementation
- **Features**: Session management, real-time data, interactive testing

## Key Files
- `.cursor/mcp.json` - MCP configuration
- `mcp-server/src/index.ts` - MCP server implementation
- `frontend/src/pages/ChatInterface.tsx` - Chat with session persistence
- `frontend/src/pages/APIExplorer.tsx` - Interactive API documentation

## Usage
In Cursor chat, ask cryptocurrency-related questions and I'll use the MCP tools to provide real-time data from Coinbase. 