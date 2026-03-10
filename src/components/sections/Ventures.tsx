
"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Leaf, Plane, Cpu, Globe, ArrowRight, Activity, Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import MagneticButton from "@/components/ui/MagneticButton";
import { cn } from "@/lib/utils";

export interface Venture {
  id: string;
  ventureSlug: string;
  title: string;
  desc: string; // Short Description
  longDescription: string;
  ventureTagline: string;
  icon: any;
  color: string;
  size: "small" | "wide" | "tall";
  imageId: string;
  status: "Active" | "Stealth" | "Archived" | "Coming Soon";
  industryCategory: string;
  launchYear: number | string;
  geography: string[];
  websiteUrl: string;
  displayOrder: number;
  partOfBadgeToggle: boolean;
  visibilityToggle: boolean;
}

const ventures: Venture[] = [
  {
    id: "rastlina",
    ventureSlug: "rastlina",
    title: "Rastlina",
    desc: "Biophilic architectural solutions integrating nature into urban living.",
    longDescription: "Rastlina is a pioneer in regenerative urban design, merging high-density modular structures with self-sustaining biological systems. Our vertical forests provide more than just aesthetic value; they are functional lungs for the modern city, filtering air, managing thermal loads, and restoring biodiversity.",
    ventureTagline: "The City, Re-Greened.",
    icon: Leaf,
    color: "#27A9E1",
    size: "wide",
    imageId: "venture-1",
    status: "Active",
    industryCategory: "Biophilic Architecture",
    launchYear: 2020,
    geography: ["Singapore", "Tokyo", "London"],
    websiteUrl: "https://rastlina.example.com",
    displayOrder: 1,
    partOfBadgeToggle: true,
    visibilityToggle: true,
  },
  {
    id: "vyoma",
    ventureSlug: "vyoma",
    title: "Vyoma",
    desc: "Propulsion systems for next-generation orbital mobility.",
    longDescription: "Vyoma is accelerating the transition to sustainable orbital-scale logistics. By developing high-efficiency plasma propulsion systems, we enable precise, long-duration maneuvering for satellite constellations and future orbital nodes, reducing the energy cost of space access.",
    ventureTagline: "Orchestrating Orbital Velocity.",
    icon: Plane,
    color: "#E31837",
    size: "tall",
    imageId: "venture-2",
    status: "Active",
    industryCategory: "Aerospace Propulsion",
    launchYear: 2021,
    geography: ["USA", "UAE", "Global"],
    websiteUrl: "https://vyoma.example.com",
    displayOrder: 2,
    partOfBadgeToggle: true,
    visibilityToggle: true,
  },
  {
    id: "nexus",
    ventureSlug: "nexus-core",
    title: "Nexus Core",
    desc: "Distributed compute infrastructure for sovereign data management.",
    longDescription: "Nexus Core provides the decentralized backbone for a sovereign digital age. Our global network of high-efficiency compute nodes offers enterprises a secure alternative to centralized cloud vulnerabilities, ensuring data integrity through distributed cryptographic verification.",
    ventureTagline: "Sovereign Intelligence, Decentralized.",
    icon: Cpu,
    color: "#FFD100",
    size: "small",
    imageId: "hero-abstract",
    status: "Active",
    industryCategory: "Distributed Compute",
    launchYear: 2019,
    geography: ["Global", "Sovereign Zones"],
    websiteUrl: "https://nexus-core.example.com",
    displayOrder: 3,
    partOfBadgeToggle: true,
    visibilityToggle: true,
  },
  {
    id: "m-studio",
    ventureSlug: "m-studio",
    title: "M-Studio",
    desc: "A creative lab redefining visual communication through neo-brutalism.",
    longDescription: "M-Studio is the strategic design laboratory for the avant-garde. We specialize in building brand identities that balance the raw honesty of neo-brutalism with the refined poise of quiet luxury, creating visual narratives that resonate with global leaders and industrial innovators.",
    ventureTagline: "Aesthetic Purity. Structural Honesty.",
    icon: Globe,
    color: "#27A9E1",
    size: "small",
    imageId: "mag-1",
    status: "Active",
    industryCategory: "Creative Strategy",
    launchYear: 2018,
    geography: ["London", "New York", "Remote"],
    websiteUrl: "https://m-studio.example.com",
    displayOrder: 4,
    partOfBadgeToggle: true,
    visibilityToggle: true,
  },
  {
    id: "aura",
    ventureSlug: "aura-health",
    title: "Aura Health",
    desc: "AI-driven diagnostics and personalized longevity therapeutics.",
    longDescription: "Aura Health leverages advanced bio-intelligence to transform human longevity. Our platform analyzes trillions of data points to provide personalized diagnostic roadmaps, shifting the healthcare paradigm from reactive treatment to predictive optimization.",
    ventureTagline: "Predictive Vitality.",
    icon: Activity,
    color: "hsl(var(--accent))",
    size: "wide",
    imageId: "mag-2",
    status: "Coming Soon",
    industryCategory: "HealthTech / AI",
    launchYear: 2024,
    geography: ["Switzerland", "USA"],
    websiteUrl: "https://aura-health.example.com",
    displayOrder: 5,
    partOfBadgeToggle: true,
    visibilityToggle: true,
  },
  {
    id: "quantum",
    ventureSlug: "quantum-ledger",
    title: "Quantum Ledger",
    desc: "Next-gen cryptographic security for institutional finance.",
    longDescription: "Quantum Ledger is building the security layer for the post-quantum world. We develop cryptographic standards that protect institutional financial transactions against the computational threats of tomorrow, ensuring multi-generational asset security.",
    ventureTagline: "Future-Proof Cryptography.",
    icon: Lock,
    color: "hsl(var(--secondary))",
    size: "small",
    imageId: "gallery-5",
    status: "Stealth",
    industryCategory: "Cybersecurity",
    launchYear: 2022,
    geography: ["Global"],
    websiteUrl: "https://quantum-ledger.example.com",
    displayOrder: 6,
    partOfBadgeToggle: true,
    visibilityToggle: true,
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
              Portfolio
            </span>
            <h2 className="text-4xl md:text-5xl font-sans font-semibold uppercase tracking-tighter text-white">
              Ventures
            </h2>
          </motion.div>
        </header>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[220px]"
        >
          {ventures.filter(v => v.visibilityToggle).map((v) => {
            const vImg = PlaceHolderImages.find(img => img.id === v.imageId);
            const isHovered = hoveredId === v.id;

            return (
              <motion.div
                key={v.id}
                variants={itemVariants}
                onMouseEnter={() => setHoveredId(v.id)}
                onMouseLeave={() => setHoveredId(null)}
                animate={{
                  scale: isHovered ? 1.01 : 1,
                }}
                className={
                  v.size === "wide" 
                    ? "md:col-span-2 md:row-span-1" 
                    : v.size === "tall"
                    ? "md:col-span-1 md:row-span-2"
                    : "md:col-span-1 md:row-span-1"
                }
                style={{ willChange: "transform, opacity" }}
              >
                <div className="group relative h-full w-full bg-[#171717] border border-white/5 rounded-2xl overflow-hidden flex flex-col p-5 transition-all duration-500">
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
                  </div>

                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-3">
                        <div 
                          className="p-2 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 w-fit"
                          style={{ color: v.color }}
                        >
                          <v.icon className="w-4 h-4" />
                        </div>
                        <div className={cn(
                          "text-[9px] font-sans font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-white/10 w-fit",
                          v.status === "Active" 
                            ? "bg-primary/10 text-primary border-primary/20" 
                            : "bg-white/5 text-white/50"
                        )}>
                          {v.status}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="font-sans text-xs font-semibold uppercase tracking-widest text-white/40">
                          ID_{v.id.toUpperCase()}
                        </span>
                        {v.partOfBadgeToggle && (
                          <span className="text-[6px] font-bold uppercase tracking-widest text-primary/50">FourSix46 Entity</span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="space-y-0.5">
                        <h4 className="text-xl font-sans font-semibold uppercase tracking-tighter text-white">
                          {v.title}
                        </h4>
                        <p className="text-white/60 text-xs leading-tight max-w-xs font-sans tracking-tight line-clamp-2">
                          {v.desc}
                        </p>
                      </div>

                      <div className="pt-2">
                        <Link href={`/ventures/${v.id}`} passHref>
                          <Button 
                            variant="outline" 
                            className="rounded-full border-white/20 bg-white/5 backdrop-blur-sm font-sans text-xs font-semibold uppercase tracking-widest px-3 h-8 hover:bg-white hover:text-black transition-all group/btn"
                          >
                            Explore Venture
                            <ArrowRight className="ml-1.5 w-2.5 h-2.5 transition-transform group-hover/btn:translate-x-0.5" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>

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

        {/* Explore All Ventures Button */}
        <div className="mt-12 flex justify-end w-full">
          <MagneticButton href="/ventures">
            <span className="font-sans text-xs font-semibold uppercase tracking-widest flex items-center gap-2">
              Explore All Ventures <ArrowRight className="w-4 h-4" />
            </span>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
