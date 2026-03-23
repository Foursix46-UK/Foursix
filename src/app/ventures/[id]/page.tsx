"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Leaf, Plane, Cpu, Globe, Activity, Lock } from "lucide-react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { leadershipData } from "@/lib/leadership-data";
import { LeadershipCard } from "@/components/sections/LeadershipUI";
import { getFirebaseImageUrl } from "@/lib/utils";

// --- FIREBASE IMPORTS ---
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

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

// --- ADDED: EXTERNAL URL FORMATTER ---
const formatExternalUrl = (url: string) => {
  if (!url) return "#";
  return url.startsWith("http") ? url : `https://${url}`;
};

export default function VentureDetailPage() {
  const params = useParams();
  const id = params.id as string; // This will now act as the slug
  
  const [venture, setVenture] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSingleVenture() {
      if (!id) return;
      try {
        // --- CHANGED: Query by ventureSlug instead of Document ID ---
        const q = query(collection(db, "ventures"), where("ventureSlug", "==", id));
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          const data = snapshot.docs[0].data();
          setVenture({ id: snapshot.docs[0].id, ...data, icon: getIcon(data.ventureSlug) });
        } else {
          setVenture(null);
        }
      } catch (error) {
        console.error("Error fetching venture details:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSingleVenture();
  }, [id]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
         <span className="font-sans text-sm uppercase tracking-[0.3em] text-white/40 animate-pulse">Retrieving Data...</span>
      </main>
    );
  }

  if (!venture) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <h1 className="text-4xl font-black uppercase mb-4 text-white">Venture Not Found</h1>
        <Link href="/ventures">
          <Button variant="outline" className="rounded-none font-sans text-xs font-semibold uppercase tracking-widest px-8 text-white">
            Back to Ventures
          </Button>
        </Link>
      </main>
    );
  }

  // --- DYNAMIC IMAGE FETCHES ---
  const heroImageUrl = getFirebaseImageUrl(venture?.heroImage);
  const logoUrl = getFirebaseImageUrl(venture?.logo);

  const safeLeadershipIds = venture.leadershipIds || [];
  const ventureLeaders = leadershipData.filter(leader => safeLeadershipIds.includes(leader.id));

  return (
    <main className="min-h-screen bg-background selection:bg-primary selection:text-white">
      <Navbar />

      {/* Page Header / Hero */}
      <section className="relative h-[80vh] w-full overflow-hidden flex items-end">
        <motion.div initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 1.5, ease: "easeOut" }} className="absolute inset-0 z-0">
          {/* --- FIX: Removed grayscale and opacity filters --- */}
          {heroImageUrl && (
            <Image src={heroImageUrl} alt={venture.title} fill className="object-cover" priority />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24 w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}>
            <Link href="/ventures" className="flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-widest text-primary hover:text-white transition-colors mb-12 group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to All Ventures
            </Link>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="space-y-4">
                {/* Dynamically check if logoUrl is a valid image or default to the icon */}
                {venture.logo ? (
                  <div className="mb-6 h-16 w-auto relative">
                    {/* --- FIX: Removed brightness-0 invert filters --- */}
                    <Image 
                      src={logoUrl} 
                      alt={`${venture.title} Logo`}
                      width={240}
                      height={64}
                      className="h-16 w-auto object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center border border-white/10 bg-surface/50 backdrop-blur-xl mb-4" style={{ color: venture.color || '#fff' }}>
                    {venture.icon && <venture.icon className="w-8 h-8" />}
                  </div>
                )}
                
                <h1 className="text-7xl md:text-9xl font-sans font-black uppercase tracking-tighter leading-none text-white">
                  {venture.title}
                </h1>
                
                <p className="text-2xl font-light text-white/70 mt-4 tracking-tight max-w-2xl">
                  {venture.ventureTagline}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest text-white/50 mt-8 border-l-2 border-primary/40 pl-6">
                  <span>EST. {venture.launchYear}</span>
                  <span className="w-1 h-1 bg-white/20 rounded-full" />
                  <span>{venture.industryCategory}</span>
                  <span className="w-1 h-1 bg-white/20 rounded-full" />
                  <span>{venture.geography?.join(" · ")}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
          <aside className="lg:col-span-4 lg:sticky lg:top-32 h-fit space-y-12">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="p-8 border border-border bg-surface rounded-2xl space-y-8">
              <h2 className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">At a Glance</h2>
              <div className="space-y-6">
                <div>
                  <span className="font-sans text-[9px] font-semibold uppercase text-white/20 block mb-1">Industry</span>
                  <span className="text-lg font-black uppercase text-white">{venture.industryCategory}</span>
                </div>
                <div>
                  <span className="font-sans text-[9px] font-semibold uppercase text-white/20 block mb-1">Founded</span>
                  <span className="text-lg font-black uppercase text-white">{venture.launchYear}</span>
                </div>
                <div>
                  <span className="font-sans text-[9px] font-semibold uppercase text-white/20 block mb-1">Status</span>
                  <span className="text-lg font-black uppercase text-secondary">{venture.status}</span>
                </div>
              </div>

              <div className="pt-4">
                <Button asChild className="w-full h-14 rounded-xl font-sans text-xs font-bold uppercase tracking-widest group transition-all" style={{ backgroundColor: venture.color, color: venture.color?.includes('accent') || venture.color?.includes('FFD100') ? 'black' : 'white' }}>
                  {/* --- ADDED URL FORMATTER HERE --- */}
                  <a href={formatExternalUrl(venture.url)} target="_blank" rel="noopener noreferrer">
                    Visit Website <ExternalLink className="ml-2 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </a>
                </Button>
              </div>
            </motion.div>
          </aside>

          <div className="lg:col-span-8 space-y-32">
            <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-8">
              <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.4em] text-primary border-l-4 border-primary pl-6">Mission & Narrative</h2>
              <p className="text-3xl md:text-4xl font-light leading-snug text-white/90 font-sans tracking-tight whitespace-pre-wrap">
                {venture.mission}
              </p>
            </motion.section>

            {venture.stats && venture.stats.length > 0 && (
              <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-12">
                <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.4em] text-white/30">Strategic Metrics</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {venture.stats.map((stat: any, idx: number) => (
                    <div key={idx} className="p-8 border border-border bg-surface/50 rounded-2xl group hover:border-primary transition-colors">
                      <span className="font-sans text-[9px] font-semibold text-white/20 uppercase tracking-widest block mb-4">{stat.label}</span>
                      <span className="text-4xl font-black uppercase text-white group-hover:text-primary transition-colors">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {ventureLeaders.length > 0 && (
              <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-12">
                <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.4em] text-white/30">Venture Leadership</h2>
                <div className="grid grid-cols-1 gap-8">
                  {ventureLeaders.map((leader) => (
                    <LeadershipCard key={leader.id} leader={leader} />
                  ))}
                </div>
              </motion.section>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}