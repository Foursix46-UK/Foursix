
"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  ExternalLink, 
  Leaf, 
  Plane, 
  Cpu, 
  Globe, 
  Activity,
  Lock
} from "lucide-react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { leadershipData } from "@/lib/leadership-data";
import { LeadershipCard } from "@/components/sections/LeadershipUI";

// Mock data for ventures updated with CMS-driven logo paths and metadata
const venturesDetailData: Record<string, any> = {
  rastlina: {
    title: "Rastlina",
    ventureTagline: "The City, Re-Greened.",
    industryCategory: "Biophilic Architecture",
    launchYear: "2020",
    geography: ["Singapore", "Tokyo", "London"],
    color: "#27A9E1",
    logo: "/logo2.png", // Using main logo as placeholder for ventures
    icon: Leaf,
    imageId: "venture-1",
    mission: "To fundamentally redefine urban living by synthesizing biological systems with high-density architectural structures. Rastlina believes that the future of the city is not built against nature, but through it.",
    stats: [
      { label: "Vertical Forest Area", value: "45,000 m²" },
      { label: "CO2 Reduction p.a.", value: "12,000 Tons" },
      { label: "Active Projects", value: "14 Cities" }
    ],
    leadershipIds: ["julian-thorne", "alara-vane"],
    url: "https://rastlina.example.com"
  },
  vyoma: {
    title: "Vyoma",
    ventureTagline: "Orchestrating Orbital Velocity.",
    industryCategory: "Aerospace Propulsion",
    launchYear: "2021",
    geography: ["USA", "UAE", "Global"],
    color: "#E31837",
    logo: "/logo2.png",
    icon: Plane,
    imageId: "venture-2",
    mission: "Accelerating the transition to sustainable orbital mobility. Vyoma develops next-generation plasma propulsion systems that provide the velocity and precision required for the new space economy while minimizing ecological footprint.",
    stats: [
      { label: "Propulsion Efficiency", value: "+320%" },
      { label: "Payload Capacity", value: "2,500 kg" },
      { label: "Launch Partners", value: "8 Global" }
    ],
    leadershipIds: ["elena-volkov", "julian-thorne"],
    url: "https://vyoma.example.com"
  },
  nexus: {
    title: "Nexus Core",
    ventureTagline: "Sovereign Intelligence, Decentralized.",
    industryCategory: "Distributed Compute",
    launchYear: "2019",
    geography: ["Global", "Sovereign Zones"],
    color: "#FFD100",
    logo: "/logo2.png",
    icon: Cpu,
    imageId: "hero-abstract",
    mission: "Nexus Core provides the decentralized backbone for sovereign data management. Our infrastructure nodes are designed for extreme efficiency, providing high-performance compute resources to global enterprises without centralized vulnerability.",
    stats: [
      { label: "Uptime Reliability", value: "99.9999%" },
      { label: "Nodes Deployed", value: "1,200+" },
      { label: "Data Throughput", value: "400 PB/s" }
    ],
    leadershipIds: ["aris-chen"],
    url: "https://nexus-core.example.com"
  },
  "m-studio": {
    title: "M-Studio",
    ventureTagline: "Aesthetic Purity. Structural Honesty.",
    industryCategory: "Creative Strategy",
    launchYear: "2018",
    geography: ["London", "New York", "Remote"],
    color: "#27A9E1",
    logo: "/logo2.png",
    icon: Globe,
    imageId: "mag-1",
    mission: "Redefining visual communication through the lens of neo-brutalism and quiet luxury. M-Studio serves as the design laboratory for the FourSix46 holding group, crafting narratives that resonate with global elites and industrial innovators alike.",
    stats: [
      { label: "Global Campaigns", value: "150+" },
      { label: "Design Awards", value: "24 Gold" },
      { label: "Retention Rate", value: "98%" }
    ],
    leadershipIds: ["alara-vane"],
    url: "https://m-studio.example.com"
  },
  aura: {
    title: "Aura Health",
    ventureTagline: "Predictive Vitality.",
    industryCategory: "HealthTech / AI",
    launchYear: "2023",
    geography: ["Switzerland", "USA"],
    color: "hsl(var(--accent))",
    logo: "/logo2.png",
    icon: Activity,
    imageId: "mag-2",
    mission: "Pioneering the future of human longevity through AI-driven diagnostics. Aura Health analyzes complex biological data to provide personalized therapeutic roadmaps, moving healthcare from reactive to predictive.",
    stats: [
      { label: "Diagnosis Accuracy", value: "99.4%" },
      { label: "Data Points/Patient", value: "1.2B" },
      { label: "Research Patents", value: "42" }
    ],
    leadershipIds: ["julian-thorne"],
    url: "https://aura-health.example.com"
  },
  quantum: {
    title: "Quantum Ledger",
    ventureTagline: "Future-Proof Cryptography.",
    industryCategory: "Cybersecurity",
    launchYear: "2022",
    geography: ["Global"],
    color: "hsl(var(--secondary))",
    logo: "/logo2.png",
    icon: Lock,
    imageId: "gallery-5",
    mission: "Securing the world's most sensitive financial transactions. Quantum Ledger develops post-quantum cryptographic standards that protect institutional assets against future computational threats.",
    stats: [
      { label: "Security Tier", value: "Level 4" },
      { label: "Asset Protection", value: "$4.2T+" },
      { label: "Encryption Latency", value: "<1ms" }
    ],
    leadershipIds: ["aris-chen", "marcus-key"],
    url: "https://quantum-ledger.example.com"
  }
};

export default function VentureDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const venture = venturesDetailData[id];

  if (!venture) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <h1 className="text-4xl font-black uppercase mb-4 text-white">Venture Not Found</h1>
        <Link href="/ventures">
          <Button variant="outline" className="rounded-none font-sans text-xs font-semibold uppercase tracking-widest px-8 text-white">
            Back to Ventures
          </Button>
        </Link>
      </main>
    );
  }

  const heroImage = PlaceHolderImages.find(img => img.id === venture.imageId);
  const ventureLeaders = leadershipData.filter(leader => venture.leadershipIds.includes(leader.id));

  return (
    <main className="min-h-screen bg-background selection:bg-primary selection:text-white">
      <Navbar />

      {/* Page Header / Hero */}
      <section className="relative h-[80vh] w-full overflow-hidden flex items-end">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          {heroImage && (
            <Image 
              src={heroImage.imageUrl} 
              alt={venture.title} 
              fill 
              className="object-cover grayscale opacity-60"
              priority
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </motion.div>

        {/* pt-32 added to fix Navbar overlap */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <Link 
              href="/ventures" 
              className="flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-widest text-primary hover:text-white transition-colors mb-12 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to All Ventures
            </Link>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="space-y-4">
                {/* CMS-Driven Venture Logo Upgrade */}
                {venture.logo ? (
                  <div className="mb-6 h-16 w-auto relative">
                    <Image 
                      src={venture.logo} 
                      alt={`${venture.title} Logo`}
                      width={240}
                      height={64}
                      className="h-16 w-auto object-contain brightness-0 invert"
                    />
                  </div>
                ) : (
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center border border-white/10 bg-surface/50 backdrop-blur-xl mb-4"
                    style={{ color: venture.color }}
                  >
                    <venture.icon className="w-8 h-8" />
                  </div>
                )}
                
                <h1 className="text-7xl md:text-9xl font-sans font-black uppercase tracking-tighter leading-none text-white">
                  {venture.title}
                </h1>
                
                <p className="text-2xl font-light text-white/70 mt-4 tracking-tight max-w-2xl">
                  {venture.ventureTagline}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest text-white/50 mt-8 border-l-2 border-primary/40 pl-6">
                  <span>EST. {venture.launchYear}</span>
                  <span className="w-1 h-1 bg-white/20 rounded-full" />
                  <span>{venture.industryCategory}</span>
                  <span className="w-1 h-1 bg-white/20 rounded-full" />
                  <span>{venture.geography.join(" · ")}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
          <aside className="lg:col-span-4 lg:sticky lg:top-32 h-fit space-y-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 border border-border bg-surface rounded-2xl space-y-8"
            >
              <h2 className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">At a Glance</h2>
              
              <div className="space-y-6">
                <div>
                  <span className="font-sans text-[9px] font-semibold uppercase text-white/20 block mb-1">Industry</span>
                  <span className="text-lg font-black uppercase text-white">{venture.industryCategory}</span>
                </div>
                <div>
                  <span className="font-sans text-[9px] font-semibold uppercase text-white/20 block mb-1">Founded</span>
                  <span className="text-lg font-black uppercase text-white">{venture.launchYear}</span>
                </div>
                <div>
                  <span className="font-sans text-[9px] font-semibold uppercase text-white/20 block mb-1">Status</span>
                  <span className="text-lg font-black uppercase text-secondary">Active Scaling</span>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  asChild
                  className="w-full h-14 rounded-xl font-sans text-xs font-bold uppercase tracking-widest group transition-all"
                  style={{ backgroundColor: venture.color, color: venture.color.includes('accent') || venture.color.includes('FFD100') ? 'black' : 'white' }}
                >
                  <a href={venture.url} target="_blank" rel="noopener noreferrer">
                    Visit Website <ExternalLink className="ml-2 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </a>
                </Button>
              </div>
            </motion.div>
          </aside>

          <div className="lg:col-span-8 space-y-32">
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.4em] text-primary border-l-4 border-primary pl-6">Mission & Narrative</h2>
              <p className="text-3xl md:text-4xl font-light leading-snug text-white/90 font-sans tracking-tight">
                {venture.mission}
              </p>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-12"
            >
              <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.4em] text-white/30">Strategic Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {venture.stats.map((stat: any, idx: number) => (
                  <div key={idx} className="p-8 border border-border bg-surface/50 rounded-2xl group hover:border-primary transition-colors">
                    <span className="font-sans text-[9px] font-semibold text-white/20 uppercase tracking-widest block mb-4">{stat.label}</span>
                    <span className="text-4xl font-black uppercase text-white group-hover:text-primary transition-colors">{stat.value}</span>
                  </div>
                ))}
              </div>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-12"
            >
              <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.4em] text-white/30">Venture Leadership</h2>
              <div className="grid grid-cols-1 gap-8">
                {ventureLeaders.map((leader) => (
                  <LeadershipCard 
                    key={leader.id} 
                    leader={leader} 
                  />
                ))}
              </div>
            </motion.section>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
