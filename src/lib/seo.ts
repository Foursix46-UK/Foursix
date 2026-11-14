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
export const FOUNDER_NAME = "Dinesh Koyyalamudi";
export const CRUNCHBASE_URL = "https://www.crunchbase.com/organization/foursix46-global-ltd";

/** The founder's verified profiles. One list, used by every Person node that is him. */
export const FOUNDER_SAME_AS = [
  "https://www.linkedin.com/in/the46dc",
  "https://www.instagram.com/the46dc",
  "https://x.com/the46dc",
  "https://www.youtube.com/@the46dc",
  "https://www.facebook.com/im46dc",
  "https://www.brainzmagazine.com/executive-contributor/dinesh-koyyalamudi",
  "https://find-and-update.company-information.service.gov.uk/officers/KEy5zXSxMdz_a2OhToW-n420mp0/appointments",
  "https://www.crunchbase.com/person/dinesh-koyyalamudi",
];

/** True when a CMS name refers to the founder, so the node can carry his site-wide @id. */
export function isFounderName(name?: string | null): boolean {
  return /46dc|dinesh\s+koyyalamudi/i.test(String(name || ""));
}

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

const HTML_ENTITIES: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
  rsquo: "\u2019", lsquo: "\u2018", rdquo: "\u201D", ldquo: "\u201C",
  ndash: "\u2013", mdash: "\u2014", hellip: "\u2026", reg: "\u00AE", copy: "\u00A9", trade: "\u2122",
  pound: "\u00A3", euro: "\u20AC", middot: "\u00B7", bull: "\u2022",
};

/** Rich-text (HTML) -> plain text: drops every tag and decodes entities. */
function htmlToText(html: string): string {
  return html
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&([a-z]+);/gi, (match, name) => HTML_ENTITIES[name.toLowerCase()] ?? match);
}

/**
 * Cleans CMS text (markdown or rich-text HTML) into plain text.
 *
 * With no `maxLength` the FULL text is returned — this is what every JSON-LD value
 * must use: structured data is never cut short with "…". Pass a `maxLength` only for
 * <meta> descriptions and other places where a length limit is the point.
 */
export function plainText(input?: string | null, maxLength?: number): string {
  if (!input) return "";
  const raw = String(input);
  const isHtml = /<\/?[a-z][^>]*>/i.test(raw);
  const text = (
    isHtml
      ? htmlToText(raw)
      : raw
          .replace(/!\[[^\]]*\]\([^)]*\)/g, "")        // images
          .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")     // links -> label
          .replace(/[#*_`>~]/g, "")                    // md symbols
  )
    .replace(/\s+/g, " ")
    .trim();
  return maxLength && text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
}

/** Removes quote marks an editor wrapped around a whole field ("…" / “…”). */
export function stripWrappingQuotes(input?: string | null): string {
  const text = String(input || "").trim();
  const match = text.match(/^["\u201C\u2018']([\s\S]*)["\u201D\u2019']$/);
  return match ? match[1].trim() : text;
}

/** "+44 0330 124 1966" -> "+44 330 124 1966": no trunk zero after the country code. */
export function schemaTelephone(input?: string | null): string {
  return String(input || "")
    .trim()
    .replace(/^\+44\s*\(?0\)?\s*/, "+44 ");
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
    name: FOUNDER_NAME,
    alternateName: "46DC",
    url: "https://www.46dc.com",
    jobTitle: "Founder",
    nationality: { "@type": "Country", name: "India" },
    homeLocation: { "@type": "Place", name: "London, United Kingdom" },
    worksFor: { "@id": ORG_ID },
    sameAs: FOUNDER_SAME_AS,
  };
}

/** The founder's full Person entry, used on his own leadership profile page. */
export function founderProfileNode(image?: string | null) {
  return clean({
    "@type": "Person",
    "@id": FOUNDER_ID,
    name: FOUNDER_NAME,
    jobTitle: "Founder",
    description:
      "Founder of FourSix46®, Cinevenn and 46Dogs. Business & brand consultant to early-stage founders. Building in public, one venture at a time.",
    image: image || undefined,
    url: "https://www.46dc.com",
    worksFor: { "@id": ORG_ID },
    sameAs: FOUNDER_SAME_AS,
  });
}

/** Trading names of FourSix46 Global Ltd — referenced by the org node and by job postings. */
export const STACK46_ORG_ID = "https://stack46.com/#organization";
export const ROUTE46_ORG_ID = "https://www.route46couriers.co.uk/#organization";

/**
 * The parent company. Address and identifier mirror Companies House exactly.
 * Only the two trading names are sub-organisations; Cinevenn (its own company) and
 * 46Dogs (an independent charity) are deliberately not listed.
 */
export function organizationNode() {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE_NAME,
    legalName: LEGAL_NAME,
    alternateName: [LEGAL_NAME, "FourSix46®", "46"],
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
      "FourSix46® Global Ltd is a UK-registered parent brand building scalable ventures across technology and emerging industries, with logistics forming part of its structured, system-driven ecosystem.",
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
      {
        "@type": "Organization",
        "@id": STACK46_ORG_ID,
        name: "Stack46",
        url: "https://stack46.com",
        sameAs: ["https://www.crunchbase.com/organization/stack46"],
      },
      {
        "@type": "Organization",
        "@id": ROUTE46_ORG_ID,
        name: "Route46 Couriers",
        url: "https://www.route46couriers.co.uk",
        sameAs: ["https://www.crunchbase.com/organization/route46-couriers"],
      },
    ],
    sameAs: [
      COMPANIES_HOUSE_URL,
      "https://www.linkedin.com/company/foursix46",
      "https://x.com/FourSix46HQ",
      "https://www.instagram.com/foursix46hq/",
      "https://www.facebook.com/FourSix46hq",
      "https://www.youtube.com/@Foursix46hq",
      "https://www.tiktok.com/@foursix46hq",
      CRUNCHBASE_URL,
    ],
  };
}

/* ------------------------------------------------------------------ */
/* Ventures — schema facts that differ per venture                     */
/* ------------------------------------------------------------------ */

type VentureSchemaFacts = {
  sameAs: string[];
  /** False for separate legal entities (Cinevenn Ltd, the 46Dogs charity). */
  hasParent: boolean;
  /** Tag shown on the homepage venture card when the CMS "Card tag" is empty. */
  cardTag: string;
};

/** Keyed by lower-cased venture slug. CMS fields on the venture record override these. */
const VENTURE_SCHEMA_FACTS: Record<string, VentureSchemaFacts> = {
  stack46: {
    sameAs: ["https://stack46.com", "https://www.crunchbase.com/organization/stack46"],
    hasParent: true,
    cardTag: "Trading name",
  },
  "route46-couriers": {
    sameAs: ["https://www.route46couriers.co.uk", "https://www.crunchbase.com/organization/route46-couriers"],
    hasParent: true,
    cardTag: "Trading name",
  },
  cinevenn: {
    sameAs: ["https://www.cinevenn.com", "https://www.crunchbase.com/organization/cinevenn"],
    hasParent: false,
    cardTag: "Venture · Cinevenn Ltd",
  },
  "46dogs": {
    sameAs: ["https://46dogs.org"],
    hasParent: false,
    cardTag: "Independent charity",
  },
};

export function ventureSchemaFacts(slug?: string | null): VentureSchemaFacts | undefined {
  return VENTURE_SCHEMA_FACTS[String(slug || "").trim().toLowerCase()];
}

/** The tag on a venture card: the CMS "Card tag" first, then the per-venture default. */
export function ventureCardTag(venture: { cardTag?: string; ventureSlug?: string }): string {
  return String(venture?.cardTag || "").trim() || ventureSchemaFacts(venture?.ventureSlug)?.cardTag || "";
}

/**
 * hiringOrganization for a job posting, from the job's "Department / Venture" field.
 * Stack46 and Route46 Couriers hire under their own names; anything else is the parent.
 */
export function hiringOrganizationNode(departmentVenture?: string | null) {
  const key = String(departmentVenture || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  if (key.includes("stack46")) {
    return {
      "@type": "Organization",
      "@id": STACK46_ORG_ID,
      name: "Stack46",
      sameAs: "https://stack46.com",
      logo: "https://stack46.com/logo.png",
    };
  }
  if (key.includes("route46")) {
    return {
      "@type": "Organization",
      "@id": ROUTE46_ORG_ID,
      name: "Route46 Couriers",
      sameAs: "https://www.route46couriers.co.uk",
      logo: "https://www.route46couriers.co.uk/route46logo.png",
    };
  }
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE_NAME,
    sameAs: SITE_URL,
    logo: DEFAULT_OG_IMAGE,
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
    description: plainText(description) || undefined,
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

/** Normalises a CMS FAQ array into clean question/answer pairs. */
export function toFaqItems(raw: any): FaqInput[] {
  return Array.isArray(raw)
    ? raw
        .filter((f: any) => f?.question && f?.answer)
        .map((f: any) => ({ question: f.question, answer: f.answer }))
    : [];
}

/** FAQPage — eligible for the expandable FAQ rich result. */
export function faqNode(faqs: FaqInput[], path: string) {
  const entities = (faqs || [])
    .filter((f) => f?.question && f?.answer)
    .map((f) => ({
      "@type": "Question",
      name: plainText(f.question),
      acceptedAnswer: { "@type": "Answer", text: plainText(f.answer) },
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
    ? clean({ "@type": "Person", "@id": isFounderName(authorName) ? FOUNDER_ID : undefined, name: authorName })
    : { "@id": ORG_ID };

  return clean({
    "@type": type,
    "@id": `${url}#article`,
    headline: plainText(headline),
    name: plainText(headline),
    description: plainText(description) || undefined,
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
    // Full plain text: no HTML tags, never truncated.
    articleBody: body ? plainText(body) : undefined,
  });
}

/** Wraps any set of nodes in a single @graph so one <script> covers the page. */
export function graph(...nodes: Array<Record<string, any> | null | undefined>) {
  const list = nodes.filter(Boolean) as Record<string, any>[];
  return { "@context": "https://schema.org", "@graph": list };
}
/* ------------------------------------------------------------------ */
/* Trademarks                                                          */
/* ------------------------------------------------------------------ */

/**
 * The ®/™ symbol is never stored in the CMS — see trademarkSchema.ts for why (using ®
 * on a mark before it is registered is an offence under the UK Trade Marks Act 1994
 * s.95 and India's Trade Marks Act 1999 s.107). This is the one place that derives it
 * from `status`, used by page metadata, JSON-LD and the visual UI alike, so none of
 * them can ever disagree about which symbol a mark is allowed to show.
 */
export function trademarkSymbol(status?: string | null): "®" | "™" {
  return status === "Registered" ? "®" : "™";
}

export type TrademarkClassInput = {
  classNumber: number;
  applicationNumber?: string;
};

export type TrademarkOwnerInput =
  | { kind: "organization"; id: string; name: string; companyNumber?: string }
  | { kind: "person"; id: string; name: string; legalName?: string; url?: string };

type TrademarkNodeInput = {
  path: string;
  markName: string;
  markType: string;
  description?: string;
  jurisdictionName: string;
  officeName: string;
  status: string;
  filingDate?: string;
  /** Mark-level number — used when the mark isn't filed as separate applications per class. */
  applicationNumber?: string;
  classes: TrademarkClassInput[];
  officialRecordUrl?: string;
  ventureUrl?: string;
  /** The same mark's page on the sibling site (46dc.com), once that side exists. */
  siblingSiteUrl?: string;
  owner: TrademarkOwnerInput;
};

/**
 * Schema.org has no native Trademark type. Per the spec this section implements, a
 * CreativeWork carrying registry facts in `identifier`/`additionalProperty`, tied to its
 * owner via `copyrightHolder` and to the official record via `sameAs`, is the workable
 * pattern. `sameAs` is load-bearing: it is what lets an AI system answer "is this mark
 * trademarked" with a government source attached, rather than trusting a company's own
 * claim. Returns both the mark node and its owner node — the spec's example emits both
 * into the same @graph, so callers pass both straight into `graph(...)`.
 */
export function trademarkNode({
  path,
  markName,
  markType,
  description,
  jurisdictionName,
  officeName,
  status,
  filingDate,
  applicationNumber,
  classes,
  officialRecordUrl,
  ventureUrl,
  siblingSiteUrl,
  owner,
}: TrademarkNodeInput) {
  const url = absoluteUrl(path);
  const symbol = trademarkSymbol(status);
  const markId = `${url}#mark`;

  const identifier = classes.length
    ? classes.map((c) => ({
        "@type": "PropertyValue",
        propertyID:
          classes.length > 1
            ? `Trade mark application number (Class ${c.classNumber})`
            : "Trade mark application number",
        value: c.applicationNumber || applicationNumber,
      }))
    : applicationNumber
    ? [{ "@type": "PropertyValue", propertyID: "Trade mark application number", value: applicationNumber }]
    : undefined;

  const ownerNode =
    owner.kind === "organization"
      ? clean({
          "@type": "Organization",
          "@id": owner.id,
          name: owner.name,
          url: SITE_URL,
          identifier: owner.companyNumber
            ? { "@type": "PropertyValue", propertyID: "Companies House number", value: owner.companyNumber }
            : undefined,
          owns: { "@id": markId },
        })
      : clean({
          "@type": "Person",
          "@id": owner.id,
          name: owner.name,
          // Carrying the registry legal name here is what lets a machine reconcile the
          // two names instead of treating them as two different people.
          alternateName: owner.legalName ? [owner.legalName] : undefined,
          url: owner.url,
          owns: { "@id": markId },
        });

  const mark = clean({
    "@type": "CreativeWork",
    "@id": markId,
    name: markName,
    alternateName: `${markName}${symbol}`,
    description: description ? plainText(description) : undefined,
    url,
    dateCreated: filingDate,
    sameAs: [officialRecordUrl, ventureUrl, siblingSiteUrl].filter(Boolean),
    identifier,
    copyrightHolder: { "@id": owner.id },
    additionalProperty: [
      { "@type": "PropertyValue", name: "Mark type", value: markType },
      { "@type": "PropertyValue", name: "Jurisdiction", value: jurisdictionName },
      { "@type": "PropertyValue", name: "Registry", value: officeName },
      { "@type": "PropertyValue", name: "Status", value: status },
      filingDate ? { "@type": "PropertyValue", name: "Filing date", value: filingDate } : undefined,
      classes.length
        ? {
            "@type": "PropertyValue",
            name: "Nice classes",
            value: classes.map((c) => c.classNumber).join(", "),
          }
        : undefined,
    ].filter(Boolean),
  });

  return { mark, owner: ownerNode };
}
