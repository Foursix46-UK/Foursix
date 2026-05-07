"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/layout/Footer';
import { getFirebaseImageUrl } from "@/lib/utils";
import { CheckCircle2, X } from "lucide-react"; 

export default function NewsroomClient({ initialPageData, initialArticles }: { initialPageData: any, initialArticles: any[] }) {
  const pageData = initialPageData;
  const dynamicArticles = initialArticles;

  const [activeCategory, setActiveCategory] = useState("All News");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showConsentPopup, setShowConsentPopup] = useState(false);

  const handleConsentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.checked) { setShowConsentPopup(true); return; }
    setConsent(e.target.checked);
    setShowConsentPopup(false);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) { setShowConsentPopup(true); return; }
    setIsSubscribing(true);
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, consent, source: 'Newsroom Page' }),
      });
      if (!response.ok) throw new Error('Subscription failed');
      setIsSuccess(true);
      setEmail("");
      setConsent(false);
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubscribing(false);
    }
  };

  const dynamicCategories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(dynamicArticles.map(a => a.category))).filter(Boolean);
    return ["All News", ...uniqueCategories];
  }, [dynamicArticles]);

  const filteredArticles = useMemo(() => {
    if (activeCategory === "All News") return dynamicArticles;
    return dynamicArticles.filter(article => article.category === activeCategory);
  }, [activeCategory, dynamicArticles]);

  return (
    <main className="min-h-screen bg-black text-white selection:bg-primary selection:text-white">
      <Navbar />
      
      <header className="pt-40 pb-20 px-6 text-center max-w-7xl mx-auto">
        <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-primary uppercase tracking-widest text-[10px] font-semibold mb-4 block">
          {pageData?.heroLabel || "Press & Announcements"}
        </motion.span>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-6xl md:text-8xl uppercase tracking-tighter font-semibold text-white">
          {pageData?.heroTitle || "NEWSROOM"}
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-white/60 text-lg mt-6 font-light max-w-2xl mx-auto tracking-tight whitespace-pre-wrap">
          {pageData?.heroSubtitle || "Official press releases, announcements, and venture updates from the FourSix46 collective."}
        </motion.p>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/30 mt-6">
          {pageData?.pressInquiryText || "For press and media inquiries:"} <a href={`mailto:${pageData?.pressEmail || "press@foursix46.com"}`} className="text-primary hover:text-white transition-colors">{pageData?.pressEmail || "press@foursix46.com"}</a>
        </motion.p>
      </header>

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

      <section className="max-w-5xl mx-auto px-6 pb-24 min-h-[50vh]">
        <div className="flex flex-col gap-16">
          <AnimatePresence mode="popLayout">
            {filteredArticles.length > 0 ? filteredArticles.map((article, idx) => {
              const imageUrl = getFirebaseImageUrl(article.heroImage);
              return (
                <motion.article 
                  key={article.id} layout initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, delay: idx * 0.1 }}
                  className="group flex flex-col md:flex-row gap-8 items-center"
                >
                  <div className="w-full md:w-5/12 h-[300px] relative overflow-hidden rounded-2xl border border-white/10 bg-surface">
                    {/* 👇 HERE IS THE UNOPTIMIZED FLAG FOR NEXT.JS CACHE */}
                    {imageUrl && <Image src={imageUrl} alt={article.title} fill className="object-cover transition-all duration-1000 ease-in-out group-hover:scale-105" unoptimized />}
                  </div>
                  <div className="w-full md:w-7/12 flex flex-col items-start">
                    <div className="flex items-center gap-4 text-[10px] text-white/50 tracking-widest uppercase font-semibold">
                      <span>{article.date}</span><span className="w-1 h-1 bg-white/20 rounded-full" /><span>{article.category}</span>
                    </div>
                    <h3 className="text-3xl md:text-4xl uppercase tracking-tighter mt-4 text-white leading-tight group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-white/60 mt-4 font-light text-sm md:text-base leading-relaxed line-clamp-2">
                      {article.desc}
                    </p>
                    <Link href={`/newsroom/${article.slug || article.id}`} className="mt-8 inline-flex font-sans text-[10px] font-semibold uppercase tracking-widest text-white hover:text-primary transition-colors group/link">
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
      </section>

      {/* CONSENT POPUP */}
      <AnimatePresence>
        {showConsentPopup && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]" onClick={() => setShowConsentPopup(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black border border-white/20 rounded-2xl p-8 max-w-sm w-[90vw] z-[10000] shadow-2xl">
              <div className="flex items-start justify-between mb-6">
                <h3 className="text-xl font-bold uppercase tracking-wider text-white">Required</h3>
                <button onClick={() => setShowConsentPopup(false)} className="p-1 hover:bg-white/10 rounded-lg transition-all"><X className="w-5 h-5 text-white/70 hover:text-white" /></button>
              </div>
              <p className="text-white/80 text-sm leading-relaxed mb-6">Please agree to receive email updates and accept the Privacy Policy to subscribe.</p>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowConsentPopup(false)} className="flex-1 h-12 bg-white/10 border border-white/20 text-white text-xs uppercase font-bold tracking-wider rounded-xl hover:bg-white/20 transition-all">Cancel</button>
                <button onClick={() => { setConsent(true); setShowConsentPopup(false); }} className="flex-1 h-12 bg-primary text-black text-xs uppercase font-bold tracking-wider rounded-xl hover:bg-primary/90 transition-all">Agree & Continue</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- GDPR COMPLIANT NEWSLETTER SUBSCRIPTION SECTION --- */}
      <section className="py-32 px-6 border-t border-white/10 bg-[#0A0A0A]">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-primary">
              {pageData?.footerLabel || "Intelligence Network"}
            </span>
            <h2 className="text-3xl md:text-5xl font-sans font-semibold uppercase tracking-tighter text-white">
              {pageData?.footerTitle || "SUBSCRIBE TO UPDATES"}
            </h2>
            <p className="text-white/50 font-light leading-relaxed whitespace-pre-wrap">
              {pageData?.footerText || "Receive official press releases, venture launches, and corporate announcements directly to your inbox."}
            </p>
          </div>
          
          <form onSubmit={handleSubscribe} className="flex flex-col gap-4 max-w-xl mx-auto pt-4 w-full text-left">
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <input 
                type="email" 
                placeholder="EMAIL ADDRESS" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full sm:flex-1 h-14 bg-white/5 border border-white/10 rounded-none px-6 text-xs text-white tracking-widest focus:outline-none focus:border-primary transition-colors placeholder:text-white/20 placeholder:uppercase"
              />
              <button 
                type="submit" 
                disabled={isSubscribing || isSuccess}
                className="w-full sm:w-auto h-14 px-12 bg-white text-black font-sans text-[10px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubscribing ? "SENDING..." : isSuccess ? <><CheckCircle2 className="w-4 h-4"/> SENT</> : (pageData?.footerButton || "SUBSCRIBE")}
              </button>
            </div>
            
            {/* GDPR Consent Checkbox */}
            <div className="flex items-start gap-3 mt-2">
              <input 
                type="checkbox" 
                id="gdpr-consent" 
                checked={consent}
                onChange={handleConsentChange}
                className="mt-1 w-4 h-4 bg-transparent border border-white/30 rounded-sm checked:bg-primary checked:border-primary focus:ring-0 cursor-pointer shrink-0"
              />
              <label htmlFor="gdpr-consent" className="text-[10px] text-white/50 leading-relaxed font-light uppercase tracking-widest cursor-pointer select-none">
                I agree to receive email updates and accept the <Link href="/privacy" className="text-white hover:text-primary underline underline-offset-2">Privacy Policy</Link>.
              </label>
            </div>
            
            {isSuccess && (
              <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-primary text-xs font-bold uppercase tracking-widest text-center mt-4">
                Please check your inbox to confirm your subscription.
              </motion.p>
            )}
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}