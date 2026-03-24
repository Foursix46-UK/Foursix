"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import { getFirebaseImageUrl } from "@/lib/utils";

// --- FIREBASE IMPORTS ---
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Magazines() {
  const ref = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  
  const [dynamicMagazines, setDynamicMagazines] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // --- FETCH FEATURED MAGAZINES ---
  useEffect(() => {
    async function fetchMagazines() {
      try {
        const q = query(
          collection(db, "magazines"), 
          where("visibilityToggle", "==", true),
          where("featuredStoryToggle", "==", true),
          orderBy("displayOrder", "asc")
        );
        const snapshot = await getDocs(q);
        const fetchedData = snapshot.docs.map(doc => {
          const data = doc.data();
          const dateObj = data.publishDate?.toDate() || new Date();
          const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase();
          return { id: doc.id, ...data, displayDate: formattedDate };
        });
        setDynamicMagazines(fetchedData);
      } catch (error) {
        console.error("Error fetching magazines:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMagazines();
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);

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

        {isLoading ? (
          <div className="w-full flex items-center justify-center py-20">
             <span className="font-sans text-xs uppercase tracking-[0.3em] text-white/40 animate-pulse">Syncing Publications...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-8 sm:gap-y-8 items-start w-full">
            {dynamicMagazines.map((mag, idx) => {
              const coverUrl = getFirebaseImageUrl(mag.coverImage);
              return (
                <motion.div
                  key={mag.slug || mag.id}
                  style={{ y: isMobile ? 0 : (idx % 2 === 0 ? y1 : y2) }}
                  className="relative group"
                >
                  <Link href={`/magazines/${mag.slug}`} className="block h-full cursor-pointer">
                    <div className="aspect-[3/4] relative overflow-hidden rounded-xl border border-white/10">
                      {coverUrl && (
                        <Image
                          src={coverUrl}
                          alt={mag.articleTitle}
                          fill
                          className="object-cover transition-all duration-1000 group-hover:scale-105"
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
                          {mag.articleType} · {mag.readingTime} · {mag.displayDate}
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-white/20 font-sans text-[8px] font-bold uppercase tracking-[0.2em]">
                            BY {mag.authorContributor}
                          </p>
                          {mag.associatedVentureName && (
                            <>
                              <span className="text-white/20">·</span>
                              <p className="text-primary font-sans text-[8px] font-bold uppercase tracking-[0.2em]">
                                {mag.associatedVentureName}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-2 font-sans text-[10px] font-semibold uppercase tracking-widest text-white group-hover:text-primary transition-colors duration-300">
                        Read Magazine <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="mt-20 flex justify-center">
          <MagneticButton href="/magazines" className="border-white/20 text-white hover:border-white">
            Explore Publications <ArrowRight className="w-4 h-4" />
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}