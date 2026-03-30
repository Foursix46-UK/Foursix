"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform ,AnimatePresence} from "framer-motion";
import { ArrowRight, CheckCircle2, X } from "lucide-react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import MagneticButton from "@/components/ui/MagneticButton";
import { getFirebaseImageUrl } from "@/lib/utils";

// --- FIREBASE IMPORTS ---
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

const MagazineCard = ({ magazine, index, total }: { magazine: any, index: number, total: number }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.6]);

  const coverUrl = getFirebaseImageUrl(magazine.coverImage);

  return (
    <div ref={containerRef} className="sticky top-[15vh] md:top-20 h-screen w-full flex items-center justify-center overflow-hidden">
      <motion.div
        style={{
          scale: index === total - 1 ? 1 : scale,
          opacity: index === total - 1 ? 1 : opacity,
        }}
        className="w-[92vw] max-w-7xl h-[75vh] md:h-[80vh] bg-[#111] border border-white/10 rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative origin-top pt-12 md:pt-0"
      >
        <div className="w-full md:w-1/2 p-8 md:p-16 lg:p-24 flex flex-col justify-center relative z-10 bg-[#111]">
          <div className="space-y-1">
            <span className="font-sans text-[10px] font-semibold uppercase tracking-widest text-primary mb-4 block">
              {magazine.magazineSeriesName} SERIES · {magazine.issueVolume}
            </span>
            <h2 className="text-3xl md:text-4xl font-sans font-semibold uppercase tracking-tighter text-white mt-4 mb-4 leading-tight">
              {magazine.articleTitle}
            </h2>
          </div>

          <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-8 border-l-2 border-white/10 pl-4">
            {magazine.articleType} · {magazine.readingTime} · {magazine.displayDate}
          </p>

          <div className="flex flex-wrap gap-2 items-center text-[10px] font-sans font-bold uppercase tracking-widest text-white/40 mb-8">
            <span>BY {magazine.authorContributor}</span>
            <span>·</span>
            <span>{magazine.themeTag}</span>
            {magazine.associatedVentureName && (
              <>
                <span>·</span>
                <Link href={`/ventures/${magazine.associatedVentureSlug}`} className="text-primary hover:text-primary/80 transition-colors z-20">
                  {magazine.associatedVentureName}
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-6">
            <MagneticButton href={`/magazines/${magazine.slug}`} variant="blue" className="px-10 h-14 w-fit flex items-center justify-center group">
              <span className="font-sans text-[10px] font-semibold uppercase tracking-widest flex items-center justify-center gap-2 text-center w-full text-white group-hover:text-primary transition-colors duration-300">
                Read Magazine <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </MagneticButton>
          </div>

          <span className="absolute bottom-10 right-10 text-[10vw] font-black text-white/[0.01] pointer-events-none select-none">
            0{index + 1}
          </span>
        </div>

        <div className="w-full md:w-1/2 h-full relative overflow-hidden">
          {coverUrl && (
            <motion.div
              initial={{ scale: 1.15 }}
              whileInView={{ scale: 1, transition: { duration: 15, ease: "linear", repeat: Infinity, repeatType: "mirror" } }}
              className="absolute inset-0"
            >
              <Image src={coverUrl} alt={magazine.articleTitle} fill className="object-cover" priority={index === 0} />
            </motion.div>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[#111]/40 via-transparent to-transparent hidden md:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111]/40 via-transparent to-transparent md:hidden" />
        </div>
      </motion.div>
    </div>
  );
};

export default function MagazinesPage() {
  const [dynamicMagazines, setDynamicMagazines] = useState<any[]>([]);
  const [pageData, setPageData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- NEWSLETTER STATE ---
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // --- POPUP STATE ---
  const [showConsentPopup, setShowConsentPopup] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch CMS Page Text
        const pageQ = query(collection(db, "page_magazines"), limit(1));
        const pageSnap = await getDocs(pageQ);
        if (!pageSnap.empty) setPageData(pageSnap.docs[0].data());

        // Fetch Magazines
        const magQ = query(collection(db, "magazines"), where("visibilityToggle", "==", true), orderBy("displayOrder", "asc"));
        const magSnap = await getDocs(magQ);
        const fetchedData = magSnap.docs.map(doc => {
          const data = doc.data();
          const dateObj = data.publishDate?.toDate() || new Date();
          const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase();
          return { id: doc.id, ...data, displayDate: formattedDate };
        });
        setDynamicMagazines(fetchedData);
      } catch (error) {
        console.error("Error fetching magazines data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // --- HANDLE CONSENT CHECKBOX ---
  const handleConsentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.checked) {
      setShowConsentPopup(true);
      return;
    }
    setConsent(e.target.checked);
    setShowConsentPopup(false);
  };

  // --- HANDLE SUBSCRIBE SUBMISSION ---
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!consent) {
      setShowConsentPopup(true);
      return; 
    }
    
    setIsSubscribing(true);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, consent, source: 'Magazines Page' }),
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

  return (
    <main className="min-h-screen bg-[#0A0A0A] selection:bg-primary selection:text-white">
      <Navbar />

      <section className="h-[70vh] flex flex-col justify-center items-center text-center px-6 relative overflow-hidden">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="relative z-10">
          <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.5em] text-primary mb-6 block">
            {pageData?.heroLabel || "The Editorial Archive"}
          </span>
          <h1 className="text-4xl md:text-6xl font-sans font-semibold uppercase tracking-tighter text-white mb-6">
            {pageData?.heroTitle || "PUBLICATIONS"}
          </h1>
          <p className="text-base md:text-lg text-white/50 font-light max-w-2xl mx-auto leading-relaxed tracking-tight whitespace-pre-wrap">
            {pageData?.heroSubtitle || "Our quarterly deep-dive into the philosophies that drive our ventures. From architectural biophilia to the future of orbital mobility, we examine the narratives shaping our world."}
          </p>
        </motion.div>
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-radial-gradient from-primary/10 via-transparent to-transparent" />
        </div>
      </section>

      {isLoading ? (
        <div className="w-full flex items-center justify-center py-32 h-[50vh]">
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-white/40 animate-pulse">Syncing Publications...</span>
        </div>
      ) : (
        <section className="relative w-full pb-[10vh]">
          {dynamicMagazines.map((mag, idx) => (
            <MagazineCard key={mag.slug || mag.id} magazine={mag} index={idx} total={dynamicMagazines.length} />
          ))}
        </section>
      )}

      {/* --- CONSENT POPUP --- */}
      <AnimatePresence>
        {showConsentPopup && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]"
              onClick={() => setShowConsentPopup(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black border border-white/20 rounded-2xl p-8 max-w-sm w-[90vw] z-[10000] shadow-2xl"
            >
              <div className="flex items-start justify-between mb-6">
                <h3 className="text-xl font-bold uppercase tracking-wider text-white">Required</h3>
                <button 
                  onClick={() => setShowConsentPopup(false)}
                  className="p-1 hover:bg-white/10 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-white/70 hover:text-white" />
                </button>
              </div>
              <p className="text-white/80 text-sm leading-relaxed mb-6">
                Please agree to receive email updates and accept the Privacy Policy to subscribe.
              </p>
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setShowConsentPopup(false)}
                  className="flex-1 h-12 bg-white/10 border border-white/20 text-white text-xs uppercase font-bold tracking-wider rounded-xl hover:bg-white/20 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setConsent(true);
                    setShowConsentPopup(false);
                  }}
                  className="flex-1 h-12 bg-primary text-black text-xs uppercase font-bold tracking-wider rounded-xl hover:bg-primary/90 transition-all"
                >
                  Agree & Continue
                </button>
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
                id="gdpr-consent-mag" 
                checked={consent}
                onChange={handleConsentChange}
                className="mt-1 w-4 h-4 bg-transparent border border-white/30 rounded-sm checked:bg-primary checked:border-primary focus:ring-0 cursor-pointer shrink-0"
              />
              <label htmlFor="gdpr-consent-mag" className="text-[10px] text-white/50 leading-relaxed font-light uppercase tracking-widest cursor-pointer select-none">
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