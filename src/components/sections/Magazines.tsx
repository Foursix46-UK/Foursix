"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const magazineEditions = [
  { title: "Volume 01: The Grid", category: "Design", imgId: "mag-1" },
  { title: "Volume 02: Bio-Syn", category: "Technology", imgId: "mag-2" },
];

export default function Magazines() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 150]);

  return (
    <section id="magazines" ref={ref} className="py-32 px-6 overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <div className="text-center mb-24">
          <h2 className="text-sm font-code uppercase tracking-[0.4em] text-accent mb-6">Editorial</h2>
          <h3 className="text-5xl md:text-7xl font-sans font-semibold uppercase tracking-tighter">
            THE JOURNAL
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-start w-full">
          {magazineEditions.map((mag, idx) => {
            const magImg = PlaceHolderImages.find(img => img.id === mag.imgId);
            return (
              <motion.div
                key={mag.title}
                style={{ y: idx === 0 ? y1 : y2 }}
                className="relative group cursor-pointer"
              >
                <div className="aspect-[3/4] relative overflow-hidden rounded-sm border border-border">
                  {magImg && (
                    <Image
                      src={magImg.imageUrl}
                      alt={mag.title}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                      data-ai-hint={magImg.imageHint}
                    />
                  )}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                  
                  <div className="absolute top-6 left-6">
                    <span className="px-3 py-1.5 bg-primary text-white text-[10px] font-semibold uppercase tracking-widest">
                      {mag.category}
                    </span>
                  </div>
                </div>
                
                <div className="mt-8 space-y-2">
                  <h4 className="text-3xl font-sans font-semibold uppercase group-hover:text-primary transition-colors tracking-tighter">
                    {mag.title}
                  </h4>
                  <p className="text-muted font-code text-xs tracking-wide">Quarterly Issue · Available in Print & Digital</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
