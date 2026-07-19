// app/global/page.tsx
import { Metadata } from "next";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore/lite";
import { db } from "@/lib/firebase-lite";
import Schema from "@/components/seo/Schema";
import GlobalClient from "./GlobalClient";

export const dynamic = 'force-dynamic';
export async function generateMetadata(): Promise<Metadata> {
  try {
    const q = query(collection(db, "globalSettings"), limit(1));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      const title = data.seoTitle || "Global Presence | FourSix46";
      const description = data.seoDescription || "Explore FourSix46's global nodes and strategic operations.";
      return { title, description, openGraph: { title, description, url: "https://foursix46.com/global" } };
    }
  } catch (error) {
    console.error("Error fetching global metadata:", error);
  }
  return { title: "Global Presence | FourSix46", description: "Global operations." };
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

  // Generic Collection Page Schema
  const globalSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Global Presence | FourSix46",
    "url": "https://foursix46.com/global",
  };

  return (
    <>
      <Schema data={globalSchema} />
      <GlobalClient 
        initialLocations={JSON.parse(JSON.stringify(locationsData))}
        initialNews={JSON.parse(JSON.stringify(newsData))}
        initialStats={JSON.parse(JSON.stringify(statsData || {}))}
      />
    </>
  );
}