// import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { 
  ChartBarIcon, 
  CurrencyDollarIcon, 
  GlobeAltIcon,
  ArrowTrendingUpIcon,
  SparklesIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

interface PopularPairsResponse {
  data: string[];
}

interface SpotPriceResponse {
  data: {
    amount: string;
    base: string;
    currency: string;
  };
}

export default function Dashboard() {
  // Fetch popular pairs
  const { data: popularPairs, isLoading: pairsLoading } = useQuery({
    queryKey: ['popular-pairs'],
    queryFn: async (): Promise<PopularPairsResponse> => {
      const response = await axios.get(`${API_BASE_URL}/api/v1/popular-pairs`);
      return response.data;
    },
  });

  // Fetch prices for first 5 popular pairs
  const topPairs = popularPairs?.data.slice(0, 5) || [];
  
  const priceQueries = useQuery({
    queryKey: ['dashboard-prices', topPairs],
    queryFn: async () => {
      const pricePromises = topPairs.map(async (pair) => {
        try {
          const response = await axios.get<SpotPriceResponse>(`${API_BASE_URL}/api/v1/prices/${pair}`);
          return { pair, ...response.data.data };
        } catch (error) {
          return { pair, amount: '0', base: pair.split('-')[0], currency: pair.split('-')[1], error: true };
        }
      });
      return Promise.all(pricePromises);
    },
    enabled: topPairs.length > 0,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <ChartBarIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Welcome to Coinbase Chat MCP - Your professional cryptocurrency data portal
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Market Overview Stats */}
        <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <CheckCircleIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Market Status</h3>
                  <p className="text-green-100 text-sm">Real-time data feed</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-3xl font-bold text-green-600 mb-2">Active</p>
              <p className="text-sm text-gray-600">Markets are open and trading</p>
              <div className="mt-4 flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-500">Live updates every 30s</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <CurrencyDollarIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Available Assets</h3>
                  <p className="text-blue-100 text-sm">Cryptocurrencies & Fiat</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-3xl font-bold text-blue-600 mb-2">200+</p>
              <p className="text-sm text-gray-600">Trading pairs available</p>
              <div className="mt-4 flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <span className="text-xs text-gray-500">Updated hourly</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <SparklesIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">MCP Status</h3>
                  <p className="text-purple-100 text-sm">Protocol server</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-3xl font-bold text-purple-600 mb-2">Ready</p>
              <p className="text-sm text-gray-600">8 tools available</p>
              <div className="mt-4 flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                <span className="text-xs text-gray-500">Server running</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Cryptocurrencies */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-700 to-gray-900 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <ArrowTrendingUpIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Top Cryptocurrencies</h2>
                <p className="text-gray-300 text-sm">Real-time prices from Coinbase</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {pairsLoading || priceQueries.isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-blue-200 border-solid rounded-full animate-spin"></div>
                  <div className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-600 border-solid rounded-full border-t-transparent animate-spin"></div>
                </div>
                <span className="ml-4 text-gray-600 font-medium">Loading market data...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                {priceQueries.data?.map((price, index) => (
                  <div key={price.pair} className="group p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-lg hover:scale-102 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-lg bg-gradient-to-r ${
                          index % 5 === 0 ? 'from-orange-400 to-red-500' :
                          index % 5 === 1 ? 'from-blue-400 to-indigo-500' :
                          index % 5 === 2 ? 'from-green-400 to-emerald-500' :
                          index % 5 === 3 ? 'from-purple-400 to-pink-500' :
                          'from-yellow-400 to-orange-500'
                        }`}>
                          {price.base}
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {price.base}
                          </h4>
                          <p className="text-sm text-gray-500 font-medium">{price.pair}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {price.error ? (
                          <div className="text-center">
                            <p className="text-sm text-red-500 font-medium">Error loading</p>
                            <p className="text-xs text-red-400">Please try again</p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                              ${parseFloat(price.amount).toLocaleString(undefined, { 
                                minimumFractionDigits: 2, 
                                maximumFractionDigits: 2 
                              })}
                            </p>
                            <p className="text-sm text-gray-500 font-medium">{price.currency}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Features Overview */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-blue-200/50">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <GlobeAltIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">MCP Integration</h3>
                  <p className="text-blue-700 text-sm">Model Context Protocol support</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Full Model Context Protocol support for seamless AI agent integration
              </p>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">Tools for price queries and analysis</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">Resources for market data access</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">Prompts for crypto analysis</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b border-green-200/50">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <ChartBarIcon className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-900">Public API Access</h3>
                  <p className="text-green-700 text-sm">RESTful API endpoints</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                RESTful API endpoints for direct cryptocurrency data access
              </p>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">Real-time price data</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">Historical price charts</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">Market statistics</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">Asset information</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 