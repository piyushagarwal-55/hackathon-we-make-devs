"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';

interface UIComponent {
  name: string;
  props: any;
  timestamp: number;
}

interface UIPanelContextType {
  currentComponent: UIComponent | null;
  setComponent: (name: string, props: any) => void;
  clearComponent: () => void;
}

const UIPanelContext = createContext<UIPanelContextType | undefined>(undefined);

export function UIPanelProvider({ children }: { children: React.ReactNode }) {
  const [currentComponent, setCurrentComponent] = useState<UIComponent | null>(null);

  const setComponent = useCallback((name: string, props: any) => {
    console.log(`📥 [UIPanelContext] Setting component: ${name}`);
    
    const newComponent = {
      name,
      props,
      timestamp: Date.now(),
    };
    
    setCurrentComponent(newComponent);
  }, []);

  const clearComponent = useCallback(() => {
    console.log('🗑️ [UIPanelContext] Clearing component');
    setCurrentComponent(null);
  }, []);

  return (
    <UIPanelContext.Provider value={{ currentComponent, setComponent, clearComponent }}>
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
