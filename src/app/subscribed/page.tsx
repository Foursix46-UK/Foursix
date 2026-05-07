"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";

export const dynamic = 'force-dynamic';
export default function SubscribedPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-primary selection:text-white font-sans tracking-tight flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center pt-32 pb-20 px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-xl w-full bg-[#0A0A0A] border border-white/10 p-12 text-center"
        >
          <CheckCircle className="w-16 h-16 text-primary mx-auto mb-6" />
          
          <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tighter mb-4 text-white">
            Subscription Confirmed
          </h1>
          
          <p className="text-white/60 font-light leading-relaxed mb-8">
            Thank you for joining the FourSix46 Intelligence Network. Your email address has been verified, and you will now receive our latest updates and announcements.
          </p>
          
          <Link 
            href="/"
            className="inline-flex h-12 px-8 items-center justify-center bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-colors"
          >
            Return to Homepage
          </Link>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}