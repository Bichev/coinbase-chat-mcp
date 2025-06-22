import OpenAI from 'openai';

// Initialize OpenAI (you'll need to set VITE_OPENAI_API_KEY in your .env)
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const openai = apiKey ? new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true // Note: In production, this should be done server-side
}) : null;

interface ToolCall {
  tool: string;
  parameters: Record<string, any>;
  result?: any;
  error?: string;
}

interface AIResponse {
  message: string;
  toolCalls: ToolCall[];
}

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
];

export class AIService {
  private conversation: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: `You are a helpful cryptocurrency assistant powered by MCP (Model Context Protocol). You have access to real-time Coinbase data through various tools.

Your capabilities include:
- Getting current cryptocurrency prices
- Providing market statistics and analysis
- Searching for cryptocurrency assets
- Getting exchange rates
- Analyzing price trends and volatility

Always be helpful, accurate, and provide clear explanations. When users ask about cryptocurrencies, use the appropriate tools to get real-time data. Format your responses in a friendly, conversational way while being informative.

If a user asks about a cryptocurrency, try to infer the correct trading pair (usually with USD, like BTC-USD, ETH-USD, etc.).`,
    },
  ];

  async processMessage(userMessage: string): Promise<AIResponse> {
    try {
      // Check if OpenAI is available
      if (!openai) {
        // Fallback to basic pattern matching
        return await this.processMessageFallback(userMessage);
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
      };
    } catch (error) {
      console.error('AI Service error:', error);
      return {
        message: `I apologize, but I encountered an error processing your request: ${
          error instanceof Error ? error.message : 'Unknown error'
        }. ${import.meta.env.VITE_OPENAI_API_KEY ? 'Please try again.' : 'Please set your OpenAI API key in the environment variables.'}`,
        toolCalls: [],
      };
    }
  }

  private async executeTool(toolCall: ToolCall): Promise<ToolCall> {
    try {
      let endpoint = '';
      let queryParams = new URLSearchParams();

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
        default:
          throw new Error(`Unknown tool: ${toolCall.tool}`);
      }

      const url = `http://localhost:3002${endpoint}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await fetch(url);
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