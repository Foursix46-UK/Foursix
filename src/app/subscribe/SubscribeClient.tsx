"use client";

// Standalone version of the newsletter section used on the Newsroom page, so
// foursix46.com/subscribe can be linked to directly (emails, social bios, QR codes).
// Posts to the same /api/subscribe route (Brevo double opt-in).
import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import { CheckCircle2, X } from "lucide-react";

export default function SubscribeClient() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showConsentPopup, setShowConsentPopup] = useState(false);

  const handleConsentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.checked) { setConsent(false); return; }
    setConsent(true);
    setShowConsentPopup(false);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) { setShowConsentPopup(true); return; }
    setIsSubscribing(true);
    setErrorMsg("");
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent, source: "Subscribe Page" }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data?.success === false) {
        throw new Error(data?.message || data?.error || "Subscription failed");
      }
      // The API answers 200 with an honest message even when the confirmation email
      // couldn't be sent, so show what it says instead of always promising an email.
      setSuccessMsg(data?.message || "Please check your inbox to confirm your subscription.");
      setIsSuccess(true);
      setEmail("");
      setConsent(false);
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error?.message && error.message !== "Subscription failed"
        ? error.message
        : "Something went wrong. Please try again.");
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white selection:bg-primary selection:text-white">
      <Navbar />

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
      <section className="min-h-[80vh] flex items-center pt-40 pb-32 px-6 bg-[#0A0A0A]">
        <div className="max-w-3xl mx-auto text-center space-y-8 w-full">
          <div className="space-y-4">
            <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-primary">
              Stay Informed
            </span>
            <h1 className="text-3xl md:text-5xl font-sans font-semibold uppercase tracking-tighter text-white">
              FourSix46® Intelligence
            </h1>
            <p className="text-white/50 font-light leading-relaxed">
              Subscribe to receive official press releases, venture updates, and strategic announcements directly from the FourSix46® ecosystem. No noise — only signal.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="flex flex-col gap-4 max-w-xl mx-auto pt-4 w-full text-left">
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                aria-label="Email address"
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
                {isSubscribing ? "SENDING..." : isSuccess ? <><CheckCircle2 className="w-4 h-4" /> SENT</> : "SUBSCRIBE"}
              </button>
            </div>

            {/* GDPR Consent Checkbox */}
            <div className="flex items-start gap-3 mt-2">
              <input
                type="checkbox"
                id="gdpr-consent-subscribe"
                checked={consent}
                onChange={handleConsentChange}
                className="mt-1 w-4 h-4 bg-transparent border border-white/30 rounded-sm checked:bg-primary checked:border-primary focus:ring-0 cursor-pointer shrink-0"
              />
              <label htmlFor="gdpr-consent-subscribe" className="text-[10px] text-white/50 leading-relaxed font-light uppercase tracking-widest cursor-pointer select-none">
                I agree to receive email updates and accept the <Link href="/privacy" className="text-white hover:text-primary underline underline-offset-2">Privacy Policy</Link>.
              </label>
            </div>

            {isSuccess && (
              <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-primary text-xs font-bold uppercase tracking-widest text-center mt-4">
                {successMsg}
              </motion.p>
            )}
            {errorMsg && (
              <p role="alert" className="text-red-400 text-xs font-bold uppercase tracking-widest text-center mt-4">
                {errorMsg}
              </p>
            )}
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}
