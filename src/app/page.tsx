
"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
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
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Apple-style Card Stack Transforms
  const heroScale = useTransform(scrollYProgress, [0, 0.4], [1, 0.95]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0.5]);
  const heroBorderRadius = useTransform(scrollYProgress, [0, 0.4], ["0px", "32px"]);

  useEffect(() => {
    // Lock scroll during preloader
    document.body.style.overflow = "hidden";
    
    const timer = setTimeout(() => {
      setIsLoading(false);
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
    <main className="min-h-screen bg-black" ref={containerRef}>
      <AnimatePresence mode="wait">
        {isLoading && <Preloader />}
      </AnimatePresence>
      
      <Navbar />

      {/* Sticky Hero Container (The Back Card) */}
      <div className="relative h-[200vh]">
        <motion.div 
          style={{ 
            scale: heroScale, 
            opacity: heroOpacity,
            borderRadius: heroBorderRadius,
            willChange: "transform, opacity, border-radius"
          }} 
          className="sticky top-0 h-screen w-full overflow-hidden origin-top z-0"
        >
          <Hero />
        </motion.div>
      </div>

      {/* Sliding Content Container (The Front Card) */}
      <div className="relative z-10 -mt-[100vh]">
        <Ventures />
        
        <div className="bg-[#0A0A0A] w-full">
          <div className="max-w-7xl mx-auto px-6 pb-24 flex justify-end">
            <Link href="/ventures" className="group flex items-center gap-2 text-sm font-code uppercase tracking-widest text-primary hover:text-white transition-colors">
              Explore All Ventures <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <section className="relative bg-[#0A0A0A]">
            <Vision />
            <div className="max-w-7xl mx-auto px-6 pb-24 flex justify-start lg:justify-end">
              <Link href="/vision" className="group flex items-center gap-2 text-sm font-code uppercase tracking-widest text-primary hover:text-white transition-colors">
                Our Full Story <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </section>

          <section className="relative bg-[#0A0A0A]">
            <Magazines />
            <div className="max-w-7xl mx-auto px-6 pb-24 flex justify-center">
              <Link href="/magazines" className="group flex items-center gap-2 text-sm font-code uppercase tracking-widest text-primary hover:text-white transition-colors">
                Browse All Issues <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </section>

          <section className="relative bg-[#0A0A0A]">
            <GlobalPresence />
            <div className="max-w-7xl mx-auto px-6 pb-24 flex justify-start">
              <Link href="/vision#global" className="group flex items-center gap-2 text-sm font-code uppercase tracking-widest text-primary hover:text-white transition-colors">
                Explore Global Hubs <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </section>

          <Contact />
        </div>
        <Footer />
      </div>
    </main>
  );
}
