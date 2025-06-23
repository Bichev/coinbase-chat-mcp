import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ChartBarIcon, 
  CurrencyDollarIcon, 
  BeakerIcon, 
  CodeBracketIcon,
  HomeIcon,
  CubeIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/', 
    icon: HomeIcon,
    description: 'Market overview',
    gradient: 'from-blue-500 to-indigo-600'
  },
  { 
    name: 'Markets', 
    href: '/markets', 
    icon: ChartBarIcon,
    description: 'Trading data',
    gradient: 'from-green-500 to-emerald-600'
  },
  { 
    name: 'Assets', 
    href: '/assets', 
    icon: CubeIcon,
    description: 'Crypto assets',
    gradient: 'from-purple-500 to-violet-600'
  },
  { 
    name: 'Analysis', 
    href: '/analysis', 
    icon: BeakerIcon,
    description: 'Market insights',
    gradient: 'from-orange-500 to-red-600'
  },
  { 
    name: 'MCP Chat', 
    href: '/chat', 
    icon: ChatBubbleLeftRightIcon,
    description: 'AI conversations',
    gradient: 'from-cyan-500 to-blue-600'
  },
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
];

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Sidebar */}
      <div className="flex flex-col w-72 bg-white/80 backdrop-blur-sm shadow-2xl border-r border-gray-200/50">
        {/* Header */}
        <div className="flex items-center justify-center h-20 px-6 bg-gradient-to-r from-blue-600 to-indigo-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-600/20 animate-pulse-glow"></div>
          <div className="relative z-10 flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <SparklesIcon className="h-8 w-8 text-white animate-float" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Coinbase MCP</h1>
              <p className="text-blue-100 text-xs">Professional Edition</p>
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
                <span className="text-xs text-gray-400">8 MCP tools active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
} 