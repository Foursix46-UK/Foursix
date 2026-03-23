"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import MagneticButton from "@/components/ui/MagneticButton";
import { ArrowRight } from "lucide-react";
import { LeadershipCard } from "@/components/sections/LeadershipUI";

// --- FIREBASE IMPORTS ---
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const timelineData = [
  { 
    year: "2018", 
    title: "M-Studio Established", 
    content: "FourSix46 roots take hold with the founding of M-Studio, a design laboratory focused on pioneering neo-brutalism for high-density corporate environments." 
  },
  { 
    year: "2021", 
    title: "Holding Entity Formulation", 
    content: "Strategic pivot to a multi-brand holding structure, formalizing the synergy between design, aerospace, and decentralized compute ventures." 
  },
  { 
    year: "2023", 
    title: "Sovereign Infrastructure", 
    content: "Deployment of the first Nexus Core sovereign data nodes and the successful launch of Rastlina's biophilic pilot towers." 
  },
  { 
    year: "2024", 
    title: "Global Node Expansion", 
    content: "Achieving full operational capacity in five global hubs (London, NY, Tokyo, Dubai, Singapore) and initiating orbital mobility tests with Vyoma." 
  },
];

const TypewriterText = ({ text }: { text: string }) => {
  const characters = text.split("");
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.02,
        delayChildren: 0.5,
      },
    },
  };

  const charVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.p
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-2xl text-base md:text-lg text-white/70 font-light leading-relaxed tracking-tight text-left"
    >
      {characters.map((char, index) => (
        <motion.span key={index} variants={charVariants}>
          {char}
        </motion.span>
      ))}
    </motion.p>
  );
};

export default function About() {
  const containerRef = useRef<HTMLElement>(null);
  
  const [featuredLeaders, setFeaturedLeaders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- FIX: NO COMPOSITE INDEX REQUIRED ---
  useEffect(() => {
    async function fetchFeaturedLeaders() {
      try {
        const snapshot = await getDocs(collection(db, "leadership"));
        const fetchedData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Filter and sort securely on the client side!
        const featured = fetchedData
          .filter((leader: any) => leader.featuredOnAboutPage === true)
          .sort((a: any, b: any) => (a.displayOrder || 0) - (b.displayOrder || 0));

        setFeaturedLeaders(featured);
      } catch (error) {
        console.error("Error fetching featured leaders:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchFeaturedLeaders();
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 0.4], [0, 100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  const manifestoText = "We believe that the future of human infrastructure is not found in synthetic isolation, but in the synthesis of biological imperative and structural clarity. FourSix46 is the architect of this transition — integrating global logistics, sovereign data management, and biophilic systems into a unified, resilient ecosystem for the next century.";
  const words = manifestoText.split(" ");

  return (
    <section ref={containerRef} className="relative bg-black text-white selection:bg-primary selection:text-white pb-32 overflow-x-hidden w-full max-w-[100vw]">
      {/* 1. Cinematic Hero - Split Screen Grid */}
      <div className="max-w-7xl mx-auto w-full">
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="min-h-[70vh] grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center px-6 pt-32"
        >
          {/* Left Column: Typography */}
          <div className="text-left space-y-8 order-2 lg:order-1">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="font-sans text-[10px] font-semibold uppercase tracking-[0.5em] text-primary block"
            >
              Our Core Purpose
            </motion.span>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-4xl min-[400px]:text-5xl md:text-7xl lg:text-8xl font-sans font-black uppercase tracking-tighter leading-[0.9] text-white break-words"
            >
              A HUB FOR<br />INNOVATION
            </motion.h1>

            <TypewriterText text="Architecting the global nodes of tomorrow. A collective of disruptive ventures unified by strategic leadership and generational impact." />
          </div>

          {/* Right Column: Brand Video */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="order-1 lg:order-2 flex flex-col gap-4"
          >
            {/* Video Label */}
            <div className="flex justify-between items-end border-b border-white/10 pb-3 mb-2 md:mb-0">
              <div className="flex flex-col gap-1">
                <span className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                  Brand Film
                </span>
                <span className="font-sans text-[9px] font-semibold uppercase tracking-widest text-white/40">
                  FourSix46 Global Venture Company
                </span>
              </div>
            </div>

            <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-white/5">
              <iframe 
                src="https://www.youtube.com/embed/9GSDG6MVKbI?autoplay=1&mute=1&loop=1&playlist=9GSDG6MVKbI&controls=1"
                className="absolute inset-0 w-full h-full"
                allow="autoplay; encrypted-media"
                title="FourSix46 Brand Video"
              />
              <div className="absolute inset-0 bg-black/10 pointer-events-none" />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* 2. Strategic Purpose (Editorial Manifesto) */}
      <div className="relative py-24 md:py-32 w-full bg-black overflow-x-hidden">
        <div className="flex flex-col justify-center max-w-4xl mx-auto px-6">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-sm font-semibold uppercase tracking-widest text-primary mb-12 border-l-2 border-primary pl-6"
          >
            Strategic Purpose
          </motion.h2>
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.03 } }
            }}
            className="flex flex-wrap w-full break-words text-2xl md:text-3xl font-sans font-medium leading-relaxed tracking-tight"
          >
            {words.map((word, i) => (
              <motion.span 
                key={i} 
                variants={{ hidden: { opacity: 0.2 }, visible: { opacity: 1 } }}
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
            <h2 className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">The Journey</h2>
            <h3 className="text-4xl font-sans font-medium uppercase tracking-tighter">Founding<br/>Story</h3>
            <p className="mt-6 text-white/40 text-sm font-light leading-relaxed max-w-[280px]">
              Tracing the evolution from a singular design laboratory to a sovereign multi-brand collective.
            </p>
          </div>
        </div>
        
        <div className="lg:col-span-8 relative pl-8 md:pl-16 border-l border-white/10 space-y-32 py-16">
          {timelineData.map((item, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, x: -20 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true, margin: "-100px" }} 
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="relative" 
            >
              <div className="absolute -left-[37px] md:-left-[69px] top-2 w-3 h-3 rounded-full bg-primary shadow-[0_0_15px_#E31837]" />
              <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.3em] text-white/50 mb-4 block">{item.year}</span>
              <h4 className="text-2xl font-sans font-medium uppercase mb-6 tracking-tight">{item.title}</h4>
              <p className="text-white/70 text-lg font-light max-w-lg leading-relaxed tracking-tight">{item.content}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 4. Core Leadership (Featured Previews) */}
      <div className="max-w-7xl mx-auto px-6 py-32 border-t border-white/10">
        <div className="mb-16">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">Institutional Relations</h2>
          <h3 className="text-4xl font-sans font-medium uppercase tracking-tighter">Core Leadership</h3>
        </div>
        
        {isLoading ? (
          <div className="w-full flex items-center justify-center py-20">
             <span className="font-sans text-xs uppercase tracking-[0.3em] text-white/40 animate-pulse">Syncing Core Leadership...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {featuredLeaders.map((leader) => (
              <LeadershipCard 
                key={leader.id} 
                leader={leader} 
              />
            ))}
          </div>
        )}

        {/* View Full Leadership Team Button */}
        <div className="flex justify-center">
          <MagneticButton href="/leadership">
             View Full Leadership Team
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}