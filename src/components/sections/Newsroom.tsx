"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
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
  initialNews?: NewsArticle[]; 
}

export default function Newsroom({ data, initialNews = [] }: NewsroomProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dynamicNews = initialNews;

  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const checkScrollPosition = () => {
    if (trackRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
      setIsAtStart(scrollLeft <= 20);
      setIsAtEnd(Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 100);
    }
  };

  useEffect(() => {
    const track = trackRef.current;
    if (track) {
      checkScrollPosition();
      setTimeout(checkScrollPosition, 500);

      track.addEventListener("scroll", checkScrollPosition);
      window.addEventListener("resize", checkScrollPosition);
      
      return () => {
        track.removeEventListener("scroll", checkScrollPosition);
        window.removeEventListener("resize", checkScrollPosition);
      };
    }
  }, [dynamicNews]);

  const scrollTrack = (direction: "left" | "right") => {
    if (trackRef.current) {
      const scrollAmount = window.innerWidth > 768 ? 400 : 300; 
      trackRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <section className="bg-[#F5F5F7] w-full py-24 md:py-32 flex flex-col justify-center min-h-[85vh]">
      
      {/* 1. Header (Title & Desc) */}
      <div className="w-full flex flex-col md:flex-row md:items-end justify-between px-6 md:px-24 mb-12 gap-8">
        <div className="max-w-2xl">
          <span className="font-sans text-[10px] font-semibold uppercase tracking-widest text-primary mb-4 block">
            {data?.newsroomLabel || "Press & Announcements"}
          </span>
          <h2 className="text-4xl md:text-5xl font-sans font-semibold uppercase tracking-tighter text-black mb-6 leading-none">
            {data?.newsroomTitle || "NEWSROOM"}
          </h2>
          <p className="text-sm text-black/60 font-sans leading-relaxed whitespace-pre-wrap">
            {data?.newsroomSubtitle || "Tracking the velocity of our ventures and the impact of our global strategic nodes through the lens of structural innovation."}
          </p>
        </div>
      </div>

      {/* 2. Track Container */}
      <div className="relative w-full">
        
        {/* 👈 Left Floating Arrow */}
        <div className={`hidden md:block absolute left-4 lg:left-8 top-[40%] -translate-y-1/2 z-20 transition-all duration-500 ${isAtStart ? 'opacity-0 -translate-x-4 pointer-events-none' : 'opacity-100 translate-x-0'}`}>
          <button 
            onClick={() => scrollTrack("left")}
            className="w-14 h-14 bg-white/90 backdrop-blur shadow-xl rounded-full border border-black/10 flex items-center justify-center text-black hover:bg-black hover:text-white transition-all duration-300 hover:scale-105"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>
        
        {/* 👉 Right Floating Arrow */}
        <div className={`hidden md:block absolute right-4 lg:right-8 top-[40%] -translate-y-1/2 z-20 transition-all duration-500 ${isAtEnd ? 'opacity-0 translate-x-4 pointer-events-none' : 'opacity-100 translate-x-0'}`}>
          <button 
            onClick={() => scrollTrack("right")}
            className="w-14 h-14 bg-white/90 backdrop-blur shadow-xl rounded-full border border-black/10 flex items-center justify-center text-black hover:bg-black hover:text-white transition-all duration-300 hover:scale-105"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* The Native Scrolling Track */}
        <div 
          ref={trackRef} 
          className="flex w-full overflow-x-auto snap-x snap-mandatory gap-6 md:gap-8 px-6 md:px-24 pb-8 pt-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {dynamicNews.map((item) => {
            const imageUrl = getFirebaseImageUrl(item.heroImage);
            return (
              <div key={item.id} className="group relative flex-shrink-0 w-[85vw] md:w-[350px] snap-center">
                <div className="relative h-[250px] w-full overflow-hidden rounded-xl bg-white shadow-xl border border-black/5">
                  {imageUrl && (
                    <Image src={imageUrl} alt={item.title} fill sizes="(max-width: 768px) 85vw, 350px" className="object-cover transition-all duration-700 ease-in-out group-hover:scale-105" />
                  )}
                  <div className="absolute top-4 left-4 flex flex-col gap-1">
                    <span className="px-3 py-1 bg-black text-white font-sans text-[9px] font-semibold uppercase tracking-widest rounded-full w-fit">
                      {item.category}
                    </span>
                    {item.displayOnHome && (
                      <span className="px-3 py-1 bg-primary text-white font-sans text-[9px] font-bold uppercase tracking-widest rounded-full w-fit">
                        Featured
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="mt-6 space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-sans font-semibold tracking-tighter text-black leading-tight group-hover:text-primary transition-colors duration-300 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest pt-1">{item.date} · {item.authorSource}</p>
                  </div>
                  <p className="text-black/60 text-sm line-clamp-2 font-sans leading-relaxed">
                    {item.desc}
                  </p>
                  <Link href={`/newsroom/${item.slug}`} className="font-sans text-[11px] font-semibold uppercase tracking-widest text-black hover:text-primary transition-colors flex items-center gap-2 pt-2">
                    READ RELEASE →
                  </Link>
                </div>
              </div>
            );
          })}
          
          <div className="flex-shrink-0 w-8 md:w-12"></div>
        </div>
      </div>

      {/* 3. CTA Button BELOW the cards */}
      {/* 👇 FIX: Button is ALWAYS visible on Mobile. On Desktop (md:), it hides and waits for the scroll to reach the end! */}
      <div 
        className={`w-full px-6 md:px-24 flex justify-start md:justify-end mt-4 transition-all duration-700 ease-out 
          opacity-100 translate-y-0 visible 
          ${isAtEnd ? 'md:opacity-100 md:translate-y-0 md:visible' : 'md:opacity-0 md:translate-y-4 md:invisible'}
        `}
      >
        <Link href="/newsroom">
          <button className="h-12 px-8 rounded-full font-sans text-[10px] font-bold uppercase tracking-widest border border-black/20 bg-transparent text-black hover:bg-black hover:text-white transition-all duration-300 group flex items-center">
            {data?.newsroomCtaText || "Enter Newsroom"} 
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </Link>
      </div>

    </section>
  );
}