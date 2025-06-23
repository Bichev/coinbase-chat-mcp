import { useState } from 'react';
import { 
  WrenchScrewdriverIcon, 
  DocumentTextIcon, 
  ChatBubbleLeftRightIcon,
  PlayIcon,
  ClipboardIcon,
  CheckCircleIcon,
  XCircleIcon,
  SparklesIcon,
  BeakerIcon,
  CubeIcon,
  ChartBarIcon
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

      const baseUrl = import.meta.env.VITE_API_URL || '';
      const url = `${baseUrl}${endpoint}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
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
      // Simulate resource loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let mockData;
      switch (resourceName) {
        case 'market-overview':
          mockData = {
            overview: 'Cryptocurrency markets are currently experiencing high volatility.',
            totalMarketCap: '$2.1T',
            btcDominance: '42.5%',
            fearGreedIndex: 65
          };
          break;
        case 'asset-info':
          mockData = {
            id: params.assetId,
            name: `${params.assetId} Asset`,
            description: `Detailed information about ${params.assetId}`,
            marketCap: '$500B',
            volume24h: '$25B'
          };
          break;
        default:
          mockData = { message: 'Resource loaded successfully' };
      }
      
      setResults(prev => ({
        ...prev,
        [resourceName]: {
          success: true,
          data: mockData,
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
      // Simulate prompt generation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let mockResponse;
      switch (promptName) {
        case 'analyze-crypto-price':
          mockResponse = {
            analysis: `Based on ${params.currencyPair} data over ${params.timeframe}, the market shows strong bullish sentiment with key support levels holding.`,
            recommendation: 'Consider taking profits at resistance levels',
            confidence: 0.85
          };
          break;
        case 'compare-cryptocurrencies':
          mockResponse = {
            comparison: `Analysis of ${params.currencies} shows varying risk/reward profiles`,
            topPick: 'BTC for stability, ETH for growth potential',
            diversificationScore: 0.75
          };
          break;
        case 'portfolio-diversification-advice':
          mockResponse = {
            advice: `For ${params.riskTolerance} risk tolerance with $${params.investmentAmount} investment`,
            allocation: 'BTC: 40%, ETH: 30%, Alts: 20%, Stablecoins: 10%',
            timeHorizon: '12-18 months'
          };
          break;
        default:
          mockResponse = { message: 'Prompt generated successfully' };
      }
      
      setResults(prev => ({
        ...prev,
        [promptName]: {
          success: true,
          data: mockResponse,
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
    if (selectedTool) executeTool(selectedTool, toolParams);
  };

  const handleResourceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedResource) executeResource(selectedResource, resourceParams);
  };

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPrompt) executePrompt(selectedPrompt, promptParams);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <BeakerIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                MCP Tester
              </h1>
              <p className="text-gray-600 mt-1">Test and interact with the Model Context Protocol server</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-2">
            <nav className="flex space-x-2">
              {[
                { 
                  id: 'tools', 
                  name: 'Tools', 
                  icon: WrenchScrewdriverIcon, 
                  count: TOOLS.length,
                  gradient: 'from-blue-500 to-cyan-500',
                  description: 'Execute MCP tools'
                },
                { 
                  id: 'resources', 
                  name: 'Resources', 
                  icon: CubeIcon, 
                  count: RESOURCES.length,
                  gradient: 'from-emerald-500 to-teal-500',
                  description: 'Browse MCP resources'
                },
                { 
                  id: 'prompts', 
                  name: 'Prompts', 
                  icon: SparklesIcon, 
                  count: PROMPTS.length,
                  gradient: 'from-purple-500 to-pink-500',
                  description: 'Generate AI prompts'
                }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 group relative overflow-hidden rounded-xl transition-all duration-300 ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg scale-105`
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <div className="relative z-10 flex items-center justify-center space-x-3 px-6 py-4">
                    <tab.icon className={`h-5 w-5 ${activeTab === tab.id ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`} />
                    <div className="text-left">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{tab.name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          activeTab === tab.id 
                            ? 'bg-white/20 text-white' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {tab.count}
                        </span>
                      </div>
                      <div className={`text-xs ${
                        activeTab === tab.id ? 'text-white/80' : 'text-gray-500'
                      }`}>
                        {tab.description}
                      </div>
                    </div>
                  </div>
                  {activeTab === tab.id && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5" />
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Panel - Configuration */}
          <div className="xl:col-span-2 space-y-6">
            {activeTab === 'tools' && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6">
                  <div className="flex items-center space-x-3">
                    <WrenchScrewdriverIcon className="h-6 w-6 text-white" />
                    <h3 className="text-xl font-semibold text-white">Test Tools</h3>
                  </div>
                  <p className="text-blue-100 mt-2">Execute MCP tools with real-time cryptocurrency data</p>
                </div>
                
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Select Tool
                    </label>
                    <select
                      value={selectedTool}
                      onChange={(e) => {
                        setSelectedTool(e.target.value);
                        setToolParams({});
                      }}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
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
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                        <div className="flex items-start space-x-3">
                          <ChartBarIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-blue-900">Tool Description</h4>
                            <p className="text-sm text-blue-700 mt-1">
                              {TOOLS.find(t => t.name === selectedTool)?.description}
                            </p>
                          </div>
                        </div>
                      </div>

                      <form onSubmit={handleToolSubmit} className="space-y-4">
                        {TOOLS.find(t => t.name === selectedTool)?.parameters.map((param) => (
                          <div key={param.name} className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                              {param.name} {param.required && <span className="text-red-500">*</span>}
                            </label>
                            <p className="text-xs text-gray-500 mb-2">{param.description}</p>
                            {param.type === 'select' ? (
                              <select
                                value={toolParams[param.name] || ''}
                                onChange={(e) => setToolParams(prev => ({ ...prev, [param.name]: e.target.value }))}
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                                required={param.required}
                              >
                                <option value="">Select...</option>
                                {param.options?.map((option) => (
                                  <option key={option} value={option}>{option}</option>
                                ))}
                              </select>
                            ) : param.type === 'multiselect' ? (
                              <div className="space-y-3 p-4 bg-gray-50 rounded-xl">
                                {param.options?.map((option) => (
                                  <label key={option} className="flex items-center space-x-3 cursor-pointer">
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
                                      className="w-4 h-4 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700">{option}</span>
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
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                                required={param.required}
                              />
                            )}
                          </div>
                        ))}

                        <button
                          type="submit"
                          disabled={loading === selectedTool}
                          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 px-6 rounded-xl hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
                        >
                          {loading === selectedTool ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>Executing...</span>
                            </>
                          ) : (
                            <>
                              <PlayIcon className="h-5 w-5" />
                              <span>Execute Tool</span>
                            </>
                          )}
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'resources' && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6">
                  <div className="flex items-center space-x-3">
                    <CubeIcon className="h-6 w-6 text-white" />
                    <h3 className="text-xl font-semibold text-white">Browse Resources</h3>
                  </div>
                  <p className="text-emerald-100 mt-2">Access MCP resources for market data and asset information</p>
                </div>
                
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Select Resource
                    </label>
                    <select
                      value={selectedResource}
                      onChange={(e) => {
                        setSelectedResource(e.target.value);
                        setResourceParams({});
                      }}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-white/50"
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
                      <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                        <div className="space-y-2">
                          <h4 className="font-medium text-emerald-900">Resource Details</h4>
                          <p className="text-sm text-emerald-700">
                            {RESOURCES.find(r => r.name === selectedResource)?.description}
                          </p>
                          <p className="text-xs text-emerald-600 font-mono bg-emerald-100 px-2 py-1 rounded">
                            {RESOURCES.find(r => r.name === selectedResource)?.uri}
                          </p>
                        </div>
                      </div>

                      <form onSubmit={handleResourceSubmit} className="space-y-4">
                        {selectedResource === 'asset-info' && (
                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                              Asset ID <span className="text-red-500">*</span>
                            </label>
                            <p className="text-xs text-gray-500">Enter the asset symbol (e.g., BTC, ETH, LTC)</p>
                            <input
                              type="text"
                              value={resourceParams.assetId || ''}
                              onChange={(e) => setResourceParams(prev => ({ ...prev, assetId: e.target.value }))}
                              placeholder="e.g., BTC, ETH, LTC"
                              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-white/50"
                              required
                            />
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={loading === selectedResource}
                          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 px-6 rounded-xl hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
                        >
                          {loading === selectedResource ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>Loading...</span>
                            </>
                          ) : (
                            <>
                              <DocumentTextIcon className="h-5 w-5" />
                              <span>Load Resource</span>
                            </>
                          )}
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'prompts' && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6">
                  <div className="flex items-center space-x-3">
                    <SparklesIcon className="h-6 w-6 text-white" />
                    <h3 className="text-xl font-semibold text-white">Test Prompts</h3>
                  </div>
                  <p className="text-purple-100 mt-2">Generate AI-powered cryptocurrency analysis prompts</p>
                </div>
                
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Select Prompt
                    </label>
                    <select
                      value={selectedPrompt}
                      onChange={(e) => {
                        setSelectedPrompt(e.target.value);
                        setPromptParams({});
                      }}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/50"
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
                      <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                        <div className="flex items-start space-x-3">
                          <SparklesIcon className="h-5 w-5 text-purple-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-purple-900">Prompt Description</h4>
                            <p className="text-sm text-purple-700 mt-1">
                              {PROMPTS.find(p => p.name === selectedPrompt)?.description}
                            </p>
                          </div>
                        </div>
                      </div>

                      <form onSubmit={handlePromptSubmit} className="space-y-4">
                        {PROMPTS.find(p => p.name === selectedPrompt)?.parameters.map((param) => (
                          <div key={param.name} className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                              {param.name} {param.required && <span className="text-red-500">*</span>}
                            </label>
                            <p className="text-xs text-gray-500 mb-2">{param.description}</p>
                            {param.type === 'select' ? (
                              <select
                                value={promptParams[param.name] || ''}
                                onChange={(e) => setPromptParams(prev => ({ ...prev, [param.name]: e.target.value }))}
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/50"
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
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/50"
                                required={param.required}
                              />
                            )}
                          </div>
                        ))}

                        <button
                          type="submit"
                          disabled={loading === selectedPrompt}
                          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
                        >
                          {loading === selectedPrompt ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>Generating...</span>
                            </>
                          ) : (
                            <>
                              <ChatBubbleLeftRightIcon className="h-5 w-5" />
                              <span>Generate Prompt</span>
                            </>
                          )}
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Results */}
          <div className="xl:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 sticky top-24 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-700 to-gray-900 p-6">
                <div className="flex items-center space-x-3">
                  <DocumentTextIcon className="h-6 w-6 text-white" />
                  <h3 className="text-xl font-semibold text-white">Results</h3>
                </div>
                <p className="text-gray-300 mt-2">Real-time execution results</p>
              </div>
              
              <div className="p-6">
                {Object.keys(results).length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <DocumentTextIcon className="h-8 w-8 text-gray-400" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No results yet</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      Execute a tool, load a resource, or generate a prompt to see results here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {Object.entries(results).reverse().map(([key, result]) => (
                      <div key={`${key}-${result.timestamp}`} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                        <div className="flex items-center justify-between p-4 bg-gray-50">
                          <div className="flex items-center space-x-3">
                            {result.success ? (
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircleIcon className="h-5 w-5 text-green-600" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                <XCircleIcon className="h-5 w-5 text-red-600" />
                              </div>
                            )}
                            <div>
                              <h4 className="font-semibold text-gray-900">{key}</h4>
                              <p className="text-xs text-gray-500">{formatTimestamp(result.timestamp)}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => copyToClipboard(JSON.stringify(result.data, null, 2))}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Copy to clipboard"
                          >
                            <ClipboardIcon className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <div className="p-4">
                          {result.success ? (
                            <pre className="bg-gray-50 p-3 rounded-lg text-xs overflow-x-auto text-gray-800 font-mono leading-relaxed">
                              {JSON.stringify(result.data, null, 2)}
                            </pre>
                          ) : (
                            <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                              <p className="text-red-700 text-sm font-medium">{result.error}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 