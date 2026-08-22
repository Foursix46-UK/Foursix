// app/ventures/page.tsx
//reference ventures/page.tsx
import { Metadata } from "next";
import { collection, getDocs, query, limit, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import JsonLd from "@/components/seo/JsonLd";
import {
  buildMetadata,
  graph,
  webPageNode,
  breadcrumbNode,
  clean,
  plainText,
  absoluteUrl,
  toIso,
  SITE_URL,
} from "@/lib/seo";
import VenturesClient from "./VenturesClient"; 

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const fallbackTitle = "Our Ventures | FourSix46";
  const fallbackDescription =
    "FourSix46 actively manages a diverse portfolio of disruptive brands across logistics, technology and media.";

  try {
    // We look at the "page_ventures" document for the SEO fields
    const q = query(collection(db, "page_ventures"), limit(1));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      return buildMetadata({
        title: data.seoTitle || fallbackTitle,
        description: data.seoDescription || data.heroSubtitle || fallbackDescription,
        path: "/ventures",
        image: data.ogImage,
      });
    }
  } catch (error) {
    console.error("Error fetching ventures metadata:", error);
  }

  return buildMetadata({ title: fallbackTitle, description: fallbackDescription, path: "/ventures" });
}

export default async function VenturesPageServer() {
  // 👇 1. FETCH UI DATA AND VENTURES LIST ON THE SERVER
  let pageData: any = null;
  let venturesData: any[] = [];
  
  try {
    // Fetch Hero Data
    const qPage = query(collection(db, "page_ventures"), limit(1));
    const snapshotPage = await getDocs(qPage);
    if (!snapshotPage.empty) pageData = snapshotPage.docs[0].data();

    // Fetch Ventures List
    const qVentures = query(collection(db, "ventures"), orderBy("displayOrder", "asc"));
    const snapshotVentures = await getDocs(qVentures);
    venturesData = snapshotVentures.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching ventures page data:", error);
  }

  const publicVentures = venturesData.filter((venture: any) => venture.visibilityToggle !== false);

  const collectionSchema = graph(
    webPageNode({
      path: "/ventures",
      name: pageData?.seoTitle || "Our Ventures | FourSix46",
      description:
        pageData?.seoDescription || pageData?.heroSubtitle || "The collective portfolio of FourSix46 ventures.",
      type: "CollectionPage",
      primaryEntityId: `${SITE_URL}/ventures#list`,
      dateModified: toIso(pageData?.updatedAt),
    }),
    breadcrumbNode([{ name: "Ventures", path: "/ventures" }]),
    {
      "@type": "ItemList",
      "@id": `${SITE_URL}/ventures#list`,
      name: "FourSix46 ventures",
      numberOfItems: publicVentures.length,
      itemListElement: publicVentures.map((venture: any, index: number) =>
        clean({
          "@type": "ListItem",
          position: index + 1,
          url: venture.ventureSlug ? absoluteUrl(`/ventures/${venture.ventureSlug}`) : undefined,
          item: clean({
            "@type": "Organization",
            name: venture.title || venture.name,
            description: plainText(venture.ventureTagline, 200) || undefined,
            url: venture.ventureSlug ? absoluteUrl(`/ventures/${venture.ventureSlug}`) : undefined,
          }),
        })
      ),
    }
  );

  return (
    <>
      <JsonLd data={collectionSchema} id="schema-ventures" />
      {/* 👇 2. PASS BOTH TO THE CLIENT (Safely stringified to prevent call stack error) */}
      <VenturesClient 
        initialPageData={JSON.parse(JSON.stringify(pageData || {}))} 
        initialVentures={JSON.parse(JSON.stringify(venturesData || []))} 
      />
    </>
  );
}