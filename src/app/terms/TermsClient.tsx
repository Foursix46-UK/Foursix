"use client";

import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import ReactMarkdown from 'react-markdown';

export default function TermsClient({ initialContent }: { initialContent: string }) {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-primary selection:text-white font-sans tracking-tight">
      <Navbar />
      <div className="pt-40 pb-32 px-6 max-w-4xl mx-auto min-h-[70vh]">
        <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-20 border-b border-white/10 pb-12">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary mb-6 block">Legal</span>
          <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter">Terms of Service</h1>
        </motion.header>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="prose prose-invert prose-p:text-white/60 prose-h1:text-white prose-h2:text-white prose-h2:font-medium prose-h2:uppercase prose-h2:tracking-tight prose-a:text-primary max-w-none">
          <ReactMarkdown>{initialContent}</ReactMarkdown>
        </motion.div>
      </div>
      <Footer />
    </main>
  );
}