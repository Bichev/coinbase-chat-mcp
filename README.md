# Coinbase Chat MCP

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-blue.svg)](https://www.typescriptlang.org/)
[![Model Context Protocol](https://img.shields.io/badge/MCP-Compatible-orange.svg)](https://modelcontextprotocol.io/)

A professional-grade, open-source **Model Context Protocol (MCP)** agent for seamless integration with Coinbase's public API. This project enables AI agents and LLMs to interact with cryptocurrency data, market information, and trading insights through a standardized, secure interface.

## 🌟 Features

### 🔌 MCP Server
- **Full MCP Compliance** - Implements complete Model Context Protocol specification
- **Real-time Data** - Live cryptocurrency prices, market data, and exchange rates
- **Secure Tools** - Execute Coinbase API queries safely through MCP tools
- **Rich Resources** - Access historical data, market trends, and asset information
- **Smart Prompts** - Pre-built prompts for common crypto analysis tasks

### 🚀 API Server
- **RESTful Endpoints** - Clean, documented API for direct integration
- **Rate Limiting** - Built-in protection against API abuse
- **Caching** - Intelligent caching for improved performance
- **OpenAPI Spec** - Complete API documentation with Swagger UI

### 💻 Frontend
- **Modern UI** - Beautiful React-based interface
- **Real-time Updates** - Live data streaming and WebSocket support
- **Interactive Charts** - Comprehensive market visualization
- **Responsive Design** - Works perfectly on desktop and mobile

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
   npm run install:all
   ```

3. **Start development servers**
   ```bash
   npm run dev
   ```

This will start:
- MCP Server on port 3001
- API Server on port 3002  
- Frontend on port 3000

## 🏗️ Architecture

```
coinbase-chat-mcp/
├── mcp-server/          # MCP Protocol Server
├── api-server/          # REST API Server  
├── frontend/            # React Frontend
├── docs/                # Documentation
└── shared/              # Shared utilities
```

### MCP Server
The core MCP server exposes Coinbase data through three main MCP primitives:

- **🔧 Tools**: Execute API calls (get prices, search assets, market data)
- **📄 Resources**: Access static data (asset details, exchange info)  
- **💬 Prompts**: Pre-built templates for crypto analysis

### API Server
RESTful API providing:
- `/api/v1/prices` - Current cryptocurrency prices
- `/api/v1/assets` - Asset information and metadata
- `/api/v1/markets` - Market data and statistics
- `/api/v1/exchange-rates` - Fiat exchange rates

### Frontend
Modern React application featuring:
- Real-time price dashboard
- Interactive market charts
- MCP server testing interface
- API documentation viewer

## 🔧 Configuration

### Environment Variables
Create `.env` files in each workspace:

```bash
# mcp-server/.env
COINBASE_API_URL=https://api.coinbase.com/v2
LOG_LEVEL=info
PORT=3001

# api-server/.env  
COINBASE_API_URL=https://api.coinbase.com/v2
REDIS_URL=redis://localhost:6379
PORT=3002

# frontend/.env
REACT_APP_API_URL=http://localhost:3002
REACT_APP_MCP_URL=http://localhost:3001
```

## 📚 Usage

### With MCP Clients

The server is compatible with any MCP client. For Claude Desktop:

1. Add to your Claude Desktop config:
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

2. Restart Claude Desktop and start using Coinbase tools!

### Direct API Usage

```bash
# Get current Bitcoin price
curl http://localhost:3002/api/v1/prices/BTC-USD

# List available cryptocurrencies  
curl http://localhost:3002/api/v1/assets

# Get market data
curl http://localhost:3002/api/v1/markets/BTC-USD/stats
```

### Programmatic Usage

```typescript
import { CoinbaseMCPServer } from './mcp-server/src/index.js';

const server = new CoinbaseMCPServer({
  name: 'coinbase-mcp',
  version: '1.0.0'
});

await server.start();
```

## 🛠️ Development

### Scripts
- `npm run dev` - Start all services in development mode
- `npm run build` - Build all packages for production
- `npm run test` - Run test suites
- `npm run lint` - Lint all code
- `npm run clean` - Clean build artifacts

### Project Structure
Each workspace is independently managed:
- **mcp-server/**: TypeScript MCP server implementation
- **api-server/**: Express.js REST API server
- **frontend/**: React + TypeScript frontend
- **shared/**: Common utilities and types

### Testing
```bash
# Test MCP server
npm run test --workspace=mcp-server

# Test API endpoints  
npm run test --workspace=api-server

# Test frontend components
npm run test --workspace=frontend
```

## 📖 Documentation

- **[MCP Server Documentation](./mcp-server/README.md)** - Detailed MCP implementation guide
- **[API Documentation](./api-server/README.md)** - REST API reference
- **[Frontend Guide](./frontend/README.md)** - UI development guide  
- **[Deployment Guide](./docs/deployment.md)** - Production deployment instructions

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 Roadmap

- [ ] **v1.1**: Advanced charting and technical indicators
- [ ] **v1.2**: WebSocket real-time streaming
- [ ] **v1.3**: Portfolio tracking (public data only)
- [ ] **v1.4**: DeFi protocol integration
- [ ] **v2.0**: Multi-exchange support

## 🐛 Known Issues

- Rate limiting on Coinbase public API may affect real-time features
- Some historical data requires pagination for large datasets

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Model Context Protocol](https://modelcontextprotocol.io/) team for the excellent specification
- [Coinbase](https://coinbase.com/) for providing robust public APIs
- The open-source community for invaluable tools and libraries

## 📞 Support

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/your-username/coinbase-chat-mcp/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/your-username/coinbase-chat-mcp/discussions)
- 📧 **Email**: support@your-domain.com

---

**Made with ❤️ for the crypto and AI communities**