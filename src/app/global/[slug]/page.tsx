// app/global/[slug]/page.tsx
import { Metadata } from "next";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Schema from "@/components/seo/Schema";
import RegionalClient from "./RegionalClient";

// 👇 FIX: Await the params promise
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const { slug } = await params;
    const q = query(collection(db, "global"), where("slug", "==", slug));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      const title = data.seoTitle || `${data.cityRegion} Node | FourSix46`;
      const description = data.seoDescription || data.marketDescription || `Explore the FourSix46 presence in ${data.cityRegion}.`;
      return { title, description, openGraph: { title, description, url: `https://foursix46.com/global/${slug}` } };
    }
  } catch (error) {
    console.error("Error fetching regional metadata:", error);
  }
  return { title: "Regional Node | FourSix46", description: "FourSix46 Global Network" };
}

// 👇 FIX: Await the params promise
export default async function RegionalDetailPageServer({ params }: { params: Promise<{ slug: string }> }) {
  let locationData: any = null;

  try {
    const { slug } = await params;
    const q = query(collection(db, "global"), where("slug", "==", slug));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const locData = snapshot.docs[0].data();

      // Cross-reference with active Ventures
      const vQuery = query(collection(db, "ventures"), where("visibilityToggle", "==", true));
      const vSnap = await getDocs(vQuery);
      
      const activeVentureSlugs = vSnap.docs.map(d => d.data().ventureSlug);
      const activeVentureNames = vSnap.docs.map(d => d.data().title.toLowerCase());

      const rawVentures = locData.ventures || [];
      const safeVentures = rawVentures.filter((v: any) => {
        const vIdentifier = typeof v === 'string' ? v.toLowerCase().replace(/\s+/g, '-') : (v.slug || v.name.toLowerCase().replace(/\s+/g, '-'));
        const vName = typeof v === 'string' ? v.toLowerCase() : v.name.toLowerCase();
        return activeVentureSlugs.includes(vIdentifier) || activeVentureNames.includes(vName);
      });

      locationData = { id: snapshot.docs[0].id, ...locData, ventures: safeVentures };
    }
  } catch (error) {
    console.error("Error fetching location details on server:", error);
  }

  // Schema for the specific Regional Node (Using 'Place' or 'Organization')
  const regionalSchema = locationData ? {
    "@context": "https://schema.org",
    "@type": "Place",
    "name": `${locationData.cityRegion} Node - FourSix46`,
    "description": locationData.marketDescription,
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": locationData.mapCoordinates?.lat,
      "longitude": locationData.mapCoordinates?.lng
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": locationData.cityRegion,
      "addressCountry": locationData.country
    }
  } : null;

  return (
    <>
      {regionalSchema && <Schema data={regionalSchema} />}
      <RegionalClient initialLocation={JSON.parse(JSON.stringify(locationData))} />
    </>
  );
}