
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const missionText = "We do not just build companies. We engineer ecosystems. FourSix46 is a parent brand dedicated to shaping the future of global logistics, sovereign data, and biophilic tech.";

const values = [
  {
    title: "Neo-Brutalism",
    description: "Function over form, expressed with raw honesty and structural clarity. We value the truth of materials and the integrity of systems.",
  },
  {
    title: "Quiet Luxury",
    description: "Sophistication without shouting. Excellence in the smallest details, creating experiences that resonate through precision and poise.",
  },
];

export default function Vision() {
  const containerRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
  
  // Mission Scroll Reveal
  const { scrollYProgress: missionProgress } = useScroll({
    target: missionRef,
    offset: ["start end", "end start"],
  });

  const words = missionText.split(" ");
  
  // Values Parallax
  const valuesRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: valuesProgress } = useScroll({
    target: valuesRef,
    offset: ["start end", "end start"],
  });

  const leftY = useTransform(valuesProgress, [0, 1], [0, -120]);
  const rightY = useTransform(valuesProgress, [0, 1], [0, -60]);

  return (
    <section id="vision" ref={containerRef} className="relative bg-[#0A0A0A] py-32 md:py-64 overflow-hidden">
      {/* 1. Scroll-Reveal Mission Statement */}
      <div className="max-w-7xl mx-auto px-6 mb-48 md:mb-64">
        <div ref={missionRef} className="max-w-5xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <span className="font-sans text-xs font-semibold uppercase tracking-widest text-primary block mb-6">
              Our Purpose
            </span>
          </motion.div>
          
          <h3 className="text-4xl md:text-7xl font-sans font-semibold tracking-tighter leading-[1.1] flex flex-wrap gap-x-[0.2em] gap-y-2">
            {words.map((word, i) => {
              const start = i / words.length;
              const end = start + 0.1;
              const opacity = useTransform(missionProgress, [start, end], [0.2, 1]);
              
              return (
                <motion.span key={i} style={{ opacity }} className="text-white">
                  {word}
                </motion.span>
              );
            })}
          </h3>
        </div>
      </div>

      {/* 2. The Parallax Values (Floating Cards) */}
      <div className="max-w-7xl mx-auto px-6 mb-48 md:mb-64" ref={valuesRef}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-start">
          <motion.div 
            style={{ y: leftY }}
            className="p-10 md:p-16 bg-[#171717] border border-white/10 rounded-3xl group hover:border-primary/50 transition-colors duration-500"
          >
            <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.3em] text-primary mb-8 block">Principle 01</span>
            <h4 className="text-3xl md:text-5xl font-sans font-semibold uppercase tracking-tighter text-white mb-6">
              {values[0].title}
            </h4>
            <p className="text-lg md:text-xl text-white/50 leading-relaxed font-light">
              {values[0].description}
            </p>
          </motion.div>

          <motion.div 
            style={{ y: rightY }}
            className="p-10 md:p-16 bg-[#171717] border border-white/10 rounded-3xl mt-0 md:mt-32 group hover:border-primary/50 transition-colors duration-500"
          >
            <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.3em] text-primary mb-8 block">Principle 02</span>
            <h4 className="text-3xl md:text-5xl font-sans font-semibold uppercase tracking-tighter text-white mb-6">
              {values[1].title}
            </h4>
            <p className="text-lg md:text-xl text-white/50 leading-relaxed font-light">
              {values[1].description}
            </p>
          </motion.div>
        </div>
      </div>

      {/* 3. Leadership Message (Cinematic Quote) */}
      <div className="max-w-7xl mx-auto px-6 text-center flex flex-col items-center">
        <motion.div
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
          viewport={{ once: true }}
          className="w-px h-24 bg-gradient-to-b from-primary to-transparent mb-12 origin-top"
        />
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-4xl"
        >
          <blockquote className="text-3xl md:text-5xl font-sans font-semibold tracking-tight text-white/90 leading-tight mb-12 italic">
            "Our vision extends beyond singular ventures. We are building the structural integrity for tomorrow's boldest ideas."
          </blockquote>
          
          <div className="space-y-2">
            <cite className="not-italic font-sans text-sm font-semibold uppercase tracking-widest text-white block">
              Julian Thorne
            </cite>
            <span className="font-sans text-[10px] font-semibold uppercase tracking-widest text-white/40 block">
              Chief Executive, FourSix46
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
