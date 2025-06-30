import React, { useState, useEffect } from 'react';
import { 
  BookOpenIcon, 
  CodeBracketIcon, 
  CubeTransparentIcon,
  CommandLineIcon,
  LightBulbIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  PlayIcon,
  DocumentTextIcon,
  CogIcon,
  ArrowTopRightOnSquareIcon,
  ShieldCheckIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface Section {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  content: React.ReactNode;
}

// Mermaid component for rendering diagrams with zoom and responsive features
const MermaidDiagram: React.FC<{ chart: string; id: string; height?: string }> = ({ chart, id, height = "500px" }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const renderDiagram = async () => {
      // Load Mermaid if not already loaded
      if (typeof window !== 'undefined' && !(window as any).mermaid) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';
        script.onload = () => {
          (window as any).mermaid.initialize({ 
            startOnLoad: false,
            theme: 'default',
            flowchart: {
              useMaxWidth: true,
              htmlLabels: true,
              curve: 'basis'
            },
            sequence: {
              useMaxWidth: true,
              wrap: true
            },
            themeVariables: {
              primaryColor: '#3b82f6',
              primaryTextColor: '#1f2937',
              primaryBorderColor: '#e5e7eb',
              lineColor: '#6b7280',
              sectionBkgColor: '#f9fafb',
              altSectionBkgColor: '#ffffff',
              gridColor: '#e5e7eb',
              background: '#ffffff',
              mainBkg: '#ffffff',
              secondBkg: '#f8fafc',
              tertiaryColor: '#f1f5f9',
              fontSize: '14px'
            }
          });
          // Small delay to ensure DOM is ready
          timeoutId = setTimeout(renderChart, 100);
        };
        document.head.appendChild(script);
      } else if ((window as any).mermaid) {
        // Small delay for DOM readiness
        timeoutId = setTimeout(renderChart, 100);
      }
    };

    const renderChart = async () => {
      const element = document.getElementById(id);
      if (element && (window as any).mermaid) {
        element.innerHTML = '<div class="flex items-center justify-center p-8 text-gray-500">Loading diagram...</div>';
        try {
          const { svg } = await (window as any).mermaid.render(`${id}-svg`, chart);
          element.innerHTML = svg;
          setIsLoaded(true);
          
          // Make SVG responsive
          const svgElement = element.querySelector('svg');
          if (svgElement) {
            svgElement.style.maxWidth = '100%';
            svgElement.style.height = 'auto';
            svgElement.style.cursor = isZoomed ? 'zoom-out' : 'zoom-in';
            
            // Add click handler for zoom
            svgElement.addEventListener('click', () => {
              setIsZoomed(!isZoomed);
            });
          }
        } catch (error) {
          console.error('Mermaid rendering error:', error);
          element.innerHTML = `<div class="text-red-500 text-sm p-4">Error rendering diagram: ${error instanceof Error ? error.message : 'Unknown error'}</div>`;
        }
      }
    };

    renderDiagram();
    
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [chart, id]);

  return (
    <div className="relative">
      {/* Zoom controls */}
      <div className="absolute top-2 right-2 z-10 flex space-x-2">
        <button
          onClick={() => setIsZoomed(!isZoomed)}
          disabled={!isLoaded}
          className={`border border-gray-300 rounded-lg px-3 py-1 text-sm font-medium shadow-sm transition-all duration-200 ${
            isLoaded 
              ? 'bg-white/90 hover:bg-white text-gray-700 hover:text-gray-900' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isZoomed ? '🔍 Zoom Out' : '🔍 Zoom In'}
        </button>
        <button
          onClick={() => {
            const element = document.getElementById(id);
            const svg = element?.querySelector('svg');
            if (svg) {
              const svgData = new XMLSerializer().serializeToString(svg);
              const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
              const svgUrl = URL.createObjectURL(svgBlob);
              const downloadLink = document.createElement('a');
              downloadLink.href = svgUrl;
              downloadLink.download = `${id}.svg`;
              document.body.appendChild(downloadLink);
              downloadLink.click();
              document.body.removeChild(downloadLink);
            }
          }}
          disabled={!isLoaded}
          className={`border border-gray-300 rounded-lg px-3 py-1 text-sm font-medium shadow-sm transition-all duration-200 ${
            isLoaded 
              ? 'bg-white/90 hover:bg-white text-gray-700 hover:text-gray-900' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          💾 Save
        </button>
      </div>
      
      {/* Diagram container */}
      <div 
        id={id} 
        className={`mermaid-container transition-all duration-300 overflow-auto border border-gray-200 rounded-lg bg-white ${
          isZoomed 
            ? 'fixed inset-4 z-50 shadow-2xl p-4' 
            : 'relative'
        }`}
        style={{ 
          minHeight: isZoomed ? '90vh' : height,
          maxHeight: isZoomed ? '90vh' : 'none'
        }}
      />
      
      {/* Zoom overlay backdrop */}
      {isZoomed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsZoomed(false)}
        />
      )}
      
      {/* Mobile responsive hint */}
      <div className="mt-2 text-center">
        <p className="text-xs text-gray-500">
          💡 Click diagram to zoom • Scroll to pan • Click "Save" to download
        </p>
      </div>
    </div>
  );
};

const Tutorial: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('introduction');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['introduction']));

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
    setActiveSection(sectionId);
    
    // Scroll to section
    setTimeout(() => {
      const element = document.getElementById(`section-${sectionId}`);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }
    }, 100);
  };

  const sections: Section[] = [
    {
      id: 'introduction',
      title: 'Introduction to MCP',
      icon: BookOpenIcon,
      content: (
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-200/50">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Model Context Protocol (MCP)</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              The Model Context Protocol (MCP) is an open standard that enables AI applications to securely connect to external data sources and tools. 
              It provides a standardized way for AI models to access real-time information, execute functions, and interact with various services 
              while maintaining security and control.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-100">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <CubeTransparentIcon className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Standardized</h4>
                <p className="text-sm text-gray-600">Unified protocol for AI-tool integration across different platforms and providers.</p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm border border-green-100">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <CommandLineIcon className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Secure</h4>
                <p className="text-sm text-gray-600">Built-in security controls and permission management for safe AI interactions.</p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm border border-purple-100">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <LightBulbIcon className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Extensible</h4>
                <p className="text-sm text-gray-600">Easy to extend with custom tools and data sources for specific use cases.</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-4">Key Benefits</h4>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <span><strong>Real-time Data Access:</strong> Connect AI models to live data sources and APIs</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span><strong>Tool Integration:</strong> Enable AI to execute functions and interact with external systems</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <span><strong>Security & Control:</strong> Maintain oversight and permissions for AI actions</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <span><strong>Interoperability:</strong> Works across different AI platforms and development environments</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'value-proposition',
      title: 'Use Cases',
      icon: LightBulbIcon,
      content: (
        <div className="space-y-8">
          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Why MCP Matters: Democratizing API Access</h3>
            
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200 mb-8">
              <h4 className="text-xl font-semibold text-amber-900 mb-4">🚀 The Core Problem MCP Solves</h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-amber-100">
                    <h5 className="font-semibold text-red-700 mb-2">❌ Before MCP (Traditional APIs)</h5>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li>• <strong>Technical Barrier:</strong> Need programming knowledge</li>
                      <li>• <strong>Complex Documentation:</strong> Endpoints, parameters, authentication</li>
                      <li>• <strong>Manual Integration:</strong> Custom code for each API</li>
                      <li>• <strong>Limited Accessibility:</strong> Only developers can use APIs</li>
                      <li>• <strong>Static Interaction:</strong> Rigid request/response patterns</li>
                    </ul>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-green-100">
                    <h5 className="font-semibold text-green-700 mb-2">✅ After MCP (Human Language APIs)</h5>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li>• <strong>Natural Language:</strong> "What's Bitcoin price?" works</li>
                      <li>• <strong>Intelligent Routing:</strong> AI selects right tools automatically</li>
                      <li>• <strong>Universal Access:</strong> Anyone can interact with APIs</li>
                      <li>• <strong>Context Awareness:</strong> Understands intent and nuance</li>
                      <li>• <strong>Multi-tool Orchestration:</strong> Combines multiple APIs seamlessly</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <h4 className="text-lg font-semibold text-blue-900 mb-4">🎯 Current Implementation: Coinbase</h4>
                <div className="space-y-3 text-sm text-blue-800">
                  <div className="bg-white rounded-lg p-3 border border-blue-100">
                    <strong>Read-Only Operations:</strong>
                    <ul className="mt-2 space-y-1 ml-4">
                      <li>• Real-time cryptocurrency prices</li>
                      <li>• Historical market data analysis</li>
                      <li>• Asset information and metadata</li>
                      <li>• Market statistics and trends</li>
                    </ul>
                  </div>
                  <div className="bg-blue-100 rounded-lg p-3 border border-blue-200">
                    <strong>Demo Queries:</strong>
                    <ul className="mt-2 space-y-1 ml-4 text-xs">
                      <li>• "Compare Bitcoin and Ethereum performance"</li>
                      <li>• "Show me the top 5 cryptocurrencies"</li>
                      <li>• "Analyze Bitcoin volatility over 30 days"</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                <h4 className="text-lg font-semibold text-purple-900 mb-4">🚀 Future Potential: Advanced Features</h4>
                <div className="space-y-3 text-sm text-purple-800">
                  <div className="bg-white rounded-lg p-3 border border-purple-100">
                    <strong>With Authentication & Authorization:</strong>
                    <ul className="mt-2 space-y-1 ml-4">
                      <li>• "Buy $100 worth of Bitcoin"</li>
                      <li>• "Set a stop-loss at $95,000 for my BTC"</li>
                      <li>• "Show my portfolio performance"</li>
                      <li>• "Transfer 0.1 ETH to my cold wallet"</li>
                    </ul>
                  </div>
                  <div className="bg-purple-100 rounded-lg p-3 border border-purple-200">
                    <strong>Advanced AI Capabilities:</strong>
                    <ul className="mt-2 space-y-1 ml-4 text-xs">
                      <li>• Automated trading strategies</li>
                      <li>• Risk management and alerts</li>
                      <li>• Portfolio rebalancing</li>
                      <li>• Market sentiment analysis</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h4 className="text-xl font-semibold text-gray-900 mb-6 text-center">🌍 Real-World MCP Applications</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    title: "🏦 Financial Services",
                    examples: [
                      "Trading platforms with voice commands",
                      "Personal finance assistants",
                      "Investment research automation",
                      "Risk assessment and alerts"
                    ],
                    color: "green"
                  },
                  {
                    title: "☁️ Cloud Infrastructure", 
                    examples: [
                      "\"Deploy my app to AWS\"",
                      "\"Scale my database cluster\"",
                      "\"Show me cost optimization\"",
                      "\"Backup all production data\""
                    ],
                    color: "blue"
                  },
                  {
                    title: "🛒 E-commerce",
                    examples: [
                      "\"Find best deals on laptops\"",
                      "\"Track my order status\"",
                      "\"Manage inventory levels\"",
                      "\"Analyze customer behavior\""
                    ],
                    color: "purple"
                  },
                  {
                    title: "📊 Business Intelligence",
                    examples: [
                      "\"Generate sales report for Q4\"",
                      "\"Compare regional performance\"",
                      "\"Predict next quarter trends\"",
                      "\"Alert on anomalies\""
                    ],
                    color: "orange"
                  },
                  {
                    title: "🏥 Healthcare",
                    examples: [
                      "\"Schedule patient appointments\"",
                      "\"Check drug interactions\"",
                      "\"Analyze lab results\"",
                      "\"Generate treatment plans\""
                    ],
                    color: "red"
                  },
                  {
                    title: "🏠 IoT & Smart Home",
                    examples: [
                      "\"Optimize energy usage\"",
                      "\"Monitor security systems\"",
                      "\"Control home automation\"",
                      "\"Predict maintenance needs\""
                    ],
                    color: "teal"
                  }
                ].map((category, index) => (
                  <div key={index} className={`bg-${category.color}-50 rounded-lg p-4 border border-${category.color}-200`}>
                    <h5 className={`font-semibold text-${category.color}-900 mb-3`}>{category.title}</h5>
                    <ul className={`space-y-1 text-xs text-${category.color}-800`}>
                      {category.examples.map((example, i) => (
                        <li key={i}>• {example}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-200 mt-8">
              <h4 className="text-lg font-semibold text-indigo-900 mb-4 text-center">💡 The Paradigm Shift</h4>
              <div className="text-center space-y-4">
                <div className="bg-white rounded-lg p-4 border border-indigo-100 max-w-4xl mx-auto">
                  <p className="text-indigo-800 text-sm leading-relaxed">
                    <strong>MCP transforms APIs from technical tools into conversational interfaces.</strong><br/>
                    Instead of learning complex documentation, users simply describe what they want in natural language.
                    The AI understands intent, selects appropriate tools, and orchestrates complex operations seamlessly.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="text-center">
                    <div className="text-2xl mb-2">🗣️</div>
                    <div className="text-sm font-medium text-indigo-900">Natural Language</div>
                    <div className="text-xs text-indigo-700">Human-friendly interaction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">🤖</div>
                    <div className="text-sm font-medium text-indigo-900">AI Translation</div>
                    <div className="text-xs text-indigo-700">Intent to API mapping</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">⚡</div>
                    <div className="text-sm font-medium text-indigo-900">Instant Results</div>
                    <div className="text-xs text-indigo-700">Real-time execution</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'architecture',
      title: 'Architecture',
      icon: CubeTransparentIcon,
      content: (
        <div className="space-y-8">
          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Coinbase MCP Architecture</h3>
            
            <div className="mb-8">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4 text-center">Complete MCP Architecture with LLM Integration</h4>
                <div className="bg-white rounded-lg p-4 border border-gray-300">
                  <MermaidDiagram 
                    id="architecture-diagram"
                    height="700px"
                    chart={`
                      graph TB
                        subgraph USER ["👤 USER LAYER"]
                          U1["Natural Language Input<br/>'What's Bitcoin price?'"]
                          U3["Intelligent Responses<br/>Context-aware & formatted"]
                        end
                        
                        subgraph SECURITY ["🛡️ SECURITY LAYER"]
                          S1["Rate Limiter<br/>3 req/min"]
                          S2["Topic Guardrails<br/>Crypto/MCP only"]
                          S3["Content Filter<br/>Educational focus"]
                        end
                        
                        subgraph LLM ["🧠 LLM LAYER"]
                          L1["Claude Sonnet<br/>(Cursor IDE)"]
                          L2["GPT-4/OpenAI<br/>(Web Portal)"]
                          L3["Function Calling<br/>Intelligence"]
                          L4["Natural Language<br/>Understanding"]
                        end
                        
                        subgraph MCP ["⚙️ MCP SERVER"]
                          M1["Tool Registry<br/>8 Coinbase Tools"]
                          M2["Price Tools<br/>spot, historical, rates"]
                          M3["Market Tools<br/>stats, popular pairs"]
                          M4["Analysis Tools<br/>technical analysis"]
                        end
                        
                        subgraph API ["🌐 COINBASE API"]
                          C1["Spot Prices<br/>/exchange-rates"]
                          C2["Historical Data<br/>/products/{id}/candles"]
                          C3["Market Stats<br/>/products/{id}/stats"]
                          C4["Asset Details<br/>/currencies"]
                        end
                        
                        subgraph WEB ["💻 WEB INTERFACE"]
                          W1["React Chat<br/>Interface"]
                          W2["Pattern Matching<br/>Basic Mode"]
                        end
                        
                        %% Security flow
                        U1 --> S1
                        S1 --> S2
                        S2 --> S3
                        
                        %% Main flow after security
                        S3 --> L1
                        S3 --> L2
                        L1 <--> L3
                        L2 <--> L3
                        L3 <--> L4
                        L3 <--> M1
                        L4 <--> M1
                        
                        %% MCP to tools
                        M1 --> M2
                        M1 --> M3
                        M1 --> M4
                        
                        %% Tools to API
                        M2 <--> C1
                        M2 <--> C2
                        M3 <--> C3
                        M4 <--> C2
                        M2 <--> C4
                        
                        %% Alternative web path (also secured)
                        W1 --> S1
                        W2 --> S1
                        
                        %% Response path
                        L1 --> U3
                        L2 --> U3
                        
                        %% Security bypass for blocked content
                        S1 -.->|Rate Limited| U3
                        S2 -.->|Off Topic| U3
                        
                        %% Styling
                        classDef userClass fill:#dbeafe,stroke:#3b82f6,stroke-width:3px
                        classDef securityClass fill:#fff3e0,stroke:#f57c00,stroke-width:3px
                        classDef llmClass fill:#f3e8ff,stroke:#8b5cf6,stroke-width:3px
                        classDef mcpClass fill:#ecfdf5,stroke:#10b981,stroke-width:3px
                        classDef apiClass fill:#fef3c7,stroke:#f59e0b,stroke-width:3px
                        classDef webClass fill:#fce7f3,stroke:#ec4899,stroke-width:3px
                        
                        class U1,U3 userClass
                        class S1,S2,S3 securityClass
                        class L1,L2,L3,L4 llmClass
                        class M1,M2,M3,M4 mcpClass
                        class C1,C2,C3,C4 apiClass
                        class W1,W2 webClass
                    `}
                  />
                </div>
                <div className="mt-4 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                      <h5 className="font-semibold text-orange-900 mb-2">🛡️ Security Layer</h5>
                      <ul className="text-sm text-orange-800 space-y-1">
                        <li>• <strong>Rate Limiting:</strong> 3 requests/minute</li>
                        <li>• <strong>Topic Control:</strong> Crypto/MCP focus</li>
                        <li>• <strong>Educational:</strong> Responsible AI usage</li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h5 className="font-semibold text-blue-900 mb-2">🧠 LLM Integration</h5>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• <strong>Cursor IDE:</strong> Claude Sonnet (local)</li>
                        <li>• <strong>Web Portal:</strong> OpenAI GPT-4 (API)</li>
                        <li>• <strong>Function:</strong> Natural language → API calls</li>
                      </ul>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <h5 className="font-semibold text-green-900 mb-2">🚀 Enhancement Benefits</h5>
                      <ul className="text-sm text-green-800 space-y-1">
                        <li>• <strong>Human-friendly:</strong> No API knowledge needed</li>
                        <li>• <strong>Intelligent:</strong> Context-aware responses</li>
                        <li>• <strong>Multi-tool:</strong> Complex query orchestration</li>
                      </ul>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      <strong>Core Innovation:</strong> Transform complex APIs into secure, conversational interfaces accessible to anyone
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-3">MCP Client (Cursor IDE)</h4>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li>• Integrates with Cursor IDE</li>
                    <li>• Manages MCP server connections</li>
                    <li>• Handles tool discovery and execution</li>
                    <li>• Provides AI assistant interface</li>
                  </ul>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-3">MCP Server</h4>
                  <ul className="space-y-2 text-sm text-purple-800">
                    <li>• Implements MCP protocol</li>
                    <li>• Exposes 8 Coinbase tools</li>
                    <li>• Handles authentication</li>
                    <li>• Manages rate limiting</li>
                  </ul>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-3">Coinbase API</h4>
                  <ul className="space-y-2 text-sm text-green-800">
                    <li>• Real-time cryptocurrency data</li>
                    <li>• Historical price information</li>
                    <li>• Market statistics and trends</li>
                    <li>• Asset details and metadata</li>
                  </ul>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
                  <h4 className="font-semibold text-orange-900 mb-3">Web Frontend</h4>
                  <ul className="space-y-2 text-sm text-orange-800">
                    <li>• React-based user interface</li>
                    <li>• Real-time data visualization</li>
                    <li>• Interactive chat interface</li>
                    <li>• API testing and exploration</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'implementation',
      title: 'Implementation',
      icon: CodeBracketIcon,
      content: (
        <div className="space-y-8">
          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">MCP Server Implementation</h3>
            
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <CodeBracketIcon className="h-5 w-5 mr-2" />
                  Server Structure
                </h4>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`// mcp-server/src/index.ts
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { CoinbaseClient } from './coinbase-client.js';

class CoinbaseMCPServer {
  private server: Server;
  private coinbaseClient: CoinbaseClient;

  constructor() {
    this.server = new Server(
      { name: 'coinbase-mcp', version: '1.0.0' },
      { capabilities: { tools: {} } }
    );
    this.coinbaseClient = new CoinbaseClient();
    this.setupTools();
  }

  private setupTools() {
    // Register 8 Coinbase tools
    this.server.setRequestHandler(CallToolRequestSchema, 
      async (request) => this.handleToolCall(request)
    );
  }
}`}
                </pre>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Tool Registration</h4>
                <pre className="bg-gray-900 text-blue-400 p-4 rounded-lg overflow-x-auto text-sm">
{`// Tool definitions with schemas
const tools = [
  {
    name: 'get_spot_price',
    description: 'Get current spot price for a cryptocurrency pair',
    inputSchema: {
      type: 'object',
      properties: {
        currencyPair: {
          type: 'string',
          description: 'Currency pair (e.g., BTC-USD)'
        }
      },
      required: ['currencyPair']
    }
  },
  {
    name: 'get_historical_prices',
    description: 'Get historical price data',
    inputSchema: {
      type: 'object',
      properties: {
        currencyPair: { type: 'string' },
        start: { type: 'string' },
        end: { type: 'string' },
        period: { type: 'string', enum: ['hour', 'day'] }
      }
    }
  }
  // ... 6 more tools
];`}
                </pre>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Coinbase Client Integration</h4>
                <pre className="bg-gray-900 text-yellow-400 p-4 rounded-lg overflow-x-auto text-sm">
{`// coinbase-client.ts
export class CoinbaseClient {
  private baseUrl = 'https://api.coinbase.com/v2';

  async getSpotPrice(currencyPair: string): Promise<SpotPriceResponse> {
    const response = await fetch(
      \`\${this.baseUrl}/exchange-rates?currency=\${currencyPair.split('-')[0]}\`
    );
    
    if (!response.ok) {
      throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
    }
    
    return response.json();
  }

  async getHistoricalPrices(params: HistoricalPricesParams) {
    // Implementation with proper error handling
    // Rate limiting and caching logic
  }
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'security',
      title: 'Security',
      icon: ShieldCheckIcon,
      content: (
        <div className="space-y-8">
          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Production-Ready Security Features</h3>
            
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200 mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <ShieldCheckIcon className="h-6 w-6 text-amber-600" />
                <h4 className="text-xl font-semibold text-amber-900">Educational Deployment Features</h4>
              </div>
              <p className="text-amber-800 leading-relaxed">
                This implementation includes production-ready security features designed for educational use and responsible AI deployment. 
                These features protect API quotas, ensure focused conversations, and demonstrate best practices for AI application security.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Rate Limiting */}
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <ClockIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-blue-900">Rate Limiting</h4>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <h5 className="font-semibold text-blue-800 mb-2">📊 Configuration</h5>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• <strong>Limit:</strong> 3 requests per minute per user</li>
                      <li>• <strong>Window:</strong> 60-second rolling window</li>
                      <li>• <strong>Storage:</strong> Client-side localStorage</li>
                      <li>• <strong>Reset:</strong> Automatic after window expires</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-100 rounded-lg p-4 border border-blue-200">
                    <h5 className="font-semibold text-blue-800 mb-2">🎯 Benefits</h5>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Protects OpenAI API quota and costs</li>
                      <li>• Prevents abuse in educational demos</li>
                      <li>• Encourages thoughtful, comprehensive queries</li>
                      <li>• Maintains service availability for all users</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-lg p-3 border border-blue-100">
                    <h6 className="font-semibold text-blue-800 text-sm mb-2">💡 UI Indicators</h6>
                    <div className="flex items-center space-x-2 text-xs">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-green-700">3+ requests</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        <span className="text-yellow-700">1 request</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        <span className="text-red-700">0 requests</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Conversation Guardrails */}
              <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <ExclamationTriangleIcon className="h-5 w-5 text-purple-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-purple-900">Conversation Guardrails</h4>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-purple-100">
                    <h5 className="font-semibold text-purple-800 mb-2">✅ Allowed Topics</h5>
                    <div className="flex flex-wrap gap-1 text-xs">
                      {['cryptocurrency', 'bitcoin', 'ethereum', 'blockchain', 'trading', 'price', 'market', 'analysis', 'mcp', 'coinbase'].map(topic => (
                        <span key={topic} className="bg-green-100 text-green-700 px-2 py-1 rounded">{topic}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-purple-100 rounded-lg p-4 border border-purple-200">
                    <h5 className="font-semibold text-purple-800 mb-2">❌ Blocked Topics</h5>
                    <div className="flex flex-wrap gap-1 text-xs">
                      {['pets', 'weather', 'food', 'movies', 'sports', 'politics', 'health', 'travel'].map(topic => (
                        <span key={topic} className="bg-red-100 text-red-700 px-2 py-1 rounded">{topic}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-3 border border-purple-100">
                    <h6 className="font-semibold text-purple-800 text-sm mb-2">🤖 AI Behavior</h6>
                    <p className="text-xs text-purple-700 leading-relaxed">
                      When users ask off-topic questions, the AI politely redirects them back to cryptocurrency 
                      and MCP-related topics, maintaining focus and educational value.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Architecture Diagram */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-8">
              <h4 className="font-semibold text-gray-900 mb-4 text-center">🔒 Security & Control Flow</h4>
              <div className="bg-white rounded-lg p-4 border border-gray-300">
                <MermaidDiagram 
                  id="security-diagram"
                  height="600px"
                  chart={`
                    graph TD
                      subgraph USER ["👤 USER INPUT"]
                        U1["User Query:<br/>'What's Bitcoin price?'"]
                        U2["Off-topic Query:<br/>'Tell me about cats'"]
                      end
                      
                      subgraph GUARDS ["🛡️ SECURITY LAYER"]
                        RL["⏰ Rate Limiter<br/>3 req/min"]
                        TG["🎯 Topic Guardrails<br/>Crypto/MCP only"]
                      end
                      
                      subgraph DECISIONS ["🤔 DECISION POINTS"]
                        RLD{"Rate Limit<br/>Exceeded?"}
                        TGD{"Topic<br/>Allowed?"}
                      end
                      
                      subgraph RESPONSES ["💬 RESPONSE TYPES"]
                        RLR["🚫 Rate Limit Message<br/>'Please wait 1 minute'"]
                        TGR["🎯 Redirect Message<br/>'Let's talk crypto!'"]
                        AIR["🤖 AI Processing<br/>→ MCP Tools"]
                      end
                      
                      subgraph TOOLS ["⚙️ MCP TOOLS"]
                        T1["get_spot_price"]
                        T2["get_market_stats"]
                        T3["analyze_price_data"]
                        TX["+ 5 more tools"]
                      end
                      
                      subgraph API ["🌐 COINBASE API"]
                        CB["Real-time Data"]
                      end
                      
                      U1 --> RL
                      U2 --> RL
                      RL --> RLD
                      
                      RLD -->|Yes| RLR
                      RLD -->|No| TG
                      
                      TG --> TGD
                      TGD -->|No| TGR
                      TGD -->|Yes| AIR
                      
                      AIR --> T1
                      AIR --> T2
                      AIR --> T3
                      AIR --> TX
                      
                      T1 --> CB
                      T2 --> CB
                      T3 --> CB
                      TX --> CB
                      
                      classDef userClass fill:#e0f2fe,stroke:#0277bd,stroke-width:2px
                      classDef guardClass fill:#fff3e0,stroke:#f57c00,stroke-width:3px
                      classDef decisionClass fill:#fce4ec,stroke:#c2185b,stroke-width:2px
                      classDef responseClass fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
                      classDef toolClass fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
                      classDef apiClass fill:#e1f5fe,stroke:#0288d1,stroke-width:2px
                      
                      class U1,U2 userClass
                      class RL,TG guardClass
                      class RLD,TGD decisionClass
                      class RLR,TGR,AIR responseClass
                      class T1,T2,T3,TX toolClass
                      class CB apiClass
                  `}
                />
              </div>
            </div>

            {/* Implementation Details */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <CodeBracketIcon className="h-5 w-5 mr-2" />
                  Rate Limiting Implementation
                </h4>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`// Rate limiting configuration
const RATE_LIMIT_MAX_REQUESTS = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute

// Check rate limit before processing
private checkRateLimit(): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const stored = localStorage.getItem('crypto_chat_rate_limit');
  let rateLimitData = stored ? JSON.parse(stored) : { requests: 0, windowStart: now };
  
  // Reset if window expired
  if (now - rateLimitData.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitData = { requests: 0, windowStart: now };
  }
  
  const remaining = Math.max(0, RATE_LIMIT_MAX_REQUESTS - rateLimitData.requests);
  return { allowed: rateLimitData.requests < RATE_LIMIT_MAX_REQUESTS, remaining };
}`}
                </pre>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Topic Guardrails Implementation</h4>
                <pre className="bg-gray-900 text-blue-400 p-4 rounded-lg overflow-x-auto text-sm">
{`// Topic filtering configuration
const ALLOWED_TOPICS = [
  'cryptocurrency', 'crypto', 'bitcoin', 'ethereum', 'blockchain', 
  'trading', 'price', 'market', 'analysis', 'mcp', 'coinbase'
];

const OFF_TOPIC_KEYWORDS = [
  'cat', 'dog', 'animal', 'weather', 'food', 'movie', 'music'
];

// Smart topic detection
private isTopicAllowed(userMessage: string): boolean {
  const lowerMessage = userMessage.toLowerCase();
  
  const hasOffTopicKeywords = OFF_TOPIC_KEYWORDS.some(keyword => 
    lowerMessage.includes(keyword)
  );
  
  const hasAllowedTopics = ALLOWED_TOPICS.some(topic => 
    lowerMessage.includes(topic)
  );
  
  // Allow general queries if no off-topic keywords
  const isGeneralQuery = lowerMessage.length < 20 || 
    ['hello', 'hi', 'help', 'what', 'how'].some(word => 
      lowerMessage.includes(word)
    );
  
  return hasAllowedTopics || (isGeneralQuery && !hasOffTopicKeywords);
}`}
                </pre>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">System Prompt Enhancement</h4>
                <pre className="bg-gray-900 text-yellow-400 p-4 rounded-lg overflow-x-auto text-sm">
{`// Enhanced AI system prompt with guardrails
const systemPrompt = \`You are a specialized cryptocurrency assistant powered by MCP.

IMPORTANT CONVERSATION GUIDELINES:
- You ONLY discuss cryptocurrency, blockchain, trading, and MCP-related topics
- If users ask about unrelated topics, politely redirect them back to crypto
- Your expertise is strictly limited to cryptocurrency markets and MCP technology
- Always encourage users to explore cryptocurrency questions

If someone asks about non-cryptocurrency topics, respond with:
"I'm specialized in cryptocurrency and MCP technology. Let me help you with 
crypto prices, market analysis, or trading insights instead!"\`;`}
                </pre>
              </div>
            </div>

            {/* Production Recommendations */}
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-200">
              <h4 className="text-lg font-semibold text-indigo-900 mb-4">🚀 Production Deployment Recommendations</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h5 className="font-semibold text-indigo-800">Server-Side Enhancements</h5>
                  <ul className="text-sm text-indigo-700 space-y-1">
                    <li>• Move rate limiting to backend with Redis</li>
                    <li>• Implement user authentication and sessions</li>
                    <li>• Add request logging and monitoring</li>
                    <li>• Use environment-based configuration</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h5 className="font-semibold text-indigo-800">Advanced Security</h5>
                  <ul className="text-sm text-indigo-700 space-y-1">
                    <li>• ML-based content filtering</li>
                    <li>• IP-based rate limiting</li>
                    <li>• API key rotation and management</li>
                    <li>• Comprehensive audit trails</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'tools',
      title: 'Available Tools',
      icon: CogIcon,
      content: (
        <div className="space-y-8">
          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">8 Coinbase MCP Tools</h3>
            
            <div className="mb-8">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4 text-center">MCP Tools Ecosystem</h4>
                <div className="bg-white rounded-lg p-4 border border-gray-300">
                  <MermaidDiagram 
                    id="tools-diagram"
                    height="550px"
                    chart={`
                      graph TD
                        subgraph REGISTRY ["🎯 MCP TOOL REGISTRY"]
                          TR["Tool Registry<br/>8 Coinbase Tools"]
                        end
                        
                        subgraph PRICE ["💰 PRICE TOOLS"]
                          T1["get_spot_price<br/>Real-time prices"]
                          T2["get_historical_prices<br/>Time series data"]
                          T3["get_exchange_rates<br/>Currency conversions"]
                        end
                        
                        subgraph MARKET ["📊 MARKET TOOLS"]
                          T4["get_market_stats<br/>24h statistics"]
                          T5["get_popular_pairs<br/>Trading pairs"]
                        end
                        
                        subgraph ASSET ["🔍 ASSET TOOLS"]
                          T6["search_assets<br/>Asset discovery"]
                          T7["get_asset_details<br/>Detailed info"]
                        end
                        
                        subgraph ANALYSIS ["📈 ANALYSIS TOOLS"]
                          T8["analyze_price_data<br/>Technical analysis"]
                        end
                        
                        subgraph ENDPOINTS ["🌐 COINBASE ENDPOINTS"]
                          E1["/exchange-rates"]
                          E2["/products/candles"]
                          E3["/currencies"]
                          E4["/products/stats"]
                          E5["/products"]
                          E6["/currencies/details"]
                        end
                        
                        TR --> T1
                        TR --> T2
                        TR --> T3
                        TR --> T4
                        TR --> T5
                        TR --> T6
                        TR --> T7
                        TR --> T8
                        
                        T1 --> E1
                        T2 --> E2
                        T3 --> E1
                        T4 --> E4
                        T5 --> E5
                        T6 --> E3
                        T7 --> E6
                        T8 --> E2
                        
                        classDef registryClass fill:#f3e8ff,stroke:#8b5cf6,stroke-width:3px
                        classDef priceClass fill:#dbeafe,stroke:#3b82f6,stroke-width:2px
                        classDef marketClass fill:#ecfdf5,stroke:#10b981,stroke-width:2px
                        classDef assetClass fill:#fef3c7,stroke:#f59e0b,stroke-width:2px
                        classDef analysisClass fill:#fce7f3,stroke:#ec4899,stroke-width:2px
                        classDef endpointClass fill:#f1f5f9,stroke:#64748b,stroke-width:2px
                        
                        class TR registryClass
                        class T1,T2,T3 priceClass
                        class T4,T5 marketClass
                        class T6,T7 assetClass
                        class T8 analysisClass
                        class E1,E2,E3,E4,E5,E6 endpointClass
                    `}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[
                {
                  name: 'get_spot_price',
                  description: 'Get current cryptocurrency spot price',
                  params: 'currencyPair: string',
                  example: 'BTC-USD → $100,608.65',
                  color: 'blue'
                },
                {
                  name: 'get_historical_prices',
                  description: 'Retrieve historical price data with time periods',
                  params: 'currencyPair, start, end, period',
                  example: 'ETH-USD 7 days → Price chart',
                  color: 'green'
                },
                {
                  name: 'get_exchange_rates',
                  description: 'Get exchange rates for base currency',
                  params: 'currency: string',
                  example: 'USD → All crypto rates',
                  color: 'purple'
                },
                {
                  name: 'search_assets',
                  description: 'Search for cryptocurrency and fiat assets',
                  params: 'query: string, limit?: number',
                  example: 'bitcoin → Asset list',
                  color: 'orange'
                },
                {
                  name: 'get_asset_details',
                  description: 'Get detailed information about specific asset',
                  params: 'assetId: string',
                  example: 'BTC → Full Bitcoin info',
                  color: 'cyan'
                },
                {
                  name: 'get_market_stats',
                  description: 'Get 24-hour market statistics',
                  params: 'currencyPair: string',
                  example: 'BTC-USD → Volume, high, low',
                  color: 'pink'
                },
                {
                  name: 'get_popular_pairs',
                  description: 'Get list of popular trading pairs',
                  params: 'None required',
                  example: '→ BTC-USD, ETH-USD, etc.',
                  color: 'indigo'
                },
                {
                  name: 'analyze_price_data',
                  description: 'Perform technical analysis on price data',
                  params: 'currencyPair, period, metrics[]',
                  example: 'BTC 30d volatility → Analysis',
                  color: 'teal'
                }
              ].map((tool, index) => (
                <div key={index} className={`bg-${tool.color}-50 rounded-lg p-6 border border-${tool.color}-200`}>
                  <div className="flex items-start justify-between mb-3">
                    <h4 className={`font-mono text-sm font-semibold text-${tool.color}-900`}>
                      {tool.name}
                    </h4>
                    <span className={`px-2 py-1 bg-${tool.color}-100 text-${tool.color}-800 text-xs rounded-full`}>
                      Tool #{index + 1}
                    </span>
                  </div>
                  <p className={`text-sm text-${tool.color}-800 mb-3`}>{tool.description}</p>
                  <div className="space-y-2">
                    <div>
                      <span className={`text-xs font-medium text-${tool.color}-700`}>Parameters:</span>
                      <code className={`ml-2 text-xs bg-${tool.color}-100 px-2 py-1 rounded`}>
                        {tool.params}
                      </code>
                    </div>
                    <div>
                      <span className={`text-xs font-medium text-${tool.color}-700`}>Example:</span>
                      <span className={`ml-2 text-xs text-${tool.color}-600`}>{tool.example}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'cursor-setup',
      title: 'Cursor MCP Setup',
      icon: CommandLineIcon,
      content: (
        <div className="space-y-8">
          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Setting Up MCP in Cursor IDE</h3>
            
            <div className="space-y-8">
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-4 flex items-center">
                  <DocumentTextIcon className="h-5 w-5 mr-2" />
                  Step 1: MCP Configuration File
                </h4>
                <p className="text-blue-800 mb-4">Create or update your Cursor MCP configuration file:</p>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`// ~/.cursor/mcp_servers.json (macOS/Linux)
// %APPDATA%\\Cursor\\User\\mcp_servers.json (Windows)
{
  "mcpServers": {
    "coinbase-mcp": {
      "command": "node",
      "args": [
        "/path/to/coinbase-chat-mcp/mcp-server/build/index.js"
      ],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}`}
                </pre>
              </div>

              <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <h4 className="font-semibold text-green-900 mb-4">Step 2: Build MCP Server</h4>
                <pre className="bg-gray-900 text-yellow-400 p-4 rounded-lg overflow-x-auto text-sm">
{`# Navigate to MCP server directory
cd mcp-server

# Install dependencies
npm install

# Build TypeScript to JavaScript
npm run build

# Test the server
npm run test`}
                </pre>
              </div>

              <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                <h4 className="font-semibold text-purple-900 mb-4">Step 3: Cursor Global Configuration</h4>
                <p className="text-purple-800 mb-4">Alternative: Use the global configuration file in your project:</p>
                <pre className="bg-gray-900 text-cyan-400 p-4 rounded-lg overflow-x-auto text-sm">
{`// cursor-global-mcp.json (in project root)
{
  "mcpServers": {
    "coinbase-mcp": {
      "command": "node",
      "args": ["./mcp-server/build/index.js"],
      "env": {}
    }
  }
}`}
                </pre>
              </div>

              <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
                <h4 className="font-semibold text-orange-900 mb-4">Step 4: Restart Cursor & Verify</h4>
                <ol className="list-decimal list-inside space-y-2 text-orange-800">
                  <li>Restart Cursor IDE completely</li>
                  <li>Open the MCP Inspector (Cmd/Ctrl + Shift + P → "MCP Inspector")</li>
                  <li>Verify "coinbase-mcp" server is connected</li>
                  <li>Check that 8 tools are available</li>
                  <li>Test with: "What's the current Bitcoin price?"</li>
                </ol>
              </div>

              <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                <h4 className="font-semibold text-red-900 mb-4">Troubleshooting</h4>
                <div className="space-y-3 text-red-800">
                  <div>
                    <strong>Server not connecting:</strong>
                    <ul className="list-disc list-inside ml-4 mt-1 text-sm">
                      <li>Check file paths in configuration</li>
                      <li>Ensure MCP server is built (<code>npm run build</code>)</li>
                      <li>Verify Node.js is installed and accessible</li>
                    </ul>
                  </div>
                  <div>
                    <strong>Tools not working:</strong>
                    <ul className="list-disc list-inside ml-4 mt-1 text-sm">
                      <li>Check Coinbase API connectivity</li>
                      <li>Verify tool schemas in MCP Inspector</li>
                      <li>Check server logs for errors</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'demo',
      title: 'Demo & Examples',
      icon: PlayIcon,
      content: (
        <div className="space-y-8">
          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Interactive Demo Examples</h3>
            
            <div className="space-y-8">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-6 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-4 flex items-center">
                  <PlayIcon className="h-5 w-5 mr-2" />
                  Basic Price Query Demo
                </h4>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <div className="text-sm text-gray-600 mb-2">User Query:</div>
                    <div className="font-mono text-blue-800">"What's the current Bitcoin price?"</div>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <ChevronRightIcon className="h-4 w-4 mr-2" />
                    <span className="text-sm">MCP processes query → Calls get_spot_price tool</span>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="text-sm text-gray-600 mb-2">AI Response:</div>
                    <div className="text-green-800">
                      "The current Bitcoin (BTC) price is <strong>$100,608.65 USD</strong>. 
                      This data is sourced directly from Coinbase's real-time API."
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
                <h4 className="font-semibold text-purple-900 mb-4">Advanced Analysis Demo</h4>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-purple-100">
                    <div className="text-sm text-gray-600 mb-2">User Query:</div>
                    <div className="font-mono text-purple-800">"Analyze Bitcoin volatility over the past 30 days"</div>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <ChevronRightIcon className="h-4 w-4 mr-2" />
                    <span className="text-sm">MCP calls analyze_price_data tool with volatility metrics</span>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="text-sm text-gray-600 mb-2">AI Response:</div>
                    <div className="text-green-800 space-y-2">
                      <div>"Bitcoin volatility analysis for the past 30 days:</div>
                      <ul className="list-disc list-inside ml-4 text-sm">
                        <li><strong>Volatility:</strong> 3.2% (Moderate)</li>
                        <li><strong>Price Range:</strong> $89,420 - $104,250</li>
                        <li><strong>Trend:</strong> Upward (+12.4%)</li>
                        <li><strong>Support Level:</strong> $95,000</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                <h4 className="font-semibold text-green-900 mb-4">Multi-Tool Chain Demo</h4>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-green-100">
                    <div className="text-sm text-gray-600 mb-2">User Query:</div>
                    <div className="font-mono text-green-800">"Compare Bitcoin and Ethereum prices and show popular trading pairs"</div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <ChevronRightIcon className="h-4 w-4 mr-2" />
                      <span>1. get_spot_price("BTC-USD")</span>
                    </div>
                    <div className="flex items-center">
                      <ChevronRightIcon className="h-4 w-4 mr-2" />
                      <span>2. get_spot_price("ETH-USD")</span>
                    </div>
                    <div className="flex items-center">
                      <ChevronRightIcon className="h-4 w-4 mr-2" />
                      <span>3. get_popular_pairs()</span>
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="text-sm text-gray-600 mb-2">Comprehensive Response:</div>
                    <div className="text-green-800 text-sm space-y-2">
                      <div><strong>Price Comparison:</strong></div>
                      <div>• Bitcoin (BTC): $100,608.65 USD</div>
                      <div>• Ethereum (ETH): $3,847.23 USD</div>
                      <div className="mt-3"><strong>Popular Trading Pairs:</strong></div>
                      <div>• BTC-USD, ETH-USD, ADA-USD, SOL-USD...</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-6 border border-indigo-200">
                <h4 className="font-semibold text-indigo-900 mb-4">MCP Protocol Flow</h4>
                <div className="bg-white rounded-lg p-4 border border-indigo-100">
                  <MermaidDiagram 
                    id="sequence-diagram"
                    height="700px"
                    chart={`
                      sequenceDiagram
                        participant User as 👤 User
                        participant Cursor as 🖥️ Cursor IDE<br/>(Claude Sonnet)
                        participant MCP as ⚙️ MCP Server
                        participant API as 🌐 Coinbase API
                        
                        Note over User,API: Natural Language to API Translation
                        
                        User->>Cursor: "What's Bitcoin price?"
                        Note right of User: Natural language query
                        
                        Cursor->>MCP: Tool discovery request
                        MCP-->>Cursor: Available tools list (8 tools)
                        Note right of MCP: get_spot_price, get_market_stats,<br/>get_historical_prices, etc.
                        
                        Cursor->>MCP: Call get_spot_price("BTC-USD")
                        Note right of Cursor: AI selects appropriate tool<br/>and extracts parameters
                        
                        MCP->>API: HTTP GET /exchange-rates?currency=BTC
                        Note right of MCP: Standard REST API call
                        
                        API-->>MCP: {"data": {"amount": "100608.65", "currency": "USD"}}
                        Note right of API: Real-time price data
                        
                        MCP-->>Cursor: Formatted tool result
                        Note right of MCP: Structured response with metadata
                        
                        Cursor-->>User: "The current Bitcoin price is $100,608.65 USD"
                        Note right of Cursor: Human-friendly response<br/>with context and formatting
                        
                        Note over User,API: Timeline: ~200-500ms | Rate Limit: 10,000 req/hour
                        
                        rect rgb(240, 248, 255)
                          Note over Cursor,MCP: MCP Protocol (stdio)
                        end
                        
                        rect rgb(254, 249, 195)
                          Note over MCP,API: HTTP/JSON REST API
                        end
                    `}
                  />
                </div>
                {/* <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <h6 className="font-semibold text-blue-900 text-sm mb-1">⚡ Performance</h6>
                    <p className="text-xs text-blue-800">200-500ms response time</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                    <h6 className="font-semibold text-green-900 text-sm mb-1">🔄 Rate Limits</h6>
                    <p className="text-xs text-green-800">10,000 requests/hour</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                    <h6 className="font-semibold text-purple-900 text-sm mb-1">🔗 Protocols</h6>
                    <p className="text-xs text-purple-800">MCP (stdio) + HTTP/JSON</p>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'api-transformation',
      title: 'AI Agents & API Future',
      icon: CogIcon,
      content: (
        <div className="space-y-8">
          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">How AI Agents and MCP Will Redefine API Management, Use, and Business</h3>
            
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200 mb-8">
              <h4 className="text-xl font-semibold text-emerald-900 mb-4">🌟 The API Revolution: From Code to Conversation</h4>
              <p className="text-emerald-800 leading-relaxed mb-4">
                We're witnessing a fundamental shift in how humans interact with digital systems. Traditional APIs required 
                technical expertise and complex integration work. With AI agents and MCP, APIs become conversational 
                interfaces that anyone can use through natural language.
              </p>
              
              <div className="bg-white rounded-lg p-4 border border-emerald-100">
                <h5 className="font-semibold text-emerald-900 mb-3">🎯 Key Transformation Areas</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-emerald-800">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      <span><strong>Accessibility:</strong> Non-technical users can now leverage complex APIs</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-emerald-800">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      <span><strong>Speed:</strong> Instant API interactions without integration time</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-emerald-800">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      <span><strong>Intelligence:</strong> Context-aware API orchestration</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-emerald-800">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      <span><strong>Cost Efficiency:</strong> Reduced development and maintenance overhead</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-emerald-800">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      <span><strong>Innovation:</strong> Focus on business logic, not API plumbing</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-emerald-800">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      <span><strong>Scalability:</strong> AI handles complexity at scale</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <h4 className="text-lg font-semibold text-blue-900 mb-4">📈 Business Impact Transformation</h4>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <h5 className="font-semibold text-blue-900 mb-2">💼 For Enterprise Leaders</h5>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• <strong>Faster Time-to-Market:</strong> Weeks instead of months for API integrations</li>
                      <li>• <strong>Reduced Technical Debt:</strong> Less custom integration code to maintain</li>
                      <li>• <strong>Democratized Innovation:</strong> Business users can prototype with APIs directly</li>
                      <li>• <strong>Cost Optimization:</strong> Eliminate redundant API development work</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-100 rounded-lg p-4 border border-blue-200">
                    <h5 className="font-semibold text-blue-900 mb-2">🏢 For IT Departments</h5>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• <strong>Strategic Focus:</strong> Less time on integration, more on core systems</li>
                      <li>• <strong>Standardization:</strong> MCP provides consistent API interaction patterns</li>
                      <li>• <strong>Security Enhancement:</strong> Centralized access controls and monitoring</li>
                      <li>• <strong>Resource Efficiency:</strong> One MCP server serves multiple use cases</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                <h4 className="text-lg font-semibold text-purple-900 mb-4">🔄 API Management Evolution</h4>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-purple-100">
                    <h5 className="font-semibold text-purple-900 mb-2">📊 Traditional API Management</h5>
                    <ul className="text-sm text-purple-800 space-y-1">
                      <li>• Manual documentation and SDK creation</li>
                      <li>• Developer onboarding and training required</li>
                      <li>• Rate limiting and monitoring per API</li>
                      <li>• Complex authentication and authorization</li>
                    </ul>
                  </div>
                  
                  <div className="bg-purple-100 rounded-lg p-4 border border-purple-200">
                    <h5 className="font-semibold text-purple-900 mb-2">🤖 AI-Powered API Management</h5>
                    <ul className="text-sm text-purple-800 space-y-1">
                      <li>• Self-documenting through MCP schema</li>
                      <li>• Natural language interface - no training needed</li>
                      <li>• Intelligent rate limiting based on context</li>
                      <li>• AI handles authentication flows automatically</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200 mb-8">
              <h4 className="text-xl font-semibold text-orange-900 mb-6 text-center">🌍 Industry-Specific Transformations</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg p-4 border border-orange-100">
                  <h5 className="font-semibold text-orange-900 mb-3">🏦 Financial Services</h5>
                  <div className="space-y-3">
                    <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
                      <h6 className="text-sm font-semibold text-orange-800 mb-1">Current Challenge</h6>
                      <p className="text-xs text-orange-700">Complex trading APIs require extensive documentation and developer expertise</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                      <h6 className="text-sm font-semibold text-green-800 mb-1">MCP Solution</h6>
                      <p className="text-xs text-green-700">"Trade 100 shares of AAPL when it hits $180" - Natural language trading</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                      <h6 className="text-sm font-semibold text-blue-800 mb-1">Business Impact</h6>
                      <ul className="text-xs text-blue-700 space-y-1">
                        <li>• Faster client onboarding</li>
                        <li>• Reduced support requests</li>
                        <li>• Higher API adoption rates</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-orange-100">
                  <h5 className="font-semibold text-orange-900 mb-3">☁️ Cloud Platforms</h5>
                  <div className="space-y-3">
                    <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
                      <h6 className="text-sm font-semibold text-orange-800 mb-1">Current Challenge</h6>
                      <p className="text-xs text-orange-700">DevOps requires deep knowledge of cloud APIs and infrastructure</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                      <h6 className="text-sm font-semibold text-green-800 mb-1">MCP Solution</h6>
                      <p className="text-xs text-green-700">"Scale my database to handle 10x traffic" - Infrastructure as conversation</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                      <h6 className="text-sm font-semibold text-blue-800 mb-1">Business Impact</h6>
                      <ul className="text-xs text-blue-700 space-y-1">
                        <li>• Democratized cloud operations</li>
                        <li>• Reduced learning curve</li>
                        <li>• Faster incident response</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-orange-100">
                  <h5 className="font-semibold text-orange-900 mb-3">🛒 E-commerce</h5>
                  <div className="space-y-3">
                    <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
                      <h6 className="text-sm font-semibold text-orange-800 mb-1">Current Challenge</h6>
                      <p className="text-xs text-orange-700">Merchants need technical teams to integrate payment, inventory, and shipping APIs</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                      <h6 className="text-sm font-semibold text-green-800 mb-1">MCP Solution</h6>
                      <p className="text-xs text-green-700">"Set up automated reordering when inventory drops below 10 units"</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                      <h6 className="text-sm font-semibold text-blue-800 mb-1">Business Impact</h6>
                      <ul className="text-xs text-blue-700 space-y-1">
                        <li>• SMB empowerment</li>
                        <li>• Reduced integration costs</li>
                        <li>• Faster feature deployment</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200 mb-8">
              <h4 className="text-xl font-semibold text-indigo-900 mb-6">🔮 The Future API Ecosystem</h4>
              
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 border border-indigo-100">
                  <h5 className="font-semibold text-indigo-900 mb-4">📊 New Business Models</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h6 className="font-semibold text-indigo-800">🎯 Value-Based Pricing</h6>
                      <p className="text-sm text-indigo-700">APIs priced on business outcomes rather than raw usage metrics</p>
                      <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-100">
                        <p className="text-xs text-indigo-700"><strong>Example:</strong> Pay per successful trade execution, not per API call</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h6 className="font-semibold text-indigo-800">🤝 API Partnerships</h6>
                      <p className="text-sm text-indigo-700">AI agents can discover and negotiate API access automatically</p>
                      <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-100">
                        <p className="text-xs text-indigo-700"><strong>Example:</strong> Auto-negotiate volume discounts based on predicted usage</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 border border-indigo-100">
                  <h5 className="font-semibold text-indigo-900 mb-4">🌐 The API Marketplace Evolution</h5>
                  <div className="space-y-4">
                    <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                      <h6 className="font-semibold text-indigo-800 mb-2">Current State: Developer-Centric</h6>
                      <ul className="text-sm text-indigo-700 space-y-1">
                        <li>• APIs listed with technical specifications</li>
                        <li>• Developers browse and integrate manually</li>
                        <li>• Complex onboarding processes</li>
                        <li>• High technical barriers to entry</li>
                      </ul>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                      <h6 className="font-semibold text-green-800 mb-2">Future State: Business-Centric</h6>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• APIs described by business capabilities</li>
                        <li>• AI agents discover and integrate automatically</li>
                        <li>• Instant trial through natural language</li>
                        <li>• No technical barriers - pure business value focus</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 border border-indigo-100">
                  <h5 className="font-semibold text-indigo-900 mb-4">⚡ Real-Time Adaptation</h5>
                  <p className="text-indigo-700 mb-4">
                    AI agents will continuously optimize API usage patterns, costs, and performance without human intervention.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-100">
                      <h6 className="font-semibold text-indigo-800 text-sm mb-1">🔄 Dynamic Routing</h6>
                      <p className="text-xs text-indigo-700">Switch between API providers based on latency, cost, and reliability</p>
                    </div>
                    <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-100">
                      <h6 className="font-semibold text-indigo-800 text-sm mb-1">📊 Predictive Scaling</h6>
                      <p className="text-xs text-indigo-700">Anticipate usage spikes and adjust rate limits proactively</p>
                    </div>
                    <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-100">
                      <h6 className="font-semibold text-indigo-800 text-sm mb-1">🛡️ Auto-Remediation</h6>
                      <p className="text-xs text-indigo-700">Detect and resolve API issues before they impact end users</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-200">
              <h4 className="text-xl font-semibold text-gray-900 mb-6 text-center">🎯 Strategic Implications for Organizations</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h5 className="font-semibold text-green-700 mb-3">✅ Opportunities to Embrace</h5>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start space-x-3">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span><strong>Competitive Advantage:</strong> First movers gain significant market advantages through faster innovation cycles</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span><strong>Customer Experience:</strong> Enable self-service capabilities that delight users</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span><strong>Cost Reduction:</strong> Eliminate redundant integration work across teams</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span><strong>Innovation Velocity:</strong> Business teams can prototype and deploy faster</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h5 className="font-semibold text-orange-700 mb-3">⚠️ Risks to Mitigate</h5>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start space-x-3">
                        <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span><strong>Security Concerns:</strong> AI agents need robust access controls and monitoring</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span><strong>Dependency Risk:</strong> Over-reliance on AI without understanding underlying systems</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span><strong>Skill Gap:</strong> Teams need training on AI-assisted development patterns</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span><strong>Change Management:</strong> Organizational resistance to new interaction paradigms</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h5 className="font-semibold text-blue-900 mb-3 text-center">🚀 Action Steps for Leaders</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-3 border border-blue-100">
                    <h6 className="font-semibold text-blue-800 text-sm mb-2">1. Start Small</h6>
                    <p className="text-xs text-blue-700">Identify one high-value API use case and implement MCP pilot</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-blue-100">
                    <h6 className="font-semibold text-blue-800 text-sm mb-2">2. Build Capabilities</h6>
                    <p className="text-xs text-blue-700">Train teams on MCP, invest in AI-assisted development tools</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-blue-100">
                    <h6 className="font-semibold text-blue-800 text-sm mb-2">3. Scale Strategically</h6>
                    <p className="text-xs text-blue-700">Expand MCP adoption across business units and customer touchpoints</p>
                  </div>
                </div>
              </div>
            </div>

                         <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl p-6 border border-slate-200 mb-8">
               <h4 className="text-xl font-semibold text-slate-900 mb-6 text-center">🏗️ API Management Infrastructure Transformation</h4>
               
               <div className="space-y-6">
                 <div className="bg-white rounded-lg p-6 border border-slate-100">
                   <h5 className="font-semibold text-slate-900 mb-6">🔄 Traditional vs AI-Enhanced API Management</h5>
                   
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                     <div className="space-y-4">
                       <h6 className="font-semibold text-red-700 mb-3">📊 Traditional API Management Stack</h6>
                       
                       <div className="space-y-3">
                                                   <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                            <div className="font-semibold text-red-800 text-sm mb-2">🚪 API Gateway</div>
                            <ul className="text-xs text-red-700 space-y-1">
                              <li>• Static routing rules</li>
                              <li>• Manual load balancing configuration</li>
                              <li>• Protocol translation per endpoint</li>
                              <li>• Fixed rate limiting policies</li>
                            </ul>
                          </div>
                          
                          <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                            <div className="font-semibold text-red-800 text-sm mb-2">🔒 Security Layer</div>
                            <ul className="text-xs text-red-700 space-y-1">
                              <li>• Static authentication rules</li>
                              <li>• Predefined authorization policies</li>
                              <li>• Manual threat detection</li>
                              <li>• Periodic security audits</li>
                            </ul>
                          </div>
                          
                          <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                            <div className="font-semibold text-red-800 text-sm mb-2">📋 Governance & Compliance</div>
                            <ul className="text-xs text-red-700 space-y-1">
                              <li>• Manual policy enforcement</li>
                              <li>• Scheduled compliance checks</li>
                              <li>• Human-driven lifecycle management</li>
                              <li>• Document-based standards</li>
                            </ul>
                          </div>
                          
                          <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                            <div className="font-semibold text-red-800 text-sm mb-2">📊 Monitoring & Analytics</div>
                            <ul className="text-xs text-red-700 space-y-1">
                              <li>• Dashboard-based monitoring</li>
                              <li>• Reactive alerting</li>
                              <li>• Historical data analysis</li>
                              <li>• Manual report generation</li>
                            </ul>
                          </div>
                       </div>
                     </div>
                     
                     <div className="space-y-4">
                       <h6 className="font-semibold text-green-700 mb-3">🤖 AI-Enhanced API Management Stack</h6>
                       
                       <div className="space-y-3">
                                                   <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                            <div className="font-semibold text-green-800 text-sm mb-2">🧠 AI Gateway</div>
                            <ul className="text-xs text-green-700 space-y-1">
                              <li>• Intelligent traffic routing based on context</li>
                              <li>• Dynamic load balancing with ML prediction</li>
                              <li>• Auto-discovery and protocol adaptation</li>
                              <li>• Adaptive rate limiting per user behavior</li>
                            </ul>
                          </div>
                          
                          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                            <div className="font-semibold text-green-800 text-sm mb-2">🛡️ AI Security</div>
                            <ul className="text-xs text-green-700 space-y-1">
                              <li>• Behavioral authentication patterns</li>
                              <li>• Dynamic authorization based on context</li>
                              <li>• Real-time threat prediction and mitigation</li>
                              <li>• Continuous security posture assessment</li>
                            </ul>
                          </div>
                          
                          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                            <div className="font-semibold text-green-800 text-sm mb-2">⚖️ AI Governance</div>
                            <ul className="text-xs text-green-700 space-y-1">
                              <li>• Automated policy enforcement</li>
                              <li>• Continuous compliance monitoring</li>
                              <li>• Intelligent lifecycle automation</li>
                              <li>• Self-evolving standards</li>
                            </ul>
                          </div>
                          
                          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                            <div className="font-semibold text-green-800 text-sm mb-2">📈 AI Analytics</div>
                            <ul className="text-xs text-green-700 space-y-1">
                              <li>• Predictive performance monitoring</li>
                              <li>• Proactive issue detection</li>
                              <li>• Real-time trend analysis</li>
                              <li>• Automated insights and recommendations</li>
                            </ul>
                          </div>
                       </div>
                     </div>
                   </div>
                 </div>
                 
                 <div className="bg-white rounded-lg p-6 border border-slate-100">
                   <h5 className="font-semibold text-slate-900 mb-6">🚀 New AI-Native Patterns & Frameworks</h5>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-4">
                       <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                         <h6 className="font-semibold text-blue-800 mb-3">🌐 AI Gateway Patterns</h6>
                         <div className="space-y-2">
                                                       <div className="bg-white rounded-lg p-3 border border-blue-50">
                              <div className="font-semibold text-blue-700 text-sm mb-1">Intent-Based Routing</div>
                              <p className="text-xs text-blue-600">Route requests based on semantic understanding rather than URL patterns</p>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-blue-50">
                              <div className="font-semibold text-blue-700 text-sm mb-1">Contextual Load Balancing</div>
                              <p className="text-xs text-blue-600">Consider user context, data locality, and business priority for routing decisions</p>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-blue-50">
                              <div className="font-semibold text-blue-700 text-sm mb-1">Adaptive Circuit Breakers</div>
                              <p className="text-xs text-blue-600">Machine learning-driven failure prediction and recovery strategies</p>
                            </div>
                         </div>
                       </div>
                       
                       <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                         <h6 className="font-semibold text-purple-800 mb-3">🎭 AI Orchestration Patterns</h6>
                         <div className="space-y-2">
                           <div className="bg-white rounded-lg p-3 border border-purple-50">
                             <div className="font-semibold text-purple-700 text-sm mb-1">Intelligent Service Composition</div>
                              <p className="text-xs text-purple-600">AI selects optimal service combinations for complex business workflows</p>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-purple-50">
                              <div className="font-semibold text-purple-700 text-sm mb-1">Adaptive Workflow Optimization</div>
                              <p className="text-xs text-purple-600">Continuously optimize execution paths based on performance and business rules</p>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-purple-50">
                              <div className="font-semibold text-purple-700 text-sm mb-1">Context-Aware Choreography</div>
                              <p className="text-xs text-purple-600">Dynamic service interaction patterns based on runtime context</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                          <h6 className="font-semibold text-orange-800 mb-3">🔐 AI Security Patterns</h6>
                          <div className="space-y-2">
                            <div className="bg-white rounded-lg p-3 border border-orange-50">
                              <div className="font-semibold text-orange-700 text-sm mb-1">Zero Trust AI Authentication</div>
                              <p className="text-xs text-orange-600">Continuous identity verification using behavioral biometrics</p>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-orange-50">
                              <div className="font-semibold text-orange-700 text-sm mb-1">Adaptive Threat Response</div>
                              <p className="text-xs text-orange-600">Real-time threat mitigation with machine learning-powered responses</p>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-orange-50">
                              <div className="font-semibold text-orange-700 text-sm mb-1">Privacy-Preserving Analytics</div>
                              <p className="text-xs text-orange-600">Federated learning and differential privacy for secure insights</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-teal-50 rounded-lg p-4 border border-teal-100">
                          <h6 className="font-semibold text-teal-800 mb-3">📊 AI Governance Patterns</h6>
                          <div className="space-y-2">
                            <div className="bg-white rounded-lg p-3 border border-teal-50">
                              <div className="font-semibold text-teal-700 text-sm mb-1">Automated Policy Synthesis</div>
                              <p className="text-xs text-teal-600">Generate governance policies from business requirements and compliance needs</p>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-teal-50">
                              <div className="font-semibold text-teal-700 text-sm mb-1">Intelligent Compliance Monitoring</div>
                              <p className="text-xs text-teal-600">Continuous compliance assessment with predictive violation detection</p>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-teal-50">
                              <div className="font-semibold text-teal-700 text-sm mb-1">Self-Healing Architecture</div>
                             <p className="text-xs text-teal-600">Automatically detect and resolve governance violations</p>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
                 
                 <div className="bg-white rounded-lg p-6 border border-slate-100">
                   <h5 className="font-semibold text-slate-900 mb-4">🏗️ AI-Native API Architecture Evolution</h5>
                   <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                     <MermaidDiagram 
                       id="ai-api-architecture"
                       height="800px"
                       chart={`
                         graph TB
                           subgraph "AI-Enhanced API Management Platform"
                             subgraph "Intelligence Layer"
                               AI[🧠 AI Engine]
                               ML[📊 ML Models]
                               NLP[💬 NLP Processor]
                               KB[📚 Knowledge Base]
                             end
                             
                             subgraph "AI Gateway Layer"
                               IG[🌐 Intelligent Gateway]
                               IR[🎯 Intent Router]
                               ALB[⚖️ Adaptive Load Balancer]
                               CB[🔄 Smart Circuit Breaker]
                             end
                             
                             subgraph "AI Security Layer"
                               ZT[🛡️ Zero Trust AI]
                               BA[🔍 Behavioral Auth]
                               TR[⚡ Threat Response]
                               PP[🔒 Privacy Preserving]
                             end
                             
                             subgraph "AI Orchestration Layer"
                               SO[🎭 Smart Orchestrator]
                               SC[🔗 Service Composer]
                               WO[⚡ Workflow Optimizer]
                               CH[💃 Context-Aware Choreography]
                             end
                             
                             subgraph "AI Governance Layer"
                               AG[⚖️ AI Governance]
                               PS[📝 Policy Synthesizer]
                               CM[📊 Compliance Monitor]
                               SH[🔧 Self-Healing]
                             end
                             
                             subgraph "AI Analytics Layer"
                               PA[📈 Predictive Analytics]
                               RA[🔍 Real-time Analysis]
                               AI_I[💡 AI Insights]
                               AR[📋 Auto Reports]
                             end
                           end
                           
                           subgraph "Business Applications"
                             APP1[💼 CRM System]
                             APP2[💰 Trading Platform]
                             APP3[🛒 E-commerce]
                             APP4[☁️ Cloud Services]
                           end
                           
                           subgraph "MCP Ecosystem"
                             MCP1[🔗 Coinbase MCP]
                             MCP2[📊 Database MCP]
                             MCP3[🌐 Web MCP]
                             MCP4[☁️ Cloud MCP]
                           end
                           
                           subgraph "Data Sources"
                             DB[(🗄️ Databases)]
                             API[🌐 External APIs]
                             STREAM[📡 Event Streams]
                             FILES[📁 File Systems]
                           end
                           
                           %% Connections
                           AI --> IG
                           AI --> ZT
                           AI --> SO
                           AI --> AG
                           AI --> PA
                           
                           ML --> IR
                           ML --> ALB
                           ML --> BA
                           ML --> WO
                           
                           NLP --> IR
                           NLP --> SC
                           
                           KB --> PS
                           KB --> AI_I
                           
                           IG --> APP1
                           IG --> APP2
                           IG --> APP3
                           IG --> APP4
                           
                           SO --> MCP1
                           SO --> MCP2
                           SO --> MCP3
                           SO --> MCP4
                           
                           MCP1 --> DB
                           MCP2 --> API
                           MCP3 --> STREAM
                           MCP4 --> FILES
                           
                           AG --> CM
                           PA --> RA
                           
                           style AI fill:#e1f5fe
                           style IG fill:#f3e5f5
                           style ZT fill:#fff3e0
                           style SO fill:#e8f5e8
                           style AG fill:#fce4ec
                           style PA fill:#f1f8e9
                       `}
                     />
                   </div>
                   <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                       <h6 className="font-semibold text-blue-900 text-sm mb-1">🧠 Intelligence Layer</h6>
                       <p className="text-xs text-blue-800">Central AI engine powering all intelligent decisions across the platform</p>
                     </div>
                     <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                       <h6 className="font-semibold text-green-900 text-sm mb-1">🔄 Adaptive Components</h6>
                       <p className="text-xs text-green-800">Self-optimizing components that learn and improve over time</p>
                     </div>
                     <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                       <h6 className="font-semibold text-purple-900 text-sm mb-1">🎯 Context-Aware</h6>
                       <p className="text-xs text-purple-800">Every decision considers business context, user intent, and system state</p>
                     </div>
                   </div>
                 </div>
               </div>
             </div>

             <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-6 border border-cyan-200 mb-8">
               <h4 className="text-xl font-semibold text-cyan-900 mb-6">🛣️ Implementation Roadmap for AI-Enhanced API Management</h4>
               
               <div className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                   <div className="bg-white rounded-lg p-4 border border-cyan-100">
                     <div className="text-center mb-3">
                       <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                         <span className="text-green-600 font-bold text-sm">1</span>
                       </div>
                       <h5 className="font-semibold text-cyan-900 text-sm">Foundation Phase</h5>
                       <p className="text-xs text-cyan-700">0-6 months</p>
                     </div>
                     <ul className="text-xs text-cyan-800 space-y-1">
                       <li>• Implement basic MCP servers</li>
                       <li>• Add AI gateway pilot</li>
                       <li>• Basic behavioral analytics</li>
                       <li>• Simple orchestration rules</li>
                     </ul>
                   </div>
                   
                   <div className="bg-white rounded-lg p-4 border border-cyan-100">
                     <div className="text-center mb-3">
                       <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                         <span className="text-blue-600 font-bold text-sm">2</span>
                       </div>
                       <h5 className="font-semibold text-cyan-900 text-sm">Intelligence Phase</h5>
                       <p className="text-xs text-cyan-700">6-12 months</p>
                     </div>
                     <ul className="text-xs text-cyan-800 space-y-1">
                       <li>• ML-powered routing</li>
                       <li>• Predictive scaling</li>
                       <li>• Automated security policies</li>
                       <li>• Smart service composition</li>
                     </ul>
                   </div>
                   
                   <div className="bg-white rounded-lg p-4 border border-cyan-100">
                     <div className="text-center mb-3">
                       <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                         <span className="text-purple-600 font-bold text-sm">3</span>
                       </div>
                       <h5 className="font-semibold text-cyan-900 text-sm">Autonomy Phase</h5>
                       <p className="text-xs text-cyan-700">12-18 months</p>
                     </div>
                     <ul className="text-xs text-cyan-800 space-y-1">
                       <li>• Self-healing systems</li>
                       <li>• Autonomous governance</li>
                       <li>• Advanced threat response</li>
                       <li>• Intelligent cost optimization</li>
                     </ul>
                   </div>
                   
                   <div className="bg-white rounded-lg p-4 border border-cyan-100">
                     <div className="text-center mb-3">
                       <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
                         <span className="text-indigo-600 font-bold text-sm">4</span>
                       </div>
                       <h5 className="font-semibold text-cyan-900 text-sm">Innovation Phase</h5>
                       <p className="text-xs text-cyan-700">18+ months</p>
                     </div>
                     <ul className="text-xs text-cyan-800 space-y-1">
                       <li>• Business-outcome optimization</li>
                       <li>• Cross-ecosystem intelligence</li>
                       <li>• Predictive business insights</li>
                       <li>• Autonomous API evolution</li>
                     </ul>
                   </div>
                 </div>
                 
                 <div className="bg-white rounded-lg p-4 border border-cyan-100">
                   <h5 className="font-semibold text-cyan-900 mb-3">💡 Key Success Factors</h5>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <div className="flex items-start space-x-3">
                         <span className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></span>
                         <div>
                           <h6 className="font-semibold text-cyan-800 text-sm">Data Quality Foundation</h6>
                           <p className="text-xs text-cyan-700">Ensure high-quality data for AI model training and decision-making</p>
                         </div>
                       </div>
                       <div className="flex items-start space-x-3">
                         <span className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></span>
                         <div>
                           <h6 className="font-semibold text-cyan-800 text-sm">Gradual AI Integration</h6>
                           <p className="text-xs text-cyan-700">Start with low-risk, high-value AI enhancements before full automation</p>
                         </div>
                       </div>
                       <div className="flex items-start space-x-3">
                         <span className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></span>
                         <div>
                           <h6 className="font-semibold text-cyan-800 text-sm">Cross-Functional Teams</h6>
                           <p className="text-xs text-cyan-700">Combine API, AI, and business expertise for optimal outcomes</p>
                         </div>
                       </div>
                     </div>
                     <div className="space-y-2">
                       <div className="flex items-start space-x-3">
                         <span className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></span>
                         <div>
                           <h6 className="font-semibold text-cyan-800 text-sm">Monitoring & Observability</h6>
                           <p className="text-xs text-cyan-700">Comprehensive monitoring of AI decisions and system behavior</p>
                         </div>
                       </div>
                       <div className="flex items-start space-x-3">
                         <span className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></span>
                         <div>
                           <h6 className="font-semibold text-cyan-800 text-sm">Continuous Learning</h6>
                           <p className="text-xs text-cyan-700">Establish feedback loops for continuous AI model improvement</p>
                         </div>
                       </div>
                       <div className="flex items-start space-x-3">
                         <span className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></span>
                         <div>
                           <h6 className="font-semibold text-cyan-800 text-sm">Security by Design</h6>
                           <p className="text-xs text-cyan-700">Embed security considerations into every AI-enhanced component</p>
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
             </div>

             <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200 mb-8">
               <h4 className="text-xl font-semibold text-indigo-900 mb-6">🏢 Enterprise API Management Transformation</h4>
               
               <div className="space-y-6">
                 <div className="bg-white rounded-lg p-6 border border-indigo-100">
                   <h5 className="font-semibold text-indigo-900 mb-6">🔄 Impact on Standard API Management Practices</h5>
                   
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                     <div className="space-y-4">
                       <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                         <div className="font-semibold text-red-800 text-sm mb-3">🚪 Traditional API Gateways</div>
                         <div className="space-y-2">
                           <div className="bg-white rounded-lg p-3 border border-red-50">
                             <div className="font-semibold text-red-700 text-xs mb-1">Static Configuration</div>
                             <p className="text-xs text-red-600">Manual route definitions, fixed policies</p>
                           </div>
                           <div className="bg-white rounded-lg p-3 border border-red-50">
                             <div className="font-semibold text-red-700 text-xs mb-1">Protocol Translation</div>
                             <p className="text-xs text-red-600">Predefined mappings between protocols</p>
                           </div>
                           <div className="bg-white rounded-lg p-3 border border-red-50">
                             <div className="font-semibold text-red-700 text-xs mb-1">Basic Load Balancing</div>
                             <p className="text-xs text-red-600">Round-robin, weighted algorithms</p>
                           </div>
                         </div>
                       </div>
                       
                       <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                         <div className="font-semibold text-red-800 text-sm mb-3">🛣️ Traditional Routing</div>
                         <div className="space-y-2">
                           <div className="bg-white rounded-lg p-3 border border-red-50">
                             <div className="font-semibold text-red-700 text-xs mb-1">URL-Based Routing</div>
                             <p className="text-xs text-red-600">Fixed path patterns and HTTP methods</p>
                           </div>
                           <div className="bg-white rounded-lg p-3 border border-red-50">
                             <div className="font-semibold text-red-700 text-xs mb-1">Manual Configuration</div>
                             <p className="text-xs text-red-600">DevOps teams manage routing rules</p>
                           </div>
                           <div className="bg-white rounded-lg p-3 border border-red-50">
                             <div className="font-semibold text-red-700 text-xs mb-1">Static Failover</div>
                             <p className="text-xs text-red-600">Predefined backup routes</p>
                           </div>
                         </div>
                       </div>
                       
                       <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                         <div className="font-semibold text-red-800 text-sm mb-3">🔐 Traditional Authorization</div>
                         <div className="space-y-2">
                           <div className="bg-white rounded-lg p-3 border border-red-50">
                             <div className="font-semibold text-red-700 text-xs mb-1">Role-Based Access</div>
                             <p className="text-xs text-red-600">Static role assignments and permissions</p>
                           </div>
                           <div className="bg-white rounded-lg p-3 border border-red-50">
                             <div className="font-semibold text-red-700 text-xs mb-1">Token Validation</div>
                             <p className="text-xs text-red-600">JWT, OAuth token verification</p>
                           </div>
                           <div className="bg-white rounded-lg p-3 border border-red-50">
                             <div className="font-semibold text-red-700 text-xs mb-1">Policy Enforcement</div>
                             <p className="text-xs text-red-600">Rule-based access control</p>
                           </div>
                         </div>
                       </div>
                       
                       <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                         <div className="font-semibold text-red-800 text-sm mb-3">🛡️ Traditional Security</div>
                         <div className="space-y-2">
                           <div className="bg-white rounded-lg p-3 border border-red-50">
                             <div className="font-semibold text-red-700 text-xs mb-1">Perimeter Defense</div>
                             <p className="text-xs text-red-600">Firewall rules, IP whitelisting</p>
                           </div>
                           <div className="bg-white rounded-lg p-3 border border-red-50">
                             <div className="font-semibold text-red-700 text-xs mb-1">Signature Detection</div>
                             <p className="text-xs text-red-600">Known threat pattern matching</p>
                           </div>
                           <div className="bg-white rounded-lg p-3 border border-red-50">
                             <div className="font-semibold text-red-700 text-xs mb-1">Rate Limiting</div>
                             <p className="text-xs text-red-600">Fixed throttling policies</p>
                           </div>
                         </div>
                       </div>
                     </div>
                     
                     <div className="space-y-4">
                       <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                         <div className="font-semibold text-green-800 text-sm mb-3">🧠 AI-Enhanced Gateways</div>
                         <div className="space-y-2">
                           <div className="bg-white rounded-lg p-3 border border-green-50">
                             <div className="font-semibold text-green-700 text-xs mb-1">Intent-Aware Routing</div>
                             <p className="text-xs text-green-600">Natural language to API endpoint mapping</p>
                           </div>
                           <div className="bg-white rounded-lg p-3 border border-green-50">
                             <div className="font-semibold text-green-700 text-xs mb-1">Dynamic Protocol Adaptation</div>
                             <p className="text-xs text-green-600">AI converts between MCP, REST, GraphQL, gRPC</p>
                           </div>
                           <div className="bg-white rounded-lg p-3 border border-green-50">
                             <div className="font-semibold text-green-700 text-xs mb-1">Predictive Load Balancing</div>
                             <p className="text-xs text-green-600">ML-based traffic prediction and routing</p>
                           </div>
                         </div>
                       </div>
                       
                       <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                         <div className="font-semibold text-green-800 text-sm mb-3">🎯 AI-Enhanced Routing</div>
                         <div className="space-y-2">
                           <div className="bg-white rounded-lg p-3 border border-green-50">
                             <div className="font-semibold text-green-700 text-xs mb-1">Semantic Routing</div>
                             <p className="text-xs text-green-600">Route based on request intent and context</p>
                           </div>
                           <div className="bg-white rounded-lg p-3 border border-green-50">
                             <div className="font-semibold text-green-700 text-xs mb-1">Self-Managing Routes</div>
                             <p className="text-xs text-green-600">AI discovers and configures new endpoints</p>
                           </div>
                           <div className="bg-white rounded-lg p-3 border border-green-50">
                             <div className="font-semibold text-green-700 text-xs mb-1">Intelligent Failover</div>
                             <p className="text-xs text-green-600">Context-aware backup selection</p>
                           </div>
                         </div>
                       </div>
                       
                       <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                         <div className="font-semibold text-green-800 text-sm mb-3">🤖 AI-Enhanced Authorization</div>
                         <div className="space-y-2">
                           <div className="bg-white rounded-lg p-3 border border-green-50">
                             <div className="font-semibold text-green-700 text-xs mb-1">Context-Based Access</div>
                             <p className="text-xs text-green-600">Dynamic permissions based on user behavior</p>
                           </div>
                           <div className="bg-white rounded-lg p-3 border border-green-50">
                             <div className="font-semibold text-green-700 text-xs mb-1">Adaptive Authentication</div>
                             <p className="text-xs text-green-600">Biometric and behavioral verification</p>
                           </div>
                           <div className="bg-white rounded-lg p-3 border border-green-50">
                             <div className="font-semibold text-green-700 text-xs mb-1">Risk-Based Policies</div>
                             <p className="text-xs text-green-600">Real-time risk assessment and policy adjustment</p>
                           </div>
                         </div>
                       </div>
                       
                       <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                         <div className="font-semibold text-green-800 text-sm mb-3">🛡️ AI-Enhanced Security</div>
                         <div className="space-y-2">
                           <div className="bg-white rounded-lg p-3 border border-green-50">
                             <div className="font-semibold text-green-700 text-xs mb-1">Zero Trust Architecture</div>
                             <p className="text-xs text-green-600">Continuous verification of all interactions</p>
                           </div>
                           <div className="bg-white rounded-lg p-3 border border-green-50">
                             <div className="font-semibold text-green-700 text-xs mb-1">Anomaly Detection</div>
                             <p className="text-xs text-green-600">ML-powered behavior analysis</p>
                           </div>
                           <div className="bg-white rounded-lg p-3 border border-green-50">
                             <div className="font-semibold text-green-700 text-xs mb-1">Adaptive Rate Limiting</div>
                             <p className="text-xs text-green-600">User-specific and context-aware throttling</p>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
                 
                 <div className="bg-white rounded-lg p-6 border border-indigo-100">
                   <h5 className="font-semibold text-indigo-900 mb-6">🏛️ Enterprise Readiness: Required Services & Infrastructure</h5>
                   
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                     <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                       <h6 className="font-semibold text-blue-800 mb-3">🔧 Core Infrastructure Services</h6>
                       <div className="space-y-2">
                         <div className="flex items-start space-x-2">
                           <span className="w-2 h-2 bg-blue-500 rounded-full mt-1 flex-shrink-0"></span>
                           <div>
                             <div className="font-semibold text-blue-700 text-xs">AI Gateway Platform</div>
                             <p className="text-xs text-blue-600">Intelligent routing and protocol translation</p>
                           </div>
                         </div>
                         <div className="flex items-start space-x-2">
                           <span className="w-2 h-2 bg-blue-500 rounded-full mt-1 flex-shrink-0"></span>
                           <div>
                             <div className="font-semibold text-blue-700 text-xs">MCP Server Registry</div>
                             <p className="text-xs text-blue-600">Centralized discovery and management</p>
                           </div>
                         </div>
                         <div className="flex items-start space-x-2">
                           <span className="w-2 h-2 bg-blue-500 rounded-full mt-1 flex-shrink-0"></span>
                           <div>
                             <div className="font-semibold text-blue-700 text-xs">Agent Orchestration Engine</div>
                             <p className="text-xs text-blue-600">Multi-agent workflow coordination</p>
                           </div>
                         </div>
                         <div className="flex items-start space-x-2">
                           <span className="w-2 h-2 bg-blue-500 rounded-full mt-1 flex-shrink-0"></span>
                           <div>
                             <div className="font-semibold text-blue-700 text-xs">Semantic Caching Layer</div>
                             <p className="text-xs text-blue-600">Intent-based response caching</p>
                           </div>
                         </div>
                       </div>
                     </div>
                     
                     <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                       <h6 className="font-semibold text-orange-800 mb-3">🔒 Security & Compliance Services</h6>
                       <div className="space-y-2">
                         <div className="flex items-start space-x-2">
                           <span className="w-2 h-2 bg-orange-500 rounded-full mt-1 flex-shrink-0"></span>
                           <div>
                             <div className="font-semibold text-orange-700 text-xs">AI Security Operations Center</div>
                             <p className="text-xs text-orange-600">24/7 threat monitoring and response</p>
                           </div>
                         </div>
                         <div className="flex items-start space-x-2">
                           <span className="w-2 h-2 bg-orange-500 rounded-full mt-1 flex-shrink-0"></span>
                           <div>
                             <div className="font-semibold text-orange-700 text-xs">Agent Behavior Auditing</div>
                             <p className="text-xs text-orange-600">Comprehensive action logging and analysis</p>
                           </div>
                         </div>
                         <div className="flex items-start space-x-2">
                           <span className="w-2 h-2 bg-orange-500 rounded-full mt-1 flex-shrink-0"></span>
                           <div>
                             <div className="font-semibold text-orange-700 text-xs">Compliance Automation</div>
                             <p className="text-xs text-orange-600">GDPR, SOX, HIPAA automated compliance</p>
                           </div>
                         </div>
                         <div className="flex items-start space-x-2">
                           <span className="w-2 h-2 bg-orange-500 rounded-full mt-1 flex-shrink-0"></span>
                           <div>
                             <div className="font-semibold text-orange-700 text-xs">Privacy Preservation Engine</div>
                             <p className="text-xs text-orange-600">Data anonymization and encryption</p>
                           </div>
                         </div>
                       </div>
                     </div>
                     
                     <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                       <h6 className="font-semibold text-purple-800 mb-3">📊 Monitoring & Analytics Services</h6>
                       <div className="space-y-2">
                         <div className="flex items-start space-x-2">
                           <span className="w-2 h-2 bg-purple-500 rounded-full mt-1 flex-shrink-0"></span>
                           <div>
                             <div className="font-semibold text-purple-700 text-xs">Agent Performance Analytics</div>
                             <p className="text-xs text-purple-600">Success rates, response times, accuracy</p>
                           </div>
                         </div>
                         <div className="flex items-start space-x-2">
                           <span className="w-2 h-2 bg-purple-500 rounded-full mt-1 flex-shrink-0"></span>
                           <div>
                             <div className="font-semibold text-purple-700 text-xs">Business Impact Tracking</div>
                             <p className="text-xs text-purple-600">ROI measurement and KPI correlation</p>
                           </div>
                         </div>
                         <div className="flex items-start space-x-2">
                           <span className="w-2 h-2 bg-purple-500 rounded-full mt-1 flex-shrink-0"></span>
                           <div>
                             <div className="font-semibold text-purple-700 text-xs">Predictive Maintenance</div>
                             <p className="text-xs text-purple-600">Proactive system health management</p>
                           </div>
                         </div>
                         <div className="flex items-start space-x-2">
                           <span className="w-2 h-2 bg-purple-500 rounded-full mt-1 flex-shrink-0"></span>
                           <div>
                             <div className="font-semibold text-purple-700 text-xs">Cost Optimization Engine</div>
                             <p className="text-xs text-purple-600">Resource usage and pricing optimization</p>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                   
                   <div className="bg-gradient-to-r from-teal-50 to-green-50 rounded-lg p-4 border border-teal-200">
                     <h6 className="font-semibold text-teal-900 mb-3">💼 Enterprise Support Services</h6>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="space-y-2">
                         <div className="flex items-start space-x-2">
                           <span className="w-2 h-2 bg-teal-500 rounded-full mt-1 flex-shrink-0"></span>
                           <div>
                             <div className="font-semibold text-teal-800 text-xs">24/7 Agent Support Center</div>
                             <p className="text-xs text-teal-700">Human experts for complex agent issues</p>
                           </div>
                         </div>
                         <div className="flex items-start space-x-2">
                           <span className="w-2 h-2 bg-teal-500 rounded-full mt-1 flex-shrink-0"></span>
                           <div>
                             <div className="font-semibold text-teal-800 text-xs">Agent Training & Optimization</div>
                             <p className="text-xs text-teal-700">Custom model training for specific business domains</p>
                           </div>
                         </div>
                         <div className="flex items-start space-x-2">
                           <span className="w-2 h-2 bg-teal-500 rounded-full mt-1 flex-shrink-0"></span>
                           <div>
                             <div className="font-semibold text-teal-800 text-xs">Migration Services</div>
                             <p className="text-xs text-teal-700">Legacy API to MCP transformation</p>
                           </div>
                         </div>
                       </div>
                       <div className="space-y-2">
                         <div className="flex items-start space-x-2">
                           <span className="w-2 h-2 bg-teal-500 rounded-full mt-1 flex-shrink-0"></span>
                           <div>
                             <div className="font-semibold text-teal-800 text-xs">Disaster Recovery & Backup</div>
                             <p className="text-xs text-teal-700">Agent state preservation and rapid restoration</p>
                           </div>
                         </div>
                         <div className="flex items-start space-x-2">
                           <span className="w-2 h-2 bg-teal-500 rounded-full mt-1 flex-shrink-0"></span>
                           <div>
                             <div className="font-semibold text-teal-800 text-xs">Capacity Planning</div>
                             <p className="text-xs text-teal-700">Predictive scaling and resource allocation</p>
                           </div>
                         </div>
                         <div className="flex items-start space-x-2">
                           <span className="w-2 h-2 bg-teal-500 rounded-full mt-1 flex-shrink-0"></span>
                           <div>
                             <div className="font-semibold text-teal-800 text-xs">Change Management</div>
                             <p className="text-xs text-teal-700">Organizational transformation support</p>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
                 
                 <div className="bg-white rounded-lg p-6 border border-indigo-100">
                   <h5 className="font-semibold text-indigo-900 mb-6">🚀 Business Opportunities for EPAM & Enterprise Service Providers</h5>
                   
                   <div className="space-y-6">
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                       <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
                         <h6 className="font-semibold text-emerald-800 mb-4">💰 High-Value Service Lines</h6>
                         <div className="space-y-3">
                           <div className="bg-white rounded-lg p-3 border border-emerald-50">
                             <div className="font-semibold text-emerald-700 text-sm mb-2">🏗️ AI Gateway Implementation</div>
                             <div className="text-xs text-emerald-600 mb-2">$500K - $2M per engagement</div>
                             <ul className="text-xs text-emerald-600 space-y-1">
                               <li>• Custom AI gateway design and deployment</li>
                               <li>• Legacy API integration and modernization</li>
                               <li>• Multi-cloud and hybrid infrastructure setup</li>
                               <li>• Performance optimization and scaling</li>
                             </ul>
                           </div>
                           
                           <div className="bg-white rounded-lg p-3 border border-emerald-50">
                             <div className="font-semibold text-emerald-700 text-sm mb-2">🤖 Agent Ecosystem Development</div>
                             <div className="text-xs text-emerald-600 mb-2">$300K - $1.5M per project</div>
                             <ul className="text-xs text-emerald-600 space-y-1">
                               <li>• Custom MCP server development</li>
                               <li>• Business-specific agent training</li>
                               <li>• Multi-agent orchestration workflows</li>
                               <li>• Integration with existing enterprise systems</li>
                             </ul>
                           </div>
                           
                           <div className="bg-white rounded-lg p-3 border border-emerald-50">
                             <div className="font-semibold text-emerald-700 text-sm mb-2">🔒 Enterprise Security Implementation</div>
                             <div className="text-xs text-emerald-600 mb-2">$400K - $1.2M per engagement</div>
                             <ul className="text-xs text-emerald-600 space-y-1">
                               <li>• Zero Trust AI architecture design</li>
                               <li>• Compliance automation (SOX, GDPR, HIPAA)</li>
                               <li>• AI-powered threat detection systems</li>
                               <li>• Privacy-preserving analytics implementation</li>
                             </ul>
                           </div>
                         </div>
                       </div>
                       
                       <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                         <h6 className="font-semibold text-blue-800 mb-4">🔄 Recurring Revenue Streams</h6>
                         <div className="space-y-3">
                           <div className="bg-white rounded-lg p-3 border border-blue-50">
                             <div className="font-semibold text-blue-700 text-sm mb-2">🛠️ Managed AI Operations</div>
                             <div className="text-xs text-blue-600 mb-2">$50K - $200K per month</div>
                             <ul className="text-xs text-blue-600 space-y-1">
                               <li>• 24/7 monitoring and incident response</li>
                               <li>• Continuous model training and optimization</li>
                               <li>• Performance tuning and capacity management</li>
                               <li>• Security monitoring and threat response</li>
                             </ul>
                           </div>
                           
                           <div className="bg-white rounded-lg p-3 border border-blue-50">
                             <div className="font-semibold text-blue-700 text-sm mb-2">📊 AI Analytics & Insights</div>
                             <div className="text-xs text-blue-600 mb-2">$25K - $100K per month</div>
                             <ul className="text-xs text-blue-600 space-y-1">
                               <li>• Business impact measurement and reporting</li>
                               <li>• Predictive analytics and forecasting</li>
                               <li>• Cost optimization recommendations</li>
                               <li>• Strategic AI roadmap consulting</li>
                             </ul>
                           </div>
                           
                           <div className="bg-white rounded-lg p-3 border border-blue-50">
                             <div className="font-semibold text-blue-700 text-sm mb-2">🎓 Training & Change Management</div>
                             <div className="text-xs text-blue-600 mb-2">$30K - $150K per quarter</div>
                             <ul className="text-xs text-blue-600 space-y-1">
                               <li>• Executive AI strategy workshops</li>
                               <li>• Developer training programs</li>
                               <li>• Organizational transformation consulting</li>
                               <li>• Best practices and governance frameworks</li>
                             </ul>
                           </div>
                         </div>
                       </div>
                     </div>
                     
                     <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg p-4 border border-violet-200">
                       <h6 className="font-semibold text-violet-900 mb-4">🎯 Market Positioning Strategies</h6>
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         <div className="bg-white rounded-lg p-3 border border-violet-100">
                           <div className="font-semibold text-violet-800 text-sm mb-2">🏆 Industry Leadership</div>
                           <ul className="text-xs text-violet-700 space-y-1">
                             <li>• Become certified MCP implementation partner</li>
                             <li>• Develop proprietary AI gateway solutions</li>
                             <li>• Publish thought leadership content</li>
                             <li>• Partner with major AI platforms</li>
                           </ul>
                         </div>
                         <div className="bg-white rounded-lg p-3 border border-violet-100">
                           <div className="font-semibold text-violet-800 text-sm mb-2">🔧 Technical Excellence</div>
                           <ul className="text-xs text-violet-700 space-y-1">
                             <li>• Build center of excellence for AI APIs</li>
                             <li>• Develop accelerators and frameworks</li>
                             <li>• Create reference architectures</li>
                             <li>• Establish AI/ML competency centers</li>
                           </ul>
                         </div>
                         <div className="bg-white rounded-lg p-3 border border-violet-100">
                           <div className="font-semibold text-violet-800 text-sm mb-2">🌐 Ecosystem Building</div>
                           <ul className="text-xs text-violet-700 space-y-1">
                             <li>• Create partner marketplace for MCP servers</li>
                             <li>• Develop vendor-agnostic solutions</li>
                             <li>• Build community and knowledge sharing</li>
                             <li>• Establish integration partnerships</li>
                           </ul>
                         </div>
                       </div>
                     </div>
                     
                     <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-200">
                       <h6 className="font-semibold text-amber-900 mb-3">📈 Revenue Projections for Enterprise Service Providers</h6>
                       <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                         <div className="bg-white rounded-lg p-3 border border-amber-100 text-center">
                           <div className="font-bold text-amber-800 text-lg">$2-5M</div>
                           <div className="text-xs text-amber-700">Year 1 Revenue</div>
                           <div className="text-xs text-amber-600">Early adopter projects</div>
                         </div>
                         <div className="bg-white rounded-lg p-3 border border-amber-100 text-center">
                           <div className="font-bold text-amber-800 text-lg">$10-25M</div>
                           <div className="text-xs text-amber-700">Year 2 Revenue</div>
                           <div className="text-xs text-amber-600">Market expansion</div>
                         </div>
                         <div className="bg-white rounded-lg p-3 border border-amber-100 text-center">
                           <div className="font-bold text-amber-800 text-lg">$25-50M</div>
                           <div className="text-xs text-amber-700">Year 3 Revenue</div>
                           <div className="text-xs text-amber-600">Market leadership</div>
                         </div>
                         <div className="bg-white rounded-lg p-3 border border-amber-100 text-center">
                           <div className="font-bold text-amber-800 text-lg">$50-100M</div>
                           <div className="text-xs text-amber-700">Year 4+ Revenue</div>
                           <div className="text-xs text-amber-600">Platform dominance</div>
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
             </div>

             <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-6 border border-yellow-200">
               <h4 className="text-xl font-semibold text-amber-900 mb-4 text-center">🎯 Conclusion: The API-First AI Future</h4>
               <p className="text-amber-800 leading-relaxed text-center mb-4">
                 The convergence of AI agents and standardized protocols like MCP represents the most significant shift 
                 in software integration since the advent of REST APIs. Organizations that embrace this transformation 
                 will unlock unprecedented levels of agility, innovation, and competitive advantage.
               </p>
               <div className="bg-white rounded-lg p-4 border border-amber-100">
                 <p className="text-sm text-amber-700 text-center font-medium">
                   "The future belongs to organizations that can turn every business process into a conversation 
                   with their digital ecosystem." - The Age of Conversational Computing
                 </p>
               </div>
             </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-6">
            <BookOpenIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Coinbase MCP Tutorial
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A comprehensive guide to understanding and implementing the Model Context Protocol 
            with Coinbase cryptocurrency data integration.
          </p>
          <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <CubeTransparentIcon className="h-4 w-4 mr-1" />
              MCP Architecture
            </span>
            <span className="flex items-center">
              <ShieldCheckIcon className="h-4 w-4 mr-1" />
              Security & Guardrails
            </span>
            <span className="flex items-center">
              <CodeBracketIcon className="h-4 w-4 mr-1" />
              Implementation Guide
            </span>
            <span className="flex items-center">
              <PlayIcon className="h-4 w-4 mr-1" />
              Live Examples
            </span>
          </div>
        </div>

        {/* Attribution Footer */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-cyan-50 rounded-2xl p-8 border border-purple-200/50 shadow-lg">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">VB</span>
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold text-gray-900">Vladimir Bichev</h3>
                <p className="text-sm text-gray-600">Creator & Developer</p>
              </div>
            </div>
                         <p className="text-gray-700 leading-relaxed mb-4">
               Made with ❤️ by{' '}
               <a 
                 href="https://www.linkedin.com/in/vladimir-bichev-383b1525/" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-200"
               >
                 Vladimir Bichev
               </a>
               {' '}for the crypto and AI communities
             </p>
             <div className="flex items-center justify-center space-x-6 text-sm text-gray-600 mb-4">
               <span className="flex items-center space-x-1">
                 <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                 <span>Open Source</span>
               </span>
               <span className="flex items-center space-x-1">
                 <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                 <span>Educational</span>
               </span>
               <span className="flex items-center space-x-1">
                 <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                 <span>Community Driven</span>
               </span>
             </div>
             <div className="flex items-center justify-center space-x-4">
               <a 
                 href="https://github.com/Bichev/coinbase-chat-mcp" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
               >
                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                   <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                 </svg>
                 <span>View on GitHub</span>
               </a>
               <a 
                 href="https://www.linkedin.com/in/vladimir-bichev-383b1525/" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
               >
                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                   <path d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"/>
                 </svg>
                 <span>Connect on LinkedIn</span>
               </a>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Tutorial Sections</h3>
                <nav className="space-y-2">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    const isActive = activeSection === section.id;
                    const isExpanded = expandedSections.has(section.id);
                    
                    return (
                      <button
                        key={section.id}
                        onClick={() => toggleSection(section.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                          isActive 
                            ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="h-5 w-5" />
                          <span className="text-sm font-medium">{section.title}</span>
                        </div>
                        {isExpanded ? (
                          <ChevronDownIcon className="h-4 w-4" />
                        ) : (
                          <ChevronRightIcon className="h-4 w-4" />
                        )}
                      </button>
                    );
                  })}
                </nav>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="text-xs text-gray-500 space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Progress</span>
                      <span>{expandedSections.size}/{sections.length}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(expandedSections.size / sections.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-8">
              {sections.map((section) => {
                const isExpanded = expandedSections.has(section.id);
                if (!isExpanded) return null;
                
                return (
                  <div key={section.id} id={`section-${section.id}`} className="animate-fadeIn scroll-mt-8">
                    {section.content}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 mb-4">
              <a 
                href="https://github.com/modelcontextprotocol" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center hover:text-blue-600 transition-colors"
              >
                <ArrowTopRightOnSquareIcon className="h-4 w-4 mr-1" />
                MCP Documentation
              </a>
              <a 
                href="https://docs.coinbase.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center hover:text-blue-600 transition-colors"
              >
                <ArrowTopRightOnSquareIcon className="h-4 w-4 mr-1" />
                Coinbase API
              </a>
              <a 
                href="https://cursor.sh/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center hover:text-blue-600 transition-colors"
              >
                <ArrowTopRightOnSquareIcon className="h-4 w-4 mr-1" />
                Cursor IDE
              </a>
            </div>
            <p className="text-gray-400 text-sm">
              Built with React, TypeScript, and the Model Context Protocol
            </p>
          </div>
        </div>
      </div>


    </div>
  );
};

export default Tutorial; 