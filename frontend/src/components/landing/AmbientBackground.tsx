"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

export function AmbientBackground() {
  const { scrollYProgress } = useScroll();
  const prefersReducedMotion = useReducedMotion();
  
  // Scroll-responsive glow
  const glowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.04, 0.02, 0.05]);

  if (prefersReducedMotion) {
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-white via-indigo-50/30 to-purple-50/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.04),transparent_50%)]" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden will-change-transform">
      {/* Base gradient - light theme */}
      <div className="absolute inset-0 bg-linear-to-br from-white via-indigo-50/30 to-purple-50/20" />
      
      {/* Primary radial glow - indigo/purple theme */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.05),transparent_50%)] animate-glow-pulse"
        style={{ willChange: "opacity" }}
      />
      
      {/* Secondary glow - blue */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(59,130,246,0.03),transparent_50%)]" />
      
      {/* Tertiary glow - purple accent */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(168,85,247,0.02),transparent_50%)]" />

      {/* Scroll-responsive indigo glow layer */}
      <motion.div
        style={{ opacity: glowOpacity }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(99,102,241,0.08),transparent_60%)]"
      />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99,102,241,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.02) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />
      
      {/* Top edge glow for hero */}
      <div className="absolute top-0 left-0 right-0 h-125 bg-linear-to-b from-indigo-500/2 via-transparent to-transparent animate-glow-subtle" />
    </div>
  );
}
