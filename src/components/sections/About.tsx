
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const timelineData = [
  { 
    year: "2018", 
    title: "Founding", 
    content: "Born in a minimalist studio with a vision for multibrand synergy and structural honesty." 
  },
  { 
    year: "2020", 
    title: "Expansion", 
    content: "Scaling across sectors from deep tech infrastructure to quiet luxury lifestyle ventures." 
  },
  { 
    year: "2022", 
    title: "Global Reach", 
    content: "Establishing a strategic presence in over 12 global tech hubs and strategic nodes." 
  },
  { 
    year: "2024", 
    title: "Future Forward", 
    content: "Investing in the next generation of biophilic architecture and orbital propulsion systems." 
  },
];

const team = [
  { name: "Julian Thorne", role: "Chief Executive", imgId: "team-1" },
  { name: "Alara Vane", role: "Creative Director", imgId: "team-1" },
  { name: "Marcus Key", role: "Operations Lead", imgId: "team-1" },
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
      className="max-w-2xl mx-auto text-lg md:text-xl text-white/50 font-light leading-relaxed tracking-tight"
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
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Hero Parallax and Fade Animations
  const heroY = useTransform(scrollYProgress, [0, 0.4], [0, 100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <section ref={containerRef} className="relative bg-black text-white selection:bg-primary selection:text-white pb-32">
      {/* 1. Cinematic Hero: A Hub For Innovation */}
      <motion.div 
        style={{ y: heroY, opacity: heroOpacity }}
        className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 pt-32"
      >
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-sans text-[10px] font-semibold uppercase tracking-[0.5em] text-primary mb-8"
        >
          Our Purpose
        </motion.span>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-6xl md:text-7xl font-sans font-black uppercase tracking-tight leading-tight mb-8 text-glass"
        >
          A Hub For<br />Innovation
        </motion.h1>

        {/* Removed any dividers or horizontal lines here */}
        <TypewriterText text="The gateway to the FourSix46 ecosystem. A house of bold ventures driven by strategic leadership and global ambition." />
      </motion.div>

      {/* 2. The Ethos (Mission Statement) */}
      <div className="max-w-5xl mx-auto px-6 py-32 border-t border-white/10">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-primary mb-12">The Ethos</h2>
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-5xl font-light leading-snug tracking-tight text-white/80"
        >
          Founded on the principles of neo-brutalism and quiet luxury, FourSix46 was established to bridge the gap between functional excellence and aesthetic purity. <span className="text-white font-medium">We cultivate ventures that define the future of human experience.</span>
        </motion.p>
      </div>

      {/* 3. The Journey (Sticky Timeline) */}
      <div className="max-w-7xl mx-auto px-6 py-32 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 border-t border-white/10">
        <div className="lg:col-span-4 relative">
          <div className="sticky top-32">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">The Journey</h2>
            <h3 className="text-5xl font-black uppercase tracking-tighter">Founding<br/>Story</h3>
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
              <span className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-white/50 mb-4 block">{item.year}</span>
              <h4 className="text-3xl font-black uppercase mb-6">{item.title}</h4>
              <p className="text-white/60 text-xl font-light max-w-lg leading-relaxed">{item.content}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 4. Leadership */}
      <div className="max-w-7xl mx-auto px-6 py-32 border-t border-white/10">
        <div className="mb-16">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">The People</h2>
          <h3 className="text-5xl font-black uppercase tracking-tighter">Leadership</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {team.map((member) => {
            const memberImg = PlaceHolderImages.find(img => img.id === member.imgId);
            return (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group relative h-28 bg-[#111] border border-white/10 rounded-xl flex items-center px-8 md:px-12 overflow-hidden"
              >
                <div className="flex-1 z-10">
                  <h5 className="text-2xl font-black uppercase group-hover:text-primary transition-colors">{member.name}</h5>
                  <p className="text-white/50 text-sm tracking-widest uppercase mt-1">{member.role}</p>
                </div>
                
                {/* Hover Image Reveal */}
                <div className="absolute right-0 top-0 h-full w-48 md:w-64 translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out z-0">
                  {memberImg && (
                    <Image
                      src={memberImg.imageUrl}
                      alt={member.name}
                      fill
                      className="object-cover grayscale"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#111] to-transparent w-12 left-0" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
