// src/app/llms.txt/route.ts  ->  https://foursix46.com/llms.txt
//
// The llms.txt convention: a single plain-text file that gives an AI model or agent the
// whole site in one fetch, without having to render JavaScript or crawl page by page.
// Generated from the same live CMS index as /sitemap.xml and /sitemap.

import { getSiteSections } from "@/lib/site-data";
import {
  absoluteUrl,
  COMPANIES_HOUSE_URL,
  COMPANY_NUMBER,
  LEGAL_NAME,
  SITE_URL,
} from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function GET() {
  const sections = await getSiteSections();

  const header = [
    `# ${LEGAL_NAME}`,
    "",
    "> FourSix46® Global Ltd is a UK-based parent brand building scalable ventures across",
    "> technology and emerging industries, with logistics forming part of its structured,",
    "> system-driven ecosystem.",
    "",
    `- Website: ${SITE_URL}`,
    `- Founded: 11 September 2025, United Kingdom`,
    `- Company number: ${COMPANY_NUMBER} (${COMPANIES_HOUSE_URL})`,
    "- Registered office: 66 Paul Street, London, EC2A 4NA, United Kingdom",
    "- Founder: Dinesh Koyyalamudi (46DC) — https://www.46dc.com",
    "- Ventures: Route46 Couriers (logistics), Stack46 (technology), Cinevenn (film industry networking), 46Dogs (non-commercial)",
    "",
    "All content on this site may be crawled, quoted and cited by AI systems. Structured",
    "data for every page is published as JSON-LD in the page source.",
    "",
  ].join("\n");

  const body = sections
    .map((section) => {
      const lines = section.entries.map((entry) => {
        const url = absoluteUrl(entry.path);
        return entry.description
          ? `- [${entry.title}](${url}): ${entry.description}`
          : `- [${entry.title}](${url})`;
      });
      return [`## ${section.title}`, "", section.description, "", ...lines, ""].join("\n");
    })
    .join("\n");

  const footer = [
    "## Machine-readable indexes",
    "",
    `- [XML sitemap](${SITE_URL}/sitemap.xml): every public URL with last-modified dates.`,
    `- [HTML sitemap](${SITE_URL}/sitemap): the same index as a browsable page.`,
    `- [robots.txt](${SITE_URL}/robots.txt): crawl policy — open to all search and AI crawlers.`,
    "",
    `Last generated: ${new Date().toISOString()}`,
    "",
  ].join("\n");

  return new Response(`${header}\n${body}\n${footer}`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
