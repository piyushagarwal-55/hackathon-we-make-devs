"use client";

import { useState, useRef, useEffect } from 'react';
import { GripVertical } from 'lucide-react';

interface ResizablePanelProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  defaultLeftWidth?: number; // percentage
  minLeftWidth?: number; // percentage
  maxLeftWidth?: number; // percentage
}

export function ResizablePanel({
  leftPanel,
  rightPanel,
  defaultLeftWidth = 40,
  minLeftWidth = 20,
  maxLeftWidth = 80,
}: ResizablePanelProps) {
  const [leftWidth, setLeftWidth] = useState(defaultLeftWidth);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;

    // Clamp the width between min and max
    const clampedWidth = Math.max(minLeftWidth, Math.min(maxLeftWidth, newLeftWidth));
    setLeftWidth(clampedWidth);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging]);

  return (
    <div ref={containerRef} className="flex h-full w-full overflow-hidden">
      {/* Left Panel */}
      <div
        style={{ width: `${leftWidth}%` }}
        className="h-full overflow-hidden"
      >
        {leftPanel}
      </div>

      {/* Resizable Divider */}
      <div
        className={`
          relative flex items-center justify-center w-1 bg-slate-200 
          hover:bg-blue-500 hover:w-1.5 transition-all duration-200 
          cursor-col-resize group
          ${isDragging ? 'bg-blue-500 w-1.5' : ''}
        `}
        onMouseDown={handleMouseDown}
      >
        <div className={`
          absolute inset-y-0 -left-1 -right-1 flex items-center justify-center
          ${isDragging ? 'bg-blue-500/10' : 'group-hover:bg-blue-500/10'}
        `}>
          <GripVertical 
            className={`
              w-4 h-4 text-slate-400 
              ${isDragging ? 'text-blue-600' : 'group-hover:text-blue-600'}
              transition-colors
            `} 
          />
        </div>
      </div>

      {/* Right Panel */}
      <div
        style={{ width: `${100 - leftWidth}%` }}
        className="h-full overflow-hidden"
      >
        {rightPanel}
      </div>
    </div>
  );
}
