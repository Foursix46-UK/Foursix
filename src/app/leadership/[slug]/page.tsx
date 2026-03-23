"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getFirebaseImageUrl } from "@/lib/utils";

import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

const formatExternalUrl = (url: string) => {
  if (!url) return "#";
  return url.startsWith("http") ? url : `https://${url}`;
};

export default function LeadershipDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [leader, setLeader] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLeader() {
      if (!slug) return;
      try {
        const q = query(collection(db, "leadership"), where("slug", "==", slug));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const data = snapshot.docs[0].data();
          const paragraphs = data.longBio ? data.longBio.split('\n').filter((p: string) => p.trim() !== '') : [];
          setLeader({ id: snapshot.docs[0].id, ...data, bioArray: paragraphs });
        } else {
          setLeader(null);
        }
      } catch (error) {
        console.error("Error fetching leadership details:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchLeader();
  }, [slug]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
         <span className="font-sans text-sm uppercase tracking-[0.3em] text-white/40 animate-pulse">Retrieving Profile...</span>
      </main>
    );
  }

  if (!leader) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <h1 className="text-4xl font-black uppercase mb-4 text-white">Profile Not Found</h1>
        <Link href="/leadership">
          <Button variant="outline" className="rounded-none font-sans text-xs font-semibold uppercase tracking-widest px-8 text-white">
            Back to Leadership
          </Button>
        </Link>
      </main>
    );
  }

  const photoUrl = getFirebaseImageUrl(leader.profilePhoto);
  
  let activeSocials: {label: string, url: string}[] = [];
  if (Array.isArray(leader.socialLinks)) {
    activeSocials = leader.socialLinks.filter((s: any) => s.label && s.url);
  } else if (leader.socials && typeof leader.socials === 'object') {
    activeSocials = Object.entries(leader.socials).filter(([_, url]) => url).map(([label, url]) => ({ label, url: url as string }));
  }

  return (
    <main className="min-h-screen bg-black selection:bg-primary selection:text-white">
      <Navbar />

      <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <Link href="/leadership" className="inline-flex items-center gap-2 font-sans text-[10px] font-semibold uppercase tracking-widest text-white/50 hover:text-white transition-colors mb-12 group">
          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Back to Leadership
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          <div className="lg:col-span-5">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden transition-all duration-1000 border border-white/10 bg-white/5">
              {photoUrl && <Image src={photoUrl} alt={leader.fullName} fill className="object-cover" priority />}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </motion.div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-center">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
              <header className="mb-10">
                <div className="flex items-center gap-4 mb-3">
                  {/* --- REDUCED TEXT SIZE --- */}
                  <h1 className="text-4xl md:text-6xl font-sans font-black uppercase tracking-tighter leading-none text-white">
                    {leader.fullName}
                  </h1>
                  {!leader.isActive && <Badge variant="outline" className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 border-white/5 px-3 py-0.5">Alumni</Badge>}
                </div>
                {/* --- REDUCED TEXT SIZE --- */}
                <p className="text-xs md:text-sm font-bold uppercase tracking-[0.4em] text-primary flex flex-wrap items-center">
                  {leader.roleTitle}
                  
                  {/* --- FIX: HIGHLIGHTED TEXT & SLUG LINKING --- */}
                  {leader.associatedVentureName && (
                    leader.associatedVentureSlug ? (
                      <Link href={`/ventures/${leader.associatedVentureSlug}`} className="text-primary ml-2 hover:text-primary/80 transition-colors">
                        {leader.associatedVentureName}
                      </Link>
                    ) : (
                      <span className="text-primary ml-2">{leader.associatedVentureName}</span>
                    )
                  )}
                </p>
              </header>

              <div className="space-y-8 max-w-2xl">
                {/* --- REDUCED TEXT SIZE --- */}
                <p className="text-lg md:text-xl font-light text-white leading-relaxed italic border-l-2 border-primary pl-6">
                  {leader.shortBio}
                </p>
                {/* --- REDUCED TEXT SIZE --- */}
                <div className="space-y-5 text-base text-white/60 font-light leading-relaxed font-sans">
                  {leader.bioArray.map((paragraph: string, idx: number) => <p key={idx}>{paragraph}</p>)}
                </div>

                {activeSocials.length > 0 && (
                  <div className="pt-10 border-t border-white/10 flex flex-wrap items-center gap-8">
                    {activeSocials.map((social, idx) => (
                      <a key={idx} href={formatExternalUrl(social.url)} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 hover:text-primary transition-colors flex items-center gap-2 group">
                        {social.label} <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    ))}
                    <div className="ml-auto hidden sm:block text-[9px] font-bold uppercase tracking-widest text-white/10">
                      ID_{leader.slug.replace(/-/g, '_').toUpperCase()} · STRATEGIC NODE
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}