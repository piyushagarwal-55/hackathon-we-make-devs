"use client";

import { motion } from "framer-motion";
import { ArrowRight, Code2, Cpu, Layout } from "lucide-react";
import { SectionReveal } from "./SectionReveal";

export function HowItWorks() {
  return (
    <section className="py-24 lg:py-32 bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-indigo-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16 lg:mb-20">
          <SectionReveal>
            <p className="text-xs font-semibold text-indigo-600/80 uppercase tracking-[0.2em] mb-4">
              HOW IT WORKS
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Commerce GenUI <span className="text-indigo-600">SDK</span>
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              Our decision engine analyzes user intent and dynamically renders the perfect UI components for each interaction
            </p>
          </SectionReveal>
        </div>

        {/* 3-Step Flow */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6 max-w-6xl mx-auto items-start">
          {/* Step 1: User Input */}
          <SectionReveal className="relative" direction="left">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 h-full">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/10 mb-6">
                <Code2 className="text-indigo-600" size={32} strokeWidth={1.5} />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                1. User Input
              </h3>
              
              <p className="text-gray-600 mb-6">
                User sends natural language query through the chat interface
              </p>

              {/* Code example */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 font-mono text-xs">
                <div className="text-gray-500 mb-2">// User query</div>
                <div className="text-indigo-600">"Show me Nike shoes</div>
                <div className="text-indigo-600 ml-4">under $150"</div>
              </div>

              {/* Visual indicator */}
              <div className="mt-6 flex items-center gap-2">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                />
              </div>
            </div>

            {/* Arrow - Desktop */}
            <div className="hidden lg:block absolute top-1/2 -right-8 transform -translate-y-1/2 z-20">
              <motion.div
                initial={{ x: -10, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <ArrowRight size={48} className="text-indigo-400" strokeWidth={1.5} />
              </motion.div>
            </div>

            {/* Arrow - Mobile */}
            <div className="lg:hidden flex justify-center my-4">
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="rotate-90"
              >
                <ArrowRight size={40} className="text-indigo-400" strokeWidth={1.5} />
              </motion.div>
            </div>
          </SectionReveal>

          {/* Step 2: SDK Decides */}
          <SectionReveal className="relative">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 shadow-xl text-white h-full">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 mb-6">
                <Cpu className="text-white" size={32} strokeWidth={1.5} />
              </div>
              
              <h3 className="text-2xl font-bold mb-4">
                2. SDK Analyzes
              </h3>
              
              <p className="text-indigo-50 mb-6">
                Commerce GenUI SDK processes intent and determines optimal UI components
              </p>

              {/* Decision tree */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 space-y-3">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white/10 rounded-lg p-2 text-sm"
                >
                  ✓ Intent: Product Search
                </motion.div>
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white/10 rounded-lg p-2 text-sm"
                >
                  ✓ Filter: Brand, Price
                </motion.div>
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="bg-white/10 rounded-lg p-2 text-sm"
                >
                  ✓ UI: Product Grid
                </motion.div>
              </div>

              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-400/20 to-purple-400/20 blur-xl -z-10" />
            </div>

            {/* Arrow - Desktop */}
            <div className="hidden lg:block absolute top-1/2 -right-8 transform -translate-y-1/2 z-20">
              <motion.div
                initial={{ x: -10, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <ArrowRight size={48} className="text-indigo-400" strokeWidth={1.5} />
              </motion.div>
            </div>

            {/* Arrow - Mobile */}
            <div className="lg:hidden flex justify-center my-4">
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="rotate-90"
              >
                <ArrowRight size={40} className="text-indigo-400" strokeWidth={1.5} />
              </motion.div>
            </div>
          </SectionReveal>

          {/* Step 3: UI Renders */}
          <SectionReveal className="relative" direction="right">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 h-full">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-500/10 mb-6">
                <Layout className="text-purple-600" size={32} strokeWidth={1.5} />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                3. UI Renders
              </h3>
              
              <p className="text-gray-600 mb-6">
                Dynamic component renders with relevant products and filters
              </p>

              {/* Product grid preview */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="grid grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.9 + i * 0.1 }}
                      className="bg-white rounded-lg p-2 border border-gray-200"
                    >
                      <div className="aspect-square bg-gradient-to-br from-purple-100 to-indigo-100 rounded-md mb-2" />
                      <div className="h-2 bg-gray-200 rounded w-3/4 mb-1" />
                      <div className="h-2 bg-gray-100 rounded w-1/2" />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Check mark */}
              <div className="mt-6 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ type: "spring", delay: 1.3 }}
                  className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white"
                >
                  ✓
                </motion.div>
              </div>
            </div>
          </SectionReveal>
        </div>

        {/* SDK Benefits */}
        <div className="mt-20 max-w-4xl mx-auto">
          <SectionReveal>
            <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-lg border border-gray-200">
              <h4 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Why Commerce GenUI SDK?
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Intent-Driven",
                    description: "UI adapts to user goals, not predefined templates"
                  },
                  {
                    title: "Context-Aware",
                    description: "Remembers conversation history for better decisions"
                  },
                  {
                    title: "Extensible",
                    description: "Easy to add custom components and decision logic"
                  }
                ].map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-4xl font-bold text-indigo-600 mb-2">
                      {index + 1}
                    </div>
                    <h5 className="font-semibold text-gray-900 mb-2">
                      {benefit.title}
                    </h5>
                    <p className="text-sm text-gray-600">
                      {benefit.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
