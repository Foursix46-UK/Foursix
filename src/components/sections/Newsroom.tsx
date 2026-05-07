"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import { getFirebaseImageUrl } from "@/lib/utils";

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

interface NewsroomProps {
  data?: any;
  initialNews?: NewsArticle[]; // 👈 NEW
}

export default function Newsroom({ data, initialNews = [] }: NewsroomProps) {
  const targetRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollDistance, setScrollDistance] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  // 👇 Instantly map the server data
  const dynamicNews = initialNews;

  // SMART SCROLL DISTANCE CALCULATOR (Kept exactly the same)
  useEffect(() => {
    const updateDistance = () => {
      const windowWidth = window.innerWidth;
      const mobileView = windowWidth < 768;
      setIsMobile(mobileView);

      if (trackRef.current) {
        if (mobileView) {
          setScrollDistance(0);
        } else {
          const trackWidth = trackRef.current.scrollWidth;
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
  
  const buttonOpacity = useTransform(scrollYProgress, [0.8, 1], [0, 1]);
  const buttonScale = useTransform(scrollYProgress, [0.8, 1], [0.8, 1]);
  const pointerEvents = useTransform(scrollYProgress, (v) => v > 0.8 ? "auto" : "none");

  const isScrollable = scrollDistance > 0;

  return (
    <section ref={targetRef} className="relative bg-[#F5F5F7]" style={{ height: isMobile ? 'auto' : (isScrollable ? `calc(100vh + ${scrollDistance}px)` : '100vh') }}>
      <div className={isMobile ? "py-16 flex flex-col overflow-hidden" : "sticky top-0 flex h-screen items-center overflow-hidden"}>
        <motion.div ref={trackRef} style={isMobile ? {} : { x }} className={isMobile ? "flex w-full items-center gap-6 px-6 overflow-x-auto snap-x snap-mandatory pb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" : "flex w-max items-center gap-12 px-6 md:px-24"}>
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

          {/* Renders instantly from Server Props */}
          {dynamicNews.map((item) => {
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
          })}
        </motion.div>

        <motion.div 
          style={isMobile ? {} : { 
            opacity: isScrollable ? buttonOpacity : 1, 
            scale: isScrollable ? buttonScale : 1,
            pointerEvents: (isScrollable ? pointerEvents : "auto") as any
          }}
          className={isMobile ? "mt-8 px-6 w-full flex justify-start" : "absolute bottom-8 right-6 md:bottom-12 md:right-16 z-50"}
        >
          <MagneticButton href="/newsroom" variant="blue" className="border-black/20 text-black hover:border-black">
            {data?.newsroomCtaText || "View All Releases"} <ArrowRight className="w-4 h-4 ml-2" />
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}