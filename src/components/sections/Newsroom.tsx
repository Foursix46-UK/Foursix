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
  // -75% ensures we move far enough to show the last card and some end padding
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-[#F5F5F7]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-12 px-12 md:px-24">
          {/* Intro Block */}
          <div className="flex-shrink-0 w-[400px] md:w-[600px] flex flex-col justify-center">
            <span className="font-sans text-xs font-semibold uppercase tracking-widest text-primary mb-6 block">
              Press & Announcements
            </span>
            <h2 className="text-7xl md:text-9xl font-sans font-black uppercase tracking-tighter text-black leading-none">
              NEWS<br />ROOM
            </h2>
            <p className="mt-8 text-xl text-black/60 max-w-md font-sans leading-relaxed">
              Tracking the velocity of our ventures and the impact of our global strategic nodes through the lens of structural innovation.
            </p>
          </div>

          {/* News Cards */}
          {newsItems.map((item) => (
            <div
              key={item.id}
              className="group relative w-[85vw] md:w-[600px] h-[500px] md:h-[600px] flex-shrink-0 bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-black/5"
            >
              {/* Image Container */}
              <div className="relative h-[55%] w-full overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out group-hover:scale-110"
                />
                <div className="absolute top-6 left-6">
                  <span className="px-3 py-1 bg-black text-white font-sans text-[10px] font-semibold uppercase tracking-widest rounded-full">
                    {item.tag}
                  </span>
                </div>
              </div>
              
              {/* Content Container */}
              <div className="flex-1 p-8 md:p-12 flex flex-col justify-between">
                <div>
                  <h3 className="text-3xl md:text-4xl font-sans font-black uppercase tracking-tight text-black leading-tight mb-4 group-hover:text-primary transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-black/60 text-lg line-clamp-2 font-sans leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                
                <Link 
                  href="/newsroom"
                  className="flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-widest text-black hover:text-primary transition-colors group/link"
                >
                  Read Release 
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </div>
          ))}

          {/* End Spacer */}
          <div className="flex-shrink-0 w-[10vw]" />
        </motion.div>
      </div>
    </section>
  );
}