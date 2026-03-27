"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/navigation/Navbar";
import VenturesOverview from "@/components/sections/VenturesOverview";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

// --- FIREBASE IMPORTS ---
import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function VenturesPage() {
  const [pageData, setPageData] = useState<any>(null);

  useEffect(() => {
    async function fetchPageData() {
      try {
        const q = query(collection(db, "page_ventures"), limit(1));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) setPageData(snapshot.docs[0].data());
      } catch (error) {
        console.error("Error fetching ventures page data:", error);
      }
    }
    fetchPageData();
  }, []);

  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-24">
        <header className="px-6 py-20 max-w-7xl mx-auto border-b border-white/5">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-sans text-[10px] font-semibold uppercase tracking-[0.5em] text-primary mb-6 block"
          >
            {pageData?.heroLabel || "The Collective"}
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-sans font-semibold uppercase tracking-tight leading-none mb-8"
          >
            {pageData?.heroTitleMain || "OUR"}<br />
            <span className="text-white/40">{pageData?.heroTitleHighlight || "VENTURES"}</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white/50 max-w-2xl font-light leading-relaxed tracking-tight whitespace-pre-wrap"
          >
            {pageData?.heroSubtitle || "FourSix46 actively manages a diverse portfolio of disruptive brands. Our approach combines capital allocation with deep operational expertise in design, engineering, and brand narrative."}
          </motion.p>
        </header>
        
        <VenturesOverview />
        
        <div className="max-w-7xl mx-auto px-6 py-32 border-t border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-start">
            <div>
              <h2 className="text-4xl font-sans font-semibold uppercase mb-8 tracking-tight">
                {pageData?.footerTitle || "Strategic Investment"}
              </h2>
              <p className="text-lg text-white/40 leading-relaxed font-light whitespace-pre-wrap">
                {pageData?.footerText || "We identify and accelerate ventures that operate at the frontier of high-density urbanism, orbital mobility, and sovereign infrastructure. Each portfolio entity is a node in our global strategic network."}
              </p>
            </div>
            <div className="p-12 bg-surface border border-white/5 rounded-2xl">
              <h3 className="text-xl font-bold uppercase mb-4 text-primary">
                {pageData?.ctaTitle || "Inquiry"}
              </h3>
              <p className="text-sm text-white/60 mb-8 font-light whitespace-pre-wrap">
                {pageData?.ctaText || "Interested in partnership or strategic allocation opportunities within our collective?"}
              </p>
              <Link href="/contact" className="inline-flex items-center gap-2 font-sans text-[10px] font-bold uppercase tracking-widest text-white hover:text-primary transition-colors">
                {pageData?.ctaButton || "Connect with our team"} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}