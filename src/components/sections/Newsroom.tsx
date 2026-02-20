"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";

const newsItems = [
  {
    id: "q1-orbital-expansion",
    title: "FourSix46 Announces Q1 Orbital Expansion",
    desc: "Vyoma secures key partnerships for next-generation propulsion field tests in low earth orbit.",
    tag: "Expansion",
    image: "https://images.unsplash.com/photo-1517976547714-720226b864c1?q=80&w=1000",
  },
  {
    id: "rastlina-biophilic-tower",
    title: "Rastlina Deploys First Biophilic Tower",
    desc: "A major milestone in integrating living ecosystems with urban brutalist architecture in Singapore.",
    tag: "Milestone",
    image: "https://images.unsplash.com/photo-1531591022136-eb8b0da1e6d0?q=80&w=1000",
  },
  {
    id: "nexus-sovereign-data",
    title: "Strategic Investment in Sovereign Data",
    desc: "Nexus Core scales operations across 12 global hubs to provide decentralized compute resources.",
    tag: "Investment",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000",
  },
  {
    id: "keynote-2026",
    title: "Julian Thorne Keynote at Tech Summit 2026",
    desc: "Watch the Chief Executive discuss the future of multi-venture synergy and quiet luxury.",
    tag: "Keynote",
    image: "https://images.unsplash.com/photo-1475721027187-4024733923f6?q=80&w=1000",
  },
  {
    id: "m-studio-agency-award",
    title: "M-Studio Wins Global Design Agency of the Year",
    desc: "Recognized for pioneering neo-brutalism in high-density corporate digital communications.",
    tag: "Award",
    image: "https://images.unsplash.com/photo-1604284195847-88dc4b5a9faa?q=80&w=1000",
  },
];

export default function Newsroom() {
  const targetRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollDistance, setScrollDistance] = useState(0);

  useEffect(() => {
    const updateDistance = () => {
      if (trackRef.current) {
        const trackWidth = trackRef.current.scrollWidth;
        const windowWidth = window.innerWidth;
        // Calculate the exact distance to scroll so the last card stops at the edge
        // The +100 provides a nice final padding/buffer
        setScrollDistance(Math.max(0, trackWidth - windowWidth + 100));
      }
    };

    updateDistance();
    window.addEventListener("resize", updateDistance);
    return () => window.removeEventListener("resize", updateDistance);
  }, []);

  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Map vertical scroll (0 to 1) to horizontal pixels (0 to -scrollDistance)
  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollDistance]);

  return (
    <section ref={targetRef} className="relative h-[200vh] bg-[#F5F5F7]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div 
          ref={trackRef}
          style={{ x }} 
          className="flex w-max items-center gap-12 px-6 md:px-24"
        >
          {/* Intro Block */}
          <div className="w-[85vw] md:w-[300px] flex-shrink-0 text-left">
            <span className="font-sans text-[10px] font-semibold uppercase tracking-widest text-primary mb-4 block">
              Press & Announcements
            </span>
            <h2 className="text-4xl md:text-5xl font-sans font-semibold uppercase tracking-tighter text-black mb-6 leading-none">
              NEWSROOM
            </h2>
            <p className="text-sm text-black/60 max-w-xs font-sans leading-relaxed">
              Tracking the velocity of our ventures and the impact of our global strategic nodes through the lens of structural innovation.
            </p>
          </div>

          {/* News Cards */}
          {newsItems.map((item) => (
            <div
              key={item.id}
              className="group relative w-[85vw] md:w-[320px] flex-shrink-0"
            >
              {/* Image Container */}
              <div className="relative h-[250px] w-full overflow-hidden rounded-xl bg-white shadow-xl">
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
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-sans font-semibold uppercase tracking-tighter text-black leading-tight group-hover:text-primary transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-black/60 text-xs line-clamp-2 font-sans leading-relaxed">
                  {item.desc}
                </p>
                <Link 
                  href={`/newsroom/${item.id}`}
                  className="font-sans text-[10px] font-semibold uppercase tracking-widest text-black hover:text-primary transition-colors flex items-center gap-2"
                >
                  READ RELEASE →
                </Link>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Floating Magnetic CTA Button */}
        <div className="absolute bottom-12 right-6 md:bottom-16 md:right-16 z-50">
          <MagneticButton 
            href="/newsroom" 
            variant="black"
            className="border-black/20 text-black hover:border-black"
          >
            <span className="font-sans text-[10px] font-semibold uppercase tracking-widest flex items-center gap-2">
              View All Releases <ArrowRight className="w-4 h-4" />
            </span>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
