# Vercel Deployment Guide

## Quick Deploy

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Run the deployment script**:
   ```bash
   ./deploy.sh
   ```

## Manual Deployment Steps

### 1. Connect to Vercel

```bash
# Login to Vercel
vercel login

# Link your project
vercel
```

### 2. Configure Environment Variables

In your Vercel dashboard (`vercel.com/dashboard`), go to:
`Settings > Environment Variables`

Add these variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `VITE_OPENAI_API_KEY` | `your_openai_api_key` | Production |
| `VITE_API_URL` | _(leave empty)_ | Production |

### 3. Deploy

```bash
vercel --prod
```

## Architecture Overview

### Services Deployed:
- ✅ **Frontend** (React/Vite) → Static hosting
- ✅ **API Server** → Serverless functions (`/api/v1/*`)
- ❌ **MCP Server** → Not deployed (local development only)

### API Endpoints Available:
- `GET /api/v1/health` - Health check
- `GET /api/v1/prices/{pair}/spot` - Spot prices
- `GET /api/v1/markets/{pair}/stats` - Market stats
- `GET /api/v1/popular-pairs` - Popular trading pairs
- `GET /api/v1/assets/search` - Asset search
- `GET /api/v1/exchange-rates` - Exchange rates
- `GET /api/v1/analysis/{pair}` - Price analysis

## File Structure

```
coinbase-chat-mcp/
├── vercel.json              # Vercel configuration
├── api/
│   ├── index.js            # Serverless API functions
│   └── package.json        # API dependencies
├── frontend/
│   ├── dist/               # Built frontend (auto-generated)
│   └── src/                # React source code
└── deploy.sh               # Deployment script
```

## Production Features

### ✅ Included in Deployment:
- 🔒 Rate limiting (3 requests/minute)
- 🛡️ Conversation guardrails
- 📱 Responsive mobile design
- 🎨 Beautiful UI with Tailwind CSS
- 📊 Interactive Mermaid diagrams
- 🔍 Real-time cryptocurrency data
- 💬 AI-powered chat (with OpenAI key)
- 📚 Comprehensive tutorial system
- 🌍 Global attribution header

### ⚠️ Not Included:
- MCP Server (local development only)
- Claude integration (Cursor IDE only)
- Historical price data (simplified for serverless)
- Advanced caching (Redis not available in free tier)

## Testing Your Deployment

1. **Health Check**:
   ```bash
   curl https://your-domain.vercel.app/api/v1/health
   ```

2. **Bitcoin Price**:
   ```bash
   curl https://your-domain.vercel.app/api/v1/prices/BTC-USD/spot
   ```

3. **Frontend**:
   Visit `https://your-domain.vercel.app`

## Troubleshooting

### Common Issues:

1. **API calls failing**:
   - Check that `VITE_API_URL` is empty in production
   - Verify API endpoints with `/health` check

2. **AI chat not working**:
   - Add `VITE_OPENAI_API_KEY` in Vercel dashboard
   - Redeploy after adding environment variables

3. **Build failures**:
   - Check Node.js version compatibility
   - Verify all dependencies in `package.json`

### Logs:
```bash
vercel logs your-deployment-url
```

## Custom Domain (Optional)

1. In Vercel dashboard: `Settings > Domains`
2. Add your custom domain
3. Update DNS records as instructed

## Performance Optimizations

- ✅ Static asset caching
- ✅ Serverless function optimization
- ✅ Minimal API surface
- ✅ Gzip compression
- ✅ Tree-shaken builds

## Security Features

- 🔒 CORS protection
- 🛡️ Rate limiting per IP
- 🔐 Environment variable security
- 🚫 No sensitive data in client
- 📝 Topic-restricted conversations

---

**Made with ❤️ by Vladimir Bichev for the crypto and AI communities**

- 🔗 [LinkedIn](https://www.linkedin.com/in/vladimir-bichev-383b1525/)
- 📱 [GitHub](https://github.com/Bichev/coinbase-chat-mcp) 