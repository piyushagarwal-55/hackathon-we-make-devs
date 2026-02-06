"use client";

import React, { useRef, useEffect } from 'react';
import { useUIPanel } from '@/contexts/ui-panel-context';

/**
 * HOC that wraps Tambo components to intercept their rendering
 * and display them in the right panel instead of inline
 */
export function withPanelRendering<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) {
  console.log(`🏗️ [withPanelRendering] Creating wrapper for: ${componentName}`);
  
  const WrappedComponent = (props: P) => {
    console.log(`🎨 [WrappedComponent] ${componentName} RENDER START`);
    console.log(`📊 [WrappedComponent] Props:`, props);
    
    const { setComponent } = useUIPanel();
    const prevPropsRef = useRef<string>('');
    
    console.log(`🔗 [WrappedComponent] useUIPanel hook obtained, setComponent:`, typeof setComponent);

    // Send component to right panel whenever props change
    useEffect(() => {
      const currentPropsString = JSON.stringify(props);
      
      // Only update if props actually changed
      if (currentPropsString !== prevPropsRef.current) {
        console.log(`⚡ [WrappedComponent] Props changed for ${componentName}`);
        console.log(`📤 [WrappedComponent] Calling setComponent(${componentName}, props)`);
        
        try {
          setComponent(componentName, props);
          prevPropsRef.current = currentPropsString;
          console.log(`✅ [WrappedComponent] setComponent called successfully`);
        } catch (error) {
          console.error(`❌ [WrappedComponent] Error calling setComponent:`, error);
        }
      } else {
        console.log(`⏭️ [WrappedComponent] Props unchanged for ${componentName}`);
      }
    }); // Run on every render to check for prop changes

    console.log(`🎯 [WrappedComponent] Returning notification div for ${componentName}`);
    
    // Return a notification message for the chat instead of the full component
    return (
      <div className="component-notification">
        <span className="font-medium">📊 {componentName}</span> displayed in preview panel →
      </div>
    );
  };

  WrappedComponent.displayName = `WithPanel(${componentName})`;
  console.log(`✅ [withPanelRendering] Wrapper created for: ${componentName}`);
  
  return WrappedComponent;
}
