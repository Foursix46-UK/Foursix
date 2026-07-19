// app/faq/page.tsx
import { Metadata } from "next";
import { limit,collection, getDocs, query, orderBy, where } from "firebase/firestore/lite";
import { db } from "@/lib/firebase-lite";
import Schema from "@/components/seo/Schema";
import FAQClient from "./FaqClient";

export const dynamic = 'force-dynamic';
export async function generateMetadata(): Promise<Metadata> {
  try {
    const q = query(collection(db, "page_faq"), limit(1));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      return {
        title: data.seoTitle || "Intelligence & FAQ | FourSix46",
        description: data.seoDescription || "Comprehensive strategic clarity.",
      };
    }
  } catch (error) {
    console.error("Error fetching FAQ SEO data:", error);
  }

  // Fallback just in case Firebase fails
  return {
    title: "Intelligence & FAQ | FourSix46",
    description: "Comprehensive strategic clarity.",
  };
}

export default async function FAQPage() {
  let faqs: any[] = [];
  
  try {
    const q = query(
      collection(db, "faqs"), 
      where("status", "==", "Published"), 
      orderBy("displayOrder", "asc")
    );
    const snapshot = await getDocs(q);
    faqs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching FAQs on server:", error);
  }

  // --- GENERATE DYNAMIC FAQ SCHEMA ---
  // This tells Google exactly what the questions and answers are!
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer.replace(/[#*`]/g, "") // Clean markdown symbols for Google
      }
    }))
  };

  return (
    <>
      <Schema data={faqSchema} />
      {/* Pass the data to the client component */}
      <FAQClient initialFaqs={JSON.parse(JSON.stringify(faqs))} />
    </>
  );
}