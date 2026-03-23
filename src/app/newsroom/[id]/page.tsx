'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { ArrowLeft, Clock, ExternalLink, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from "@/components/ui/button";
import { getFirebaseImageUrl } from "@/lib/utils";

import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// --- FIX: EXTERNAL URL FORMATTER ---
const formatExternalUrl = (url: string) => {
  if (!url) return "#";
  return url.startsWith("http") ? url : `https://${url}`;
};

export default function NewsArticlePage() {
  const params = useParams();
  const id = params.id as string;
  const [article, setArticle] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSingleArticle() {
      if (!id) return;
      try {
        const docRef = doc(db, "news", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          const dateObj = data.publishDate?.toDate() || new Date();
          const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase();
          const paragraphs = data.bodyContent ? data.bodyContent.split('\n').filter((p: string) => p.trim() !== '') : [];

          setArticle({ ...data, date: formattedDate, contentArray: paragraphs });
        } else {
          setArticle(null);
        }
      } catch (error) {
        console.error("Error fetching article details:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSingleArticle();
  }, [id]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
         <span className="font-sans text-sm uppercase tracking-[0.3em] text-white/40 animate-pulse">Retrieving Release...</span>
      </main>
    );
  }

  if (!article) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <h1 className="text-4xl font-black uppercase mb-4 text-white">Article Not Found</h1>
        <Link href="/newsroom">
          <Button variant="outline" className="rounded-none font-sans text-xs font-semibold uppercase tracking-widest px-8 text-white">
            Back to Newsroom
          </Button>
        </Link>
      </main>
    );
  }

  const heroImageUrl = getFirebaseImageUrl(article.heroImage);
  const pdfUrl = getFirebaseImageUrl(article.pdfAttachment);

  return (
    <main className="min-h-screen bg-black text-white selection:bg-primary selection:text-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto pt-32">
        <Link href="/newsroom" className="inline-flex items-center gap-2 font-sans text-[10px] font-semibold uppercase tracking-widest text-white/70 hover:text-white transition-colors px-6 md:px-12 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
          Back to Newsroom
        </Link>
      </div>

      <header className="max-w-4xl mx-auto px-6 pt-16 text-center md:text-left">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 font-sans text-[10px] font-semibold uppercase tracking-widest text-white/50 mb-6">
            <span className="text-primary">{article.category}</span>
            <span className="w-1 h-1 bg-white/30 rounded-full" />
            <span>{article.date}</span>
            <span className="w-1 h-1 bg-white/30 rounded-full" />
            <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {article.readTime}</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-sans font-semibold uppercase tracking-tighter text-white leading-[1.1] mb-8">
            {article.title}
          </h1>

          <p className="text-xl md:text-2xl font-light text-white/70 leading-relaxed max-w-3xl">
            {article.subHeadline}
          </p>
        </motion.div>
      </header>

      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }} className="max-w-6xl mx-auto px-4 md:px-6 my-16">
        <div className="relative w-full h-[50vh] md:h-[70vh] overflow-hidden rounded-3xl border border-white/10 shadow-2xl bg-surface">
          {heroImageUrl && (
            <Image src={heroImageUrl} alt={article.title} fill className="object-cover transition-all duration-1000 ease-in-out" priority />
          )}
        </div>
      </motion.div>

      <article className="max-w-2xl mx-auto px-6 pb-32">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="space-y-10">
          
          {article.contentArray.map((paragraph: string, idx: number) => (
            <p key={idx} className="text-lg md:text-xl font-light text-white/80 leading-relaxed tracking-wide">
              {paragraph}
            </p>
          ))}

          {article.externalCoverageLinks && article.externalCoverageLinks.length > 0 && (
            <div className="pt-16 mt-16 border-t border-white/10">
              <h3 className="font-sans text-[10px] uppercase tracking-[0.3em] font-black text-white/40 mb-8">Media & Coverage</h3>
              <div className="flex flex-col gap-4">
                {/* --- FIX: FORMAT EXTERNAL URLS HERE --- */}
                {article.externalCoverageLinks.map((link: string, idx: number) => (
                  <a key={idx} href={formatExternalUrl(link)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm font-light text-primary hover:text-white transition-colors group">
                    Read External Coverage <ExternalLink className="w-3 h-3 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </a>
                ))}
              </div>
            </div>
          )}
          
          <div className="pt-20 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mt-20">
            <div className="space-y-1">
              <p className="font-sans text-[10px] uppercase tracking-widest font-black text-white">Editorial Dispatch</p>
              <p className="font-sans text-[10px] uppercase tracking-widest text-white/40 font-bold">{article.authorSource}</p>
            </div>
            
            <div className="flex items-center gap-6">
              {article.pdfAttachment && (
                <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="font-sans text-[10px] flex items-center gap-2 uppercase tracking-widest font-black hover:text-primary transition-colors text-white">
                  <Download className="w-4 h-4" /> Press Kit
                </a>
              )}
              <button onClick={() => window.print()} className="font-sans text-[10px] uppercase tracking-widest font-black hover:text-primary transition-colors text-white/70">
                Archive Page
              </button>
            </div>
          </div>
        </motion.div>
      </article>

      <Footer />
    </main>
  );
}