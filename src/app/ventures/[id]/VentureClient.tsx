//ventures/id/ventureclient
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

const formatExternalUrl = (url: string) => {
  if (!url) return "#";
  return url.startsWith("http") ? url : `https://${url}`;
};

// 👇 Accept the prop
export default function VentureClient({ initialVenture }: { initialVenture: any }) {
  const params = useParams();
  const id = params.id as string; 
  
  // 👇 Start with the data already loaded!
  const [venture, setVenture] = useState<any>(
    initialVenture ? { ...initialVenture, icon: getIcon(initialVenture.ventureSlug) } : null
  );
  
  const [relatedNews, setRelatedNews] = useState<any[]>([]);
  const [relatedMags, setRelatedMags] = useState<any[]>([]);
  const [relatedLocations, setRelatedLocations] = useState<any[]>([]);
  
  // 👇 Set isLoading to FALSE initially to eliminate the loading screen!
  const [isLoading, setIsLoading] = useState(false);

  // We still use a small useEffect to fetch the "Related" items below the fold in the background
  useEffect(() => {
    async function fetchRelationsBackground() {
      if (!initialVenture) return;
      try {
        const qNews = query(collection(db, "news"), where("associatedVentureSlug", "==", id));
        const qMags = query(collection(db, "magazines"), where("associatedVentureSlug", "==", id));
        const qGlobal = query(collection(db, "global"), where("visibilityToggle", "==", true));

        const [snapNews, snapMags, snapGlobal] = await Promise.all([
          getDocs(qNews), getDocs(qMags), getDocs(qGlobal)
        ]);

        setRelatedNews(snapNews.docs.map(d => ({ id: d.id, ...d.data() })));
        setRelatedMags(snapMags.docs.map(d => ({ id: d.id, ...d.data() })));
        
        const locations = snapGlobal.docs.map(d => ({ id: d.id, ...d.data() })).filter((loc: any) => {
          if (!loc.ventures) return false;
          return loc.ventures.some((v: any) => 
            v.slug === id || v.name?.toLowerCase() === initialVenture.title.toLowerCase() || v === initialVenture.title
          );
        });
        setRelatedLocations(locations);
      } catch (error) {
        console.error("Error fetching relations:", error);
      }
    }
    fetchRelationsBackground();
  }, [id, initialVenture]);

  // If there is no data from the server at all, show Not Found
  if (!venture && !isLoading) {
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

  // The rest of your exact render logic remains identical!
  const heroImageUrl = getFirebaseImageUrl(venture?.heroImage);
  const logoUrl = getFirebaseImageUrl(venture?.logo);

  const safeLeadershipIds = venture.leadershipIds || [];
  const ventureLeaders = leadershipData.filter(leader => safeLeadershipIds.includes(leader.id));

  return (
    <main className="min-h-screen bg-background selection:bg-primary selection:text-white">
      <Navbar />

      <section className="relative h-[80vh] w-full overflow-hidden flex items-end">
        <motion.div initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 1.5, ease: "easeOut" }} className="absolute inset-0 z-0">
          {heroImageUrl && (
            <Image src={heroImageUrl} alt={venture.title} fill className="object-cover" priority unoptimized />
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
                {venture.logo ? (
                  <div className="mb-6 h-16 w-auto relative">
                    <Image 
                      src={logoUrl} 
                      alt={`${venture.title} Logo`}
                      width={240}
                      height={64}
                      className="h-16 w-auto object-contain"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center border border-white/10 bg-surface/50 backdrop-blur-xl mb-4" style={{ color: venture.color || '#fff' }}>
                    {venture.icon && <venture.icon className="w-8 h-8" />}
                  </div>
                )}
                
                <h1 className="text-4xl md:text-6xl font-sans font-bold uppercase tracking-tighter leading-none text-white">
  {venture.title}
</h1>

<p className="text-lg md:text-xl font-light italic text-white/90 mt-6 tracking-tight max-w-2xl border-l-[3px] border-primary pl-5 py-1">
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
                  <a href={formatExternalUrl(venture.url)} target="_blank" rel="noopener noreferrer">
                    Visit Website <ExternalLink className="ml-2 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </a>
                </Button>
              </div>

              {venture.showOperatingRegions !== false && relatedLocations.length > 0 && (
                <div className="pt-8 border-t border-white/10 mt-8">
                  <h3 className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30 mb-4">Operating Regions</h3>
                  <div className="flex flex-col gap-3">
                    {relatedLocations.map(loc => (
                      <Link key={loc.id} href={`/global/${loc.slug}`} className="flex items-center gap-3 group">
                        <span className="text-xl">{loc.flag}</span>
                        <span className="text-xs font-bold uppercase tracking-widest text-white/70 group-hover:text-primary transition-colors">
                          {loc.cityRegion}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </aside>

          <div className="lg:col-span-8 space-y-32">
            <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-8">
              <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.4em] text-primary border-l-4 border-primary pl-6">Mission & Narrative</h2>
              <p className="text-lg md:text-xl font-light italic text-white/90 leading-relaxed font-sans tracking-normal whitespace-pre-wrap mt-8 border-l-[3px] border-primary pl-6 py-2">
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

            {((venture.showRelatedNews !== false && relatedNews.length > 0) || 
              (venture.showRelatedMagazines !== false && relatedMags.length > 0)) && (
              <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-12">
                <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.4em] text-white/30 border-t border-white/10 pt-12">
                  Related Intelligence
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  
                  {venture.showRelatedNews !== false && relatedNews.length > 0 && (
                    <div className="space-y-6">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Press & Updates</h3>
                      <div className="flex flex-col gap-6">
                        {relatedNews.slice(0, 3).map(news => {
                          const dateObj = news.publishDate?.toDate() || new Date();
                          const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase();
                          return (
                            <Link key={news.id} href={`/newsroom/${news.slug}`} className="group block">
                              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30 block mb-1 group-hover:text-primary transition-colors">
                                {formattedDate}
                              </span>
                              <h4 className="text-sm text-white/80 font-light leading-relaxed group-hover:text-white transition-colors">
                                {news.title}
                              </h4>
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {venture.showRelatedMagazines !== false && relatedMags.length > 0 && (
                    <div className="space-y-6">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Editorial Publications</h3>
                      <div className="flex flex-col gap-6">
                        {relatedMags.slice(0, 3).map(mag => (
                          <Link key={mag.id} href={`/magazines/${mag.slug}`} className="group block">
                            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30 block mb-1 group-hover:text-primary transition-colors">
                              ISSUE · {mag.issueVolume}
                            </span>
                            <h4 className="text-sm text-white/80 font-light leading-relaxed group-hover:text-white transition-colors">
                              {mag.articleTitle}
                            </h4>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

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