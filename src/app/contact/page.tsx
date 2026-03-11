
"use client";

import React from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MagneticButton from "@/components/ui/MagneticButton";
import { Mail, Phone, MapPin, ArrowRight, ShieldCheck } from "lucide-react";

const hubs = [
  {
    city: "London",
    role: "Global Headquarters",
    address: "Level 46, The Shard, 32 London Bridge St, London SE1 9SG",
  },
  {
    city: "New York",
    role: "Venture Capital & Media Hub",
    address: "250 Vesey St, New York, NY 10281, United States",
  },
  {
    city: "Tokyo",
    role: "Biophilic Systems Research",
    address: "1-5-1 Marunouchi, Chiyoda City, Tokyo 100-6510, Japan",
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-primary selection:text-white font-sans tracking-tight">
      <Navbar />

      <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary mb-6 block"
          >
            Engagement
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold uppercase tracking-tighter leading-none"
          >
            CONTACT
          </motion.h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          {/* Inquiry Form Column */}
          <section className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 backdrop-blur-md shadow-2xl"
            >
              <div className="mb-10">
                <h2 className="text-2xl font-bold uppercase tracking-tight mb-2">Inquiry Form</h2>
                <p className="text-sm text-white/40 font-light">
                  Please provide the details of your request. Our strategic relations team will review and respond within 24 hours.
                </p>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/60 ml-1">Full Name</label>
                    <Input 
                      placeholder="JULIAN THORNE" 
                      className="bg-black/40 border-white/10 h-14 rounded-xl focus:ring-primary focus:border-primary text-xs tracking-widest"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/60 ml-1">Email Address</label>
                    <Input 
                      type="email"
                      placeholder="THORNE@FOURSIX46.COM" 
                      className="bg-black/40 border-white/10 h-14 rounded-xl focus:ring-primary focus:border-primary text-xs tracking-widest"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/60 ml-1">Company / Organization</label>
                    <Input 
                      placeholder="VENTURE PARTNERS" 
                      className="bg-black/40 border-white/10 h-14 rounded-xl focus:ring-primary focus:border-primary text-xs tracking-widest"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/60 ml-1">Nature of Inquiry</label>
                    <Select>
                      <SelectTrigger className="bg-black/40 border-white/10 h-14 rounded-xl focus:ring-primary text-xs tracking-widest">
                        <SelectValue placeholder="SELECT CATEGORY" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#111] border-white/10 text-white">
                        <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                        <SelectItem value="investment">Investment Inquiry</SelectItem>
                        <SelectItem value="media">Media Inquiry</SelectItem>
                        <SelectItem value="careers">Career / Talent Inquiry</SelectItem>
                        <SelectItem value="general">General Question</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/60 ml-1">Message</label>
                  <Textarea 
                    placeholder="HOW CAN WE ASSIST YOUR VENTURE?" 
                    className="bg-black/40 border-white/10 min-h-[160px] rounded-2xl focus:ring-primary focus:border-primary p-6 text-xs tracking-widest leading-relaxed"
                  />
                </div>

                <div className="pt-4">
                  <MagneticButton 
                    className="w-full md:w-auto h-16 px-12 rounded-full"
                    variant="blue"
                  >
                    <span className="flex items-center justify-center gap-3">
                      SEND INQUIRY <ArrowRight className="w-4 h-4" />
                    </span>
                  </MagneticButton>
                </div>
              </form>
            </motion.div>

            {/* Investor Note Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 p-6 bg-primary/5 border border-primary/20 rounded-2xl flex items-start gap-4"
            >
              <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-white/60 leading-relaxed font-light">
                <span className="text-white font-bold">Institutional Note:</span> For institutional investment inquiries, please select <span className="text-primary font-bold">'Investment'</span> in the form or contact our strategic relations lead directly at <span className="text-white font-bold">capital@foursix46.com</span>.
              </p>
            </motion.div>
          </section>

          {/* Strategic Info Column */}
          <section className="lg:col-span-5 space-y-12">
            {/* Direct Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest mb-6 border-l-2 border-primary pl-4">Direct Communication</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-colors group-hover:border-primary">
                      <Mail className="w-4 h-4 text-white/40 transition-colors group-hover:text-primary" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase text-white/30 tracking-widest">Email Address</p>
                      <p className="text-sm font-bold uppercase tracking-widest">hello@foursix46.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-colors group-hover:border-primary">
                      <Phone className="w-4 h-4 text-white/40 transition-colors group-hover:text-primary" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase text-white/30 tracking-widest">Telephone</p>
                      <p className="text-sm font-bold uppercase tracking-widest">+44 (0) 20 7946 0123</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Strategic Hubs */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest mb-6 border-l-2 border-primary pl-4">Strategic Hubs</h3>
                <div className="space-y-6">
                  {hubs.map((hub, idx) => (
                    <div key={idx} className="p-6 bg-white/5 border border-white/5 rounded-2xl hover:border-white/10 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-lg font-bold uppercase tracking-tight">{hub.city}</h4>
                        <MapPin className="w-3 h-3 text-primary" />
                      </div>
                      <p className="text-[8px] font-black uppercase tracking-[0.3em] text-primary mb-3">{hub.role}</p>
                      <p className="text-[11px] text-white/50 leading-relaxed font-light font-sans uppercase">
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
