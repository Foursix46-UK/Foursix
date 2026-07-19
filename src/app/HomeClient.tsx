//reference home client
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { CheckCircle2, X } from "lucide-react";
import Preloader from "@/components/layout/Preloader";
import Navbar from "@/components/navigation/Navbar";
import Hero from "@/components/sections/Hero";
import Ventures from "@/components/sections/Ventures";
import Vision from "@/components/sections/Vision";
import Newsroom from "@/components/sections/Newsroom";
import Magazines from "@/components/sections/Magazines";
import GlobalPresence from "@/components/sections/GlobalPresence";
import Contact from "@/components/sections/Contact";
import FaqSection from "@/components/sections/FaqSection";
import Footer from "@/components/layout/Footer";

// 👇 FIX: Accept data directly from the server
export default function HomeClient({ 
  initialHomeData, 
  initialVentures, 
  initialFaqs,
  initialGlobalStats,      
  initialGlobalMarkers,
  initialMagazines,
  initialNews              // 👈 NEW PROP ADDED
}: any) {
  const [isLoading, setIsLoading] = useState(true);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // --- NEWSLETTER STATE ---
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showConsentPopup, setShowConsentPopup] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.4], [1, 0.95]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0.5]);
  const heroBottomRadius = useTransform(scrollYProgress, [0, 0.4], ["0px", "32px"]);

  const finishPreloader = useCallback(() => {
    sessionStorage.setItem("home_preloader_seen", "1");
    setIsLoading(false);
    setTimeout(() => {
      document.body.style.overflow = "auto";
    }, 100);
  }, []);

  useEffect(() => {
    const hasSeenPreloader = typeof window !== "undefined" && sessionStorage.getItem("home_preloader_seen") === "1";
    if (hasSeenPreloader) {
      setIsLoading(false);
      document.body.style.overflow = "auto";
      return;
    }

    document.body.style.overflow = "hidden";

    // Safety fallback: prevent lock if preloader callback is blocked.
    const timer = setTimeout(() => {
      finishPreloader();
    }, 7000);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "auto";
    };
  }, [finishPreloader]);

  const handleConsentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.checked) {
      setShowConsentPopup(true);
      return;
    }
    setConsent(e.target.checked);
    setShowConsentPopup(false);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) { setShowConsentPopup(true); return; }
    setIsSubscribing(true);
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, consent, source: 'Homepage' }),
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
    <main className="min-h-screen bg-black" ref={containerRef}>
      <AnimatePresence mode="wait">
        {isLoading && <Preloader onComplete={finishPreloader} />}
      </AnimatePresence>
      
      <Navbar />

      <div className="relative h-[200vh]">
        <motion.div 
          style={{
            scale: heroScale,
            opacity: heroOpacity,
            borderBottomLeftRadius: heroBottomRadius,
            borderBottomRightRadius: heroBottomRadius,
            willChange: "transform, opacity, border-radius"
          }} 
          className="sticky top-0 h-screen w-full overflow-hidden origin-top z-0"
        >
          <Hero data={initialHomeData} />
        </motion.div>
      </div>

      <div className="relative z-10 -mt-[100vh]">
        <Ventures data={initialHomeData} serverVentures={initialVentures} />
        
        <div className="bg-black w-full">
          <section className="relative bg-black overflow-hidden">
            <Vision data={initialHomeData} />
          </section>

          {/* 👇 FIX: Pass initialNews down to the component securely */}
          <Newsroom data={initialHomeData} initialNews={initialNews} />

          <section className="relative bg-black">
            <Magazines data={initialHomeData} initialMagazines={initialMagazines} />
          </section>

          <GlobalPresence 
            data={initialHomeData} 
            initialStats={{
              activeCountries: initialGlobalStats?.activeCountries || "5",
              ventureNodes: initialGlobalStats?.ventureNodes || "12+",
              systemArchitecture: initialGlobalStats?.systemArchitecture || "Distributed", // ✅ FIXED VARIABLE
              uptime: initialGlobalStats?.operationalUptime || "24/7"
            }}
            initialMarkers={initialGlobalMarkers}
          />
          
          <Contact />
          
          <FaqSection data={initialHomeData} serverFaqs={initialFaqs} />

          <AnimatePresence>
            {showConsentPopup && (
              <>
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]"
                  onClick={() => setShowConsentPopup(false)}
                />
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black border border-white/20 rounded-2xl p-8 max-w-sm w-[90vw] z-[10000] shadow-2xl"
                >
                  <div className="flex items-start justify-between mb-6">
                    <h3 className="text-xl font-bold uppercase tracking-wider text-white">Required</h3>
                    <button onClick={() => setShowConsentPopup(false)} className="p-1 hover:bg-white/10 rounded-lg transition-all">
                      <X className="w-5 h-5 text-white/70 hover:text-white" />
                    </button>
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed mb-6">
                    Please agree to receive email updates and accept the Privacy Policy to subscribe.
                  </p>
                  <div className="flex gap-3 pt-2">
                    <button onClick={() => setShowConsentPopup(false)} className="flex-1 h-12 bg-white/10 border border-white/20 text-white text-xs uppercase font-bold tracking-wider rounded-xl hover:bg-white/20 transition-all">
                      Cancel
                    </button>
                    <button onClick={() => { setConsent(true); setShowConsentPopup(false); }} className="flex-1 h-12 bg-primary text-black text-xs uppercase font-bold tracking-wider rounded-xl hover:bg-primary/90 transition-all">
                      Agree & Continue
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <section className="py-32 px-6 border-t border-white/10 bg-[#0A0A0A]">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <div className="space-y-4">
                <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-primary">
                  Intelligence Network
                </span>
                <h2 className="text-3xl md:text-5xl font-sans font-semibold uppercase tracking-tighter text-white">
                  SUBSCRIBE TO UPDATES
                </h2>
                <p className="text-white/50 font-light leading-relaxed whitespace-pre-wrap">
                  Receive official press releases, venture launches, and corporate announcements directly to your inbox.
                </p>
              </div>
              
              <form onSubmit={handleSubscribe} className="flex flex-col gap-4 max-w-xl mx-auto pt-4 w-full text-left">
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <input 
                    type="email" placeholder="EMAIL ADDRESS" required value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full sm:flex-1 h-14 bg-white/5 border border-white/10 rounded-none px-6 text-xs text-white tracking-widest focus:outline-none focus:border-primary transition-colors placeholder:text-white/20 placeholder:uppercase"
                  />
                  <button type="submit" disabled={isSubscribing || isSuccess} className="w-full sm:w-auto h-14 px-12 bg-white text-black font-sans text-[10px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {isSubscribing ? "SENDING..." : isSuccess ? <><CheckCircle2 className="w-4 h-4"/> SENT</> : "SUBSCRIBE"}
                  </button>
                </div>
                <div className="flex items-start gap-3 mt-2">
                  <input type="checkbox" id="gdpr-consent-home" checked={consent} onChange={handleConsentChange} className="mt-1 w-4 h-4 bg-transparent border border-white/30 rounded-sm checked:bg-primary checked:border-primary focus:ring-0 cursor-pointer shrink-0"/>
                  <label htmlFor="gdpr-consent-home" className="text-[10px] text-white/50 leading-relaxed font-light uppercase tracking-widest cursor-pointer select-none">
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
        </div>
        <Footer />
      </div>
    </main>
  );
}