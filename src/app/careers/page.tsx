"use client";

import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, MapPin, Briefcase } from "lucide-react";

const jobs = [
  {
    id: "job-1",
    title: "Global Operations Manager",
    location: "London, UK",
    type: "Full-Time",
    description: "Orchestrating cross-border logistics and strategic node expansion for the FourSix46 holding group.",
  },
  {
    id: "job-2",
    title: "Lead Next.js Developer",
    location: "Remote / New York",
    type: "Contract",
    description: "Building the digital infrastructure for our portfolio ventures using cutting-edge React patterns and performant architecture.",
  },
  {
    id: "job-3",
    title: "Creative Strategist",
    location: "Tokyo, JP",
    type: "Full-Time",
    description: "Defining brand narratives that balance quiet luxury with neo-brutalist honesty across global media channels.",
  },
  {
    id: "job-4",
    title: "Biophilic Design Lead",
    location: "Dubai, UAE",
    type: "Full-Time",
    description: "Leading architectural research for Rastlina, integrating complex biological systems into high-density urban environments.",
  },
];

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-24">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-code uppercase tracking-[0.4em] text-primary mb-6 block"
          >
            Join the Collective
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-7xl md:text-9xl font-headline font-black uppercase tracking-tighter leading-none"
          >
            HUMAN<br />
            <span className="text-muted">CAPITAL</span>
          </motion.h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-32">
          {/* Culture & Values Section */}
          <section className="lg:col-span-5 space-y-12">
            <div>
              <h2 className="text-2xl font-black uppercase mb-6 border-l-4 border-primary pl-6">Culture & Values</h2>
              <p className="text-xl text-muted leading-relaxed font-light">
                At FourSix46, we operate at the precise intersection of aesthetic purity and structural clarity. 
                Our collective is built on the principle of "Quiet Luxury" — excellence that doesn't need to shout.
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-8">
              <div className="p-8 bg-surface border border-border rounded-xl">
                <h3 className="text-lg font-black uppercase mb-2">Radical Honesty</h3>
                <p className="text-sm text-muted">We value functional excellence and raw structural truth over superficial polish.</p>
              </div>
              <div className="p-8 bg-surface border border-border rounded-xl">
                <h3 className="text-lg font-black uppercase mb-2">Quiet Synergy</h3>
                <p className="text-sm text-muted">A deep-seated belief that the most impactful work happens through cross-disciplinary collaboration.</p>
              </div>
            </div>
          </section>

          {/* Job Openings Section */}
          <section className="lg:col-span-7">
            <h2 className="text-2xl font-black uppercase mb-12 flex items-center gap-4">
              Open Positions <span className="text-sm font-code text-muted font-normal">({jobs.length})</span>
            </h2>
            
            <Accordion type="single" collapsible className="w-full space-y-4">
              {jobs.map((job) => (
                <AccordionItem 
                  key={job.id} 
                  value={job.id}
                  className="bg-surface border border-border rounded-xl overflow-hidden px-6"
                >
                  <AccordionTrigger className="hover:no-underline py-8 group">
                    <div className="flex flex-col md:flex-row md:items-center justify-between w-full text-left gap-4 pr-6">
                      <div className="space-y-1">
                        <h3 className="text-2xl font-black uppercase group-hover:text-primary transition-colors">
                          {job.title}
                        </h3>
                        <div className="flex items-center gap-4 text-xs font-code text-muted">
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                          <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {job.type}</span>
                        </div>
                      </div>
                      <div className="hidden md:block">
                        <ArrowUpRight className="w-6 h-6 text-muted group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-8 pt-2">
                    <div className="space-y-6 max-w-2xl">
                      <p className="text-muted leading-relaxed">
                        {job.description}
                      </p>
                      <Button 
                        className="bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest px-8 h-12 rounded-none"
                        style={{ backgroundColor: '#E31837' }}
                      >
                        Apply Now
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
