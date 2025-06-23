import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Copy, 
  CheckCircle, 
  Code2, 
  Globe, 
  Database,
  TrendingUp,
  Search,
  DollarSign,
  BarChart3,
  Activity,
  Loader2
} from 'lucide-react';

interface APIEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  title: string;
  description: string;
  category: string;
  parameters: Parameter[];
  example: {
    request: string;
    response: any;
  };
}

interface Parameter {
  name: string;
  type: 'string' | 'number' | 'boolean';
  required: boolean;
  description: string;
  example?: string;
  enum?: string[];
}

const APIExplorer: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<APIEndpoint | null>(null);
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  // Define API endpoints
  const endpoints: APIEndpoint[] = [
    {
      id: 'spot-price',
      method: 'GET',
      path: '/api/v1/prices/{currencyPair}/spot',
      title: 'Get Spot Price',
      description: 'Get the current spot price for a cryptocurrency pair',
      category: 'Prices',
      parameters: [
        {
          name: 'currencyPair',
          type: 'string',
          required: true,
          description: 'Currency pair (e.g., BTC-USD, ETH-USD)',
          example: 'BTC-USD'
        }
      ],
      example: {
        request: 'GET /api/v1/prices/BTC-USD/spot',
        response: {
          data: {
            amount: "45000.00",
            base: "BTC",
            currency: "USD"
          }
        }
      }
    },
    {
      id: 'historical-prices',
      method: 'GET',
      path: '/api/v1/prices/{currencyPair}/historical',
      title: 'Get Historical Prices',
      description: 'Get historical price data for a cryptocurrency pair',
      category: 'Prices',
      parameters: [
        {
          name: 'currencyPair',
          type: 'string',
          required: true,
          description: 'Currency pair (e.g., BTC-USD)',
          example: 'BTC-USD'
        },
        {
          name: 'start',
          type: 'string',
          required: false,
          description: 'Start date (ISO 8601 format)',
          example: '2024-01-01'
        },
        {
          name: 'end',
          type: 'string',
          required: false,
          description: 'End date (ISO 8601 format)',
          example: '2024-01-31'
        },
        {
          name: 'period',
          type: 'string',
          required: false,
          description: 'Time period granularity',
          enum: ['hour', 'day', 'week', 'month']
        }
      ],
      example: {
        request: 'GET /api/v1/prices/BTC-USD/historical?period=day',
        response: {
          data: {
            prices: [
              ["2024-01-01T00:00:00Z", "45000.00"],
              ["2024-01-02T00:00:00Z", "45500.00"]
            ]
          }
        }
      }
    },
    {
      id: 'exchange-rates',
      method: 'GET',
      path: '/api/v1/exchange-rates',
      title: 'Get Exchange Rates',
      description: 'Get exchange rates for a base currency',
      category: 'Exchange',
      parameters: [
        {
          name: 'currency',
          type: 'string',
          required: true,
          description: 'Base currency code',
          example: 'USD'
        }
      ],
      example: {
        request: 'GET /api/v1/exchange-rates?currency=USD',
        response: {
          data: {
            currency: "USD",
            rates: {
              "AED": "3.67",
              "AFN": "88.0",
              "EUR": "0.85"
            }
          }
        }
      }
    },
    {
      id: 'search-assets',
      method: 'GET',
      path: '/api/v1/assets/search',
      title: 'Search Assets',
      description: 'Search for cryptocurrency and fiat assets',
      category: 'Assets',
      parameters: [
        {
          name: 'query',
          type: 'string',
          required: true,
          description: 'Search query (asset name or symbol)',
          example: 'bitcoin'
        },
        {
          name: 'limit',
          type: 'number',
          required: false,
          description: 'Maximum number of results',
          example: '10'
        }
      ],
      example: {
        request: 'GET /api/v1/assets/search?query=bitcoin&limit=5',
        response: [
          {
            id: "bitcoin",
            name: "Bitcoin",
            code: "BTC",
            type: "crypto"
          }
        ]
      }
    },
    {
      id: 'list-assets',
      method: 'GET',
      path: '/api/v1/assets',
      title: 'List All Assets',
      description: 'Get a list of all available assets',
      category: 'Assets',
      parameters: [],
      example: {
        request: 'GET /api/v1/assets',
        response: {
          data: [
            {
              id: "bitcoin",
              name: "Bitcoin",
              code: "BTC",
              type: "crypto"
            }
          ]
        }
      }
    },
    {
      id: 'asset-details',
      method: 'GET',
      path: '/api/v1/assets/{assetId}',
      title: 'Get Asset Details',
      description: 'Get detailed information about a specific asset',
      category: 'Assets',
      parameters: [
        {
          name: 'assetId',
          type: 'string',
          required: true,
          description: 'Asset ID (e.g., bitcoin, ethereum)',
          example: 'bitcoin'
        }
      ],
      example: {
        request: 'GET /api/v1/assets/bitcoin',
        response: {
          data: {
            id: "bitcoin",
            name: "Bitcoin",
            code: "BTC",
            type: "crypto",
            color: "#f7931a"
          }
        }
      }
    },
    {
      id: 'market-stats',
      method: 'GET',
      path: '/api/v1/markets/{currencyPair}/stats',
      title: 'Get Market Statistics',
      description: 'Get 24-hour market statistics for a currency pair',
      category: 'Markets',
      parameters: [
        {
          name: 'currencyPair',
          type: 'string',
          required: true,
          description: 'Currency pair (e.g., BTC-USD)',
          example: 'BTC-USD'
        }
      ],
      example: {
        request: 'GET /api/v1/markets/BTC-USD/stats',
        response: {
          data: {
            open: "44000.00",
            high: "46000.00",
            low: "43500.00",
            volume: "1234.56",
            last: "45000.00"
          }
        }
      }
    },
    {
      id: 'popular-pairs',
      method: 'GET',
      path: '/api/v1/popular-pairs',
      title: 'Get Popular Trading Pairs',
      description: 'Get a list of popular cryptocurrency trading pairs',
      category: 'Markets',
      parameters: [],
      example: {
        request: 'GET /api/v1/popular-pairs',
        response: {
          data: [
            "BTC-USD",
            "ETH-USD",
            "LTC-USD",
            "BCH-USD"
          ]
        }
      }
    },
    {
      id: 'price-analysis',
      method: 'GET',
      path: '/api/v1/analysis/{currencyPair}',
      title: 'Analyze Price Data',
      description: 'Perform technical analysis on cryptocurrency price data',
      category: 'Analysis',
      parameters: [
        {
          name: 'currencyPair',
          type: 'string',
          required: true,
          description: 'Currency pair to analyze',
          example: 'BTC-USD'
        },
        {
          name: 'period',
          type: 'string',
          required: false,
          description: 'Analysis period',
          enum: ['1d', '7d', '30d', '1y']
        },
        {
          name: 'metrics',
          type: 'string',
          required: false,
          description: 'Comma-separated list of metrics',
          example: 'volatility,trend,volume'
        }
      ],
      example: {
        request: 'GET /api/v1/analysis/BTC-USD?period=7d&metrics=volatility,trend',
        response: {
          data: {
            volatility: 0.045,
            trend: "bullish",
            analysis: "Price showing upward momentum"
          }
        }
      }
    }
  ];

  const categories = [...new Set(endpoints.map(e => e.category))];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Prices': return <DollarSign className="w-4 h-4" />;
      case 'Exchange': return <Globe className="w-4 h-4" />;
      case 'Assets': return <Database className="w-4 h-4" />;
      case 'Markets': return <BarChart3 className="w-4 h-4" />;
      case 'Analysis': return <TrendingUp className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-100 text-green-800';
      case 'POST': return 'bg-blue-100 text-blue-800';
      case 'PUT': return 'bg-yellow-100 text-yellow-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const buildRequestUrl = (endpoint: APIEndpoint): string => {
            const baseUrl = import.meta.env.VITE_API_URL || '';
        let url = `${baseUrl}${endpoint.path}`;
    const pathParams: string[] = [];
    const queryParams: string[] = [];

    endpoint.parameters.forEach(param => {
      const value = paramValues[param.name] || param.example || '';
      if (endpoint.path.includes(`{${param.name}}`)) {
        url = url.replace(`{${param.name}}`, value);
        pathParams.push(param.name);
      } else if (value) {
        queryParams.push(`${param.name}=${encodeURIComponent(value)}`);
      }
    });

    if (queryParams.length > 0) {
      url += '?' + queryParams.join('&');
    }

    return url;
  };

  const testEndpoint = async (endpoint: APIEndpoint) => {
    setLoading(true);
    setTestResults(null);

    try {
      const url = buildRequestUrl(endpoint);
      const response = await fetch(url);
      const data = await response.json();

      setTestResults({
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data: data,
        url: url
      });
    } catch (error) {
      setTestResults({
        error: error instanceof Error ? error.message : 'Unknown error',
        url: buildRequestUrl(endpoint)
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedEndpoint(id);
      setTimeout(() => setCopiedEndpoint(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const generateCurlCommand = (endpoint: APIEndpoint): string => {
    const url = buildRequestUrl(endpoint);
    return `curl -X ${endpoint.method} "${url}" \\
  -H "Accept: application/json"`;
  };

  useEffect(() => {
    if (endpoints.length > 0) {
      setSelectedEndpoint(endpoints[0]);
    }
  }, []);

  return (
    <div className="flex h-full bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Code2 className="w-6 h-6 text-blue-600" />
            <span>API Explorer</span>
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Interactive Coinbase MCP API documentation
          </p>
        </div>

        {categories.map(category => (
          <div key={category} className="border-b border-gray-100">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                {getCategoryIcon(category)}
                <span>{category}</span>
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
              {endpoints
                .filter(endpoint => endpoint.category === category)
                .map(endpoint => (
                  <button
                    key={endpoint.id}
                    onClick={() => setSelectedEndpoint(endpoint)}
                    className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                      selectedEndpoint?.id === endpoint.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getMethodColor(endpoint.method)}`}>
                        {endpoint.method}
                      </span>
                    </div>
                    <h4 className="font-medium text-gray-900 text-sm mb-1">{endpoint.title}</h4>
                    <p className="text-xs text-gray-600 line-clamp-2">{endpoint.description}</p>
                    <code className="text-xs text-gray-500 mt-1 block font-mono">
                      {endpoint.path}
                    </code>
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {selectedEndpoint ? (
          <div className="p-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 text-sm font-medium rounded ${getMethodColor(selectedEndpoint.method)}`}>
                    {selectedEndpoint.method}
                  </span>
                  <h1 className="text-2xl font-bold text-gray-900">{selectedEndpoint.title}</h1>
                </div>
                <button
                  onClick={() => copyToClipboard(selectedEndpoint.path, selectedEndpoint.id)}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {copiedEndpoint === selectedEndpoint.id ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  <span>Copy Path</span>
                </button>
              </div>
              <p className="text-gray-600 mb-4">{selectedEndpoint.description}</p>
              <div className="bg-gray-900 rounded-lg p-4">
                <code className="text-green-400 font-mono text-sm">
                  {selectedEndpoint.method} {selectedEndpoint.path}
                </code>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Parameters */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Parameters</h2>
                {selectedEndpoint.parameters.length > 0 ? (
                  <div className="space-y-4">
                    {selectedEndpoint.parameters.map(param => (
                      <div key={param.name} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">{param.name}</span>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {param.type}
                            </span>
                            {param.required && (
                              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                                required
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{param.description}</p>
                        {param.enum ? (
                          <select
                            value={paramValues[param.name] || ''}
                            onChange={(e) => setParamValues(prev => ({ ...prev, [param.name]: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Select {param.name}</option>
                            {param.enum.map(value => (
                              <option key={value} value={value}>{value}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={param.type === 'number' ? 'number' : 'text'}
                            placeholder={param.example}
                            value={paramValues[param.name] || ''}
                            onChange={(e) => setParamValues(prev => ({ ...prev, [param.name]: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No parameters required</p>
                )}

                <div className="mt-6">
                  <button
                    onClick={() => testEndpoint(selectedEndpoint)}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                    <span>{loading ? 'Testing...' : 'Test Endpoint'}</span>
                  </button>
                </div>
              </div>

              {/* Response */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Response</h2>
                
                {testResults ? (
                  <div className="space-y-4">
                    {/* Status */}
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">Status:</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        testResults.status >= 200 && testResults.status < 300
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {testResults.status || 'Error'} {testResults.statusText || ''}
                      </span>
                    </div>

                    {/* URL */}
                    <div>
                      <span className="text-sm font-medium text-gray-700">Request URL:</span>
                      <div className="mt-1 bg-gray-100 rounded p-2">
                        <code className="text-xs text-gray-800 break-all">{testResults.url}</code>
                      </div>
                    </div>

                    {/* Response Data */}
                    <div>
                      <span className="text-sm font-medium text-gray-700">Response:</span>
                      <div className="mt-1 bg-gray-900 rounded-lg p-4 overflow-x-auto">
                        <pre className="text-sm text-green-400">
                          {JSON.stringify(testResults.data || testResults.error, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="bg-gray-100 rounded-lg p-6">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Example Response</h3>
                      <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                        <pre className="text-sm text-green-400">
                          {JSON.stringify(selectedEndpoint.example.response, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Code Examples */}
            <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Code Examples</h2>
              
              <div className="space-y-4">
                {/* cURL */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-700">cURL</h3>
                    <button
                      onClick={() => copyToClipboard(generateCurlCommand(selectedEndpoint), `curl-${selectedEndpoint.id}`)}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      {copiedEndpoint === `curl-${selectedEndpoint.id}` ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-4">
                    <pre className="text-sm text-green-400 overflow-x-auto">
                      {generateCurlCommand(selectedEndpoint)}
                    </pre>
                  </div>
                </div>

                {/* JavaScript */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-700">JavaScript (fetch)</h3>
                    <button
                      onClick={() => copyToClipboard(
                        `const response = await fetch('${buildRequestUrl(selectedEndpoint)}');\nconst data = await response.json();\nconsole.log(data);`,
                        `js-${selectedEndpoint.id}`
                      )}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      {copiedEndpoint === `js-${selectedEndpoint.id}` ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-4">
                    <pre className="text-sm text-blue-400 overflow-x-auto">
{`const response = await fetch('${buildRequestUrl(selectedEndpoint)}');
const data = await response.json();
console.log(data);`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Select an API Endpoint</h2>
              <p className="text-gray-600">Choose an endpoint from the sidebar to explore its documentation and test it.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default APIExplorer; 