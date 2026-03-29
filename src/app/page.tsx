"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
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

// --- FIREBASE IMPORTS ---
import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [homeData, setHomeData] = useState<any>(null); 
  const containerRef = useRef<HTMLDivElement>(null);

  // --- NEWSLETTER STATE ---
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.4], [1, 0.95]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0.5]);
  const heroBorderRadius = useTransform(scrollYProgress, [0, 0.4], ["0px", "32px"]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    
    // --- SMART FETCH: Grabs the first document regardless of its ID ---
    async function fetchHomeData() {
      try {
        const q = query(collection(db, "page_home"), limit(1));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setHomeData(querySnapshot.docs[0].data());
        }
      } catch (error) {
        console.error("Error fetching home data:", error);
      }
    }

    fetchHomeData();

    const timer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => {
        document.body.style.overflow = "auto";
      }, 1000);
    }, 3750);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "auto";
    };
  }, []);

  // --- HANDLE SUBSCRIBE SUBMISSION ---
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Custom pop-up alert if they didn't check the box
    if (!consent) {
      alert("Please agree to receive email updates and accept the Privacy Policy to subscribe.");
      return; 
    }
    
    setIsSubscribing(true);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, consent, source: 'Homepage' }), // Indicates they signed up from Home
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
        {isLoading && <Preloader />}
      </AnimatePresence>
      
      <Navbar />

      <div className="relative h-[200vh]">
        <motion.div 
          style={{ 
            scale: heroScale, 
            opacity: heroOpacity,
            borderRadius: heroBorderRadius,
            willChange: "transform, opacity, border-radius"
          }} 
          className="sticky top-0 h-screen w-full overflow-hidden origin-top z-0"
        >
          <Hero data={homeData} />
        </motion.div>
      </div>

      <div className="relative z-10 -mt-[100vh]">
        <Ventures data={homeData} />
        
        <div className="bg-black w-full">
          <section className="relative bg-black overflow-hidden">
            <Vision data={homeData} />
          </section>

          <Newsroom data={homeData} />

          <section className="relative bg-black">
            <Magazines data={homeData} />
          </section>

          <GlobalPresence data={homeData} />
          <Contact />
          
          <FaqSection data={homeData} />

          {/* --- GDPR COMPLIANT NEWSLETTER SUBSCRIPTION SECTION --- */}
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
                    {isSubscribing ? "SENDING..." : isSuccess ? <><CheckCircle2 className="w-4 h-4"/> SENT</> : "SUBSCRIBE"}
                  </button>
                </div>
                
                {/* GDPR Consent Checkbox */}
                <div className="flex items-start gap-3 mt-2">
                  <input 
                    type="checkbox" 
                    id="gdpr-consent-home" 
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 w-4 h-4 bg-transparent border border-white/30 rounded-sm checked:bg-primary checked:border-primary focus:ring-0 cursor-pointer shrink-0"
                  />
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