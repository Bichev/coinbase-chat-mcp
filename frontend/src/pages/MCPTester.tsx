import { useState } from 'react';
import { 
  WrenchScrewdriverIcon, 
  DocumentTextIcon, 
  ChatBubbleLeftRightIcon,
  PlayIcon,
  ClipboardIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

interface ToolResult {
  success: boolean;
  data?: any;
  error?: string;
  timestamp: number;
}

interface Tool {
  name: string;
  title: string;
  description: string;
  parameters: Array<{
    name: string;
    type: string;
    description: string;
    required: boolean;
    options?: string[];
  }>;
}

const TOOLS: Tool[] = [
  {
    name: 'get_spot_price',
    title: 'Get Spot Price',
    description: 'Get current spot price for a cryptocurrency pair',
    parameters: [
      { name: 'currencyPair', type: 'string', description: 'Currency pair (e.g., BTC-USD)', required: true }
    ]
  },
  {
    name: 'get_historical_prices',
    title: 'Get Historical Prices',
    description: 'Get historical price data for a cryptocurrency pair',
    parameters: [
      { name: 'currencyPair', type: 'string', description: 'Currency pair (e.g., BTC-USD)', required: true },
      { name: 'start', type: 'string', description: 'Start date (ISO format)', required: false },
      { name: 'end', type: 'string', description: 'End date (ISO format)', required: false },
      { name: 'period', type: 'select', description: 'Price period', required: false, options: ['hour', 'day'] }
    ]
  },
  {
    name: 'get_exchange_rates',
    title: 'Get Exchange Rates',
    description: 'Get exchange rates for a base currency',
    parameters: [
      { name: 'currency', type: 'string', description: 'Base currency code (e.g., USD)', required: true }
    ]
  },
  {
    name: 'search_assets',
    title: 'Search Assets',
    description: 'Search for cryptocurrency and fiat assets',
    parameters: [
      { name: 'query', type: 'string', description: 'Search query', required: true },
      { name: 'limit', type: 'number', description: 'Maximum results (default: 10)', required: false }
    ]
  },
  {
    name: 'get_asset_details',
    title: 'Get Asset Details',
    description: 'Get detailed information about a specific asset',
    parameters: [
      { name: 'assetId', type: 'string', description: 'Asset ID or code (e.g., BTC)', required: true }
    ]
  },
  {
    name: 'get_market_stats',
    title: 'Get Market Statistics',
    description: 'Get 24-hour market statistics for a currency pair',
    parameters: [
      { name: 'currencyPair', type: 'string', description: 'Currency pair (e.g., BTC-USD)', required: true }
    ]
  },
  {
    name: 'get_popular_pairs',
    title: 'Get Popular Pairs',
    description: 'Get list of popular cryptocurrency trading pairs',
    parameters: []
  },
  {
    name: 'analyze_price_data',
    title: 'Analyze Price Data',
    description: 'Perform technical analysis on price data',
    parameters: [
      { name: 'currencyPair', type: 'string', description: 'Currency pair (e.g., BTC-USD)', required: true },
      { name: 'period', type: 'select', description: 'Analysis period', required: true, options: ['1d', '7d', '30d', '1y'] },
      { name: 'metrics', type: 'multiselect', description: 'Analysis metrics', required: true, options: ['volatility', 'trend', 'support_resistance', 'volume'] }
    ]
  }
];

const RESOURCES = [
  {
    name: 'market-overview',
    uri: 'coinbase://market/overview',
    title: 'Market Overview',
    description: 'Overview of major cryptocurrency markets'
  },
  {
    name: 'asset-info',
    uri: 'coinbase://assets/{assetId}',
    title: 'Asset Information',
    description: 'Detailed information about a specific asset'
  }
];

const PROMPTS = [
  {
    name: 'analyze-crypto-price',
    title: 'Analyze Cryptocurrency Price',
    description: 'AI-powered analysis of cryptocurrency price movements',
    parameters: [
      { name: 'currencyPair', type: 'string', description: 'Currency pair (e.g., BTC-USD)', required: true },
      { name: 'timeframe', type: 'select', description: 'Analysis timeframe', required: true, options: ['1d', '7d', '30d', '1y'] }
    ]
  },
  {
    name: 'compare-cryptocurrencies',
    title: 'Compare Cryptocurrencies',
    description: 'Compare multiple cryptocurrencies across various metrics',
    parameters: [
      { name: 'currencies', type: 'string', description: 'Comma-separated currency pairs', required: true }
    ]
  },
  {
    name: 'portfolio-diversification-advice',
    title: 'Portfolio Diversification Advice',
    description: 'Get AI advice on cryptocurrency portfolio diversification',
    parameters: [
      { name: 'riskTolerance', type: 'select', description: 'Risk tolerance', required: true, options: ['conservative', 'moderate', 'aggressive'] },
      { name: 'investmentAmount', type: 'string', description: 'Investment amount in USD', required: true }
    ]
  }
];

export default function MCPTester() {
  const [activeTab, setActiveTab] = useState<'tools' | 'resources' | 'prompts'>('tools');
  const [selectedTool, setSelectedTool] = useState<string>('');
  const [selectedResource, setSelectedResource] = useState<string>('');
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');
  const [toolParams, setToolParams] = useState<Record<string, any>>({});
  const [resourceParams, setResourceParams] = useState<Record<string, any>>({});
  const [promptParams, setPromptParams] = useState<Record<string, any>>({});
  const [results, setResults] = useState<Record<string, ToolResult>>({});
  const [loading, setLoading] = useState<string>('');

  const executeTool = async (toolName: string, params: Record<string, any>) => {
    setLoading(toolName);
    
    try {
      let endpoint = '';
      let queryParams = new URLSearchParams();
      
      switch (toolName) {
        case 'get_spot_price':
          endpoint = `/api/v1/prices/${params.currencyPair}/spot`;
          break;
        case 'get_historical_prices':
          endpoint = `/api/v1/prices/${params.currencyPair}/historic`;
          if (params.start) queryParams.append('start', params.start);
          if (params.end) queryParams.append('end', params.end);
          if (params.period) queryParams.append('period', params.period);
          break;
        case 'get_exchange_rates':
          endpoint = `/api/v1/exchange-rates`;
          queryParams.append('currency', params.currency);
          break;
        case 'search_assets':
          endpoint = `/api/v1/assets/search`;
          queryParams.append('query', params.query);
          if (params.limit) queryParams.append('limit', params.limit.toString());
          break;
        case 'get_asset_details':
          endpoint = `/api/v1/assets/${params.assetId}`;
          break;
        case 'get_market_stats':
          endpoint = `/api/v1/markets/${params.currencyPair}/stats`;
          break;
        case 'get_popular_pairs':
          endpoint = `/api/v1/popular-pairs`;
          break;
        case 'analyze_price_data':
          endpoint = `/api/v1/analysis/${params.currencyPair}`;
          if (params.period) queryParams.append('period', params.period);
          if (params.metrics) queryParams.append('metrics', params.metrics.join(','));
          break;
        default:
          throw new Error(`Unknown tool: ${toolName}`);
      }

      const url = `http://localhost:3002${endpoint}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      setResults(prev => ({
        ...prev,
        [toolName]: {
          success: true,
          data,
          timestamp: Date.now()
        }
      }));
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [toolName]: {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: Date.now()
        }
      }));
    } finally {
      setLoading('');
    }
  };

  const executeResource = async (resourceName: string, params: Record<string, any>) => {
    setLoading(resourceName);
    
    try {
      let data;
      if (resourceName === 'market-overview') {
        const pairsResponse = await fetch('http://localhost:3002/api/v1/popular-pairs');
        const pairsData = await pairsResponse.json();
        
        const prices = await Promise.all(
          pairsData.data.slice(0, 5).map(async (pair: string) => {
            try {
              const priceResponse = await fetch(`http://localhost:3002/api/v1/prices/${pair}/spot`);
              const priceData = await priceResponse.json();
              return { pair, ...priceData.data };
            } catch {
              return null;
            }
          })
        );
        
        data = {
          overview: 'Coinbase Market Overview',
          prices: prices.filter(Boolean)
        };
      } else if (resourceName === 'asset-info' && params.assetId) {
        const response = await fetch(`http://localhost:3002/api/v1/assets/${params.assetId}`);
        data = await response.json();
      } else {
        throw new Error('Resource requires parameters');
      }

      setResults(prev => ({
        ...prev,
        [resourceName]: {
          success: true,
          data,
          timestamp: Date.now()
        }
      }));
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [resourceName]: {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: Date.now()
        }
      }));
    } finally {
      setLoading('');
    }
  };

  const executePrompt = async (promptName: string, params: Record<string, any>) => {
    setLoading(promptName);
    
    try {
      let promptText = '';
      
      switch (promptName) {
        case 'analyze-crypto-price':
          promptText = `Please analyze the price movement of ${params.currencyPair} over the ${params.timeframe} timeframe.

Use the following tools to gather data:
1. get_spot_price - Get current price
2. get_market_stats - Get 24h statistics  
3. analyze_price_data - Get technical analysis

Provide insights on:
- Current price level and recent changes
- Volatility and trend direction
- Support and resistance levels
- Overall market sentiment
- Potential trading opportunities or risks`;
          break;
        case 'compare-cryptocurrencies':
          promptText = `Please compare the following cryptocurrencies: ${params.currencies}

For each currency, gather:
1. Current spot price
2. 24-hour market statistics
3. Price analysis and trends

Then provide a comprehensive comparison covering:
- Price performance and volatility
- Market capitalization considerations
- Trading volume and liquidity
- Technical indicators and trends
- Risk assessment for each asset`;
          break;
        case 'portfolio-diversification-advice':
          promptText = `Please provide cryptocurrency portfolio diversification advice for:
- Risk tolerance: ${params.riskTolerance}
- Investment amount: $${params.investmentAmount}

Use the available tools to:
1. Get popular trading pairs
2. Analyze price data for major cryptocurrencies
3. Get current market statistics

Provide recommendations for:
- Asset allocation percentages
- Specific cryptocurrencies to consider
- Risk management strategies`;
          break;
      }

      setResults(prev => ({
        ...prev,
        [promptName]: {
          success: true,
          data: {
            prompt: promptText,
            parameters: params,
            note: "This is the prompt that would be sent to an AI assistant with access to MCP tools"
          },
          timestamp: Date.now()
        }
      }));
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [promptName]: {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: Date.now()
        }
      }));
    } finally {
      setLoading('');
    }
  };

  const handleToolSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTool) {
      executeTool(selectedTool, toolParams);
    }
  };

  const handleResourceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedResource) {
      executeResource(selectedResource, resourceParams);
    }
  };

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPrompt) {
      executePrompt(selectedPrompt, promptParams);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">MCP Tester</h1>
        <p className="mt-2 text-gray-600">Test and interact with the Model Context Protocol server</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'tools', name: 'Tools', icon: WrenchScrewdriverIcon, count: TOOLS.length },
            { id: 'resources', name: 'Resources', icon: DocumentTextIcon, count: RESOURCES.length },
            { id: 'prompts', name: 'Prompts', icon: ChatBubbleLeftRightIcon, count: PROMPTS.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
            >
              <tab.icon className="h-5 w-5" />
              <span>{tab.name}</span>
              <span className="bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Configuration */}
        <div className="space-y-4">
          {activeTab === 'tools' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Test Tools</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Tool
                </label>
                <select
                  value={selectedTool}
                  onChange={(e) => {
                    setSelectedTool(e.target.value);
                    setToolParams({});
                  }}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a tool...</option>
                  {TOOLS.map((tool) => (
                    <option key={tool.name} value={tool.name}>
                      {tool.title}
                    </option>
                  ))}
                </select>
              </div>

              {selectedTool && (
                <>
                  <div className="mb-4 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-600">
                      {TOOLS.find(t => t.name === selectedTool)?.description}
                    </p>
                  </div>

                  <form onSubmit={handleToolSubmit} className="space-y-4">
                    {TOOLS.find(t => t.name === selectedTool)?.parameters.map((param) => (
                      <div key={param.name}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {param.name} {param.required && <span className="text-red-500">*</span>}
                        </label>
                        {param.type === 'select' ? (
                          <select
                            value={toolParams[param.name] || ''}
                            onChange={(e) => setToolParams(prev => ({ ...prev, [param.name]: e.target.value }))}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required={param.required}
                          >
                            <option value="">Select...</option>
                            {param.options?.map((option) => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        ) : param.type === 'multiselect' ? (
                          <div className="space-y-2">
                            {param.options?.map((option) => (
                              <label key={option} className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={(toolParams[param.name] || []).includes(option)}
                                  onChange={(e) => {
                                    const current = toolParams[param.name] || [];
                                    const updated = e.target.checked
                                      ? [...current, option]
                                      : current.filter((v: string) => v !== option);
                                    setToolParams(prev => ({ ...prev, [param.name]: updated }));
                                  }}
                                  className="mr-2"
                                />
                                <span className="text-sm">{option}</span>
                              </label>
                            ))}
                          </div>
                        ) : (
                          <input
                            type={param.type === 'number' ? 'number' : 'text'}
                            value={toolParams[param.name] || ''}
                            onChange={(e) => setToolParams(prev => ({ 
                              ...prev, 
                              [param.name]: param.type === 'number' ? Number(e.target.value) : e.target.value 
                            }))}
                            placeholder={param.description}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required={param.required}
                          />
                        )}
                      </div>
                    ))}

                    <button
                      type="submit"
                      disabled={loading === selectedTool}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-2"
                    >
                      <PlayIcon className="h-4 w-4" />
                      <span>{loading === selectedTool ? 'Executing...' : 'Execute Tool'}</span>
                    </button>
                  </form>
                </>
              )}
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Browse Resources</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Resource
                </label>
                <select
                  value={selectedResource}
                  onChange={(e) => {
                    setSelectedResource(e.target.value);
                    setResourceParams({});
                  }}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a resource...</option>
                  {RESOURCES.map((resource) => (
                    <option key={resource.name} value={resource.name}>
                      {resource.title}
                    </option>
                  ))}
                </select>
              </div>

              {selectedResource && (
                <>
                  <div className="mb-4 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-600 mb-2">
                      {RESOURCES.find(r => r.name === selectedResource)?.description}
                    </p>
                    <p className="text-xs text-gray-500 font-mono">
                      {RESOURCES.find(r => r.name === selectedResource)?.uri}
                    </p>
                  </div>

                  <form onSubmit={handleResourceSubmit} className="space-y-4">
                    {selectedResource === 'asset-info' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Asset ID <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={resourceParams.assetId || ''}
                          onChange={(e) => setResourceParams(prev => ({ ...prev, assetId: e.target.value }))}
                          placeholder="e.g., BTC, ETH, LTC"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading === selectedResource}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center justify-center space-x-2"
                    >
                      <DocumentTextIcon className="h-4 w-4" />
                      <span>{loading === selectedResource ? 'Loading...' : 'Load Resource'}</span>
                    </button>
                  </form>
                </>
              )}
            </div>
          )}

          {activeTab === 'prompts' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Test Prompts</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Prompt
                </label>
                <select
                  value={selectedPrompt}
                  onChange={(e) => {
                    setSelectedPrompt(e.target.value);
                    setPromptParams({});
                  }}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a prompt...</option>
                  {PROMPTS.map((prompt) => (
                    <option key={prompt.name} value={prompt.name}>
                      {prompt.title}
                    </option>
                  ))}
                </select>
              </div>

              {selectedPrompt && (
                <>
                  <div className="mb-4 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-600">
                      {PROMPTS.find(p => p.name === selectedPrompt)?.description}
                    </p>
                  </div>

                  <form onSubmit={handlePromptSubmit} className="space-y-4">
                    {PROMPTS.find(p => p.name === selectedPrompt)?.parameters.map((param) => (
                      <div key={param.name}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {param.name} {param.required && <span className="text-red-500">*</span>}
                        </label>
                        {param.type === 'select' ? (
                          <select
                            value={promptParams[param.name] || ''}
                            onChange={(e) => setPromptParams(prev => ({ ...prev, [param.name]: e.target.value }))}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required={param.required}
                          >
                            <option value="">Select...</option>
                            {param.options?.map((option) => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={promptParams[param.name] || ''}
                            onChange={(e) => setPromptParams(prev => ({ ...prev, [param.name]: e.target.value }))}
                            placeholder={param.description}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required={param.required}
                          />
                        )}
                      </div>
                    ))}

                    <button
                      type="submit"
                      disabled={loading === selectedPrompt}
                      className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center space-x-2"
                    >
                      <ChatBubbleLeftRightIcon className="h-4 w-4" />
                      <span>{loading === selectedPrompt ? 'Generating...' : 'Generate Prompt'}</span>
                    </button>
                  </form>
                </>
              )}
            </div>
          )}
        </div>

        {/* Right Panel - Results */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Results</h3>
          
          {Object.keys(results).length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <DocumentTextIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No results yet. Execute a tool, load a resource, or generate a prompt to see results here.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {Object.entries(results).reverse().map(([key, result]) => (
                <div key={`${key}-${result.timestamp}`} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {result.success ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircleIcon className="h-5 w-5 text-red-500" />
                      )}
                      <h4 className="font-medium text-gray-900">{key}</h4>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">{formatTimestamp(result.timestamp)}</span>
                      <button
                        onClick={() => copyToClipboard(JSON.stringify(result.data, null, 2))}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="Copy to clipboard"
                      >
                        <ClipboardIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {result.success ? (
                    <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  ) : (
                    <div className="bg-red-50 p-3 rounded">
                      <p className="text-red-700 text-sm">{result.error}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 