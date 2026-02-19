"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Preloader from "@/components/layout/Preloader";
import Navbar from "@/components/navigation/Navbar";
import Hero from "@/components/sections/Hero";
import Ventures from "@/components/sections/Ventures";
import Vision from "@/components/sections/Vision";
import Magazines from "@/components/sections/Magazines";
import GlobalPresence from "@/components/sections/GlobalPresence";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Lock scroll
    document.body.style.overflow = "hidden";
    
    // Total cycle: Initial wait (1s) + 5 words transition (5 * 180ms = 0.9s) + Buffer/Snellenberg pause
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Wait for exit animation to finish before unlocking scroll
      setTimeout(() => {
        document.body.style.overflow = "auto";
      }, 1000);
    }, 2600);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <main className="min-h-screen">
      <AnimatePresence mode="wait">
        {isLoading && <Preloader />}
      </AnimatePresence>
      
      <Navbar />
      <Hero />
      
      <section className="relative">
        <Ventures />
        <div className="max-w-7xl mx-auto px-6 pb-24 flex justify-end">
          <Link href="/ventures" className="group flex items-center gap-2 text-sm font-code uppercase tracking-widest text-primary hover:text-white transition-colors">
            Explore All Ventures <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <section className="relative bg-background">
        <Vision />
        <div className="max-w-7xl mx-auto px-6 pb-24 flex justify-start lg:justify-end">
          <Link href="/vision" className="group flex items-center gap-2 text-sm font-code uppercase tracking-widest text-primary hover:text-white transition-colors">
            Our Full Story <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <section className="relative">
        <Magazines />
        <div className="max-w-7xl mx-auto px-6 pb-24 flex justify-center">
          <Link href="/magazines" className="group flex items-center gap-2 text-sm font-code uppercase tracking-widest text-primary hover:text-white transition-colors">
            Browse All Issues <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <section className="relative">
        <GlobalPresence />
        <div className="max-w-7xl mx-auto px-6 pb-24 flex justify-start">
          <Link href="/vision#global" className="group flex items-center gap-2 text-sm font-code uppercase tracking-widest text-primary hover:text-white transition-colors">
            Explore Global Hubs <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <Contact />
      <Footer />
    </main>
  );
}
