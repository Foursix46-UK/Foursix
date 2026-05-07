"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  displayOrder: number;
  status: string;
}

const AccordionItem = ({ question, answer, isOpen, onClick }: { 
  question: string; answer: string; isOpen: boolean; onClick: () => void 
}) => {
  return (
    <div className="border-b border-white/10">
      <button onClick={onClick} className="w-full py-8 flex items-center justify-between text-left group">
        <span className="text-xl md:text-2xl font-sans font-medium tracking-tight text-white transition-colors group-hover:text-primary">
          {question}
        </span>
        <motion.div animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.4 }} className="ml-4 flex-shrink-0">
          <Plus className={cn("w-6 h-6 transition-colors", isOpen ? "text-primary" : "text-white/40")} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5 }} className="overflow-hidden">
            <div className="pb-12 pr-12 text-lg md:text-xl font-light text-white/60 leading-relaxed font-sans max-w-3xl prose prose-invert">
              <ReactMarkdown>{answer}</ReactMarkdown>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function FAQClient({ initialFaqs }: { initialFaqs: FAQ[] }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [openId, setOpenId] = useState<string | null>(null);
  
  // No more fetching here! We use the props from the server.
  const dynamicCategories = useMemo(() => {
    const unique = Array.from(new Set(initialFaqs.map(f => f.category)));
    return ["All", ...unique];
  }, [initialFaqs]);

const filteredFaqs = useMemo(() => {
  let list = initialFaqs;
  
  // 1. First, make sure we show the active category
  if (activeCategory !== "All") {
    list = list.filter((faq) => faq.category === activeCategory);
  }
  
  return list;
}, [activeCategory, initialFaqs]);

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white selection:bg-primary font-sans">
      <Navbar />
      <div className="pt-32 pb-24 px-6 max-w-5xl mx-auto">
        <header className="mb-20 text-center">
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary mb-6 block">
            Frequently Asked Questions
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl font-sans font-medium tracking-tighter text-white uppercase leading-none mb-8">
            STRATEGIC CLARITY
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-lg text-white/40 max-w-2xl mx-auto font-light leading-relaxed tracking-tight">
            Find comprehensive answers regarding our operational philosophy, venture scaling, and partnership opportunities.
          </motion.p>
        </header>

        <div className="mb-16 border-b border-white/5 pb-12">
          <div className="flex flex-col w-full md:w-auto md:flex-row flex-wrap justify-center gap-2 md:gap-4">
            {dynamicCategories.map((cat) => (
              <button key={cat} onClick={() => { setActiveCategory(cat); setOpenId(null); }} className={cn("relative px-6 py-4 md:py-3 rounded-xl border transition-all duration-300 text-[10px] font-bold uppercase tracking-[0.2em] w-full md:w-auto text-left md:text-center", activeCategory === cat ? "bg-[#171717] text-white border-primary shadow-[inset_0_-2px_0_0_#E31837]" : "bg-transparent text-white/40 border-white/10 hover:border-white/30")}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-[600px] mb-32">
          <AnimatePresence mode="popLayout">
            <motion.div key={activeCategory} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq) => (
                  <AccordionItem key={faq.id} question={faq.question} answer={faq.answer} isOpen={openId === faq.id} onClick={() => setOpenId(openId === faq.id ? null : faq.id)} />
                ))
              ) : (
                <div className="py-20 text-center">
                  <p className="text-white/20 uppercase tracking-widest font-bold text-xs">No entries found.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <section className="py-24 border-t border-white/5 text-center">
          <h2 className="text-2xl md:text-4xl font-sans font-medium uppercase tracking-tighter text-white mb-6">Still have questions?</h2>
          <p className="text-white/40 font-light leading-relaxed mb-12">Our strategic relations team is available for deep-dive discussions.</p>
          <div className="flex justify-center">
            <Link href="/contact" className="px-6 sm:px-12 py-4 sm:py-5 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-[0.3em] transition-all whitespace-nowrap">
              Initiate Dialogue
            </Link>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}