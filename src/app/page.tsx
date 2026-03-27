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
import FaqSection from "@/components/sections/FaqSection";
import Footer from "@/components/layout/Footer";

// --- FIREBASE IMPORTS ---
import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [homeData, setHomeData] = useState<any>(null); 
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
    
    // --- SMART FETCH: Grabs the first document regardless of its ID ---
    async function fetchHomeData() {
      try {
        const q = query(collection(db, "page_home"), limit(1));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setHomeData(querySnapshot.docs[0].data());
        }
      } catch (error) {
        console.error("Error fetching home data:", error);
      }
    }

    fetchHomeData();

    const timer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => {
        document.body.style.overflow = "auto";
      }, 1000);
    }, 3750);

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
          <Hero data={homeData} />
        </motion.div>
      </div>

      <div className="relative z-10 -mt-[100vh]">
        <Ventures data={homeData} />
        
        <div className="bg-black w-full">
          <section className="relative bg-black overflow-hidden">
            <Vision data={homeData} />
          </section>

          <Newsroom data={homeData} />

          <section className="relative bg-black">
            <Magazines data={homeData} />
          </section>

          <GlobalPresence data={homeData} />
          <Contact />
          
          {/* This caused the error because the component wasn't built yet! */}
          <FaqSection data={homeData} />
        </div>
        <Footer />
      </div>
    </main>
  );
}