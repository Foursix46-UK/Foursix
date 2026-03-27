"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, MapPin, Briefcase, Mail, Building2 } from "lucide-react";

// --- FIREBASE IMPORTS ---
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

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
  applyEmail: string;
  status: 'Open' | 'Closed';
  postedDate: string;
  referenceCode: string;
}

export default function CareersPage() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [pageData, setPageData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const pageQ = query(collection(db, "page_careers"), limit(1));
        const pageSnap = await getDocs(pageQ);
        if (!pageSnap.empty) setPageData(pageSnap.docs[0].data());

        const q = query(collection(db, "careers"), where("status", "==", "Open"));
        const snapshot = await getDocs(q);
        
        const fetchedJobs = snapshot.docs.map(doc => {
          const data = doc.data();
          let formattedDate = "RECENT";
          if (data.postedDate?.toDate) {
            formattedDate = data.postedDate.toDate().toLocaleDateString('en-US', { 
              month: 'short', day: 'numeric', year: 'numeric' 
            }).toUpperCase();
          }

          return {
            id: doc.id,
            ...data,
            responsibilities: data.responsibilities || [],
            requirements: data.requirements || [],
            applyUrl: data.applyUrl || "",
            applyEmail: data.applyEmail || "",
            postedDate: formattedDate
          } as JobPosting;
        });

        setJobs(fetchedJobs);
      } catch (error) {
        console.error("Error fetching careers data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const cultureValues = pageData?.cultureValues || [
    { title: "Radical Honesty", text: "Functional excellence and raw structural truth over superficial polish." },
    { title: "Quiet Synergy", text: "The most impactful work happens through cross-disciplinary collaboration." }
  ];

  return (
    <main className="min-h-screen bg-black text-white selection:bg-primary selection:text-white font-sans tracking-tight">
      <Navbar />
      
      <div className="pt-32 pb-24 px-6 max-w-6xl mx-auto overflow-hidden">
        {/* Header */}
        <header className="mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-4 block"
          >
            {pageData?.heroLabel || "Join the Collective"}
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold uppercase tracking-tighter leading-[0.9]"
          >
            {pageData?.heroTitleMain || "HUMAN"}<br />
            <span className="text-white/20">{pageData?.heroTitleHighlight || "CAPITAL"}</span>
          </motion.h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 mb-32">
          {/* Culture & Values */}
          <section className="lg:col-span-5 space-y-10">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest mb-6 border-l-2 border-primary pl-4">
                {pageData?.cultureTitle || "Culture & Values"}
              </h2>
              <p className="text-lg text-white/60 leading-relaxed font-light whitespace-pre-wrap">
                {pageData?.cultureText || 'At FourSix46, we operate at the precise intersection of aesthetic purity and structural clarity. Our collective is built on the principle of "Quiet Luxury" — excellence that is felt, not shouted.'}
              </p>
            </div>
            
            <div className="space-y-4">
              {cultureValues.map((val: any, idx: number) => (
                <div key={idx} className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
                  <h3 className="text-xs font-bold uppercase tracking-widest mb-2 text-white">{val.title}</h3>
                  <p className="text-sm text-white/40 whitespace-pre-wrap">{val.text}</p>
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-white/10">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-4">
                {pageData?.appProcessTitle || "Application Process"}
              </h4>
              <p className="text-xs text-white/50 leading-relaxed mb-6 whitespace-pre-wrap">
                {pageData?.appProcessText || "Don't see a perfect fit? We are always looking for visionary talent. Initiate a talent inquiry with our strategic relations team."}
              </p>
              <Button asChild variant="outline" className="rounded-full border-white/20 px-6 text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all whitespace-nowrap">
                <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${pageData?.appProcessEmail || "careers@foursix46.com"}&su=Talent%20Inquiry`} target="_blank" rel="noopener noreferrer">
                  <Mail className="w-3 h-3 mr-2" /> {pageData?.appProcessButton || "Contact Talent Team"}
                </a>
              </Button>
            </div>
          </section>

          {/* Job Openings */}
          <section className="lg:col-span-7">
            <h2 className="text-sm font-bold uppercase tracking-widest mb-10 flex items-center gap-3">
              Open Positions <span className="text-white/20">/ {isLoading ? "-" : `0${jobs.length}`}</span>
            </h2>
            
            {isLoading ? (
              <div className="flex items-center justify-center h-48 border border-white/5 rounded-2xl bg-white/5">
                <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-white/40 animate-pulse">Syncing Database...</span>
              </div>
            ) : jobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center h-48 border border-white/5 rounded-2xl bg-white/5 p-6">
                <p className="font-sans text-xs font-bold uppercase tracking-widest text-white/60 mb-2">No Active Requisitions</p>
                <p className="text-sm text-white/40">All nodes are currently at optimal capacity. Check back later.</p>
              </div>
            ) : (
              <Accordion type="single" collapsible className="w-full space-y-3">
                {jobs.map((job) => (
                  <AccordionItem 
                    key={job.id} 
                    value={job.id}
                    className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden px-4 md:px-6 transition-all hover:border-white/20"
                  >
                    <AccordionTrigger className="hover:no-underline py-6 group">
                      <div className="flex flex-col md:flex-row md:items-center justify-between w-full text-left gap-4 pr-4">
                        <div className="space-y-2 md:space-y-1">
                          <h3 className="text-lg font-bold uppercase tracking-tight group-hover:text-primary transition-colors">
                            {job.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-[9px] font-bold uppercase tracking-widest text-white/30">
                            <span className="flex items-center gap-1 text-primary"><Building2 className="w-2.5 h-2.5" /> {job.departmentVenture}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-2.5 h-2.5" /> {job.location}</span>
                            <span className="flex items-center gap-1"><Briefcase className="w-2.5 h-2.5" /> {job.employmentType}</span>
                          </div>
                        </div>
                        <ArrowUpRight className="hidden md:block w-4 h-4 text-white/20 group-hover:text-primary transition-colors" />
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-8 pt-0">
                      <div className="space-y-10 max-w-2xl">
                        <p className="text-sm text-white/50 leading-relaxed font-light">
                          {job.description}
                        </p>

                        {job.responsibilities?.length > 0 && (
                          <div className="space-y-4">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40">Responsibilities</h4>
                            <ul className="list-disc pl-4 text-sm text-white/50 space-y-2">
                              {job.responsibilities.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {job.requirements?.length > 0 && (
                          <div className="space-y-4">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40">Requirements</h4>
                            <ul className="list-disc pl-4 text-sm text-white/50 space-y-2">
                              {job.requirements.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[9px] font-bold uppercase tracking-widest text-white/20">
                            <span>POSTED: {job.postedDate}</span>
                            <span className="hidden md:inline">·</span>
                            <span>REF: {job.referenceCode}</span>
                          </div>
                          
                          {job.applyUrl && job.applyUrl.trim().startsWith('http') ? (
                            <a 
                              href={job.applyUrl.trim()}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center w-full md:w-auto bg-primary hover:bg-primary/90 text-white text-[10px] font-bold uppercase tracking-[0.2em] px-8 h-12 md:h-10 rounded-full transition-all whitespace-nowrap"
                            >
                              Apply Now
                            </a>
                          ) : (
                            <a
                              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${
                                job.applyEmail ? job.applyEmail.trim().replace("mailto:", "") : "careers@foursix46.com"
                              }&su=${encodeURIComponent(`Application for ${job.title}`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center w-full md:w-auto bg-primary hover:bg-primary/90 text-white text-[10px] font-bold uppercase tracking-[0.2em] px-8 h-12 md:h-10 rounded-full transition-all whitespace-nowrap"
                            >
                              Apply Now
                            </a>
                          )}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}