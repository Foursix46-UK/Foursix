"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import { getFirebaseImageUrl } from "@/lib/utils";

// --- FIREBASE IMPORTS ---
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface NewsArticle {
  id: string;
  title: string;
  subHeadline: string;
  desc: string;
  category: string;
  date: string;
  authorSource: string;
  heroImage: string;
  displayOnHome: boolean; // Changed to match schema
  visibilityToggle: boolean;
}

export default function Newsroom() {
  const targetRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollDistance, setScrollDistance] = useState(0);
  
  const [dynamicNews, setDynamicNews] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedNews() {
      try {
        const newsRef = collection(db, "news");
        const q = query(newsRef, where("visibilityToggle", "==", true), orderBy("publishDate", "desc"));
        const snapshot = await getDocs(q);
        
        const fetchedData = snapshot.docs.map(doc => {
          const data = doc.data();
          const dateObj = data.publishDate?.toDate() || new Date();
          const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase();
          
          return { 
            id: doc.id, 
            ...data, 
            date: formattedDate 
          } as NewsArticle; 
        });

        // Filter using the new unified toggle
        const pinnedNews = fetchedData.filter(item => item.displayOnHome === true);
        setDynamicNews(pinnedNews);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchFeaturedNews();
  }, []);

  useEffect(() => {
    const updateDistance = () => {
      if (trackRef.current) {
        const trackWidth = trackRef.current.scrollWidth;
        const windowWidth = window.innerWidth;
        setScrollDistance(Math.max(0, trackWidth - windowWidth + 100));
      }
    };
    updateDistance();
    setTimeout(updateDistance, 500); 
    window.addEventListener("resize", updateDistance);
    return () => window.removeEventListener("resize", updateDistance);
  }, [dynamicNews]);

  const { scrollYProgress } = useScroll({ target: targetRef });
  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollDistance]);
  const buttonOpacity = useTransform(scrollYProgress, [0.85, 1], [0, 1]);
  const buttonScale = useTransform(scrollYProgress, [0.85, 1], [0.8, 1]);
  const pointerEvents = useTransform(scrollYProgress, (v) => v > 0.85 ? "auto" : "none");

  return (
    <section ref={targetRef} className="relative h-[200vh] bg-[#F5F5F7]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div ref={trackRef} style={{ x }} className="flex w-max items-center gap-12 px-6 md:px-24">
          <div className="w-[85vw] md:w-[300px] flex-shrink-0 text-left">
            <span className="font-sans text-[10px] font-semibold uppercase tracking-widest text-primary mb-4 block">
              Press & Announcements
            </span>
            <h2 className="text-4xl md:text-5xl font-sans font-semibold uppercase tracking-tighter text-black mb-6 leading-none">
              NEWSROOM
            </h2>
            <p className="text-sm text-black/60 max-w-xs font-sans leading-relaxed">
              Tracking the velocity of our ventures and the impact of our global strategic nodes through the lens of structural innovation.
            </p>
          </div>

          {isLoading ? (
             <div className="w-[85vw] md:w-[320px] h-[350px] flex items-center justify-center bg-black/5 rounded-xl border border-black/10">
               <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-black/40 animate-pulse">Syncing Press...</span>
             </div>
          ) : (
            dynamicNews.map((item) => {
              const imageUrl = getFirebaseImageUrl(item.heroImage);
              return (
                <div key={item.id} className="group relative w-[85vw] md:w-[320px] flex-shrink-0">
                  <div className="relative h-[250px] w-full overflow-hidden rounded-xl bg-white shadow-xl border border-black/5">
                    {imageUrl && (
                      <Image src={imageUrl} alt={item.title} fill className="object-cover transition-all duration-700 ease-in-out group-hover:scale-110" />
                    )}
                    <div className="absolute top-4 left-4 flex flex-col gap-1">
                      <span className="px-2 py-0.5 bg-black text-white font-sans text-[8px] font-semibold uppercase tracking-widest rounded-full w-fit">
                        {item.category}
                      </span>
                      {item.displayOnHome && (
                        <span className="px-2 py-0.5 bg-primary text-white font-sans text-[8px] font-bold uppercase tracking-widest rounded-full w-fit">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-lg font-sans font-semibold uppercase tracking-tighter text-black leading-tight group-hover:text-primary transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest">{item.date} · {item.authorSource}</p>
                    </div>
                    <p className="text-black/60 text-xs line-clamp-2 font-sans leading-relaxed">
                      {item.desc}
                    </p>
                    <Link href={`/newsroom/${item.id}`} className="font-sans text-[10px] font-semibold uppercase tracking-widest text-black hover:text-primary transition-colors flex items-center gap-2">
                      READ RELEASE →
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </motion.div>

        <motion.div 
          style={{ opacity: buttonOpacity, scale: buttonScale, pointerEvents: pointerEvents as any }}
          className="absolute bottom-4 right-6 md:bottom-4 md:right-16 z-50"
        >
          <MagneticButton href="/newsroom" variant="blue" className="border-black/20 text-black hover:border-black">
            View All Releases <ArrowRight className="w-4 h-4" />
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}