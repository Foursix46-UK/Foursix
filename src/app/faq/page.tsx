// app/faq/page.tsx
import { Metadata } from "next";
import { limit,collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata, graph, webPageNode, breadcrumbNode, faqNode, SITE_URL } from "@/lib/seo";
import FAQClient from "./FaqClient";

export const dynamic = 'force-dynamic';
export async function generateMetadata(): Promise<Metadata> {
  const fallbackTitle = "Intelligence & FAQ | FourSix46";
  const fallbackDescription =
    "Answers to the questions asked most about FourSix46 Global Ltd, its ventures and how the group operates.";

  try {
    const q = query(collection(db, "page_faq"), limit(1));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      return buildMetadata({
        title: data.seoTitle || fallbackTitle,
        description: data.seoDescription || fallbackDescription,
        path: "/faq",
        image: data.ogImage,
      });
    }
  } catch (error) {
    console.error("Error fetching FAQ SEO data:", error);
  }

  return buildMetadata({ title: fallbackTitle, description: fallbackDescription, path: "/faq" });
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

  // --- DYNAMIC FAQ SCHEMA ---
  // Every published question becomes a Question/Answer pair Google can show inline.
  // Markdown is stripped by faqNode(), because rich text breaks the FAQ rich result.
  const faqSchema = graph(
    webPageNode({
      path: "/faq",
      name: "Intelligence & FAQ | FourSix46",
      description: "Answers to the questions asked most about FourSix46 and its ventures.",
      // The dedicated FAQPage node below carries the questions; keeping this one a plain
      // WebPage avoids two competing FAQPage entities on the same URL.
      type: "WebPage",
      primaryEntityId: `${SITE_URL}/faq#faq`,
    }),
    breadcrumbNode([{ name: "FAQ", path: "/faq" }]),
    faqNode(
      faqs.map((faq: any) => ({ question: faq.question, answer: faq.answer })),
      "/faq"
    )
  );

  return (
    <>
      <JsonLd data={faqSchema} id="schema-faq" />
      {/* Pass the data to the client component */}
      <FAQClient initialFaqs={JSON.parse(JSON.stringify(faqs))} />
    </>
  );
}