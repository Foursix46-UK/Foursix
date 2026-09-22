// app/press/page.tsx
//
// Server component with no client state: every mention is in the HTML sent to the
// browser, so crawlers and models that don't run JavaScript read the full list.
import { Metadata } from "next";
import { collection, getDocs, query, where, limit } from "firebase/firestore/lite";
import { db } from "@/lib/firebase-lite";
import JsonLd from "@/components/seo/JsonLd";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import PressList, { type PressMention } from "@/components/sections/PressList";
import { PRESS_PAGE_DEFAULTS } from "@/lib/press-defaults";
import { getFirebaseImageUrl } from "@/lib/utils";
import {
  buildMetadata,
  graph,
  webPageNode,
  breadcrumbNode,
  clean,
  toIso,
  SITE_URL,
} from "@/lib/seo";

// New coverage appears within a minute of being published in the CMS.
export const revalidate = 60;

async function getSettings() {
  try {
    const snap = await getDocs(query(collection(db, "pressPageSettings"), limit(1)));
    // Defaults first so a half-filled document never blanks out a block.
    return snap.empty
      ? { ...PRESS_PAGE_DEFAULTS }
      : { ...PRESS_PAGE_DEFAULTS, ...stripEmpty(snap.docs[0].data()) };
  } catch (error) {
    console.error("Error fetching press page settings:", error);
    return { ...PRESS_PAGE_DEFAULTS };
  }
}

/** An editor clearing a field in the CMS stores "", which should fall back, not render blank. */
function stripEmpty(data: Record<string, any>) {
  return Object.fromEntries(Object.entries(data).filter(([, v]) => v !== "" && v != null));
}

function toMillis(raw: any): number {
  if (!raw) return 0;
  if (typeof raw === "number") return raw;
  if (typeof raw?.toMillis === "function") return raw.toMillis();
  if (typeof raw?.seconds === "number") return raw.seconds * 1000;
  const parsed = new Date(raw).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
}

/** Storage fields hold bucket paths; the helper turns them into URLs. Empty stays empty. */
function mediaUrl(path?: string) {
  return path ? getFirebaseImageUrl(path) : "";
}

async function getMentions(): Promise<PressMention[]> {
  try {
    // Filter on status only and sort here: status + sortOrder in one query would need
    // a composite index, and a missing index fails the whole page rather than one sort.
    const snap = await getDocs(query(collection(db, "pressMentions"), where("status", "==", "published")));
    return snap.docs
      .map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          title: String(d.title || ""),
          outlet: String(d.outlet || ""),
          mediaType: String(d.mediaType || ""),
          dateMs: toMillis(d.date),
          url: String(d.url || ""),
          description: String(d.description || ""),
          pullQuote: String(d.pullQuote || ""),
          thumbnail: mediaUrl(d.thumbnail),
          thumbnailAlt: String(d.thumbnailAlt || ""),
          outletLogo: mediaUrl(d.outletLogo),
          downloadableAsset: mediaUrl(d.downloadableAsset),
          featured: d.featured === true,
          sortOrder: typeof d.sortOrder === "number" ? d.sortOrder : 0,
        };
      })
      .filter((m) => m.title && m.url)
      .sort(
        (a, b) =>
          Number(b.featured) - Number(a.featured) ||
          a.sortOrder - b.sortOrder ||
          b.dateMs - a.dateMs
      );
  } catch (error) {
    console.error("Error fetching press mentions:", error);
    return [];
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return buildMetadata({
    title: s.seoTitle || s.title,
    description: s.seoDescription || s.description,
    path: "/press",
    image: s.ogImage ? getFirebaseImageUrl(s.ogImage) : undefined,
  });
}

export default async function PressPage() {
  const [s, mentions] = await Promise.all([getSettings(), getMentions()]);

  const schemaData = graph(
    webPageNode({
      type: "CollectionPage",
      path: "/press",
      name: s.title,
      description: s.description,
    }),
    breadcrumbNode([{ name: "Press & Media", path: "/press" }]),
    {
      "@type": "ItemList",
      "@id": `${SITE_URL}/press#list`,
      name: "Press coverage of FourSix46",
      numberOfItems: mentions.length,
      itemListElement: mentions.map((m, index) => ({
        "@type": "ListItem",
        position: index + 1,
        // The coverage lives on the outlet's site, so describe it as their article
        // rather than claiming it as a page of ours.
        item: clean({
          "@type": "Article",
          headline: m.title,
          url: m.url,
          datePublished: m.dateMs ? toIso(new Date(m.dateMs)) : undefined,
          publisher: m.outlet ? { "@type": "Organization", name: m.outlet } : undefined,
          about: { "@id": `${SITE_URL}/#organization` },
        }),
      })),
    }
  );

  const heroImage = mediaUrl(s.heroBackground);
  const mediaKitUrl = mediaUrl(s.mediaKitUrl);

  return (
    <main className="min-h-screen bg-black text-white selection:bg-primary selection:text-white font-sans">
      <JsonLd data={schemaData} id="schema-press" />
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        {heroImage && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={heroImage} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-25" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black" />
          </>
        )}
        <div className="relative pt-40 pb-20 px-6 max-w-7xl mx-auto">
          <nav aria-label="Breadcrumb" className="mb-8 text-xs text-white/40">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span className="mx-2">/</span>
            <span className="text-white/70">Press &amp; Media</span>
          </nav>
          {s.subtitle && (
            <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.5em] text-primary mb-6 block">
              {s.subtitle}
            </span>
          )}
          <h1 className="text-5xl md:text-7xl font-medium tracking-tight leading-[1.05] mb-8">{s.title}</h1>
          {s.description && (
            <p className="text-lg md:text-xl font-light text-white/60 leading-relaxed max-w-3xl">{s.description}</p>
          )}
        </div>
      </section>

      {/* Coverage */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <PressList mentions={mentions} />
      </section>

      {/* Media kit — only once a file exists, so the button never leads nowhere */}
      {mediaKitUrl && (
        <section className="px-6 pb-20 max-w-7xl mx-auto">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 md:p-14 text-center">
            <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-5">{s.mediaAssetsTitle}</h2>
            {s.mediaAssetsDescription && (
              <p className="text-white/60 font-light max-w-xl mx-auto mb-10 text-lg">{s.mediaAssetsDescription}</p>
            )}
            <a
              href={mediaKitUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-white hover:bg-primary/90 transition-colors"
            >
              {s.mediaKitLabel}
            </a>
          </div>
        </section>
      )}

      {/* Press contact */}
      <section className="px-6 pb-28 max-w-7xl mx-auto">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 md:p-14 grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            {s.contactSubtitle && (
              <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-primary mb-4 block">
                {s.contactSubtitle}
              </span>
            )}
            <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-5">{s.contactTitle}</h2>
            {s.contactDescription && <p className="text-white/60 font-light leading-relaxed">{s.contactDescription}</p>}
          </div>
          <dl className="grid gap-6">
            {s.contactEmail && (
              <div>
                <dt className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2">Email</dt>
                <dd>
                  <a href={`mailto:${s.contactEmail}`} className="text-xl text-white hover:text-primary transition-colors">
                    {s.contactEmail}
                  </a>
                </dd>
              </div>
            )}
            {s.contactPhone && (
              <div>
                <dt className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2">Phone</dt>
                <dd>
                  <a href={`tel:${s.contactPhone.replace(/[^+\d]/g, "")}`} className="text-xl text-white hover:text-primary transition-colors">
                    {s.contactPhone}
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </div>
      </section>

      <Footer />
    </main>
  );
}
