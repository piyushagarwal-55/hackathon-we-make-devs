"use client";

import { motion } from "framer-motion";
import { 
  ShoppingCart, 
  Sparkles, 
  Zap, 
  TrendingUp,
  Shield,
  Globe,
  Code2,
  MessageSquare
} from "lucide-react";
import { SectionReveal } from "./SectionReveal";

// Feature data with visuals
const FEATURES = [
  {
    title: "Smart Product Discovery",
    description: "AI-powered search understands natural language queries and user intent to find exactly what you're looking for - even with vague descriptions.",
    icon: Sparkles,
    color: "indigo",
    visual: (
      <div className="relative w-full h-64 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 overflow-hidden">
        <div className="absolute right-4 top-4 text-indigo-200">
          <Sparkles size={120} strokeWidth={1} />
        </div>
        <div className="relative z-10 space-y-3">
          <div className="bg-white rounded-lg p-3 shadow-sm border border-indigo-100">
            <div className="text-xs text-gray-500 mb-1">User asks:</div>
            <div className="text-sm text-gray-700 font-medium">"Show me comfortable sneakers under $100"</div>
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-indigo-500 rounded-lg p-3 shadow-md"
          >
            <div className="text-xs text-indigo-100 mb-1">AI understands:</div>
            <div className="text-sm text-white font-medium">Budget: $0-100 • Style: Casual • Priority: Comfort</div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    title: "Dynamic UI Components",
    description: "Commerce GenUI SDK intelligently renders the right UI components based on user intent - comparison tables, product cards, or checkout flows.",
    icon: Code2,
    color: "violet",
    visual: (
      <div className="relative w-full h-64 bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-6 flex items-center justify-center overflow-hidden">
        <div className="absolute left-4 bottom-4 text-violet-200">
          <Code2 size={100} strokeWidth={1} />
        </div>
        <div className="relative z-10 grid grid-cols-3 gap-2">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg p-3 shadow-sm border border-violet-200"
          >
            <div className="w-full h-12 bg-violet-100 rounded mb-2" />
            <div className="h-2 bg-gray-200 rounded w-3/4" />
            <div className="h-2 bg-gray-100 rounded w-1/2 mt-1" />
          </motion.div>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg p-3 shadow-sm border border-violet-200"
          >
            <div className="w-full h-12 bg-violet-100 rounded mb-2" />
            <div className="h-2 bg-gray-200 rounded w-3/4" />
            <div className="h-2 bg-gray-100 rounded w-1/2 mt-1" />
          </motion.div>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg p-3 shadow-sm border border-violet-200"
          >
            <div className="w-full h-12 bg-violet-100 rounded mb-2" />
            <div className="h-2 bg-gray-200 rounded w-3/4" />
            <div className="h-2 bg-gray-100 rounded w-1/2 mt-1" />
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    title: "Conversational Commerce",
    description: "Shop naturally with AI chat - ask questions, get recommendations, compare products, and complete purchases all through conversation.",
    icon: MessageSquare,
    color: "blue",
    visual: (
      <div className="relative w-full h-64 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 overflow-hidden">
        <div className="absolute right-4 bottom-4 text-blue-200">
          <MessageSquare size={100} strokeWidth={1} />
        </div>
        <div className="relative z-10 space-y-2">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-blue-500 text-white rounded-2xl rounded-tl-sm px-4 py-2 max-w-[80%] text-sm"
          >
            What's on sale today?
          </motion.div>
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white border border-blue-200 rounded-2xl rounded-tr-sm px-4 py-2 ml-auto max-w-[85%] text-sm text-gray-700"
          >
            We have 40% off on sneakers and 30% off electronics!
          </motion.div>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-blue-500 text-white rounded-2xl rounded-tl-sm px-4 py-2 max-w-[75%] text-sm"
          >
            Show me sneakers
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    title: "Virtual Try-On Experience",
    description: "Try products virtually with AR-powered visualization. See how shoes, accessories, or apparel look on you before buying.",
    icon: Shield,
    color: "purple",
    visual: (
      <div className="relative w-full h-64 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <Shield size={200} strokeWidth={1} />
        </div>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative z-10 bg-white rounded-xl shadow-lg p-4 border-2 border-purple-200"
        >
          <div className="w-48 h-36 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg mb-2 flex items-center justify-center">
            <div className="text-purple-600 text-xs font-medium">Camera Feed</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500">Virtual Try-On</div>
            <div className="text-sm font-semibold text-gray-700">Sneakers Preview</div>
          </div>
        </motion.div>
      </div>
    ),
  },
  {
    title: "Global Commerce Ready",
    description: "Built for international e-commerce with multi-currency support, localization, and region-specific product catalogs.",
    icon: Globe,
    color: "cyan",
    visual: (
      <div className="relative w-full h-64 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <Globe size={180} strokeWidth={1} className="text-cyan-500" />
        </div>
        <div className="relative z-10 grid grid-cols-2 gap-3">
          {["🇺🇸 USD", "🇪🇺 EUR", "🇬🇧 GBP", "🇮🇳 INR"].map((currency, i) => (
            <motion.div
              key={currency}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 * i, type: "spring" }}
              className="bg-white rounded-lg p-4 shadow-sm border border-cyan-200 text-center"
            >
              <div className="text-2xl mb-1">{currency.split(" ")[0]}</div>
              <div className="text-xs font-semibold text-cyan-600">{currency.split(" ")[1]}</div>
            </motion.div>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: "Performance Optimized",
    description: "Lightning-fast responses powered by optimized AI inference, intelligent caching, and edge computing for global low latency.",
    icon: Zap,
    color: "yellow",
    visual: (
      <div className="relative w-full h-64 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-6 overflow-hidden">
        <div className="absolute right-4 top-4 text-yellow-200">
          <Zap size={120} strokeWidth={1} />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="text-6xl font-bold text-yellow-600 mb-2"
          >
            {"<"}50ms
          </motion.div>
          <div className="text-gray-600 text-sm">Average Response Time</div>
          <div className="mt-4 flex gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                whileInView={{ height: `${20 + i * 12}px` }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="w-8 bg-yellow-400 rounded-t"
              />
            ))}
          </div>
        </div>
      </div>
    ),
  },
];

// Feature row component with alternating layout
function FeatureRow({ 
  feature, 
  index 
}: { 
  feature: typeof FEATURES[0]; 
  index: number 
}) {
  const isReverse = index % 2 === 1;
  const Icon = feature.icon;

  return (
    <div 
      className={`flex flex-col ${
        isReverse ? "lg:flex-row-reverse" : "lg:flex-row"
      } items-center gap-12 lg:gap-16`}
    >
      {/* Visual */}
      <SectionReveal className="flex-1 w-full" direction={isReverse ? "right" : "left"}>
        {feature.visual}
      </SectionReveal>

      {/* Content */}
      <SectionReveal className="flex-1 w-full" direction={isReverse ? "left" : "right"}>
        <div className="max-w-lg">
          <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-${feature.color}-500/10 mb-6`}>
            <Icon className={`text-${feature.color}-600`} size={28} strokeWidth={1.5} />
          </div>
          <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {feature.title}
          </h3>
          <p className="text-lg text-gray-600 leading-relaxed">
            {feature.description}
          </p>
        </div>
      </SectionReveal>
    </div>
  );
}

export function BuiltForProduction() {
  return (
    <section className="py-24 lg:py-32 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 right-0 w-96 h-96 bg-indigo-200 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-0 w-96 h-96 bg-purple-200 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Section header */}
        <div className="text-center mb-20">
          <SectionReveal>
            <p className="text-xs font-semibold text-indigo-600/80 uppercase tracking-[0.2em] mb-4">
              PRODUCTION READY
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Built for <span className="text-indigo-600">Production</span>
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
              Enterprise-grade AI commerce with the features and reliability your business needs
            </p>
          </SectionReveal>
        </div>

        {/* Zig-zag feature rows */}
        <div className="space-y-24 lg:space-y-32">
          {FEATURES.map((feature, index) => (
            <FeatureRow key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
