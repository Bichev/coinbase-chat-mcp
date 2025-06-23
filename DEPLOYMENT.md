# Coinbase Chat MCP - Deployment Guide

## 🚀 Quick Deploy to Vercel

### Prerequisites
- [Vercel account](https://vercel.com)
- [OpenAI API key](https://platform.openai.com/api-keys) (for AI features)

### 1. Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/coinbase-chat-mcp)

Or manually:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project root
cd frontend
vercel --prod
```

### 2. Configure Environment Variables

In your Vercel dashboard, add these environment variables:

| Variable | Value | Required |
|----------|-------|----------|
| `VITE_OPENAI_API_KEY` | `sk-your-openai-api-key-here` | Yes (for AI features) |
| `VITE_API_URL` | `https://your-backend-url.vercel.app` | Optional |

### 3. Backend Deployment

The MCP server and API backend can be deployed separately:

```bash
# Deploy API server
cd api-server
vercel --prod

# Deploy MCP server (if needed separately)
cd mcp-server
vercel --prod
```

## 🔒 Security Features Implemented

### Rate Limiting
- **Limit**: 3 requests per minute per user
- **Storage**: Client-side localStorage (educational purposes)
- **Reset**: Automatic after 1 minute window
- **UI**: Visual indicator showing remaining requests

### Conversation Guardrails
- **Allowed Topics**: Cryptocurrency, blockchain, trading, MCP technology
- **Blocked Topics**: Pets, weather, food, entertainment, etc.
- **Behavior**: Politely redirects off-topic conversations
- **Implementation**: Keyword-based filtering with smart detection

## 🎓 Educational Configuration

### Rate Limiting Configuration
```typescript
// In aiService.ts
const RATE_LIMIT_MAX_REQUESTS = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
```

### Topic Guardrails
```typescript
// Allowed topics
const ALLOWED_TOPICS = [
  'cryptocurrency', 'crypto', 'bitcoin', 'ethereum', 'blockchain', 
  'trading', 'price', 'market', 'analysis', 'mcp', 'coinbase'
];

// Blocked topics  
const OFF_TOPIC_KEYWORDS = [
  'cat', 'dog', 'animal', 'weather', 'food', 'movie', 'music'
];
```

## 🛠️ Customization

### Adjust Rate Limits
To modify rate limits for your deployment:

1. Edit `frontend/src/services/aiService.ts`
2. Change `RATE_LIMIT_MAX_REQUESTS` and `RATE_LIMIT_WINDOW_MS`
3. Redeploy to Vercel

### Modify Topic Guardrails
To adjust conversation topics:

1. Edit `ALLOWED_TOPICS` and `OFF_TOPIC_KEYWORDS` arrays
2. Modify the `isTopicAllowed()` method logic
3. Update system prompts in the AI service

### Environment Variables for Customization
```bash
# Optional: Custom rate limiting (if implemented)
VITE_RATE_LIMIT_MAX_REQUESTS=5
VITE_RATE_LIMIT_WINDOW_MS=120000

# Optional: Custom API endpoints
VITE_API_URL=https://your-custom-api.com
```

## 📊 Monitoring & Analytics

### Rate Limit Monitoring
- Visual indicators in the UI
- Console logging for debugging
- localStorage tracking for persistence

### Usage Patterns
- Topic filtering effectiveness
- Rate limit hit frequency
- User engagement metrics

## 🔧 Troubleshooting

### Common Issues

1. **Rate Limit Not Working**
   - Check localStorage is enabled
   - Verify browser compatibility
   - Clear localStorage if needed

2. **Guardrails Too Restrictive**
   - Add more allowed topics
   - Adjust keyword detection logic
   - Update system prompts

3. **OpenAI API Issues**
   - Verify API key is correct
   - Check API quota and billing
   - Ensure CORS is configured

### Debug Mode
Enable debug logging:
```typescript
// Add to aiService.ts
const DEBUG = true;
console.log('Rate limit check:', rateCheck);
console.log('Topic allowed:', isAllowed);
```

## 🚀 Production Recommendations

1. **Server-Side Rate Limiting**: Move to backend for production
2. **Database Storage**: Replace localStorage with Redis/DB
3. **Advanced Guardrails**: Implement ML-based content filtering
4. **Monitoring**: Add proper analytics and logging
5. **Caching**: Implement response caching for better performance

## 📝 License & Usage

This project is designed for educational purposes. The rate limiting and guardrails are implemented to:
- Demonstrate responsible AI usage
- Protect API quotas during learning
- Focus conversations on relevant topics
- Provide a professional demo experience

For production use, consider implementing proper server-side controls and authentication. 