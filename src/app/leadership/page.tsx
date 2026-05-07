// app/leadership/page.tsx
import { Metadata } from "next";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Schema from "@/components/seo/Schema";
import LeadershipClient from "./LedershipClient";

export const dynamic = 'force-dynamic';
export async function generateMetadata(): Promise<Metadata> {
  try {
    const q = query(collection(db, "page_leadership"), limit(1));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      const title = data.seoTitle || "Leadership & Visionaries | FourSix46";
      const description = data.seoDescription || data.heroSubtitle || "Meet the strategic architects driving the FourSix46 collective.";
      return { title, description, openGraph: { title, description, url: "https://foursix46.com/leadership" } };
    }
  } catch (error) {
    console.error("Error fetching leadership metadata:", error);
  }
  return { title: "Leadership | FourSix46", description: "Our executive team." };
}

export default async function LeadershipPageServer() {
  let pageData: any = null;
  let leadersData: any[] = [];

  try {
    // 1. Fetch CMS Page Text
    const pageQ = query(collection(db, "page_leadership"), limit(1));
    const pageSnap = await getDocs(pageQ);
    if (!pageSnap.empty) pageData = pageSnap.docs[0].data();

    // 2. Fetch Leaders
    const leadersQ = query(collection(db, "leadership"), orderBy("displayOrder", "asc"));
    const leadersSnap = await getDocs(leadersQ);
    leadersData = leadersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching leadership server data:", error);
  }

  // 3. Build Schema
  const leadershipSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Leadership | FourSix46",
    "url": "https://foursix46.com/leadership",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": leadersData.map((leader, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Person",
          "name": leader.fullName,
          "jobTitle": leader.roleTitle,
          "worksFor": {
            "@type": "Organization",
            "name": leader.associatedVentureName || "FourSix46"
          },
          "url": `https://foursix46.com/leadership/${leader.slug}`
        }
      }))
    }
  };

  return (
    <>
      <Schema data={leadershipSchema} />
      <LeadershipClient 
        initialPageData={JSON.parse(JSON.stringify(pageData || {}))}
        initialLeaders={JSON.parse(JSON.stringify(leadersData || []))}
      />
    </>
  );
}