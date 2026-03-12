"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Globe, Calendar, Layers } from "lucide-react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { locationsData } from "../page";
import { cn } from "@/lib/utils";

/**
 * @fileOverview Regional detail page for geographic nodes.
 * Features a high-fidelity editorial layout for regional market intelligence.
 */

export default function RegionalDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const location = locationsData.find((loc) => loc.slug === slug);

  if (!location) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-white">
        <h1 className="text-4xl font-black uppercase mb-4">Node Not Found</h1>
        <Link href="/global">
          <Button variant="outline" className="rounded-full font-sans text-xs font-semibold uppercase tracking-widest px-8">
            Back to Global Map
          </Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black selection:bg-primary selection:text-white text-white">
      <Navbar />

      <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <Link 
          href="/global" 
          className="inline-flex items-center gap-2 font-sans text-[10px] font-semibold uppercase tracking-widest text-white/50 hover:text-white transition-colors mb-12 group"
        >
          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Back to Global Map
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          {/* Left: Metadata & Context */}
          <div className="lg:col-span-5 space-y-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <span className="text-5xl md:text-7xl leading-none">{location.flag}</span>
                <div>
                  <h1 className="text-4xl md:text-6xl font-sans font-black uppercase tracking-tighter leading-none">
                    {location.cityRegion}
                  </h1>
                  <p className="text-sm md:text-lg font-bold uppercase tracking-[0.4em] text-primary mt-2">
                    {location.country}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-12 border-t border-white/10">
                <div className="space-y-1">
                  <span className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-white/30">
                    <Calendar className="w-3 h-3" /> Status
                  </span>
                  <p className={cn(
                    "text-xs font-bold uppercase",
                    location.status === "Live" ? "text-green-500" : "text-amber-500"
                  )}>
                    {location.status}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-white/30">
                    <Globe className="w-3 h-3" /> Coordinates
                  </span>
                  <p className="text-xs font-bold uppercase text-white/60">
                    {location.mapCoordinates.lat.toFixed(4)}, {location.mapCoordinates.lng.toFixed(4)}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Regional Ventures */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 flex items-center gap-3">
                <Layers className="w-3 h-3" /> Regional Ventures
              </h3>
              <div className="flex flex-col gap-3">
                {location.ventures.map((venture) => (
                  <div 
                    key={venture}
                    className="p-6 bg-white/5 border border-white/5 rounded-2xl flex justify-between items-center group hover:border-primary/40 transition-all"
                  >
                    <span className="text-sm font-bold uppercase tracking-widest">{venture}</span>
                    <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowLeft className="w-3 h-3 rotate-180 text-primary" />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: Narrative & Impact */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-10"
            >
              <h2 className="text-sm font-semibold uppercase tracking-widest text-primary border-l-2 border-primary pl-6">
                Market Intelligence
              </h2>
              
              <div className="space-y-8 max-w-2xl">
                <p className="text-2xl md:text-3xl font-light text-white leading-tight tracking-tight">
                  {location.marketDescription}
                </p>
                
                <div className="space-y-6 text-lg text-white/60 font-light leading-relaxed font-sans">
                  {location.longDescription.split('\n\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>

                <div className="pt-12 border-t border-white/10">
                  <div className="flex items-center gap-4 p-8 bg-primary/5 border border-primary/20 rounded-3xl">
                    <MapPin className="w-8 h-8 text-primary" />
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Strategic Node</p>
                      <p className="text-sm font-light text-white/70">
                        This location serves as a critical junction in our global logistics and R&D pipeline. 
                        Inquiries regarding regional collaboration should be directed to our executive office.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}