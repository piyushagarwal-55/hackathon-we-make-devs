"use client";

import Link from "next/link";
import { ArrowRight, Bot, ShoppingCart, Sparkles, Zap, Eye, TrendingUp, Package } from "lucide-react";
import { AmbientBackground } from "@/components/landing/AmbientBackground";
import { TypewriterText } from "@/components/landing/TypewriterText";
import { HeroVisual } from "@/components/landing/HeroVisual";
import { FloatingCard } from "@/components/landing/FloatingCard";
import { SectionReveal } from "@/components/landing/SectionReveal";
import { WhatShopSageSolves } from "@/components/landing/WhatShopSageSolves";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { BuiltForProduction } from "@/components/landing/BuiltForProduction";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen">
      {/* Ambient background */}
      <AmbientBackground />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Hero content */}
            <div className="space-y-8">
              <SectionReveal direction="left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 text-sm font-medium mb-4">
                  <Sparkles size={16} />
                  <span>AI-Powered E-Commerce</span>
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                  Shop Smarter with{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                    ShopSage
                  </span>
                </h1>

                <div className="h-12 flex items-center">
                  <TypewriterText
                    phrases={[
                      "Conversational shopping experiences",
                      "AI-powered product discovery",
                      "Virtual try-on technology",
                      "Smart recommendations",
                      "Dynamic UI generation",
                    ]}
                    className="text-xl md:text-2xl text-gray-600"
                  />
                </div>

                <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                  Experience the future of online shopping with AI agents that understand your needs, 
                  find perfect products, and deliver personalized shopping journeys.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/chat">
                    <button className="group px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-lg transition-all inline-flex items-center gap-3 shadow-lg hover:shadow-xl">
                      Start Shopping
                      <ArrowRight
                        size={20}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </button>
                  </Link>
                  <Link href="#how-it-works">
                    <button className="px-8 py-4 rounded-2xl bg-white border-2 border-gray-200 hover:border-indigo-300 text-gray-700 font-semibold text-lg transition-all inline-flex items-center gap-3 hover:shadow-md">
                      <Zap size={20} className="text-indigo-600" />
                      See How It Works
                    </button>
                  </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
                  <div>
                    <div className="text-3xl font-bold text-indigo-600">5</div>
                    <div className="text-sm text-gray-600">AI Agents</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-indigo-600">{"<"}50ms</div>
                    <div className="text-sm text-gray-600">Response Time</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-indigo-600">24/7</div>
                    <div className="text-sm text-gray-600">Available</div>
                  </div>
                </div>
              </SectionReveal>
            </div>

            {/* Right: Visual */}
            <div className="relative">
              <SectionReveal direction="right">
                <HeroVisual />
              </SectionReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="relative py-24 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <SectionReveal className="text-center mb-16">
            <p className="text-xs font-semibold text-indigo-600/80 uppercase tracking-[0.2em] mb-4">
              THE CHALLENGE
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Traditional E-Commerce <span className="text-gray-400">is Broken</span>
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              Customers struggle with overwhelming catalogs, irrelevant search results, 
              and static shopping experiences that don't understand their needs.
            </p>
          </SectionReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FloatingCard
              icon={<ShoppingCart size={24} />}
              title="Information Overload"
              description="Thousands of products but no guidance on what actually fits your needs and preferences."
              accentColor="indigo"
              delay={0.1}
            />
            <FloatingCard
              icon={<Bot size={24} />}
              title="Poor Search Results"
              description="Keyword-based search misses intent. 'Red running shoes' returns anything with those words."
              accentColor="purple"
              delay={0.2}
            />
            <FloatingCard
              icon={<Eye size={24} />}
              title="Static Experiences"
              description="Same product grid for everyone. No personalization or contextual understanding."
              accentColor="violet"
              delay={0.3}
            />
            <FloatingCard
              icon={<TrendingUp size={24} />}
              title="Comparison Paralysis"
              description="Difficult to compare features, prices, and reviews across multiple products effectively."
              accentColor="pink"
              delay={0.4}
            />
            <FloatingCard
              icon={<Package size={24} />}
              title="Decision Fatigue"
              description="Too many choices without intelligent guidance leads to abandoned carts and frustration."
              accentColor="blue"
              delay={0.5}
            />
            <FloatingCard
              icon={<Zap size={24} />}
              title="Slow Workflows"
              description="Multiple steps to find, compare, and purchase. No conversational shortcuts."
              accentColor="cyan"
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* Solution Section - GSAP Orbs */}
      <WhatShopSageSolves />

      {/* How It Works - Commerce GenUI SDK */}
      <div id="how-it-works">
        <HowItWorks />
      </div>

      {/* Built for Production - Zig-zag Features */}
      <BuiltForProduction />

      {/* 5 AI Agents Section */}
      <section className="relative py-24 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <SectionReveal className="text-center mb-16">
            <p className="text-xs font-semibold text-indigo-600/80 uppercase tracking-[0.2em] mb-4">
              AI AGENTS
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              5 Specialized <span className="text-indigo-600">AI Agents</span>
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              Each agent is an expert in their domain, working together to deliver 
              the perfect shopping experience.
            </p>
          </SectionReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FloatingCard
              icon={<Sparkles size={24} />}
              title="Product Finder"
              description="Natural language search that understands intent, context, and user preferences to find exactly what you want."
              accentColor="indigo"
              delay={0.1}
            />
            <FloatingCard
              icon={<TrendingUp size={24} />}
              title="Recommendations"
              description="Personalized product suggestions based on browsing history, preferences, and current conversation context."
              accentColor="purple"
              delay={0.2}
            />
            <FloatingCard
              icon={<ShoppingCart size={24} />}
              title="Order Placement"
              description="Seamless checkout experience with cart management, payment processing, and order tracking."
              accentColor="violet"
              delay={0.3}
            />
            <FloatingCard
              icon={<Eye size={24} />}
              title="Virtual Try-On"
              description="AR-powered visualization to see how shoes, accessories, or apparel look on you before buying."
              accentColor="pink"
              delay={0.4}
            />
            <FloatingCard
              icon={<Package size={24} />}
              title="Export Data"
              description="Save product comparisons, wishlists, and shopping history in formats you can share and analyze."
              accentColor="blue"
              delay={0.5}
            />
            <FloatingCard
              icon={<Bot size={24} />}
              title="Commerce GenUI SDK"
              description="Decision engine that analyzes intent and renders the perfect UI components for each interaction."
              accentColor="cyan"
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-600 text-white overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 max-w-4xl relative z-10">
          <SectionReveal className="text-center space-y-8">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Ready to Transform Your Shopping Experience?
            </h2>
            <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
              Join thousands of shoppers using AI-powered commerce to find products faster, 
              make better decisions, and enjoy personalized experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/chat">
                <button className="group px-10 py-5 rounded-2xl bg-white text-indigo-600 font-semibold text-lg hover:bg-gray-100 transition-all inline-flex items-center gap-3 shadow-2xl">
                  Start Shopping Now
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </Link>
              <Link href="https://github.com/yourusername/shopsage" target="_blank">
                <button className="px-10 py-5 rounded-2xl bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-semibold text-lg hover:bg-white/20 transition-all">
                  View on GitHub
                </button>
              </Link>
            </div>
          </SectionReveal>
        </div>
      </section>
    </main>
  );
}
