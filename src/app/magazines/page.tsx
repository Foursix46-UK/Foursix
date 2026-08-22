// app/magazines/page.tsx
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
import MagazinesClient from "./MagazinesClient";

export const dynamic = 'force-dynamic';
export async function generateMetadata(): Promise<Metadata> {
  const fallbackTitle = "Publications | FourSix46";
  const fallbackDescription =
    "The FourSix46 editorial archive — quarterly deep-dives into the philosophies driving our ventures.";

  try {
    const q = query(collection(db, "page_magazines"), limit(1));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      return buildMetadata({
        title: data.seoTitle || fallbackTitle,
        description: data.seoDescription || data.heroSubtitle || fallbackDescription,
        path: "/magazines",
        image: data.ogImage,
      });
    }
  } catch (error) {
    console.error("Error fetching magazines metadata:", error);
  }

  return buildMetadata({ title: fallbackTitle, description: fallbackDescription, path: "/magazines" });
}

export default async function MagazinesPageServer() {
  let pageData: any = null;
  let magazinesData: any[] = [];

  try {
    // Fetch Page Text
    const pageQ = query(collection(db, "page_magazines"), limit(1));
    const pageSnap = await getDocs(pageQ);
    if (!pageSnap.empty) pageData = pageSnap.docs[0].data();

    // Fetch Magazines List
    const magQ = query(collection(db, "magazines"), where("visibilityToggle", "==", true), orderBy("displayOrder", "asc"));
    const magSnap = await getDocs(magQ);
    magazinesData = magSnap.docs.map(doc => {
      const data = doc.data();
      const dateObj = data.publishDate?.toDate() || new Date();
      return { 
        id: doc.id, 
        ...data, 
        displayDate: dateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase(),
      };
    });
  } catch (error) {
    console.error("Error fetching magazines server data:", error);
  }

  const magazinesSchema = graph(
    webPageNode({
      path: "/magazines",
      name: pageData?.seoTitle || "Publications | FourSix46",
      description: pageData?.seoDescription || pageData?.heroSubtitle || "The FourSix46 editorial archive.",
      type: "CollectionPage",
      primaryEntityId: `${SITE_URL}/magazines#list`,
      dateModified: magazinesData[0] ? toIso(magazinesData[0].publishDate) : undefined,
    }),
    breadcrumbNode([{ name: "Publications", path: "/magazines" }]),
    {
      "@type": "ItemList",
      "@id": `${SITE_URL}/magazines#list`,
      name: "FourSix46 publications",
      numberOfItems: magazinesData.length,
      itemListElement: magazinesData.map((issue: any, index: number) =>
        clean({
          "@type": "ListItem",
          position: index + 1,
          url: issue.slug ? absoluteUrl(`/magazines/${issue.slug}`) : undefined,
          name: issue.articleTitle || issue.title,
          description: plainText(issue.page2IntroText, 160) || undefined,
        })
      ),
    }
  );

  return (
    <>
      <JsonLd data={magazinesSchema} id="schema-magazines" />
      <MagazinesClient 
        initialPageData={JSON.parse(JSON.stringify(pageData || {}))} 
        initialMagazines={JSON.parse(JSON.stringify(magazinesData || []))} 
      />
    </>
  );
}