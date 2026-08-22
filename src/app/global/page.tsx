// app/global/page.tsx
import { Metadata } from "next";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
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
import GlobalClient from "./GlobalClient";

export const dynamic = 'force-dynamic';
export async function generateMetadata(): Promise<Metadata> {
  const fallbackTitle = "Global Presence | FourSix46";
  const fallbackDescription = "Explore the FourSix46 global nodes, markets and strategic operations.";

  try {
    const q = query(collection(db, "globalSettings"), limit(1));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      return buildMetadata({
        title: data.seoTitle || fallbackTitle,
        description: data.seoDescription || fallbackDescription,
        path: "/global",
        image: data.ogImage,
      });
    }
  } catch (error) {
    console.error("Error fetching global metadata:", error);
  }

  return buildMetadata({ title: fallbackTitle, description: fallbackDescription, path: "/global" });
}

export default async function GlobalPageServer() {
  let locationsData: any[] = [];
  let newsData: any[] = [];
  let statsData: any = null;

  try {
    // 1. Fetch Global Settings (for stats)
    const statsQuery = query(collection(db, "globalSettings"), limit(1));
    const statsSnapshot = await getDocs(statsQuery);
    if (!statsSnapshot.empty) statsData = statsSnapshot.docs[0].data();

    // 2. Fetch Locations
    const locQuery = query(collection(db, "global"), where("visibilityToggle", "==", true), orderBy("displayOrder", "asc"));
    const locSnapshot = await getDocs(locQuery);
    locationsData = locSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // 3. Fetch News
    const newsQuery = query(collection(db, "news"), where("showOnGlobalExpansion", "==", true), orderBy("publishDate", "desc"), limit(4));
    const newsSnapshot = await getDocs(newsQuery);
    newsData = newsSnapshot.docs.map(doc => {
      const data = doc.data();
      const dateObj = data.publishDate?.toDate() || new Date();
      return { 
        id: doc.id, 
        ...data, 
        date: dateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase() 
      };
    });

  } catch (error) {
    console.error("Error fetching global server data:", error);
  }

  const globalSchema = graph(
    webPageNode({
      path: "/global",
      name: statsData?.seoTitle || "Global Presence | FourSix46",
      description: statsData?.seoDescription || "FourSix46 global operations and regional nodes.",
      type: "CollectionPage",
      primaryEntityId: `${SITE_URL}/global#list`,
      dateModified: toIso(statsData?.updatedAt),
    }),
    breadcrumbNode([{ name: "Global", path: "/global" }]),
    {
      "@type": "ItemList",
      "@id": `${SITE_URL}/global#list`,
      name: "FourSix46 global nodes",
      numberOfItems: locationsData.length,
      itemListElement: locationsData.map((location: any, index: number) =>
        clean({
          "@type": "ListItem",
          position: index + 1,
          url: location.slug ? absoluteUrl(`/global/${location.slug}`) : undefined,
          item: clean({
            "@type": "Place",
            name: location.cityRegion,
            description: plainText(location.marketDescription, 200) || undefined,
            address: clean({
              "@type": "PostalAddress",
              addressLocality: location.cityRegion,
              addressCountry: location.country,
            }),
            url: location.slug ? absoluteUrl(`/global/${location.slug}`) : undefined,
          }),
        })
      ),
    }
  );

  return (
    <>
      <JsonLd data={globalSchema} id="schema-global" />
      <GlobalClient 
        initialLocations={JSON.parse(JSON.stringify(locationsData))}
        initialNews={JSON.parse(JSON.stringify(newsData))}
        initialStats={JSON.parse(JSON.stringify(statsData || {}))}
      />
    </>
  );
}