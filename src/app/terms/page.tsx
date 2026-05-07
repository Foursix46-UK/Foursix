import { Metadata } from "next";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import TermsClient from "./TermsClient";

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const q = query(collection(db, "page_legal"), limit(1));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      return {
        title: data.termsSeoTitle || "Terms of Service | FourSix46",
        description: data.termsSeoDesc || "Read the FourSix46 Terms of Service.",
      };
    }
  } catch (error) {
    console.error("Error fetching terms metadata:", error);
  }
  return { title: "Terms of Service | FourSix46" };
}

export default async function TermsPageServer() {
  let content = "Content coming soon.";
  try {
    const q = query(collection(db, "page_legal"), limit(1));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      content = snapshot.docs[0].data().termsOfUse || content;
    }
  } catch (error) {
    console.error("Error fetching terms data:", error);
  }

  return <TermsClient initialContent={content} />;
}