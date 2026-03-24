"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Globe, Calendar, Layers, Clock } from "lucide-react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { cn, getFirebaseImageUrl } from "@/lib/utils";

// --- FIREBASE IMPORTS ---
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function RegionalDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [location, setLocation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLocation() {
      if (!slug) return;
      try {
        const q = query(collection(db, "global"), where("slug", "==", slug));
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          setLocation({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
        } else {
          setLocation(null);
        }
      } catch (error) {
        console.error("Error fetching location details:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchLocation();
  }, [slug]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
         <span className="font-sans text-sm uppercase tracking-[0.3em] text-white/40 animate-pulse">Retrieving Node Data...</span>
      </main>
    );
  }

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

  const iconUrl = getFirebaseImageUrl(location.regionIcon);
  const safeVentures = location.ventures || [];

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
              <div className="flex items-center gap-6 mb-8">
                {iconUrl && (
                  <div className="relative w-16 h-16 md:w-24 md:h-24 shrink-0 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-white/5">
                    <Image 
                      src={iconUrl} 
                      alt={`${location.cityRegion} Icon`}
                      fill
                      className="object-cover transition-all duration-700"
                    />
                  </div>
                )}
                <div>
                  <h1 className="text-4xl md:text-6xl font-sans font-black uppercase tracking-tighter leading-none text-white">
                    {location.cityRegion}
                  </h1>
                  <p className="text-sm md:text-lg font-bold uppercase tracking-[0.4em] text-primary mt-2">
                    {location.country} {location.flag}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-12 border-t border-white/10">
                <div className="space-y-1">
                  <span className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-white/30">
                    <Calendar className="w-3 h-3" /> Status
                  </span>
                  <p className={cn(
                    "text-xs font-bold uppercase",
                    location.status === "Live" ? "text-green-500" : location.status === "Planned" ? "text-amber-500" : "text-blue-500"
                  )}>
                    {location.status}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-white/30">
                    <Globe className="w-3 h-3" /> Coordinates
                  </span>
                  <p className="text-xs font-bold uppercase text-white/60">
                    {location.mapCoordinates?.lat?.toFixed(4)}, {location.mapCoordinates?.lng?.toFixed(4)}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-white/30">
                    <Clock className="w-3 h-3" /> Established
                  </span>
                  <p className="text-xs font-bold uppercase text-white/60">
                    {location.yearEntered}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Regional Ventures */}
            {safeVentures.length > 0 && (
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
                  {/* --- FIX: Safely mapping the new Venture Objects --- */}
                  {safeVentures.map((venture: any) => (
                    <Link 
                      key={venture.slug || venture.name}
                      href={`/ventures/${venture.slug}`}
                      className="p-6 bg-white/5 border border-white/5 rounded-2xl flex justify-between items-center group hover:border-primary/40 transition-all cursor-pointer"
                    >
                      <span className="text-sm font-bold uppercase tracking-widest">{venture.name}</span>
                      <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowLeft className="w-3 h-3 rotate-180 text-primary" />
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
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
                  {location.longDescription ? location.longDescription.split('\n\n').map((paragraph: string, idx: number) => (
                    <p key={idx}>{paragraph}</p>
                  )) : null}
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