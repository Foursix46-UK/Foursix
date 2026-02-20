'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { ArrowLeft, Download, Share2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/layout/Footer';

// Mock database for articles to populate the dynamic route
const articles: Record<string, any> = {
  'q1-orbital-expansion': {
    title: "FourSix46 Announces Q1 Orbital Expansion",
    date: "MARCH 12, 2026",
    category: "EXPANSION",
    readTime: "5 MIN READ",
    image: "https://images.unsplash.com/photo-1517976547714-720226b864c1?q=80&w=2000",
    content: [
      "FourSix46 today announced a significant acceleration of its orbital mobility program, securing critical partnerships for next-generation propulsion field tests in Low Earth Orbit (LEO). This expansion, led by the aerospace division Vyoma, marks a pivotal moment in the collective's strategic roadmap for 2026.",
      "The program focuses on high-efficiency plasma propulsion systems designed to reduce the cost of orbital maneuvering while maintaining strict environmental compliance within the orbital debris guidelines. 'We are not just moving satellites,' says Julian Thorne, Chief Executive of FourSix46. 'We are engineering the velocity of the future space economy.'",
      "Field tests are scheduled to commence in late Q1, utilizing a network of decentralized compute nodes provided by Nexus Core for real-time telemetry processing. This synergy across the holding company's ventures highlights the 'House of Multibrands' philosophy: integrated excellence through structural innovation."
    ]
  },
  'rastlina-biophilic-tower': {
    title: "Rastlina Deploys First Biophilic Tower",
    date: "FEBRUARY 28, 2026",
    category: "MILESTONE",
    readTime: "4 MIN READ",
    image: "https://images.unsplash.com/photo-1531591022136-eb8b0da1e6d0?q=80&w=2000",
    content: [
      "Rastlina, the biophilic architecture arm of FourSix46, has successfully reached practical completion on its flagship 'Green Lung' project in Singapore. The structure stands as a testament to the synthesis of living biological systems and urban brutalist aesthetics.",
      "The tower incorporates over 45,000 square meters of vertical forest, managed by an AI-driven irrigation system that optimizes water usage based on local humidity and plant health metrics. This project represents a shift in how we perceive high-density living—moving from synthetic isolation to biological integration.",
      "The project was recognized last week by the Global Architecture League for its revolutionary approach to carbon sequestration within dense urban environments. It serves as a blueprint for future Rastlina developments in Dubai and Tokyo, scheduled for late 2027."
    ]
  },
  'nexus-sovereign-data': {
    title: "Strategic Investment in Sovereign Data",
    date: "JANUARY 15, 2026",
    category: "INVESTMENT",
    readTime: "6 MIN READ",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000",
    content: [
      "Nexus Core has announced a $50M strategic allocation to scale its decentralized compute infrastructure across 12 new global hubs. This investment aims to provide sovereign data management resources to enterprises seeking alternatives to centralized cloud vulnerabilities.",
      "The new hubs, located primarily in Scandinavia and the GCC region, will utilize zero-emission cooling systems and localized energy production. By distributing compute power, Nexus Core reduces latency and enhances security, creating a resilient backbone for the next generation of global industry.",
      "As part of the expansion, Nexus Core will also pilot a new 'Post-Quantum' encryption standard developed in partnership with Quantum Ledger, further securing the transactions of institutional partners within the FourSix46 ecosystem."
    ]
  }
};

export default function NewsArticlePage() {
  const params = useParams();
  const id = params.id as string;
  const article = articles[id] || {
    title: "Press Release Not Found",
    date: "UNKNOWN DATE",
    category: "UNAVAILABLE",
    readTime: "N/A",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000",
    content: ["The requested press release could not be located in our visual archive. Please return to the newsroom to explore our latest dispatches."]
  };

  return (
    <main className="min-h-screen bg-[#F5F5F7] text-black selection:bg-primary selection:text-white">
      <Navbar />
      
      {/* Navigation & Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 md:px-24 pt-32 pb-8">
        <Link 
          href="/" 
          className="font-sans text-[10px] uppercase tracking-widest font-semibold flex items-center gap-2 text-black/40 hover:text-primary transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
          Back to Home
        </Link>
      </div>

      {/* Header Section */}
      <header className="max-w-4xl mx-auto px-6 text-center mb-16">
        <div className="flex items-center justify-center gap-6 mb-8">
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] font-black text-primary">
            {article.category}
          </span>
          <div className="w-1 h-1 bg-black/20 rounded-full" />
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] font-bold text-black/40">
            {article.date}
          </span>
          <div className="w-1 h-1 bg-black/20 rounded-full" />
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] font-bold text-black/40 flex items-center gap-2">
            <Clock className="w-3 h-3" /> {article.readTime}
          </span>
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-sans font-semibold uppercase tracking-tighter leading-[0.95] mb-12">
          {article.title}
        </h1>

        <div className="flex justify-center gap-4">
          <Button variant="outline" size="sm" className="rounded-full border-black/10 font-sans text-[9px] uppercase tracking-widest h-10 px-6 hover:bg-black hover:text-white transition-all">
            <Share2 className="w-3 h-3 mr-2" /> Share Dispatch
          </Button>
        </div>
      </header>

      {/* Hero Image Container */}
      <div className="max-w-7xl mx-auto px-6 mb-24">
        <div className="relative w-full h-[50vh] md:h-[65vh] overflow-hidden rounded-2xl shadow-2xl">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover grayscale hover:grayscale-0 transition-all duration-1000 ease-in-out"
            priority
          />
        </div>
      </div>

      {/* Article Body */}
      <article className="max-w-3xl mx-auto px-6 pb-32">
        <div className="space-y-8">
          {article.content.map((paragraph: string, idx: number) => (
            <p key={idx} className="text-lg md:text-xl text-black/70 leading-relaxed font-sans font-light">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Action Bar */}
        <div className="mt-24 pt-12 border-t border-black/10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-1">
            <p className="font-sans text-[10px] uppercase tracking-widest font-black text-black">Editorial Team</p>
            <p className="font-sans text-[10px] uppercase tracking-widest text-black/40 font-bold">FourSix46 Corporate Communications</p>
          </div>
          
          <Button className="bg-black hover:bg-primary text-white font-sans text-[10px] uppercase tracking-[0.2em] font-black h-14 px-10 rounded-xl transition-all shadow-xl group">
            Download Press Release (PDF) <Download className="ml-2 w-4 h-4 group-hover:translate-y-1 transition-transform" />
          </Button>
        </div>
      </article>

      <Footer />
    </main>
  );
}
