
"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import GlobalPresence from "@/components/sections/GlobalPresence";
import { ArrowRight } from "lucide-react";

export type Status = "Live" | "Planned" | "Research";

export interface Location {
  slug: string;
  country: string;
  cityRegion: string;
  status: Status;
  marketDescription: string;
  longDescription: string;
  yearEntered: string;
  ventures: string[];
  flag: string;
  regionIcon: string;
  mapCoordinates: {
    lat: number;
    lng: number;
  };
  visibilityToggle: boolean;
}

export const locationsData: Location[] = [
  {
    slug: "singapore",
    country: "Singapore",
    cityRegion: "APAC HQ",
    status: "Live",
    marketDescription: "Serving as the primary node for Asia-Pacific operations, focusing on high-density urban systems.",
    longDescription: "Our Singapore hub acts as the primary node for Southeast Asian operations. It is a center for high-density urban systems research and decentralized compute infrastructure deployment. Strategically positioned to leverage the region's technological growth, the Singapore node is critical for our global network resilience and provides a blueprint for biological integration in arid urban environments.",
    yearEntered: "2024",
    ventures: ["Volume 01: The Grid", "Nexus Core"],
    flag: "🇸🇬",
    regionIcon: "https://images.unsplash.com/photo-1525596662741-e94ff9f26de1?q=80&w=400",
    mapCoordinates: { lat: 1.3521, lng: 103.8198 },
    visibilityToggle: true,
  },
  {
    slug: "united-kingdom",
    country: "United Kingdom",
    cityRegion: "Global HQ (London)",
    status: "Live",
    marketDescription: "The strategic heart of the collective, housing M-Studio and coordinating cross-border logistics.",
    longDescription: "London serves as the global nerve center for the FourSix46 collective. From our headquarters, we coordinate the synergy between our creative, aerospace, and data ventures. The London node handles institutional relations and strategic capital allocation across the European sector, maintaining the structural integrity of our global multi-brand ecosystem.",
    yearEntered: "2018",
    ventures: ["M-Studio", "Sovereign Tech"],
    flag: "🇬🇧",
    regionIcon: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=400",
    mapCoordinates: { lat: 51.5072, lng: -0.1276 },
    visibilityToggle: true,
  },
  {
    slug: "united-states",
    country: "United States",
    cityRegion: "Venture Capital Hub (NY)",
    status: "Live",
    marketDescription: "A critical node for strategic allocation and institutional relations, managing aerospace propulsion R&D.",
    longDescription: "The New York node is our primary portal for institutional engagement and venture scaling. Located in the heart of the global financial sector, this hub manages our aerospace propulsion R&D partnerships and high-velocity capital deployment. It serves as the bridge between frontier technology and multi-generational investment strategies.",
    yearEntered: "2021",
    ventures: ["Vyoma", "Quantum Ledger"],
    flag: "🇺🇸",
    regionIcon: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=400",
    mapCoordinates: { lat: 40.7128, lng: -74.006 },
    visibilityToggle: true,
  },
  {
    slug: "united-arab-emirates",
    country: "United Arab Emirates",
    cityRegion: "Orbital R&D (Dubai)",
    status: "Planned",
    marketDescription: "Targeting 2025 expansion for specialized kinetic mobility testing and biophilic architecture pilot programs.",
    longDescription: "Our planned expansion into Dubai represents a significant leap into orbital-scale logistics and extreme-environment architecture. This hub will host specialized kinetic mobility testing and pioneer biophilic systems designed for high-density, arid urban zones. It marks our commitment to engineering the infrastructure of the future space economy.",
    yearEntered: "2025",
    ventures: ["Velocity", "Rastlina"],
    flag: "🇦🇪",
    regionIcon: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=400",
    mapCoordinates: { lat: 25.2048, lng: 55.2708 },
    visibilityToggle: true,
  },
  {
    slug: "japan",
    country: "Japan",
    cityRegion: "Biophilic Research (Tokyo)",
    status: "Research",
    marketDescription: "Investigating local biological systems for deep integration with urban brutalist structures.",
    longDescription: "The Tokyo node is currently operating as a high-fidelity research laboratory. We are investigating local biological imperatives and their potential for deep integration with high-seismic brutalist structures. This node bridges the gap between traditional craftsmanship and next-generation architectural biophilia, developing the blueprints for the resilient cities of the next century.",
    yearEntered: "2026",
    ventures: ["Rastlina", "Bio-Infrastructure"],
    flag: "🇯🇵",
    regionIcon: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=400",
    mapCoordinates: { lat: 35.6762, lng: 139.6503 },
    visibilityToggle: true,
  },
];

const globalNewsUpdates = [
  {
    id: "q1-orbital-expansion",
    title: "FourSix46 Announces Q1 Orbital Expansion",
    date: "MAR 2024",
    category: "Expansion",
  },
  {
    id: "rastlina-biophilic-tower",
    title: "APAC HQ: Singapore Node reaches operational capacity",
    date: "JAN 2024",
    category: "Expansion",
  },
  {
    id: "nexus-sovereign-data",
    title: "Strategic partnership signed for Dubai Orbital R&D center",
    date: "NOV 2023",
    category: "Expansion",
  },
];

export default function GlobalPage() {
  const [filter, setFilter] = useState<Status | "All">("All");

  const filteredLocations = useMemo(() => {
    let result = locationsData.filter(loc => loc.visibilityToggle);
    if (filter === "All") return result;
    return result.filter((loc) => loc.status === filter);
  }, [filter]);

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white selection:bg-primary font-sans overflow-x-hidden w-full">
      <Navbar />

      {/* Hero Visual Section from Home */}
      <div className="pt-20">
        <GlobalPresence />
      </div>

      <div className="pb-24 px-6 max-w-7xl mx-auto mt-12 md:mt-24 border-t border-white/10 pt-16">
        <header className="mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary mb-6 block"
          >
            Geographic Intelligence
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-sans font-medium tracking-tighter text-white uppercase leading-none"
          >
            Regional Nodes
          </motion.h1>
        </header>

        <div className="flex flex-wrap gap-3 mb-12">
          {["All", "Live", "Planned", "Research"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={cn(
                "px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all duration-300",
                filter === status
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-white/40 border-white/10 hover:border-white/30"
              )}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredLocations.map((loc, idx) => (
                  <motion.div
                    key={loc.slug}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    className="group"
                  >
                    <Link href={`/global/${loc.slug}`} className="block h-full">
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md flex flex-col justify-between hover:border-primary/40 hover:bg-white/[0.07] transition-all h-full cursor-pointer relative overflow-hidden">
                        <div>
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                              {loc.regionIcon ? (
                                <div className="relative w-10 h-10 shrink-0 rounded-lg overflow-hidden border border-white/10 bg-white/5">
                                  <Image 
                                    src={loc.regionIcon} 
                                    alt={loc.cityRegion} 
                                    fill 
                                    className="object-cover" 
                                  />
                                </div>
                              ) : (
                                <span className="text-2xl">{loc.flag}</span>
                              )}
                              <div className="space-y-1">
                                <h3 className="text-sm font-bold uppercase tracking-tight text-white group-hover:text-primary transition-colors">{loc.cityRegion}</h3>
                                <p className="text-[10px] font-medium text-white/30 uppercase tracking-widest">{loc.country}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className={cn(
                                "w-2 h-2 rounded-full",
                                loc.status === "Live" ? "bg-green-500" : loc.status === "Planned" ? "bg-amber-500" : "bg-blue-500"
                              )} />
                              <span className="text-[9px] font-bold uppercase tracking-widest text-white/50">{loc.status}</span>
                            </div>
                          </div>

                          <p className="text-sm text-white/60 font-light leading-relaxed mb-8">
                            {loc.marketDescription}
                          </p>
                        </div>

                        <div className="pt-6 border-t border-white/5 flex flex-col gap-4">
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] font-bold uppercase tracking-widest text-white/20">
                              {loc.status === "Live" ? "Year Entered" : "Target Year"}
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-tight text-white">{loc.yearEntered}</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {loc.ventures.slice(0, 2).map((v) => (
                              <Badge key={v} variant="outline" className="rounded-sm border-white/5 bg-white/5 text-[8px] font-medium uppercase tracking-widest text-primary px-2">
                                {v}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="absolute bottom-4 right-6 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest text-primary">
                          View Region <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <aside className="lg:col-span-4 h-fit">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
              <h2 className="text-sm font-bold uppercase tracking-widest mb-8 text-primary border-l-2 border-primary pl-4">
                Expansion Updates
              </h2>
              <div className="space-y-8">
                {globalNewsUpdates.map((update, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="group"
                  >
                    <Link href={`/newsroom/${update.id}`} className="block space-y-2">
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/20 block group-hover:text-primary transition-colors">
                        {update.date}
                      </span>
                      <p className="text-xs text-white/60 leading-relaxed font-light group-hover:text-white transition-colors">
                        {update.title}
                      </p>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </main>
  );
}
