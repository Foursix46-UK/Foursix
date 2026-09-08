// app/trademarks/page.tsx
import { Metadata } from "next";
import { collection, getDocs, query, limit } from "firebase/firestore/lite";
import { db } from "@/lib/firebase-lite";
import JsonLd from "@/components/seo/JsonLd";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import Trademarks from "@/components/sections/Trademarks";
import { TRADEMARKS_DEFAULTS } from "@/lib/trademarks-content";
import {
  buildMetadata,
  graph,
  webPageNode,
  breadcrumbNode,
  faqNode,
  clean,
  plainText,
  toIso,
  absoluteUrl,
  SITE_URL,
  ORG_ID,
} from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const fallbackTitle = TRADEMARKS_DEFAULTS.seoTitle;
  const fallbackDescription = TRADEMARKS_DEFAULTS.seoDescription;

  try {
    const snapshot = await getDocs(query(collection(db, "page_trademarks"), limit(1)));
    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      return buildMetadata({
        title: data.seoTitle || fallbackTitle,
        description: data.seoDescription || fallbackDescription,
        path: "/trademarks",
      });
    }
  } catch (error) {
    console.error("Error fetching trademarks metadata:", error);
  }

  return buildMetadata({ title: fallbackTitle, description: fallbackDescription, path: "/trademarks" });
}

export default async function TrademarksPageServer() {
  // Start from the shared defaults, then let the CMS document override whatever it
  // defines. This means the page is complete the moment it ships, a half-filled
  // document never blanks out a section, and editing in the admin still wins.
  let pageData: any = { ...TRADEMARKS_DEFAULTS };

  try {
    const snapshot = await getDocs(query(collection(db, "page_trademarks"), limit(1)));
    if (!snapshot.empty) {
      pageData = { ...TRADEMARKS_DEFAULTS, ...snapshot.docs[0].data() };
    }
  } catch (error) {
    console.error("Error fetching trademarks page data:", error);
  }

  // Flatten every mark across jurisdictions so each one can be published as its own
  // node. This is what lets a search engine or model answer "is FourSix46 a registered
  // trademark, and under what number" without parsing the visible table.
  const allMarks: any[] = Array.isArray(pageData?.jurisdictions)
    ? pageData.jurisdictions.flatMap((jur: any) =>
        (Array.isArray(jur.marks) ? jur.marks : []).map((mark: any) => ({ ...mark, jurisdiction: jur }))
      )
    : [];

  const schema = graph(
    webPageNode({
      path: "/trademarks",
      name: pageData?.seoTitle || pageData?.heroTitle || "Trademarks | FourSix46®",
      description: pageData?.seoDescription || plainText(pageData?.heroLede1, 300),
      type: "CollectionPage",
      primaryEntityId: `${SITE_URL}/trademarks#register`,
      dateModified: toIso(pageData?.updatedAt),
    }),
    breadcrumbNode([{ name: "Trademarks", path: "/trademarks" }]),
    allMarks.length > 0
      ? {
          "@type": "ItemList",
          "@id": `${SITE_URL}/trademarks#register`,
          name: "FourSix46 trademark register",
          numberOfItems: allMarks.length,
          itemListElement: allMarks.map((mark: any, index: number) =>
            clean({
              "@type": "ListItem",
              position: index + 1,
              item: clean({
                // A trademark is an intangible product of the mind; Google understands
                // CreativeWork far better than any bespoke type would be understood.
                "@type": "CreativeWork",
                name: mark.name,
                additionalType: "https://schema.org/Intangible",
                description: [mark.kind, mark.statusLabel, mark.jurisdiction?.name]
                  .filter(Boolean)
                  .join(" · ") || undefined,
                identifier: mark.applicationNumber || undefined,
                creditText: mark.owner || undefined,
                copyrightHolder: mark.owner ? { "@type": "Organization", name: mark.owner } : undefined,
                url: mark.recordUrl || absoluteUrl("/trademarks"),
                about: { "@id": ORG_ID },
              }),
            })
          ),
        }
      : null,
    faqNode(
      Array.isArray(pageData?.faqs)
        ? pageData.faqs.filter((f: any) => f?.question && f?.answer)
        : [],
      "/trademarks"
    )
  );

  return (
    <main className="min-h-screen bg-black text-white selection:bg-primary selection:text-white font-sans tracking-tight">
      <JsonLd data={schema} id="schema-trademarks" />
      <Navbar />
      <Trademarks data={JSON.parse(JSON.stringify(pageData || {}))} />
      <Footer />
    </main>
  );
}
