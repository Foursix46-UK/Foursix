"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const logos = [
  "RASTLINA", "VYOMA", "FOURSIX", "M-STUDIO", "ELITE", "NEXUS", "KINETIC", "LUXE"
];

export default function Hero() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const textOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const textScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);
  const missionOpacity = useTransform(scrollYProgress, [0.4, 0.7], [0, 1]);
  const missionY = useTransform(scrollYProgress, [0.4, 0.7], [30, 0]);

  const bgImage = PlaceHolderImages.find(img => img.id === 'hero-abstract');

  return (
    <section ref={containerRef} className="relative h-[250vh] bg-background">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center items-center">
        {/* Abstract Background */}
        <div className="absolute inset-0 opacity-30 grayscale pointer-events-none">
          {bgImage && (
            <Image
              src={bgImage.imageUrl}
              alt={bgImage.description}
              fill
              className="object-cover"
              priority
              data-ai-hint={bgImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        </div>

        {/* Kinetic Typography */}
        <motion.div
          style={{ opacity: textOpacity, scale: textScale }}
          className="relative z-10 text-center px-6"
        >
          <h1 className="text-5xl md:text-7xl font-sans font-semibold uppercase leading-[1.1] tracking-tighter">
            Welcome to the<br />
            <span className="text-primary">House of</span><br />
            Multibrands.
          </h1>
        </motion.div>

        {/* Revealed Mission Statement */}
        <motion.div
          style={{ opacity: missionOpacity, y: missionY }}
          className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
        >
          <div className="max-w-3xl text-center px-12">
            <p className="text-2xl md:text-4xl font-sans font-light text-muted leading-tight tracking-tight">
              We cultivate a <span className="text-foreground font-medium italic">synergy of excellence</span>, 
              curating world-class ventures that redefine modern living and technology through 
              <span className="text-secondary font-medium"> quiet luxury</span> and 
              <span className="text-accent font-medium"> brutal efficiency</span>.
            </p>
          </div>
        </motion.div>

        {/* Infinite Marquee */}
        <div className="absolute bottom-12 left-0 w-full overflow-hidden whitespace-nowrap py-6 border-y border-white/5 bg-surface/20 backdrop-blur-sm">
          <div className="flex animate-marquee">
            {[...logos, ...logos, ...logos].map((logo, i) => (
              <span
                key={i}
                className="text-3xl md:text-5xl font-sans font-semibold px-12 text-muted/20 hover:text-primary transition-colors tracking-tighter"
              >
                {logo}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
