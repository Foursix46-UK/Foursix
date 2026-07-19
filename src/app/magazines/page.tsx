// app/magazines/page.tsx
import { Metadata } from "next";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore/lite";
import { db } from "@/lib/firebase-lite";
import Schema from "@/components/seo/Schema";
import MagazinesClient from "./MagazinesClient";

export const dynamic = 'force-dynamic';
export async function generateMetadata(): Promise<Metadata> {
  try {
    const q = query(collection(db, "page_magazines"), limit(1));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      const title = data.seoTitle || "Publications | FourSix46";
      const description = data.seoDescription || data.heroSubtitle || "Our quarterly deep-dive into the philosophies that drive our ventures.";
      return { title, description, openGraph: { title, description, url: "https://foursix46.com/magazines" } };
    }
  } catch (error) {
    console.error("Error fetching magazines metadata:", error);
  }
  return { title: "Publications | FourSix46", description: "FourSix46 Editorial Archive." };
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

  // Schema for Collection
  const magazinesSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Publications | FourSix46",
    "url": "https://foursix46.com/magazines"
  };

  return (
    <>
      <Schema data={magazinesSchema} />
      <MagazinesClient 
        initialPageData={JSON.parse(JSON.stringify(pageData || {}))} 
        initialMagazines={JSON.parse(JSON.stringify(magazinesData || []))} 
      />
    </>
  );
}