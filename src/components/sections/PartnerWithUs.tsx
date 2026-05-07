"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, Shield, Zap, FileText, ArrowRight } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import Link from "next/link";
import { getFirebaseImageUrl } from "@/lib/utils";

const defaultPillars = [
  { title: "Strategic Alliances", desc: "Forging cross-industry ventures and deep ecosystem integration for mutual scaling.", icon: Users, color: "#27A9E1" },
  { title: "Institutional Capital", desc: "Facilitating global investment and strategic allocation into frontier markets.", icon: Shield, color: "#E31837" },
  { title: "Technology Nodes", desc: "Co-developing biophilic and sovereign infrastructure through shared R&D.", icon: Zap, color: "#FFD100" },
];

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } } };

export default function PartnerWithUs({ initialData }: { initialData?: any }) {
  const data = initialData || {};

  // 👇 FIX: Dynamically map ANY number of pillars from FireCMS. 
  // It uses a modulo operator (%) to loop through your predefined colors/icons safely!
  const displayPillars = data.pillars && Array.isArray(data.pillars) && data.pillars.length > 0 
    ? data.pillars.map((pillar: any, index: number) => ({
        title: pillar.title || "Strategic Pillar",
        desc: pillar.desc || "",
        icon: defaultPillars[index % defaultPillars.length].icon,
        color: defaultPillars[index % defaultPillars.length].color
      }))
    : defaultPillars;

  // Resolve the PDF URL safely
  const pdfUrl = data.brandDeckPdf ? getFirebaseImageUrl(data.brandDeckPdf) : "#";

  return (
    <section id="partner" className="py-32 px-6 bg-black text-white selection:bg-primary scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        
        {/* 1. Immersive Hero */}
        <header className="text-center mb-24">
          <motion.span
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary mb-6 block"
          >
            {data.heroLabel || "Synergy"}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-sans font-bold uppercase tracking-tighter leading-none"
          >
            {data.heroTitle || "CO-CREATE THE FUTURE"}
          </motion.h2>
        </header>

        {/* 2. The "Why" Block */}
        <div className="max-w-4xl mx-auto text-center mb-32">
          <motion.p
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-2xl md:text-3xl font-light text-white/80 leading-relaxed tracking-tight font-sans whitespace-pre-wrap"
          >
            {data.mainDescription || "FourSix46 serves as a parent brand that identifies, scales, and unifies high-impact ventures. We provide the structural integrity and strategic leadership required to dominate the frontiers of logistics, data, and tech."}
          </motion.p>
        </div>

        {/* 3. Partnership Pillars (Grid) */}
        <motion.div
          variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32"
        >
          {displayPillars.map((pillar: any, idx: number) => (
            <motion.div key={idx} variants={itemVariants} className="group relative p-10 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md hover:border-white/20 transition-all duration-500">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-8 border border-white/10 bg-black/40" style={{ color: pillar.color }}>
                <pillar.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold uppercase tracking-tight text-white mb-4">{pillar.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed font-light font-sans whitespace-pre-wrap">{pillar.desc}</p>
              <div className="absolute bottom-0 left-0 h-1 transition-all duration-500" style={{ backgroundColor: pillar.color, width: '0%' }} />
            </motion.div>
          ))}
        </motion.div>

        {/* 4. High-Level CTA & Direct Action */}
        <div className="flex flex-col items-center text-center space-y-12">
          <div className="space-y-4">
            <h4 className="text-2xl md:text-4xl font-sans font-bold uppercase tracking-tighter">
              {data.ctaTitle || "Ready to scale?"}
            </h4>
            <p className="text-white/40 font-light text-lg">
              {data.ctaSubtitle || "Interested in partnering or investing with FourSix46? Let’s initiate the dialogue."}
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8">
            <MagneticButton href="/contact" variant="blue" className="h-16 px-12">
              <span className="flex items-center justify-center gap-2">
                {data.ctaButtonText || "START PARTNERSHIP ENQUIRY"} <ArrowRight className="w-4 h-4" />
              </span>
            </MagneticButton>

            {/* Dynamic PDF Download Link */}
            {data.brandDeckPdf && (
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 font-sans text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors"
              >
                <FileText className="w-4 h-4" /> Download Brand Deck (PDF)
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}