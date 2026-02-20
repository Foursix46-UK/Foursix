
"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Leaf, Plane, Cpu, Globe, Activity, Lock, ArrowRight } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ventures = [
  {
    id: "rastlina",
    title: "Rastlina",
    desc: "Biophilic architectural solutions integrating nature into urban living. Redefining the intersection of high-density structures and complex biological systems.",
    icon: Leaf,
    color: "#27A9E1",
    imageId: "venture-1"
  },
  {
    id: "vyoma",
    title: "Vyoma",
    desc: "Propulsion systems for next-generation orbital mobility. Accelerating the transition to sustainable space exploration with high-efficiency plasma engines.",
    icon: Plane,
    color: "#E31837",
    imageId: "venture-2"
  },
  {
    id: "nexus",
    title: "Nexus Core",
    desc: "Distributed compute infrastructure for sovereign data management. Providing extreme-efficiency decentralized nodes for global enterprises.",
    icon: Cpu,
    color: "#FFD100",
    imageId: "hero-abstract"
  },
  {
    id: "m-studio",
    title: "M-Studio",
    desc: "A creative laboratory redefining visual communication through neo-brutalism and quiet luxury. Crafting narratives for the industrial avant-garde.",
    icon: Globe,
    color: "#27A9E1",
    imageId: "mag-1"
  },
  {
    id: "aura",
    title: "Aura Health",
    desc: "AI-driven diagnostics and personalized longevity therapeutics. Moving medical treatment from reactive to predictive through deep bio-intelligence.",
    icon: Activity,
    color: "hsl(var(--accent))",
    imageId: "mag-2"
  },
  {
    id: "quantum",
    title: "Quantum Ledger",
    desc: "Next-gen cryptographic security for institutional finance. Securing sensitive transactions with post-quantum standards.",
    icon: Lock,
    color: "hsl(var(--secondary))",
    imageId: "gallery-5"
  }
];

const VentureItem = ({ 
  venture, 
  isActive, 
  setActive 
}: { 
  venture: typeof ventures[0], 
  isActive: boolean, 
  setActive: (id: string) => void 
}) => {
  const ref = useRef(null);
  // Trigger when the element is centered in the screen
  const isInView = useInView(ref, { margin: "-45% 0px -45% 0px" });

  useEffect(() => {
    if (isInView) {
      setActive(venture.id);
    }
  }, [isInView, venture.id, setActive]);

  return (
    <div 
      ref={ref}
      className={cn(
        "min-h-screen flex flex-col justify-center transition-opacity duration-1000",
        isActive ? "opacity-100" : "opacity-20"
      )}
    >
      <div className="space-y-6 max-w-xl">
        <div 
          className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center bg-white/5 backdrop-blur-sm"
          style={{ color: isActive ? venture.color : 'white' }}
        >
          <venture.icon className="w-6 h-6" />
        </div>
        
        <h2 className="text-4xl md:text-5xl font-sans font-semibold uppercase tracking-tight leading-none text-white">
          {venture.title}
        </h2>
        
        <p className="text-lg text-white/70 font-sans leading-relaxed tracking-tight">
          {venture.desc}
        </p>
        
        <div className="pt-8">
          <Link href={`/ventures/${venture.id}`}>
            <Button 
              className="h-14 px-10 rounded-full font-sans text-[10px] font-bold uppercase tracking-widest border border-white/10 bg-white/5 hover:bg-white hover:text-black transition-all group"
            >
              Explore Venture 
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function VenturesOverview() {
  const [activeId, setActiveId] = useState(ventures[0].id);
  const activeVenture = ventures.find(v => v.id === activeId) || ventures[0];
  const activeImg = PlaceHolderImages.find(img => img.id === activeVenture.imageId);

  return (
    <section className="relative bg-black text-white selection:bg-primary selection:text-white">
      <div className="flex flex-col lg:flex-row">
        
        {/* Left Column: Sticky Image */}
        <div className="w-full lg:w-1/2 h-[50vh] lg:h-screen sticky top-0 z-0 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeId}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              {activeImg && (
                <Image
                  src={activeImg.imageUrl}
                  alt={activeVenture.title}
                  fill
                  className="object-cover"
                  priority
                />
              )}
              {/* Cinematic Overlays */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80 lg:hidden" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />
              <div className="absolute inset-0 bg-black/10" />
            </motion.div>
          </AnimatePresence>

          {/* Venture Indicator (Left Side) */}
          <div className="absolute bottom-12 left-12 z-10 hidden lg:block">
            <div className="flex items-center gap-4">
              <span className="font-sans text-[8px] font-bold uppercase tracking-[0.5em] text-white/30">
                PORTFOLIO
              </span>
              <div className="h-px w-12 bg-white/20" />
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-primary">
                {activeVenture.id}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Scrollable List */}
        <div className="w-full lg:w-1/2 relative z-10 px-6 md:px-12 lg:px-24 bg-transparent lg:bg-black/50">
          <div>
            {ventures.map((venture) => (
              <VentureItem 
                key={venture.id}
                venture={venture}
                isActive={activeId === venture.id}
                setActive={setActiveId}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
