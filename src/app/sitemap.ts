// src/app/sitemap.ts  ->  https://foursix46.com/sitemap.xml
//
// Fully automatic. Every URL — static route or CMS document — comes from
// src/lib/site-data.ts, which is also what the HTML sitemap and /llms.txt read.
// Publish a venture, article, magazine, profile or blog post in the CMS and it shows
// up here on the next crawl with no code change.

import { MetadataRoute } from "next";
import { getAllSiteEntries } from "@/lib/site-data";
import { absoluteUrl } from "@/lib/seo";

// Always rebuilt from live CMS data rather than frozen at build time.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = await getAllSiteEntries();

  return entries.map((entry) => ({
    url: absoluteUrl(entry.path),
    lastModified: new Date(entry.lastModified),
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}
