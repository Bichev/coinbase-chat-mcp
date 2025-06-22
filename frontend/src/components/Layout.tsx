import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ChartBarIcon, 
  CurrencyDollarIcon, 
  BeakerIcon, 
  CodeBracketIcon,
  HomeIcon,
  CubeIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Markets', href: '/markets', icon: ChartBarIcon },
  { name: 'Assets', href: '/assets', icon: CubeIcon },
  { name: 'Analysis', href: '/analysis', icon: BeakerIcon },
  { name: 'MCP Chat', href: '/chat', icon: ChatBubbleLeftRightIcon },
  { name: 'MCP Tester', href: '/mcp-tester', icon: CodeBracketIcon },
  { name: 'API Explorer', href: '/api-explorer', icon: CurrencyDollarIcon },
];

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="flex flex-col w-64 bg-white shadow-sm">
        <div className="flex items-center justify-center h-16 px-4 bg-blue-600">
          <h1 className="text-xl font-bold text-white">Coinbase MCP</h1>
        </div>
        <nav className="flex-1 px-2 py-4 bg-white">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={clsx(
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <item.icon
                    className={clsx(
                      'mr-3 flex-shrink-0 h-6 w-6',
                      isActive
                        ? 'text-blue-500'
                        : 'text-gray-400 group-hover:text-gray-500'
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>
        <div className="flex-shrink-0 px-4 py-4 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            <p>Coinbase Chat MCP v1.0.0</p>
            <p className="mt-1">MIT Licensed • Open Source</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
} 