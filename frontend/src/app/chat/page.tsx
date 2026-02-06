"use client";

import { MessageThreadFull } from "@/components/tambo/message-thread-full";
import { useMcpServers } from "@/components/tambo/mcp-config-modal";
import { components, tools } from "@/lib/tambo";
import { TamboProvider } from "@tambo-ai/react";
import { ShoppingBag, Sparkles } from "lucide-react";
import { UIPanelProvider } from "@/contexts/ui-panel-context";
import { UIPanel } from "@/components/ui-panel";

/**
 * ShopSage AI - Professional E-commerce Chat Interface with Split View
 * Left: Chat conversation (40%)
 * Right: UI components panel (60%)
 */
export default function Home() {
  // Load MCP server configurations
  const mcpServers = useMcpServers();

  return (
    <UIPanelProvider>
      <TamboProvider
        apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
        components={components}
        tools={tools}
        tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
        mcpServers={mcpServers}
        agentBackendUrl={process.env.NEXT_PUBLIC_AGENT_BACKEND_URL || 'http://localhost:8000/chat'}
      >
        <div className="h-screen w-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
          {/* Professional Header */}
          <div className="bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-md">
                    <ShoppingBag className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      ShopSage AI
                    </h1>
                    <p className="text-xs text-gray-500">Powered by Tambo & Gemini</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">AI Shopping Assistant</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Split View: Chat (40%) + UI Panel (60%) */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left: Chat Conversation */}
            <div className="w-[40%] h-full border-r border-slate-200 bg-white chat-only-view">
              <MessageThreadFull />
            </div>
            
            {/* Right: UI Components Panel */}
            <div className="w-[60%] h-full">
              <UIPanel />
            </div>
          </div>
        </div>
      </TamboProvider>
    </UIPanelProvider>
  );
}


