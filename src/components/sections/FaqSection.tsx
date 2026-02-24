"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  "About FourSix46",
  "Ventures & Business Model",
  "Partnerships",
  "Investment & Growth",
];

const faqs = [
  {
    id: "faq-1",
    category: "About FourSix46",
    question: "What defines the FourSix46 collective?",
    answer: "FourSix46 is a premium multi-brand holding company that operates at the intersection of structural honesty and aesthetic purity. We identify and scale ventures that redefine high-density urbanism, orbital mobility, and sovereign infrastructure.",
  },
  {
    id: "faq-2",
    category: "About FourSix46",
    question: "Where is the House of Multibrands headquartered?",
    answer: "Our global operations are anchored in London, with strategic nodes in New York, Tokyo, Dubai, and Singapore, allowing us to manage a diverse international portfolio of disruptive brands.",
  },
  {
    id: "faq-3",
    category: "Ventures & Business Model",
    question: "How does FourSix46 select its portfolio ventures?",
    answer: "We look for 'frontier' technologies—ventures that solve fundamental structural problems with high-end design. Our focus is on long-term value creation through biophilic architecture, next-gen propulsion, and decentralized compute.",
  },
  {
    id: "faq-4",
    category: "Ventures & Business Model",
    question: "What is the 'Quiet Luxury' approach to engineering?",
    answer: "Quiet Luxury in engineering means excellence that is felt, not shouted. It is the pursuit of functional perfection where every component serves a purpose, housed in a design that respects the user and the environment.",
  },
  {
    id: "faq-5",
    category: "Partnerships",
    question: "How can my company collaborate with the collective?",
    answer: "We engage in strategic alliances that offer deep ecosystem integration. We look for partners who share our commitment to radical honesty and structural innovation. Inquiries can be initiated through our Dialogue portal.",
  },
  {
    id: "faq-6",
    category: "Partnerships",
    question: "Do you offer white-label design services through M-Studio?",
    answer: "M-Studio primarily serves as the internal design laboratory for our ventures, but we occasionally partner with external organizations that align with our neo-brutalist aesthetic and strategic vision.",
  },
  {
    id: "faq-7",
    category: "Investment & Growth",
    question: "What is your typical investment horizon?",
    answer: "We are not traditional venture capitalists; we are builders. Our horizon is generational. We invest in foundational infrastructure that will support the next century of human activity.",
  },
  {
    id: "faq-8",
    category: "Investment & Growth",
    question: "How does FourSix46 manage risk across diverse sectors?",
    answer: "Risk is mitigated through venture synergy. While our industries are diverse (aerospace, architecture, data), they all rely on the same core principles of decentralized infrastructure and structural integrity, creating a resilient, unified ecosystem.",
  },
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
        <span className="text-lg md:text-xl font-sans font-medium tracking-tight text-white transition-colors group-hover:text-primary">
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
            <div className="pb-8 pr-12">
              <p className="text-base md:text-lg font-light text-white/60 leading-relaxed font-sans">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function FaqSection() {
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [openId, setOpenId] = useState<string | null>(null);

  const filteredFaqs = faqs.filter((faq) => faq.category === activeCategory);

  return (
    <section className="py-32 px-6 bg-black">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary mb-6 block"
          >
            Intelligence
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-sans font-bold uppercase tracking-tighter leading-none text-white"
          >
            STRATEGIC CLARITY
          </motion.h2>
        </div>

        {/* Category Filter */}
        <div className="mb-16 overflow-x-auto no-scrollbar pb-4 border-b border-white/5">
          <div className="flex items-center gap-10 min-w-max">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setOpenId(null);
                }}
                className="relative py-2 group"
              >
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300",
                  activeCategory === cat ? "text-white opacity-100" : "text-white/40 opacity-50 hover:opacity-80"
                )}>
                  {cat}
                </span>
                {activeCategory === cat && (
                  <motion.div
                    layoutId="activeUnderline"
                    className="absolute -bottom-[5px] left-0 right-0 h-0.5 bg-primary"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ List */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {filteredFaqs.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openId === faq.id}
                  onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
