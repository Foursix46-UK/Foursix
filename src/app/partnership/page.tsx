// app/partnership/page.tsx
import { Metadata } from "next";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Schema from "@/components/seo/Schema";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import PartnerWithUs from "@/components/sections/PartnerWithUs";

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const q = query(collection(db, "page_partnership"), limit(1));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      const title = data.seoTitle || "Partner With Us | FourSix46";
      const description = data.seoDescription || data.mainDescription || "Co-create the future with FourSix46.";
      return { title, description, openGraph: { title, description, url: "https://foursix46.com/partnership" } };
    }
  } catch (error) {
    console.error("Error fetching partnership metadata:", error);
  }
  return { title: "Partner With Us | FourSix46", description: "Strategic Alliances and Institutional Capital." };
}

export default async function PartnershipPageServer() {
  let pageData: any = null;

  try {
    const pageQ = query(collection(db, "page_partnership"), limit(1));
    const pageSnap = await getDocs(pageQ);
    if (!pageSnap.empty) {
      pageData = pageSnap.docs[0].data();
    }
  } catch (error) {
    console.error("Error fetching partnership server data:", error);
  }

  // Schema for Google
  const partnershipSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": pageData?.heroTitle || "Partner With Us",
    "description": pageData?.mainDescription || "FourSix46 Strategic Partnerships",
    "url": "https://foursix46.com/partnership",
    "publisher": {
      "@type": "Organization",
      "name": "FourSix46"
    }
  };

  return (
    <main className="min-h-screen bg-black">
      <Schema data={partnershipSchema} />
      <Navbar />
      
      {/* Pass the server data directly into the component */}
      <PartnerWithUs initialData={JSON.parse(JSON.stringify(pageData || {}))} />

      <Footer />
    </main>
  );
}