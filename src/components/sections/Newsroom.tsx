
"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const newsItems = [
  {
    id: 1,
    title: "FourSix46 Announces Q1 Orbital Expansion",
    desc: "Vyoma secures key partnerships for next-generation propulsion field tests in low earth orbit.",
    tag: "Expansion",
    image: "https://images.unsplash.com/photo-1517976547714-720226b864c1?q=80&w=1000",
  },
  {
    id: 2,
    title: "Rastlina Deploys First Biophilic Tower",
    desc: "A major milestone in integrating living ecosystems with urban brutalist architecture in Singapore.",
    tag: "Milestone",
    image: "https://images.unsplash.com/photo-1531591022136-eb8b0da1e6d0?q=80&w=1000",
  },
  {
    id: 3,
    title: "Strategic Investment in Sovereign Data",
    desc: "Nexus Core scales operations across 12 global hubs to provide decentralized compute resources.",
    tag: "Investment",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000",
  },
  {
    id: 4,
    title: "Julian Thorne Keynote at Tech Summit 2026",
    desc: "Watch the Chief Executive discuss the future of multi-venture synergy and quiet luxury.",
    tag: "Keynote",
    image: "https://images.unsplash.com/photo-1475721027187-4024733923f6?q=80&w=1000",
  },
];

export default function Newsroom() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Map vertical scroll to horizontal movement
  // Scaled down to -55% to account for smaller UI elements and prevent dead space
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-55%"]);

  return (
    <section ref={targetRef} className="relative h-[200vh] bg-[#F5F5F7]">
      <div className="sticky top-0 flex h-screen items-start pt-32 md:pt-40 overflow-hidden">
        <motion.div style={{ x }} className="flex gap-12 px-12 md:px-24">
          {/* Intro Block - Scaled Down */}
          <div className="flex-shrink-0 w-[85vw] md:w-[300px] flex flex-col justify-start pt-4">
            <span className="font-sans text-[10px] font-semibold uppercase tracking-widest text-primary mb-4 block">
              Press & Announcements
            </span>
            <h2 className="text-4xl md:text-5xl font-sans font-semibold uppercase tracking-tighter text-black mb-6 leading-none">
              NEWS<br />ROOM
            </h2>
            <p className="text-sm text-black/60 max-w-xs font-sans leading-relaxed">
              Tracking the velocity of our ventures and the impact of our global strategic nodes through the lens of structural innovation.
            </p>
          </div>

          {/* News Cards - Scaled Down (50% reduction in area feel) */}
          {newsItems.map((item, idx) => (
            <div
              key={item.id}
              className={`group relative w-[85vw] md:w-[320px] h-[380px] flex-shrink-0 bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col border border-black/5 ${idx === newsItems.length - 1 ? 'mr-24' : ''}`}
            >
              {/* Image Container */}
              <div className="relative h-[45%] w-full overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-2 py-0.5 bg-black text-white font-sans text-[8px] font-semibold uppercase tracking-widest rounded-full">
                    {item.tag}
                  </span>
                </div>
              </div>
              
              {/* Content Container */}
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-sans font-semibold uppercase tracking-tighter text-black leading-tight mb-3 group-hover:text-primary transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-black/60 text-xs line-clamp-3 font-sans leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                
                <Link 
                  href="/newsroom"
                  className="flex items-center gap-2 font-sans text-[10px] font-semibold uppercase tracking-widest text-black hover:text-primary transition-colors group/link"
                >
                  Read Release 
                  <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
