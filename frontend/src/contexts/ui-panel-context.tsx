"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';

interface UIComponent {
  name: string;
  props: any;
  timestamp: number;
  id: string;
}

interface UIPanelContextType {
  currentComponent: UIComponent | null;
  componentHistory: UIComponent[];
  setComponent: (name: string, props: any) => UIComponent;
  restoreComponent: (id: string) => void;
  clearComponent: () => void;
}

const UIPanelContext = createContext<UIPanelContextType | undefined>(undefined);

export function UIPanelProvider({ children }: { children: React.ReactNode }) {
  const [currentComponent, setCurrentComponent] = useState<UIComponent | null>(null);
  const [componentHistory, setComponentHistory] = useState<UIComponent[]>([]);

  const setComponent = useCallback((name: string, props: any) => {
    console.log(`📥 [UIPanelContext] Setting component: ${name}`);
    
    const newComponent = {
      name,
      props,
      timestamp: Date.now(),
      id: `${name}-${Date.now()}-${Math.random().toString(36).substring(7)}`
    };
    
    setCurrentComponent(newComponent);
    setComponentHistory(prev => [...prev, newComponent]);
    console.log(`📚 Component added to history. Total: ${componentHistory.length + 1}`);
    
    return newComponent;
  }, [componentHistory.length]);

  const restoreComponent = useCallback((id: string) => {
    const component = componentHistory.find(c => c.id === id);
    if (component) {
      console.log(`🔄 Restoring component from history: ${component.name} (${id})`);
      setCurrentComponent(component);
    } else {
      console.warn(`⚠️ Component not found in history: ${id}`);
    }
  }, [componentHistory]);

  const clearComponent = useCallback(() => {
    console.log('🗑️ [UIPanelContext] Clearing component');
    setCurrentComponent(null);
  }, []);

  return (
    <UIPanelContext.Provider value={{ currentComponent, componentHistory, setComponent, restoreComponent, clearComponent }}>
      {children}
    </UIPanelContext.Provider>
  );
}

export function useUIPanel() {
  const context = useContext(UIPanelContext);
  if (!context) {
    throw new Error('useUIPanel must be used within UIPanelProvider');
  }
  return context;
}
