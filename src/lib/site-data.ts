// src/lib/site-data.ts
// One crawl of the site's real URL surface, shared by:
//   • /sitemap.xml   (src/app/sitemap.ts)
//   • /sitemap       (src/app/sitemap/page.tsx — the human/HTML sitemap)
//   • /llms.txt      (src/app/llms.txt/route.ts — the AI-readable index)
//
// Because all three read from here, anything published in the CMS appears in every
// one of them automatically. Adding a new content type is a one-entry change to
// CMS_SOURCES below — no edits to the sitemap or robots files.

// The lite SDK: these are one-shot server reads with no realtime listeners, so it keeps
// the sitemap/llms.txt routes small and fast.
import { collection, getDocs } from "firebase/firestore/lite";
import { db } from "@/lib/firebase-lite";
import { toIso, plainText, EXCLUDED_PATHS } from "@/lib/seo";

export type ChangeFreq = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

export type SiteEntry = {
  path: string;
  title: string;
  description?: string;
  lastModified: string; // ISO
  changeFrequency: ChangeFreq;
  priority: number;
};

export type SiteSection = {
  id: string;
  title: string;
  description: string;
  /** Index/listing page for the section, when it has one. */
  indexPath?: string;
  entries: SiteEntry[];
};

/* ------------------------------------------------------------------ */
/* Static routes                                                       */
/* ------------------------------------------------------------------ */

const STATIC_ENTRIES: Array<SiteEntry & { section: string }> = [
  { section: "core", path: "/", title: "Home", description: "The FourSix46 ecosystem at a glance.", lastModified: "", changeFrequency: "daily", priority: 1.0 },
  { section: "core", path: "/about", title: "Vision & Ethos", description: "Who FourSix46 is and the thinking behind the group.", lastModified: "", changeFrequency: "monthly", priority: 0.9 },
  { section: "core", path: "/ventures", title: "Our Ventures", description: "Every operating company under the FourSix46 parent brand.", lastModified: "", changeFrequency: "weekly", priority: 0.9 },
  { section: "core", path: "/global", title: "Global Footprint", description: "Regional nodes and where the group operates.", lastModified: "", changeFrequency: "monthly", priority: 0.8 },
  { section: "core", path: "/leadership", title: "Leadership", description: "The people running the ventures.", lastModified: "", changeFrequency: "monthly", priority: 0.8 },
  { section: "core", path: "/partnership", title: "Partner With Us", description: "Strategic alliances and institutional capital.", lastModified: "", changeFrequency: "monthly", priority: 0.8 },

  { section: "intelligence", path: "/blog", title: "Blog", description: "Stories from FourSix46 ventures, press and people.", lastModified: "", changeFrequency: "daily", priority: 0.9 },
  { section: "intelligence", path: "/magazines", title: "Publications", description: "The FourSix46 editorial archive.", lastModified: "", changeFrequency: "weekly", priority: 0.8 },
  { section: "intelligence", path: "/newsroom", title: "Newsroom", description: "Official press releases and announcements.", lastModified: "", changeFrequency: "daily", priority: 0.8 },
  { section: "intelligence", path: "/gallery", title: "Gallery", description: "A visual archive of the venture ecosystem.", lastModified: "", changeFrequency: "monthly", priority: 0.6 },
  { section: "intelligence", path: "/careers", title: "Careers", description: "Open positions across the group.", lastModified: "", changeFrequency: "daily", priority: 0.8 },
  { section: "intelligence", path: "/faq", title: "FAQ", description: "Answers to the questions we are asked most.", lastModified: "", changeFrequency: "monthly", priority: 0.7 },
  { section: "intelligence", path: "/contact", title: "Contact Us", description: "Reach the strategic relations team.", lastModified: "", changeFrequency: "yearly", priority: 0.7 },

  { section: "legal", path: "/privacy", title: "Privacy Policy", description: "How FourSix46 handles personal data.", lastModified: "", changeFrequency: "yearly", priority: 0.3 },
  { section: "legal", path: "/terms", title: "Terms of Service", description: "The terms governing use of this site.", lastModified: "", changeFrequency: "yearly", priority: 0.3 },
  { section: "legal", path: "/cookies", title: "Cookie Policy", description: "Cookies and tracking used on this site.", lastModified: "", changeFrequency: "yearly", priority: 0.3 },
  { section: "legal", path: "/sitemap", title: "Sitemap", description: "Every public page on foursix46.com in one list.", lastModified: "", changeFrequency: "daily", priority: 0.4 },
];

/* ------------------------------------------------------------------ */
/* CMS-driven routes                                                   */
/* ------------------------------------------------------------------ */

type CmsSource = {
  id: string;
  /** Firestore collection name. */
  collectionName: string;
  /** Section heading on the HTML sitemap. */
  title: string;
  description: string;
  indexPath?: string;
  /** URL prefix; "" means the slug sits at the site root. */
  basePath: string;
  /** First field that holds a usable slug wins. */
  slugFields: string[];
  titleFields: string[];
  descFields?: string[];
  dateFields?: string[];
  changeFrequency: ChangeFreq;
  priority: number;
  /**
   * When set, only documents whose `status` is in this list are published. Collections
   * with a draft/scheduled/archived workflow (the blog) need it — the generic
   * isPublic() check alone would let "scheduled" posts through before they go live.
   */
  statusAllowList?: string[];
  /**
   * Optional collections aren't live yet. If someone creates one in the CMS the URLs
   * appear here automatically — pair it with a matching Next.js route at basePath.
   */
  optional?: boolean;
};

const CMS_SOURCES: CmsSource[] = [
  {
    id: "ventures",
    collectionName: "ventures",
    title: "Ventures",
    description: "Every operating company in the group.",
    indexPath: "/ventures",
    basePath: "/ventures",
    slugFields: ["ventureSlug", "slug"],
    titleFields: ["title", "name"],
    descFields: ["seoDescription", "ventureTagline"],
    dateFields: ["updatedAt", "publishDate", "createdAt"],
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    id: "newsroom",
    collectionName: "news",
    title: "Newsroom",
    description: "Press releases and announcements.",
    indexPath: "/newsroom",
    basePath: "/newsroom",
    slugFields: ["slug"],
    titleFields: ["title"],
    descFields: ["seoDescription", "desc"],
    dateFields: ["updatedAt", "publishDate"],
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    id: "magazines",
    collectionName: "magazines",
    title: "Publications",
    description: "Long-form editorial issues.",
    indexPath: "/magazines",
    basePath: "/magazines",
    slugFields: ["slug"],
    titleFields: ["articleTitle", "title"],
    descFields: ["seoDescription", "page2IntroText"],
    dateFields: ["updatedAt", "publishDate"],
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    id: "global",
    collectionName: "global",
    title: "Global Nodes",
    description: "Regional operations and market presence.",
    indexPath: "/global",
    basePath: "/global",
    slugFields: ["slug"],
    titleFields: ["cityRegion", "title"],
    descFields: ["seoDescription", "marketDescription"],
    dateFields: ["updatedAt"],
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    id: "leadership",
    collectionName: "leadership",
    title: "Leadership Profiles",
    description: "Executive and founder profiles.",
    indexPath: "/leadership",
    basePath: "/leadership",
    slugFields: ["slug"],
    titleFields: ["fullName", "name"],
    descFields: ["seoDescription", "shortBio"],
    dateFields: ["updatedAt"],
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    id: "blog",
    collectionName: "blog_posts",
    title: "Blog",
    description: "Articles and essays published on the FourSix46 blog.",
    indexPath: "/blog",
    basePath: "/blog",
    slugFields: ["slug"],
    titleFields: ["title"],
    descFields: ["seoDescription", "standfirst"],
    dateFields: ["updatedAt", "publishDate"],
    changeFrequency: "weekly",
    priority: 0.8,
    // Draft, scheduled and archived posts stay out of every index until they go live.
    statusAllowList: ["published"],
  },
  // ---- Auto-discovered. Empty/absent collections simply contribute nothing. ----
  {
    id: "pages",
    collectionName: "pages",
    title: "Pages",
    description: "Standalone pages created in the CMS.",
    basePath: "",
    slugFields: ["slug", "pageSlug"],
    titleFields: ["title", "pageTitle"],
    descFields: ["seoDescription", "description"],
    dateFields: ["updatedAt", "publishDate"],
    changeFrequency: "monthly",
    priority: 0.6,
    optional: true,
  },
];

const firstValue = (data: any, fields: string[] = []): any => {
  for (const field of fields) {
    const value = data?.[field];
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return undefined;
};

/** A doc is public unless the CMS explicitly switched it off. */
const isPublic = (data: any): boolean => {
  if (data?.visibilityToggle === false) return false;
  if (data?.published === false) return false;
  if (typeof data?.status === "string" && /draft|archived|hidden/i.test(data.status)) return false;
  if (data?.noindex === true) return false;
  return true;
};

async function fetchSource(source: CmsSource): Promise<SiteSection | null> {
  try {
    const snapshot = await getDocs(collection(db, source.collectionName));
    const entries: SiteEntry[] = [];

    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      if (!isPublic(data)) return;

      // Workflow collections: only the whitelisted statuses are live.
      if (source.statusAllowList && !source.statusAllowList.includes(String(data.status || ""))) {
        return;
      }

      const slug = firstValue(data, source.slugFields);
      if (!slug || typeof slug !== "string") return;

      const path = `${source.basePath}/${slug}`.replace(/\/+/g, "/");
      if (EXCLUDED_PATHS.some((excluded) => path.startsWith(excluded))) return;

      entries.push({
        path,
        title: String(firstValue(data, source.titleFields) || slug),
        description: plainText(firstValue(data, source.descFields), 160) || undefined,
        lastModified: toIso(firstValue(data, source.dateFields)),
        changeFrequency: source.changeFrequency,
        priority: source.priority,
      });
    });

    if (entries.length === 0) return null;

    entries.sort((a, b) => b.lastModified.localeCompare(a.lastModified));

    return {
      id: source.id,
      title: source.title,
      description: source.description,
      indexPath: source.indexPath,
      entries,
    };
  } catch (error) {
    // A missing optional collection is expected; anything else is worth a log line.
    if (!source.optional) {
      console.error(`[site-data] Failed to read "${source.collectionName}":`, error);
    }
    return null;
  }
}

/** Every public URL on the site, grouped for display. Never throws. */
export async function getSiteSections(): Promise<SiteSection[]> {
  const now = new Date().toISOString();

  const staticSection = (id: string, title: string, description: string): SiteSection => ({
    id,
    title,
    description,
    entries: STATIC_ENTRIES.filter((entry) => entry.section === id).map(({ section, ...entry }) => ({
      ...entry,
      lastModified: now,
    })),
  });

  const cmsSections = await Promise.all(CMS_SOURCES.map(fetchSource));

  // Merge sources that share a base path (e.g. "blog" + "posts" both live at /blog).
  const merged = new Map<string, SiteSection>();
  (cmsSections.filter(Boolean) as SiteSection[]).forEach((section) => {
    const key = section.indexPath || section.id;
    const existing = merged.get(key);
    if (existing) {
      existing.entries.push(...section.entries);
      existing.entries.sort((a, b) => b.lastModified.localeCompare(a.lastModified));
    } else {
      merged.set(key, section);
    }
  });

  return [
    staticSection("core", "The Group", "Core pages describing FourSix46 and its ventures."),
    staticSection("intelligence", "Intelligence & Media", "Publications, news, careers and contact."),
    ...Array.from(merged.values()),
    staticSection("legal", "Legal & Utility", "Policies and site navigation."),
  ].filter((section) => section.entries.length > 0);
}

/** Flat list of every public URL — used by sitemap.xml and llms.txt. */
export async function getAllSiteEntries(): Promise<SiteEntry[]> {
  const sections = await getSiteSections();
  const seen = new Set<string>();
  const all: SiteEntry[] = [];

  sections.forEach((section) => {
    section.entries.forEach((entry) => {
      if (seen.has(entry.path)) return;
      seen.add(entry.path);
      all.push(entry);
    });
  });

  return all;
}
