// import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Markets from './pages/Markets';
import Assets from './pages/Assets';
import Analysis from './pages/Analysis';
import ChatInterface from './pages/ChatInterface';
import MCPTester from './pages/MCPTester';
import APIExplorer from './pages/APIExplorer';
import Tutorial from './pages/Tutorial';
import Architecture from './pages/Architecture';
import Presentations from './pages/Presentations';
import SlideViewer from './pages/SlideViewer';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Layout>
            <Routes>
              <Route path="/" element={<ChatInterface />} />
              <Route path="/markets" element={<Markets />} />
              <Route path="/assets" element={<Assets />} />
              <Route path="/analysis" element={<Analysis />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/mcp-tester" element={<MCPTester />} />
              <Route path="/api-explorer" element={<APIExplorer />} />
              <Route path="/tutorial" element={<Tutorial />} />
              <Route path="/architecture" element={<Architecture />} />
              <Route path="/presentations" element={<Presentations />} />
              <Route path="/slide/:slideId" element={<SlideViewer />} />
            </Routes>
          </Layout>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App; 