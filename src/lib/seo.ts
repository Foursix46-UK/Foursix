// src/lib/seo.ts
// Single source of truth for canonical URLs, page metadata and JSON-LD structured data.
//
// ⚠️ REGISTERED ADDRESS NOTICE
// The postal address below is copied verbatim from the live Companies House record for
// FourSix46 Global Ltd (Company No. 16712658). If the registered office ever changes,
// update it HERE and nowhere else — a mismatch between the site schema and the government
// record is worse for trust signals than publishing no address at all.
// Source: https://find-and-update.company-information.service.gov.uk/company/16712658

import type { Metadata } from "next";

/* ------------------------------------------------------------------ */
/* Core constants                                                      */
/* ------------------------------------------------------------------ */

export const SITE_URL = "https://foursix46.com";
export const SITE_NAME = "FourSix46";
export const LEGAL_NAME = "FourSix46 Global Ltd";
export const COMPANY_NUMBER = "16712658";
export const COMPANIES_HOUSE_URL = `https://find-and-update.company-information.service.gov.uk/company/${COMPANY_NUMBER}`;
export const DEFAULT_OG_IMAGE = `${SITE_URL}/logo.png`;
export const LOCALE = "en_GB";

/** Stable @id anchors so every node across the site merges into one entity graph. */
export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const FOUNDER_ID = "https://www.46dc.com/#person";

/**
 * Never indexed: authenticated tooling, API handlers and post-action confirmations.
 * Consumed by robots.txt, the sitemap and the HTML sitemap so the exclusion list has
 * exactly one definition.
 */
export const EXCLUDED_PATHS = ["/admin", "/api", "/subscribed"];

/* ------------------------------------------------------------------ */
/* URL helpers                                                         */
/* ------------------------------------------------------------------ */

/** Turns "/about" or "about" into an absolute, trailing-slash-free canonical URL. */
export function absoluteUrl(path: string = "/"): string {
  if (!path || path === "/") return SITE_URL;
  if (path.startsWith("http")) return path;
  // Collapse duplicate slashes and drop any trailing one so canonicals never vary.
  const normalized = `/${path}`.replace(/\/+/g, "/").replace(/\/$/, "");
  return `${SITE_URL}${normalized}`;
}

/** Strips markdown noise so answers/summaries read cleanly inside JSON-LD. */
export function plainText(input?: string | null, maxLength = 5000): string {
  if (!input) return "";
  const text = String(input)
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")        // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")     // links -> label
    .replace(/[#*_`>~]/g, "")                    // md symbols
    .replace(/\s+/g, " ")
    .trim();
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
}

/** Drops undefined/null/empty members so we never emit half-empty JSON-LD nodes. */
export function clean<T extends Record<string, any>>(node: T): T {
  const out: Record<string, any> = {};
  for (const [key, value] of Object.entries(node)) {
    if (value === undefined || value === null || value === "") continue;
    if (Array.isArray(value) && value.length === 0) continue;
    out[key] = value;
  }
  return out as T;
}

/** Safely converts a Firestore Timestamp / Date / string into an ISO string. */
export function toIso(value: any): string {
  try {
    if (!value) return new Date().toISOString();
    if (typeof value?.toDate === "function") return value.toDate().toISOString();
    if (value instanceof Date) return value.toISOString();
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
  } catch {
    return new Date().toISOString();
  }
}

/* ------------------------------------------------------------------ */
/* Metadata builder — canonical + OG + Twitter + robots on every page   */
/* ------------------------------------------------------------------ */

type BuildMetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  modifiedTime?: string;
  /** Set true for utility pages that must stay out of the index (thank-you, admin). */
  noindex?: boolean;
  keywords?: string[];
};

export function buildMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  noindex = false,
  keywords,
}: BuildMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const ogImage = image && image !== "/placeholder.jpg" ? image : DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    robots: noindex
      ? { index: false, follow: true, nocache: true }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: LOCALE,
      type: type === "profile" ? "profile" : type,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
      site: "@FourSix46HQ",
      creator: "@FourSix46HQ",
    },
  };
}

/* ------------------------------------------------------------------ */
/* Entity nodes — the permanent identity of the business               */
/* ------------------------------------------------------------------ */

/** The founder. Referenced by @id from every article, venture and the org itself. */
export function founderNode() {
  return {
    "@type": "Person",
    "@id": FOUNDER_ID,
    name: "Dinesh Koyyalamudi",
    alternateName: "46DC",
    url: "https://www.46dc.com",
    jobTitle: "Founder",
    nationality: { "@type": "Country", name: "India" },
    homeLocation: { "@type": "Place", name: "London, United Kingdom" },
    worksFor: { "@id": ORG_ID },
    founderOf: { "@id": ORG_ID },
    sameAs: [
      "https://www.46dc.com",
      "https://dineshkoyyalamudi.com",
      "https://www.linkedin.com/company/foursix46",
    ],
  };
}

/**
 * The parent company. Address and identifier mirror Companies House exactly.
 * Sub-organisations listed here are the permanent brand family; the homepage
 * merges CMS-managed ventures into the same @id at runtime.
 */
export function organizationNode() {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: LEGAL_NAME,
    legalName: LEGAL_NAME,
    alternateName: ["FourSix46", "FourSix46®", "46"],
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      "@id": `${SITE_URL}/#logo`,
      url: DEFAULT_OG_IMAGE,
      contentUrl: DEFAULT_OG_IMAGE,
      caption: LEGAL_NAME,
    },
    image: { "@id": `${SITE_URL}/#logo` },
    description:
      "FourSix46® Global Ltd is a UK-based parent brand building scalable ventures across technology and emerging industries, with logistics forming part of its structured, system-driven ecosystem.",
    identifier: COMPANY_NUMBER,
    foundingDate: "2025-09-11",
    founder: { "@id": FOUNDER_ID },
    address: {
      "@type": "PostalAddress",
      streetAddress: "66 Paul Street",
      addressLocality: "London",
      postalCode: "EC2A 4NA",
      addressCountry: "GB",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+44 330 124 1966",
        email: "contact@foursix46.com",
        contactType: "customer service",
        areaServed: "GB",
        availableLanguage: ["en"],
      },
    ],
    subOrganization: [
      { "@type": "Organization", name: "Route46 Couriers", url: "https://route46couriers.co.uk" },
      { "@type": "Organization", name: "Stack46", url: "https://stack46.co.uk" },
      { "@type": "Organization", name: "Cinevenn", url: "https://cinevenn.com" },
      { "@type": "Organization", name: "46Dogs", url: "https://www.46dogs.com" },
    ],
    sameAs: [
      "https://www.46dc.com",
      COMPANIES_HOUSE_URL,
      "https://www.linkedin.com/company/foursix46",
      "https://x.com/FourSix46HQ",
      "https://www.instagram.com/foursix46hq/",
      "https://www.facebook.com/FourSix46hq",
      "https://www.youtube.com/@Foursix46hq",
      "https://www.tiktok.com/@foursix46hq",
    ],
  };
}

/** The website itself, with a SearchAction so Google can offer a sitelinks searchbox. */
export function websiteNode() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    description:
      "The official site of FourSix46® Global Ltd — ventures, leadership, publications and newsroom.",
    publisher: { "@id": ORG_ID },
    inLanguage: "en-GB",
  };
}

/** Emitted once from the root layout <head> — renders on every single page. */
export function globalGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [clean(organizationNode()), clean(founderNode()), clean(websiteNode())],
  };
}

/* ------------------------------------------------------------------ */
/* Per-page node builders                                              */
/* ------------------------------------------------------------------ */

export type Crumb = { name: string; path: string };

/** BreadcrumbList — gives Google the path chip under every result. */
export function breadcrumbNode(crumbs: Crumb[]) {
  const trail: Crumb[] = [{ name: "Home", path: "/" }, ...crumbs];
  return {
    "@type": "BreadcrumbList",
    "@id": `${absoluteUrl(trail[trail.length - 1].path)}#breadcrumb`,
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

type WebPageInput = {
  path: string;
  name: string;
  description?: string;
  /** AboutPage, ContactPage, CollectionPage, FAQPage, ProfilePage, ImageGallery… */
  type?: string;
  image?: string | null;
  datePublished?: string;
  dateModified?: string;
  primaryEntityId?: string;
  hasBreadcrumb?: boolean;
};

/** The WebPage wrapper every route should emit, bound to the site + org graph. */
export function webPageNode({
  path,
  name,
  description,
  type = "WebPage",
  image,
  datePublished,
  dateModified,
  primaryEntityId,
  hasBreadcrumb = true,
}: WebPageInput) {
  const url = absoluteUrl(path);
  return clean({
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    name,
    description: plainText(description, 300) || undefined,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    inLanguage: "en-GB",
    primaryImageOfPage: image ? { "@type": "ImageObject", url: image } : undefined,
    datePublished,
    dateModified: dateModified || datePublished,
    mainEntity: primaryEntityId ? { "@id": primaryEntityId } : undefined,
    breadcrumb: hasBreadcrumb ? { "@id": `${url}#breadcrumb` } : undefined,
  });
}

export type FaqInput = { question: string; answer: string };

/** FAQPage — eligible for the expandable FAQ rich result. */
export function faqNode(faqs: FaqInput[], path: string) {
  const entities = (faqs || [])
    .filter((f) => f?.question && f?.answer)
    .map((f) => ({
      "@type": "Question",
      name: plainText(f.question, 300),
      acceptedAnswer: { "@type": "Answer", text: plainText(f.answer, 1500) },
    }));

  if (entities.length === 0) return null;

  return {
    "@type": "FAQPage",
    "@id": `${absoluteUrl(path)}#faq`,
    mainEntity: entities,
  };
}

type ArticleInput = {
  path: string;
  headline: string;
  description?: string;
  image?: string | null;
  datePublished: string;
  dateModified?: string;
  /** "NewsArticle" for press releases, "Article"/"BlogPosting" for editorial. */
  type?: "Article" | "NewsArticle" | "BlogPosting";
  authorName?: string;
  authorIsFounder?: boolean;
  section?: string;
  wordCount?: number;
  body?: string;
};

/** Article / NewsArticle / BlogPosting node for any CMS-authored long-form page. */
export function articleNode({
  path,
  headline,
  description,
  image,
  datePublished,
  dateModified,
  type = "Article",
  authorName,
  authorIsFounder = false,
  section,
  wordCount,
  body,
}: ArticleInput) {
  const url = absoluteUrl(path);
  const author = authorIsFounder
    ? { "@id": FOUNDER_ID }
    : authorName
    ? { "@type": "Person", name: authorName }
    : { "@id": ORG_ID };

  return clean({
    "@type": type,
    "@id": `${url}#article`,
    headline: plainText(headline, 110),
    name: plainText(headline, 110),
    description: plainText(description, 300) || undefined,
    image: image ? [image] : undefined,
    datePublished,
    dateModified: dateModified || datePublished,
    author,
    publisher: { "@id": ORG_ID },
    isPartOf: { "@id": WEBSITE_ID },
    mainEntityOfPage: url,
    articleSection: section,
    wordCount,
    inLanguage: "en-GB",
    about: [{ "@id": ORG_ID }, { "@id": FOUNDER_ID }],
    articleBody: body ? plainText(body, 5000) : undefined,
  });
}

/** Wraps any set of nodes in a single @graph so one <script> covers the page. */
export function graph(...nodes: Array<Record<string, any> | null | undefined>) {
  const list = nodes.filter(Boolean) as Record<string, any>[];
  return { "@context": "https://schema.org", "@graph": list };
}
