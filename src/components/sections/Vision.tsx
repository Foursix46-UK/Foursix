
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

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
  
  // Track scroll progress relative to this section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Intersecting Parallax Transforms
  // Left Column: Starts UP (-100px), moves DOWN (100px)
  const leftY = useTransform(scrollYProgress, [0, 1], ["-100px", "100px"]);
  // Right Column: Starts DOWN (100px), moves UP (-100px)
  const rightY = useTransform(scrollYProgress, [0, 1], ["100px", "-100px"]);

  // Mission Text Reveal Logic
  const words = missionText.split(" ");

  return (
    <section 
      id="vision" 
      ref={containerRef} 
      className="relative bg-[#0A0A0A] py-24 md:py-32 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-16 lg:gap-24 items-start">
          
          {/* Left Column: Mission & Leadership (40% width) */}
          <div className="lg:col-span-4 space-y-12 lg:sticky lg:top-32">
            <div className="space-y-6">
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="font-sans text-[10px] font-semibold uppercase tracking-[0.3em] text-primary block"
              >
                Mission Statement
              </motion.span>
              
              <h3 className="text-3xl md:text-4xl font-sans font-semibold tracking-tighter leading-tight flex flex-wrap gap-x-[0.25em] gap-y-1">
                {words.map((word, i) => {
                  const start = i / words.length;
                  const end = start + 0.15;
                  const opacity = useTransform(scrollYProgress, [0.1 + start * 0.3, 0.1 + end * 0.3], [0.2, 1]);
                  
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
              transition={{ delay: 0.3, duration: 0.8 }}
              viewport={{ once: true }}
              className="pt-8 border-t border-white/5 space-y-6"
            >
              <div className="w-px h-12 bg-gradient-to-b from-primary to-transparent" />
              <blockquote className="text-xl font-sans font-light italic text-white/60 leading-relaxed">
                "Our vision extends beyond singular ventures. We are building the structural integrity for tomorrow's boldest ideas."
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="font-sans text-[10px] font-semibold uppercase tracking-widest">
                  <span className="text-white block">Julian Thorne</span>
                  <span className="text-white/40 block">Chief Executive</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Intersecting Parallax Grid (60% width) */}
          <div className="lg:col-span-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              
              {/* Column 1: Moves DOWN */}
              <motion.div 
                style={{ y: leftY }} 
                className="flex flex-col gap-6"
              >
                {[coreValues[0], coreValues[1]].map((value, idx) => (
                  <motion.div
                    key={value.title}
                    whileHover={{ scale: 1.02 }}
                    className="group relative p-8 bg-[#171717] border border-white/10 rounded-2xl overflow-hidden transition-all duration-500 hover:border-primary/40"
                  >
                    <span className="font-sans text-[8px] font-semibold text-primary uppercase tracking-[0.3em] block mb-4">
                      Principle 0{idx + 1}
                    </span>
                    <h4 className="text-xl font-sans font-semibold uppercase tracking-tight text-white mb-3">
                      {value.title}
                    </h4>
                    <p className="text-sm text-white/50 leading-relaxed font-light">
                      {value.description}
                    </p>
                  </motion.div>
                ))}
              </motion.div>

              {/* Column 2: Moves UP */}
              <motion.div 
                style={{ y: rightY }} 
                className="flex flex-col gap-6 md:pt-24"
              >
                {[coreValues[2], coreValues[3]].map((value, idx) => (
                  <motion.div
                    key={value.title}
                    whileHover={{ scale: 1.02 }}
                    className="group relative p-8 bg-[#171717] border border-white/10 rounded-2xl overflow-hidden transition-all duration-500 hover:border-secondary/40"
                  >
                    <span className="font-sans text-[8px] font-semibold text-secondary uppercase tracking-[0.3em] block mb-4">
                      Principle 0{idx + 3}
                    </span>
                    <h4 className="text-xl font-sans font-semibold uppercase tracking-tight text-white mb-3">
                      {value.title}
                    </h4>
                    <p className="text-sm text-white/50 leading-relaxed font-light">
                      {value.description}
                    </p>
                  </motion.div>
                ))}
              </motion.div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
