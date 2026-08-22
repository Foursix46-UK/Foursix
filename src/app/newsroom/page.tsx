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
import NewsroomClient from "./NewsroomClient";

export const dynamic = 'force-dynamic';
export async function generateMetadata(): Promise<Metadata> {
  const fallbackTitle = "Newsroom & Press | FourSix46";
  const fallbackDescription = "Official press releases, announcements and coverage from FourSix46 Global Ltd.";

  try {
    const q = query(collection(db, "page_newsroom"), limit(1));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      return buildMetadata({
        title: data.seoTitle || fallbackTitle,
        description: data.seoDescription || data.heroSubtitle || fallbackDescription,
        path: "/newsroom",
        image: data.ogImage,
      });
    }
  } catch (error) {
    console.error("Error fetching newsroom metadata:", error);
  }

  return buildMetadata({ title: fallbackTitle, description: fallbackDescription, path: "/newsroom" });
}

export default async function NewsroomPageServer() {
  let pageData: any = null;
  let articlesData: any[] = [];

  try {
    const pageQ = query(collection(db, "page_newsroom"), limit(1));
    const pageSnap = await getDocs(pageQ);
    if (!pageSnap.empty) pageData = pageSnap.docs[0].data();

    const newsQ = query(collection(db, "news"), where("visibilityToggle", "==", true), orderBy("publishDate", "desc"));
    const newsSnap = await getDocs(newsQ);
    articlesData = newsSnap.docs.map(doc => {
      const data = doc.data();
      const dateObj = data.publishDate?.toDate() || new Date();
      return { 
        id: doc.id, 
        ...data, 
        date: dateObj.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase() 
      };
    });
  } catch (error) {
    console.error("Error fetching newsroom server data:", error);
  }

  const newsroomSchema = graph(
    webPageNode({
      path: "/newsroom",
      name: pageData?.seoTitle || "Newsroom | FourSix46",
      description:
        pageData?.seoDescription || pageData?.heroSubtitle || "Official press releases and announcements.",
      type: "CollectionPage",
      primaryEntityId: `${SITE_URL}/newsroom#list`,
      dateModified: articlesData[0] ? toIso(articlesData[0].publishDate) : undefined,
    }),
    breadcrumbNode([{ name: "Newsroom", path: "/newsroom" }]),
    {
      "@type": "ItemList",
      "@id": `${SITE_URL}/newsroom#list`,
      name: "FourSix46 press releases",
      numberOfItems: articlesData.length,
      itemListElement: articlesData.map((article: any, index: number) =>
        clean({
          "@type": "ListItem",
          position: index + 1,
          url: article.slug ? absoluteUrl(`/newsroom/${article.slug}`) : undefined,
          name: article.title,
          description: plainText(article.desc, 160) || undefined,
        })
      ),
    }
  );

  return (
    <>
      <JsonLd data={newsroomSchema} id="schema-newsroom" />
      <NewsroomClient 
        initialPageData={JSON.parse(JSON.stringify(pageData || {}))} 
        initialArticles={JSON.parse(JSON.stringify(articlesData || []))} 
      />
    </>
  );
}