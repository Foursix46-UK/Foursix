import { Metadata } from "next";
import { collection, getDocs, query, limit } from "firebase/firestore/lite";
import { db } from "@/lib/firebase-lite";
import CookiesClient from "./CookiesClient";

export const dynamic = 'force-dynamic';
export async function generateMetadata(): Promise<Metadata> {
  try {
    const q = query(collection(db, "page_legal"), limit(1));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      return {
        title: data.cookieSeoTitle || "Cookie Policy | FourSix46",
        description: data.cookieSeoDesc || "Read the FourSix46 Cookie Policy.",
      };
    }
  } catch (error) {
    console.error("Error fetching cookie metadata:", error);
  }
  return { title: "Cookie Policy | FourSix46" };
}

export default async function CookiesPageServer() {
  let content = "Content coming soon.";
  try {
    const q = query(collection(db, "page_legal"), limit(1));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      content = snapshot.docs[0].data().cookiePolicy || content;
    }
  } catch (error) {
    console.error("Error fetching cookie data:", error);
  }

  return <CookiesClient initialContent={content} />;
}