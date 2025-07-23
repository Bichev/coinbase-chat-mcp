import React, { useEffect } from 'react';
import { 
  CubeTransparentIcon, 
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';

const Architecture: React.FC = () => {
  useEffect(() => {
    // Add styles for the architecture content
    const style = document.createElement('style');
    style.textContent = `
      .architecture-content {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        line-height: 1.4;
      }
      
      .architecture-content .evolution-timeline {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 30px;
        margin-bottom: 40px;
      }

      .architecture-content .evolution-step {
        background: rgba(30, 41, 59, 0.8);
        border: 1px solid rgba(148, 163, 184, 0.2);
        border-radius: 16px;
        padding: 25px;
        backdrop-filter: blur(10px);
        position: relative;
      }

      .architecture-content .evolution-step:nth-child(1) { 
        border-top: 4px solid #ef4444;
      }
      .architecture-content .evolution-step:nth-child(2) { 
        border-top: 4px solid #f59e0b;
      }
      .architecture-content .evolution-step:nth-child(3) { 
        border-top: 4px solid #10b981;
      }
      .architecture-content .evolution-step:nth-child(4) { 
        border-top: 4px solid #60a5fa;
      }

      .architecture-content .step-header {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-bottom: 20px;
      }

      .architecture-content .step-number {
        background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
        color: #0f172a;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 18px;
      }

      .architecture-content .step-title {
        font-size: 24px;
        font-weight: 700;
        color: #f59e0b;
      }

      .architecture-content .architecture-diagram {
        background: rgba(15, 23, 42, 0.9);
        border: 2px solid rgba(148, 163, 184, 0.3);
        border-radius: 12px;
        padding: 20px;
        margin: 20px 0;
        text-align: center;
        min-height: 300px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }

      .architecture-content .diagram-image {
        max-width: 100%;
        max-height: 250px;
        border-radius: 8px;
        margin-bottom: 15px;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        cursor: pointer;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }

      .architecture-content .diagram-image:hover {
        transform: scale(1.05);
        box-shadow: 0 12px 35px rgba(96, 165, 250, 0.4);
      }

      .architecture-content .diagram-caption {
        font-size: 14px;
        color: #94a3b8;
        font-style: italic;
      }

      .architecture-content .problem-solution-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
        margin: 20px 0;
      }

      .architecture-content .problem-box {
        background: rgba(239, 68, 68, 0.1);
        border-left: 4px solid #ef4444;
        padding: 15px;
        border-radius: 8px;
      }

      .architecture-content .solution-box {
        background: rgba(16, 185, 129, 0.1);
        border-left: 4px solid #10b981;
        padding: 15px;
        border-radius: 8px;
      }

      .architecture-content .box-title {
        font-weight: 600;
        margin-bottom: 10px;
        font-size: 16px;
      }

      .architecture-content .problem-title { color: #fca5a5; }
      .architecture-content .solution-title { color: #86efac; }

      .architecture-content .box-content {
        font-size: 14px;
        color: #e2e8f0;
        line-height: 1.5;
      }

      .architecture-content .pros-cons-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin: 20px 0;
      }

      .architecture-content .pros-box {
        background: rgba(16, 185, 129, 0.1);
        border: 1px solid rgba(16, 185, 129, 0.3);
        border-radius: 12px;
        padding: 20px;
      }

      .architecture-content .cons-box {
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.3);
        border-radius: 12px;
        padding: 20px;
      }

      .architecture-content .pros-title {
        color: #10b981;
        font-size: 18px;
        font-weight: 700;
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .architecture-content .cons-title {
        color: #ef4444;
        font-size: 18px;
        font-weight: 700;
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .architecture-content .pros-cons-list {
        list-style: none;
      }

      .architecture-content .pros-cons-item {
        padding: 8px 0;
        border-bottom: 1px solid rgba(148, 163, 184, 0.1);
        font-size: 14px;
        color: #e2e8f0;
      }

      .architecture-content .pros-cons-item:last-child {
        border-bottom: none;
      }

      .architecture-content .pros-cons-item::before {
        content: "•";
        margin-right: 8px;
        font-weight: bold;
      }

      .architecture-content .pros-item::before { color: #10b981; }
      .architecture-content .cons-item::before { color: #ef4444; }

      .architecture-content .code-examples-section {
        background: rgba(30, 41, 59, 0.8);
        border: 1px solid rgba(148, 163, 184, 0.2);
        border-radius: 16px;
        padding: 30px;
        margin: 30px 0;
      }

      .architecture-content .section-title {
        font-size: 28px;
        font-weight: 700;
        color: #f59e0b;
        margin-bottom: 25px;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 15px;
      }

      .architecture-content .code-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
      }

      .architecture-content .code-example {
        background: #0f172a;
        border: 1px solid #334155;
        border-radius: 12px;
        overflow: hidden;
      }

      .architecture-content .code-header {
        background: rgba(30, 41, 59, 0.8);
        padding: 12px 20px;
        border-bottom: 1px solid #334155;
        font-weight: 600;
        color: #f59e0b;
        font-size: 14px;
      }

      .architecture-content .code-content {
        padding: 0;
        font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
        font-size: 12px;
        color: #94a3b8;
        overflow-x: auto;
        line-height: 1.6;
        max-height: 300px;
        overflow-y: auto;
      }

      .architecture-content .code-content pre {
        margin: 0;
        padding: 20px;
        background: transparent;
        overflow-x: auto;
        white-space: pre;
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
        color: inherit;
      }

      .architecture-content .code-content code {
        font-family: inherit;
        font-size: inherit;
        background: transparent;
        padding: 0;
        color: inherit;
      }

      .architecture-content .code-comment { color: #64748b; }
      .architecture-content .code-keyword { color: #c084fc; }
      .architecture-content .code-string { color: #86efac; }
      .architecture-content .code-function { color: #60a5fa; }
      .architecture-content .code-property { color: #fbbf24; }
      .architecture-content .code-value { color: #f472b6; }

      .architecture-content .tech-specs {
        background: rgba(15, 23, 42, 0.8);
        border-radius: 12px;
        padding: 20px;
        margin: 20px 0;
      }

      .architecture-content .spec-item {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid rgba(148, 163, 184, 0.1);
        font-size: 14px;
      }

      .architecture-content .spec-item:last-child { border-bottom: none; }

      .architecture-content .spec-label {
        color: #94a3b8;
        font-weight: 500;
      }

      .architecture-content .spec-value {
        color: #10b981;
        font-weight: 600;
      }

      /* Modal Styles */
      .modal {
        display: none;
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.9);
        backdrop-filter: blur(5px);
      }

      .modal-content {
        margin: 2% auto;
        display: block;
        width: 90%;
        max-width: 1200px;
        max-height: 90%;
        border-radius: 12px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
      }

      .modal-close {
        position: absolute;
        top: 20px;
        right: 35px;
        color: #fff;
        font-size: 40px;
        font-weight: bold;
        cursor: pointer;
        z-index: 1001;
        transition: color 0.3s ease;
      }

      .modal-close:hover {
        color: #60a5fa;
      }

      .modal-caption {
        margin: auto;
        display: block;
        width: 80%;
        max-width: 700px;
        text-align: center;
        color: #e2e8f0;
        padding: 20px 0;
        font-size: 16px;
      }

      /* Reference Materials Section */
      .architecture-content .reference-materials {
        background: rgba(30, 41, 59, 0.8);
        border: 1px solid rgba(148, 163, 184, 0.2);
        border-radius: 16px;
        padding: 30px;
        margin: 30px 0;
      }

      .architecture-content .reference-grid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 25px;
        margin-top: 25px;
      }

      .architecture-content .reference-category {
        background: rgba(15, 23, 42, 0.8);
        border: 1px solid rgba(148, 163, 184, 0.2);
        border-radius: 12px;
        padding: 20px;
      }

      .architecture-content .category-title {
        font-size: 18px;
        font-weight: 700;
        color: #f59e0b;
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .architecture-content .reference-links {
        list-style: none;
      }

      .architecture-content .reference-link {
        padding: 8px 0;
        border-bottom: 1px solid rgba(148, 163, 184, 0.1);
      }

      .architecture-content .reference-link:last-child {
        border-bottom: none;
      }

      .architecture-content .reference-link a {
        color: #60a5fa;
        text-decoration: none;
        font-size: 14px;
        line-height: 1.4;
        transition: color 0.3s ease;
      }

      .architecture-content .reference-link a:hover {
        color: #93c5fd;
        text-decoration: underline;
      }

      .architecture-content .enterprise-patterns {
        background: linear-gradient(135deg, rgba(167, 139, 250, 0.1) 0%, rgba(167, 139, 250, 0.05) 100%);
        border-top: 4px solid #a78bfa;
      }

      @media (max-width: 768px) {
        .architecture-content .evolution-timeline {
          grid-template-columns: 1fr;
        }
        
        .architecture-content .problem-solution-grid {
          grid-template-columns: 1fr;
        }
        
        .architecture-content .pros-cons-grid {
          grid-template-columns: 1fr;
        }
        
        .architecture-content .code-grid {
          grid-template-columns: 1fr;
        }
        
        .architecture-content .reference-grid {
          grid-template-columns: 1fr;
        }
      }
    `;
    document.head.appendChild(style);

    // Add modal functionality
    const openModal = (img: HTMLImageElement) => {
      const modal = document.getElementById("imageModal");
      const modalImg = document.getElementById("modalImage") as HTMLImageElement;
      const caption = document.getElementById("modalCaption");
      
      if (modal && modalImg && caption) {
        modal.style.display = "block";
        modalImg.src = img.src;
        caption.innerHTML = img.alt;
        
        // Prevent body scroll when modal is open
        document.body.style.overflow = "hidden";
      }
    };
    
    const closeModal = () => {
      const modal = document.getElementById("imageModal");
      if (modal) {
        modal.style.display = "none";
        
        // Restore body scroll
        document.body.style.overflow = "auto";
      }
    };
    
    // Add event listeners
    const images = document.querySelectorAll('.diagram-image');
    images.forEach(img => {
      img.addEventListener('click', () => openModal(img as HTMLImageElement));
    });

    // Close modal when clicking outside or pressing escape
    window.onclick = function(event) {
      const modal = document.getElementById("imageModal");
      if (event.target == modal) {
        closeModal();
      }
    };
    
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape') {
        closeModal();
      }
    });

    // Cleanup function
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <CubeTransparentIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                MCP Architecture Evolution
              </h1>
              <p className="text-xl text-slate-300 mt-2">From REST API Limitations to Intelligent Agent Integration</p>
            </div>
            <a 
              href="/slides/Slide 8 Architecture.html" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <ArrowTopRightOnSquareIcon className="h-5 w-5" />
              <span>Full Presentation</span>
            </a>
          </div>
        </div>

        <div className="architecture-content">
          <div className="evolution-timeline">
            {/* Step 1: REST API Standard */}
            <div className="evolution-step">
              <div className="step-header">
                <div className="step-number">1</div>
                <div className="step-title">REST API Standard</div>
              </div>
              
              <div className="architecture-diagram">
                <img src="/static/1 REST API Standard.png" alt="REST API Standard Architecture" className="diagram-image" />
                <div className="diagram-caption">Traditional REST API Architecture</div>
              </div>

              <div className="problem-solution-grid">
                <div className="problem-box">
                  <div className="box-title problem-title">🚨 Core Problems</div>
                  <div className="box-content">
                    • Static, predefined endpoints<br/>
                    • Complex integration requirements<br/>
                    • Poor AI/LLM compatibility<br/>
                    • Manual API discovery process<br/>
                    • Inconsistent data formats
                  </div>
                </div>
                <div className="solution-box">
                  <div className="box-title solution-title">⚙️ Technical Specs</div>
                  <div className="box-content">
                    • HTTP-based communication<br/>
                    • JSON/XML data exchange<br/>
                    • CRUD operations (GET, POST, PUT, DELETE)<br/>
                    • Stateless architecture<br/>
                    • OpenAPI documentation
                  </div>
                </div>
              </div>

              <div className="pros-cons-grid">
                <div className="pros-box">
                  <div className="pros-title">✅ Advantages</div>
                  <ul className="pros-cons-list">
                    <li className="pros-cons-item pros-item">Widely adopted standard</li>
                    <li className="pros-cons-item pros-item">Simple HTTP-based protocol</li>
                    <li className="pros-cons-item pros-item">Good caching mechanisms</li>
                    <li className="pros-cons-item pros-item">Mature tooling ecosystem</li>
                  </ul>
                </div>
                <div className="cons-box">
                  <div className="cons-title">❌ Limitations</div>
                  <ul className="pros-cons-list">
                    <li className="pros-cons-item cons-item">No AI-native capabilities</li>
                    <li className="pros-cons-item cons-item">Complex multi-API orchestration</li>
                    <li className="pros-cons-item cons-item">Static endpoint definitions</li>
                    <li className="pros-cons-item cons-item">Poor discoverability</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Step 2: LLM Limitations */}
            <div className="evolution-step">
              <div className="step-header">
                <div className="step-number">2</div>
                <div className="step-title">LLM & Agentic AI Limitations</div>
              </div>

              <div className="architecture-diagram">
                <img src="/static/2 LLM and Agentic AI Limitations.png" alt="LLM Limitations" className="diagram-image" />
                <div className="diagram-caption">Current LLM Integration Challenges</div>
              </div>

              <div className="problem-solution-grid">
                <div className="problem-box">
                  <div className="box-title problem-title">🔥 Critical Issues</div>
                  <div className="box-content">
                    • Inability to access external data<br/>
                    • No tool execution capabilities<br/>
                    • Context window limitations<br/>
                    • Static knowledge cutoffs<br/>
                    • Complex tool integration
                  </div>
                </div>
                <div className="solution-box">
                  <div className="box-title solution-title">📊 Impact Metrics</div>
                  <div className="box-content">
                    • 83% of AI projects fail integration<br/>
                    • 6+ months average API setup<br/>
                    • $50B+ integration market<br/>
                    • 1000+ APIs per enterprise<br/>
                    • 40% IT budget on integration
                  </div>
                </div>
              </div>

              <div className="tech-specs">
                <div className="spec-item">
                  <span className="spec-label">Current LLM Capability:</span>
                  <span className="spec-value">Text Generation Only</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Tool Access:</span>
                  <span className="spec-value">Manual Integration Required</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Data Freshness:</span>
                  <span className="spec-value">Static Training Data</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Integration Complexity:</span>
                  <span className="spec-value">High (Custom Development)</span>
                </div>
              </div>
            </div>

            {/* Step 3: MCP Agent Architecture */}
            <div className="evolution-step">
              <div className="step-header">
                <div className="step-number">3</div>
                <div className="step-title">MCP Agent Architecture</div>
              </div>

              <div className="architecture-diagram">
                <img src="/static/3 Agents with MCP Architecture.png" alt="MCP Agent Architecture" className="diagram-image" />
                <div className="diagram-caption">Model Context Protocol Agent Integration</div>
              </div>

              <div className="problem-solution-grid">
                <div className="solution-box">
                  <div className="box-title solution-title">🚀 Key Innovations</div>
                  <div className="box-content">
                    • Standardized protocol for AI integration<br/>
                    • Dynamic tool discovery<br/>
                    • Real-time data access<br/>
                    • Secure client-server architecture<br/>
                    • Universal API abstraction
                  </div>
                </div>
                <div className="solution-box">
                  <div className="box-title solution-title">⚡ Core Benefits</div>
                  <div className="box-content">
                    • 90% reduction in integration time<br/>
                    • Plug-and-play server ecosystem<br/>
                    • Standardized security model<br/>
                    • Multi-modal support<br/>
                    • Protocol-level optimization
                  </div>
                </div>
              </div>

              <div className="tech-specs">
                <div className="spec-item">
                  <span className="spec-label">Protocol:</span>
                  <span className="spec-value">JSON-RPC 2.0</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Transport:</span>
                  <span className="spec-value">Stdio, HTTP/SSE</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Discovery:</span>
                  <span className="spec-value">Dynamic Capability Detection</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Security:</span>
                  <span className="spec-value">Client-Controlled Access</span>
                </div>
              </div>
            </div>

            {/* Step 4: Detailed MCP Architecture */}
            <div className="evolution-step">
              <div className="step-header">
                <div className="step-number">4</div>
                <div className="step-title">MCP Detailed Architecture</div>
              </div>

              <div className="architecture-diagram">
                <img src="/static/4 MCP Detailed Architecture.png" alt="MCP Detailed Architecture" className="diagram-image" />
                <div className="diagram-caption">Complete MCP Protocol Stack</div>
              </div>

              <div className="problem-solution-grid">
                <div className="solution-box">
                  <div className="box-title solution-title">🔧 Technical Components</div>
                  <div className="box-content">
                    • Protocol Layer (JSON-RPC 2.0)<br/>
                    • Transport Layer (Stdio/HTTP)<br/>
                    • Resource Management<br/>
                    • Tool Execution Engine<br/>
                    • Prompt Template System
                  </div>
                </div>
                <div className="solution-box">
                  <div className="box-title solution-title">🛡️ Enterprise Features</div>
                  <div className="box-content">
                    • Message validation & schemas<br/>
                    • Error handling & recovery<br/>
                    • Progress reporting<br/>
                    • Connection lifecycle management<br/>
                    • Security & authentication
                  </div>
                </div>
              </div>

              <div className="pros-cons-grid">
                <div className="pros-box">
                  <div className="pros-title">🎯 MCP Advantages</div>
                  <ul className="pros-cons-list">
                    <li className="pros-cons-item pros-item">Universal AI integration standard</li>
                    <li className="pros-cons-item pros-item">Dynamic capability discovery</li>
                    <li className="pros-cons-item pros-item">Multi-modal resource support</li>
                    <li className="pros-cons-item pros-item">Built-in security model</li>
                    <li className="pros-cons-item pros-item">Ecosystem of pre-built servers</li>
                  </ul>
                </div>
                <div className="cons-box">
                  <div className="cons-title">⚠️ Implementation Considerations</div>
                  <ul className="pros-cons-list">
                    <li className="pros-cons-item cons-item">New protocol adoption curve</li>
                    <li className="pros-cons-item cons-item">Initial server development effort</li>
                    <li className="pros-cons-item cons-item">Client compatibility requirements</li>
                    <li className="pros-cons-item cons-item">Protocol version management</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Code Examples Section */}
          <div className="code-examples-section">
            <div className="section-title">
              <span>💻</span>
              Complete MCP Implementation Workflow
            </div>

            <div className="code-grid">
              {/* MCP Server with Tools */}
              <div className="code-example">
                <div className="code-header">🔧 MCP Server with Tools</div>
                <div className="code-content">
                  <pre><code>{`// TypeScript MCP Server Implementation
import { Server } from "@modelcontextprotocol/sdk/server";

const server = new Server({
  name: "enterprise-server",
  version: "1.0.0"
}, {
  capabilities: {
    tools: {},
    resources: {},
    prompts: {}
  }
});

// Define enterprise tools
server.setRequestHandler(ListToolsRequestSchema, 
  async () => {
    return {
      tools: [{
        name: "execute_sql_query",
        description: "Execute database queries",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string" },
            database: { type: "string" }
          }
        }
      }]
    };
  });`}</code></pre>
                </div>
              </div>

              {/* MCP Resource Management */}
              <div className="code-example">
                <div className="code-header">📁 Resource Management</div>
                <div className="code-content">
                  <pre><code>{`# Python MCP Resource Implementation
from mcp.server import Server
import mcp.types as types

app = Server("enterprise-server")

@app.list_resources()
async def list_resources() -> list[types.Resource]:
    return [
        types.Resource(
            uri="database://customers/table",
            name="Customer Database",
            mimeType="application/json"
        ),
        types.Resource(
            uri="file:///logs/app.log",
            name="Application Logs",
            mimeType="text/plain"
        )
    ]

@app.read_resource()
async def read_resource(uri: AnyUrl) -> str:
    if str(uri) == "database://customers/table":
        data = await fetch_customer_data()
        return json.dumps(data)`}</code></pre>
                </div>
              </div>

              {/* Additional code examples would continue here... */}
            </div>
          </div>

          {/* Reference Materials Section */}
          <div className="reference-materials">
            <div className="section-title">
              <span>📚</span>
              Reference Materials & Enterprise Resources
            </div>

            <div className="reference-grid">
              {/* Official MCP Resources */}
              <div className="reference-category">
                <div className="category-title">
                  <span>🏛️</span>
                  Official MCP Resources
                </div>
                <ul className="reference-links">
                  <li className="reference-link">
                    <a href="https://github.com/modelcontextprotocol" target="_blank" rel="noopener noreferrer">Official Repository</a>
                  </li>
                  <li className="reference-link">
                    <a href="https://modelcontextprotocol.io/introduction" target="_blank" rel="noopener noreferrer">Official Introduction</a>
                  </li>
                  <li className="reference-link">
                    <a href="https://github.com/modelcontextprotocol/servers" target="_blank" rel="noopener noreferrer">Official Servers</a>
                  </li>
                  <li className="reference-link">
                    <a href="https://modelcontextprotocol.io/clients" target="_blank" rel="noopener noreferrer">Official Clients</a>
                  </li>
                  <li className="reference-link">
                    <a href="https://github.com/modelcontextprotocol/inspector" target="_blank" rel="noopener noreferrer">MCP Inspector Tool</a>
                  </li>
                </ul>
              </div>

              {/* Community & Aggregators */}
              <div className="reference-category">
                <div className="category-title">
                  <span>🌐</span>
                  Community & Aggregators
                </div>
                <ul className="reference-links">
                  <li className="reference-link">
                    <a href="https://docs.cursor.com/tools" target="_blank" rel="noopener noreferrer">Cursor Tools List</a>
                  </li>
                  <li className="reference-link">
                    <a href="https://github.com/punkpeye/awesome-mcp-servers" target="_blank" rel="noopener noreferrer">Awesome MCP Servers (3500+)</a>
                  </li>
                  <li className="reference-link">
                    <a href="https://github.com/punkpeye/awesome-mcp-clients" target="_blank" rel="noopener noreferrer">Awesome MCP Clients</a>
                  </li>
                  <li className="reference-link">
                    <a href="https://www.apollographql.com/docs" target="_blank" rel="noopener noreferrer">MCP GraphQL Server by Apollo</a>
                  </li>
                </ul>
              </div>

              {/* Enterprise Deployment */}
              <div className="reference-category enterprise-patterns">
                <div className="category-title">
                  <span>🏢</span>
                  Enterprise Deployment
                </div>
                <ul className="reference-links">
                  <li className="reference-link">
                    <a href="https://mcp-use.com" target="_blank" rel="noopener noreferrer">MCP-USE: Build & Deploy Agents</a>
                  </li>
                  <li className="reference-link">
                    <a href="https://github.com/mcp-use/mcp-use?tab=readme-ov-file" target="_blank" rel="noopener noreferrer">MCP-USE: Connect LLM to MCP</a>
                  </li>
                  <li className="reference-link">
                    <span style={{color: '#86efac'}}>• Security & Orchestration</span>
                  </li>
                  <li className="reference-link">
                    <span style={{color: '#86efac'}}>• Management & Discovery</span>
                  </li>
                  <li className="reference-link">
                    <span style={{color: '#86efac'}}>• CI/CD Pipeline Integration</span>
                  </li>
                  <li className="reference-link">
                    <span style={{color: '#86efac'}}>• MCP Proxy & Lifecycle Mgmt</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Modal for Image Viewing */}
        <div id="imageModal" className="modal">
          <span className="modal-close">&times;</span>
          <img className="modal-content" id="modalImage" alt="" />
          <div id="modalCaption" className="modal-caption"></div>
        </div>
      </div>
    </div>
  );
};

export default Architecture; 