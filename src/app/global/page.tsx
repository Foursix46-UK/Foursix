"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import GlobalPresence from "@/components/sections/GlobalPresence";
import { ArrowRight } from "lucide-react";
import { getFirebaseImageUrl } from "@/lib/utils";

// --- FIREBASE IMPORTS ---
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type Status = "Live" | "Planned" | "Research" | "All";

export default function GlobalPage() {
  const [filter, setFilter] = useState<Status>("All");
  
  const [dynamicLocations, setDynamicLocations] = useState<any[]>([]);
  const [expansionNews, setExpansionNews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const locQuery = query(collection(db, "global"), where("visibilityToggle", "==", true), orderBy("displayOrder", "asc"));
        const locSnapshot = await getDocs(locQuery);
        const fetchedLocations = locSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDynamicLocations(fetchedLocations);

        const newsQuery = query(collection(db, "news"), where("showOnGlobalExpansion", "==", true), orderBy("publishDate", "desc"), limit(4));
        const newsSnapshot = await getDocs(newsQuery);
        const fetchedNews = newsSnapshot.docs.map(doc => {
          const data = doc.data();
          const dateObj = data.publishDate?.toDate() || new Date();
          const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase();
          return { id: doc.id, ...data, date: formattedDate };
        });
        
        setExpansionNews(fetchedNews);
      } catch (error) {
        console.error("Error fetching global data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredLocations = useMemo(() => {
    if (filter === "All") return dynamicLocations;
    return dynamicLocations.filter((loc) => loc.status === filter);
  }, [filter, dynamicLocations]);

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white selection:bg-primary font-sans overflow-x-hidden w-full">
      <Navbar />

      <div className="pt-20">
        <GlobalPresence hideCTA={true} />
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
              onClick={() => setFilter(status as Status)}
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

        {isLoading ? (
          <div className="w-full flex items-center justify-center py-20">
             <span className="font-sans text-xs uppercase tracking-[0.3em] text-white/40 animate-pulse">Syncing Geographic Data...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className={cn("lg:col-span-8", expansionNews.length === 0 && "lg:col-span-12")}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredLocations.map((loc, idx) => {
                    const iconUrl = getFirebaseImageUrl(loc.regionIcon);
                    return (
                      <motion.div
                        key={loc.slug || loc.id}
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
                                  {iconUrl ? (
                                    <div className="relative w-10 h-10 shrink-0 rounded-lg overflow-hidden border border-white/10 bg-white/5">
                                      <Image 
                                        src={iconUrl} 
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
                                {/* --- FIX: Safely mapping old string data AND new object data --- */}
                                {loc.ventures && loc.ventures.slice(0, 2).map((v: any, i: number) => {
                                  const ventureName = typeof v === 'string' ? v : v?.name;
                                  const ventureKey = typeof v === 'string' ? v : (v?.slug || v?.name);
                                  
                                  if (!ventureName) return null;

                                  return (
                                    <Badge 
                                      key={`venture-${ventureKey}-${i}`} 
                                      variant="outline" 
                                      className="rounded-sm border-white/5 bg-white/5 text-[8px] font-medium uppercase tracking-widest text-primary px-2"
                                    >
                                      {ventureName}
                                    </Badge>
                                  );
                                })}
                              </div>
                            </div>

                            <div className="absolute bottom-4 right-6 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest text-primary">
                              View Region <ArrowRight className="w-3 h-3" />
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

            {expansionNews.length > 0 && (
              <aside className="lg:col-span-4 h-fit">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
                  <h2 className="text-sm font-bold uppercase tracking-widest mb-8 text-primary border-l-2 border-primary pl-4">
                    Expansion Updates
                  </h2>
                  <div className="space-y-8">
                    {expansionNews.map((update, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="group"
                      >
                        <Link href={`/newsroom/${update.slug}`} className="block space-y-2">
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
            )}
            
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}