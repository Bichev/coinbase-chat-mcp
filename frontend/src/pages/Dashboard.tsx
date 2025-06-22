// import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

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
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome to Coinbase Chat MCP - Your professional cryptocurrency data portal
        </p>
      </div>

      {/* Market Overview */}
      <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Market Status</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">Active</p>
          <p className="text-sm text-gray-500">Markets are open</p>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Available Assets</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">200+</p>
          <p className="text-sm text-gray-500">Cryptocurrencies & Fiat</p>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">MCP Status</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">Ready</p>
          <p className="text-sm text-gray-500">Server is running</p>
        </div>
      </div>

      {/* Top Cryptocurrencies */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Top Cryptocurrencies</h2>
          <p className="text-sm text-gray-600">Real-time prices from Coinbase</p>
        </div>
        
        <div className="p-6">
          {pairsLoading || priceQueries.isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-4 border-blue-600 border-solid rounded-full animate-spin border-t-transparent"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {priceQueries.data?.map((price) => (
                <div key={price.pair} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">{price.base}</span>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-900">{price.base}</h4>
                      <p className="text-sm text-gray-500">{price.pair}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {price.error ? (
                      <p className="text-sm text-red-500">Error loading price</p>
                    ) : (
                      <>
                        <p className="text-lg font-bold text-gray-900">
                          ${parseFloat(price.amount).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">{price.currency}</p>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Features Overview */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
          <h3 className="text-lg font-medium text-blue-900">MCP Integration</h3>
          <p className="mt-2 text-sm text-blue-700">
            Full Model Context Protocol support for seamless AI agent integration
          </p>
          <ul className="mt-3 text-sm text-blue-600 space-y-1">
            <li>• Tools for price queries and analysis</li>
            <li>• Resources for market data access</li>
            <li>• Prompts for crypto analysis</li>
          </ul>
        </div>
        
        <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
          <h3 className="text-lg font-medium text-green-900">Public API Access</h3>
          <p className="mt-2 text-sm text-green-700">
            RESTful API endpoints for direct cryptocurrency data access
          </p>
          <ul className="mt-3 text-sm text-green-600 space-y-1">
            <li>• Real-time price data</li>
            <li>• Historical price charts</li>
            <li>• Market statistics</li>
            <li>• Asset information</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 