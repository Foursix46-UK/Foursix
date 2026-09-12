"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, ExternalLink, ShieldCheck, Check, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { cn, getFirebaseImageUrl } from "@/lib/utils";

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

function formatDate(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

const DEVICE_LIKE_TYPES = ["Device mark", "Combined mark"];

/*
 * Timeline is generated, not authored — from status + mark type, never hand-maintained
 * per mark. Each jurisdiction we track uses the same forward sequence; device and
 * combined marks pick up an extra "Vienna codification" step (the registry assigns
 * codes describing the visual elements ahead of examination — word marks skip it).
 * A mark that has been objected to, opposed, lapsed, withdrawn or refused branched off
 * the normal path, so rather than guess exactly where, we show progress up to
 * "Under examination" as reached and surface the exception as its own final stage.
 */
const BASE_STAGES = ["Filed", "Formalities check passed", "Ready for examination", "Under examination", "Published", "Registered"];
const EXCEPTION_STATUSES = ["Objected", "Opposed", "Lapsed", "Withdrawn", "Refused"];
const STAGE_DESCRIPTIONS: Record<string, string> = {
  Filed: "The application is lodged with the registry and given a filing date.",
  "Formalities check passed": "The registry has confirmed the application meets the basic filing requirements.",
  "Vienna codification": "The registry assigns codes describing the visual elements of the mark ahead of examination.",
  "Ready for examination": "The application is queued for substantive examination by a registry examiner.",
  "Under examination": "An examiner checks the mark against absolute and relative grounds for refusal.",
  Published: "The mark is published in the official journal, opening a window for third parties to oppose.",
  Registered: "The mark is entered on the register and protection is confirmed.",
  Objected: "The registry raised an objection that must be answered before the application can proceed.",
  Opposed: "A third party has formally opposed registration during the publication window.",
  Lapsed: "The application or registration has lapsed, most commonly through a missed renewal or deadline.",
  Withdrawn: "The applicant withdrew the application before a final decision.",
  Refused: "The registry refused the application following examination or opposition.",
};

/**
 * Prefers the mark's own jurisdiction's registryStages (CMS-configured, in entry
 * order — see jurisdictionSchema.ts) so each registry's real sequence drives the
 * timeline. Falls back to the hardcoded BASE_STAGES sequence, unchanged from before,
 * whenever a jurisdiction has no registryStages configured yet — which is every
 * jurisdiction until DC fills them in via the CMS, so this fallback path is what
 * actually renders today.
 */
/**
 * Stage labels are authored per jurisdiction in the CMS; statuses come from a fixed
 * vocabulary in trademarkSchema.ts. The two are written by different hands and will
 * not always agree word for word — a registry that calls its step "Examination" still
 * has to match the status "Under examination", and "Application filed" has to match
 * "Filed". A strict indexOf returns -1 on any such near-miss, which silently renders
 * the whole timeline as pending; the mark then looks like nothing has happened to it.
 * Match loosely so a wording difference degrades to the right stage instead.
 */
function normaliseStage(value: string) {
  return value.toLowerCase().replace(/[^a-z]+/g, " ").trim();
}

function findStageIndex(labels: string[], status: string) {
  const target = normaliseStage(status);
  if (!target) return -1;

  const exact = labels.findIndex((label) => normaliseStage(label) === target);
  if (exact !== -1) return exact;

  // Either side may be the longer phrasing of the same step.
  return labels.findIndex((label) => {
    const candidate = normaliseStage(label);
    return candidate.length > 0 && (candidate.includes(target) || target.includes(candidate));
  });
}

function buildTimeline(status: string, markType: string, jurisdictionData?: any) {
  const isDevice = markType === "Device mark" || markType === "Combined mark";
  const customStages = Array.isArray(jurisdictionData?.registryStages)
    ? jurisdictionData.registryStages
        .filter((s: any) => s?.stageName)
        // Word marks never go through Vienna codification, so a jurisdiction that
        // lists it must not show it on them — same rule the fallback path applies.
        .filter((s: any) => isDevice || !/vienna/i.test(s.stageName))
    : [];

  if (customStages.length > 0) {
    const labels: string[] = customStages.map((s: any) => s.stageName);
    const descriptions: Record<string, string> = {};
    customStages.forEach((s: any) => {
      if (s.stageDescription) descriptions[s.stageName] = s.stageDescription;
    });

    if (EXCEPTION_STATUSES.includes(status)) {
      // No guaranteed "Under examination" landmark in a custom sequence — fall back to
      // whichever stage name looks like an examination step, else the second-to-last
      // configured stage, so the exception still reads as "branched off partway through".
      const examIdx = labels.findIndex((label) => /examin/i.test(label));
      const cutoff = examIdx !== -1 ? examIdx : Math.max(labels.length - 2, 0);
      const reached = labels.slice(0, cutoff + 1).map((label) => ({ label, state: "done" as const, description: descriptions[label] }));
      return [...reached, { label: status, state: "exception" as const, description: STAGE_DESCRIPTIONS[status] }];
    }

    const currentIndex = findStageIndex(labels, status);
    return labels.map((label, idx) => ({
      label,
      description: descriptions[label],
      state:
        currentIndex === -1
          ? ("pending" as const)
          : idx < currentIndex
          ? ("done" as const)
          : idx === currentIndex
          ? ("current" as const)
          : ("pending" as const),
    }));
  }

  // Fallback: the original global sequence, unchanged.
  const stages = [...BASE_STAGES];
  if (isDevice) {
    stages.splice(2, 0, "Vienna codification");
  }

  if (EXCEPTION_STATUSES.includes(status)) {
    const cutoff = stages.indexOf("Under examination");
    const reached = stages.slice(0, cutoff + 1).map((label) => ({ label, state: "done" as const }));
    return [...reached, { label: status, state: "exception" as const }];
  }

  const currentIndex = findStageIndex(stages, status);
  return stages.map((label, idx) => ({
    label,
    state:
      currentIndex === -1
        ? ("pending" as const)
        : idx < currentIndex
        ? ("done" as const)
        : idx === currentIndex
        ? ("current" as const)
        : ("pending" as const),
  }));
}

function registryVerify(trademark: any, jurisdictionData: any): { url: string; manualNumber?: string } | null {
  if (trademark.officialRecordUrl) return { url: trademark.officialRecordUrl };
  if (!jurisdictionData) return null;
  const primaryNumber =
    trademark.filingType === "Separate applications per class"
      ? trademark.trademarkClasses?.[0]?.applicationNumber
      : trademark.applicationNumber;
  if (jurisdictionData.deepLinkSupported && jurisdictionData.recordUrlPattern && primaryNumber) {
    return { url: jurisdictionData.recordUrlPattern.replace("{application_number}", primaryNumber) };
  }
  if (jurisdictionData.officeUrl) {
    return { url: jurisdictionData.officeUrl, manualNumber: primaryNumber };
  }
  return null;
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

export default function TrademarkClient({ initialTrademark }: { initialTrademark: any }) {
  const t = initialTrademark;
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  if (!t) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <h1 className="text-4xl font-black uppercase mb-4 text-white">Trademark Not Found</h1>
        <Link href="/trademarks">
          <Button variant="outline" className="rounded-none font-sans text-xs font-semibold uppercase tracking-widest px-8 text-white">
            Back to Trademarks
          </Button>
        </Link>
      </main>
    );
  }

  const symbol = symbolFor(t.status);
  const timeline = buildTimeline(t.status, t.markType, t.jurisdictionData);
  const verify = registryVerify(t, t.jurisdictionData);
  const isDeviceLike = t.markType === "Device mark" || t.markType === "Combined mark";
  const otherMarks = (t.related || []).slice(0, 4);

  return (
    <main className="min-h-screen bg-background selection:bg-primary selection:text-white font-sans">
      <Navbar />

      {/* Hero */}
      <section className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
        <Link href="/trademarks" className="flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-widest text-primary hover:text-white transition-colors mb-12 group w-fit">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to All Trademarks
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-7 space-y-6">
            {t.markImage ? (
              <div className={cn("h-28 flex items-center rounded-xl p-4 w-fit min-w-[12rem]", t.markImageBg === "Dark" ? "bg-black" : t.markImageBg === "Transparent" ? "" : "bg-white")}>
                <div className="relative h-20 w-40">
                  <Image src={getFirebaseImageUrl(t.markImage)} alt={t.markName} fill className="object-contain object-left" />
                </div>
              </div>
            ) : (
              <div className="text-2xl font-serif italic text-white/60">
                {t.markName} <span className="text-sm not-italic text-white/30">— word mark, protected in any typeface</span>
              </div>
            )}

            <h1 className="text-4xl md:text-6xl font-sans font-semibold uppercase tracking-tight leading-none text-white">
              {t.markName}
              <span className="align-super text-2xl ml-2">{symbol}</span>
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest">
              <span className="text-white/40">{t.markType}</span>
              <span className="w-1 h-1 bg-white/20 rounded-full" />
              <span className={statusColorClass(t.status)}>{t.status}</span>
              {t.statusNote && (
                <>
                  <span className="w-1 h-1 bg-white/20 rounded-full" />
                  <span className="text-white/30 normal-case font-normal tracking-normal">{t.statusNote}</span>
                </>
              )}
            </div>

            {t.jurisdictionData?.symbolRuleNote && (
              <p className="text-xs text-white/30 leading-relaxed max-w-2xl border-l-2 border-white/10 pl-4">
                {t.jurisdictionData.symbolRuleNote}
              </p>
            )}

            {t.summary && <p className="text-lg md:text-xl font-light text-white/70 leading-relaxed max-w-2xl">{t.summary}</p>}
          </div>

          {/* Registry particulars */}
          <div className="lg:col-span-5 p-8 border border-white/10 bg-surface rounded-2xl space-y-6">
            <div className="flex items-center gap-2 text-secondary">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Registry Particulars</span>
            </div>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between border-b border-white/5 pb-3">
                <span className="text-white/30 uppercase text-[10px] tracking-widest">Jurisdiction</span>
                <span className="text-white font-medium text-right">{t.jurisdictionData?.countryName || "—"}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-3">
                <span className="text-white/30 uppercase text-[10px] tracking-widest">Registry</span>
                <span className="text-white font-medium text-right">{t.jurisdictionData?.officeShort || t.jurisdictionData?.officeName || "—"}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-3">
                <span className="text-white/30 uppercase text-[10px] tracking-widest">Application No.</span>
                <span className="text-white font-mono text-right">{applicationNumberDisplay(t)}</span>
              </div>
              {t.registrationNumber && (
                <div className="flex justify-between border-b border-white/5 pb-3">
                  <span className="text-white/30 uppercase text-[10px] tracking-widest">Registration No.</span>
                  <span className="text-white font-mono text-right">{t.registrationNumber}</span>
                </div>
              )}
              <div className="flex justify-between border-b border-white/5 pb-3">
                <span className="text-white/30 uppercase text-[10px] tracking-widest">Filed</span>
                <span className="text-white font-medium text-right">{t.filingDate ? new Date(t.filingDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}</span>
              </div>
              {t.registrationDate && (
                <div className="flex justify-between border-b border-white/5 pb-3">
                  <span className="text-white/30 uppercase text-[10px] tracking-widest">Registered</span>
                  <span className="text-white font-medium text-right">{new Date(t.registrationDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-white/30 uppercase text-[10px] tracking-widest">Proprietor</span>
                <span className="text-white font-medium text-right">{t.proprietorData?.displayName || "—"}</span>
              </div>
            </div>

            {verify && (
              <a href={verify.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-white/5 hover:bg-white/10 transition-colors font-sans text-xs font-bold uppercase tracking-widest text-white">
                Verify on official register <ExternalLink className="w-4 h-4" />
              </a>
            )}
            {verify?.manualNumber && (
              <p className="text-[10px] text-white/30 text-center -mt-3">
                This registry's search is session-based — enter application no. <span className="font-mono text-white/50">{verify.manualNumber}</span> manually.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
          <div className="lg:col-span-12 space-y-32">
            {/* Story */}
            {t.story && (
              <section className="space-y-8">
                <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.4em] text-primary border-l-4 border-primary pl-6">Why this mark exists</h2>
                <div className="prose prose-invert prose-lg max-w-3xl text-white/80 font-light leading-relaxed">
                  <ReactMarkdown>{t.story}</ReactMarkdown>
                </div>
                {t.classNote && <p className="text-white/40 text-sm max-w-3xl border-l-2 border-white/10 pl-6">{t.classNote}</p>}
              </section>
            )}

            {/* Classes */}
            {t.trademarkClasses?.length > 0 && (
              <section className="space-y-12">
                <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.4em] text-white/30">What this mark covers</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {t.trademarkClasses.map((c: any, idx: number) => (
                    <div key={idx} className="p-8 border border-white/5 bg-surface/50 rounded-2xl space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-3xl font-black text-white">Class {c.classNumber}</span>
                        {c.applicationNumber && <span className="text-xs font-mono text-white/30">{c.applicationNumber}</span>}
                      </div>
                      {c.classHeading && <p className="text-sm font-bold uppercase tracking-widest text-primary">{c.classHeading}</p>}
                      {c.specification && <p className="text-white/60 font-light leading-relaxed text-sm">{c.specification}</p>}
                      {c.classStatus && (
                        <span className={cn("inline-block text-[10px] font-bold uppercase tracking-widest", statusColorClass(c.classStatus))}>{c.classStatus}</span>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Timeline */}
            <section className="space-y-12">
              <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.4em] text-white/30">Where this application stands</h2>
              <div className="space-y-0">
                {timeline.map((stage, idx) => (
                  <div key={idx} className="flex gap-6 group">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "w-3 h-3 rounded-full flex-shrink-0 mt-1.5",
                          stage.state === "done" && "bg-secondary",
                          stage.state === "current" && "bg-primary ring-4 ring-primary/20",
                          stage.state === "exception" && "bg-primary ring-4 ring-primary/20",
                          stage.state === "pending" && "bg-white/10"
                        )}
                      />
                      {idx < timeline.length - 1 && <div className={cn("w-px flex-1 min-h-[2.5rem]", stage.state === "done" ? "bg-secondary/30" : "bg-white/10")} />}
                    </div>
                    <div className="pb-10">
                      <span
                        className={cn(
                          "block text-sm font-bold uppercase tracking-widest mb-1",
                          stage.state === "done" && "text-white/50",
                          (stage.state === "current" || stage.state === "exception") && "text-white",
                          stage.state === "pending" && "text-white/20"
                        )}
                      >
                        {stage.label}
                        {stage.state === "current" && <span className="ml-2 text-[10px] text-primary">— now</span>}
                      </span>
                      <span className={cn("text-sm font-light leading-relaxed", stage.state === "pending" ? "text-white/20" : "text-white/50")}>
                        {(stage as any).description || STAGE_DESCRIPTIONS[stage.label]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Usage — device/combined marks only */}
            {isDeviceLike && t.usageEnabled && (
              <section className="space-y-8">
                <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.4em] text-white/30">Using this mark</h2>
                {t.usageIntro && <p className="text-white/60 font-light leading-relaxed max-w-2xl">{t.usageIntro}</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {t.usageCorrect && (
                    <div className="flex items-start gap-3 p-6 border border-secondary/20 bg-secondary/5 rounded-xl">
                      <Check className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                      <span className="text-white/70 font-light text-sm">{t.usageCorrect}</span>
                    </div>
                  )}
                  {t.usageIncorrect && (
                    <div className="flex items-start gap-3 p-6 border border-primary/20 bg-primary/5 rounded-xl">
                      <X className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-white/70 font-light text-sm">{t.usageIncorrect}</span>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Check for yourself */}
            <section className="space-y-8">
              <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.4em] text-white/30">Check this for yourself</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {verify && (
                  <a href={verify.url} target="_blank" rel="noopener noreferrer" className="p-6 border border-white/5 bg-surface/50 rounded-2xl hover:border-primary transition-colors group">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 block mb-2">Official Registry</span>
                    <span className="text-sm text-white group-hover:text-primary transition-colors flex items-center gap-2">
                      {t.jurisdictionData?.officeShort || "View record"} <ExternalLink className="w-3 h-3" />
                    </span>
                  </a>
                )}
                {t.proprietorData?.verifyUrl && (
                  <a href={t.proprietorData.verifyUrl} target="_blank" rel="noopener noreferrer" className="p-6 border border-white/5 bg-surface/50 rounded-2xl hover:border-primary transition-colors group">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 block mb-2">Proprietor</span>
                    <span className="text-sm text-white group-hover:text-primary transition-colors flex items-center gap-2">
                      {t.proprietorData.displayName} <ExternalLink className="w-3 h-3" />
                    </span>
                  </a>
                )}
                {t.ventureData?.url && (
                  <a href={t.ventureData.url.startsWith("http") ? t.ventureData.url : `https://${t.ventureData.url}`} target="_blank" rel="noopener noreferrer" className="p-6 border border-white/5 bg-surface/50 rounded-2xl hover:border-primary transition-colors group">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 block mb-2">Venture Site</span>
                    <span className="text-sm text-white group-hover:text-primary transition-colors flex items-center gap-2">
                      {t.ventureData.title} <ExternalLink className="w-3 h-3" />
                    </span>
                  </a>
                )}
              </div>
            </section>

            {/* Related marks */}
            {otherMarks.length > 0 && (
              <section className="space-y-8 border-t border-white/10 pt-16">
                <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.4em] text-white/30">Other marks in the ecosystem</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {otherMarks.map((m: any) => (
                    <Link key={m.id} href={`/trademarks/${m.slug}`} className="p-6 border border-white/5 bg-surface/50 rounded-2xl hover:border-primary transition-colors group space-y-4 block">
                      <div className="flex items-center justify-between gap-4">
                        {DEVICE_LIKE_TYPES.includes(m.markType) && m.markImage ? (
                          <div className={cn("h-12 flex items-center rounded-lg px-3", m.markImageBg === "Dark" ? "bg-black" : m.markImageBg === "Transparent" ? "" : "bg-white")}>
                            <div className="relative h-8 w-24">
                              <Image src={getFirebaseImageUrl(m.markImage)} alt={m.markName} fill className="object-contain object-left" />
                            </div>
                          </div>
                        ) : (
                          <span className="text-lg font-serif italic text-white/60">{m.markName}</span>
                        )}
                        <span className={cn("text-[10px] font-bold uppercase tracking-widest flex-shrink-0", statusColorClass(m.status))}>{m.status}</span>
                      </div>
                      <div>
                        <span className="text-lg font-bold uppercase text-white group-hover:text-primary transition-colors block">
                          {m.markName}
                          <span className="align-super text-xs ml-1">{symbolFor(m.status)}</span>
                        </span>
                        <span className="text-[10px] uppercase tracking-widest text-white/30 mt-1 block">
                          {m.markType} &middot; {m.jurisdictionCountryName || "—"} &middot; {m.status}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* FAQ */}
            {t.faqs?.length > 0 && (
              <section className="space-y-4 border-t border-white/10 pt-16">
                <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.4em] text-white/30 mb-8">Questions</h2>
                <div>
                  {t.faqs.map((faq: any, idx: number) => {
                    const faqId = `mark-faq-${idx}`;
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
              </section>
            )}
          </div>
        </div>
      </section>

      {/* Register last updated */}
      {t.statusUpdated && (
        <div className="px-6 py-8 border-t border-white/5 text-center">
          <p className="text-[11px] uppercase tracking-widest text-white/30">
            Register last updated {formatDate(t.statusUpdated)}
            {t.proprietorData?.legalName && (
              <>
                {" "}
                &middot; {t.proprietorData.legalName}
                {t.proprietorData.registrationNumber ? `, Company No. ${t.proprietorData.registrationNumber}` : ""}
              </>
            )}
          </p>
        </div>
      )}

      <Footer />
    </main>
  );
}
