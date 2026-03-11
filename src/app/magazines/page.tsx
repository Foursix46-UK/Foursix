"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import MagneticButton from "@/components/ui/MagneticButton";
import { magazineData, type MagazineIssue } from "@/lib/magazine-data";

interface CardProps {
  magazine: MagazineIssue;
  index: number;
  total: number;
}

const MagazineCard = ({ magazine, index, total }: CardProps) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Scale and Opacity transform for the card as it gets covered
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.6]);

  const magImg = PlaceHolderImages.find((img) => img.id === magazine.coverImage);

  return (
    <div
      ref={containerRef}
      className="sticky top-[15vh] md:top-20 h-screen w-full flex items-center justify-center overflow-hidden"
    >
      <motion.div
        style={{
          scale: index === total - 1 ? 1 : scale,
          opacity: index === total - 1 ? 1 : opacity,
        }}
        className="w-[92vw] max-w-7xl h-[75vh] md:h-[80vh] bg-[#111] border border-white/10 rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative origin-top pt-12 md:pt-0"
      >
        {/* Left Side: Content */}
        <div className="w-full md:w-1/2 p-8 md:p-16 lg:p-24 flex flex-col justify-center relative z-10 bg-[#111]">
          <div className="space-y-1">
            <span
              className="font-sans text-[10px] font-semibold uppercase tracking-widest text-primary mb-4 block"
            >
              {magazine.magazineSeriesName} SERIES · {magazine.issueVolume}
            </span>
            <h2 className="text-3xl md:text-4xl font-sans font-semibold uppercase tracking-tighter text-white mt-4 mb-4 leading-tight">
              {magazine.articleTitle}
            </h2>
          </div>

          <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-8 border-l-2 border-white/10 pl-4">
            {magazine.articleType} · {magazine.readingTime} · {magazine.publishDate}
          </p>

          <div className="flex flex-wrap gap-2 items-center text-[10px] font-sans font-bold uppercase tracking-widest text-white/40 mb-8">
            <span>BY {magazine.authorContributor}</span>
            <span>·</span>
            <span>{magazine.themeTag}</span>
          </div>

          <div className="flex items-center gap-6">
            <MagneticButton
              href={`/magazines/${magazine.slug}`}
              variant="blue"
              className="px-10 h-14 w-fit flex items-center justify-center group"
            >
              <span className="font-sans text-[10px] font-semibold uppercase tracking-widest flex items-center justify-center gap-2 text-center w-full">
                Read Magazine <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </MagneticButton>
          </div>

          {/* Background Numbering */}
          <span className="absolute bottom-10 right-10 text-[10vw] font-black text-white/[0.01] pointer-events-none select-none">
            0{index + 1}
          </span>
        </div>

        {/* Right Side: Cinematic Image */}
        <div className="w-full md:w-1/2 h-full relative overflow-hidden">
          {magImg && (
            <motion.div
              initial={{ scale: 1.15 }}
              whileInView={{
                scale: 1,
                transition: { duration: 15, ease: "linear", repeat: Infinity, repeatType: "mirror" },
              }}
              className="absolute inset-0"
            >
              <Image
                src={magImg.imageUrl}
                alt={magazine.articleTitle}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </motion.div>
          )}
          {/* Subtle gradient for content legibility on mobile, but keeping image vibrant */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#111]/40 via-transparent to-transparent hidden md:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111]/40 via-transparent to-transparent md:hidden" />
        </div>
      </motion.div>
    </div>
  );
};

export default function MagazinesPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] selection:bg-primary selection:text-white">
      <Navbar />

      {/* Editorial Hero Section */}
      <section className="h-[70vh] flex flex-col justify-center items-center text-center px-6 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10"
        >
          <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.5em] text-primary mb-6 block">
            The Editorial Archive
          </span>
          <h1 className="text-4xl md:text-6xl font-sans font-semibold uppercase tracking-tighter text-white mb-6">
            PUBLICATIONS
          </h1>
          <p className="text-base md:text-lg text-white/50 font-light max-w-2xl mx-auto leading-relaxed tracking-tight">
            Our quarterly deep-dive into the philosophies that drive our ventures. 
            From architectural biophilia to the future of orbital mobility, we examine 
            the narratives shaping our world.
          </p>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-radial-gradient from-primary/10 via-transparent to-transparent" />
        </div>
      </section>

      {/* Sticky Stacking Cards */}
      <section className="relative w-full pb-[10vh]">
        {magazineData.map((mag, idx) => (
          <MagazineCard
            key={mag.slug}
            magazine={mag}
            index={idx}
            total={magazineData.length}
          />
        ))}
      </section>

      {/* Future Vision Footer Callout */}
      <section className="py-48 px-6 bg-[#0A0A0A] border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <h2 className="text-3xl md:text-5xl font-sans font-semibold uppercase tracking-tighter text-white">
            WANT TO CONTRIBUTE?
          </h2>
          <p className="text-lg text-white/40 font-light leading-relaxed">
            We are always looking for visionary thinkers, designers, and strategists 
            to feature in our upcoming volumes.
          </p>
          <MagneticButton href="/contact" className="px-12 h-16">
            Get in Touch
          </MagneticButton>
        </div>
      </section>

      <Footer />
    </main>
  );
}
