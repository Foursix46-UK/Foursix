
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
  { 
    name: "Julian Thorne", 
    role: "Chief Executive", 
    imgId: "team-1",
    bio: "Orchestrating cross-border logistics and scaling multi-venture operations for the holding group."
  },
  { 
    name: "Alara Vane", 
    role: "Creative Director", 
    imgId: "team-1",
    bio: "Defining brand narratives that balance aesthetic purity with structural honesty."
  },
  { 
    name: "Marcus Key", 
    role: "Operations Lead", 
    imgId: "team-1",
    bio: "Driving biophilic integration and sovereign infrastructure across our global portfolio."
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
      className="max-w-2xl mx-auto text-base md:text-lg text-white/70 font-light leading-relaxed tracking-tight"
    >
      {characters.map((char, index) => (
        <motion.span key={index} variants={charVariants}>
          {char}
        </motion.span>
      ))}
    </motion.p>
  );
};

const Word = ({ children, progress, range }: { children: string; progress: any; range: [number, number] }) => {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <span className="relative inline-block mr-3 lg:mr-4">
      <motion.span style={{ opacity }} className="text-white">
        {children}
      </motion.span>
    </span>
  );
};

export default function About() {
  const containerRef = useRef<HTMLElement>(null);
  const ethosRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const { scrollYProgress: ethosProgress } = useScroll({
    target: ethosRef,
    offset: ["start 0.9", "end 0.1"]
  });

  // Hero Parallax and Fade Animations
  const heroY = useTransform(scrollYProgress, [0, 0.4], [0, 100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  const ethosText = "Founded on the principles of neo-brutalism and quiet luxury, FourSix46 was established to bridge the gap between functional excellence and aesthetic purity. We cultivate ventures that define the future of human experience.";
  const words = ethosText.split(" ");

  return (
    <section ref={containerRef} className="relative bg-black text-white selection:bg-primary selection:text-white pb-32">
      {/* 1. Cinematic Hero: A HUB FOR INNOVATION */}
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
          className="text-7xl md:text-9xl font-sans font-black uppercase tracking-tighter leading-[0.9] mb-12 text-white"
        >
          A HUB FOR<br />INNOVATION
        </motion.h1>

        <TypewriterText text="The gateway to the FourSix46 ecosystem. A house of bold ventures driven by strategic leadership and global ambition." />
      </motion.div>

      {/* 2. The Ethos (Scroll Text Reveal) */}
      <div ref={ethosRef} className="relative h-[150vh] w-full bg-black">
        <div className="sticky top-0 h-screen flex flex-col justify-center max-w-4xl mx-auto px-6">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-sm font-semibold uppercase tracking-widest text-primary mb-12"
          >
            The Ethos
          </motion.h2>
          <div className="flex flex-wrap text-2xl md:text-3xl font-sans font-medium leading-relaxed tracking-tight">
            {words.map((word, i) => {
              const start = i / words.length;
              const end = start + 1 / words.length;
              return (
                <Word key={i} progress={ethosProgress} range={[start, end]}>
                  {word}
                </Word>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. The Journey (Sticky Timeline) */}
      <div className="max-w-7xl mx-auto px-6 py-32 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 border-t border-white/10">
        <div className="lg:col-span-4 relative">
          <div className="sticky top-32">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">The Journey</h2>
            <h3 className="text-4xl font-sans font-medium uppercase tracking-tighter">Founding<br/>Story</h3>
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

      {/* 4. Leadership */}
      <div className="max-w-7xl mx-auto px-6 py-32 border-t border-white/10">
        <div className="mb-16">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">The People</h2>
          <h3 className="text-4xl font-sans font-medium uppercase tracking-tighter">Leadership</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          {team.map((member) => {
            const memberImg = PlaceHolderImages.find(img => img.id === member.imgId);
            return (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group relative min-h-[140px] bg-[#111] border border-white/10 rounded-xl flex items-center px-8 md:px-12 overflow-hidden py-8"
              >
                <div className="flex-1 z-10 space-y-2">
                  <h5 className="text-xl font-sans font-medium uppercase text-white group-hover:text-primary transition-colors tracking-tight">
                    {member.name}
                  </h5>
                  <p className="text-primary text-[10px] font-semibold tracking-widest uppercase">
                    {member.role}
                  </p>
                  <p className="text-sm text-white/50 font-light max-w-xl leading-relaxed tracking-tight">
                    {member.bio}
                  </p>
                </div>
                
                {/* Hover Image Reveal */}
                <div className="absolute right-0 top-0 h-full w-48 md:w-64 translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out z-0">
                  {memberImg && (
                    <Image
                      src={memberImg.imageUrl}
                      alt={member.name}
                      fill
                      className="object-cover grayscale"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/60" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#111] to-transparent w-24 left-0" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
