"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Leaf, Plane, Cpu, Globe, ArrowRight, Activity, Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import MagneticButton from "@/components/ui/MagneticButton";
import { cn, getFirebaseImageUrl } from "@/lib/utils";

// --- FIREBASE IMPORTS ---
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Venture {
  id: string;
  ventureSlug: string;
  title: string;
  desc: string; 
  mission: string;
  ventureTagline: string;
  icon: any; 
  color: string;
  size: "small" | "wide" | "tall";
  heroImage: string; 
  logo: string;
  status: "Active" | "Stealth" | "Archived" | "Coming Soon";
  industryCategory: string;
  launchYear: number | string;
  geography: string[];
  url: string;
  displayOrder: number;
  partOfBadgeToggle: boolean;
  visibilityToggle: boolean;
  displayOnHome: boolean;
}

const getBrandAssets = (slug: string) => {
  switch (slug) {
    case 'rastlina': return { icon: Leaf, color: "#27A9E1" };
    case 'vyoma': return { icon: Plane, color: "#E31837" };
    case 'nexus-core': return { icon: Cpu, color: "#FFD100" };
    case 'm-studio': return { icon: Globe, color: "#27A9E1" };
    case 'aura-health': return { icon: Activity, color: "hsl(var(--accent))" };
    case 'quantum-ledger': return { icon: Lock, color: "hsl(var(--secondary))" };
    default: return { icon: Globe, color: "#FFFFFF" }; 
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

export default function Ventures() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [dynamicVentures, setDynamicVentures] = useState<Venture[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchVentures() {
      try {
        const venturesRef = collection(db, "ventures");
        const q = query(venturesRef, orderBy("displayOrder", "asc"));
        const snapshot = await getDocs(q);
        
        const fetchedData = snapshot.docs.map(doc => {
          const data = doc.data();
          const brandAssets = getBrandAssets(data.ventureSlug);
          
          return {
            id: doc.id,
            ...data,
            icon: brandAssets.icon,
            color: brandAssets.color,
            size: data.size || "small",
            displayOnHome: data.displayOnHome ?? true
          } as Venture;
        });

        setDynamicVentures(fetchedData);
      } catch (error) {
        console.error("Error fetching ventures:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchVentures();
  }, []);

  return (
    <section id="ventures" className="relative z-10 w-full bg-black py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <span className="font-sans text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">
              Portfolio
            </span>
            <h2 className="text-4xl md:text-5xl font-sans font-semibold uppercase tracking-tighter text-white">
              Ventures
            </h2>
          </motion.div>
        </header>

        {isLoading ? (
          <div className="w-full h-[400px] flex items-center justify-center border border-white/5 rounded-2xl bg-[#171717]/50">
             <span className="font-sans text-xs uppercase tracking-[0.3em] text-white/40 animate-pulse">Syncing Database...</span>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            /* THE FIX IS HERE: grid-flow-row-dense packs the grid perfectly! */
            className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[220px] grid-flow-row-dense"
          >
            {dynamicVentures.filter(v => v.visibilityToggle !== false && v.displayOnHome !== false).map((v) => {
              const imageUrl = getFirebaseImageUrl(v.heroImage);
              const isHovered = hoveredId === v.id;

              return (
                <motion.div
                  key={v.id}
                  variants={itemVariants}
                  onMouseEnter={() => setHoveredId(v.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  animate={{ scale: isHovered ? 1.01 : 1 }}
                  className={
                    v.size === "wide" ? "md:col-span-2 md:row-span-1" 
                    : v.size === "tall" ? "md:col-span-1 md:row-span-2"
                    : "md:col-span-1 md:row-span-1"
                  }
                  style={{ willChange: "transform, opacity" }}
                >
                  <div className="group relative h-full w-full bg-[#171717] border border-white/5 rounded-2xl overflow-hidden flex flex-col p-5 transition-all duration-500">
                    <div className="absolute inset-0 z-0">
                      {imageUrl && (
                        <Image src={imageUrl} alt={v.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
                    </div>

                    <div className="relative z-10 flex flex-col h-full justify-between">
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-3">
                          <div className="p-2 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 w-fit" style={{ color: v.color }}>
                            <v.icon className="w-4 h-4" />
                          </div>
                          <div className={cn(
                            "text-[9px] font-sans font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-white/10 w-fit",
                            v.status === "Active" ? "bg-primary/10 text-primary border-primary/20" : "bg-white/5 text-white/50"
                          )}>
                            {v.status}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="font-sans text-xs font-semibold uppercase tracking-widest text-white/40">
                            ID_{v.ventureSlug?.toUpperCase()}
                          </span>
                          {v.partOfBadgeToggle !== false && (
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
                            <Button variant="outline" className="rounded-full border-white/20 bg-white/5 backdrop-blur-sm font-sans text-xs font-semibold uppercase tracking-widest px-3 h-8 hover:bg-white hover:text-black transition-all group/btn">
                              Explore Venture <ArrowRight className="ml-1.5 w-2.5 h-2.5 transition-transform group-hover/btn:translate-x-0.5" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 h-1 transition-all duration-500" style={{ backgroundColor: v.color, width: isHovered ? '100%' : '0%' }} />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        <div className="mt-12 flex justify-end w-full">
          <MagneticButton href="/ventures">
            Explore All Ventures <ArrowRight className="w-4 h-4" />
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}