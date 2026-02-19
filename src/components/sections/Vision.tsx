
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

const missionText = "We do not just build companies. We engineer ecosystems. FourSix46 is a parent brand dedicated to shaping the future of global logistics, sovereign data, and biophilic tech.";

const coreValues = [
  {
    title: "Neo-Brutalism",
    description: "Structural clarity and raw honesty in every venture.",
  },
  {
    title: "Quiet Luxury",
    description: "Sophistication through absolute precision and poise.",
  },
  {
    title: "Sovereign Scale",
    description: "Distributed, secure, and sovereign infrastructure nodes.",
  },
  {
    title: "Global Synergy",
    description: "Unifying cross-border ventures for maximum impact.",
  },
];

export default function Vision() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Section-wide scroll progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Intersecting Parallax Transforms
  const yDown = useTransform(scrollYProgress, [0, 1], [-60, 60]);
  const yUp = useTransform(scrollYProgress, [0, 1], [60, -60]);

  // Mission Text Reveal Logic
  const words = missionText.split(" ");

  return (
    <section 
      id="vision" 
      ref={containerRef} 
      className="relative bg-[#0A0A0A] py-16 md:py-24 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-12 lg:gap-24 items-center">
          
          {/* Left Column: Mission & Quote (40%) */}
          <div className="lg:col-span-4 space-y-12">
            <div className="space-y-6">
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="font-sans text-[10px] font-semibold uppercase tracking-[0.3em] text-primary block"
              >
                Our Purpose
              </motion.span>
              
              <h3 className="text-3xl md:text-4xl font-sans font-semibold tracking-tighter leading-tight flex flex-wrap gap-x-[0.25em] gap-y-1">
                {words.map((word, i) => {
                  const start = i / words.length;
                  const end = start + 0.15;
                  const opacity = useTransform(scrollYProgress, [0.1 + start * 0.4, 0.1 + end * 0.4], [0.2, 1]);
                  
                  return (
                    <motion.span key={i} style={{ opacity }} className="text-white">
                      {word}
                    </motion.span>
                  );
                })}
              </h3>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="pt-8 border-t border-white/5 space-y-6"
            >
              <blockquote className="text-xl font-sans font-light italic text-white/60 leading-relaxed">
                "Our vision extends beyond singular ventures. We are building the structural integrity for tomorrow's boldest ideas."
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-8 h-px bg-primary" />
                <div className="font-sans text-[10px] font-semibold uppercase tracking-widest">
                  <span className="text-white block">Julian Thorne</span>
                  <span className="text-white/40 block">Chief Executive</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Parallax Bento Cards (60%) */}
          <div className="lg:col-span-6">
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              
              {/* Column 1: Moves Down */}
              <div className="space-y-4 md:space-y-6">
                {[coreValues[0], coreValues[2]].map((value, idx) => (
                  <motion.div
                    key={value.title}
                    style={{ y: yDown }}
                    whileHover={{ scale: 1.02 }}
                    className="group relative p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden transition-all duration-500 hover:border-primary/40"
                  >
                    {/* Radial Glow */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(39,169,225,0.08),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    <span className="font-sans text-[8px] font-semibold text-primary uppercase tracking-[0.3em] block mb-4">
                      Principle 0{idx === 0 ? '1' : '3'}
                    </span>
                    <h4 className="text-xl font-sans font-semibold uppercase tracking-tight text-white mb-3">
                      {value.title}
                    </h4>
                    <p className="text-sm text-white/50 leading-relaxed font-light">
                      {value.description}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Column 2: Moves Up */}
              <div className="space-y-4 md:space-y-6 pt-12">
                {[coreValues[1], coreValues[3]].map((value, idx) => (
                  <motion.div
                    key={value.title}
                    style={{ y: yUp }}
                    whileHover={{ scale: 1.02 }}
                    className="group relative p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden transition-all duration-500 hover:border-secondary/40"
                  >
                    {/* Radial Glow */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(227,24,55,0.08),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    <span className="font-sans text-[8px] font-semibold text-secondary uppercase tracking-[0.3em] block mb-4">
                      Principle 0{idx === 0 ? '2' : '4'}
                    </span>
                    <h4 className="text-xl font-sans font-semibold uppercase tracking-tight text-white mb-3">
                      {value.title}
                    </h4>
                    <p className="text-sm text-white/50 leading-relaxed font-light">
                      {value.description}
                    </p>
                  </motion.div>
                ))}
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
