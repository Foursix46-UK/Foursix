"use client";

import React, { useEffect, useRef } from "react";
import createGlobe from "cobe";
import MagneticButton from "@/components/ui/MagneticButton";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface GlobalPresenceProps {
  hideCTA?: boolean;
  data?: {
    globalLabel?: string;
    globalTitle?: string;
    globalCtaText?: string;
  };
  // 👇 ADD THESE NEW PROPS
  initialMarkers?: { location: [number, number], size: number }[];
  initialStats?: {
    activeCountries: string;
    ventureNodes: string;
    systemArchitecture?: string;
    uptime: string;
  };
}

export default function GlobalPresence({ 
  hideCTA = false, 
  data, 
  initialMarkers = [], 
  initialStats = { activeCountries: "5", ventureNodes: "12+", systemArchitecture: "Distributed", uptime: "24/7" }
}: GlobalPresenceProps) {
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 👇 Removed all Firebase fetching and states entirely! We just use initialStats and initialMarkers.

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

    if (!canvasRef.current || initialMarkers.length === 0) return;

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
      markers: initialMarkers, // 👈 Uses instant prop
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
  }, [initialMarkers]);

  return (
    <section className="bg-black py-16 md:py-20 px-6 overflow-hidden">
      {/* ... Rest of your component styling remains exactly the same ... */}
      <div className="max-w-7xl mx-auto text-center mb-12 md:mb-16">
        <motion.span 
          initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-[10px] font-semibold uppercase tracking-widest text-primary mb-4 block"
        >
          {data?.globalLabel || "International"}
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-4xl md:text-6xl font-sans font-semibold uppercase tracking-tighter text-white"
        >
          {data?.globalTitle || "GLOBAL PRESENCE"}
        </motion.h2>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 items-center gap-12 lg:gap-8 mb-16">
        <div className="flex flex-row lg:flex-col items-center lg:items-start justify-around lg:justify-start text-center lg:text-left gap-8 md:gap-16">
          <div className="space-y-2">
            <h3 className="text-4xl md:text-7xl font-sans font-light text-white tracking-tighter">{initialStats.activeCountries}</h3>
            <p className="text-[8px] md:text-[10px] font-semibold uppercase tracking-widest text-white/50">Active Countries</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-4xl md:text-7xl font-sans font-light text-white tracking-tighter">{initialStats.ventureNodes}</h3>
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
  <h3 className="text-3xl md:text-5xl font-sans font-light text-white tracking-tighter leading-tight">
    {initialStats.systemArchitecture}
  </h3>
  <p className="text-[8px] md:text-[10px] font-semibold uppercase tracking-widest text-white/50">
    System Architecture
  </p>
</div>
          <div className="space-y-2">
            <h3 className="text-4xl md:text-7xl font-sans font-light text-white tracking-tighter">{initialStats.uptime}</h3>
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