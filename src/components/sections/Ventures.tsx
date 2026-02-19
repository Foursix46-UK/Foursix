
"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Leaf, Plane, Cpu, Globe, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";

const ventures = [
  {
    id: "rastlina",
    title: "Rastlina",
    desc: "Biophilic architectural solutions integrating nature into urban living.",
    icon: Leaf,
    color: "#27A9E1", // Brand Cyan
    size: "large",
    imageId: "venture-1"
  },
  {
    id: "vyoma",
    title: "Vyoma",
    desc: "Propulsion systems for next-generation orbital mobility.",
    icon: Plane,
    color: "#E31837", // Brand Red
    size: "medium",
    imageId: "venture-2"
  },
  {
    id: "nexus",
    title: "Nexus Core",
    desc: "Distributed compute infrastructure for sovereign data management.",
    icon: Cpu,
    color: "#FFD100", // Brand Accent Yellow
    size: "small",
    imageId: "hero-abstract"
  },
  {
    id: "m-studio",
    title: "M-Studio",
    desc: "A creative lab redefining visual communication through neo-brutalism.",
    icon: Globe,
    color: "#27A9E1",
    size: "medium",
    imageId: "mag-1"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] 
    } 
  }
};

export default function Ventures() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section 
      id="ventures" 
      className="relative z-10 w-full bg-black py-20 px-6"
    >
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-sans text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">
              The Collective
            </span>
            <h2 className="text-4xl md:text-5xl font-sans font-semibold uppercase tracking-tighter">
              Ventures
            </h2>
          </motion.div>
        </header>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[180px]"
        >
          {ventures.map((v) => {
            const vImg = PlaceHolderImages.find(img => img.id === v.imageId);
            const isHovered = hoveredId === v.id;
            const isAnyHovered = hoveredId !== null;

            return (
              <motion.div
                key={v.id}
                variants={itemVariants}
                onMouseEnter={() => setHoveredId(v.id)}
                onMouseLeave={() => setHoveredId(null)}
                animate={{
                  scale: isHovered ? 1.01 : 1,
                  opacity: isAnyHovered && !isHovered ? 0.4 : 1,
                  filter: isAnyHovered && !isHovered ? "blur(4px)" : "blur(0px)",
                }}
                className={
                  v.size === "large" 
                    ? "md:col-span-2 md:row-span-2" 
                    : v.size === "medium" 
                    ? "md:col-span-1 md:row-span-2" 
                    : "md:col-span-1 md:row-span-1"
                }
                style={{ willChange: "transform, opacity, filter" }}
              >
                <div className="group relative h-full w-full bg-[#171717] border border-white/5 rounded-2xl overflow-hidden flex flex-col p-5 transition-all duration-500">
                  {/* Background Image */}
                  <div className="absolute inset-0 z-0">
                    {vImg && (
                      <Image
                        src={vImg.imageUrl}
                        alt={v.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        data-ai-hint={vImg.imageHint}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90" />
                  </div>

                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="flex justify-between items-start">
                      <div 
                        className="p-2 rounded-lg bg-black/40 backdrop-blur-md border border-white/10"
                        style={{ color: v.color }}
                      >
                        <v.icon className="w-4 h-4" />
                      </div>
                      <span className="font-sans text-[8px] font-semibold text-white/40 uppercase tracking-widest">
                        ID_{v.id.toUpperCase()}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="space-y-0.5">
                        <h4 className="text-xl font-sans font-semibold uppercase tracking-tighter text-white">
                          {v.title}
                        </h4>
                        <p className="text-white/60 text-[10px] leading-tight max-w-xs font-light line-clamp-2">
                          {v.desc}
                        </p>
                      </div>

                      <div className="pt-2">
                        <Link href={`/ventures/${v.id}`} passHref>
                          <Button 
                            variant="outline" 
                            className="rounded-full border-white/20 bg-white/5 backdrop-blur-sm font-sans text-[8px] font-semibold uppercase tracking-widest px-3 h-8 hover:bg-white hover:text-black transition-all group/btn"
                          >
                            Explore Venture
                            <ArrowRight className="ml-1.5 w-2.5 h-2.5 transition-transform group-hover/btn:translate-x-0.5" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Decorative Bottom Edge */}
                  <div 
                    className="absolute bottom-0 left-0 h-1 transition-all duration-500"
                    style={{ 
                      backgroundColor: v.color,
                      width: isHovered ? '100%' : '0%' 
                    }}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
