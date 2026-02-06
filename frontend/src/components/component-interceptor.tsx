"use client";

import React, { useEffect, useRef } from "react";
import { useTambo } from "@tambo-ai/react";
import { useUIPanel } from "@/contexts/ui-panel-context";

/**
 * Component Interceptor Hook
 * Listens to Tambo messages and extracts UI components to display in the right panel
 */
export function ComponentInterceptor() {
  const { messages } = useTambo(); // ✅ replaces useThread
  const { setComponent } = useUIPanel();
  const lastProcessedRef = useRef<number>(-1);

  useEffect(() => {
    console.log('🔄 [ComponentInterceptor] Effect triggered');
    console.log('📊 [ComponentInterceptor] Total messages:', messages?.length || 0);
    
    if (!messages?.length) {
      console.log('⚠️ [ComponentInterceptor] No messages found, exiting');
      return;
    }

    // Get the last message
    const currentIndex = messages.length - 1;
    const lastMessage = messages[currentIndex];
    
    console.log('📝 [ComponentInterceptor] Last message index:', currentIndex);
    console.log('📝 [ComponentInterceptor] Last processed index:', lastProcessedRef.current);
    console.log('📝 [ComponentInterceptor] Last message role:', lastMessage?.role);
    console.log('📝 [ComponentInterceptor] Last message full object:', JSON.stringify(lastMessage, null, 2));

    // Skip if we already processed this message
    if (currentIndex === lastProcessedRef.current) {
      console.log('⏭️ [ComponentInterceptor] Already processed this message, skipping');
      return;
    }

    if (!lastMessage || lastMessage.role !== "assistant") {
      console.log('❌ [ComponentInterceptor] Last message is not from assistant, exiting');
      return;
    }

    const content = lastMessage.content;
    console.log('📦 [ComponentInterceptor] Content type:', typeof content);
    console.log('📦 [ComponentInterceptor] Content is array?:', Array.isArray(content));
    console.log('📦 [ComponentInterceptor] Content value:', JSON.stringify(content, null, 2));

    // Tambo content can be string or array of content blocks
    if (Array.isArray(content)) {
      console.log('📚 [ComponentInterceptor] Processing array content with', content.length, 'blocks');
      
      content.forEach((block: any, idx: number) => {
        console.log(`  Block ${idx}:`, {
          type: block.type,
          hasComponent: !!block.component,
          hasName: !!block.name,
          hasProps: !!block.props,
          fullBlock: JSON.stringify(block, null, 2)
        });
      });
      
      const componentBlock = content.find(
        (block: any) => block.type === "component" || (block.component && block.props)
      );

      if (componentBlock) {
        const componentName = componentBlock.component || componentBlock.name;
        const componentProps = componentBlock.props || componentBlock.data || {};

        console.log("✅ [ComponentInterceptor] Found component:", componentName);
        console.log("✅ [ComponentInterceptor] Component props:", componentProps);
        console.log("🎯 [ComponentInterceptor] Calling setComponent now...");

        setComponent(componentName, componentProps);
        lastProcessedRef.current = currentIndex;
        
        console.log("✅ [ComponentInterceptor] setComponent called successfully");
      } else {
        console.log('❌ [ComponentInterceptor] No component block found in array');
      }
    } else if (typeof content === "object" && content !== null) {
      console.log('🔷 [ComponentInterceptor] Processing object content');
      console.log('🔷 [ComponentInterceptor] Has component?', !!(content as any).component);
      console.log('🔷 [ComponentInterceptor] Has name?', !!(content as any).name);
      
      if ((content as any).component || (content as any).name) {
        const componentName = (content as any).component || (content as any).name;
        const componentProps = (content as any).props || (content as any).data || {};

        console.log("✅ [ComponentInterceptor] Found component (object):", componentName);
        console.log("✅ [ComponentInterceptor] Component props:", componentProps);
        console.log("🎯 [ComponentInterceptor] Calling setComponent now...");

        setComponent(componentName, componentProps);
        lastProcessedRef.current = currentIndex;
        
        console.log("✅ [ComponentInterceptor] setComponent called successfully");
      } else {
        console.log('❌ [ComponentInterceptor] Object content has no component or name property');
      }
    } else {
      console.log('❌ [ComponentInterceptor] Content is neither array nor object');
      console.log('❌ [ComponentInterceptor] Content type:', typeof content);
    }
  }, [messages, setComponent]);

  return null;
}
