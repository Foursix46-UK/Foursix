
"use client";

import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, MapPin, Briefcase, Mail, Building2 } from "lucide-react";

/**
 * @fileOverview Careers Page refactored for CMS alignment.
 * Features structured job postings, venture attribution, and status filtering.
 */

interface JobPosting {
  id: string;
  title: string;
  departmentVenture: string;
  employmentType: string;
  location: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  applyUrl: string;
  status: 'Open' | 'Closed';
  postedDate: string;
  referenceCode: string;
}

const jobs: JobPosting[] = [
  {
    id: "job-1",
    title: "Global Operations Manager",
    departmentVenture: "FourSix46 Holding",
    location: "London, UK",
    employmentType: "Full-Time",
    description: "Orchestrating cross-border logistics and strategic node expansion for the FourSix46 holding group.",
    responsibilities: [
      "Manage cross-border logistical synchronization across five global hubs.",
      "Oversee strategic node expansion and operational integration.",
      "Direct institutional relations for operational transparency and efficiency."
    ],
    requirements: [
      "8+ years in global operations or strategic management.",
      "Proven track record in high-density logistics or venture scaling.",
      "Master's degree in Business or related field preferred."
    ],
    applyUrl: "/contact",
    status: 'Open',
    postedDate: "OCT 12, 2025",
    referenceCode: "FS46-OP-01"
  },
  {
    id: "job-2",
    title: "Lead Next.js Developer",
    departmentVenture: "M-Studio",
    location: "Remote / New York",
    employmentType: "Contract",
    description: "Building the digital infrastructure for our portfolio ventures using cutting-edge React patterns and neo-brutalist design systems.",
    responsibilities: [
      "Architect highly performant, accessible web platforms for holding group ventures.",
      "Lead the implementation of complex animations and interactive 3D elements.",
      "Collaborate with Creative Principals to maintain aesthetic purity."
    ],
    requirements: [
      "Expert-level proficiency in Next.js, TypeScript, and Tailwind CSS.",
      "Deep understanding of Framer Motion and performant animation patterns.",
      "Portfolio showcasing premium, high-fidelity digital products."
    ],
    applyUrl: "/contact",
    status: 'Open',
    postedDate: "OCT 20, 2025",
    referenceCode: "MS-DEV-04"
  },
  {
    id: "job-3",
    title: "Creative Strategist",
    departmentVenture: "FourSix46 Holding",
    location: "Tokyo, JP",
    employmentType: "Full-Time",
    description: "Defining brand narratives that balance quiet luxury with neo-brutalism honesty for global industrial leaders.",
    responsibilities: [
      "Develop multi-channel brand narratives for new frontier ventures.",
      "Coordinate with M-Studio on visual-narrative alignment.",
      "Analyze market trends in luxury and tech sectors to identify strategic nodes."
    ],
    requirements: [
      "5+ years in brand strategy or creative direction.",
      "Exceptional storytelling ability with a focus on high-end markets.",
      "Bilingual (English/Japanese) is a significant advantage."
    ],
    applyUrl: "/contact",
    status: 'Open',
    postedDate: "OCT 24, 2025",
    referenceCode: "FS46-STR-02"
  },
  {
    id: "job-4",
    title: "Biophilic Design Lead",
    departmentVenture: "Rastlina",
    location: "Dubai, UAE",
    employmentType: "Full-Time",
    description: "Leading architectural research for Rastlina, integrating biological systems into high-density urban environments.",
    responsibilities: [
      "Lead architectural R&D for regenerative urban systems.",
      "Oversee biological integration tests in high-seismic and arid zones.",
      "Collaborate with engineering teams on AI-driven irrigation systems."
    ],
    requirements: [
      "Advanced degree in Architecture or Environmental Engineering.",
      "Proven expertise in biophilic design or urban ecology.",
      "Experience with large-scale structural integration projects."
    ],
    applyUrl: "/contact",
    status: 'Closed', // Filtered out from UI
    postedDate: "SEP 15, 2025",
    referenceCode: "RS-BIO-09"
  },
];

export default function CareersPage() {
  const openJobs = jobs.filter(job => job.status === 'Open');

  return (
    <main className="min-h-screen bg-black text-white selection:bg-primary selection:text-white font-sans tracking-tight">
      <Navbar />
      
      <div className="pt-32 pb-24 px-6 max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-4 block"
          >
            Join the Collective
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold uppercase tracking-tighter leading-[0.9]"
          >
            HUMAN<br />
            <span className="text-white/20">CAPITAL</span>
          </motion.h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 mb-32">
          {/* Culture & Values */}
          <section className="lg:col-span-5 space-y-10">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest mb-6 border-l-2 border-primary pl-4">Culture & Values</h2>
              <p className="text-lg text-white/60 leading-relaxed font-light">
                At FourSix46, we operate at the precise intersection of aesthetic purity and structural clarity. 
                Our collective is built on the principle of <span className="text-white">"Quiet Luxury"</span> — excellence that is felt, not shouted. 
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
                <h3 className="text-xs font-bold uppercase tracking-widest mb-2 text-white">Radical Honesty</h3>
                <p className="text-sm text-white/40">Functional excellence and raw structural truth over superficial polish.</p>
              </div>
              <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
                <h3 className="text-xs font-bold uppercase tracking-widest mb-2 text-white">Quiet Synergy</h3>
                <p className="text-sm text-white/40">The most impactful work happens through cross-disciplinary collaboration.</p>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-4">Application Process</h4>
              <p className="text-xs text-white/50 leading-relaxed mb-6">
                Don't see a perfect fit? We are always looking for visionary talent. Send a general inquiry or your portfolio to our team.
              </p>
              <Button asChild variant="outline" className="rounded-full border-white/20 px-6 text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                <a href="mailto:talent@foursix46.com"><Mail className="w-3 h-3 mr-2" /> Contact Talent Team</a>
              </Button>
            </div>
          </section>

          {/* Job Openings */}
          <section className="lg:col-span-7">
            <h2 className="text-sm font-bold uppercase tracking-widest mb-10 flex items-center gap-3">
              Open Positions <span className="text-white/20">/ 0{openJobs.length}</span>
            </h2>
            
            <Accordion type="single" collapsible className="w-full space-y-3">
              {openJobs.map((job) => (
                <AccordionItem 
                  key={job.id} 
                  value={job.id}
                  className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden px-6 transition-all hover:border-white/20"
                >
                  <AccordionTrigger className="hover:no-underline py-6 group">
                    <div className="flex flex-col md:flex-row md:items-center justify-between w-full text-left gap-4 pr-4">
                      <div className="space-y-1">
                        <h3 className="text-lg font-bold uppercase tracking-tight group-hover:text-primary transition-colors">
                          {job.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-[9px] font-bold uppercase tracking-widest text-white/30">
                          <span className="flex items-center gap-1 text-primary"><Building2 className="w-2.5 h-2.5" /> {job.departmentVenture}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-2.5 h-2.5" /> {job.location}</span>
                          <span className="flex items-center gap-1"><Briefcase className="w-2.5 h-2.5" /> {job.employmentType}</span>
                        </div>
                      </div>
                      <ArrowUpRight className="hidden md:block w-4 h-4 text-white/20 group-hover:text-primary transition-colors" />
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-8 pt-0">
                    <div className="space-y-8 max-w-2xl">
                      <p className="text-sm text-white/50 leading-relaxed font-light">
                        {job.description}
                      </p>

                      <div className="space-y-4">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40">Responsibilities</h4>
                        <ul className="list-disc pl-4 text-sm text-white/50 space-y-2">
                          {job.responsibilities.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40">Requirements</h4>
                        <ul className="list-disc pl-4 text-sm text-white/50 space-y-2">
                          {job.requirements.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-widest text-white/20">
                          <span>POSTED: {job.postedDate}</span>
                          <span>·</span>
                          <span>REF: {job.referenceCode}</span>
                        </div>
                        <Button 
                          asChild
                          className="bg-primary hover:bg-primary/90 text-white text-[10px] font-bold uppercase tracking-[0.2em] px-8 h-10 rounded-full transition-all"
                        >
                          <a href={job.applyUrl}>Apply Now</a>
                        </Button>
                      </div>
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
