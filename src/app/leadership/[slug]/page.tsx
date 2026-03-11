"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import { leadershipData } from "@/lib/leadership-data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/**
 * @fileOverview Dedicated dynamic page for a leadership profile.
 * Features an editorial split-screen layout with premium typography.
 */

export default function LeadershipDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const leader = leadershipData.find((l) => l.slug === slug);

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

  const leaderImg = PlaceHolderImages.find((img) => img.id === leader.profilePhoto);

  return (
    <main className="min-h-screen bg-black selection:bg-primary selection:text-white">
      <Navbar />

      <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <Link 
          href="/leadership" 
          className="inline-flex items-center gap-2 font-sans text-[10px] font-semibold uppercase tracking-widest text-white/50 hover:text-white transition-colors mb-12 group"
        >
          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Back to Leadership
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          {/* Left: Cinematic Photo */}
          <div className="lg:col-span-5">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000 border border-white/10"
            >
              {leaderImg && (
                <Image
                  src={leaderImg.imageUrl}
                  alt={leader.fullName}
                  fill
                  className="object-cover"
                  priority
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </motion.div>
          </div>

          {/* Right: Editorial Content */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <header className="mb-12">
                <div className="flex items-center gap-4 mb-4">
                  <h1 className="text-5xl md:text-8xl font-sans font-black uppercase tracking-tighter leading-none text-white">
                    {leader.fullName}
                  </h1>
                  {!leader.isActive && (
                    <Badge variant="outline" className="text-xs font-black uppercase tracking-[0.2em] text-white/20 border-white/5 px-4 py-1">
                      Alumni
                    </Badge>
                  )}
                </div>
                <p className="text-sm md:text-lg font-bold uppercase tracking-[0.4em] text-primary">
                  {leader.roleTitle}
                </p>
              </header>

              <div className="space-y-10 max-w-2xl">
                <p className="text-xl md:text-2xl font-light text-white leading-relaxed italic border-l-2 border-primary pl-8">
                  {leader.shortBio}
                </p>
                
                <div className="space-y-6 text-lg text-white/60 font-light leading-relaxed font-sans">
                  {leader.longBio.split('\n\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>

                {/* Socials & Connectivity */}
                <div className="pt-12 border-t border-white/10 flex flex-wrap items-center gap-10">
                  {Object.entries(leader.socials).map(([key, url]) => (
                    <a 
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 hover:text-primary transition-colors flex items-center gap-2 group"
                    >
                      {key} <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ))}
                  <div className="ml-auto hidden sm:block text-[10px] font-bold uppercase tracking-widest text-white/10">
                    ID_{leader.id.toUpperCase()} · STRATEGIC NODE
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
