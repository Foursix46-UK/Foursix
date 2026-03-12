"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import MagneticButton from "@/components/ui/MagneticButton";
import { magazineData } from "@/lib/magazine-data";

export default function Magazines() {
  const ref = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);

  // Filter for home page featured issues
  const featuredIssues = magazineData.filter(m => m.featuredStoryToggle);

  return (
    <section id="magazines" ref={ref} className="py-20 px-6 overflow-hidden bg-black">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <div className="text-center mb-12">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-sans text-[10px] font-semibold uppercase tracking-widest text-primary mb-4 block"
          >
            Publications
          </motion.span>
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-sans font-semibold uppercase tracking-tighter text-white"
          >
            MAGAZINES
          </motion.h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-8 sm:gap-y-8 items-start w-full">
          {featuredIssues.map((mag, idx) => {
            const magImg = PlaceHolderImages.find(img => img.id === mag.coverImage);
            return (
              <motion.div
                key={mag.slug}
                style={{ y: isMobile ? 0 : (idx % 2 === 0 ? y1 : y2) }}
                className="relative group"
              >
                <Link href={`/magazines/${mag.slug}`} className="block h-full cursor-pointer">
                  <div className="aspect-[3/4] relative overflow-hidden rounded-xl border border-white/10">
                    {magImg && (
                      <Image
                        src={magImg.imageUrl}
                        alt={mag.articleTitle}
                        fill
                        className="object-cover transition-all duration-1000 group-hover:scale-105"
                        data-ai-hint={magImg.imageHint}
                      />
                    )}
                    
                    <div className="absolute top-6 left-6 flex flex-col gap-1">
                      <span className="px-3 py-1.5 bg-primary text-white font-sans text-[8px] font-semibold uppercase tracking-widest rounded-sm w-fit">
                        {mag.themeTag}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-8 space-y-2">
                    <h4 className="text-xl font-sans font-semibold uppercase group-hover:text-primary transition-colors tracking-tighter text-white">
                      {mag.articleTitle}
                    </h4>
                    <div className="flex flex-col gap-1">
                      <p className="text-white/50 font-sans text-[10px] font-semibold uppercase tracking-widest">
                        {mag.articleType} · {mag.readingTime} · {mag.publishDate}
                      </p>
                      <p className="text-white/20 font-sans text-[8px] font-bold uppercase tracking-[0.2em]">
                        BY {mag.authorContributor}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center gap-2 font-sans text-[10px] font-semibold uppercase tracking-widest text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Read Magazine <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-20 flex justify-center">
          <MagneticButton href="/magazines" className="border-white/20 text-white hover:border-white">
            Explore Publications <ArrowRight className="w-4 h-4" />
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}