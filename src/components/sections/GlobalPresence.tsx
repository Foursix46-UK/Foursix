"use client";

import React, { useEffect, useRef, useState } from "react";
import createGlobe from "cobe";
import MagneticButton from "@/components/ui/MagneticButton";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

// --- FIREBASE IMPORTS ---
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

// --- CMS Data Interface ---
interface GlobalPresenceProps {
  hideCTA?: boolean;
  data?: {
    globalLabel?: string;
    globalTitle?: string;
    globalCtaText?: string;
  };
}

export default function GlobalPresence({ hideCTA = false, data }: GlobalPresenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [markers, setMarkers] = useState<{location: [number, number], size: number}[]>([]);
  
  // --- DYNAMIC STATS STATE ---
  const [globalStats, setGlobalStats] = useState({
    activeCountries: "5",
    ventureNodes: "12+",
    projectedRevenue: "$10B+",
    uptime: "24/7"
  });

  // FETCH COORDINATES AND STATS
  useEffect(() => {
    async function fetchGlobalData() {
      try {
        // Fetch Map Markers
        const q = query(collection(db, "global"), where("visibilityToggle", "==", true));
        const snapshot = await getDocs(q);
        const fetchedMarkers = snapshot.docs.map(doc => {
          const data = doc.data();
          return { 
            location: [data.mapCoordinates?.lat || 0, data.mapCoordinates?.lng || 0] as [number, number], 
            size: 0.1 
          };
        });
        setMarkers(fetchedMarkers);

        // Fetch Global Stats
        const statsSnapshot = await getDocs(collection(db, "globalSettings"));
        if (!statsSnapshot.empty) {
          const data = statsSnapshot.docs[0].data();
          setGlobalStats({
            activeCountries: data.activeCountries || "5",
            ventureNodes: data.ventureNodes || "12+",
            projectedRevenue: data.projectedRevenue || "$10B+",
            uptime: data.operationalUptime || "24/7"
          });
        }
      } catch (error) {
        console.error("Error fetching global data:", error);
      }
    }
    fetchGlobalData();
  }, []);

  useEffect(() => {
    let phi = 0;
    let width = 0;

    const onResize = () => {
      if (containerRef.current) {
        width = containerRef.current.offsetWidth;
      }
    };
    window.addEventListener("resize", onResize);
    onResize(); 

    if (!canvasRef.current || markers.length === 0) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.1, 0.1, 0.1],
      markerColor: [1, 1, 1],
      glowColor: [0.1, 0.1, 0.1],
      markers: markers, 
      onRender: (state) => {
        state.phi = phi;
        phi += 0.005;
        state.width = width * 2;
        state.height = width * 2;
      },
    });

    setTimeout(() => {
      if (canvasRef.current) canvasRef.current.style.opacity = '1';
    });

    return () => {
      window.removeEventListener("resize", onResize);
      globe.destroy();
    };
  }, [markers]);

  return (
    <section className="bg-black py-16 md:py-20 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto text-center mb-12 md:mb-16">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[10px] font-semibold uppercase tracking-widest text-primary mb-4 block"
        >
          {data?.globalLabel || "International"}
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-sans font-semibold uppercase tracking-tighter text-white"
        >
          {data?.globalTitle || "GLOBAL PRESENCE"}
        </motion.h2>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 items-center gap-12 lg:gap-8 mb-16">
        <div className="flex flex-row lg:flex-col items-center lg:items-start justify-around lg:justify-start text-center lg:text-left gap-8 md:gap-16">
          <div className="space-y-2">
            <h3 className="text-4xl md:text-7xl font-sans font-light text-white tracking-tighter">{globalStats.activeCountries}</h3>
            <p className="text-[8px] md:text-[10px] font-semibold uppercase tracking-widest text-white/50">Active Countries</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-4xl md:text-7xl font-sans font-light text-white tracking-tighter">{globalStats.ventureNodes}</h3>
            <p className="text-[8px] md:text-[10px] font-semibold uppercase tracking-widest text-white/50">Venture Nodes</p>
          </div>
        </div>

        <div 
          ref={containerRef}
          className="relative flex justify-center items-center w-full aspect-square max-w-[320px] sm:max-w-[400px] md:max-w-[500px] mx-auto cursor-grab active:cursor-grabbing"
        >
          <canvas
            ref={canvasRef}
            style={{ width: "100%", height: "100%", contain: "layout paint size", opacity: 0, transition: 'opacity 1s ease' }}
          />
        </div>

        <div className="flex flex-row lg:flex-col items-center lg:items-end justify-around lg:justify-end text-center lg:text-right gap-8 md:gap-16">
          <div className="space-y-2">
            <h3 className="text-4xl md:text-7xl font-sans font-light text-white tracking-tighter">{globalStats.projectedRevenue}</h3>
            <p className="text-[8px] md:text-[10px] font-semibold uppercase tracking-widest text-white/50">Projected Revenue</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-4xl md:text-7xl font-sans font-light text-white tracking-tighter">{globalStats.uptime}</h3>
            <p className="text-[8px] md:text-[10px] font-semibold uppercase tracking-widest text-white/50">Operational uptime</p>
          </div>
        </div>
      </div>

      {!hideCTA && (
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-20 flex justify-center w-full">
          <MagneticButton href="/global" variant="blue">
            {data?.globalCtaText || "Explore Our Global Footprint"} <ArrowRight className="w-4 h-4 ml-2" />
          </MagneticButton>
        </motion.div>
      )}
    </section>
  );
}