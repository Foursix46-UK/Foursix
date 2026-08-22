// app/partnership/page.tsx
import { Metadata } from "next";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata, graph, webPageNode, breadcrumbNode, plainText, toIso, ORG_ID } from "@/lib/seo";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import PartnerWithUs from "@/components/sections/PartnerWithUs";

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const fallbackTitle = "Partner With Us | FourSix46";
  const fallbackDescription = "Strategic alliances and institutional capital — co-create the future with FourSix46.";

  try {
    const q = query(collection(db, "page_partnership"), limit(1));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      return buildMetadata({
        title: data.seoTitle || fallbackTitle,
        description: data.seoDescription || plainText(data.mainDescription, 160) || fallbackDescription,
        path: "/partnership",
        image: data.ogImage,
      });
    }
  } catch (error) {
    console.error("Error fetching partnership metadata:", error);
  }

  return buildMetadata({ title: fallbackTitle, description: fallbackDescription, path: "/partnership" });
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

  const partnershipSchema = graph(
    webPageNode({
      path: "/partnership",
      name: pageData?.seoTitle || pageData?.heroTitle || "Partner With Us | FourSix46",
      description: pageData?.seoDescription || plainText(pageData?.mainDescription, 300),
      type: "WebPage",
      primaryEntityId: ORG_ID,
      dateModified: toIso(pageData?.updatedAt),
    }),
    breadcrumbNode([{ name: "Partnership", path: "/partnership" }])
  );

  return (
    <main className="min-h-screen bg-black">
      <JsonLd data={partnershipSchema} id="schema-partnership" />
      <Navbar />
      
      {/* Pass the server data directly into the component */}
      <PartnerWithUs initialData={JSON.parse(JSON.stringify(pageData || {}))} />

      <Footer />
    </main>
  );
}