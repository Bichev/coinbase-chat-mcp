import { aiService } from './aiService';

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  toolCalls?: ToolCall[];
}

export interface ToolCall {
  tool: string;
  parameters: Record<string, any>;
  result?: any;
  error?: string;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  lastUpdated: Date;
  title?: string;
}

const STORAGE_KEY = 'coinbase_chat_sessions';
const CURRENT_SESSION_KEY = 'coinbase_current_session';

class ChatSessionService {
  private currentSession: ChatSession | null = null;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadCurrentSession();
  }

  // Subscribe to session updates
  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  // Initialize or load current session
  private loadCurrentSession() {
    try {
      const currentSessionId = localStorage.getItem(CURRENT_SESSION_KEY);
      if (currentSessionId) {
        const sessions = this.getAllSessions();
        const session = sessions.find(s => s.id === currentSessionId);
        if (session) {
          // Deserialize dates
          session.messages = session.messages.map(msg => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
          session.lastUpdated = new Date(session.lastUpdated);
          this.currentSession = session;
        }
      }
      
      // Create new session if none exists
      if (!this.currentSession) {
        this.createNewSession();
      }
    } catch (error) {
      console.error('Error loading chat session:', error);
      this.createNewSession();
    }
  }

  // Create a new chat session
  createNewSession(): ChatSession {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      messages: [
        {
          id: '1',
          type: 'assistant',
          content: 'Hello! I\'m your Coinbase MCP assistant. I can help you with cryptocurrency prices, market analysis, and trading insights using real-time Coinbase data.\n\nTry asking me things like:\n• "What\'s the current Bitcoin price?"\n• "Show me popular trading pairs"\n• "Get Ethereum price"\n• "Bitcoin price"\n\n💡 **AI Mode**: For advanced conversational AI, add your OpenAI API key to `.env`\n🔧 **Basic Mode**: I can still help with crypto data using pattern matching!',
          timestamp: new Date()
        }
      ],
      lastUpdated: new Date(),
      title: 'New Chat'
    };

    this.currentSession = newSession;
    this.saveCurrentSession();
    aiService.resetConversation();
    this.notifyListeners();
    return newSession;
  }

  // Get current session
  getCurrentSession(): ChatSession | null {
    return this.currentSession;
  }

  // Add message to current session
  addMessage(message: ChatMessage) {
    if (!this.currentSession) {
      this.createNewSession();
    }
    
    if (this.currentSession) {
      this.currentSession.messages.push(message);
      this.currentSession.lastUpdated = new Date();
      
      // Auto-generate title from first user message
      if (!this.currentSession.title || this.currentSession.title === 'New Chat') {
        const firstUserMessage = this.currentSession.messages.find(m => m.type === 'user');
        if (firstUserMessage) {
          this.currentSession.title = this.generateTitleFromMessage(firstUserMessage.content);
        }
      }
      
      this.saveCurrentSession();
      this.notifyListeners();
    }
  }

  // Update last message in current session
  updateLastMessage(updates: Partial<ChatMessage>) {
    if (!this.currentSession || this.currentSession.messages.length === 0) {
      return;
    }
    
    const lastMessage = this.currentSession.messages[this.currentSession.messages.length - 1];
    Object.assign(lastMessage, updates);
    this.currentSession.lastUpdated = new Date();
    
    this.saveCurrentSession();
    this.notifyListeners();
  }

  // Clear current session
  clearCurrentSession() {
    if (this.currentSession) {
      this.currentSession.messages = [
        {
          id: '1',
          type: 'assistant',
          content: 'Hello! I\'m your Coinbase MCP assistant. I can help you with cryptocurrency prices, market analysis, and trading insights using real-time Coinbase data.\n\nTry asking me things like:\n• "What\'s the current Bitcoin price?"\n• "Show me popular trading pairs"\n• "Get Ethereum price"\n• "Bitcoin price"\n\n💡 **AI Mode**: For advanced conversational AI, add your OpenAI API key to `.env`\n🔧 **Basic Mode**: I can still help with crypto data using pattern matching!',
          timestamp: new Date()
        }
      ];
      this.currentSession.lastUpdated = new Date();
      this.saveCurrentSession();
      aiService.resetConversation();
      this.notifyListeners();
    }
  }

  // Load a specific session
  loadSession(sessionId: string): boolean {
    const sessions = this.getAllSessions();
    const session = sessions.find(s => s.id === sessionId);
    
    if (session) {
      // Deserialize dates
      session.messages = session.messages.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
      session.lastUpdated = new Date(session.lastUpdated);
      
      this.currentSession = session;
      localStorage.setItem(CURRENT_SESSION_KEY, sessionId);
      
      // Restore AI conversation context
      aiService.resetConversation();
      
      this.notifyListeners();
      return true;
    }
    
    return false;
  }

  // Save current session to localStorage
  private saveCurrentSession() {
    if (!this.currentSession) return;
    
    try {
      const sessions = this.getAllSessions();
      const existingIndex = sessions.findIndex(s => s.id === this.currentSession!.id);
      
      if (existingIndex >= 0) {
        sessions[existingIndex] = this.currentSession;
      } else {
        sessions.push(this.currentSession);
      }
      
      // Keep only last 10 sessions
      if (sessions.length > 10) {
        sessions.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
        sessions.splice(10);
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
      localStorage.setItem(CURRENT_SESSION_KEY, this.currentSession.id);
    } catch (error) {
      console.error('Error saving chat session:', error);
    }
  }

  // Get all sessions from localStorage
  getAllSessions(): ChatSession[] {
    try {
      const sessionsJson = localStorage.getItem(STORAGE_KEY);
      return sessionsJson ? JSON.parse(sessionsJson) : [];
    } catch (error) {
      console.error('Error loading chat sessions:', error);
      return [];
    }
  }

  // Delete a session
  deleteSession(sessionId: string) {
    const sessions = this.getAllSessions();
    const filteredSessions = sessions.filter(s => s.id !== sessionId);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredSessions));
    
    // If we deleted the current session, create a new one
    if (this.currentSession?.id === sessionId) {
      this.createNewSession();
    }
    
    this.notifyListeners();
  }

  // Generate title from message content
  private generateTitleFromMessage(content: string): string {
    // Take first 50 characters and add ellipsis if needed
    const title = content.trim().substring(0, 50);
    return title.length < content.trim().length ? title + '...' : title;
  }

  // Get session preview for UI
  getSessionPreview(): { id: string; title: string; lastMessage: string; lastUpdated: Date } | null {
    if (!this.currentSession) return null;
    
    const lastMessage = this.currentSession.messages[this.currentSession.messages.length - 1];
    return {
      id: this.currentSession.id,
      title: this.currentSession.title || 'New Chat',
      lastMessage: lastMessage.content.substring(0, 100) + (lastMessage.content.length > 100 ? '...' : ''),
      lastUpdated: this.currentSession.lastUpdated
    };
  }
}

export const chatSessionService = new ChatSessionService(); 