"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Leaf, Plane, Cpu, Globe } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const ventures = [
  {
    id: "rastlina",
    title: "Rastlina",
    desc: "Biophilic architectural solutions integrating nature into urban living.",
    icon: Leaf,
    color: "primary",
    size: "large",
    imageId: "venture-1"
  },
  {
    id: "vyoma",
    title: "Vyoma",
    desc: "Propulsion systems for next-generation orbital mobility.",
    icon: Plane,
    color: "secondary",
    size: "medium",
    imageId: "venture-2"
  },
  {
    id: "nexus",
    title: "Nexus Core",
    desc: "Distributed compute infrastructure for sovereign data management.",
    icon: Cpu,
    color: "accent",
    size: "small",
    imageId: "hero-abstract"
  },
  {
    id: "m-studio",
    title: "M-Studio",
    desc: "A creative lab redefining visual communication through neo-brutalism.",
    icon: Globe,
    color: "primary",
    size: "medium",
    imageId: "mag-1"
  }
];

export default function Ventures() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section id="ventures" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="mb-16">
        <h2 className="text-sm font-code uppercase tracking-[0.3em] text-secondary mb-4">Portfolio</h2>
        <h3 className="text-5xl font-sans font-semibold uppercase tracking-tighter">Ventures</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[300px]">
        {ventures.map((v) => {
          const vImg = PlaceHolderImages.find(img => img.id === v.imageId);
          return (
            <motion.div
              key={v.id}
              onMouseEnter={() => setHovered(v.id)}
              onMouseLeave={() => setHovered(null)}
              animate={{
                opacity: hovered && hovered !== v.id ? 0.3 : 1,
                scale: hovered === v.id ? 1.01 : 1
              }}
              className={v.size === "large" ? "md:col-span-2 md:row-span-2" : v.size === "medium" ? "md:col-span-1 md:row-span-2" : "md:col-span-1 md:row-span-1"}
            >
              <div className="group relative h-full w-full bg-surface border border-border rounded-xl overflow-hidden flex flex-col p-8 transition-colors hover:border-primary/50">
                {/* Background Image Fade */}
                <div className="absolute inset-0 opacity-10 group-hover:opacity-30 transition-opacity">
                  {vImg && (
                    <Image
                      src={vImg.imageUrl}
                      alt={v.title}
                      fill
                      className="object-cover"
                      data-ai-hint={vImg.imageHint}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
                </div>

                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="flex justify-between items-start">
                    <div className={`p-3 rounded-lg bg-background border border-border text-${v.color}`}>
                      <v.icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-code opacity-50 uppercase tracking-widest">{v.id}</span>
                  </div>

                  <div>
                    <h4 className="text-2xl font-sans font-semibold mb-2 uppercase group-hover:text-primary transition-colors tracking-tighter">
                      {v.title}
                    </h4>
                    <p className="text-muted text-sm leading-relaxed max-w-[240px] font-light">
                      {v.desc}
                    </p>
                  </div>
                </div>

                <motion.div 
                  className={`absolute bottom-0 left-0 h-0.5 bg-${v.color}`}
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
