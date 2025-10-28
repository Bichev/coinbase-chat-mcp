import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  CurrencyDollarIcon, 
  CodeBracketIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  BookOpenIcon,
  CubeTransparentIcon,
  PresentationChartBarIcon,
  WalletIcon
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

const navigation = [
  { 
    name: 'MCP Chat', 
    href: '/', 
    icon: ChatBubbleLeftRightIcon,
    description: 'AI conversations',
    gradient: 'from-cyan-500 to-blue-600'
  },
  { 
    name: 'Virtual Wallet', 
    href: '/wallet', 
    icon: WalletIcon,
    description: '🍺₿ Demo transactions',
    gradient: 'from-purple-500 to-pink-600'
  },
  // { 
  //   name: 'Markets', 
  //   href: '/markets', 
  //   icon: ChartBarIcon,
  //   description: 'Trading data',
  //   gradient: 'from-green-500 to-emerald-600'
  // },
  // { 
  //   name: 'Assets', 
  //   href: '/assets', 
  //   icon: CubeIcon,
  //   description: 'Crypto assets',
  //   gradient: 'from-purple-500 to-violet-600'
  // },
  // { 
  //   name: 'Analysis', 
  //   href: '/analysis', 
  //   icon: BeakerIcon,
  //   description: 'Market insights',
  //   gradient: 'from-orange-500 to-red-600'
  // },
  { 
    name: 'MCP Tester', 
    href: '/mcp-tester', 
    icon: CodeBracketIcon,
    description: 'Protocol testing',
    gradient: 'from-indigo-500 to-purple-600'
  },
  { 
    name: 'API Explorer', 
    href: '/api-explorer', 
    icon: CurrencyDollarIcon,
    description: 'API documentation',
    gradient: 'from-yellow-500 to-orange-600'
  },
  { 
    name: 'Tutorial', 
    href: '/tutorial', 
    icon: BookOpenIcon,
    description: 'Comprehensive guide',
    gradient: 'from-teal-500 to-cyan-600'
  },
  { 
    name: 'Architecture', 
    href: '/architecture', 
    icon: CubeTransparentIcon,
    description: 'MCP deep dive',
    gradient: 'from-violet-500 to-purple-600'
  },
  { 
    name: 'Presentations', 
    href: '/presentations', 
    icon: PresentationChartBarIcon,
    description: 'Business slides',
    gradient: 'from-rose-500 to-pink-600'
  },
];

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Top Attribution Banner */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white text-center py-1.5 shadow-lg">
        <div className="flex items-center justify-center space-x-4 text-xs font-medium">
          <span>
            Made with ❤️ by{' '}
            <a 
              href="https://www.linkedin.com/in/vladimir-bichev-383b1525/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-semibold hover:text-yellow-300 transition-colors duration-200 underline decoration-white/50 hover:decoration-yellow-300"
            >
              Vladimir Bichev
            </a>
            {' '}for the crypto and AI communities
          </span>
          <span className="text-white/70">•</span>
          <a 
            href="https://github.com/Bichev/coinbase-chat-mcp" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-1 hover:text-yellow-300 transition-colors duration-200"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
            </svg>
            <span>GitHub</span>
          </a>
        </div>
      </div>
      
      {/* Sidebar */}
      <div className="flex flex-col w-72 bg-white/80 backdrop-blur-sm shadow-2xl border-r border-gray-200/50 mt-8">
        {/* Header */}
        <div className="flex items-center justify-center h-20 px-6 bg-gradient-to-r from-blue-600 to-indigo-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-600/20 animate-pulse-glow"></div>
          <div className="relative z-10 flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <SparklesIcon className="h-8 w-8 text-white animate-float" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Coinbase MCP</h1>
              <p className="text-blue-100 text-xs">Educational Demo</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 bg-white/50 backdrop-blur-sm">
          <div className="space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={clsx(
                    'group relative flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 overflow-hidden',
                    isActive
                      ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg scale-105`
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/70 hover:shadow-md hover:scale-102'
                  )}
                >
                  {/* Background effects */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5" />
                  )}
                  {!isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-50/50 to-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                  
                  {/* Content */}
                  <div className="relative z-10 flex items-center w-full">
                    <div className={clsx(
                      'p-2 rounded-lg mr-3 transition-all duration-300',
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-100 text-gray-400 group-hover:bg-white group-hover:text-gray-600'
                    )}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{item.name}</span>
                        {isActive && (
                          <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" />
                        )}
                      </div>
                      <p className={clsx(
                        'text-xs mt-0.5',
                        isActive ? 'text-white/80' : 'text-gray-500 group-hover:text-gray-600'
                      )}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white/60 rounded-r-full" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="flex-shrink-0 px-4 py-4 border-t border-gray-200/50 bg-white/30 backdrop-blur-sm">
          <div className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200/50 shadow-sm">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">System Status</p>
                <p className="text-xs text-green-600">All systems operational</p>
              </div>
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              <p className="font-medium">Coinbase Chat MCP v1.3.0</p>
              <p>MIT Licensed • Open Source</p>
              <div className="flex items-center space-x-2 pt-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <span className="text-xs text-gray-400">13 MCP tools active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden mt-8">
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
} 