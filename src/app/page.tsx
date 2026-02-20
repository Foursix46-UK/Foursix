"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import Preloader from "@/components/layout/Preloader";
import Navbar from "@/components/navigation/Navbar";
import Hero from "@/components/sections/Hero";
import Ventures from "@/components/sections/Ventures";
import Vision from "@/components/sections/Vision";
import Newsroom from "@/components/sections/Newsroom";
import Magazines from "@/components/sections/Magazines";
import GlobalPresence from "@/components/sections/GlobalPresence";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/layout/Footer";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.4], [1, 0.95]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0.5]);
  const heroBorderRadius = useTransform(scrollYProgress, [0, 0.4], ["0px", "32px"]);

  useEffect(() => {
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

      <div className="relative z-10 -mt-[100vh]">
        <Ventures />
        
        <div className="bg-black w-full">
          <section className="relative bg-black overflow-hidden">
            <Vision />
          </section>

          {/* Newsroom Horizontal Scroll Section */}
          <Newsroom />

          <section className="relative bg-black">
            <Magazines />
          </section>

          {/* Global Interactive Presence */}
          <GlobalPresence />

          {/* Contact Section with Staggered Reveal */}
          <Contact />
        </div>
        <Footer />
      </div>
    </main>
  );
}
