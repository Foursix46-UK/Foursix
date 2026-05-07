"use client";

import React, { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import MagneticButton from "@/components/ui/MagneticButton";
import { LeadershipCard } from "@/components/sections/LeadershipUI";

interface TimelineItem {
  year: string;
  title: string;
  content: string;
}

// 👇 Accept the data directly from the server
interface AboutProps {
  initialAboutData?: any;
  initialLeaders?: any[];
}

const fallbackTimelineData: TimelineItem[] = [
  { year: "2018", title: "M-Studio Established", content: "FourSix46 roots take hold..." },
  { year: "2021", title: "Holding Entity Formulation", content: "Strategic pivot to a multi-brand holding structure..." },
  { year: "2023", title: "Sovereign Infrastructure", content: "Deployment of the first Nexus Core..." },
  { year: "2024", title: "Global Node Expansion", content: "Achieving full operational capacity..." },
];

export default function About({ initialAboutData, initialLeaders = [] }: AboutProps) {
  const containerRef = useRef<HTMLElement>(null);
  
  // Renders instantly from Server Props!
  const data = initialAboutData;
  const featuredLeaders = initialLeaders;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Dynamic Data
  const activeManifestoText = data?.manifestoText || "We believe that the future of human infrastructure is not found in synthetic isolation, but in the synthesis of biological imperative and structural clarity. FourSix46 is the architect of this transition — integrating global logistics, sovereign data management, and biophilic systems into a unified, resilient ecosystem for the next century.";
  const manifestoWords = activeManifestoText.split(" ");
  const timelineToDisplay = data?.timelineItems && data.timelineItems.length > 0 ? data.timelineItems : fallbackTimelineData;

  return (
    <section ref={containerRef} className="relative bg-black text-white selection:bg-primary selection:text-white pb-32 overflow-x-hidden w-full max-w-[100vw]">
      {/* 1. Cinematic Hero - Split Screen Grid */}
      <div className="max-w-7xl mx-auto w-full">
        <div className="min-h-[70vh] grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center px-6 pt-32 relative z-20">
          
          <div className="text-left space-y-8 order-2 lg:order-1">
            <motion.span 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
              className="font-sans text-[10px] font-semibold uppercase tracking-[0.5em] text-primary block"
            >
              {data?.heroLabel || "Our Core Purpose"}
            </motion.span>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: "easeOut" }}
              className="text-4xl min-[400px]:text-5xl md:text-7xl lg:text-8xl font-sans font-black uppercase tracking-tighter leading-[0.9] text-white break-words whitespace-pre-wrap"
            >
              {data?.heroTitle || "A HUB FOR\nINNOVATION"}
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }}
              className="max-w-2xl text-base md:text-lg text-white/70 font-light leading-relaxed tracking-tight text-left"
            >
              {data?.heroTypewriter || "Architecting the global nodes of tomorrow. A collective of disruptive ventures unified by strategic leadership and generational impact."}
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.8 }}
            className="order-1 lg:order-2 flex flex-col gap-4 relative z-10 w-full"
          >
            <div className="flex justify-between items-end border-b border-white/10 pb-3 mb-2 md:mb-0">
              <div className="flex flex-col gap-1">
                <span className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                  {data?.videoLabel || "Brand Film"}
                </span>
                <span className="font-sans text-[9px] font-semibold uppercase tracking-widest text-white/40">
                  {data?.videoSubtitle || "FourSix46 Global Venture Company"}
                </span>
              </div>
            </div>

            <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-white/5">
              <iframe 
                src={data?.videoUrl || "https://www.youtube.com/embed/9GSDG6MVKbI?autoplay=1&mute=1&loop=1&playlist=9GSDG6MVKbI&controls=1"}
                className="absolute inset-0 w-full h-full"
                allow="autoplay; encrypted-media"
                title="FourSix46 Brand Video"
              />
              <div className="absolute inset-0 bg-black/10 pointer-events-none" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* 2. Strategic Purpose (Editorial Manifesto) */}
      <div className="relative py-24 md:py-32 w-full bg-black overflow-x-hidden">
        <div className="flex flex-col justify-center max-w-4xl mx-auto px-6">
          <motion.h2 
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            className="text-sm font-semibold uppercase tracking-widest text-primary mb-12 border-l-2 border-primary pl-6"
          >
            {data?.manifestoLabel || "Strategic Purpose"}
          </motion.h2>
          
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.03 } } }}
            className="flex flex-wrap w-full break-words text-xl md:text-3xl font-sans font-medium leading-relaxed tracking-tight"
          >
            {manifestoWords.map((word: string, i: number) => (
              <motion.span 
                key={i} variants={{ hidden: { opacity: 0.2 }, visible: { opacity: 1 } }}
                className="text-white mr-3 lg:mr-4 mb-2"
              >
                {word}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* 3. The Journey (Chronological Founding Story) */}
      <div className="max-w-7xl mx-auto px-6 py-32 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 border-t border-white/10">
        <div className="lg:col-span-4 relative">
          <div className="sticky top-32">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">
              {data?.timelineLabel || "The Journey"}
            </h2>
            <h3 className="text-4xl font-sans font-medium uppercase tracking-tighter whitespace-pre-wrap">
              {data?.timelineTitle || "Founding\nStory"}
            </h3>
            <p className="mt-6 text-white/40 text-sm font-light leading-relaxed max-w-[280px] whitespace-pre-wrap">
              {data?.timelineSubtitle || "Tracing the evolution from a singular design laboratory to a sovereign multi-brand collective."}
            </p>
          </div>
        </div>
        
        <div className="lg:col-span-8 relative pl-8 md:pl-16 border-l border-white/10 space-y-32 py-16">
          {timelineToDisplay.map((item: any, idx: number) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="relative" 
            >
              <div className="absolute -left-[37px] md:-left-[69px] top-2 w-3 h-3 rounded-full bg-primary shadow-[0_0_15px_#E31837]" />
              <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.3em] text-white/50 mb-4 block">{item.year}</span>
              <h4 className="text-2xl font-sans font-medium uppercase mb-6 tracking-tight">{item.title}</h4>
              <p className="text-white/70 text-lg font-light max-w-lg leading-relaxed tracking-tight whitespace-pre-wrap">{item.content}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 4. Core Leadership (Featured Previews) */}
      <div className="max-w-7xl mx-auto px-6 py-32 border-t border-white/10">
        <div className="mb-16">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">
            {data?.leadershipLabel || "Institutional Relations"}
          </h2>
          <h3 className="text-4xl font-sans font-medium uppercase tracking-tighter">
            {data?.leadershipTitle || "Core Leadership"}
          </h3>
        </div>
        
        {/* Render Leaders Instantly! */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {featuredLeaders.map((leader: any) => (
            <LeadershipCard key={leader.id} leader={leader} />
          ))}
        </div>

        <div className="flex justify-center">
          <MagneticButton href="/leadership">
             {data?.leadershipCtaText || "View Full Leadership Team"}
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}