"use client";

import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import Contact from "@/components/sections/Contact";
import { motion } from "framer-motion";

/**
 * @fileOverview Partnership Page reusing the strategic 2-step inquiry component.
 */

export default function PartnershipPage() {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      
      {/* pt-32 wrapper to avoid Navbar overlap */}
      <div className="pt-32">
        <header className="text-center mb-16 px-6">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary mb-6 block"
          >
            Strategic Synergy
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-sans font-bold uppercase tracking-tighter leading-none text-white"
          >
            PARTNER WITH US
          </motion.h1>
        </header>

        <Contact />
      </div>

      <Footer />
    </main>
  );
}