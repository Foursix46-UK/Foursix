"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Check, X, ShieldCheck } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import { cn, getFirebaseImageUrl } from "@/lib/utils";

/** ®/™ mirrors trademarkSymbol() in src/lib/seo.ts — see that file for why this is
 * derived rather than stored. */
function symbolFor(status?: string) {
  return status === "Registered" ? "®" : "™";
}

function statusColorClass(status?: string) {
  if (status === "Registered") return "text-secondary";
  if (["Objected", "Opposed", "Lapsed", "Withdrawn", "Refused"].includes(status || "")) return "text-primary";
  return "text-accent";
}

function applicationNumberDisplay(t: any): string {
  if (t.filingType === "Separate applications per class" && Array.isArray(t.trademarkClasses) && t.trademarkClasses.length) {
    const nums = t.trademarkClasses.map((c: any) => c.applicationNumber).filter(Boolean);
    if (nums.length === 0) return "—";
    if (nums.length === 1) return nums[0];
    return `${nums[0]} – ${nums[nums.length - 1]}`;
  }
  return t.applicationNumber || "—";
}

function classNumbers(t: any): string {
  if (!Array.isArray(t.trademarkClasses) || t.trademarkClasses.length === 0) return "—";
  return t.trademarkClasses.map((c: any) => c.classNumber).join(", ");
}

const AccordionItem = ({ question, answer, isOpen, onClick }: { question: string; answer: string; isOpen: boolean; onClick: () => void }) => (
  <div className="border-b border-white/10">
    <button onClick={onClick} className="w-full py-8 flex items-center justify-between text-left group">
      <span className="text-xl md:text-2xl font-sans font-medium tracking-tight text-white transition-colors group-hover:text-primary">
        {question}
      </span>
      <motion.div animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.4 }} className="ml-4 flex-shrink-0">
        <Plus className={cn("w-6 h-6 transition-colors", isOpen ? "text-primary" : "text-white/40")} />
      </motion.div>
    </button>
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5 }} className="overflow-hidden">
          <div className="pb-12 pr-12 text-lg md:text-xl font-light text-white/60 leading-relaxed font-sans max-w-3xl prose prose-invert">
            <ReactMarkdown>{answer}</ReactMarkdown>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export default function TrademarksClient({ initialSettings, initialTrademarks }: { initialSettings: any; initialTrademarks: any[] }) {
  const settings = initialSettings || {};
  const trademarks = initialTrademarks || [];
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  const primaryMark = useMemo(() => trademarks.find((t) => t.isPrimary) || trademarks[0], [trademarks]);

  const groupedByJurisdiction = useMemo(() => {
    const groups = new Map<string, { label: string; items: any[] }>();
    trademarks.forEach((t) => {
      const key = t.jurisdictionData?.id || "unassigned";
      const label = t.jurisdictionData
        ? `${t.jurisdictionData.countryName} — ${t.jurisdictionData.officeName}`
        : "Unassigned";
      if (!groups.has(key)) groups.set(key, { label, items: [] });
      groups.get(key)!.items.push(t);
    });
    return Array.from(groups.values());
  }, [trademarks]);

  const whyColumns = settings.whyColumns || [];
  const usageRules = settings.usageRules || [];
  const usageCorrect = settings.usageCorrect || [];
  const usageIncorrect = settings.usageIncorrect || [];
  const pageFaqs = settings.pageFaqs || [];

  return (
    <main className="min-h-screen bg-black text-white selection:bg-primary selection:text-white font-sans">
      <Navbar />

      {/* Hero */}
      <section className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
        <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="font-sans text-[10px] font-semibold uppercase tracking-[0.5em] text-primary mb-6 block">
          The Register
        </motion.span>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-7">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-sans font-semibold uppercase tracking-tight leading-none mb-8">
              {settings.heroHeading || "The marks behind the ecosystem"}
            </motion.h1>
            {settings.heroBody && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="prose prose-invert text-lg text-white/50 max-w-2xl font-light leading-relaxed tracking-tight">
                <ReactMarkdown>{settings.heroBody}</ReactMarkdown>
              </motion.div>
            )}
          </div>

          {/* Certificate panel — the primary mark */}
          {primaryMark && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-5 p-8 border border-white/10 bg-surface rounded-2xl space-y-6">
              <div className="flex items-center gap-2 text-secondary">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Primary Mark</span>
              </div>
              {primaryMark.markImage ? (
                <div className={cn("h-24 flex items-center rounded-xl p-4", primaryMark.markImageBg === "Dark" ? "bg-black" : primaryMark.markImageBg === "Transparent" ? "" : "bg-white")}>
                  <div className="relative h-16 w-full">
                    <Image src={getFirebaseImageUrl(primaryMark.markImage)} alt={primaryMark.markName} fill className="object-contain object-left" />
                  </div>
                </div>
              ) : (
                <div className="text-3xl font-serif italic text-white">{primaryMark.markName}</div>
              )}
              <div>
                <Link href={`/trademarks/${primaryMark.slug}`} className="text-2xl font-black uppercase tracking-tight text-white hover:text-primary transition-colors">
                  {primaryMark.markName}
                  <span className="align-super text-sm ml-1">{symbolFor(primaryMark.status)}</span>
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-widest">
                <span className={statusColorClass(primaryMark.status)}>{primaryMark.status}</span>
                <span className="w-1 h-1 bg-white/20 rounded-full" />
                <span className="text-white/40">{primaryMark.jurisdictionData?.countryName}</span>
              </div>
              <Link href={`/trademarks/${primaryMark.slug}`} className="inline-block text-[10px] font-bold uppercase tracking-widest text-primary hover:text-white transition-colors">
                View full record &rarr;
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* Why this matters */}
      {(settings.whyHeading || whyColumns.length > 0) && (
        <section className="py-24 px-6 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-sans font-semibold uppercase tracking-tight mb-6">
              {settings.whyHeading || "Why this register exists"}
            </h2>
            {settings.whyIntro && (
              <p className="text-lg text-white/50 max-w-2xl font-light leading-relaxed mb-16">{settings.whyIntro}</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {whyColumns.map((col: any, idx: number) => (
                <div key={idx} className="p-8 border border-white/5 bg-surface/50 rounded-2xl">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-4">{col.heading}</h3>
                  <p className="text-white/60 font-light leading-relaxed">{col.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Register by jurisdiction */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-sans font-semibold uppercase tracking-tight mb-6">Register</h2>
          {settings.registerIntro && (
            <p className="text-lg text-white/50 max-w-2xl font-light leading-relaxed mb-16">{settings.registerIntro}</p>
          )}

          <div className="space-y-16">
            {groupedByJurisdiction.map((group) => (
              <div key={group.label}>
                <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/30 mb-6">{group.label}</h3>
                <div className="border-t border-white/10">
                  {group.items.map((t) => (
                    <Link
                      key={t.id}
                      href={`/trademarks/${t.slug}`}
                      className="grid grid-cols-2 md:grid-cols-6 gap-4 items-center py-6 border-b border-white/10 group hover:bg-white/[0.02] transition-colors px-2 -mx-2"
                    >
                      <div className="col-span-2 md:col-span-2">
                        <span className="text-lg font-bold uppercase text-white group-hover:text-primary transition-colors">
                          {t.markName}
                          <span className="align-super text-xs ml-1">{symbolFor(t.status)}</span>
                        </span>
                        <div className="text-[10px] uppercase tracking-widest text-white/30 mt-1">{t.markType}</div>
                      </div>
                      <div className="hidden md:block text-xs text-white/40 uppercase tracking-widest">
                        Class {classNumbers(t)}
                      </div>
                      <div className="hidden md:block text-xs text-white/40 font-mono">
                        {applicationNumberDisplay(t)}
                      </div>
                      <div className={cn("text-xs font-bold uppercase tracking-widest", statusColorClass(t.status))}>
                        {t.status}
                      </div>
                      <div className="hidden md:block text-xs text-white/30 text-right">
                        {t.proprietorData?.displayName}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {settings.registerFootnote && (
            <div className="mt-16 pt-8 border-t border-white/5 prose prose-invert prose-sm text-white/40 max-w-3xl">
              <ReactMarkdown>{settings.registerFootnote}</ReactMarkdown>
            </div>
          )}
        </div>
      </section>

      {/* Usage rules */}
      {(settings.usageHeading || usageRules.length > 0) && (
        <section className="py-24 px-6 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-sans font-semibold uppercase tracking-tight mb-6">
              {settings.usageHeading || "Using these marks"}
            </h2>
            {settings.usageIntro && (
              <p className="text-lg text-white/50 max-w-2xl font-light leading-relaxed mb-16">{settings.usageIntro}</p>
            )}

            {usageRules.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                {usageRules.map((rule: any, idx: number) => (
                  <div key={idx} className="p-8 border border-white/5 bg-surface/50 rounded-2xl">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-3">{rule.lead}</h3>
                    <p className="text-white/60 font-light leading-relaxed">{rule.body}</p>
                  </div>
                ))}
              </div>
            )}

            {(usageCorrect.length > 0 || usageIncorrect.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {usageCorrect.length > 0 && (
                  <div className="space-y-4">
                    {usageCorrect.map((item: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                        <span className="text-white/70 font-light">{item}</span>
                      </div>
                    ))}
                  </div>
                )}
                {usageIncorrect.length > 0 && (
                  <div className="space-y-4">
                    {usageIncorrect.map((item: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-3">
                        <X className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-white/70 font-light">{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* FAQ */}
      {pageFaqs.length > 0 && (
        <section className="py-24 px-6 border-t border-white/5">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-sans font-semibold uppercase tracking-tight mb-12">Questions</h2>
            <div>
              {pageFaqs.map((faq: any, idx: number) => {
                const faqId = `faq-${idx}`;
                return (
                  <AccordionItem
                    key={faqId}
                    question={faq.question}
                    answer={faq.answer}
                    isOpen={openFaqId === faqId}
                    onClick={() => setOpenFaqId(openFaqId === faqId ? null : faqId)}
                  />
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Cross-site banner */}
      {settings.crossSiteUrl && (
        <section className="py-24 px-6 border-t border-white/5">
          <div className="max-w-7xl mx-auto p-12 bg-surface border border-white/5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <h3 className="text-2xl font-bold uppercase mb-3 text-white">{settings.crossSiteHeading || "See the founder's side"}</h3>
              {settings.crossSiteBody && <p className="text-white/50 font-light max-w-xl">{settings.crossSiteBody}</p>}
            </div>
            <a
              href={settings.crossSiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-sans text-[10px] font-bold uppercase tracking-widest text-white hover:text-primary transition-colors whitespace-nowrap"
            >
              Visit 46dc.com &rarr;
            </a>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
