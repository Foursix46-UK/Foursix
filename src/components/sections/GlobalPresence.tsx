
"use client";

import React, { useEffect, useRef, useState } from "react";
import createGlobe from "cobe";
import MagneticButton from "@/components/ui/MagneticButton";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function GlobalPresence() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateSize = () => {
      if (containerRef.current) {
        // Measure the container width to scale the globe resolution
        setSize(containerRef.current.offsetWidth);
      }
    };

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(containerRef.current);
    updateSize();

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    let phi = 0;

    if (!canvasRef.current || size === 0) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: size * 2,
      height: size * 2,
      phi: 0,
      theta: 0.3,
      dark: 1, // Pure dark mode
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.1, 0.1, 0.1], // Dark gray/black globe
      markerColor: [1, 1, 1], // Pure white markers
      glowColor: [0.1, 0.1, 0.1],
      markers: [
        { location: [1.3521, 103.8198], size: 0.1 }, // Singapore
        { location: [40.7128, -74.006], size: 0.1 }, // New York
        { location: [51.5072, -0.1276], size: 0.1 }, // London
        { location: [25.2048, 55.2708], size: 0.1 }, // Dubai
        { location: [35.6762, 139.6503], size: 0.1 }, // Tokyo
      ],
      onRender: (state) => {
        state.phi = phi;
        phi += 0.005; // Slow rotation speed
      },
    });

    return () => globe.destroy();
  }, [size]);

  return (
    <section className="bg-black py-16 md:py-20 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto text-center mb-12 md:mb-16">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[10px] font-semibold uppercase tracking-widest text-primary mb-4 block"
        >
          International
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-sans font-semibold uppercase tracking-tighter text-white"
        >
          GLOBAL PRESENCE
        </motion.h2>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 items-center gap-12 lg:gap-8 mb-16">
        {/* Left Column (Stats) - Flex row on mobile, col on desktop */}
        <div className="flex flex-row lg:flex-col items-center lg:items-start justify-around lg:justify-start text-center lg:text-left gap-8 md:gap-16">
          <div className="space-y-2">
            <h3 className="text-4xl md:text-7xl font-sans font-light text-white tracking-tighter">
              5
            </h3>
            <p className="text-[8px] md:text-[10px] font-semibold uppercase tracking-widest text-white/50">
              Active Countries
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-4xl md:text-7xl font-sans font-light text-white tracking-tighter">
              12+
            </h3>
            <p className="text-[8px] md:text-[10px] font-semibold uppercase tracking-widest text-white/50">
              Venture Nodes
            </p>
          </div>
        </div>

        {/* Center Column (The Globe) */}
        <div 
          ref={containerRef}
          className="relative flex justify-center items-center w-full aspect-square max-w-[320px] sm:max-w-[400px] md:max-w-[500px] mx-auto cursor-grab active:cursor-grabbing"
        >
          <canvas
            ref={canvasRef}
            style={{
              width: "100%",
              height: "100%",
              contain: "layout paint size",
              opacity: size > 0 ? 1 : 0,
              transition: 'opacity 0.5s ease'
            }}
          />
        </div>

        {/* Right Column (Stats) - Flex row on mobile, col on desktop */}
        <div className="flex flex-row lg:flex-col items-center lg:items-end justify-around lg:justify-end text-center lg:text-right gap-8 md:gap-16">
          <div className="space-y-2">
            <h3 className="text-4xl md:text-7xl font-sans font-light text-white tracking-tighter">
              $10B+
            </h3>
            <p className="text-[8px] md:text-[10px] font-semibold uppercase tracking-widest text-white/50">
              Projected Revenue
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-4xl md:text-7xl font-sans font-light text-white tracking-tighter">
              24/7
            </h3>
            <p className="text-[8px] md:text-[10px] font-semibold uppercase tracking-widest text-white/50">
              Operational uptime
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <MagneticButton href="/global" variant="blue">
          Explore Our Global Footprint <ArrowRight className="w-4 h-4 ml-2" />
        </MagneticButton>
      </div>
    </section>
  );
}
