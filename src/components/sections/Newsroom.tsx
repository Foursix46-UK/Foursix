"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";

export interface NewsArticle {
  id: string;
  title: string;
  subHeadline: string;
  desc: string; // Short Summary
  tag: string; // Internal tag
  category: "Press" | "Announcement" | "Award" | "Update";
  date: string; // Display Date
  publishDate: string; // ISO format
  authorSource: string;
  image: string; // Featured Image
  bodyContent: string; // Rich Text/Markdown string
  pdfAttachment: string | null;
  externalCoverageLinks: string[];
  seoMetaFields: {
    title: string;
    description: string;
  };
  pinAsFeaturedToggle: boolean;
  visibilityToggle: boolean;
}

const newsItems: NewsArticle[] = [
  {
    id: "q1-orbital-expansion",
    title: "FourSix46 Announces Q1 Orbital Expansion",
    subHeadline: "Vyoma secures strategic nodes for next-generation orbital logistics.",
    desc: "Vyoma secures key partnerships for next-generation propulsion field tests in low earth orbit.",
    tag: "Expansion",
    category: "Announcement",
    date: "MAR 12, 2026",
    publishDate: "2026-03-12",
    authorSource: "Strategic Relations Office",
    image: "https://images.unsplash.com/photo-1517976547714-720226b864c1?q=80&w=1000",
    bodyContent: "<h1>Strategic Expansion</h1><p>Our aerospace division, Vyoma, has successfully entered into agreements with three major launch providers to test our proprietary plasma propulsion arrays.</p>",
    pdfAttachment: "/press-kits/orbital-expansion-2026.pdf",
    externalCoverageLinks: ["https://example-news.com/vyoma-expansion"],
    seoMetaFields: {
      title: "FourSix46 Q1 Orbital Expansion | Vyoma Press Release",
      description: "Official announcement of FourSix46 orbital logistics expansion for 2026."
    },
    pinAsFeaturedToggle: true,
    visibilityToggle: true,
  },
  {
    id: "rastlina-biophilic-tower",
    title: "Rastlina Deploys First Biophilic Tower",
    subHeadline: "Singapore's skyline receives its first functional biological lung.",
    desc: "A major milestone in integrating living ecosystems with urban brutalist architecture in Singapore.",
    tag: "Milestone",
    category: "Press",
    date: "FEB 28, 2026",
    publishDate: "2026-02-28",
    authorSource: "Architecture Global",
    image: "https://images.unsplash.com/photo-1531591022136-eb8b0da1e6d0?q=80&w=1000",
    bodyContent: "<p>Practical completion has been achieved at the Rastlina Alpha Tower. The structure incorporates 45,000sqm of vertical forest, managed by AI-driven irrigation.</p>",
    pdfAttachment: null,
    externalCoverageLinks: [],
    seoMetaFields: {
      title: "Rastlina Biophilic Tower Singapore | FourSix46 News",
      description: "Rastlina completes the first biophilic tower in Singapore."
    },
    pinAsFeaturedToggle: false,
    visibilityToggle: true,
  },
  {
    id: "nexus-sovereign-data",
    title: "Strategic Investment in Sovereign Data",
    subHeadline: "Nexus Core receives $50M allocation for global compute infrastructure.",
    desc: "Nexus Core scales operations across 12 global hubs to provide decentralized compute resources.",
    tag: "Investment",
    category: "Update",
    date: "JAN 15, 2026",
    publishDate: "2026-01-15",
    authorSource: "Financial Times Syndicate",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000",
    bodyContent: "<p>The parent group has authorized a $50M capital allocation to Nexus Core, targeting expansion into Northern European and Middle Eastern data markets.</p>",
    pdfAttachment: "/investor-relations/q1-data-allocation.pdf",
    externalCoverageLinks: ["https://finance-news.com/nexus-core-funding"],
    seoMetaFields: {
      title: "Nexus Core Sovereign Data Investment | FourSix46",
      description: "Investment details for sovereign decentralized data infrastructure expansion."
    },
    pinAsFeaturedToggle: true,
    visibilityToggle: true,
  },
  {
    id: "keynote-2026",
    title: "Julian Thorne Keynote at Tech Summit 2026",
    subHeadline: "The future of the House of Multibrands revealed.",
    desc: "Watch the Chief Executive discuss the future of multi-venture synergy and quiet luxury.",
    tag: "Keynote",
    category: "Announcement",
    date: "JAN 05, 2026",
    publishDate: "2026-01-05",
    authorSource: "Global Tech Summit",
    image: "https://images.unsplash.com/photo-1475721027187-4024733923f6?q=80&w=1000",
    bodyContent: "<p>CEO Julian Thorne outlined a decade-long vision focusing on biophilic urbanism and decentralized sovereignty.</p>",
    pdfAttachment: null,
    externalCoverageLinks: ["https://youtube.com/tech-summit-2026-thorne"],
    seoMetaFields: {
      title: "Julian Thorne Keynote 2026 | Future of FourSix46",
      description: "Full transcript and summary of Julian Thorne's 2026 Tech Summit keynote."
    },
    pinAsFeaturedToggle: false,
    visibilityToggle: true,
  },
  {
    id: "m-studio-agency-award",
    title: "M-Studio Wins Global Design Agency of the Year",
    subHeadline: "Excellence in neo-brutalist and luxury communications recognized.",
    desc: "Recognized for pioneering neo-brutalism in high-density corporate digital communications.",
    tag: "Award",
    category: "Award",
    date: "DEC 12, 2025",
    publishDate: "2025-12-12",
    authorSource: "Design Council International",
    image: "https://images.unsplash.com/photo-1604284195847-88dc4b5a9faa?q=80&w=1000",
    bodyContent: "<p>M-Studio has been awarded the prestigious 'Global Agency of the Year' for their work on the FourSix46 ecosystem and external luxury partners.</p>",
    pdfAttachment: null,
    externalCoverageLinks: [],
    seoMetaFields: {
      title: "M-Studio Agency of the Year 2025 | FourSix46 Awards",
      description: "M-Studio recognized globally for design excellence."
    },
    pinAsFeaturedToggle: false,
    visibilityToggle: true,
  },
];

export default function Newsroom() {
  const targetRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollDistance, setScrollDistance] = useState(0);

  useEffect(() => {
    const updateDistance = () => {
      if (trackRef.current) {
        const trackWidth = trackRef.current.scrollWidth;
        const windowWidth = window.innerWidth;
        setScrollDistance(Math.max(0, trackWidth - windowWidth + 100));
      }
    };

    updateDistance();
    window.addEventListener("resize", updateDistance);
    return () => window.removeEventListener("resize", updateDistance);
  }, []);

  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollDistance]);
  const buttonOpacity = useTransform(scrollYProgress, [0.85, 1], [0, 1]);
  const buttonScale = useTransform(scrollYProgress, [0.85, 1], [0.8, 1]);
  const pointerEvents = useTransform(scrollYProgress, (v) => v > 0.85 ? "auto" : "none");

  return (
    <section ref={targetRef} className="relative h-[200vh] bg-[#F5F5F7]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div 
          ref={trackRef}
          style={{ x }} 
          className="flex w-max items-center gap-12 px-6 md:px-24"
        >
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

          {newsItems.filter(v => v.visibilityToggle).map((item) => (
            <div
              key={item.id}
              className="group relative w-[85vw] md:w-[320px] flex-shrink-0"
            >
              <div className="relative h-[250px] w-full overflow-hidden rounded-xl bg-white shadow-xl border border-black/5">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-all duration-700 ease-in-out group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 flex flex-col gap-1">
                  <span className="px-2 py-0.5 bg-black text-white font-sans text-[8px] font-semibold uppercase tracking-widest rounded-full w-fit">
                    {item.tag}
                  </span>
                  {item.pinAsFeaturedToggle && (
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
                <Link 
                  href={`/newsroom/${item.id}`}
                  className="font-sans text-[10px] font-semibold uppercase tracking-widest text-black hover:text-primary transition-colors flex items-center gap-2"
                >
                  READ RELEASE →
                </Link>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div 
          style={{ 
            opacity: buttonOpacity, 
            scale: buttonScale,
            pointerEvents: pointerEvents as any
          }}
          className="absolute bottom-4 right-6 md:bottom-4 md:right-16 z-50"
        >
          <MagneticButton 
            href="/newsroom" 
            variant="blue"
            className="border-black/20 text-black hover:border-black"
          >
            View All Releases <ArrowRight className="w-4 h-4" />
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
