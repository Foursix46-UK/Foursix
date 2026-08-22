import { Metadata } from "next";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import TermsClient from "./TermsClient";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata, graph, webPageNode, breadcrumbNode, toIso } from "@/lib/seo";

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const fallbackTitle = "Terms of Service | FourSix46";
  const fallbackDescription = "The terms governing use of the FourSix46 website and services.";

  try {
    const q = query(collection(db, "page_legal"), limit(1));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      return buildMetadata({
        title: data.termsSeoTitle || fallbackTitle,
        description: data.termsSeoDesc || fallbackDescription,
        path: "/terms",
      });
    }
  } catch (error) {
    console.error("Error fetching legal metadata:", error);
  }

  return buildMetadata({ title: fallbackTitle, description: fallbackDescription, path: "/terms" });
}

export default async function TermsPageServer() {
  let content = "Content coming soon.";
  let updatedAt: string | undefined;

  try {
    const q = query(collection(db, "page_legal"), limit(1));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      content = data.termsOfUse || content;
      updatedAt = toIso(data.updatedAt);
    }
  } catch (error) {
    console.error("Error fetching legal data:", error);
  }

  const schema = graph(
    webPageNode({
      path: "/terms",
      name: "Terms of Service",
      description: "The terms governing use of the FourSix46 website and services.",
      type: "WebPage",
      dateModified: updatedAt,
    }),
    breadcrumbNode([{ name: "Terms of Service", path: "/terms" }])
  );

  return (
    <>
      <JsonLd data={schema} id="schema-terms" />
      <TermsClient initialContent={content} />
    </>
  );
}
