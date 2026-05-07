import { Metadata } from "next";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Schema from "@/components/seo/Schema";
import NewsroomClient from "./NewsroomClient";

export const dynamic = 'force-dynamic';
export async function generateMetadata(): Promise<Metadata> {
  try {
    const q = query(collection(db, "page_newsroom"), limit(1));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      const title = data.seoTitle || "Newsroom & Press | FourSix46";
      const description = data.seoDescription || data.heroSubtitle || "Official press releases and announcements.";
      return { title, description, openGraph: { title, description, url: "https://foursix46.com/newsroom" } };
    }
  } catch (error) {
    console.error("Error fetching newsroom metadata:", error);
  }
  return { title: "Newsroom | FourSix46", description: "FourSix46 Announcements." };
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

  const newsroomSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Newsroom | FourSix46",
    "url": "https://foursix46.com/newsroom"
  };

  return (
    <>
      <Schema data={newsroomSchema} />
      <NewsroomClient 
        initialPageData={JSON.parse(JSON.stringify(pageData || {}))} 
        initialArticles={JSON.parse(JSON.stringify(articlesData || []))} 
      />
    </>
  );
}