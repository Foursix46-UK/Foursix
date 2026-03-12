"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/layout/Footer';

const categories = ["All News", "Press Releases", "Company Updates", "Venture Launches"];

const newsArticles = [
  {
    id: "q1-orbital-expansion",
    title: "FourSix46 Announces Q1 Orbital Expansion",
    summary: "Vyoma secures critical partnerships for next-generation propulsion field tests in Low Earth Orbit (LEO), marking a pivotal moment in the collective's strategic roadmap.",
    date: "MAR 12, 2026",
    category: "Expansion",
    tag: "Press Release",
    image: "https://images.unsplash.com/photo-1517976547714-720226b864c1?q=80&w=1000",
  },
  {
    id: "rastlina-biophilic-tower",
    title: "Rastlina Deploys First Biophilic Tower",
    summary: "The flagship 'Green Lung' project in Singapore reaches practical completion, successfully integrating complex living ecosystems with urban brutalist aesthetics.",
    date: "FEB 28, 2026",
    category: "Milestone",
    tag: "Press Release",
    image: "https://images.unsplash.com/photo-1531591022136-eb8b0da1e6d0?q=80&w=1000",
  },
  {
    id: "nexus-sovereign-data",
    title: "Strategic Investment in Sovereign Data",
    summary: "Nexus Core has announced a $50M strategic allocation to scale its decentralized compute infrastructure across 12 new global hubs.",
    date: "JAN 15, 2026",
    category: "Investment",
    tag: "Company Update",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000",
  },
  {
    id: "keynote-2026",
    title: "Julian Thorne Keynote at Tech Summit 2026",
    summary: "Watch the Chief Executive discuss the future of multi-venture synergy, quiet luxury, and the structural integrity of tomorrow's boldest ideas.",
    date: "JAN 05, 2026",
    category: "Keynote",
    tag: "Company Update",
    image: "https://images.unsplash.com/photo-1475721027187-4024733923f6?q=80&w=1000",
  },
  {
    id: "m-studio-agency-award",
    title: "M-Studio Wins Agency of the Year",
    summary: "Recognized for pioneering neo-brutalism in high-density corporate digital communications and redefining visual narratives for the global elite.",
    date: "DEC 12, 2025",
    category: "Award",
    tag: "Venture Launch",
    image: "https://images.unsplash.com/photo-1604284195847-88dc4b5a9faa?q=80&w=1000",
  },
];

export default function NewsroomPage() {
  const [activeCategory, setActiveCategory] = useState("All News");

  return (
    <main className="min-h-screen bg-black text-white selection:bg-primary selection:text-white">
      <Navbar />
      
      {/* Hero Section */}
      <header className="pt-40 pb-20 px-6 text-center max-w-7xl mx-auto">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-primary uppercase tracking-widest text-[10px] font-semibold mb-4 block"
        >
          Press & Announcements
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-8xl uppercase tracking-tighter font-semibold text-white"
        >
          NEWSROOM
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-white/60 text-lg mt-6 font-light max-w-2xl mx-auto tracking-tight"
        >
          Official press releases, announcements, and venture updates from the FourSix46 collective.
        </motion.p>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/30 mt-6"
        >
          For press and media inquiries: <a href="mailto:press@foursix46.com" className="text-primary hover:text-white transition-colors">press@foursix46.com</a>
        </motion.p>
      </header>

      {/* Category Filter */}
      <section className="max-w-7xl mx-auto px-6 mb-16 overflow-x-auto pb-4 no-scrollbar">
        <div className="flex items-center justify-center gap-3 min-w-max">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full border px-6 py-2 text-[10px] uppercase tracking-widest font-semibold transition-all duration-300 ${
                activeCategory === cat 
                ? "bg-white border-white text-black" 
                : "border-white/20 text-white hover:border-white/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Chronological Feed */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="flex flex-col gap-16">
          <AnimatePresence mode="popLayout">
            {newsArticles.map((article, idx) => (
              <motion.article 
                key={article.id}
                layout
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                className="group flex flex-col md:flex-row gap-8 items-center"
              >
                {/* Image Container */}
                <div className="w-full md:w-5/12 h-[300px] relative overflow-hidden rounded-2xl border border-white/10 bg-surface">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover transition-all duration-1000 ease-in-out group-hover:scale-105"
                  />
                </div>

                {/* Content Container */}
                <div className="w-full md:w-7/12 flex flex-col items-start">
                  <div className="flex items-center gap-4 text-[10px] text-white/50 tracking-widest uppercase font-semibold">
                    <span>{article.date}</span>
                    <span className="w-1 h-1 bg-white/20 rounded-full" />
                    <span>{article.tag}</span>
                  </div>
                  
                  <h3 className="text-3xl md:text-4xl uppercase tracking-tighter mt-4 text-white leading-tight group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  
                  <p className="text-white/60 mt-4 font-light text-sm md:text-base leading-relaxed line-clamp-2">
                    {article.summary}
                  </p>
                  
                  <Link 
                    href={`/newsroom/${article.id}`}
                    className="mt-8 inline-flex font-sans text-[10px] font-semibold uppercase tracking-widest text-white hover:text-primary transition-colors group/link"
                  >
                    Read Full Release 
                    <span className="inline-block ml-2 group-hover/link:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Contextual Newsletter Section */}
      <section className="py-32 px-6 border-t border-white/10 bg-[#0A0A0A]">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-primary">Intelligence Network</span>
            <h2 className="text-3xl md:text-5xl font-sans font-semibold uppercase tracking-tighter text-white">SUBSCRIBE TO UPDATES</h2>
            <p className="text-white/50 font-light leading-relaxed">Receive official press releases, venture launches, and corporate announcements directly to your inbox.</p>
          </div>
          <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto pt-4 w-full">
            <input 
              type="email" 
              placeholder="EMAIL ADDRESS" 
              required
              className="w-full sm:flex-1 h-14 bg-white/5 border border-white/10 rounded-none px-6 text-xs text-white uppercase tracking-widest focus:outline-none focus:border-primary transition-colors placeholder:text-white/20"
            />
            <button type="submit" className="w-full sm:w-auto h-14 px-12 bg-white text-black font-sans text-[10px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-colors">
              SUBSCRIBE
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}
