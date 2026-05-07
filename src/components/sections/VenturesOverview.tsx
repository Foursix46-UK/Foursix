"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Leaf, Plane, Cpu, Globe, Activity, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getFirebaseImageUrl, cn } from "@/lib/utils";

const getIcon = (slug: string) => {
  switch (slug) {
    case 'rastlina': return Leaf;
    case 'vyoma': return Plane;
    case 'nexus-core': return Cpu;
    case 'm-studio': return Globe;
    case 'aura-health': return Activity;
    case 'quantum-ledger': return Lock;
    default: return Globe;
  }
};

// --- SCROLLABLE ITEM COMPONENT ---
const VentureItem = ({ venture, isActive, setActive }: { venture: any, isActive: boolean, setActive: (id: string) => void }) => {
  const ref = useRef(null);
  
  // 👇 FIX 1: Use margin instead of amount. This creates a strict "trigger zone" 
  // exactly in the middle of the screen. As soon as the text enters it, the image swaps!
  const isInView = useInView(ref, { margin: "-40% 0px -40% 0px" });

  useEffect(() => {
    if (isInView) setActive(venture.id);
  }, [isInView, venture.id, setActive]);

  return (
    // 👇 FIX 2: Changed 'min-h-screen' to 'py-32 md:py-48'. 
    // This removes the giant blank spaces and brings the descriptions closer together!
    <div ref={ref} className={cn("py-32 md:py-48 flex flex-col justify-center transition-all duration-1000 ease-out", isActive ? "opacity-100 scale-100" : "opacity-20 scale-95")}>
      <div className="space-y-6 max-w-xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center bg-white/5 backdrop-blur-sm transition-colors duration-500" style={{ color: isActive ? (venture.color || 'white') : 'white' }}>
            <venture.icon className="w-6 h-6" />
          </div>
          <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-primary">
            ID_{venture.ventureSlug?.toUpperCase()}
          </span>
        </div>
        
        <h2 className="text-4xl md:text-6xl font-sans font-semibold uppercase tracking-tighter leading-none text-white">
          {venture.title}
        </h2>
        
        <p className="text-lg text-white/60 font-sans leading-relaxed tracking-tight">
          {venture.desc}
        </p>
        
        <div className="pt-8">
          <Link href={`/ventures/${venture.ventureSlug}`}>
            <Button className="h-14 px-10 rounded-full font-sans text-[10px] font-bold uppercase tracking-widest border border-white/10 bg-white/5 hover:bg-white hover:text-black transition-all group">
              Explore Venture <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};


// --- MAIN OVERVIEW COMPONENT ---
export default function VenturesOverview({ initialVentures = [] }: { initialVentures?: any[] }) {
  
  const visibleVentures = initialVentures
    // 👇 FIX: Removes hidden ventures AND immediately deletes any duplicates by matching IDs!
    .filter((v, index, self) => 
      v.visibilityToggle !== false && 
      index === self.findIndex((t) => t.id === v.id)
    )
    .map(v => ({
      ...v,
      icon: getIcon(v.ventureSlug)
    }));

  const [activeId, setActiveId] = useState<string | null>(
    visibleVentures.length > 0 ? visibleVentures[0].id : null
  );

  if (visibleVentures.length === 0) return null;

  const activeVenture = visibleVentures.find(v => v.id === activeId) || visibleVentures[0];
  const activeImgUrl = getFirebaseImageUrl(activeVenture?.heroImage);

  return (
    <section className="relative bg-black text-white selection:bg-primary selection:text-white">
      
      {/* "items-start" prevents the columns from stretching, allowing sticky to work! */}
      <div className="flex flex-col lg:flex-row items-start relative w-full">
        
        {/* LEFT COLUMN: STICKY CINEMATIC IMAGE */}
        {/* 👇 FIX: Added 'relative' to ensure AnimatePresence images don't double-stack awkwardly */}
        <div className="relative w-full lg:w-1/2 h-[50vh] lg:h-screen sticky top-0 z-0 overflow-hidden bg-zinc-900 border-r border-white/5">
          <AnimatePresence>
            <motion.div
              key={activeId}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              {activeImgUrl ? (
                <Image 
                  src={activeImgUrl} 
                  alt={activeVenture.title} 
                  fill 
                  className="object-cover" 
                  priority 
                  unoptimized 
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-zinc-900">
                  <Globe className="w-12 h-12 text-white/20 mb-4" />
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80 lg:hidden" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20 lg:hidden" />
              <div className="absolute inset-0 bg-black/20 hidden lg:block" />
            </motion.div>
          </AnimatePresence>

          {/* Floating Sticky HUD */}
          <div className="absolute bottom-12 left-12 z-10 hidden lg:block">
            <div className="flex items-center gap-4">
              <span className="font-sans text-[8px] font-bold uppercase tracking-[0.5em] text-white/30">PORTFOLIO</span>
              <div className="h-px w-12 bg-white/20" />
              <motion.span 
                key={activeVenture.ventureSlug}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-sans text-[10px] font-bold uppercase tracking-widest text-primary"
              >
                {activeVenture.title}
              </motion.span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SCROLLABLE CONTENT */}
        <div className="w-full lg:w-1/2 relative z-10 px-6 md:px-12 lg:px-24 bg-transparent lg:bg-black/50 backdrop-blur-sm">
          {visibleVentures.map((venture) => (
            <VentureItem 
              key={venture.id}
              venture={venture}
              isActive={activeId === venture.id}
              setActive={setActiveId}
            />
          ))}
        </div>
        
      </div>
    </section>
  );
}