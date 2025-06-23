import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, RefreshCw, History } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { 
  ChatBubbleLeftRightIcon,
  CurrencyDollarIcon, 
  SparklesIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { aiService } from '../services/aiService';
import { chatSessionService, ChatMessage, ToolCall } from '../services/chatSessionService';
import ChatSessionHistory from '../components/ChatSessionHistory';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

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

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [remainingRequests, setRemainingRequests] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch popular pairs for dashboard widgets
  const { data: popularPairs, isLoading: pairsLoading } = useQuery({
    queryKey: ['popular-pairs'],
    queryFn: async (): Promise<PopularPairsResponse> => {
      const response = await axios.get(`${API_BASE_URL}/api/v1/popular-pairs`);
      return response.data;
    },
  });

  // Fetch prices for top 3 popular pairs for compact display
  const topPairs = popularPairs?.data.slice(0, 3) || [];
  
  const priceQueries = useQuery({
    queryKey: ['chat-prices', topPairs],
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load current session on component mount
  useEffect(() => {
    const currentSession = chatSessionService.getCurrentSession();
    if (currentSession) {
      setMessages(currentSession.messages);
    }

    // Subscribe to session updates
    const unsubscribe = chatSessionService.subscribe(() => {
      const updatedSession = chatSessionService.getCurrentSession();
      if (updatedSession) {
        setMessages([...updatedSession.messages]);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // These functions are now replaced by the AI service
  // Keeping them commented for reference or fallback
  
  /*
  const parseUserIntent = (message: string): ToolCall[] => {
    // Basic pattern matching - replaced by AI service
  };

  const executeTool = async (toolCall: ToolCall): Promise<ToolCall> => {
    // Tool execution - now handled by AI service
  };

  const formatResponse = (toolCalls: ToolCall[]): string => {
    // Response formatting - now handled by AI service
  };
  */

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    // Add user message to persistent session
    chatSessionService.addMessage(userMessage);
    const userInput = input;
    setInput('');
    setIsLoading(true);

    try {
      // Use AI service to process the message
      const aiResponse = await aiService.processMessage(userInput);

      // Update remaining requests
      setRemainingRequests(aiResponse.remainingRequests ?? null);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponse.message,
        timestamp: new Date(),
        toolCalls: aiResponse.toolCalls
      };

      // Add assistant message to persistent session
      chatSessionService.addMessage(assistantMessage);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `❌ Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date()
      };

      // Add error message to persistent session
      chatSessionService.addMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const resetConversation = () => {
    chatSessionService.clearCurrentSession();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header Section with Dashboard Widgets */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg">
              <ChatBubbleLeftRightIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Coinbase MCP Chat
              </h1>
              <p className="text-gray-600 mt-1">AI-powered cryptocurrency assistant with real-time data</p>
            </div>
          </div>

          {/* Dashboard Widgets Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Market Status */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-white/20 rounded-lg">
                    <CheckCircleIcon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Market Status</h3>
                    <p className="text-green-100 text-xs">Real-time feed</p>
                  </div>
                </div>
              </div>
              <div className="p-3">
                <p className="text-lg font-bold text-green-600">Active</p>
                <div className="flex items-center space-x-1 mt-1">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-500">Live updates</span>
                </div>
              </div>
            </div>

            {/* MCP Status */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-4">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-white/20 rounded-lg">
                    <SparklesIcon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">MCP Status</h3>
                    <p className="text-purple-100 text-xs">8 tools ready</p>
                  </div>
                </div>
              </div>
              <div className="p-3">
                <p className="text-lg font-bold text-purple-600">Ready</p>
                <div className="flex items-center space-x-1 mt-1">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  <span className="text-xs text-gray-500">Server running</span>
                </div>
              </div>
            </div>

            {/* Top Crypto Prices - Compact */}
            {priceQueries.data?.slice(0, 2).map((price, index) => (
              <div key={price.pair} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 overflow-hidden">
                <div className={`p-4 bg-gradient-to-r ${
                  index === 0 ? 'from-orange-400 to-red-500' : 'from-blue-400 to-indigo-500'
                }`}>
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-white/20 rounded-lg">
                      <CurrencyDollarIcon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">{price.base}</h3>
                      <p className="text-white/80 text-xs">{price.pair}</p>
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  {price.error ? (
                    <p className="text-sm text-red-500">Error</p>
                  ) : (
                    <>
                      <p className="text-lg font-bold text-gray-900">
                        ${parseFloat(price.amount).toLocaleString(undefined, { 
                          minimumFractionDigits: 0, 
                          maximumFractionDigits: 0 
                        })}
                      </p>
                      <div className="flex items-center space-x-1 mt-1">
                        <ArrowTrendingUpIcon className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-gray-500">Live price</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Ask me about cryptocurrency prices, market analysis, or trading insights</span>
            </div>
            <div className="flex items-center space-x-2">
              {/* Rate Limit Indicator */}
              {remainingRequests !== null && (
                <div className={`flex items-center space-x-2 px-3 py-2 text-sm rounded-lg border ${
                  remainingRequests > 1 
                    ? 'text-green-700 bg-green-50 border-green-200' 
                    : remainingRequests === 1 
                    ? 'text-yellow-700 bg-yellow-50 border-yellow-200'
                    : 'text-red-700 bg-red-50 border-red-200'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    remainingRequests > 1 
                      ? 'bg-green-400' 
                      : remainingRequests === 1 
                      ? 'bg-yellow-400'
                      : 'bg-red-400'
                  }`}></div>
                  <span className="font-medium">
                    {remainingRequests} request{remainingRequests !== 1 ? 's' : ''} left
                  </span>
                </div>
              )}
              <button
                onClick={() => setShowHistory(true)}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-white/70 rounded-lg transition-all duration-200 border border-gray-200/50"
                title="Chat History"
              >
                <History className="w-4 h-4" />
                <span>History</span>
              </button>
              <button
                onClick={resetConversation}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-white/70 rounded-lg transition-all duration-200 border border-gray-200/50"
                title="Reset conversation"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col h-[calc(100vh-280px)]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-6">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ChatBubbleLeftRightIcon className="h-8 w-8 text-cyan-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Hello! I'm your specialized Coinbase MCP assistant.</h3>
              <p className="text-gray-600 text-sm max-w-2xl mx-auto leading-relaxed mb-6">
                I'm focused exclusively on cryptocurrency, blockchain, and MCP technology. I can help you with crypto prices, market analysis, and trading insights using real-time Coinbase data.
              </p>
              
              {/* Educational Notice */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 mb-6 max-w-2xl mx-auto">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg">🎓</span>
                  <span className="text-sm font-semibold text-amber-800">Educational Use</span>
                </div>
                <p className="text-xs text-amber-700 leading-relaxed">
                  This demo is rate-limited to 3 requests per minute for educational purposes. I only discuss cryptocurrency and MCP-related topics to keep our conversations focused and valuable.
                </p>
              </div>
              
              <div className="max-w-3xl mx-auto mb-8">
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
                  <h4 className="text-sm font-semibold text-gray-800 mb-4">Try asking me things like:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">"What's the current Bitcoin price?"</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">"Show me popular trading pairs"</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">"Get Ethereum market stats"</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">"Search for Litecoin assets"</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">"Analyze Bitcoin volatility over 30 days"</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-pink-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">"Get USD exchange rates"</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">"Historical prices for ETH-USD"</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">"Bitcoin details and information"</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200/50">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">💡</span>
                    <span className="text-sm font-semibold text-blue-900">AI Mode</span>
                  </div>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    For advanced conversational AI, add your OpenAI API key to <code className="bg-blue-100 px-1 rounded text-xs">.env</code>
                  </p>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200/50">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">🔧</span>
                    <span className="text-sm font-semibold text-green-900">Basic Mode</span>
                  </div>
                  <p className="text-xs text-green-700 leading-relaxed">
                    I can still help with crypto data using pattern matching and MCP tools!
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => setInput("What's the current Bitcoin price?")}
                  className="px-4 py-2 bg-white/70 hover:bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:text-gray-900 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Bitcoin price
                </button>
                <button
                  onClick={() => setInput("Show me popular trading pairs")}
                  className="px-4 py-2 bg-white/70 hover:bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:text-gray-900 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Popular pairs
                </button>
                <button
                  onClick={() => setInput("Get Ethereum market stats")}
                  className="px-4 py-2 bg-white/70 hover:bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:text-gray-900 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  ETH stats
                </button>
                <button
                  onClick={() => setInput("Analyze Bitcoin volatility over 30 days")}
                  className="px-4 py-2 bg-white/70 hover:bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:text-gray-900 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  BTC analysis
                </button>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-3xl ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'} space-x-3`}>
                <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${
                  message.type === 'user' 
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white ml-3' 
                    : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 mr-3'
                }`}>
                  {message.type === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                <div className={`rounded-2xl p-4 shadow-lg backdrop-blur-sm ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                    : 'bg-white/80 text-gray-900 border border-gray-200/50'
                }`}>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
                  {message.toolCalls && message.toolCalls.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/20">
                      <div className="text-xs opacity-80 mb-2">🔧 Tool calls executed:</div>
                      {message.toolCalls.map((toolCall, index) => (
                        <div key={index} className="text-xs bg-white/10 rounded-lg p-2 mb-1 backdrop-blur-sm">
                          <span className="font-mono">{toolCall.tool}</span>
                          {toolCall.error && <span className="text-red-300 ml-2">❌ {toolCall.error}</span>}
                          {toolCall.result && <span className="text-green-300 ml-2">✅ Success</span>}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex space-x-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 flex items-center justify-center shadow-lg">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    <span className="text-sm text-gray-600">Analyzing and fetching data...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-4">
          <div className="flex space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about cryptocurrency prices, market analysis, or trading insights..."
              className="flex-1 border-0 bg-transparent focus:outline-none text-gray-900 placeholder-gray-500 text-sm"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-3 rounded-xl hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Chat Session History Modal */}
      {showHistory && (
        <ChatSessionHistory onClose={() => setShowHistory(false)} />
      )}
    </div>
  );
};

export default ChatInterface; 