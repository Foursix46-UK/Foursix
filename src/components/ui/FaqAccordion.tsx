"use client";

import { Plus } from "lucide-react";

export type FaqItem = { question: string; answer: string };

/**
 * Renders CMS-authored FAQs for an article.
 *
 * Uses native <details>/<summary> on purpose: every answer is present in the server
 * HTML and the section still opens without JavaScript. That matters beyond
 * accessibility — these pages publish the same questions as FAQPage structured data,
 * and Google requires that markup to match content a visitor can actually see. Hiding
 * the answers behind client-side state would make the schema a policy violation.
 */
export default function FaqAccordion({
  faqs,
  heading = "Frequently Asked",
  label = "Questions",
  className = "",
}: {
  faqs: FaqItem[];
  heading?: string;
  label?: string;
  className?: string;
}) {
  const items = (faqs || []).filter((f) => f?.question && f?.answer);
  if (items.length === 0) return null;

  const headingId = `faq-heading-${heading.replace(/\W+/g, "-").toLowerCase()}`;

  return (
    <section aria-labelledby={headingId} className={className}>
      <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary mb-6 block">
        {label}
      </span>
      <h2
        id={headingId}
        className="text-3xl md:text-4xl font-sans font-bold uppercase tracking-tighter leading-none text-white mb-8"
      >
        {heading}
      </h2>

      <div>
        {items.map((faq, i) => (
          <details key={i} className="group border-b border-white/10">
            <summary className="w-full py-6 flex items-center justify-between text-left cursor-pointer list-none [&::-webkit-details-marker]:hidden">
              <span className="text-base md:text-lg font-sans font-medium tracking-tight text-white transition-colors group-hover:text-primary pr-4">
                {faq.question}
              </span>
              <Plus className="w-5 h-5 flex-shrink-0 text-white/40 transition-transform duration-300 group-open:rotate-45 group-open:text-primary" />
            </summary>
            <div className="pb-6 pr-8 text-sm md:text-base font-light text-white/60 leading-relaxed font-sans whitespace-pre-wrap">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

/** Normalises the CMS array shape into clean pairs. */
export function toFaqItems(raw: any): FaqItem[] {
  return Array.isArray(raw)
    ? raw.filter((f: any) => f?.question && f?.answer).map((f: any) => ({ question: f.question, answer: f.answer }))
    : [];
}
