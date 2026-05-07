// app/ventures/page.tsx
//reference ventures/page.tsx
import { Metadata } from "next";
import { collection, getDocs, query, limit, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Schema from "@/components/seo/Schema";
import VenturesClient from "./VenturesClient"; 

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  try {
    // We look at the "page_ventures" document for the SEO fields
    const q = query(collection(db, "page_ventures"), limit(1));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      
      // Pulls from FireCMS, falls back to hardcoded text if empty
      const title = data.seoTitle || "Our Ventures | FourSix46";
      const description = data.seoDescription || data.heroSubtitle || "FourSix46 actively manages a diverse portfolio of disruptive brands.";

      return {
        title: title,
        description: description,
        openGraph: {
          title: title,
          description: description,
          url: "https://foursix46.com/ventures",
        }
      };
    }
  } catch (error) {
    console.error("Error fetching ventures metadata:", error);
  }

  // Absolute fallback if Firebase is down
  return {
    title: "Our Ventures | FourSix46",
    description: "FourSix46 actively manages a diverse portfolio of disruptive brands.",
    openGraph: {
      title: "Our Ventures | FourSix46",
      description: "FourSix46 actively manages a diverse portfolio of disruptive brands.",
      url: "https://foursix46.com/ventures",
    }
  };
}

export default async function VenturesPageServer() {
  // 👇 1. FETCH UI DATA AND VENTURES LIST ON THE SERVER
  let pageData = null;
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

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Our Ventures | FourSix46",
    "url": "https://foursix46.com/ventures",
    "description": "The collective portfolio of FourSix46 ventures."
  };

  return (
    <>
      <Schema data={collectionSchema} />
      {/* 👇 2. PASS BOTH TO THE CLIENT (Safely stringified to prevent call stack error) */}
      <VenturesClient 
        initialPageData={JSON.parse(JSON.stringify(pageData || {}))} 
        initialVentures={JSON.parse(JSON.stringify(venturesData || []))} 
      />
    </>
  );
}