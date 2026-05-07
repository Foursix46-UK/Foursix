"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import MagneticButton from "@/components/ui/MagneticButton";
import ReactMarkdown from "react-markdown";

// 👇 FIX: Accepts serverFaqs as a prop
interface FaqSectionProps {
  data?: { faqLabel?: string; faqTitle?: string; faqCtaText?: string; };
  serverFaqs?: FAQ[]; 
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  displayOrder: number;
  featuredOnHome: boolean;
  status: string; 
  displayLocation: string; 
}

const AccordionItem = ({ question, answer, isOpen, onClick }: { 
  question: string; answer: string; isOpen: boolean; onClick: () => void 
}) => {
  return (
    <div className="border-b border-white/10">
      <button onClick={onClick} className="w-full py-8 flex items-center justify-between text-left group">
        <span className="text-lg md:text-xl font-sans font-medium tracking-tight text-white transition-colors group-hover:text-primary">
          {question}
        </span>
        <motion.div animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.4 }} className="ml-4 flex-shrink-0">
          <Plus className={cn("w-6 h-6 transition-colors", isOpen ? "text-primary" : "text-white/40")} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5 }} className="overflow-hidden">
            <div className="pb-8 pr-12 text-base md:text-lg font-light text-white/60 leading-relaxed font-sans prose prose-invert max-w-none">
              <ReactMarkdown>{answer}</ReactMarkdown>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function FaqSection({ data, serverFaqs = [] }: FaqSectionProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("");

  // Set initial category safely from the server data
  useEffect(() => {
    if (serverFaqs.length > 0 && !activeCategory) {
      const firstCategory = Array.from(new Set(serverFaqs.map(f => f.category)))[0];
      setActiveCategory(firstCategory);
    }
  }, [serverFaqs, activeCategory]);

  const activeCategories = useMemo(() => Array.from(new Set(serverFaqs.map(f => f.category))), [serverFaqs]);
  const displayFaqs = useMemo(() => serverFaqs.filter(f => f.category === activeCategory), [serverFaqs, activeCategory]);

  return (
    <section className="py-20 px-6 bg-black">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <motion.span initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary mb-6 block">
            {data?.faqLabel || "Intelligence"}
          </motion.span>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-sans font-bold uppercase tracking-tighter leading-none text-white whitespace-pre-wrap">
            {data?.faqTitle || "STRATEGIC CLARITY"}
          </motion.h2>
        </div>

        {/* 👇 FIX: Loading state removed completely. Data is instantly here! */}
        <>
          {activeCategories.length > 0 && (
            <div className="mb-12 border-b border-white/5 pb-8">
              <div className="flex flex-wrap justify-start md:justify-center gap-3 md:gap-6">
                {activeCategories.map((cat) => (
                  <button key={cat} onClick={() => { setActiveCategory(cat); setOpenId(null); }} className={cn("relative px-4 py-2 md:px-0 md:py-2 rounded-full md:rounded-none transition-all duration-300", activeCategory === cat ? "bg-white/10 md:bg-transparent text-white opacity-100" : "bg-white/5 md:bg-transparent text-white/40 opacity-50 hover:opacity-80")}>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{cat}</span>
                    {activeCategory === cat && <motion.div layoutId="homeFaqActiveUnderline" className="absolute -bottom-[2px] md:-bottom-[9px] left-2 right-2 md:left-0 md:right-0 h-0.5 bg-primary" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-12 min-h-[300px]">
            <AnimatePresence mode="wait">
              <motion.div key={activeCategory} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.5 }}>
                {displayFaqs.map((faq) => (
                  <AccordionItem key={faq.id} question={faq.question} answer={faq.answer} isOpen={openId === faq.id} onClick={() => setOpenId(openId === faq.id ? null : faq.id)} />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </>

        <div className="mt-12 flex justify-center">
          <MagneticButton href="/faq">
            {data?.faqCtaText || "Read All FAQs"} <ArrowRight className="w-4 h-4 ml-2" />
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}