import OpenAI from 'openai';

// Initialize OpenAI (you'll need to set VITE_OPENAI_API_KEY in your .env)
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const openai = apiKey ? new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true // Note: In production, this should be done server-side
}) : null;

// Rate limiting configuration
const RATE_LIMIT_MAX_REQUESTS = 100; //3 requests per minute
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_STORAGE_KEY = 'crypto_chat_rate_limit';

interface RateLimitData {
  requests: number;
  windowStart: number;
}

interface ToolCall {
  tool: string;
  parameters: Record<string, any>;
  result?: any;
  error?: string;
}

interface AIResponse {
  message: string;
  toolCalls: ToolCall[];
  isRateLimited?: boolean;
  remainingRequests?: number;
}

// Define allowed topics for conversation guardrails
const ALLOWED_TOPICS = [
  'cryptocurrency', 'crypto', 'bitcoin', 'ethereum', 'blockchain', 'trading',
  'price', 'market', 'analysis', 'exchange', 'wallet', 'defi', 'nft',
  'mcp', 'model context protocol', 'coinbase', 'api', 'technical analysis',
  'volatility', 'support', 'resistance', 'volume', 'trend',
  'buy', 'purchase', 'sell', 'balance', 'transaction', 'portfolio', 'invest'
];

const OFF_TOPIC_KEYWORDS = [
  'cat', 'dog', 'animal', 'pet', 'weather', 'movie', 'music',
  'sports', 'politics', 'health', 'medicine', 'travel', 'cooking',
  'fashion', 'celebrity', 'news', 'entertainment'
];

// Keywords that are allowed even if they seem off-topic (for special features)
const ALLOWED_CONTEXT_KEYWORDS = [
  'beer', 'coffee', 'pizza', 'food' // For price comparison and transaction demos
];

// Define available MCP tools for the AI
const availableTools = [
  {
    name: 'get_spot_price',
    description: 'Get current spot price for a cryptocurrency pair',
    parameters: {
      type: 'object',
      properties: {
        currencyPair: {
          type: 'string',
          description: 'Currency pair (e.g., BTC-USD, ETH-USD)',
        },
      },
      required: ['currencyPair'],
    },
  },
  {
    name: 'get_market_stats',
    description: 'Get 24-hour market statistics for a cryptocurrency pair',
    parameters: {
      type: 'object',
      properties: {
        currencyPair: {
          type: 'string',
          description: 'Currency pair (e.g., BTC-USD, ETH-USD)',
        },
      },
      required: ['currencyPair'],
    },
  },
  {
    name: 'analyze_price_data',
    description: 'Perform technical analysis on cryptocurrency price data',
    parameters: {
      type: 'object',
      properties: {
        currencyPair: {
          type: 'string',
          description: 'Currency pair (e.g., BTC-USD, ETH-USD)',
        },
        period: {
          type: 'string',
          enum: ['1d', '7d', '30d', '1y'],
          description: 'Analysis period',
        },
        metrics: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['volatility', 'trend', 'support_resistance', 'volume'],
          },
          description: 'Analysis metrics to include',
        },
      },
      required: ['currencyPair'],
    },
  },
  {
    name: 'get_popular_pairs',
    description: 'Get a list of popular cryptocurrency trading pairs',
    parameters: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'search_assets',
    description: 'Search for cryptocurrency assets by name or symbol',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query for asset name or symbol',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_exchange_rates',
    description: 'Get exchange rates for a base currency',
    parameters: {
      type: 'object',
      properties: {
        currency: {
          type: 'string',
          description: 'Base currency code (e.g., USD, EUR)',
        },
      },
      required: ['currency'],
    },
  },
  // 🍺₿ WALLET TRANSACTION TOOLS 🍺₿
  {
    name: 'calculate_beer_cost',
    description: 'Calculate how much cryptocurrency you can buy with the price of beer(s) - fun way to understand crypto value! Use when user asks about beer and crypto.',
    parameters: {
      type: 'object',
      properties: {
        currency: {
          type: 'string',
          description: 'Cryptocurrency to calculate (e.g., BTC, ETH, SOL)',
          default: 'BTC',
        },
        beerCount: {
          type: 'number',
          description: 'Number of beers (default: 1)',
          default: 1,
        },
        pricePerBeer: {
          type: 'number',
          description: 'Price per beer in USD (default: 5)',
          default: 5,
        },
      },
    },
  },
  {
    name: 'simulate_btc_purchase',
    description: 'Simulate buying cryptocurrency with USD in the demo wallet. Use when user wants to buy, purchase, or invest in crypto.',
    parameters: {
      type: 'object',
      properties: {
        fromCurrency: {
          type: 'string',
          description: 'Currency to spend (usually USD)',
          default: 'USD',
        },
        toCurrency: {
          type: 'string',
          description: 'Cryptocurrency to buy (e.g., BTC, ETH, SOL)',
        },
        amount: {
          type: 'number',
          description: 'Amount in fromCurrency to spend',
        },
        description: {
          type: 'string',
          description: 'Optional purchase description',
        },
      },
      required: ['toCurrency', 'amount'],
    },
  },
  {
    name: 'get_virtual_wallet',
    description: 'Get the demo wallet balance and statistics. Use when user asks about their wallet, balance, or portfolio.',
    parameters: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_transaction_history',
    description: 'Get the demo wallet transaction history. Use when user asks about transaction history or what they bought.',
    parameters: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description: 'Maximum number of transactions to return (default: 10)',
          default: 10,
        },
        currency: {
          type: 'string',
          description: 'Optional: filter by currency',
        },
      },
    },
  },
];

export class AIService {
  private conversation: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: `You are a specialized cryptocurrency assistant powered by MCP (Model Context Protocol). You have access to real-time Coinbase data through various tools.

IMPORTANT CONVERSATION GUIDELINES:
- You ONLY discuss cryptocurrency, blockchain, trading, and MCP-related topics
- If users ask about unrelated topics (pets, weather, food, etc.), politely redirect them back to cryptocurrency topics
- Your expertise is strictly limited to cryptocurrency markets, technical analysis, and MCP technology
- Always encourage users to explore cryptocurrency questions and MCP capabilities

Your capabilities include:
- Getting current cryptocurrency prices and market data
- Providing market statistics and technical analysis
- Searching for cryptocurrency assets and trading pairs
- Getting exchange rates and currency conversions
- Analyzing price trends, volatility, support/resistance levels
- Explaining MCP (Model Context Protocol) technology and its benefits
- 🍺₿ Demo wallet transactions: calculate beer-to-crypto conversions, simulate purchases, check wallet balance, view transaction history

Always be helpful, accurate, and provide clear explanations about cryptocurrency topics. When users ask about cryptocurrencies, use the appropriate tools to get real-time data. Format your responses in a friendly, conversational way while being informative.

SPECIAL FEATURES:
- When users mention "beer" and crypto, use the calculate_beer_cost tool for fun comparisons!
- When users want to "buy" crypto, use simulate_btc_purchase to demonstrate transactions
- Show wallet balances and transaction history when asked about portfolio or purchases

If a user asks about a cryptocurrency, try to infer the correct trading pair (usually with USD, like BTC-USD, ETH-USD, etc.).

If someone asks about non-cryptocurrency topics, respond with something like: "I'm specialized in cryptocurrency and MCP technology. Let me help you with crypto prices, market analysis, or trading insights instead! What cryptocurrency would you like to know about?"`,
    },
  ];

  // Rate limiting methods
  private checkRateLimit(): { allowed: boolean; remaining: number } {
    const now = Date.now();
    const stored = localStorage.getItem(RATE_LIMIT_STORAGE_KEY);
    let rateLimitData: RateLimitData;

    if (stored) {
      rateLimitData = JSON.parse(stored);
      
      // Reset if window has expired
      if (now - rateLimitData.windowStart > RATE_LIMIT_WINDOW_MS) {
        rateLimitData = { requests: 0, windowStart: now };
      }
    } else {
      rateLimitData = { requests: 0, windowStart: now };
    }

    const remaining = Math.max(0, RATE_LIMIT_MAX_REQUESTS - rateLimitData.requests);
    const allowed = rateLimitData.requests < RATE_LIMIT_MAX_REQUESTS;

    return { allowed, remaining };
  }

  private incrementRateLimit(): void {
    const now = Date.now();
    const stored = localStorage.getItem(RATE_LIMIT_STORAGE_KEY);
    let rateLimitData: RateLimitData;

    if (stored) {
      rateLimitData = JSON.parse(stored);
      
      // Reset if window has expired
      if (now - rateLimitData.windowStart > RATE_LIMIT_WINDOW_MS) {
        rateLimitData = { requests: 1, windowStart: now };
      } else {
        rateLimitData.requests++;
      }
    } else {
      rateLimitData = { requests: 1, windowStart: now };
    }

    localStorage.setItem(RATE_LIMIT_STORAGE_KEY, JSON.stringify(rateLimitData));
  }

  private isTopicAllowed(userMessage: string): boolean {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for special context keywords (like "beer" for wallet demos)
    const hasAllowedContextKeywords = ALLOWED_CONTEXT_KEYWORDS.some(keyword => 
      lowerMessage.includes(keyword)
    );
    
    // Check for off-topic keywords
    const hasOffTopicKeywords = OFF_TOPIC_KEYWORDS.some(keyword => 
      lowerMessage.includes(keyword)
    );
    
    // Check for allowed topics
    const hasAllowedTopics = ALLOWED_TOPICS.some(topic => 
      lowerMessage.includes(topic)
    );
    
    // Allow if it has crypto topics or if it's a general greeting/question
    const isGeneralQuery = lowerMessage.length < 20 || 
      ['hello', 'hi', 'help', 'what', 'how', 'can you', 'show', 'buy', 'get'].some(word => 
        lowerMessage.includes(word)
      );
    
    // Allow if: has crypto topics, has allowed context keywords, or is general query without off-topic keywords
    return hasAllowedTopics || hasAllowedContextKeywords || (isGeneralQuery && !hasOffTopicKeywords);
  }

  async processMessage(userMessage: string): Promise<AIResponse> {
    try {
      // Check rate limit first
      const rateCheck = this.checkRateLimit();
      if (!rateCheck.allowed) {
        return {
          message: `🚫 **Rate Limit Reached**\n\nYou've reached the limit of ${RATE_LIMIT_MAX_REQUESTS} requests per minute. This helps keep the service available for educational use.\n\n⏰ Please wait a moment before sending another message.\n\n💡 **Tip**: Try asking more comprehensive questions to get the most out of each request!`,
          toolCalls: [],
          isRateLimited: true,
          remainingRequests: 0
        };
      }

      // Check topic guardrails
      if (!this.isTopicAllowed(userMessage)) {
        return {
          message: `🎯 **Let's talk crypto!**\n\nI'm specialized in cryptocurrency and MCP technology. I can help you with:\n\n💰 **Cryptocurrency Prices & Analysis**\n• Real-time prices (Bitcoin, Ethereum, etc.)\n• Market statistics and trends\n• Technical analysis and volatility\n\n🔧 **MCP Technology**\n• Model Context Protocol explanations\n• API integration insights\n• Tool capabilities and usage\n\n🚀 **What would you like to explore?**\nTry asking: "What's the current Bitcoin price?" or "Analyze Ethereum's recent performance"`,
          toolCalls: [],
          remainingRequests: rateCheck.remaining
        };
      }

      // Increment rate limit for valid requests
      this.incrementRateLimit();
      const newRateCheck = this.checkRateLimit();

      // Check if OpenAI is available
      if (!openai) {
        // Fallback to basic pattern matching
        const fallbackResponse = await this.processMessageFallback(userMessage);
        return {
          ...fallbackResponse,
          remainingRequests: newRateCheck.remaining
        };
      }

      // Add user message to conversation
      this.conversation.push({
        role: 'user',
        content: userMessage,
      });

      // Get AI response with function calling
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: this.conversation,
        tools: availableTools.map(tool => ({
          type: 'function' as const,
          function: tool,
        })),
        tool_choice: 'auto',
        temperature: 0.7,
      });

      const assistantMessage = response.choices[0]?.message;
      if (!assistantMessage) {
        throw new Error('No response from AI');
      }

      // Add assistant message to conversation
      this.conversation.push(assistantMessage);

      const toolCalls: ToolCall[] = [];
      let responseMessage = assistantMessage.content || '';

      // Execute any tool calls
      if (assistantMessage.tool_calls) {
        for (const toolCall of assistantMessage.tool_calls) {
          if (toolCall.type === 'function') {
            const functionName = toolCall.function.name;
            const functionArgs = JSON.parse(toolCall.function.arguments);

            const mcpToolCall: ToolCall = {
              tool: functionName,
              parameters: functionArgs,
            };

            // Execute the tool call
            const result = await this.executeTool(mcpToolCall);
            toolCalls.push(result);

            // Add tool result to conversation
            this.conversation.push({
              role: 'tool',
              tool_call_id: toolCall.id,
              content: JSON.stringify(result.result || result.error),
            });
          }
        }

        // Get final response with tool results
        if (toolCalls.length > 0 && openai) {
          const finalResponse = await openai.chat.completions.create({
            model: 'gpt-4-turbo-preview',
            messages: this.conversation,
            temperature: 0.7,
          });

          const finalMessage = finalResponse.choices[0]?.message;
          if (finalMessage?.content) {
            responseMessage = finalMessage.content;
            this.conversation.push(finalMessage);
          }
        }
      }

      return {
        message: responseMessage,
        toolCalls,
        remainingRequests: newRateCheck.remaining
      };
    } catch (error) {
      console.error('AI Service error:', error);
      const rateCheck = this.checkRateLimit();
      return {
        message: `I apologize, but I encountered an error processing your request: ${
          error instanceof Error ? error.message : 'Unknown error'
        }. ${import.meta.env.VITE_OPENAI_API_KEY ? 'Please try again.' : 'Please set your OpenAI API key in the environment variables.'}`,
        toolCalls: [],
        remainingRequests: rateCheck.remaining
      };
    }
  }

  private async executeTool(toolCall: ToolCall): Promise<ToolCall> {
    try {
      let endpoint = '';
      let queryParams = new URLSearchParams();
      let method = 'GET';
      let body: any = null;

      switch (toolCall.tool) {
        case 'get_spot_price':
          endpoint = `/api/v1/prices/${toolCall.parameters.currencyPair}/spot`;
          break;
        case 'get_market_stats':
          endpoint = `/api/v1/markets/${toolCall.parameters.currencyPair}/stats`;
          break;
        case 'analyze_price_data':
          endpoint = `/api/v1/analysis/${toolCall.parameters.currencyPair}`;
          if (toolCall.parameters.period) queryParams.append('period', toolCall.parameters.period);
          if (toolCall.parameters.metrics) queryParams.append('metrics', toolCall.parameters.metrics.join(','));
          break;
        case 'get_popular_pairs':
          endpoint = `/api/v1/popular-pairs`;
          break;
        case 'search_assets':
          endpoint = `/api/v1/assets/search`;
          queryParams.append('query', toolCall.parameters.query);
          if (toolCall.parameters.limit) queryParams.append('limit', toolCall.parameters.limit.toString());
          break;
        case 'get_exchange_rates':
          endpoint = `/api/v1/exchange-rates`;
          queryParams.append('currency', toolCall.parameters.currency);
          break;
        // 🍺₿ WALLET TOOLS 🍺₿
        case 'calculate_beer_cost':
          endpoint = `/api/v1/wallet/calculate-beer-cost`;
          if (toolCall.parameters.currency) queryParams.append('currency', toolCall.parameters.currency);
          if (toolCall.parameters.beerCount) queryParams.append('beerCount', toolCall.parameters.beerCount.toString());
          if (toolCall.parameters.pricePerBeer) queryParams.append('pricePerBeer', toolCall.parameters.pricePerBeer.toString());
          break;
        case 'simulate_btc_purchase':
          endpoint = `/api/v1/wallet/purchase`;
          method = 'POST';
          body = JSON.stringify({
            fromCurrency: toolCall.parameters.fromCurrency || 'USD',
            toCurrency: toolCall.parameters.toCurrency,
            amount: toolCall.parameters.amount,
            description: toolCall.parameters.description
          });
          break;
        case 'get_virtual_wallet':
          endpoint = `/api/v1/wallet`;
          break;
        case 'get_transaction_history':
          endpoint = `/api/v1/wallet/transactions`;
          if (toolCall.parameters.limit) queryParams.append('limit', toolCall.parameters.limit.toString());
          if (toolCall.parameters.currency) queryParams.append('currency', toolCall.parameters.currency);
          break;
        default:
          throw new Error(`Unknown tool: ${toolCall.tool}`);
      }

      // Use environment variable or default to relative path for production
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const url = `${baseUrl}${endpoint}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      
      const fetchOptions: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };
      
      if (body) {
        fetchOptions.body = body;
      }
      
      const response = await fetch(url, fetchOptions);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return { ...toolCall, result: data };
    } catch (error) {
      return {
        ...toolCall,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Reset conversation history
  resetConversation() {
    this.conversation = this.conversation.slice(0, 1); // Keep system message
  }

  // Get conversation history length
  getConversationLength() {
    return this.conversation.length;
  }

  // Fallback method when OpenAI is not available
  private async processMessageFallback(userMessage: string): Promise<AIResponse> {
    const lowerMessage = userMessage.toLowerCase();
    const toolCalls: ToolCall[] = [];

    // Basic pattern matching
    if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      const cryptoMatch = lowerMessage.match(/\b(btc|bitcoin|eth|ethereum|ltc|litecoin|bch|ada|dot|uni|link|sol|matic|avax|algo)\b/);
      const crypto = cryptoMatch ? cryptoMatch[1] : 'btc';
      const pair = crypto.toUpperCase() + '-USD';
      
      toolCalls.push({
        tool: 'get_spot_price',
        parameters: { currencyPair: pair }
      });
    } else if (lowerMessage.includes('popular') || lowerMessage.includes('pairs')) {
      toolCalls.push({
        tool: 'get_popular_pairs',
        parameters: {}
      });
    } else {
      // Default to BTC price
      toolCalls.push({
        tool: 'get_spot_price',
        parameters: { currencyPair: 'BTC-USD' }
      });
    }

    // Execute tools
    const executedToolCalls = await Promise.all(
      toolCalls.map(toolCall => this.executeTool(toolCall))
    );

    // Format basic response
    let message = `💡 **Basic Mode** (OpenAI not configured)\n\n`;
    
    executedToolCalls.forEach(toolCall => {
      if (toolCall.error) {
        message += `❌ Error: ${toolCall.error}\n`;
      } else if (toolCall.result && toolCall.tool === 'get_spot_price') {
        const price = toolCall.result.data;
        message += `💰 **${price.base} Price**: $${parseFloat(price.amount).toLocaleString()}\n`;
      } else if (toolCall.result && toolCall.tool === 'get_popular_pairs') {
        message += `🔥 **Popular Trading Pairs**:\n`;
        toolCall.result.data.slice(0, 5).forEach((pair: string) => {
          message += `• ${pair}\n`;
        });
      }
    });

    message += `\n🚀 **Want AI-powered conversations?**\nAdd your OpenAI API key to unlock intelligent chat!`;

    return {
      message: message.trim(),
      toolCalls: executedToolCalls,
    };
  }
}

export const aiService = new AIService(); 