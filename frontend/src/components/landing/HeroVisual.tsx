"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ShoppingCart, Package, CreditCard, TrendingUp, Tag, Eye, Sparkles, BarChart3 } from "lucide-react";

interface HeroVisualProps {
  className?: string;
}

// E-commerce workflow examples
const workflowExamples = [
  {
    id: "shop",
    title: "Product Discovery",
    nodes: [
      { icon: Package, label: "Browse", x: 50, y: 15 },
      { icon: Tag, label: "Filter", x: 25, y: 45 },
      { icon: TrendingUp, label: "Sort", x: 75, y: 45 },
      { icon: Eye, label: "View", x: 50, y: 78 },
    ],
    connections: [
      { from: { x: 50, y: 22 }, to: { x: 30, y: 40 } },
      { from: { x: 50, y: 22 }, to: { x: 70, y: 40 } },
      { from: { x: 30, y: 52 }, to: { x: 50, y: 72 } },
      { from: { x: 70, y: 52 }, to: { x: 50, y: 72 } },
    ],
    color: "indigo",
  },
  {
    id: "compare",
    title: "Smart Comparison",
    nodes: [
      { icon: Package, label: "Products", x: 50, y: 15 },
      { icon: BarChart3, label: "Compare", x: 25, y: 45 },
      { icon: Sparkles, label: "AI Insight", x: 75, y: 45 },
      { icon: ShoppingCart, label: "Choose", x: 50, y: 78 },
    ],
    connections: [
      { from: { x: 50, y: 22 }, to: { x: 30, y: 40 } },
      { from: { x: 50, y: 22 }, to: { x: 70, y: 40 } },
      { from: { x: 30, y: 52 }, to: { x: 50, y: 72 } },
      { from: { x: 70, y: 52 }, to: { x: 50, y: 72 } },
    ],
    color: "purple",
  },
  {
    id: "checkout",
    title: "Quick Checkout",
    nodes: [
      { icon: ShoppingCart, label: "Cart", x: 50, y: 15 },
      { icon: Tag, label: "Discount", x: 25, y: 45 },
      { icon: CreditCard, label: "Payment", x: 75, y: 45 },
      { icon: Package, label: "Order", x: 50, y: 78 },
    ],
    connections: [
      { from: { x: 50, y: 22 }, to: { x: 30, y: 40 } },
      { from: { x: 50, y: 22 }, to: { x: 70, y: 40 } },
      { from: { x: 30, y: 52 }, to: { x: 50, y: 72 } },
      { from: { x: 70, y: 52 }, to: { x: 50, y: 72 } },
    ],
    color: "blue",
  },
];

export function HeroVisual({ className = "" }: HeroVisualProps) {
  const [activeWorkflow, setActiveWorkflow] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWorkflow((prev) => (prev + 1) % workflowExamples.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const workflow = workflowExamples[activeWorkflow];

  const getColorClass = (color: string) => {
    const colors: Record<string, { border: string; bg: string; glow: string; text: string }> = {
      indigo: { border: "border-indigo-500/40", bg: "bg-indigo-500/10", glow: "shadow-indigo-500/20", text: "text-indigo-600" },
      purple: { border: "border-purple-500/40", bg: "bg-purple-500/10", glow: "shadow-purple-500/20", text: "text-purple-600" },
      blue: { border: "border-blue-500/40", bg: "bg-blue-500/10", glow: "shadow-blue-500/20", text: "text-blue-600" },
    };
    return colors[color] || colors.indigo;
  };

  const colorClass = getColorClass(workflow.color);

  return (
    <div className={`relative w-full h-100 ${className}`}>
      {/* Background glow */}
      <div className="absolute inset-0 bg-linear-to-br from-indigo-500/5 via-purple-500/5 to-blue-500/5 rounded-3xl blur-3xl" />

      {/* Main visual container */}
      <div className="relative h-full rounded-2xl bg-white/80 border border-gray-200 backdrop-blur-xl overflow-hidden shadow-lg">
        {/* Header */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={workflow.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="text-xs text-gray-600 font-medium"
            >
              {workflow.title}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Workflow Visualization SVG */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(99, 102, 241, 0.3)" />
              <stop offset="100%" stopColor="rgba(99, 102, 241, 0.1)" />
            </linearGradient>
          </defs>

          <AnimatePresence mode="wait">
            <motion.g
              key={workflow.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Connections */}
              {workflow.connections.map((conn, i) => (
                <motion.line
                  key={i}
                  x1={conn.from.x}
                  y1={conn.from.y}
                  x2={conn.to.x}
                  y2={conn.to.y}
                  stroke="url(#connectionGradient)"
                  strokeWidth="0.3"
                  strokeDasharray="2,2"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                />
              ))}
            </motion.g>
          </AnimatePresence>
        </svg>

        {/* Nodes */}
        <AnimatePresence mode="wait">
          {workflow.nodes.map((node, i) => {
            const Icon = node.icon;
            return (
              <motion.div
                key={`${workflow.id}-${i}`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="absolute"
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`relative flex flex-col items-center gap-2 p-3 rounded-xl ${colorClass.bg} ${colorClass.border} border backdrop-blur-xl shadow-lg ${colorClass.glow}`}
                >
                  <Icon className={`w-5 h-5 ${colorClass.text}`} />
                  <span className="text-[10px] text-gray-700 font-medium whitespace-nowrap">
                    {node.label}
                  </span>
                  {/* Pulse effect */}
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-indigo-400/20"
                    initial={{ opacity: 0, scale: 1 }}
                    animate={{ opacity: [0, 0.3, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Workflow indicator dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {workflowExamples.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveWorkflow(i)}
              className="relative group"
            >
              <div
                className={`h-1.5 rounded-full transition-all ${
                  i === activeWorkflow ? "bg-indigo-600 w-6" : "bg-gray-300 hover:bg-gray-400 w-1.5"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
