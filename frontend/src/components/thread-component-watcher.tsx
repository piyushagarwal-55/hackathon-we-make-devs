"use client";

import React, { useEffect, useRef } from "react";
import { useTambo } from "@tambo-ai/react";
import { useUIPanel } from "@/contexts/ui-panel-context";

/**
 * Thread Component Watcher
 * This component sits INSIDE the ThreadContent and has access to the actual messages
 */
export function ThreadComponentWatcher() {
  const tambo = useTambo();
  const { setComponent } = useUIPanel();
  const lastProcessedRef = useRef<number>(-1);

  useEffect(() => {
    console.log('🔄 [ThreadComponentWatcher] Effect triggered');
    console.log('📊 [ThreadComponentWatcher] Tambo object:', tambo);
    console.log('📊 [ThreadComponentWatcher] Tambo.messages:', tambo?.messages);
    console.log('📊 [ThreadComponentWatcher] Total messages:', tambo?.messages?.length || 0);
    
    if (!tambo?.messages?.length) {
      console.log('⚠️ [ThreadComponentWatcher] No messages found, exiting');
      return;
    }

    const messages = tambo.messages;
    const currentIndex = messages.length - 1;
    const lastMessage = messages[currentIndex];
    
    console.log('📝 [ThreadComponentWatcher] Last message index:', currentIndex);
    console.log('📝 [ThreadComponentWatcher] Last processed index:', lastProcessedRef.current);
    console.log('📝 [ThreadComponentWatcher] Last message:', lastMessage);

    // Skip if we already processed this message
    if (currentIndex === lastProcessedRef.current) {
      console.log('⏭️ [ThreadComponentWatcher] Already processed, skipping');
      return;
    }

    if (!lastMessage || lastMessage.role !== "assistant") {
      console.log('❌ [ThreadComponentWatcher] Not an assistant message');
      return;
    }

    const content = lastMessage.content;
    console.log('📦 [ThreadComponentWatcher] Content type:', typeof content);
    console.log('📦 [ThreadComponentWatcher] Content:', content);

    // Check for components in content
    if (Array.isArray(content)) {
      console.log('📚 [ThreadComponentWatcher] Content is array with', content.length, 'items');
      
      content.forEach((item: any, idx: number) => {
        console.log(`  📄 Item ${idx}:`, item);
      });
      
      // Find component block
      const componentBlock = content.find(
        (block: any) => block.type === "component" || block.component
      );

      if (componentBlock) {
        const componentName = componentBlock.component || componentBlock.name;
        const componentProps = componentBlock.props || {};

        console.log("✅ [ThreadComponentWatcher] FOUND COMPONENT!");
        console.log("🎨 Component name:", componentName);
        console.log("🎨 Component props:", componentProps);

        setComponent(componentName, componentProps);
        lastProcessedRef.current = currentIndex;
        
        console.log("✅ [ThreadComponentWatcher] Component set successfully!");
      } else {
        console.log("❌ [ThreadComponentWatcher] No component block found in array");
      }
    } else if (typeof content === 'object' && content !== null) {
      console.log('📦 [ThreadComponentWatcher] Content is object:', content);
      
      if (content.component || content.name) {
        const componentName = content.component || content.name;
        const componentProps = content.props || {};
        
        console.log("✅ [ThreadComponentWatcher] FOUND COMPONENT (object)!");
        console.log("🎨 Component name:", componentName);
        console.log("🎨 Component props:", componentProps);
        
        setComponent(componentName, componentProps);
        lastProcessedRef.current = currentIndex;
      }
    } else {
      console.log('📝 [ThreadComponentWatcher] Content is text only:', content);
    }
  }, [tambo?.messages, setComponent]);

  return null;
}
