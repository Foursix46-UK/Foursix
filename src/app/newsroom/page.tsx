'use client';

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
    image: "https://images.unsplash.com/photo-1517976547714-720226b864c1?q=80&w=1000",
  },
  {
    id: "rastlina-biophilic-tower",
    title: "Rastlina Deploys First Biophilic Tower",
    summary: "The flagship 'Green Lung' project in Singapore reaches practical completion, successfully integrating complex living ecosystems with urban brutalist aesthetics.",
    date: "FEB 28, 2026",
    category: "Milestone",
    image: "https://images.unsplash.com/photo-1531591022136-eb8b0da1e6d0?q=80&w=1000",
  },
  {
    id: "nexus-sovereign-data",
    title: "Strategic Investment in Sovereign Data",
    summary: "Nexus Core has announced a $50M strategic allocation to scale its decentralized compute infrastructure across 12 new global hubs.",
    date: "JAN 15, 2026",
    category: "Investment",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000",
  },
  {
    id: "keynote-2026",
    title: "Julian Thorne Keynote at Tech Summit 2026",
    summary: "Watch the Chief Executive discuss the future of multi-venture synergy, quiet luxury, and the structural integrity of tomorrow's boldest ideas.",
    date: "JAN 05, 2026",
    category: "Keynote",
    image: "https://images.unsplash.com/photo-1475721027187-4024733923f6?q=80&w=1000",
  },
  {
    id: "m-studio-agency-award",
    title: "M-Studio Wins Agency of the Year",
    summary: "Recognized for pioneering neo-brutalism in high-density corporate digital communications and redefining visual narratives for the global elite.",
    date: "DEC 12, 2025",
    category: "Award",
    image: "https://images.unsplash.com/photo-1604284195847-88dc4b5a9faa?q=80&w=1000",
  },
];

export default function NewsroomPage() {
  const [activeCategory, setActiveCategory] = useState("All News");

  return (
    <main className="min-h-screen bg-[#F5F5F7] text-black selection:bg-primary selection:text-white">
      <Navbar />
      
      {/* Hero Section */}
      <header className="pt-48 pb-20 px-6 text-center max-w-7xl mx-auto">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-primary uppercase tracking-[0.3em] text-[10px] font-black mb-6 block"
        >
          Press & Announcements
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-9xl uppercase tracking-tighter font-semibold leading-[0.9] mb-8"
        >
          NEWSROOM
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-gray-500 font-sans font-light max-w-2xl mx-auto tracking-tight"
        >
          Official press releases, strategic announcements, and venture updates from the FourSix46 collective.
        </motion.p>
      </header>

      {/* Category Filter */}
      <section className="max-w-7xl mx-auto px-6 mb-24 overflow-x-auto pb-4 no-scrollbar">
        <div className="flex items-center justify-center md:justify-center gap-3 min-w-max">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full border px-8 py-2.5 text-[10px] uppercase tracking-widest font-black transition-all duration-300 ${
                activeCategory === cat 
                ? "bg-black border-black text-white" 
                : "border-black/10 text-black hover:border-black/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Chronological Feed */}
      <section className="max-w-5xl mx-auto px-6 pb-48">
        <div className="flex flex-col gap-24">
          <AnimatePresence mode="popLayout">
            {newsArticles.map((article, idx) => (
              <motion.article 
                key={article.id}
                layout
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                className="group flex flex-col md:flex-row gap-12 items-start"
              >
                {/* Image Container */}
                <div className="w-full md:w-2/5 aspect-[4/3] md:h-64 relative overflow-hidden rounded-2xl bg-gray-200">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 ease-in-out group-hover:scale-105"
                  />
                </div>

                {/* Content Container */}
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center gap-4 text-[10px] text-gray-400 tracking-[0.2em] font-black uppercase mb-6">
                    <span>{article.date}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span className="text-primary">{article.category}</span>
                  </div>
                  
                  <h3 className="text-3xl md:text-4xl uppercase tracking-tighter font-semibold leading-none text-black group-hover:text-primary transition-colors mb-6">
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-500 text-lg leading-relaxed font-sans font-light line-clamp-2 mb-8">
                    {article.summary}
                  </p>
                  
                  <Link 
                    href={`/newsroom/${article.id}`}
                    className="inline-flex items-center gap-2 font-sans text-xs font-black uppercase tracking-widest text-black hover:text-primary transition-all group/link"
                  >
                    Read Full Release 
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </main>
  );
}
