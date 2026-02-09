"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { 
  ChevronDown, 
  Brain, 
  MessageSquare, 
  Languages, 
  BookOpen, 
  ArrowRight, 
  Sparkles, 
  Play, 
  GraduationCap,
  Globe,
  Lightbulb,
  Users,
  Shield,
  Zap
} from "lucide-react";
import { useRouter } from "next/navigation";
import { AmbientBackground } from "@/components/landing/AmbientBackground";
import { SectionReveal, RevealItem } from "@/components/landing/SectionReveal";
import { FloatingCard } from "@/components/landing/FloatingCard";
import { HeroVisual } from "@/components/landing/HeroVisual";
import { TypewriterText } from "@/components/landing/TypewriterText";

export default function LandingPage() {
  const router = useRouter();
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

  const scrollToFeatures = () => {
    document.getElementById("features-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1225] to-[#0a0a0a]">
      <AmbientBackground />

      {/* ========================================
          HERO SECTION
      ======================================== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 py-20">
        {/* Hero-specific radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(139,92,246,0.08),transparent_60%)]" />
        
        <motion.div 
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="relative z-10 max-w-6xl mx-auto"
        >
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text Content */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] mb-8"
              >
                <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                <span className="text-xs font-medium text-white/70">AI-Powered Education for Bharat</span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight mb-6 leading-[0.95]"
              >
                ज्ञान सारथी
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400">
                  AI Bharat
                </span>
              </motion.h1>

              {/* Dynamic Subheadline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-xl md:text-2xl text-white/50 mb-10 max-w-lg mx-auto lg:mx-0"
              >
                <span>Your personal AI tutor that</span>
                <span className="block h-[1.5em] mt-1">
                  <TypewriterText
                    phrases={["speaks your language", "understands your needs", "adapts to you", "empowers learning"]}
                    className="text-violet-400"
                    typingSpeed={60}
                    pauseDuration={2500}
                  />
                </span>
              </motion.div>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex items-center justify-center lg:justify-start gap-4 flex-wrap"
              >
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: "0 0 60px rgba(139,92,246,0.3)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => router.push("/chat")}
                  className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-500 text-white text-base font-semibold transition-all shadow-[0_0_40px_rgba(139,92,246,0.2)] flex items-center gap-3"
                >
                  Get Started
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.06)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={scrollToFeatures}
                  className="px-8 py-4 rounded-2xl bg-white/[0.03] text-white/70 text-base font-medium border border-white/[0.1] hover:border-white/[0.15] transition-all backdrop-blur-xl flex items-center gap-3"
                >
                  <Play size={16} className="text-violet-400" />
                  Learn More
                </motion.button>
              </motion.div>
            </div>

            {/* Right: AI Workflow Preview */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="hidden lg:block"
            >
              <HeroVisual />
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="text-white/20" size={32} strokeWidth={1.5} />
        </motion.div>
      </section>

      {/* Breathing room */}
      <div className="h-24" />

      {/* ========================================
          FEATURES SECTION
      ======================================== */}
      <section id="features-section" className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <SectionReveal className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold text-white/95 mb-6">
              Education for <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400">Everyone</span>
            </h2>
            <p className="text-lg text-white/50 max-w-2xl mx-auto">
              Breaking barriers in education with AI-powered personalized learning for every Indian student.
            </p>
          </SectionReveal>

          <div className="grid md:grid-cols-3 gap-6">
            <FloatingCard
              icon={<Languages size={24} className="text-violet-400" />}
              title="Multilingual Support"
              description="Learn in your native language. Support for Hindi, English, Tamil, Telugu, Bengali and 20+ Indian languages."
              accentColor="violet"
              delay={0}
            />
            <FloatingCard
              icon={<Brain size={24} className="text-purple-400" />}
              title="AI-Powered Tutoring"
              description="Personalized learning paths adapted to your pace, style, and goals with advanced AI technology."
              accentColor="purple"
              delay={0.1}
            />
            <FloatingCard
              icon={<BookOpen size={24} className="text-indigo-400" />}
              title="Comprehensive Content"
              description="Access to vast educational resources covering K-12, competitive exams, and professional courses."
              accentColor="indigo"
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* Breathing room */}
      <div className="h-16" />

      {/* ========================================
          CAPABILITIES SECTION
      ======================================== */}
      <section className="relative py-40 px-6 overflow-hidden">
        {/* Violet glow background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(139,92,246,0.06),transparent_50%)]" />

        <div className="relative z-10 max-w-6xl mx-auto">
          <SectionReveal className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Powered by <span className="text-violet-400">Intelligence</span>
            </h2>
            <p className="text-xl text-white/50 max-w-3xl mx-auto">
              Experience the future of learning with AI that understands, adapts, and empowers.
            </p>
          </SectionReveal>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <MessageSquare size={24} />,
                title: "Conversational AI",
                description: "Chat naturally in your language. Ask questions, get explanations, and learn interactively.",
              },
              {
                icon: <Lightbulb size={24} />,
                title: "Smart Insights",
                description: "Get personalized insights on your learning progress and areas that need attention.",
              },
              {
                icon: <GraduationCap size={24} />,
                title: "Adaptive Learning",
                description: "Content and difficulty automatically adjust based on your understanding and performance.",
              },
            ].map((feature, i) => (
              <RevealItem key={i} delay={i * 0.15}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="p-8 rounded-2xl bg-[#0f0f0f]/80 backdrop-blur-xl border border-white/[0.08] hover:border-violet-500/30 transition-all"
                >
                  <motion.div
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-6"
                  >
                    <span className="text-violet-400">{feature.icon}</span>
                  </motion.div>
                  <h3 className="text-lg font-semibold text-white/95 mb-3">{feature.title}</h3>
                  <p className="text-sm text-white/60 leading-relaxed">{feature.description}</p>
                </motion.div>
              </RevealItem>
            ))}
          </div>
        </div>
      </section>

      {/* Breathing room */}
      <div className="h-16" />

      {/* ========================================
          WHY AI BHARAT SECTION
      ======================================== */}
      <section className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <SectionReveal className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
              <Sparkles size={14} className="text-violet-400" />
              <span className="text-xs font-medium text-violet-400 uppercase tracking-wider">Why Choose Us</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Built for India's Future
            </h2>
            <p className="text-lg text-white/50 max-w-xl mx-auto">
              Democratizing quality education with AI technology tailored for Indian students.
            </p>
          </SectionReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Globe, title: "Accessible", desc: "Available anywhere, anytime" },
              { icon: Users, title: "Inclusive", desc: "For every learner" },
              { icon: Shield, title: "Safe & Secure", desc: "Privacy-first approach" },
              { icon: Zap, title: "Fast & Reliable", desc: "Lightning-fast responses" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <RevealItem key={i} delay={i * 0.1}>
                  <div className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-violet-500/20 transition-all text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                      <Icon size={20} className="text-violet-400" />
                    </div>
                    <h3 className="text-sm font-semibold text-white/90 mb-2">{item.title}</h3>
                    <p className="text-xs text-white/50">{item.desc}</p>
                  </div>
                </RevealItem>
              );
            })}
          </div>
        </div>
      </section>

      {/* Breathing room */}
      <div className="h-16" />

      {/* ========================================
          FINAL CTA
      ======================================== */}
      <section className="relative py-48 px-6 overflow-hidden">
        {/* Portal glow effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.06),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.08),transparent_60%)]" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <SectionReveal>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8">
              Start Learning Today
            </h2>
            <p className="text-xl text-white/50 mb-12 max-w-xl mx-auto">
              Join thousands of students already learning with AI Bharat Prof.
              Your journey to knowledge starts here.
            </p>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 80px rgba(139,92,246,0.3)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/chat")}
                className="group px-10 py-5 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-500 text-white text-lg font-semibold transition-all shadow-[0_0_50px_rgba(139,92,246,0.25)] flex items-center gap-3"
              >
                Get Started Free
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.06)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/chat")}
                className="px-10 py-5 rounded-2xl bg-white/[0.03] text-white/80 text-lg font-medium border border-white/[0.12] hover:border-white/[0.2] transition-all"
              >
                Try Demo
              </motion.button>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] py-8 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-white/40">
            Built with ❤️ for India • Powered by AI
          </p>
        </div>
      </footer>
    </div>
  );
}
