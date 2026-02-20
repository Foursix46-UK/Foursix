"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const magazineEditions = [
  { title: "Volume 01: The Grid", category: "Design", imgId: "mag-1" },
  { title: "Volume 02: Bio-Syn", category: "Technology", imgId: "mag-2" },
  { title: "Volume 03: Sovereign", category: "Infrastructure", imgId: "venture-1" },
  { title: "Volume 04: Velocity", category: "Mobility", imgId: "venture-2" },
];

export default function Magazines() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Alternating parallax offsets
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 150]);

  return (
    <section id="magazines" ref={ref} className="py-32 px-6 overflow-hidden bg-black">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <div className="text-center mb-24">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-sans text-[10px] font-semibold uppercase tracking-widest text-primary mb-4 block"
          >
            Editorial
          </motion.span>
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-sans font-semibold uppercase tracking-tighter text-white"
          >
            THE JOURNAL
          </motion.h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-start w-full">
          {magazineEditions.map((mag, idx) => {
            const magImg = PlaceHolderImages.find(img => img.id === mag.imgId);
            return (
              <motion.div
                key={mag.title}
                style={{ y: idx % 2 === 0 ? y1 : y2 }}
                className="relative group cursor-pointer"
              >
                <div className="aspect-[3/4] relative overflow-hidden rounded-sm border border-white/10">
                  {magImg && (
                    <Image
                      src={magImg.imageUrl}
                      alt={mag.title}
                      fill
                      className="object-cover grayscale hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                      data-ai-hint={magImg.imageHint}
                    />
                  )}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors duration-500" />
                  
                  <div className="absolute top-6 left-6">
                    <span className="px-3 py-1.5 bg-primary text-white font-sans text-[8px] font-semibold uppercase tracking-widest">
                      {mag.category}
                    </span>
                  </div>
                </div>
                
                <div className="mt-8 space-y-2">
                  <h4 className="text-2xl md:text-3xl font-sans font-semibold uppercase group-hover:text-primary transition-colors tracking-tighter text-white">
                    {mag.title}
                  </h4>
                  <p className="text-white/50 font-sans text-[10px] font-semibold uppercase tracking-widest">
                    Quarterly Issue · Available in Print & Digital
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Centered CTA */}
        <div className="mt-32 text-center">
          <Link 
            href="/magazines" 
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-widest text-primary hover:text-white transition-colors group"
          >
            Browse All Issues 
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
