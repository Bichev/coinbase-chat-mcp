import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, RefreshCw } from 'lucide-react';
import { aiService } from '../services/aiService';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  toolCalls?: ToolCall[];
}

interface ToolCall {
  tool: string;
  parameters: Record<string, any>;
  result?: any;
  error?: string;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your Coinbase MCP assistant. I can help you with cryptocurrency prices, market analysis, and trading insights using real-time Coinbase data.\n\nTry asking me things like:\n• "What\'s the current Bitcoin price?"\n• "Show me popular trading pairs"\n• "Get Ethereum price"\n• "Bitcoin price"\n\n💡 **AI Mode**: For advanced conversational AI, add your OpenAI API key to `.env`\n🔧 **Basic Mode**: I can still help with crypto data using pattern matching!',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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

    setMessages(prev => [...prev, userMessage]);
    const userInput = input;
    setInput('');
    setIsLoading(true);

    try {
      // Use AI service to process the message
      const aiResponse = await aiService.processMessage(userInput);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponse.message,
        timestamp: new Date(),
        toolCalls: aiResponse.toolCalls
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `❌ Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetConversation = () => {
    aiService.resetConversation();
    setMessages([
      {
        id: '1',
        type: 'assistant',
        content: 'Hello! I\'m your Coinbase MCP assistant. I can help you with cryptocurrency prices, market analysis, and trading insights using real-time Coinbase data.\n\nTry asking me things like:\n• "What\'s the current Bitcoin price?"\n• "Show me popular trading pairs"\n• "Get Ethereum price"\n• "Bitcoin price"\n\n💡 **AI Mode**: For advanced conversational AI, add your OpenAI API key to `.env`\n🔧 **Basic Mode**: I can still help with crypto data using pattern matching!',
        timestamp: new Date()
      }
    ]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Bot className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Coinbase MCP Chat</h1>
              <p className="text-sm text-gray-500">AI-powered cryptocurrency assistant</p>
            </div>
          </div>
          <button
            onClick={resetConversation}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Reset conversation"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-3xl ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'} space-x-3`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.type === 'user' 
                  ? 'bg-blue-500 text-white ml-3' 
                  : 'bg-gray-200 text-gray-600 mr-3'
              }`}>
                {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`rounded-lg p-4 ${
                message.type === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-900 border border-gray-200'
              }`}>
                <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                {message.toolCalls && message.toolCalls.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="text-xs text-gray-500 mb-2">🔧 Tool calls executed:</div>
                    {message.toolCalls.map((toolCall, index) => (
                      <div key={index} className="text-xs bg-gray-50 rounded p-2 mb-1">
                        <span className="font-mono">{toolCall.tool}</span>
                        {toolCall.error && <span className="text-red-500 ml-2">❌ {toolCall.error}</span>}
                        {toolCall.result && <span className="text-green-500 ml-2">✅ Success</span>}
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
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-gray-500">Analyzing and fetching data...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 bg-white p-4">
        <div className="flex space-x-3">
          <div className="flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about cryptocurrency prices, market analysis, or trading insights..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={2}
              disabled={isLoading}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          💡 Powered by OpenAI GPT-4 + MCP Tools | Try: "What's the Bitcoin price?", "Compare BTC and ETH", "How is the crypto market today?"
        </div>
      </div>
    </div>
  );
};

export default ChatInterface; 