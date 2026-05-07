// app/contact/page.tsx
import { Metadata } from "next";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Schema from "@/components/seo/Schema";
import ContactClient from "./ContactClient";

export const dynamic = 'force-dynamic';
export async function generateMetadata(): Promise<Metadata> {
  try {
    const q = query(collection(db, "page_contact"), limit(1));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      const title = data.seoTitle || "Contact Us | FourSix46";
      const description = data.seoDescription || data.formSubtitle || "Contact FourSix46 for strategic partnerships and inquiries.";

      return {
        title: title,
        description: description,
        openGraph: { title, description, url: "https://foursix46.com/contact" }
      };
    }
  } catch (error) {
    console.error("Error fetching contact metadata:", error);
  }

  return { title: "Contact Us | FourSix46", description: "Contact FourSix46." };
}

export default async function ContactPageServer() {
  let pageData = null;

  try {
    const qContact = query(collection(db, "page_contact"), limit(1));
    const snapContact = await getDocs(qContact);
    if (!snapContact.empty) pageData = snapContact.docs[0].data();
  } catch (error) {
    console.error("Error fetching contact server data:", error);
  }

  // Build ContactPage Schema for Google
  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact FourSix46",
    "url": "https://foursix46.com/contact",
    "description": pageData?.formSubtitle || "Contact our strategic relations team.",
    "mainEntity": {
      "@type": "Organization",
      "name": "FourSix46",
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "telephone": pageData?.phone || "+44 0330 124 1966",
          "contactType": "customer service",
          "email": pageData?.generalEmail || "contact@foursix46.com"
        }
      ]
    }
  };

  return (
    <>
      <Schema data={contactSchema} />
      {/* Pass safely stringified data to the Client Component */}
      <ContactClient initialPageData={JSON.parse(JSON.stringify(pageData || {}))} />
    </>
  );
}