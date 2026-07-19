// app/ventures/[id]/page.tsx

import { Metadata } from "next";
import { collection, getDocs, query, where } from "firebase/firestore/lite";
import { db } from "@/lib/firebase-lite";
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

    // <-- REPLACED: Added exact Block 5 from client with dynamic CMS data
    schemaData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": rawVenture.title || rawVenture.name,
      "url": rawVenture.websiteUrl || `https://foursix46.com/ventures/${id}`,
      "description": rawVenture.ventureTagline || rawVenture.shortDescription,
      "parentOrganization": {
        "@type": "Organization",
        "name": "FourSix46 Global Ltd",
        "legalName": "FOURSIX46 GLOBAL LTD",
        "url": "https://foursix46.com",
        "identifier": "16712658"
      },
      "founder": {
        "@type": "Person",
        "name": "Dinesh Koyyalamudi",
        "alternateName": "46DC",
        "url": "https://46dc.com"
      },
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://foursix46.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Ventures",
            "item": "https://foursix46.com/ventures"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": rawVenture.title || rawVenture.name || "Venture",
            "item": `https://foursix46.com/ventures/${id}`
          }
        ]
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