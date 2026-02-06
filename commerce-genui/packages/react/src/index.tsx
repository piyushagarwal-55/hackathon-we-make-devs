/**
 * Commerce GenUI - React Hooks & Provider
 * Integrate Commerce GenUI SDK with React and Tambo AI
 */

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import type {
  UIDecision,
  CommerceContext,
  ChatMessage,
  UseCommerceGenUIReturn,
  CommerceGenUIConfig,
  ChatResponse,
  ChatRequest
} from '@commerce-genui/types';

/**
 * Commerce GenUI Context
 */
interface CommerceGenUIContextValue extends UseCommerceGenUIReturn {
  config: CommerceGenUIConfig;
}

const CommerceGenUIContext = createContext<CommerceGenUIContextValue | null>(null);

/**
 * Commerce GenUI Provider Props
 */
interface CommerceGenUIProviderProps {
  children: ReactNode;
  backendUrl: string;
  tamboApiKey?: string;
  components?: Record<string, React.ComponentType<any>>;
  debug?: boolean;
  initialContext?: CommerceContext;
}

/**
 * Main Provider Component
 * 
 * @example
 * ```tsx
 * import { CommerceGenUIProvider } from '@commerce-genui/react';
 * import * as Components from '@commerce-genui/components';
 * 
 * function App() {
 *   return (
 *     <CommerceGenUIProvider
 *       backendUrl="http://localhost:8000"
 *       components={Components}
 *     >
 *       <YourApp />
 *     </CommerceGenUIProvider>
 *   );
 * }
 * ```
 */
export function CommerceGenUIProvider({
  children,
  backendUrl,
  tamboApiKey,
  components = {},
  debug = false,
  initialContext = {}
}: CommerceGenUIProviderProps) {
  const [decision, setDecision] = useState<UIDecision | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [context, setContext] = useState<CommerceContext>(initialContext);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const config: CommerceGenUIConfig = {
    backendUrl,
    tamboApiKey,
    components,
    debug
  };

  /**
   * Send message to backend and get UI decision
   */
  const sendMessage = useCallback(async (
    message: string,
    customContext?: CommerceContext
  ): Promise<UIDecision> => {
    setLoading(true);
    setError(null);

    try {
      // Merge custom context with current context
      const finalContext = { ...context, ...customContext };

      // Add user message to history
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: message,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, userMessage]);

      // Call backend API
      const response = await fetch(`${backendUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(tamboApiKey && { 'Authorization': `Bearer ${tamboApiKey}` })
        },
        body: JSON.stringify({
          message,
          context: finalContext
        } as ChatRequest)
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data: ChatResponse = await response.json();

      // Build UI decision
      const uiDecision: UIDecision = {
        intent: data.ui_component as any, // Will be mapped from backend
        component: data.ui_component,
        reason: data.ui_reason,
        data: data.ui_props,
        confidence: 0.95, // Backend should provide this
        alternatives: [],
        userMessage: message,
        agentResponse: data.agent_response
      };

      setDecision(uiDecision);

      // Update context from backend
      if (data.context) {
        setContext(data.context);
      }

      // Add assistant message to history
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.agent_response,
        timestamp: new Date().toISOString(),
        uiDecision
      };
      setMessages(prev => [...prev, assistantMessage]);

      if (debug) {
        console.log('[Commerce GenUI] Decision:', uiDecision);
      }

      return uiDecision;

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      
      if (debug) {
        console.error('[Commerce GenUI] Error:', error);
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  }, [backendUrl, tamboApiKey, context, debug]);

  /**
   * Update context
   */
  const updateContext = useCallback((updates: Partial<CommerceContext>) => {
    setContext(prev => ({ ...prev, ...updates }));
    
    if (debug) {
      console.log('[Commerce GenUI] Context updated:', updates);
    }
  }, [debug]);

  const value: CommerceGenUIContextValue = {
    sendMessage,
    decision,
    loading,
    error,
    context,
    updateContext,
    messages,
    config
  };

  return (
    <CommerceGenUIContext.Provider value={value}>
      {children}
    </CommerceGenUIContext.Provider>
  );
}

/**
 * Hook to access Commerce GenUI
 * 
 * @example
 * ```tsx
 * function ChatInterface() {
 *   const { sendMessage, decision, loading } = useCommerceGenUI();
 *   
 *   const handleMessage = async (msg: string) => {
 *     await sendMessage(msg);
 *   };
 *   
 *   return <div>{decision?.component}</div>;
 * }
 * ```
 */
export function useCommerceGenUI(): UseCommerceGenUIReturn {
  const context = useContext(CommerceGenUIContext);
  
  if (!context) {
    throw new Error('useCommerceGenUI must be used within CommerceGenUIProvider');
  }

  return context;
}

/**
 * Hook to get current UI decision
 */
export function useUIDecision(): UIDecision | null {
  const { decision } = useCommerceGenUI();
  return decision;
}

/**
 * Hook to get current context
 */
export function useCommerceContext(): [CommerceContext, (updates: Partial<CommerceContext>) => void] {
  const { context, updateContext } = useCommerceGenUI();
  return [context, updateContext];
}

/**
 * Hook to get chat messages
 */
export function useChatMessages(): ChatMessage[] {
  const { messages } = useCommerceGenUI();
  return messages;
}

/**
 * Export types
 */
export type {
  CommerceGenUIConfig,
  UseCommerceGenUIReturn,
  CommerceGenUIProviderProps
};

// Re-export types from @commerce-genui/types
export type {
  UIDecision,
  CommerceContext,
  ChatMessage,
  Product,
  CartItem,
  User,
  Order
} from '@commerce-genui/types';

export { CommerceIntent } from '@commerce-genui/types';
