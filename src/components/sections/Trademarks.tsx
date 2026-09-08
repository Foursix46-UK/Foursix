// Deliberately NOT a client component. The trademark register is exactly the kind of
// content that needs to be readable by crawlers, models and journalists without running
// JavaScript, so every record renders in the server HTML. The FAQ uses native
// details/summary for the same reason.

import Link from "next/link";
import { getFirebaseImageUrl } from "@/lib/utils";
import FaqAccordion from "@/components/ui/FaqAccordion";
import { toFaqItems } from "@/lib/seo";

type Mark = {
  name?: string;
  kind?: string;
  owner?: string;
  statusType?: string;
  statusLabel?: string;
  applicationNumber?: string;
  classes?: string;
  specimenImage?: string;
  recordUrl?: string;
  registryUrl?: string;
};

type Jurisdiction = { name?: string; office?: string; marks?: Mark[] };

/** ® is only ever shown for a confirmed registration — see the CMS schema note. */
const symbolFor = (mark: Mark) => (mark.statusType === "registered" ? "®" : "™");

export default function Trademarks({ data }: { data: any }) {
  const jurisdictions: Jurisdiction[] = Array.isArray(data?.jurisdictions) ? data.jurisdictions : [];
  const whyColumns = Array.isArray(data?.whyColumns) ? data.whyColumns : [];
  const usageRules = Array.isArray(data?.usageRules) ? data.usageRules : [];
  const usageExamples = Array.isArray(data?.usageExamples) ? data.usageExamples : [];

  return (
    <>
      {/* ── HERO + CERTIFICATE ─────────────────────────────────────────────── */}
      <section className="pt-40 pb-20 px-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.35fr_.85fr] gap-16">
          <div>
            <nav aria-label="Breadcrumb" className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/30 mb-8">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span className="mx-3">/</span>
              <span className="text-white/60">{data?.heroLabel || "Trademarks"}</span>
            </nav>

            <h1 className="text-4xl md:text-6xl font-sans font-bold uppercase tracking-tighter leading-[1.02] text-white mb-8">
              {data?.heroTitle || "The marks behind the ecosystem"}
            </h1>

            {data?.heroLede1 && (
              <p className="text-base md:text-lg text-white/60 font-light leading-relaxed max-w-2xl">
                {data.heroLede1}
              </p>
            )}
            {data?.heroLede2 && (
              <p className="text-base md:text-lg text-white/60 font-light leading-relaxed max-w-2xl mt-5">
                {data.heroLede2}
              </p>
            )}
          </div>

          {/* Certificate card — the double border and stamp echo a registry document. */}
          <aside className="relative border border-white/20 bg-[#0A0A0A] p-7">
            <div className="absolute inset-[5px] border border-white/10 pointer-events-none" aria-hidden="true" />
            <div className="relative">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 pb-4 mb-4 border-b border-white/10">
                {data?.certHeading || "Primary mark"}
              </h2>
              <dl className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-3 text-sm">
                {[
                  ["Mark", data?.certMark],
                  ["Type", data?.certType],
                  ["Number", data?.certNumber],
                  ["Office", data?.certOffice],
                  ["Filed", data?.certFiled],
                  ["Classes", data?.certClasses],
                ]
                  .filter(([, value]) => Boolean(value))
                  .map(([label, value]) => (
                    <div key={label as string} className="contents">
                      <dt className="text-white/35">{label}</dt>
                      <dd className="text-right text-white font-medium tabular-nums">{value}</dd>
                    </div>
                  ))}
              </dl>

              {data?.certStampTop && (
                <div className="mt-8 inline-block border-2 border-primary text-primary px-3 py-2 -rotate-[7deg]">
                  <span className="block text-[10px] font-bold uppercase tracking-[0.16em] leading-none">
                    {data.certStampTop}
                  </span>
                  {data?.certStampBottom && (
                    <span className="block text-[9px] font-medium uppercase tracking-[0.08em] mt-1.5">
                      {data.certStampBottom}
                    </span>
                  )}
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>

      {/* ── WHY WE REGISTER ────────────────────────────────────────────────── */}
      {whyColumns.length > 0 && (
        <section className="py-20 px-6 border-b border-white/10">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-sans font-bold uppercase tracking-tighter text-white mb-4">
              {data?.whyTitle || "Why we register our marks"}
            </h2>
            {data?.whySubtitle && (
              <p className="text-white/50 font-light leading-relaxed max-w-3xl">{data.whySubtitle}</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12">
              {whyColumns.map((col: any, i: number) => (
                <div key={i}>
                  <h3 className="text-lg font-sans font-semibold uppercase tracking-tight text-white mb-3">
                    {col.title}
                  </h3>
                  <p className="text-sm text-white/50 font-light leading-relaxed">{col.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── THE REGISTER ───────────────────────────────────────────────────── */}
      <section className="py-20 px-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-sans font-bold uppercase tracking-tighter text-white mb-4">
            {data?.registerTitle || "The register"}
          </h2>
          {data?.registerSubtitle && (
            <p className="text-white/50 font-light leading-relaxed max-w-3xl">{data.registerSubtitle}</p>
          )}

          {jurisdictions.map((jur, ji) => {
            const marks = Array.isArray(jur.marks) ? jur.marks : [];
            return (
              <div key={ji} className="mt-14">
                <div className="flex flex-wrap items-baseline gap-4 pb-3 mb-1 border-b-2 border-white/80">
                  <h3 className="text-xl font-sans font-bold uppercase tracking-tight text-white">{jur.name}</h3>
                  {jur.office && <span className="text-xs text-white/40">{jur.office}</span>}
                  {/* Counted, never typed by hand, so it cannot drift from the list. */}
                  <span className="ml-auto text-xs text-white/40 tabular-nums">
                    {marks.length} {marks.length === 1 ? "mark" : "marks"}
                  </span>
                </div>

                <ul>
                  {marks.map((mark, mi) => {
                    const isRegistered = mark.statusType === "registered";
                    return (
                      <li
                        key={mi}
                        className="grid grid-cols-1 md:grid-cols-[96px_minmax(160px,1.05fr)_auto] lg:grid-cols-[96px_minmax(160px,1.05fr)_130px_minmax(126px,.85fr)_minmax(96px,.6fr)_auto] gap-x-5 gap-y-4 items-center py-5 border-b border-white/10 hover:bg-white/[0.02] transition-colors"
                      >
                        {/* Specimen: uploaded logo for device marks, the word itself otherwise. */}
                        <div className="w-24 h-16 border border-white/10 bg-white/5 flex items-center justify-center overflow-hidden">
                          {mark.specimenImage ? (
                            <img
                              src={getFirebaseImageUrl(mark.specimenImage)}
                              alt={`${mark.name} logo specimen`}
                              className="w-full h-full object-contain p-1"
                              loading="lazy"
                            />
                          ) : (
                            <span className="text-sm font-semibold text-white/80 px-1 text-center">{mark.name}</span>
                          )}
                        </div>

                        <div>
                          <div className="text-lg font-sans font-semibold tracking-tight text-white">
                            {mark.name}{" "}
                            <span className="align-super text-[10px] font-medium text-white/40">
                              {symbolFor(mark)}
                            </span>
                          </div>
                          {mark.kind && <div className="text-xs text-white/40 mt-0.5">{mark.kind}</div>}
                          {mark.owner && (
                            <div className="inline-block text-[11px] text-white/35 mt-2 pt-2 border-t border-white/10">
                              {mark.owner}
                            </div>
                          )}
                        </div>

                        <div>
                          <span
                            className={`inline-block text-[10px] font-bold uppercase tracking-[0.05em] px-2.5 py-1 ${
                              isRegistered ? "bg-primary/15 text-primary" : "bg-white/10 text-white/50"
                            }`}
                          >
                            {mark.statusLabel || (isRegistered ? "Registered" : "Pending")}
                          </span>
                        </div>

                        {mark.applicationNumber && (
                          <div>
                            <div className="text-[10px] text-white/30 mb-1">Application</div>
                            <div className="text-sm text-white/80 tabular-nums">{mark.applicationNumber}</div>
                          </div>
                        )}

                        {mark.classes && (
                          <div>
                            <div className="text-[10px] text-white/30 mb-1">Classes</div>
                            <div className="text-sm text-white/80 tabular-nums">{mark.classes}</div>
                          </div>
                        )}

                        <div className="flex gap-2 md:justify-self-end">
                          {mark.recordUrl && (
                            <a
                              href={mark.recordUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] font-bold uppercase tracking-widest px-4 py-2 bg-white text-black hover:bg-primary hover:text-white transition-colors whitespace-nowrap"
                            >
                              View record
                            </a>
                          )}
                          {mark.registryUrl && (
                            <a
                              href={mark.registryUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] font-bold uppercase tracking-widest px-4 py-2 border border-white/15 text-white/60 hover:text-white hover:border-primary transition-colors whitespace-nowrap"
                            >
                              Registry
                            </a>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}

          {data?.registerNote && (
            <p className="mt-10 py-4 px-5 bg-white/[0.03] border-l-2 border-primary text-sm text-white/50 font-light leading-relaxed max-w-4xl">
              {data.registerNote}
            </p>
          )}
        </div>
      </section>

      {/* ── USING OUR MARKS ────────────────────────────────────────────────── */}
      {(usageRules.length > 0 || usageExamples.length > 0) && (
        <section className="py-20 px-6 border-b border-white/10">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-sans font-bold uppercase tracking-tighter text-white mb-4">
              {data?.usageTitle || "Using our marks"}
            </h2>
            {data?.usageSubtitle && (
              <p className="text-white/50 font-light leading-relaxed max-w-3xl">{data.usageSubtitle}</p>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-10">
              <ul>
                {usageRules.map((rule: any, i: number) => (
                  <li key={i} className="py-4 border-b border-white/10 text-sm text-white/50 font-light leading-relaxed">
                    <b className="text-white font-semibold">{rule.lead}</b>
                    {rule.body ? ` ${rule.body}` : ""}
                  </li>
                ))}
              </ul>

              {usageExamples.length > 0 && (
                <div className="bg-[#0A0A0A] border border-white/10 p-7 self-start">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mb-5">
                    {data?.examplesHeading || "In running text"}
                  </h3>
                  {usageExamples.map((ex: any, i: number) => (
                    <div key={i} className="flex items-baseline gap-3 py-2">
                      <span
                        className={`w-4 flex-none font-bold text-sm ${ex.correct ? "text-primary" : "text-white/30"}`}
                        aria-hidden="true"
                      >
                        {ex.correct ? "✓" : "✕"}
                      </span>
                      <span className="sr-only">{ex.correct ? "Correct:" : "Incorrect:"}</span>
                      <code className={`text-base ${ex.correct ? "text-white" : "text-white/30 line-through"}`}>
                        {ex.text}
                      </code>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ ────────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 border-b border-white/10">
        <div className="max-w-4xl mx-auto">
          <FaqAccordion
            faqs={toFaqItems(data?.faqs)}
            heading={data?.faqTitle || "Questions about our trademarks"}
            label="Trademarks"
          />
        </div>
      </section>

      {/* ── CROSS-LINK ─────────────────────────────────────────────────────── */}
      {data?.crossTitle && (
        <section className="py-16 px-6 bg-[#0A0A0A] border-b border-white/10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-center">
            <div>
              <h2 className="text-2xl font-sans font-semibold uppercase tracking-tight text-white mb-2">
                {data.crossTitle}
              </h2>
              {data?.crossText && (
                <p className="text-white/50 font-light leading-relaxed max-w-2xl">{data.crossText}</p>
              )}
            </div>
            {data?.crossButtonUrl && (
              <a
                href={data.crossButtonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="justify-self-start md:justify-self-end text-[10px] font-bold uppercase tracking-widest px-6 py-4 border border-white/20 text-white hover:border-primary hover:text-primary transition-colors whitespace-nowrap"
              >
                {data.crossButtonLabel || "View founder register"}
              </a>
            )}
          </div>
        </section>
      )}

      {/* ── PAGE FOOTNOTE ──────────────────────────────────────────────────── */}
      {(data?.footerNote || data?.lastUpdated) && (
        <div className="py-8 px-6">
          <div className="max-w-7xl mx-auto flex flex-wrap justify-between gap-4 text-[10px] font-semibold uppercase tracking-widest text-white/30">
            {data?.footerNote && <span>{data.footerNote}</span>}
            {data?.lastUpdated && <span>{data.lastUpdated}</span>}
          </div>
        </div>
      )}
    </>
  );
}
