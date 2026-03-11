
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { ArrowLeft, Clock, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/layout/Footer';

// Mock data mapping for editorial articles in dark mode - Synchronized with CMS Architecture
const articles: Record<string, any> = {
  'q1-orbital-expansion': {
    title: "FourSix46 Announces Q1 Orbital Expansion",
    lead: "Vyoma secures critical partnerships for next-generation propulsion field tests in Low Earth Orbit (LEO), marking a pivotal moment in the collective's strategic roadmap.",
    date: "MARCH 12, 2026",
    category: "EXPANSION",
    readTime: "5 MIN READ",
    authorSource: "Strategic Relations Office",
    image: "https://images.unsplash.com/photo-1517976547714-720226b864c1?q=80&w=2000",
    externalCoverageLinks: ["https://example-news.com/vyoma-expansion", "https://aerospace-daily.com/foursix46-nodes"],
    content: [
      "FourSix46 today announced a significant acceleration of its orbital mobility program. This expansion, led by the aerospace division Vyoma, represents the synthesis of multi-venture synergy within the holding company.",
      "The program focuses on high-efficiency plasma propulsion systems designed to reduce the cost of orbital maneuvering. 'We are not just moving satellites,' says Marcus Thorne, Director of Engineering. 'We are engineering the velocity of the future space economy.'",
      "Field tests are scheduled to commence in late Q1, utilizing a network of decentralized compute nodes provided by Nexus Core for real-time telemetry processing. This deep integration across our ventures defines the 'House of Multibrands' philosophy."
    ]
  },
  'rastlina-biophilic-tower': {
    title: "Rastlina Deploys First Biophilic Tower",
    lead: "The flagship 'Green Lung' project in Singapore reaches practical completion, successfully integrating complex living ecosystems with urban brutalist aesthetics.",
    date: "FEBRUARY 28, 2026",
    category: "MILESTONE",
    readTime: "4 MIN READ",
    authorSource: "Architecture Global",
    image: "https://images.unsplash.com/photo-1531591022136-eb8b0da1e6d0?q=80&w=2000",
    externalCoverageLinks: ["https://arch-daily.com/singapore-green-lung"],
    content: [
      "Rastlina, the biophilic architecture arm of FourSix46, has successfully completed its most ambitious project to date. The tower incorporates over 45,000 square meters of vertical forest managed by an AI-driven irrigation system.",
      "This project represents a shift in how we perceive high-density living—moving from synthetic isolation to biological integration. The structure stands as a testament to the synthesis of living systems and structural clarity.",
      "Recognized by the Global Architecture League, this project serves as a blueprint for upcoming Rastlina developments in Dubai and Tokyo, scheduled for late 2027."
    ]
  },
  'nexus-sovereign-data': {
    title: "Strategic Investment in Sovereign Data",
    lead: "Nexus Core has announced a $50M strategic allocation to scale its decentralized compute infrastructure across 12 new global hubs.",
    date: "JANUARY 15, 2026",
    category: "INVESTMENT",
    readTime: "6 MIN READ",
    authorSource: "Financial Times Syndicate",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000",
    externalCoverageLinks: ["https://finance-news.com/nexus-core-funding"],
    content: [
      "Nexus Core announced its latest capital allocation to provide sovereign data management resources to enterprises seeking alternatives to centralized cloud vulnerabilities.",
      "The new hubs, located primarily in Scandinavia and the GCC region, will utilize zero-emission cooling systems and localized energy production. By distributing compute power, Nexus Core reduces latency and enhances security.",
      "As part of the expansion, Nexus Core will pilot a new 'Post-Quantum' encryption standard developed in partnership with Quantum Ledger, further securing the transactions of institutional partners within the FourSix46 ecosystem."
    ]
  },
  'keynote-2026': {
    title: "Julian Thorne Keynote at Tech Summit 2026",
    lead: "Watch the Chief Executive discuss the future of multi-venture synergy, quiet luxury, and the structural integrity of tomorrow's boldest ideas.",
    date: "JANUARY 05, 2026",
    category: "KEYNOTE",
    readTime: "12 MIN READ",
    authorSource: "Global Tech Summit",
    image: "https://images.unsplash.com/photo-1475721027187-4024733923f6?q=80&w=2000",
    externalCoverageLinks: ["https://youtube.com/tech-summit-2026-thorne"],
    content: [
      "In a widely anticipated address at the Global Tech Summit, FourSix46 CEO Julian Thorne outlined the collective's vision for the next decade. The speech focused on the concept of 'Architectural Synergy'—the idea that technology must be as aesthetically pure as it is functionally superior.",
      "Thorne addressed the shifting landscape of global logistics and the role that decentralized infrastructure plays in maintaining economic sovereignty. He emphasized that the 'House of Multibrands' is not merely a holding company, but an incubator for structural innovation.",
      "The keynote concluded with a first look at the 'Aura Diagnostics' platform, a multi-year collaboration between our healthcare and AI divisions that aims to move medical treatment from reactive to predictive on a global scale."
    ]
  },
  'm-studio-agency-award': {
    title: "M-Studio Wins Agency of the Year",
    lead: "Recognized for pioneering neo-brutalism in high-density corporate digital communications and redefining visual narratives for the global elite.",
    date: "DECEMBER 12, 2025",
    category: "AWARD",
    readTime: "3 MIN READ",
    authorSource: "Design Council International",
    image: "https://images.unsplash.com/photo-1604284195847-88dc4b5a9faa?q=80&w=2000",
    externalCoverageLinks: [],
    content: [
      "M-Studio has been named Global Design Agency of the Year at the 2025 Creative Excellence Awards. The studio was cited for its uncompromising commitment to aesthetic clarity and its role in defining the visual language of the 'Quiet Luxury' movement.",
      "The jury specifically highlighted M-Studio's work for the FourSix46 parent brand, noting that it has successfully bridged the gap between raw industrial honesty and premium brand positioning.",
      "This accolade marks the studio's fourth major international award this year, solidifying its position as the leading creative laboratory for ventures that operate at the intersection of high design and deep technology."
    ]
  }
};

export default function NewsArticlePage() {
  const params = useParams();
  const id = params.id as string;
  
  // Find article data or use a fallback
  const article = articles[id] || articles['nexus-sovereign-data'];

  return (
    <main className="min-h-screen bg-black text-white selection:bg-primary selection:text-white">
      <Navbar />
      
      {/* Top Navigation - pt-32 added to resolve Navbar overlap */}
      <div className="max-w-7xl mx-auto pt-32">
        <Link 
          href="/newsroom" 
          className="inline-flex items-center gap-2 font-sans text-[10px] font-semibold uppercase tracking-widest text-white/70 hover:text-white transition-colors px-6 md:px-12 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
          Back to Newsroom
        </Link>
      </div>

      {/* Editorial Header */}
      <header className="max-w-4xl mx-auto px-6 pt-16 text-center md:text-left">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Meta Tags */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 font-sans text-[10px] font-semibold uppercase tracking-widest text-white/50 mb-6">
            <span className="text-primary">{article.category}</span>
            <span className="w-1 h-1 bg-white/30 rounded-full" />
            <span>{article.date}</span>
            <span className="w-1 h-1 bg-white/30 rounded-full" />
            <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {article.readTime}</span>
          </div>
          
          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-sans font-semibold uppercase tracking-tighter text-white leading-[1.1] mb-8">
            {article.title}
          </h1>

          {/* Lead Paragraph */}
          <p className="text-xl md:text-2xl font-light text-white/70 leading-relaxed max-w-3xl">
            {article.lead}
          </p>
        </motion.div>
      </header>

      {/* Cinematic Hero Image */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="max-w-6xl mx-auto px-4 md:px-6 my-16"
      >
        <div className="relative w-full h-[50vh] md:h-[70vh] overflow-hidden rounded-3xl border border-white/10 shadow-2xl bg-surface">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover transition-all duration-1000 ease-in-out"
            priority
          />
        </div>
      </motion.div>

      {/* The Reading Experience */}
      <article className="max-w-2xl mx-auto px-6 pb-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="space-y-10"
        >
          {article.content.map((paragraph: string, idx: number) => (
            <p 
              key={idx} 
              className="text-lg md:text-xl font-light text-white/80 leading-relaxed tracking-wide"
            >
              {paragraph}
            </p>
          ))}

          {/* External Coverage Section */}
          {article.externalCoverageLinks && article.externalCoverageLinks.length > 0 && (
            <div className="pt-16 mt-16 border-t border-white/10">
              <h3 className="font-sans text-[10px] uppercase tracking-[0.3em] font-black text-white/40 mb-8">Media & Coverage</h3>
              <div className="flex flex-col gap-4">
                {article.externalCoverageLinks.map((link: string, idx: number) => (
                  <a 
                    key={idx} 
                    href={link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm font-light text-primary hover:text-white transition-colors group"
                  >
                    Read External Coverage <ExternalLink className="w-3 h-3 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </a>
                ))}
              </div>
            </div>
          )}
          
          {/* Editorial Footer Meta */}
          <div className="pt-20 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 mt-20">
            <div className="space-y-1">
              <p className="font-sans text-[10px] uppercase tracking-widest font-black text-white">Editorial Dispatch</p>
              <p className="font-sans text-[10px] uppercase tracking-widest text-white/40 font-bold">{article.authorSource}</p>
            </div>
            
            <div className="flex items-center gap-6">
              <button 
                onClick={() => window.print()}
                className="font-sans text-[10px] uppercase tracking-widest font-black hover:text-primary transition-colors text-white/70"
              >
                Archive Page
              </button>
              <button className="font-sans text-[10px] uppercase tracking-widest font-black hover:text-primary transition-colors text-white/70">
                Share Release
              </button>
            </div>
          </div>
        </motion.div>
      </article>

      <Footer />
    </main>
  );
}
