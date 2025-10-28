# Coinbase Chat MCP

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-blue.svg)](https://www.typescriptlang.org/)
[![Model Context Protocol](https://img.shields.io/badge/MCP-Compatible-orange.svg)](https://modelcontextprotocol.io/)

An open-source **Model Context Protocol (MCP)** server and web application for seamless integration with Coinbase's public API. This project enables AI agents, LLMs, and developers to interact with cryptocurrency data, market information, and trading insights through a standardized, secure interface.

### 🎯 What's Real vs. Simulated?

| Component | Status | Source |
|-----------|--------|--------|
| 💰 **Cryptocurrency Prices** | ✅ **Real** | Coinbase Public API |
| 📊 **Market Statistics** | ✅ **Real** | Coinbase Public API |
| 📈 **Historical Data** | ✅ **Real** | Coinbase Public API |
| 🤖 **GPT-4 AI Chat** | ✅ **Real** | OpenAI |
| 🎤 **Voice Input (Whisper)** | ✅ **Real** | OpenAI |
| 🔊 **Text-to-Speech** | ✅ **Real** | OpenAI |
| 🔌 **MCP Protocol** | ✅ **Real** | Official SDK |
| 💵 **Wallet Balances** | 🎮 **Simulated** | In-memory demo |
| 💸 **Transactions** | 🎮 **Simulated** | Educational only |
| 🍺 **Beer Purchases** | 🎮 **Simulated** | Virtual economy |

**Perfect for learning crypto without financial risk!** 🎓

## 🌟 Features

### 🔌 MCP Server
- **Full MCP Compliance** - Implements complete Model Context Protocol specification
- **13 Powerful Tools** - Real-time prices, historical data, market stats, asset search, technical analysis, and transaction simulation
- **🍺₿ Circular Economy** - Complete flow: USD → Crypto → Virtual Beer!
- **Smart Suggestions** - AI guides you to buy crypto if needed before purchases
- **Virtual Wallet & Inventory** - Track balances, transactions, and beer collection
- **Cursor Integration** - Pre-configured for Cursor IDE with `.cursor/mcp.json`
- **Claude Desktop Compatible** - Works with any MCP-compatible client
- **Secure & Fast** - Built-in rate limiting and intelligent caching

### 💬 Interactive Chat Interface
- **AI-Powered Conversations** - GPT-4 integration for intelligent crypto discussions
- **Voice Input** - Speak your questions with multi-language support via OpenAI Whisper
- **Text-to-Speech** - AI responses read aloud with natural voices
- **Session Persistence** - Chat history saved across browser tabs and restarts
- **Session Management** - Create, switch, and manage multiple chat sessions
- **Auto-Titling** - Sessions automatically titled from first user message
- **Real-time Sync** - Live updates when switching between sessions

### 🚀 API Explorer
- **Interactive Documentation** - Live testing interface for all 8 MCP tools
- **Real-time Testing** - Execute API calls directly from the browser
- **Code Generation** - Auto-generated cURL and JavaScript examples
- **Copy-to-Clipboard** - Easy code sharing and integration
- **Comprehensive Coverage** - All endpoints documented with parameters and examples

### 🎨 Modern Frontend
- **Beautiful UI** - Clean, responsive design with TailwindCSS
- **Real-time Data** - Live cryptocurrency prices and market updates
- **Multiple Pages** - Dashboard, Markets, Assets, Analysis, Chat, and API Explorer
- **Mobile Friendly** - Responsive design works on all devices

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 9+

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/coinbase-chat-mcp.git
   cd coinbase-chat-mcp
   ```

2. **Install dependencies**
   ```bash
   npm install
   # Install dependencies for all workspaces
   cd mcp-server && npm install && cd ..
   cd frontend && npm install && cd ..
   cd api-server && npm install && cd ..
   ```

3. **Configure environment variables (Optional for AI features)**
   ```bash
   cd frontend
   # Create .env file with your OpenAI API key for voice features
   echo "VITE_OPENAI_API_KEY=your_openai_api_key_here" > .env
   cd ..
   ```

4. **Build the MCP server**
   ```bash
   cd mcp-server
   npm run build
   cd ..
   ```

5. **Start development servers**
   ```bash
   # Start API server (port 3002)
   cd api-server && npm run dev &
   
   # Start frontend (port 5173)
   cd frontend && npm run dev &
   ```

## 🤖 MCP Integration

### Cursor IDE Setup (Recommended)
The project includes pre-configured Cursor MCP settings:

1. **Automatic Configuration** - `.cursor/mcp.json` is already configured
2. **Restart Cursor** - MCP server will auto-load with 8 tools available
3. **Test Integration** - Try asking: "What's the current Bitcoin price?"

### Claude Desktop Setup
Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "coinbase-mcp": {
      "command": "node",
      "args": ["/path/to/coinbase-chat-mcp/mcp-server/dist/index.js"],
      "env": {
        "COINBASE_API_URL": "https://api.coinbase.com/v2",
        "LOG_LEVEL": "info"
      }
    }
  }
}
```

### Available MCP Tools

#### 📊 Market Data Tools (8)
1. **get_spot_price** - Current cryptocurrency prices
2. **get_historical_prices** - Historical price data with time ranges
3. **get_exchange_rates** - Fiat currency exchange rates
4. **search_assets** - Find cryptocurrencies and assets
5. **get_asset_details** - Detailed asset information
6. **get_market_stats** - 24-hour market statistics
7. **get_popular_pairs** - Popular trading pairs
8. **analyze_price_data** - Technical analysis (volatility, trends, support/resistance)

#### 🍺₿ Demo Transaction Tools (5) - NEW!
9. **calculate_beer_cost** - Convert beer money to crypto amounts
10. **simulate_btc_purchase** - Simulate buying crypto with USD
11. **buy_virtual_beer** 🔥 - Buy virtual beer WITH crypto! (Circular economy)
12. **get_virtual_wallet** - View demo wallet balance and stats
13. **get_transaction_history** - View simulated transaction history

🎯 **Try asking**: "Buy me a beer!" → AI will guide you through USD→BTC→Beer!
📖 **Full docs**: [DEMO_TRANSACTIONS.md](./DEMO_TRANSACTIONS.md) • [CIRCULAR_ECONOMY.md](./CIRCULAR_ECONOMY.md)

## 🏗️ Architecture

### System Overview

This project uses a **hybrid architecture** combining:
- **Real market data** from Coinbase Public API
- **Simulated wallet** for educational crypto transactions  
- **Official MCP protocol** for AI agent integration
- **Modern web stack** for beautiful UX

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ Cursor IDE  │  │ Web Browser │  │Claude Desktop│
│ (MCP Client)│  │ (React App) │  │ (MCP Client)│
└──────┬──────┘  └──────┬──────┘  └──────┬──────┘
       │                │                │
       └────────────────┴────────────────┘
                        │
       ┌────────────────┴────────────────┐
       │                                 │
       ▼                                 ▼
┌──────────────┐              ┌──────────────────┐
│  MCP Server  │              │   API Server     │
│  (13 tools)  │              │   (REST API)     │
└──────┬───────┘              └────────┬─────────┘
       │                               │
       └───────────┬───────────────────┘
                   │
       ┌───────────┴───────────┐
       │                       │
       ▼                       ▼
┌──────────────┐      ┌─────────────────┐
│ Coinbase API │      │ Demo Wallet     │
│ (Real Data)  │      │ (Simulated)     │
└──────────────┘      └─────────────────┘
```

📖 **Detailed Architecture**: See [ARCHITECTURE.md](./ARCHITECTURE.md) for:
- Component diagrams
- Code examples
- Real vs. simulated breakdown
- Comparison with Base MCP and x402
- Technical deep dive

### Key Components

```
coinbase-chat-mcp/
├── mcp-server/          # MCP Protocol Server (13 tools)
├── api-server/          # Express REST API Server  
├── frontend/            # React + TypeScript Frontend
│   ├── src/pages/       # Chat, Wallet, API Explorer
│   ├── src/components/  # Reusable UI components
│   └── src/services/    # AI, Voice, Chat sessions
├── docs/                # Comprehensive documentation
└── .cursor/             # Cursor IDE MCP configuration
```

### MCP Server
Exposes 13 tools through Model Context Protocol:

**Market Data Tools (8)**:
- Real-time prices, historical data, market stats
- Asset search and details, exchange rates
- Technical analysis (volatility, trends, support/resistance)

**Transaction Tools (5)**:
- 🍺₿ Beer-to-crypto calculator
- Virtual wallet simulation (USD → Crypto)
- Circular economy (Crypto → Beer!)
- Balance & transaction history

### Frontend Application
Modern React application featuring:
- **AI Chat** - GPT-4 powered with voice input 🎤 and TTS 🔊
- **Virtual Wallet** - Demo crypto purchases and beer economy 🍺₿
- **API Explorer** - Interactive documentation and testing
- **Tutorial** - Step-by-step MCP integration guide
- **Presentations** - Business slide deck viewer

## 🔧 Configuration

### Environment Variables
Create `.env` files for AI chat functionality:

```bash
# frontend/.env (Optional - for AI chat)
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

**Security Note**: The frontend includes built-in warnings about client-side API key usage and only enables AI features in development mode.

### 🤖 AI Chat & Voice Features Setup (Optional)
To enable the AI-powered chat interface with voice capabilities:

1. **Get OpenAI API Key**: Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. **Create frontend/.env file**:
   ```bash
   VITE_OPENAI_API_KEY=sk-your-actual-api-key-here
   ```
3. **Restart the frontend**: Chat will use GPT-4 for intelligent crypto discussions!

#### 🎤 Voice Features (Requires OpenAI API Key)
Once configured, you'll have access to:

- **🌐 Multi-Language Voice Input** - Speak questions in any language using OpenAI Whisper
  - Supports 50+ languages including English, Spanish, French, German, Russian, Chinese, Japanese, and more
  - Real-time speech-to-text transcription
  - Click the purple microphone button to start recording
  
- **🔊 Text-to-Speech Responses** - Hear AI responses read aloud
  - Click the speaker icon on any assistant message
  - Natural-sounding voices powered by OpenAI TTS
  - Multiple voice options available

- **⚡ Fallback Mode** - Without OpenAI key, basic Web Speech API provides English-only voice input

**Note**: Without the API key, the chat interface provides a helpful setup message and basic functionality.

## 📚 Usage Examples

### MCP Tools in Cursor/Claude
```
User: "What's the current Bitcoin price?"
Response: Current BTC-USD price: $100,608.65 USD

User: "Show me Ethereum's price trend over the last 7 days"
Response: [Historical price data with analysis]

User: "Analyze Bitcoin's volatility this month"
Response: [Technical analysis with volatility metrics]

User: "Buy me a beer worth of Bitcoin!" 🍺
Response: At $110,360 per BTC, $5 = 0.00004531 BTC
          ✅ Purchased! You now have 0.00004531 BTC

User: "Now buy a beer WITH that Bitcoin!"
Response: 🍺 Beer Purchased with Crypto!
          Paid: 0.00004531 BTC
          Received: 1 🍺
          🎉 Total beers in inventory: 1

User: "Show my wallet"
Response: 👛 Virtual Wallet
          💵 USD: $995.00
          🪙 BTC: 0.00000000
          🍺 Beers: 1
          Total transactions: 2
```

### Frontend Web Application
- **Visit**: `http://localhost:3005`
- **Chat**: Persistent conversations with session management
- **Voice Chat**: Click microphone to ask questions by voice in any language
- **Listen to Responses**: Click speaker icon on messages to hear them read aloud
- **API Explorer**: Test all 8 MCP tools interactively
- **Dashboard**: Real-time market overview
- **Markets**: Detailed trading statistics

### Direct API Usage
```bash
# Get current Bitcoin price
curl http://localhost:3002/api/v1/prices/BTC-USD

# Search for assets
curl http://localhost:3002/api/v1/assets/search?query=bitcoin
```

## 🛠️ Development

### Key Features Implemented
- ✅ **MCP Server** - 13 tools, full protocol compliance
- ✅ **Cursor Integration** - Pre-configured MCP setup
- ✅ **Circular Economy** 🍺₿ - Complete USD→Crypto→Beer simulation
- ✅ **Voice Interface** 🎤 - Multi-language input via Whisper
- ✅ **Text-to-Speech** 🔊 - AI responses read aloud
- ✅ **Virtual Wallet** - Demo crypto purchases and inventory
- ✅ **Chat Sessions** - Persistent conversations with localStorage
- ✅ **API Explorer** - Interactive documentation for all tools
- ✅ **Session Management** - Create, switch, delete chat sessions
- ✅ **AI Integration** - GPT-4 powered conversations with tool orchestration
- ✅ **Transaction UI** - Beautiful receipts and visual feedback
- ✅ **Security** - Rate limiting, validation, error handling

### Development Scripts
```bash
# Build MCP server
cd mcp-server && npm run build

# Start API server (development)
cd api-server && npm run dev

# Start frontend (development)  
cd frontend && npm run dev

# Test MCP server
cd mcp-server && npm test
```

### Project Structure
- **mcp-server/**: TypeScript MCP server with 13 tools (8 market data + 5 wallet)
- **api-server/**: Express.js REST API server with wallet simulation
- **frontend/**: React + TypeScript with TailwindCSS, voice features, wallet UI
- **docs/**: Comprehensive documentation (ARCHITECTURE.md, guides, etc.)
- **.cursor/**: Cursor IDE MCP configuration

## 📖 Documentation

### Core Documentation
- **[README.md](./README.md)** - This file! Project overview and quick start
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** 🏗️ - Complete technical architecture guide
  - System diagrams and component breakdown
  - Real vs. simulated components explained
  - Code examples and data flow
  - Comparison with Base MCP and x402
  - Technology stack deep dive

### Feature Guides
- **[DEMO_TRANSACTIONS.md](./DEMO_TRANSACTIONS.md)** 🍺₿ - Transaction tools reference
  - All 5 wallet tools explained
  - Usage examples and scenarios
  - API reference
  
- **[CIRCULAR_ECONOMY.md](./CIRCULAR_ECONOMY.md)** 🔄 - Complete economy guide
  - USD → Crypto → Beer flow
  - Smart suggestions when insufficient balance
  - Inventory tracking
  - Fun challenges and scenarios

- **[CHAT_WALLET_INTEGRATION.md](./CHAT_WALLET_INTEGRATION.md)** 💬 - Chat integration
  - Using wallet tools in conversation
  - Visual transaction receipts
  - Example conversations

### Setup & Configuration
- **[MCP_SETUP_NOTES.md](./MCP_SETUP_NOTES.md)** - MCP integration guide for Cursor/Claude
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment instructions
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Development contribution guidelines

### Interactive Docs
- **[API Explorer](http://localhost:5173/api-explorer)** - Interactive API testing (when running)
- **[Swagger UI](http://localhost:3002/api-docs)** - REST API documentation (when running)

## ✨ Recent Updates

### 🍺₿ Circular Economy (Latest!)
- **Buy virtual beer WITH cryptocurrency!** - Complete USD→Crypto→Beer flow
- **Smart AI guidance** - Suggests buying crypto if insufficient balance
- **Inventory tracking** - See your beer collection in wallet
- **Transaction receipts** - Beautiful visual feedback in chat
- **13 total MCP tools** - 8 market data + 5 transaction tools

### 🎤 Voice & AI Features
- **Multi-language voice input** - Speak questions in 50+ languages (OpenAI Whisper)
- **Text-to-speech** - Hear AI responses read aloud (OpenAI TTS)
- **GPT-4 integration** - Intelligent conversations with tool orchestration
- **Visual tool indicators** - See which MCP tools were used

### 💰 Virtual Wallet System
- **Demo transactions** - Safe crypto purchase simulation
- **Beer calculator** - Fun way to understand crypto value
- **Real-time pricing** - Uses live Coinbase data
- **Transaction history** - Track all purchases
- **Portfolio view** - See all balances in one place

### Chat Session Management
- Persistent chat sessions across browser tabs
- Session history with auto-titling
- Real-time session switching
- localStorage-based persistence
- Observer pattern for live updates

### API Explorer
- Interactive testing for all 8 MCP tools
- Real-time API responses
- Code generation (cURL, JavaScript)
- Copy-to-clipboard functionality
- Comprehensive parameter documentation

### Cursor MCP Integration
- Pre-configured `.cursor/mcp.json`
- Auto-loading of 8 MCP tools
- Ready-to-use cryptocurrency queries
- Professional development workflow

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 Roadmap

- [x] **v1.0**: Core MCP server with 8 tools
- [x] **v1.1**: Chat session persistence
- [x] **v1.2**: Interactive API explorer
- [x] **v1.3**: Cursor IDE integration
- [ ] **v1.4**: WebSocket real-time streaming
- [ ] **v1.5**: Advanced charting and technical indicators
- [ ] **v2.0**: Multi-exchange support

## 🐛 Known Issues

- Rate limiting on Coinbase public API (60 requests/hour for some endpoints)
- Chat sessions limited to localStorage (10 sessions max for performance)
- Client-side API keys should only be used in development

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Model Context Protocol](https://modelcontextprotocol.io/) team for the excellent specification
- [Coinbase](https://coinbase.com/) for providing robust public APIs
- [Cursor](https://cursor.sh/) for excellent MCP integration
- The open-source community for invaluable tools and libraries

## 📞 Support

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/your-username/coinbase-chat-mcp/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/your-username/coinbase-chat-mcp/discussions)
- 📧 **Questions**: Create an issue with the "question" label

---

**Made with ❤️ by Vladimir Bichev for the crypto and AI communities**