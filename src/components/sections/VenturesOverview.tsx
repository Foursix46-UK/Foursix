"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Leaf, Plane, Cpu, Globe, Activity, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, getFirebaseImageUrl } from "@/lib/utils";

// --- FIREBASE IMPORTS ---
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Helper for dynamic icons
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

const VentureItem = ({ venture, isActive, setActive }: { venture: any, isActive: boolean, setActive: (id: string) => void }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-45% 0px -45% 0px" });

  useEffect(() => {
    if (isInView) setActive(venture.id);
  }, [isInView, venture.id, setActive]);

  return (
    <div ref={ref} className={cn("min-h-screen flex flex-col justify-center transition-opacity duration-1000", isActive ? "opacity-100" : "opacity-20")}>
      <div className="space-y-6 max-w-xl">
        <div className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center bg-white/5 backdrop-blur-sm" style={{ color: isActive ? venture.color : 'white' }}>
          <venture.icon className="w-6 h-6" />
        </div>
        <h2 className="text-4xl md:text-5xl font-sans font-semibold uppercase tracking-tight leading-none text-white">
          {venture.title}
        </h2>
        <p className="text-lg text-white/70 font-sans leading-relaxed tracking-tight">
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

export default function VenturesOverview() {
  const [dynamicVentures, setDynamicVentures] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // FETCH DATA
  useEffect(() => {
    async function fetchOverview() {
      try {
        const q = query(collection(db, "ventures"), orderBy("displayOrder", "asc"));
        const snapshot = await getDocs(q);
        const fetchedData = snapshot.docs.map(doc => {
          const data = doc.data();
          return { id: doc.id, ...data, icon: getIcon(data.ventureSlug) };
        });
        
        setDynamicVentures(fetchedData);
        if (fetchedData.length > 0) setActiveId(fetchedData[0].id);
      } catch (error) {
        console.error("Error fetching ventures overview:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchOverview();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black">
        <span className="font-sans text-sm uppercase tracking-[0.3em] text-white/40 animate-pulse">Loading Collective...</span>
      </div>
    );
  }

  if (dynamicVentures.length === 0) return null;

  const activeVenture = dynamicVentures.find(v => v.id === activeId) || dynamicVentures[0];
  
  // --- DYNAMIC IMAGE FETCH ---
  const activeImgUrl = getFirebaseImageUrl(activeVenture?.heroImage);

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
              {activeImgUrl && (
                <Image src={activeImgUrl} alt={activeVenture.title} fill className="object-cover" priority />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80 lg:hidden" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />
              <div className="absolute inset-0 bg-black/10" />
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-12 left-12 z-10 hidden lg:block">
            <div className="flex items-center gap-4">
              <span className="font-sans text-[8px] font-bold uppercase tracking-[0.5em] text-white/30">PORTFOLIO</span>
              <div className="h-px w-12 bg-white/20" />
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-primary">
                {activeVenture.ventureSlug}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Scrollable List */}
        <div className="w-full lg:w-1/2 relative z-10 px-6 md:px-12 lg:px-24 bg-transparent lg:bg-black/50">
          <div>
            {dynamicVentures.filter(v => v.visibilityToggle !== false).map((venture) => (
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