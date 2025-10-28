import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import {
  WalletIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  ClockIcon,
  ArrowPathIcon,
  BanknotesIcon,
  ChartBarIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

interface DemoWallet {
  balances: { [currency: string]: number };
  transactions: DemoTransaction[];
  inventory?: {
    beers: number;
    items: any[];
  };
  createdAt: string;
  lastUpdated: string;
}

interface DemoTransaction {
  id: string;
  type: 'buy' | 'sell' | 'transfer';
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
  toAmount: number;
  price: number;
  description: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
}

interface WalletStats {
  totalTransactions: number;
  totalSpentUSD: number;
  totalCryptoBought: { [currency: string]: number };
}

interface BeerCalculation {
  usdAmount: number;
  cryptoAmount: number;
  cryptoCurrency: string;
  currentPrice: number;
  description: string;
}

const Wallet: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const [purchaseAmount, setPurchaseAmount] = useState('5');
  const [purchaseDescription, setPurchaseDescription] = useState('');
  const [beerCount, setBeerCount] = useState('1');
  const [beerCurrency, setBeerCurrency] = useState('BTC');

  // Fetch wallet data
  const { data: walletData, isLoading: walletLoading } = useQuery({
    queryKey: ['wallet'],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/api/v1/wallet`);
      return response.data.data;
    },
    refetchInterval: 5000 // Refresh every 5 seconds
  });

  // Fetch transactions
  const { data: transactionsData } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/api/v1/wallet/transactions?limit=20`);
      return response.data.data;
    }
  });

  // Beer cost calculator
  const { data: beerCalc, refetch: refetchBeer } = useQuery({
    queryKey: ['beerCost', beerCurrency, beerCount],
    queryFn: async () => {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/wallet/calculate-beer-cost?currency=${beerCurrency}&beerCount=${beerCount}`
      );
      return response.data.data;
    },
    enabled: false
  });

  // Purchase mutation
  const purchaseMutation = useMutation({
    mutationFn: async (data: {
      fromCurrency: string;
      toCurrency: string;
      amount: number;
      description?: string;
    }) => {
      const response = await axios.post(`${API_BASE_URL}/api/v1/wallet/purchase`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      setPurchaseAmount('5');
      setPurchaseDescription('');
    }
  });

  // Reset wallet mutation
  const resetMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post(`${API_BASE_URL}/api/v1/wallet/reset`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    }
  });

  const handlePurchase = () => {
    if (!purchaseAmount || parseFloat(purchaseAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    purchaseMutation.mutate({
      fromCurrency: 'USD',
      toCurrency: selectedCrypto,
      amount: parseFloat(purchaseAmount),
      description: purchaseDescription || undefined
    });
  };

  const handleBuyBeer = () => {
    if (beerCalc) {
      purchaseMutation.mutate({
        fromCurrency: 'USD',
        toCurrency: beerCurrency,
        amount: beerCalc.usdAmount,
        description: `${beerCount} beer${parseInt(beerCount) > 1 ? 's' : ''} worth of ${beerCurrency}`
      });
    }
  };

  const wallet = walletData?.wallet as DemoWallet | undefined;
  const stats = walletData?.stats as WalletStats | undefined;
  const transactions = transactionsData as DemoTransaction[] | undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl">
              <WalletIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                Virtual Crypto Wallet
              </h1>
              <p className="text-xl text-slate-600 mt-2">Demo transactions with real-time prices</p>
            </div>
          </div>
        </div>

        {walletLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <>
            {/* Wallet Balance Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Balance Card */}
              <div className="lg:col-span-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl shadow-2xl p-8 text-white">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">💰 Your Balance</h2>
                  <button
                    onClick={() => resetMutation.mutate()}
                    disabled={resetMutation.isPending}
                    className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                  >
                    <ArrowPathIcon className="h-4 w-4" />
                    <span>Reset Wallet</span>
                  </button>
                </div>

                {wallet && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(wallet.balances)
                      .filter(([_, balance]) => balance > 0)
                      .map(([currency, balance]) => (
                        <div key={currency} className="bg-white/10 backdrop-blur rounded-xl p-4">
                          <div className="text-sm opacity-80">{currency}</div>
                          <div className="text-2xl font-bold mt-1">
                            {currency === 'USD'
                              ? `$${balance.toFixed(2)}`
                              : balance.toFixed(8)}
                          </div>
                        </div>
                      ))}
                    {wallet.inventory && wallet.inventory.beers > 0 && (
                      <div className="bg-orange-500/20 backdrop-blur rounded-xl p-4 border border-orange-400/30">
                        <div className="text-sm opacity-90">🍺 Virtual Beers</div>
                        <div className="text-2xl font-bold mt-1">{wallet.inventory.beers}</div>
                      </div>
                    )}
                  </div>
                )}

                {stats && (
                  <div className="mt-6 pt-6 border-t border-white/20">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="opacity-80">Total Transactions</div>
                        <div className="text-xl font-bold">{stats.totalTransactions}</div>
                      </div>
                      <div>
                        <div className="opacity-80">Total Spent</div>
                        <div className="text-xl font-bold">${stats.totalSpentUSD.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="space-y-4">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <ChartBarIcon className="h-6 w-6 text-green-600" />
                    <h3 className="font-semibold text-slate-800">Demo Mode</h3>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    This is a safe demo environment. All transactions are simulated with real-time Coinbase prices.
                  </p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <BanknotesIcon className="h-6 w-6 text-blue-600" />
                    <h3 className="font-semibold text-slate-800">Starting Balance</h3>
                  </div>
                  <div className="text-3xl font-bold text-blue-600">$1,000</div>
                  <p className="text-sm text-slate-600 mt-2">Virtual USD to practice with</p>
                </div>
              </div>
            </div>

            {/* Beer Calculator Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Beer Calculator */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
                <div className="flex items-center space-x-3 mb-6">
                  <BeakerIcon className="h-7 w-7 text-orange-600" />
                  <h2 className="text-2xl font-bold text-slate-800">🍺 Beer-to-Crypto Calculator</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Number of Beers
                    </label>
                    <input
                      type="number"
                      value={beerCount}
                      onChange={(e) => setBeerCount(e.target.value)}
                      min="1"
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Cryptocurrency
                    </label>
                    <select
                      value={beerCurrency}
                      onChange={(e) => setBeerCurrency(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="BTC">Bitcoin (BTC)</option>
                      <option value="ETH">Ethereum (ETH)</option>
                      <option value="SOL">Solana (SOL)</option>
                      <option value="ADA">Cardano (ADA)</option>
                      <option value="MATIC">Polygon (MATIC)</option>
                    </select>
                  </div>

                  <button
                    onClick={() => refetchBeer()}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all shadow-lg"
                  >
                    Calculate 🍺
                  </button>

                  {beerCalc && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 space-y-2">
                      <div className="text-sm text-orange-800">
                        <strong>{beerCount} beer{parseInt(beerCount) > 1 ? 's' : ''}</strong> at $5 each = <strong>${beerCalc.usdAmount}</strong>
                      </div>
                      <div className="text-xl font-bold text-orange-900">
                        = {beerCalc.cryptoAmount.toFixed(8)} {beerCalc.cryptoCurrency}
                      </div>
                      <div className="text-sm text-orange-700">
                        Current price: ${beerCalc.currentPrice.toLocaleString()}
                      </div>
                      <button
                        onClick={handleBuyBeer}
                        disabled={purchaseMutation.isPending}
                        className="w-full mt-2 bg-orange-600 text-white py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors"
                      >
                        {purchaseMutation.isPending ? 'Processing...' : '🍺 Buy It!'}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Buy Crypto Form */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
                <div className="flex items-center space-x-3 mb-6">
                  <ShoppingCartIcon className="h-7 w-7 text-green-600" />
                  <h2 className="text-2xl font-bold text-slate-800">Buy Crypto</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Amount in USD
                    </label>
                    <input
                      type="number"
                      value={purchaseAmount}
                      onChange={(e) => setPurchaseAmount(e.target.value)}
                      min="0.01"
                      step="0.01"
                      placeholder="5.00"
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Select Cryptocurrency
                    </label>
                    <select
                      value={selectedCrypto}
                      onChange={(e) => setSelectedCrypto(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="BTC">Bitcoin (BTC)</option>
                      <option value="ETH">Ethereum (ETH)</option>
                      <option value="SOL">Solana (SOL)</option>
                      <option value="ADA">Cardano (ADA)</option>
                      <option value="MATIC">Polygon (MATIC)</option>
                      <option value="AVAX">Avalanche (AVAX)</option>
                      <option value="LTC">Litecoin (LTC)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Description (Optional)
                    </label>
                    <input
                      type="text"
                      value={purchaseDescription}
                      onChange={(e) => setPurchaseDescription(e.target.value)}
                      placeholder="e.g., Long-term investment"
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <button
                    onClick={handlePurchase}
                    disabled={purchaseMutation.isPending || !purchaseAmount}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                  >
                    {purchaseMutation.isPending ? (
                      <span className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Processing...</span>
                      </span>
                    ) : (
                      `Buy $${purchaseAmount} of ${selectedCrypto}`
                    )}
                  </button>

                  {purchaseMutation.isSuccess && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 font-medium">✅ Transaction successful!</p>
                    </div>
                  )}

                  {purchaseMutation.isError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-800 font-medium">
                        ❌ {(purchaseMutation.error as any)?.response?.data?.message || 'Transaction failed'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Transaction History */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
              <div className="flex items-center space-x-3 mb-6">
                <ClockIcon className="h-7 w-7 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-800">Transaction History</h2>
              </div>

              {transactions && transactions.length > 0 ? (
                <div className="space-y-4">
                  {transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-full ${
                          tx.type === 'buy' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                          {tx.type === 'buy' ? '🟢' : '🔴'}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800">
                            {tx.type.toUpperCase()}: {tx.fromAmount.toFixed(2)} {tx.fromCurrency} → {tx.toAmount.toFixed(8)} {tx.toCurrency}
                          </div>
                          <div className="text-sm text-slate-600">{tx.description}</div>
                          <div className="text-xs text-slate-500 mt-1">
                            {new Date(tx.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-slate-700">
                          ${tx.price.toLocaleString()}
                        </div>
                        <div className={`text-xs px-2 py-1 rounded-full mt-1 ${
                          tx.status === 'completed' ? 'bg-green-100 text-green-700' :
                          tx.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {tx.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <CurrencyDollarIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>No transactions yet. Start buying some crypto!</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wallet;

