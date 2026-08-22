import { Metadata } from "next";
import { collection, getDocs, query, limit } from "firebase/firestore/lite";
import { db } from "@/lib/firebase-lite";
import CookiesClient from "./CookiesClient";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata, graph, webPageNode, breadcrumbNode, toIso } from "@/lib/seo";

export const dynamic = 'force-dynamic';
export async function generateMetadata(): Promise<Metadata> {
  const fallbackTitle = "Cookie Policy | FourSix46";
  const fallbackDescription = "The cookies and tracking technologies used on the FourSix46 website.";

  try {
    const q = query(collection(db, "page_legal"), limit(1));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      return buildMetadata({
        title: data.cookieSeoTitle || fallbackTitle,
        description: data.cookieSeoDesc || fallbackDescription,
        path: "/cookies",
      });
    }
  } catch (error) {
    console.error("Error fetching legal metadata:", error);
  }

  return buildMetadata({ title: fallbackTitle, description: fallbackDescription, path: "/cookies" });
}

export default async function CookiesPageServer() {
  let content = "Content coming soon.";
  let updatedAt: string | undefined;

  try {
    const q = query(collection(db, "page_legal"), limit(1));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      content = data.cookiePolicy || content;
      updatedAt = toIso(data.updatedAt);
    }
  } catch (error) {
    console.error("Error fetching legal data:", error);
  }

  const schema = graph(
    webPageNode({
      path: "/cookies",
      name: "Cookie Policy",
      description: "The cookies and tracking technologies used on the FourSix46 website.",
      type: "WebPage",
      dateModified: updatedAt,
    }),
    breadcrumbNode([{ name: "Cookie Policy", path: "/cookies" }])
  );

  return (
    <>
      <JsonLd data={schema} id="schema-cookies" />
      <CookiesClient initialContent={content} />
    </>
  );
}
