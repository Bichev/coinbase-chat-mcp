#!/bin/bash

echo "🚀 Deploying Coinbase Chat MCP to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Build frontend first
echo "🔨 Building frontend..."
cd frontend
npm install
npm run build
cd ..

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo ""
echo "🔧 Next steps:"
echo "1. Set environment variables in Vercel dashboard:"
echo "   - VITE_OPENAI_API_KEY (for AI functionality)"
echo "   - VITE_API_URL (leave empty for production)"
echo ""
echo "2. Your app should be live at the provided URL!"
echo "3. Test the API endpoints at: https://your-domain/api/v1/health" 