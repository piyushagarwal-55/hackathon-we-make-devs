"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./WhatShopSageSolves.module.css";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Feature buttons data 
const BUTTONS = [
  { title: "Conversational Shopping", href: "/chat", top: 15, left: 8 },
  { title: "Dynamic UI Generation", href: "/chat", top: 12, right: 8 },
  { title: "Virtual Try-On", href: "/chat", top: 32, left: 5 },
  { title: "Smart Recommendations", href: "/chat", top: 28, right: 5 },
  { title: "Product Comparison", href: "/chat", top: 50, left: 3 },
  { title: "Cart Optimization", href: "/chat", top: 48, right: 3 },
  { title: "Order Tracking", href: "/chat", top: 68, left: 6 },
  { title: "Budget Filtering", href: "/chat", top: 65, right: 6 },
  { title: "AI Product Search", href: "/chat", top: 82, left: 12 },
  { title: "Export & Share", href: "/chat", top: 80, right: 12 },
];

// Background item component (single orb)
function BackgroundItem({
  className,
  opacity = 1,
  hashed,
  borderOpacity,
  size,
  itemRef,
}: {
  className?: string;
  opacity?: number;
  hashed?: boolean;
  borderOpacity?: number;
  size: number;
  itemRef?: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={itemRef}
      className={clsx(
        "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full",
        styles.orbItem,
        className
      )}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      {/* Inner circle with background */}
      <div
        className="absolute inset-0 rounded-full bg-indigo-50/60"
        style={{ opacity }}
      />
      
      {/* Hashed pattern overlay */}
      {hashed && (
        <div
          className={clsx("absolute inset-0 rounded-full", styles.hashed)}
          style={{ opacity: opacity * 0.8 }}
        />
      )}
      
      {/* Dashed border */}
      <div
        className="absolute inset-0 rounded-full border-2 border-dashed border-indigo-400/50"
        style={{ opacity: borderOpacity }}
      />
    </div>
  );
}

export function WhatShopSageSolves() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const orbsContainerRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);
  const orb4Ref = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [hasTriggered, setHasTriggered] = useState(false);

  // GSAP ScrollTrigger animation for orbs - circles grow when scrolling down
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const orbs = [orb1Ref.current, orb2Ref.current, orb3Ref.current, orb4Ref.current].filter(Boolean);
    if (orbs.length === 0 || !sectionRef.current) return;

    // Create scroll-triggered animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "center center",
        scrub: 1.5,
        onEnter: () => setHasTriggered(true),
      },
    });

    // Animate orbs from small to larger sizes (circles "come" when scrolling down)
    orbs.forEach((orb, index) => {
      const startSize = 0;
      const endSize = 400 + (orbs.length - index) * 150;
      
      gsap.set(orb, {
        width: startSize,
        height: startSize,
        opacity: 0,
      });

      tl.to(orb, {
        width: endSize,
        height: endSize,
        opacity: 1,
        ease: "power2.out",
      }, 0);
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  // Staggered button reveal animation
  useEffect(() => {
    if (!hasTriggered) return;
    
    buttonsRef.current.forEach((btn, index) => {
      if (btn) {
        setTimeout(() => {
          btn.style.opacity = "1";
          btn.style.transform = "scale(1)";
        }, index * 100);
      }
    });
  }, [hasTriggered]);

  return (
    <section
      ref={sectionRef}
      className={clsx("relative py-32 overflow-hidden", styles.section)}
    >
      {/* Orbs container - positioned in background */}
      <div
        ref={orbsContainerRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
      >
        <div className="relative w-full h-full hidden lg:block">
          <BackgroundItem
            itemRef={orb1Ref}
            size={1000}
            opacity={0.4}
            hashed
            borderOpacity={0.6}
          />
          <BackgroundItem
            itemRef={orb2Ref}
            size={850}
            opacity={0.6}
            borderOpacity={0.7}
          />
          <BackgroundItem
            itemRef={orb3Ref}
            size={700}
            opacity={0.8}
            hashed
            borderOpacity={0.8}
          />
          <BackgroundItem
            itemRef={orb4Ref}
            size={550}
            opacity={1}
            borderOpacity={0.9}
          />
        </div>
      </div>

      {/* Main content */}
      <div
        ref={contentRef}
        className="relative z-10 min-h-[80vh] flex flex-col items-center justify-center"
      >
        {/* Title section */}
        <div className="text-center mb-8">
          <p className="text-xs font-semibold text-indigo-600/80 uppercase tracking-[0.2em] mb-6">
            FEATURES
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-10 leading-tight">
            What ShopSage <br />
            <span className="text-gray-400">solves for you</span>
          </h2>
          
          {/* CTA Button */}
          <Link href="/chat" className="hidden lg:inline-flex">
            <button className="group px-8 py-4 rounded-2xl bg-indigo-500/10 border-2 border-indigo-500/40 text-indigo-600 font-semibold hover:bg-indigo-500/20 hover:border-indigo-500/60 transition-all inline-flex items-center gap-3">
              Start Shopping
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>

        {/* Floating buttons - Desktop */}
        <div className="absolute inset-0 hidden lg:block pointer-events-none">
          {BUTTONS.map((button, index) => (
            <div
              key={button.title}
              ref={(el) => { buttonsRef.current[index] = el }}
              className="absolute pointer-events-auto"
              style={{
                top: `${button.top}%`,
                ...(button.right !== undefined
                  ? { right: `${button.right}%` }
                  : { left: `${button.left}%` }),
                opacity: 0,
                transform: "scale(1.15)",
                transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
              }}
            >
              <Link href={button.href}>
                <button className="px-4 py-2.5 rounded-xl bg-white/80 backdrop-blur-md border border-gray-200 text-gray-700 text-sm font-medium hover:bg-white hover:border-indigo-300 hover:shadow-lg transition-all whitespace-nowrap">
                  {button.title}
                </button>
              </Link>
            </div>
          ))}
        </div>

        {/* Mobile feature list */}
        <div className="lg:hidden w-full max-w-md px-4 mt-8 space-y-2">
          {BUTTONS.map((button) => (
            <Link key={button.title} href={button.href} className="block">
              <button className="w-full px-5 py-4 rounded-xl bg-white/80 border border-gray-200 text-gray-700 text-sm font-medium hover:bg-white hover:border-indigo-300 transition-all flex items-center justify-between">
                {button.title}
                <ArrowRight size={16} className="text-indigo-600" />
              </button>
            </Link>
          ))}
          <Link href="/chat" className="block pt-4">
            <button className="w-full py-4 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all">
              Start Shopping
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
