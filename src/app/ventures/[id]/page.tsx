
"use client";

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
  Shield, 
  Zap, 
  BarChart3 
} from "lucide-react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import React from "react";

// Mock data for ventures
const venturesDetailData: Record<string, any> = {
  rastlina: {
    title: "Rastlina",
    industry: "Biophilic Architecture",
    founded: "2020",
    color: "#27A9E1",
    icon: Leaf,
    imageId: "venture-1",
    mission: "To fundamentally redefine urban living by synthesizing biological systems with high-density architectural structures. Rastlina believes that the future of the city is not built against nature, but through it.",
    stats: [
      { label: "Vertical Forest Area", value: "45,000 m²" },
      { label: "CO2 Reduction p.a.", value: "12,000 Tons" },
      { label: "Active Projects", value: "14 Cities" }
    ],
    leadership: {
      name: "Dr. Elena Volkov",
      role: "Chief Systems Architect",
      imageId: "team-1"
    },
    url: "https://rastlina.example.com"
  },
  vyoma: {
    title: "Vyoma",
    industry: "Aerospace Propulsion",
    founded: "2021",
    color: "#E31837",
    icon: Plane,
    imageId: "venture-2",
    mission: "Accelerating the transition to sustainable orbital mobility. Vyoma develops next-generation plasma propulsion systems that provide the velocity and precision required for the new space economy while minimizing ecological footprint.",
    stats: [
      { label: "Propulsion Efficiency", value: "+320%" },
      { label: "Payload Capacity", value: "2,500 kg" },
      { label: "Launch Partners", value: "8 Global" }
    ],
    leadership: {
      name: "Marcus Thorne",
      role: "Director of Engineering",
      imageId: "team-1"
    },
    url: "https://vyoma.example.com"
  },
  nexus: {
    title: "Nexus Core",
    industry: "Distributed Compute",
    founded: "2019",
    color: "#FFD100",
    icon: Cpu,
    imageId: "hero-abstract",
    mission: "Nexus Core provides the decentralized backbone for sovereign data management. Our infrastructure nodes are designed for extreme efficiency, providing high-performance compute resources to global enterprises without centralized vulnerability.",
    stats: [
      { label: "Uptime Reliability", value: "99.9999%" },
      { label: "Nodes Deployed", value: "1,200+" },
      { label: "Data Throughput", value: "400 PB/s" }
    ],
    leadership: {
      name: "Aris Chen",
      role: "Lead Architect",
      imageId: "team-1"
    },
    url: "https://nexus-core.example.com"
  },
  "m-studio": {
    title: "M-Studio",
    industry: "Creative Strategy",
    founded: "2018",
    color: "#27A9E1",
    icon: Globe,
    imageId: "mag-1",
    mission: "Redefining visual communication through the lens of neo-brutalism and quiet luxury. M-Studio serves as the design laboratory for the FourSix46 holding group, crafting narratives that resonate with global elites and industrial innovators alike.",
    stats: [
      { label: "Global Campaigns", value: "150+" },
      { label: "Design Awards", value: "24 Gold" },
      { label: "Retention Rate", value: "98%" }
    ],
    leadership: {
      name: "Sophia Lorenz",
      role: "Creative Principal",
      imageId: "team-1"
    },
    url: "https://m-studio.example.com"
  }
};

export default function VentureDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const venture = venturesDetailData[id];

  if (!venture) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <h1 className="text-4xl font-black uppercase mb-4">Venture Not Found</h1>
        <Link href="/ventures">
          <Button variant="outline" className="rounded-none font-code uppercase tracking-widest">
            Back to Ventures
          </Button>
        </Link>
      </main>
    );
  }

  const heroImage = PlaceHolderImages.find(img => img.id === venture.imageId);
  const leaderImage = PlaceHolderImages.find(img => img.id === venture.leadership.imageId);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Page Header / Hero */}
      <section className="relative h-[70vh] w-full overflow-hidden flex items-end">
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
              className="object-cover grayscale"
              priority
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-24 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <Link 
              href="/ventures" 
              className="flex items-center gap-2 text-sm font-code uppercase tracking-widest text-primary hover:text-white transition-colors mb-12 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to All Ventures
            </Link>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="space-y-4">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center border border-white/10 bg-surface/50 backdrop-blur-xl mb-4"
                  style={{ color: venture.color }}
                >
                  <venture.icon className="w-8 h-8" />
                </div>
                <h1 className="text-7xl md:text-9xl font-headline font-black uppercase tracking-tighter leading-none">
                  {venture.title}
                </h1>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
          
          {/* Left Column: At a Glance (Sticky) */}
          <aside className="lg:col-span-4 lg:sticky lg:top-32 h-fit space-y-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 border border-border bg-surface rounded-2xl space-y-8"
            >
              <h2 className="text-xs font-code uppercase tracking-widest text-muted">At a Glance</h2>
              
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-code uppercase text-muted block mb-1">Industry</span>
                  <span className="text-lg font-black uppercase">{venture.industry}</span>
                </div>
                <div>
                  <span className="text-[10px] font-code uppercase text-muted block mb-1">Founded</span>
                  <span className="text-lg font-black uppercase">{venture.founded}</span>
                </div>
                <div>
                  <span className="text-[10px] font-code uppercase text-muted block mb-1">Status</span>
                  <span className="text-lg font-black uppercase text-secondary">Active Scaling</span>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  asChild
                  className="w-full h-14 rounded-xl font-black uppercase tracking-widest group"
                  style={{ backgroundColor: venture.color, color: venture.color === '#FFD100' ? 'black' : 'white' }}
                >
                  <a href={venture.url} target="_blank" rel="noopener noreferrer">
                    Visit Website <ExternalLink className="ml-2 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </a>
                </Button>
              </div>
            </motion.div>
          </aside>

          {/* Right Column: Scrollable Details */}
          <div className="lg:col-span-8 space-y-32">
            
            {/* Mission Section */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-sm font-code uppercase tracking-[0.4em] text-primary border-l-4 border-primary pl-6">Mission & Narrative</h2>
              <p className="text-3xl md:text-4xl font-light leading-snug text-foreground/90">
                {venture.mission}
              </p>
            </motion.section>

            {/* Stats / Metrics */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-12"
            >
              <h2 className="text-sm font-code uppercase tracking-[0.4em] text-muted">Strategic Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {venture.stats.map((stat: any, idx: number) => (
                  <div key={idx} className="p-8 border border-border bg-surface/50 rounded-2xl group hover:border-primary transition-colors">
                    <span className="text-xs font-code text-muted uppercase tracking-widest block mb-4">{stat.label}</span>
                    <span className="text-4xl font-black uppercase text-foreground group-hover:text-primary transition-colors">{stat.value}</span>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Leadership */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-12"
            >
              <h2 className="text-sm font-code uppercase tracking-[0.4em] text-muted">Venture Leadership</h2>
              <div className="flex flex-col md:flex-row items-center gap-12 p-12 bg-surface border border-border rounded-2xl">
                <div className="relative w-48 h-48 flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-700">
                  {leaderImage && (
                    <Image 
                      src={leaderImage.imageUrl} 
                      alt={venture.leadership.name} 
                      fill 
                      className="object-cover rounded-xl"
                      data-ai-hint={leaderImage.imageHint}
                    />
                  )}
                </div>
                <div className="space-y-4 text-center md:text-left">
                  <h3 className="text-4xl font-black uppercase">{venture.leadership.name}</h3>
                  <p className="text-xl text-primary font-code uppercase tracking-widest">{venture.leadership.role}</p>
                  <p className="text-muted leading-relaxed max-w-lg">
                    A veteran in the {venture.industry.toLowerCase()} sector, bringing decades of technical expertise and strategic vision to the FourSix46 collective.
                  </p>
                </div>
              </div>
            </motion.section>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
