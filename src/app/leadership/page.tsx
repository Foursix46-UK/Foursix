
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Linkedin, ArrowRight, X } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

interface Leader {
  id: string;
  fullName: string;
  role: string;
  shortBio: string;
  longBio: string;
  profilePhoto: string;
  linkedInUrl: string;
  order: number;
  active: boolean;
  featured: boolean;
}

const leadershipData: Leader[] = [
  {
    id: "julian-thorne",
    fullName: "Julian Thorne",
    role: "Chief Executive & Founder",
    shortBio: "Orchestrating cross-border logistics and scaling multi-venture operations for the holding group.",
    longBio: "With over two decades of experience in global strategic allocation and industrial design, Julian founded FourSix46 to bridge the gap between functional excellence and aesthetic purity. Under his leadership, the collective has grown into a sovereign network of disruptive ventures spanning aerospace, architecture, and decentralized compute. His philosophy of 'Quiet Luxury' drives every strategic node in the FourSix46 ecosystem.",
    profilePhoto: "team-1",
    linkedInUrl: "https://linkedin.com/in/j-thorne",
    order: 1,
    active: true,
    featured: true,
  },
  {
    id: "alara-vane",
    fullName: "Alara Vane",
    role: "Creative Principal",
    shortBio: "Defining brand narratives that balance aesthetic purity with structural honesty.",
    longBio: "Alara leads the visual and narrative direction for the entire FourSix46 portfolio. Her work at M-Studio has redefined neo-brutalism for a new generation of luxury seekers. She believes that the most impactful brands are those that communicate through clarity, precision, and structural truth rather than superficial noise.",
    profilePhoto: "team-1",
    linkedInUrl: "https://linkedin.com/in/a-vane",
    order: 2,
    active: true,
    featured: true,
  },
  {
    id: "marcus-key",
    fullName: "Marcus Key",
    role: "Global Operations Lead",
    shortBio: "Driving biophilic integration and sovereign infrastructure across our global portfolio.",
    longBio: "Marcus oversees the logistical complexity of FourSix46's global footprint. From the deployment of Nexus Core nodes to the architectural oversight of Rastlina's vertical forests, he ensures that the holding company's vision is executed with absolute precision. His focus is on long-term sustainability and the operational resilience of our multi-venture synergy.",
    profilePhoto: "team-1",
    linkedInUrl: "https://linkedin.com/in/m-key",
    order: 3,
    active: true,
    featured: true,
  },
  {
    id: "elena-volkov",
    fullName: "Dr. Elena Volkov",
    role: "Strategy Principal",
    shortBio: "Leading R&D for orbital mobility and next-generation propulsion systems.",
    longBio: "Dr. Volkov brings a deep scientific background to the FourSix46 leadership team. As the strategic mind behind Vyoma's aerospace advancements, she explores the frontiers of kinetic motion and orbital-scale logistics. Her research-driven approach ensures that our ventures remain at the absolute edge of technological possibility.",
    profilePhoto: "team-1",
    linkedInUrl: "https://linkedin.com/in/e-volkov",
    order: 4,
    active: true,
    featured: true,
  }
];

export default function LeadershipPage() {
  const activeLeaders = leadershipData
    .filter((l) => l.active)
    .sort((a, b) => a.order - b.order);

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white selection:bg-primary font-sans overflow-x-hidden">
      <Navbar />

      <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="mb-24">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary mb-6 block"
          >
            Visionary Core
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-sans font-medium tracking-tighter text-white uppercase leading-none mb-8"
          >
            Leadership<br />& Visionaries
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white/40 max-w-2xl font-light leading-relaxed tracking-tight"
          >
            Meet the strategic architects driving the FourSix46 collective. 
            A multi-disciplinary team committed to structural integrity, 
            aesthetic purity, and global impact.
          </motion.p>
        </header>

        {/* Leadership Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12 lg:gap-16">
          {activeLeaders.map((leader, idx) => {
            const leaderImg = PlaceHolderImages.find(img => img.id === leader.profilePhoto);
            return (
              <motion.div
                key={leader.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                className="group relative"
              >
                <div className="flex flex-col md:flex-row items-start gap-8 p-8 md:p-10 bg-white/5 border border-white/10 rounded-3xl transition-all duration-500 hover:border-white/20 hover:bg-white/[0.07] h-full">
                  {/* Photo Section */}
                  <div className="relative w-full md:w-48 h-64 md:h-64 flex-shrink-0 grayscale group-hover:grayscale-0 transition-all duration-700 overflow-hidden rounded-2xl">
                    {leaderImg && (
                      <Image
                        src={leaderImg.imageUrl}
                        alt={leader.fullName}
                        fill
                        className="object-cover"
                        data-ai-hint={leaderImg.imageHint}
                      />
                    )}
                    <div className="absolute inset-0 bg-black/20" />
                  </div>

                  {/* Info Section */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-3xl font-bold uppercase tracking-tight text-white mb-2 group-hover:text-primary transition-colors">
                        {leader.fullName}
                      </h3>
                      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-6">
                        {leader.role}
                      </p>
                      <p className="text-sm text-white/50 leading-relaxed font-light mb-8 line-clamp-3">
                        {leader.shortBio}
                      </p>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="flex items-center gap-3 font-sans text-[10px] font-bold uppercase tracking-widest text-white hover:text-primary transition-colors group/btn w-fit">
                          <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover/btn:border-primary transition-colors">
                            <Plus className="w-3 h-3" />
                          </div>
                          Read Full Profile
                        </button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl bg-[#0A0A0A] border-white/10 p-0 overflow-hidden rounded-3xl">
                        <div className="grid grid-cols-1 md:grid-cols-2">
                          {/* Modal Image */}
                          <div className="relative h-[400px] md:h-full bg-surface">
                            {leaderImg && (
                              <Image
                                src={leaderImg.imageUrl}
                                alt={leader.fullName}
                                fill
                                className="object-cover"
                              />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                          </div>

                          {/* Modal Content */}
                          <div className="p-8 md:p-16 flex flex-col justify-center bg-[#0A0A0A]">
                            <DialogHeader className="mb-10 text-left">
                              <DialogTitle className="text-4xl font-bold uppercase tracking-tight text-white mb-2">
                                {leader.fullName}
                              </DialogTitle>
                              <DialogDescription className="text-xs font-bold uppercase tracking-[0.3em] text-primary opacity-100">
                                {leader.role}
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="space-y-6 mb-12">
                              <p className="text-lg text-white/80 font-light leading-relaxed font-sans">
                                {leader.longBio}
                              </p>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-8 border-t border-white/5 pt-10">
                              <a 
                                href={leader.linkedInUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-[#0077B5] transition-colors"
                              >
                                <Linkedin className="w-4 h-4" /> Professional Profile
                              </a>
                              <div className="hidden sm:block w-px h-4 bg-white/10" />
                              <div className="text-[10px] font-bold uppercase tracking-widest text-white/20">
                                FourSix46 Corporate
                              </div>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Strategic Closure Section */}
        <section className="mt-48 py-24 border-t border-white/5 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto space-y-12"
          >
            <h2 className="text-3xl md:text-5xl font-sans font-medium uppercase tracking-tighter text-white">
              Institutional Relations
            </h2>
            <p className="text-xl text-white/40 font-light leading-relaxed">
              Our leadership team actively engages with institutional partners and 
              strategic investors to identify new frontier opportunities. 
              Initiate a dialogue with our executive office.
            </p>
            <div className="pt-6">
              <Button 
                asChild
                className="h-16 px-12 rounded-full font-sans text-xs font-bold uppercase tracking-[0.2em] bg-primary hover:bg-primary/90 text-white"
              >
                <a href="/contact">
                  Connect with Leadership <ArrowRight className="ml-2 w-4 h-4" />
                </a>
              </Button>
            </div>
          </motion.div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
