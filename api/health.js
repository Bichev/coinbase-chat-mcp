export default function handler(req, res) {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'coinbase-mcp-api',
    method: req.method,
    url: req.url
  });
} 