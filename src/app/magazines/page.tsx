
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

const magazinesData = [
  {
    id: "volume-01",
    volume: "Volume 01",
    title: "The Grid",
    desc: "A deep dive into modular urbanism and the digital structure of modern cities. Exploring how the grid defines our physical and virtual existence.",
    color: "#E31837",
    imgId: "mag-1",
    status: "Published",
  },
  {
    id: "volume-02",
    volume: "Volume 02",
    title: "Bio-Syn",
    desc: "Exploring the synthesis of biological systems and synthetic technology. A study on how biophilic design is reshaping high-density living.",
    color: "#27A9E1",
    imgId: "mag-2",
    status: "Published",
  },
  {
    id: "volume-03",
    volume: "Volume 03",
    title: "Sovereign",
    desc: "An investigation into the infrastructure of sovereignty. How decentralized compute nodes and secure networks protect global strategic interests.",
    color: "#FFD100",
    imgId: "gallery-3",
    status: "Published",
  },
  {
    id: "volume-04",
    volume: "Volume 04",
    title: "Velocity",
    desc: "Kinetic Motion: The velocity of change in the post-industrial era. Accelerating mobility and cross-border venture synergy.",
    color: "#FAFAFA",
    imgId: "gallery-6",
    status: "Coming Soon",
  },
];

interface CardProps {
  magazine: (typeof magazinesData)[0];
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
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.4]);

  const magImg = PlaceHolderImages.find((img) => img.id === magazine.imgId);

  return (
    <div
      ref={containerRef}
      className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden"
    >
      <motion.div
        style={{
          scale: index === total - 1 ? 1 : scale,
          opacity: index === total - 1 ? 1 : opacity,
        }}
        className="w-[92vw] max-w-7xl h-[75vh] md:h-[80vh] bg-[#111] border border-white/10 rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative origin-top"
      >
        {/* Left Side: Content */}
        <div className="w-full md:w-1/2 p-8 md:p-16 lg:p-24 flex flex-col justify-center relative z-10 bg-[#111]">
          <div className="space-y-2">
            <span
              className="font-sans text-[10px] font-bold uppercase tracking-[0.4em]"
              style={{ color: magazine.color }}
            >
              {magazine.volume}
            </span>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-sans font-black uppercase tracking-tighter leading-none text-white">
              {magazine.title}
            </h2>
          </div>

          <p className="text-white/50 text-base md:text-lg font-light leading-relaxed mt-8 mb-12 max-w-md">
            {magazine.desc}
          </p>

          <div className="flex items-center gap-6">
            {magazine.status === "Published" ? (
              <MagneticButton
                href={`/magazines/${magazine.id}`}
                variant="white"
                className="px-10 h-14"
              >
                Read Issue <ArrowRight className="ml-2 w-4 h-4 inline-block" />
              </MagneticButton>
            ) : (
              <div className="px-8 py-3 rounded-full border border-white/5 bg-white/5 text-[10px] uppercase tracking-widest text-white/30 font-bold">
                Coming Soon
              </div>
            )}
          </div>

          {/* Background Numbering */}
          <span className="absolute bottom-10 right-10 text-[12vw] font-black text-white/[0.02] pointer-events-none select-none">
            0{index + 1}
          </span>
        </div>

        {/* Right Side: Cinematic Image */}
        <div className="w-full md:w-1/2 h-full relative overflow-hidden">
          {magImg && (
            <motion.div
              initial={{ scale: 1.2, x: "-5%" }}
              whileInView={{
                scale: 1,
                x: "0%",
                transition: { duration: 10, ease: "linear", repeat: Infinity, repeatType: "mirror" },
              }}
              className="absolute inset-0"
            >
              <Image
                src={magImg.imageUrl}
                alt={magazine.title}
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                priority={index === 0}
              />
            </motion.div>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[#111] via-transparent to-transparent hidden md:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent md:hidden" />
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
          <h1 className="text-6xl md:text-9xl font-sans font-black uppercase tracking-tighter leading-none mb-8 text-white">
            PUBLICATIONS
          </h1>
          <p className="text-lg md:text-xl text-white/50 font-light max-w-2xl mx-auto leading-relaxed tracking-tight">
            Our quarterly deep-dive into the philosophies that drive our ventures. 
            From architectural biophilia to the future of orbital mobility, we examine 
            the narratives shaping our world.
          </p>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-radial-gradient from-primary/10 via-transparent to-transparent" />
        </div>
      </section>

      {/* Sticky Stacking Cards */}
      <section className="relative w-full pb-[10vh]">
        {magazinesData.map((mag, idx) => (
          <MagazineCard
            key={mag.id}
            magazine={mag}
            index={idx}
            total={magazinesData.length}
          />
        ))}
      </section>

      {/* Future Vision Footer Callout */}
      <section className="py-48 px-6 bg-[#0A0A0A] border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <h2 className="text-4xl md:text-6xl font-sans font-black uppercase tracking-tighter text-white">
            WANT TO CONTRIBUTE?
          </h2>
          <p className="text-xl text-white/40 font-light leading-relaxed">
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
