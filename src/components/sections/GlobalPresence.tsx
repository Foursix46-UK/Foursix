
"use client";

import React, { useEffect, useRef } from "react";
import createGlobe from "cobe";

export default function GlobalPresence() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;

    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 800,
      height: 800,
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
  }, []);

  return (
    <section className="bg-black py-32 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto text-center mb-24">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-primary mb-4 block">
          Global Reach
        </span>
        <h2 className="text-5xl md:text-6xl font-sans font-semibold uppercase tracking-tighter text-white">
          STRATEGIC NODES
        </h2>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 items-center gap-12 lg:gap-8">
        {/* Left Column (Stats) */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-16">
          <div className="space-y-2">
            <h3 className="text-6xl md:text-7xl font-sans font-light text-white tracking-tighter">
              5
            </h3>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/50">
              Active Countries
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-6xl md:text-7xl font-sans font-light text-white tracking-tighter">
              12+
            </h3>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/50">
              Venture Nodes
            </p>
          </div>
        </div>

        {/* Center Column (The Globe) */}
        <div className="flex justify-center items-center w-full aspect-square max-w-[500px] mx-auto cursor-grab active:cursor-grabbing">
          <canvas
            ref={canvasRef}
            style={{
              width: "100%",
              height: "100%",
              contain: "layout paint size",
            }}
          />
        </div>

        {/* Right Column (Stats) */}
        <div className="flex flex-col items-center lg:items-end text-center lg:text-right space-y-16">
          <div className="space-y-2">
            <h3 className="text-6xl md:text-7xl font-sans font-light text-white tracking-tighter">
              $10B+
            </h3>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/50">
              Projected Revenue
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-6xl md:text-7xl font-sans font-light text-white tracking-tighter">
              24/7
            </h3>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/50">
              Operational uptime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
