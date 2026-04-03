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
  slug: string;
  title: string;
  subHeadline: string;
  desc: string;
  category: string;
  date: string;
  authorSource: string;
  heroImage: string;
  displayOnHome: boolean;
  visibilityToggle: boolean;
}

// --- CMS Data Interface ---
interface NewsroomProps {
  data?: {
    newsroomLabel?: string;
    newsroomTitle?: string;
    newsroomSubtitle?: string;
    newsroomCtaText?: string;
  };
}

export default function Newsroom({ data }: NewsroomProps) {
  const targetRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollDistance, setScrollDistance] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  const [dynamicNews, setDynamicNews] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedNews() {
      try {
        const newsRef = collection(db, "news");
        const q = query(newsRef, where("visibilityToggle", "==", true), orderBy("publishDate", "desc"));
        const snapshot = await getDocs(q);
        
        const fetchedData = snapshot.docs.map(doc => {
          const dataObj = doc.data();
          const dateObj = dataObj.publishDate?.toDate() || new Date();
          const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase();
          
          return { 
            id: doc.id, 
            ...dataObj, 
            date: formattedDate 
          } as NewsArticle; 
        });

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

  // SMART SCROLL DISTANCE CALCULATOR
  useEffect(() => {
    const updateDistance = () => {
      const windowWidth = window.innerWidth;
      const mobileView = windowWidth < 768;
      setIsMobile(mobileView);

      if (trackRef.current) {
        if (mobileView) {
          // No scroll jacking on mobile
          setScrollDistance(0);
        } else {
          const trackWidth = trackRef.current.scrollWidth;
          // Only trigger horizontal scroll if the content is wider than the screen
          const distance = trackWidth > windowWidth ? trackWidth - windowWidth + 150 : 0;
          setScrollDistance(distance);
        }
      }
    };

    updateDistance();
    setTimeout(updateDistance, 500); 
    window.addEventListener("resize", updateDistance);
    return () => window.removeEventListener("resize", updateDistance);
  }, [dynamicNews]);

  const { scrollYProgress } = useScroll({ target: targetRef });
  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollDistance]);
  
  // Animation triggers for the button
  const buttonOpacity = useTransform(scrollYProgress, [0.8, 1], [0, 1]);
  const buttonScale = useTransform(scrollYProgress, [0.8, 1], [0.8, 1]);
  const pointerEvents = useTransform(scrollYProgress, (v) => v > 0.8 ? "auto" : "none");

  // Determine if we actually need to scroll
  const isScrollable = scrollDistance > 0;

  return (
    <section 
      ref={targetRef} 
      className="relative bg-[#F5F5F7]"
      // DYNAMIC HEIGHT: Shrinks to normal size if there are not enough articles, or if on mobile!
      style={{ height: isMobile ? 'auto' : (isScrollable ? `calc(100vh + ${scrollDistance}px)` : '100vh') }}
    >
      <div className={isMobile ? "py-16 flex flex-col overflow-hidden" : "sticky top-0 flex h-screen items-center overflow-hidden"}>
        
        <motion.div 
          ref={trackRef} 
          style={isMobile ? {} : { x }} 
          className={isMobile 
            ? "flex w-full items-center gap-6 px-6 overflow-x-auto snap-x snap-mandatory pb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" 
            : "flex w-max items-center gap-12 px-6 md:px-24"
          }
        >
          <div className={`flex-shrink-0 text-left ${isMobile ? 'w-[85vw] snap-center' : 'w-[85vw] md:w-[300px]'}`}>
            <span className="font-sans text-[10px] font-semibold uppercase tracking-widest text-primary mb-4 block">
              {data?.newsroomLabel || "Press & Announcements"}
            </span>
            <h2 className="text-4xl md:text-5xl font-sans font-semibold uppercase tracking-tighter text-black mb-6 leading-none">
              {data?.newsroomTitle || "NEWSROOM"}
            </h2>
            <p className="text-sm text-black/60 max-w-xs font-sans leading-relaxed whitespace-pre-wrap">
              {data?.newsroomSubtitle || "Tracking the velocity of our ventures and the impact of our global strategic nodes through the lens of structural innovation."}
            </p>
          </div>

          {isLoading ? (
             <div className={`flex items-center justify-center bg-black/5 rounded-xl border border-black/10 flex-shrink-0 ${isMobile ? 'w-[85vw] h-[350px] snap-center' : 'w-[85vw] md:w-[320px] h-[350px]'}`}>
               <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-black/40 animate-pulse">Syncing Press...</span>
             </div>
          ) : (
            dynamicNews.map((item) => {
              const imageUrl = getFirebaseImageUrl(item.heroImage);
              return (
                <div key={item.id} className={`group relative flex-shrink-0 ${isMobile ? 'w-[85vw] snap-center' : 'w-[85vw] md:w-[320px]'}`}>
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
                    <Link href={`/newsroom/${item.slug}`} className="font-sans text-[10px] font-semibold uppercase tracking-widest text-black hover:text-primary transition-colors flex items-center gap-2">
                      READ RELEASE →
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </motion.div>

        {/* BUTTON FIX: Standard document flow on mobile, tied to scroll completion on Desktop! */}
        <motion.div 
          style={isMobile ? {} : { 
            opacity: isScrollable ? buttonOpacity : 1, 
            scale: isScrollable ? buttonScale : 1,
            pointerEvents: (isScrollable ? pointerEvents : "auto") as any
          }}
          className={isMobile 
            ? "mt-8 px-6 w-full flex justify-start" 
            : "absolute bottom-8 right-6 md:bottom-12 md:right-16 z-50"
          }
        >
          <MagneticButton href="/newsroom" variant="blue" className="border-black/20 text-black hover:border-black">
            {data?.newsroomCtaText || "View All Releases"} <ArrowRight className="w-4 h-4 ml-2" />
          </MagneticButton>
        </motion.div>

      </div>
    </section>
  );
}