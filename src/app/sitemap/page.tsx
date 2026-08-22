// src/app/sitemap/page.tsx  ->  https://foursix46.com/sitemap
//
// The human-readable sitemap, linked from the footer of every page. It reads the exact
// same source as /sitemap.xml (src/lib/site-data.ts), so a page published in the CMS
// appears in both at once. Nothing here is hand-maintained.

import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/seo/JsonLd";
import { getSiteSections } from "@/lib/site-data";
import {
  absoluteUrl,
  breadcrumbNode,
  buildMetadata,
  graph,
  webPageNode,
  SITE_URL,
} from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "Sitemap | FourSix46",
  description:
    "Every public page on foursix46.com in one place — ventures, leadership, publications, newsroom, careers and legal pages.",
  path: "/sitemap",
});

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
};

export default async function SitemapPage() {
  const sections = await getSiteSections();
  const totalPages = sections.reduce((sum, section) => sum + section.entries.length, 0);

  const schema = graph(
    webPageNode({
      path: "/sitemap",
      name: "Sitemap | FourSix46",
      description: "A complete index of every public page on foursix46.com.",
      type: "CollectionPage",
      primaryEntityId: `${SITE_URL}/sitemap#pages`,
    }),
    breadcrumbNode([{ name: "Sitemap", path: "/sitemap" }]),
    {
      "@type": "ItemList",
      "@id": `${SITE_URL}/sitemap#pages`,
      name: "FourSix46 site index",
      numberOfItems: totalPages,
      itemListElement: sections.flatMap((section) =>
        section.entries.map((entry) => ({
          "@type": "ListItem",
          name: entry.title,
          url: absoluteUrl(entry.path),
        }))
      ),
    }
  );

  return (
    <main className="min-h-screen bg-black text-white selection:bg-primary selection:text-white font-sans tracking-tight">
      <JsonLd data={schema} id="schema-sitemap" />
      <Navbar />

      <div className="pt-40 pb-32 px-6 max-w-6xl mx-auto min-h-[70vh]">
        <header className="mb-20 border-b border-white/10 pb-12">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary mb-6 block">
            Index
          </span>
          <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter">Sitemap</h1>
          <p className="text-white/50 mt-6 max-w-2xl font-light leading-relaxed">
            Every public page across the FourSix46 ecosystem — {totalPages} in total. This
            index is generated automatically, so anything published through the CMS appears
            here the moment it goes live.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 text-[10px] font-semibold uppercase tracking-widest">
            <a
              href="/sitemap.xml"
              className="border border-white/15 px-4 py-2 text-white/60 hover:text-white hover:border-primary transition-colors"
            >
              XML sitemap
            </a>
            <a
              href="/robots.txt"
              className="border border-white/15 px-4 py-2 text-white/60 hover:text-white hover:border-primary transition-colors"
            >
              robots.txt
            </a>
            <a
              href="/llms.txt"
              className="border border-white/15 px-4 py-2 text-white/60 hover:text-white hover:border-primary transition-colors"
            >
              llms.txt
            </a>
          </div>
        </header>

        <div className="space-y-20">
          {sections.map((section) => (
            <section key={section.id} aria-labelledby={`section-${section.id}`}>
              <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 mb-8 border-b border-white/10 pb-4">
                <h2
                  id={`section-${section.id}`}
                  className="text-xl md:text-2xl font-bold uppercase tracking-tight"
                >
                  {section.indexPath ? (
                    <Link href={section.indexPath} className="hover:text-primary transition-colors">
                      {section.title}
                    </Link>
                  ) : (
                    section.title
                  )}
                </h2>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-white/40">
                  {section.entries.length} {section.entries.length === 1 ? "page" : "pages"}
                </span>
              </div>

              <p className="text-white/40 text-sm font-light mb-8 max-w-2xl">
                {section.description}
              </p>

              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                {section.entries.map((entry) => (
                  <li key={entry.path} className="border-l border-white/10 pl-4 hover:border-primary transition-colors">
                    <Link href={entry.path} prefetch={false} className="group block">
                      <span className="block text-sm text-white/80 group-hover:text-primary transition-colors">
                        {entry.title}
                      </span>
                      {entry.description && (
                        <span className="block text-xs text-white/35 font-light mt-1 line-clamp-2">
                          {entry.description}
                        </span>
                      )}
                      <span className="block text-[10px] uppercase tracking-widest text-white/25 mt-2">
                        {entry.path} · {formatDate(entry.lastModified)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
