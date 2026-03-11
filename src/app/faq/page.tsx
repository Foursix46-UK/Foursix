
"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { faqData } from "@/lib/faq-data";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";

const categories = [
  "All",
  "About FourSix46",
  "Ventures & Business Model",
  "Partnerships",
  "Investment & Growth",
];

const AccordionItem = ({ question, answer, isOpen, onClick }: { 
  question: string; 
  answer: string; 
  isOpen: boolean; 
  onClick: () => void 
}) => {
  return (
    <div className="border-b border-white/10">
      <button
        onClick={onClick}
        className="w-full py-8 flex items-center justify-between text-left group"
      >
        <span className="text-xl md:text-2xl font-sans font-medium tracking-tight text-white transition-colors group-hover:text-primary">
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="ml-4 flex-shrink-0"
        >
          <Plus className={cn("w-6 h-6 transition-colors", isOpen ? "text-primary" : "text-white/40")} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-12 pr-12">
              <p className="text-lg md:text-xl font-light text-white/60 leading-relaxed font-sans max-w-3xl">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [openId, setOpenId] = useState<string | null>(null);

  const filteredFaqs = useMemo(() => {
    let result = faqData;
    if (activeCategory !== "All") {
      result = faqData.filter((faq) => faq.category === activeCategory);
    }
    return result.sort((a, b) => a.displayOrder - b.displayOrder);
  }, [activeCategory]);

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white selection:bg-primary font-sans">
      <Navbar />

      <div className="pt-32 pb-24 px-6 max-w-5xl mx-auto">
        {/* Header Section */}
        <header className="mb-20 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary mb-6 block"
          >
            Frequently Asked Questions
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-sans font-medium tracking-tighter text-white uppercase leading-none mb-8"
          >
            STRATEGIC CLARITY
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white/40 max-w-2xl mx-auto font-light leading-relaxed tracking-tight"
          >
            Find comprehensive answers regarding our operational philosophy, 
            venture scaling, and partnership opportunities.
          </motion.p>
        </header>

        {/* Category Filter */}
        <div className="mb-16 border-b border-white/5 pb-12">
          <div className="flex flex-col w-full md:w-auto md:flex-row flex-wrap justify-center gap-2 md:gap-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setOpenId(null);
                }}
                className={cn(
                  "relative px-6 py-4 md:py-3 rounded-xl border transition-all duration-300 text-[10px] font-bold uppercase tracking-[0.2em] w-full md:w-auto text-left md:text-center",
                  activeCategory === cat 
                    ? "bg-[#171717] text-white border-primary shadow-[inset_0_-2px_0_0_#E31837]" 
                    : "bg-transparent text-white/40 border-white/10 hover:border-white/30"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ List */}
        <div className="min-h-[600px] mb-32">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq) => (
                  <AccordionItem
                    key={faq.id}
                    question={faq.question}
                    answer={faq.answer}
                    isOpen={openId === faq.id}
                    onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                  />
                ))
              ) : (
                <div className="py-20 text-center">
                  <p className="text-white/20 uppercase tracking-widest font-bold text-xs">No entries found in this category.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Closure Section */}
        <section className="py-24 border-t border-white/5 text-center">
          <h2 className="text-2xl md:text-4xl font-sans font-medium uppercase tracking-tighter text-white mb-6">
            Still have questions?
          </h2>
          <p className="text-white/40 font-light leading-relaxed mb-12">
            Our strategic relations team is available for deep-dive discussions 
            regarding institutional investment and partnership synergy.
          </p>
          <div className="flex justify-center">
            <a 
              href="/contact"
              className="px-12 py-5 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-[10px] uppercase tracking-[0.3em] transition-all"
            >
              Initiate Dialogue
            </a>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
