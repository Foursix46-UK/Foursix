// app/ventures/[id]/page.tsx
//reference ventures/id/page
import { Metadata } from "next";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Schema from "@/components/seo/Schema";
import VentureClient from "./VentureClient";

// 👇 FIX: Await the params promise
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const qVenture = query(collection(db, "ventures"), where("ventureSlug", "==", id));
  const snapVenture = await getDocs(qVenture);
  
  if (snapVenture.empty) return { title: 'Venture Not Found | FourSix46' };
  
  const venture = snapVenture.docs[0].data();
  
  return {
    title: venture.seoTitle || `${venture.title} | FourSix46`, // Uses CMS SEO Title if available!
    description: venture.seoDescription || venture.ventureTagline || "A FourSix46 Venture",
    openGraph: {
      title: venture.seoTitle || `${venture.title} | FourSix46`,
      description: venture.seoDescription || venture.ventureTagline,
      images: [venture.heroImage || "https://foursix46.com/default-og.png"], 
      url: `https://foursix46.com/ventures/${id}`
    }
  };
}

// 👇 FIX: Await the params promise
export default async function VenturePageServer({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const qVenture = query(collection(db, "ventures"), where("ventureSlug", "==", id));
  const snapVenture = await getDocs(qVenture);
  
  let schemaData = null;
  let initialVentureData = null; // Hold the data to pass to client

  if (!snapVenture.empty) {
    const rawVenture = snapVenture.docs[0].data();
    
    // We stringify/parse to safely pass Firebase objects to Client components
    initialVentureData = JSON.parse(JSON.stringify({ 
      id: snapVenture.docs[0].id, 
      ...rawVenture 
    }));

    schemaData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": rawVenture.title,
      "description": rawVenture.ventureTagline,
      "url": `https://foursix46.com/ventures/${id}`,
      "parentOrganization": {
        "@type": "Organization",
        "name": "FourSix46",
        "url": "https://foursix46.com"
      }
    };
  }

  return (
    <>
      {schemaData && <Schema data={schemaData} />}
      {/* Pass the data so it loads instantly */}
      <VentureClient initialVenture={initialVentureData} />
    </>
  );
}