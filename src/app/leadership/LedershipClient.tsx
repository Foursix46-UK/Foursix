"use client";

import React from "react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { LeadershipCard } from "@/components/sections/LeadershipUI";
import Link from "next/link";

export default function LeadershipClient({ initialPageData, initialLeaders }: { initialPageData: any, initialLeaders: any[] }) {
  const pageData = initialPageData;
  const dynamicLeaders = initialLeaders;

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white selection:bg-primary font-sans overflow-x-hidden">
      <Navbar />

      <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <header className="mb-24">
          <motion.span
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary mb-6 block"
          >
            {pageData?.heroLabel || "Visionary Core"}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-sans font-medium tracking-tighter text-white uppercase leading-none mb-8 whitespace-pre-wrap"
          >
            {pageData?.heroTitle || "Leadership\n& Visionaries"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-lg text-white/40 max-w-2xl font-light leading-relaxed tracking-tight whitespace-pre-wrap"
          >
            {pageData?.heroSubtitle || "Meet the strategic architects driving the FourSix46 collective. A multi-disciplinary team committed to structural integrity, aesthetic purity, and global impact."}
          </motion.p>
        </header>

        {/* Removed Loading Spinner - Renders Instantly */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {dynamicLeaders.map((leader) => (
            <LeadershipCard key={leader.id} leader={leader} />
          ))}
        </div>

        <section className="mt-48 py-24 border-t border-white/5 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-4xl mx-auto space-y-12">
            <h2 className="text-3xl md:text-5xl font-sans font-medium uppercase tracking-tighter text-white">
              {pageData?.footerTitle || "Institutional Relations"}
            </h2>
            <p className="text-xl text-white/40 font-light leading-relaxed whitespace-pre-wrap">
              {pageData?.footerText || "Our leadership team actively engages with institutional partners and strategic investors to identify new frontier opportunities. Initiate a dialogue with our executive office."}
            </p>
            <div className="pt-6">
              <Button asChild className="h-14 sm:h-16 px-6 sm:px-12 rounded-full font-sans text-[8px] sm:text-[9px] md:text-xs font-bold uppercase tracking-[0.2em] bg-primary hover:bg-primary/90 text-white whitespace-nowrap">
                <Link href="/contact">
                  {pageData?.ctaButton || "Connect with Leadership"} <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </section>
      </div>

      <Footer />
    </main>
  );
}