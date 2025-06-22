import React, { useState, useEffect } from 'react';
import { History, Plus, Trash2, MessageSquare, Clock } from 'lucide-react';
import { chatSessionService, ChatSession } from '../services/chatSessionService';

interface ChatSessionHistoryProps {
  onClose?: () => void;
}

const ChatSessionHistory: React.FC<ChatSessionHistoryProps> = ({ onClose }) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  useEffect(() => {
    loadSessions();
    
    const currentSession = chatSessionService.getCurrentSession();
    if (currentSession) {
      setCurrentSessionId(currentSession.id);
    }

    // Subscribe to session updates
    const unsubscribe = chatSessionService.subscribe(() => {
      loadSessions();
      const updatedSession = chatSessionService.getCurrentSession();
      setCurrentSessionId(updatedSession?.id || null);
    });

    return unsubscribe;
  }, []);

  const loadSessions = () => {
    const allSessions = chatSessionService.getAllSessions();
    // Sort by last updated, most recent first
    const sortedSessions = allSessions.sort((a, b) => 
      new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    );
    setSessions(sortedSessions);
  };

  const handleSessionClick = (session: ChatSession) => {
    chatSessionService.loadSession(session.id);
    onClose?.();
  };

  const handleNewSession = () => {
    chatSessionService.createNewSession();
    onClose?.();
  };

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this chat session?')) {
      chatSessionService.deleteSession(sessionId);
    }
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return dateObj.toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <History className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Chat History</h2>
                <p className="text-sm text-gray-500">{sessions.length} sessions</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleNewSession}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>New Chat</span>
              </button>
              <button
                onClick={onClose}
                className="px-3 py-2 text-gray-600 hover:text-gray-900 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>

        {/* Sessions List */}
        <div className="overflow-y-auto max-h-[60vh]">
          {sessions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No chat sessions yet</p>
              <p className="text-sm">Start a new conversation to create your first session</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => handleSessionClick(session)}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    session.id === currentSessionId ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {session.title || 'New Chat'}
                        </h3>
                        {session.id === currentSessionId && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Current
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {session.messages.length > 1 
                          ? session.messages[session.messages.length - 1].content.substring(0, 120) + '...'
                          : 'No messages yet'
                        }
                      </p>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="w-3 h-3" />
                          <span>{session.messages.length} messages</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(session.lastUpdated)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={(e) => handleDeleteSession(session.id, e)}
                      className="ml-4 p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete session"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatSessionHistory; 