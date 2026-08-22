import { Metadata } from "next";
import { collection, getDocs, query, limit } from "firebase/firestore/lite";
import { db } from "@/lib/firebase-lite";
import PrivacyClient from "./PrivacyClient";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata, graph, webPageNode, breadcrumbNode, toIso } from "@/lib/seo";

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const fallbackTitle = "Privacy Policy | FourSix46";
  const fallbackDescription = "How FourSix46 Global Ltd collects, uses and protects personal data.";

  try {
    const q = query(collection(db, "page_legal"), limit(1));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      return buildMetadata({
        title: data.privacySeoTitle || fallbackTitle,
        description: data.privacySeoDesc || fallbackDescription,
        path: "/privacy",
      });
    }
  } catch (error) {
    console.error("Error fetching legal metadata:", error);
  }

  return buildMetadata({ title: fallbackTitle, description: fallbackDescription, path: "/privacy" });
}

export default async function PrivacyPageServer() {
  let content = "Content coming soon.";
  let updatedAt: string | undefined;

  try {
    const q = query(collection(db, "page_legal"), limit(1));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      content = data.privacyPolicy || content;
      updatedAt = toIso(data.updatedAt);
    }
  } catch (error) {
    console.error("Error fetching legal data:", error);
  }

  const schema = graph(
    webPageNode({
      path: "/privacy",
      name: "Privacy Policy",
      description: "How FourSix46 Global Ltd collects, uses and protects personal data.",
      type: "WebPage",
      dateModified: updatedAt,
    }),
    breadcrumbNode([{ name: "Privacy Policy", path: "/privacy" }])
  );

  return (
    <>
      <JsonLd data={schema} id="schema-privacy" />
      <PrivacyClient initialContent={content} />
    </>
  );
}
