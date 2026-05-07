"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import MagneticButton from "@/components/ui/MagneticButton";
import { ArrowRight } from "lucide-react";

// --- TypeScript Interface for CMS Data ---
interface VisionProps {
  data?: {
    visionLabel?: string;
    visionTitle?: string;
    visionStatement?: string;
    visionPrinciples?: { title: string; description: string }[];
    visionQuote?: string;
    visionQuoteAuthor?: string;
    visionQuoteRole?: string;
    visionCtaText?: string;
  };
}

export default function Vision({ data }: VisionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Intersecting Parallax Transitions for the Principles Grid
  const leftY = useTransform(scrollYProgress, [0, 1], ["-100px", "100px"]);
  const rightY = useTransform(scrollYProgress, [0, 1], ["100px", "-100px"]);

  // --- Dynamic CMS Fallbacks ---
  const missionText = data?.visionStatement || "We do not just build companies. We engineer ecosystems. FourSix46 is a parent brand dedicated to shaping the future of global logistics, sovereign data, and biophilic tech.";
  
  const coreValues = data?.visionPrinciples && data.visionPrinciples.length === 4 
    ? data.visionPrinciples 
    : [
        { title: "Neo-Brutalism", description: "Structural clarity and raw honesty in every venture." },
        { title: "Quiet Luxury", description: "Sophistication through absolute precision and poise." },
        { title: "Sovereign Scale", description: "Distributed, secure, and sovereign infrastructure nodes." },
        { title: "Global Synergy", description: "Unifying cross-border ventures for maximum impact." },
      ];

  // Mission Text Logic (Splits the dynamic text for the staggered animation)
  const words = missionText.split(" ");

  return (
    <section 
      id="vision" 
      ref={sectionRef} 
      className="relative bg-black py-20 px-6 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Synchronized Header */}
        <header className="mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-sans text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">
              {data?.visionLabel || "Our Purpose"}
            </span>
            <h2 className="text-4xl md:text-5xl font-sans font-semibold uppercase tracking-tighter text-white">
              {data?.visionTitle || "Mission"}
            </h2>
          </motion.div>
        </header>

        {/* Main Grid: Mission & Principles */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
          
          {/* Left: Staggered Reveal Mission */}
          <div className="lg:col-span-5 space-y-8">
            <motion.h3 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.03 }
                }
              }}
             className="text-lg md:text-2xl font-sans font-light italic leading-relaxed flex flex-wrap gap-x-[0.25em] gap-y-1 border-l-[3px] border-primary pl-5 py-2 text-white/90"
>
  {words.map((word, i) => (
    <motion.span 
      key={i} 
      variants={{ 
        hidden: { opacity: 0.2, y: 5 }, 
        visible: { opacity: 1, y: 0 } 
      }} 
    >
      {word}
    </motion.span>
  ))}
</motion.h3>
          </div>

          {/* Right: Intersecting Principles Grid */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              
              {/* Column 1: Moves DOWN */}
              <motion.div style={{ y: leftY }} className="flex flex-col gap-6">
                {[coreValues[0], coreValues[1]].map((value, idx) => (
                  <div
                    key={idx}
                    className="group relative p-8 bg-[#171717] border border-white/10 rounded-2xl overflow-hidden transition-all duration-500 hover:border-primary/40 hover:scale-[1.02]"
                  >
                    <span className="font-sans text-[8px] font-semibold text-primary uppercase tracking-[0.3em] block mb-4">
                      Principle 0{idx + 1}
                    </span>
                    <h4 className="text-xl font-sans font-semibold uppercase tracking-tight text-white mb-3">
                      {value.title}
                    </h4>
                    <p className="text-sm text-white/50 leading-relaxed font-light font-sans whitespace-pre-wrap">
                      {value.description}
                    </p>
                  </div>
                ))}
              </motion.div>

              {/* Column 2: Moves UP */}
              <motion.div style={{ y: rightY }} className="flex flex-col gap-6 md:pt-12">
                {[coreValues[2], coreValues[3]].map((value, idx) => (
                  <div
                    key={idx}
                    className="group relative p-8 bg-[#171717] border border-white/10 rounded-2xl overflow-hidden transition-all duration-500 hover:border-secondary/40 hover:scale-[1.02]"
                  >
                    <span className="font-sans text-[8px] font-semibold text-secondary uppercase tracking-[0.3em] block mb-4">
                      Principle 0{idx + 3}
                    </span>
                    <h4 className="text-xl font-sans font-semibold uppercase tracking-tight text-white mb-3">
                      {value.title}
                    </h4>
                    <p className="text-sm text-white/50 leading-relaxed font-light font-sans whitespace-pre-wrap">
                      {value.description}
                    </p>
                  </div>
                ))}
              </motion.div>

            </div>
          </div>
        </div>

        {/* Centered Leadership Closure */}
        <div className="mt-20 max-w-4xl mx-auto text-center flex flex-col items-center">
          <div className="w-px h-16 bg-gradient-to-b from-primary to-transparent mb-12" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <blockquote className="text-2xl md:text-3xl font-sans font-light italic text-white/70 leading-relaxed mb-8 whitespace-pre-wrap">
              {data?.visionQuote || "\"Our vision extends beyond singular ventures. We are building the structural integrity for tomorrow's boldest ideas.\""}
            </blockquote>
            <div className="space-y-1 mb-12">
              <span className="text-white font-sans text-xs font-semibold uppercase tracking-widest block">
                {data?.visionQuoteAuthor || "Julian Thorne"}
              </span>
              <span className="text-white/40 font-sans text-[10px] font-semibold uppercase tracking-widest block">
                {data?.visionQuoteRole || "Chief Executive"}
              </span>
            </div>
            
            <MagneticButton href="/vision">
              {data?.visionCtaText || "Our Full Story"} <ArrowRight className="w-4 h-4 ml-2" />
            </MagneticButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
}