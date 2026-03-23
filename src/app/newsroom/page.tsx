"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/layout/Footer';
import { getFirebaseImageUrl } from "@/lib/utils";

// --- FIREBASE IMPORTS ---
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function NewsroomPage() {
  const [activeCategory, setActiveCategory] = useState("All News");
  const [dynamicArticles, setDynamicArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // FETCH DYNAMIC NEWS
  useEffect(() => {
    async function fetchAllNews() {
      try {
        const q = query(collection(db, "news"), where("visibilityToggle", "==", true), orderBy("publishDate", "desc"));
        const snapshot = await getDocs(q);
        
        const fetchedData = snapshot.docs.map(doc => {
          const data = doc.data();
          const dateObj = data.publishDate?.toDate() || new Date();
          const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase();
          return { id: doc.id, ...data, date: formattedDate };
        });

        setDynamicArticles(fetchedData);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAllNews();
  }, []);

  // --- DYNAMICALLY GENERATE CATEGORIES FROM THE DATABASE ---
  const dynamicCategories = useMemo(() => {
    // Extract unique categories from articles, filter out undefined/null
    const uniqueCategories = Array.from(new Set(dynamicArticles.map(a => a.category))).filter(Boolean);
    return ["All News", ...uniqueCategories];
  }, [dynamicArticles]);

  const filteredArticles = useMemo(() => {
    if (activeCategory === "All News") return dynamicArticles;
    // Direct match with the database category
    return dynamicArticles.filter(article => article.category === activeCategory);
  }, [activeCategory, dynamicArticles]);

  return (
    <main className="min-h-screen bg-black text-white selection:bg-primary selection:text-white">
      <Navbar />
      
      {/* Hero Section */}
      <header className="pt-40 pb-20 px-6 text-center max-w-7xl mx-auto">
        <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-primary uppercase tracking-widest text-[10px] font-semibold mb-4 block">
          Press & Announcements
        </motion.span>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-6xl md:text-8xl uppercase tracking-tighter font-semibold text-white">
          NEWSROOM
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-white/60 text-lg mt-6 font-light max-w-2xl mx-auto tracking-tight">
          Official press releases, announcements, and venture updates from the FourSix46 collective.
        </motion.p>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/30 mt-6">
          For press and media inquiries: <a href="mailto:press@foursix46.com" className="text-primary hover:text-white transition-colors">press@foursix46.com</a>
        </motion.p>
      </header>

      {/* Category Filter */}
      <section className="max-w-7xl mx-auto px-6 mb-16 overflow-x-auto pb-4 no-scrollbar">
        <div className="flex items-center justify-center gap-3 min-w-max">
          {dynamicCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat as string)}
              className={`rounded-full border px-6 py-2 text-[10px] uppercase tracking-widest font-semibold transition-all duration-300 ${
                activeCategory === cat ? "bg-white border-white text-black" : "border-white/20 text-white hover:border-white/50"
              }`}
            >
              {cat as string}
            </button>
          ))}
        </div>
      </section>

      {/* Chronological Feed */}
      <section className="max-w-5xl mx-auto px-6 pb-24 min-h-[50vh]">
        {isLoading ? (
          <div className="w-full flex items-center justify-center py-20">
             <span className="font-sans text-xs uppercase tracking-[0.3em] text-white/40 animate-pulse">Syncing Database...</span>
          </div>
        ) : (
          <div className="flex flex-col gap-16">
            <AnimatePresence mode="popLayout">
              {filteredArticles.length > 0 ? filteredArticles.map((article, idx) => {
                const imageUrl = getFirebaseImageUrl(article.heroImage);
                return (
                  <motion.article 
                    key={article.id}
                    layout
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: idx * 0.1 }}
                    className="group flex flex-col md:flex-row gap-8 items-center"
                  >
                    <div className="w-full md:w-5/12 h-[300px] relative overflow-hidden rounded-2xl border border-white/10 bg-surface">
                      {imageUrl && (
                        <Image src={imageUrl} alt={article.title} fill className="object-cover transition-all duration-1000 ease-in-out group-hover:scale-105" />
                      )}
                    </div>

                    <div className="w-full md:w-7/12 flex flex-col items-start">
                      <div className="flex items-center gap-4 text-[10px] text-white/50 tracking-widest uppercase font-semibold">
                        <span>{article.date}</span>
                        <span className="w-1 h-1 bg-white/20 rounded-full" />
                        <span>{article.category}</span>
                      </div>
                      
                      <h3 className="text-3xl md:text-4xl uppercase tracking-tighter mt-4 text-white leading-tight group-hover:text-primary transition-colors">
                        {article.title}
                      </h3>
                      
                      <p className="text-white/60 mt-4 font-light text-sm md:text-base leading-relaxed line-clamp-2">
                        {article.desc}
                      </p>
                      
                      <Link href={`/newsroom/${article.id}`} className="mt-8 inline-flex font-sans text-[10px] font-semibold uppercase tracking-widest text-white hover:text-primary transition-colors group/link">
                        Read Full Release <span className="inline-block ml-2 group-hover/link:translate-x-1 transition-transform">→</span>
                      </Link>
                    </div>
                  </motion.article>
                );
              }) : (
                <div className="py-20 text-center w-full">
                  <p className="text-white/20 uppercase tracking-widest font-bold text-xs">No articles found in this category.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </section>

      <section className="py-32 px-6 border-t border-white/10 bg-[#0A0A0A]">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-primary">Intelligence Network</span>
            <h2 className="text-3xl md:text-5xl font-sans font-semibold uppercase tracking-tighter text-white">SUBSCRIBE TO UPDATES</h2>
            <p className="text-white/50 font-light leading-relaxed">Receive official press releases, venture launches, and corporate announcements directly to your inbox.</p>
          </div>
          <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto pt-4 w-full">
            <input type="email" placeholder="EMAIL ADDRESS" required className="w-full sm:flex-1 h-14 bg-white/5 border border-white/10 rounded-none px-6 text-xs text-white uppercase tracking-widest focus:outline-none focus:border-primary transition-colors placeholder:text-white/20"/>
            <button type="submit" className="w-full sm:w-auto h-14 px-12 bg-white text-black font-sans text-[10px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-colors">SUBSCRIBE</button>
          </form>
        </div>
      </section>
      <Footer />
    </main>
  );
}