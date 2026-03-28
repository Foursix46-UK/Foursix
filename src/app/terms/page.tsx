"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import ReactMarkdown from 'react-markdown';

// --- FIREBASE IMPORTS ---
import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function TermsPage() {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLegalData() {
      try {
        const q = query(collection(db, "page_legal"), limit(1));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          // 👇 THIS IS THE CRITICAL CHANGE FOR THIS PAGE 👇
          setContent(snapshot.docs[0].data().termsOfUse || "Content coming soon.");
        }
      } catch (error) {
        console.error("Error fetching legal data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchLegalData();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white selection:bg-primary selection:text-white font-sans tracking-tight">
      <Navbar />
      
      <div className="pt-40 pb-32 px-6 max-w-4xl mx-auto min-h-[70vh]">
        <motion.header 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-20 border-b border-white/10 pb-12"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary mb-6 block">
            Legal
          </span>
          {/* 👇 AND THIS HEADING 👇 */}
          <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter">
            Terms of Service
          </h1>
        </motion.header>

        {isLoading ? (
           <div className="animate-pulse text-white/40 text-xs tracking-widest uppercase">Loading Document...</div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="prose prose-invert prose-p:text-white/60 prose-h1:text-white prose-h2:text-white prose-h2:font-medium prose-h2:uppercase prose-h2:tracking-tight prose-a:text-primary max-w-none"
          >
            <ReactMarkdown>{content}</ReactMarkdown>
          </motion.div>
        )}
      </div>

      <Footer />
    </main>
  );
}