"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, MapPin, ArrowRight, ShieldCheck, Briefcase, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// --- FIREBASE IMPORTS ---
import { collection, addDoc, serverTimestamp, getDocs, query, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

const defaultHubs = [
  { city: "London", role: "Global Headquarters", address: "66 Paul Street, London, EC2A 4NA, United Kingdom" },
  { city: "New York", role: "Venture Capital & Media Hub", address: "250 Vesey St, New York, NY 10281, United States" },
  { city: "Tokyo", role: "Biophilic Systems Research", address: "1-5-1 Marunouchi, Chiyoda City, Tokyo 100-6510, Japan" },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "", email: "", company: "", category: "", message: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [pageData, setPageData] = useState<any>(null);

  useEffect(() => {
    async function fetchPageData() {
      try {
        const q = query(collection(db, "page_contact"), limit(1));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) setPageData(snapshot.docs[0].data());
      } catch (error) {
        console.error("Error fetching contact page data:", error);
      }
    }
    fetchPageData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleCategoryChange = (value: string) => {
    setFormData({ ...formData, category: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "contact_inquiries"), {
        ...formData,
        createdAt: serverTimestamp(),
        status: "Unread"
      });

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to send email');

      setIsSuccess(true);
      setFormData({ fullName: "", email: "", company: "", category: "", message: "" });
      
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong sending the email, but your inquiry was saved. We will be in touch.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const hubsToDisplay = pageData?.hubs || defaultHubs;

  return (
    <main className="min-h-screen bg-black text-white selection:bg-primary selection:text-white font-sans tracking-tight">
      <Navbar />

      <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <header className="mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary mb-6 block"
          >
            {pageData?.heroLabel || "Engagement"}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold uppercase tracking-tighter leading-none"
          >
            {pageData?.heroTitle || "CONTACT"}
          </motion.h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          <section className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 backdrop-blur-md shadow-2xl"
            >
              <div className="mb-10">
                <h2 className="text-2xl font-bold uppercase tracking-tight mb-2">
                  {pageData?.formTitle || "Inquiry Form"}
                </h2>
                <p className="text-sm text-white/40 font-light whitespace-pre-wrap">
                  {pageData?.formSubtitle || "Please provide the details of your request. Our strategic relations team will review and respond within 24 hours."}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="text-[10px] font-bold uppercase tracking-widest text-white/60 ml-1">Full Name</label>
                    <Input 
                      id="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      placeholder="Julian Thorne" 
                      className="bg-black/40 border-white/10 h-14 rounded-xl focus:ring-primary focus:border-primary text-xs tracking-widest"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-white/60 ml-1">Email Address</label>
                    <Input 
                      id="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      type="email"
                      placeholder="thorne@foursix46.com" 
                      className="bg-black/40 border-white/10 h-14 rounded-xl focus:ring-primary focus:border-primary text-xs tracking-widest"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="company" className="text-[10px] font-bold uppercase tracking-widest text-white/60 ml-1">Company / Organization</label>
                    <Input 
                      id="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Venture Partners" 
                      className="bg-black/40 border-white/10 h-14 rounded-xl focus:ring-primary focus:border-primary text-xs tracking-widest"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="category" className="text-[10px] font-bold uppercase tracking-widest text-white/60 ml-1">Nature of Inquiry</label>
                    <Select required value={formData.category} onValueChange={handleCategoryChange}>
                      <SelectTrigger id="category" className="bg-black/40 border-white/10 h-14 rounded-xl focus:ring-primary text-xs tracking-widest">
                        <SelectValue placeholder="SELECT CATEGORY" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#111] border-white/10 text-white">
                        <SelectItem value="Partnership Opportunity">Partnership Opportunity</SelectItem>
                        <SelectItem value="Investment Inquiry">Investment Inquiry</SelectItem>
                        <SelectItem value="Media Inquiry">Media Inquiry</SelectItem>
                        <SelectItem value="Career / Talent Inquiry">Career / Talent Inquiry</SelectItem>
                        <SelectItem value="General Question">General Question</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-[10px] font-bold uppercase tracking-widest text-white/60 ml-1">Message</label>
                  <Textarea 
                    id="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    placeholder="How can we assist your venture?" 
                    className="bg-black/40 border-white/10 min-h-[160px] rounded-2xl focus:ring-primary focus:border-primary p-6 text-xs tracking-widest leading-relaxed"
                  />
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || isSuccess} 
                    className="w-full md:w-auto h-16 px-12 rounded-full font-sans text-xs font-bold uppercase tracking-widest bg-[#27A9E1] hover:bg-[#27A9E1]/90 text-white transition-all disabled:opacity-80"
                  >
                    {isSubmitting ? (
                      <span className="animate-pulse">SENDING...</span>
                    ) : isSuccess ? (
                      <span className="flex items-center gap-2">RECEIVED <CheckCircle2 className="w-4 h-4" /></span>
                    ) : (
                      <span className="flex items-center gap-2">SEND INQUIRY <ArrowRight className="w-4 h-4" /></span>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 p-6 bg-primary/5 border border-primary/20 rounded-2xl flex items-start gap-4"
            >
              <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-white/60 leading-relaxed font-light whitespace-pre-wrap">
                <span className="text-white font-bold">Institutional Note:</span> {pageData?.institutionalNote || "For institutional investment inquiries, please select 'Investment' in the form or contact our strategic relations lead directly at contact@foursix46.com."}
              </p>
            </motion.div>
          </section>

          <section className="lg:col-span-5 space-y-12">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest mb-6 border-l-2 border-primary pl-4">
                  {pageData?.directCommTitle || "Direct Communication"}
                </h3>
                <div className="space-y-6">
                  {/* General Inquiries */}
                  <a href={`mailto:${pageData?.generalEmail || "contact@foursix46.com"}`} className="flex items-center gap-4 group cursor-pointer w-fit">
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-colors group-hover:border-primary">
                      <Mail className="w-4 h-4 text-white/40 transition-colors group-hover:text-primary" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase text-white/30 tracking-widest">General Inquiries</p>
                      <p className="text-sm font-bold tracking-widest group-hover:text-primary transition-colors">{pageData?.generalEmail || "contact@foursix46.com"}</p>
                    </div>
                  </a>

                  {/* Strategic Partnerships & Investment */}
                  <a href={`mailto:${pageData?.partnersEmail || "partners@foursix46.com"}`} className="flex items-center gap-4 group cursor-pointer w-fit">
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-colors group-hover:border-secondary">
                      <Briefcase className="w-4 h-4 text-white/40 transition-colors group-hover:text-secondary" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase text-white/30 tracking-widest">Strategic Partnerships & Investment</p>
                      <p className="text-sm font-bold tracking-widest group-hover:text-secondary transition-colors">{pageData?.partnersEmail || "partners@foursix46.com"}</p>
                    </div>
                  </a>

                  {/* Press & Media */}
                  <a href={`mailto:${pageData?.pressEmail || "press@foursix46.com"}`} className="flex items-center gap-4 group cursor-pointer w-fit">
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-colors group-hover:border-primary">
                      <Mail className="w-4 h-4 text-white/40 transition-colors group-hover:text-primary" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase text-white/30 tracking-widest">Press & Media</p>
                      <p className="text-sm font-bold tracking-widest group-hover:text-primary transition-colors">{pageData?.pressEmail || "press@foursix46.com"}</p>
                    </div>
                  </a>

                  {/* Careers & Talent */}
                  <a href={`mailto:${pageData?.careersEmail || "careers@foursix46.com"}`} className="flex items-center gap-4 group cursor-pointer w-fit">
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-colors group-hover:border-primary">
                      <Briefcase className="w-4 h-4 text-white/40 transition-colors group-hover:text-primary" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase text-white/30 tracking-widest">Careers & Talent</p>
                      <p className="text-sm font-bold tracking-widest group-hover:text-primary transition-colors">{pageData?.careersEmail || "careers@foursix46.com"}</p>
                    </div>
                  </a>

                  {/* Telephone */}
                  <a href={`tel:${(pageData?.phone || "+4403301241966").replace(/\s+/g, '')}`} className="flex items-center gap-4 group cursor-pointer w-fit">
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-colors group-hover:border-primary">
                      <Phone className="w-4 h-4 text-white/40 transition-colors group-hover:text-primary" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase text-white/30 tracking-widest">Telephone</p>
                      <p className="text-sm font-bold tracking-widest group-hover:text-primary transition-colors">{pageData?.phone || "+44 0330 124 1966"}</p>
                    </div>
                  </a>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest mb-6 border-l-2 border-primary pl-4">
                  {pageData?.hubsTitle || "Strategic Hubs"}
                </h3>
                <div className="space-y-6">
                  {hubsToDisplay.map((hub: any, idx: number) => (
                    <div key={idx} className="p-6 bg-white/5 border border-white/5 rounded-2xl hover:border-white/10 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-lg font-bold uppercase tracking-tight">{hub.city}</h4>
                        <MapPin className="w-3 h-3 text-primary" />
                      </div>
                      <p className="text-[8px] font-black uppercase tracking-[0.3em] text-primary mb-3">{hub.role}</p>
                      <p className="text-[11px] text-white/50 leading-relaxed font-light font-sans uppercase whitespace-pre-wrap">
                        {hub.address}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}