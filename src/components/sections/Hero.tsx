
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
  const textScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.9]);
  const missionOpacity = useTransform(scrollYProgress, [0.4, 0.7], [0, 1]);
  const missionY = useTransform(scrollYProgress, [0.4, 0.7], [50, 0]);

  const bgImage = PlaceHolderImages.find(img => img.id === 'hero-abstract');

  return (
    <section ref={containerRef} className="relative h-[250vh] bg-background">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center items-center">
        {/* Abstract Background */}
        <div className="absolute inset-0 opacity-40 grayscale pointer-events-none">
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
          <h1 className="text-7xl md:text-9xl font-headline font-black uppercase leading-none tracking-tighter">
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
          <div className="max-w-4xl text-center px-12">
            <p className="text-3xl md:text-5xl font-headline font-light text-muted leading-tight">
              We cultivate a <span className="text-foreground font-bold italic">synergy of excellence</span>, 
              curating world-class ventures that redefine modern living and technology through 
              <span className="text-secondary font-bold"> quiet luxury</span> and 
              <span className="text-accent font-bold"> brutal efficiency</span>.
            </p>
          </div>
        </motion.div>

        {/* Infinite Marquee */}
        <div className="absolute bottom-12 left-0 w-full overflow-hidden whitespace-nowrap py-8 border-y border-white/5 bg-surface/30 backdrop-blur-sm">
          <div className="flex animate-marquee">
            {[...logos, ...logos, ...logos].map((logo, i) => (
              <span
                key={i}
                className="text-4xl md:text-6xl font-headline font-black px-12 text-muted/30 hover:text-primary transition-colors"
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
