"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FloatingCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  accentColor?: "violet" | "purple" | "indigo" | "pink" | "blue" | "cyan";
  delay?: number;
}

export function FloatingCard({
  icon,
  title,
  description,
  accentColor = "indigo",
  delay = 0,
}: FloatingCardProps) {
  const colorClasses = {
    violet: {
      border: "border-violet-200 hover:border-violet-300",
      iconBg: "bg-violet-500/10",
      iconColor: "text-violet-600",
      gradient: "from-violet-500/5 to-purple-500/5",
    },
    purple: {
      border: "border-purple-200 hover:border-purple-300",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-600",
      gradient: "from-purple-500/5 to-pink-500/5",
    },
    indigo: {
      border: "border-indigo-200 hover:border-indigo-300",
      iconBg: "bg-indigo-500/10",
      iconColor: "text-indigo-600",
      gradient: "from-indigo-500/5 to-violet-500/5",
    },
    pink: {
      border: "border-pink-200 hover:border-pink-300",
      iconBg: "bg-pink-500/10",
      iconColor: "text-pink-600",
      gradient: "from-pink-500/5 to-purple-500/5",
    },
    blue: {
      border: "border-blue-200 hover:border-blue-300",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600",
      gradient: "from-blue-500/5 to-cyan-500/5",
    },
    cyan: {
      border: "border-cyan-200 hover:border-cyan-300",
      iconBg: "bg-cyan-500/10",
      iconColor: "text-cyan-600",
      gradient: "from-cyan-500/5 to-blue-500/5",
    },
  };

  const colors = colorClasses[accentColor];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -5 }}
      className={`group relative overflow-hidden p-8 rounded-2xl bg-white backdrop-blur-xl border ${colors.border} hover:shadow-xl transition-all`}
    >
      {/* Gradient overlay on hover */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${colors.gradient}`}
      />

      {/* Content */}
      <div className="relative z-10">
        <motion.div
          whileHover={{ rotate: 5, scale: 1.1 }}
          className={`w-12 h-12 rounded-xl ${colors.iconBg} flex items-center justify-center mb-6 ${colors.iconColor}`}
        >
          {icon}
        </motion.div>

        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}
