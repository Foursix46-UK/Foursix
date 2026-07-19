import { Metadata } from "next";
import { collection, getDocs, query, limit } from "firebase/firestore/lite";
import { db } from "@/lib/firebase-lite";
import PrivacyClient from "./PrivacyClient";

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const q = query(collection(db, "page_legal"), limit(1));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      return {
        title: data.privacySeoTitle || "Privacy Policy | FourSix46",
        description: data.privacySeoDesc || "Read the FourSix46 Privacy Policy.",
      };
    }
  } catch (error) {
    console.error("Error fetching privacy metadata:", error);
  }
  return { title: "Privacy Policy | FourSix46" };
}

export default async function PrivacyPageServer() {
  let content = "Content coming soon.";
  try {
    const q = query(collection(db, "page_legal"), limit(1));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      content = snapshot.docs[0].data().privacyPolicy || content;
    }
  } catch (error) {
    console.error("Error fetching privacy data:", error);
  }

  return <PrivacyClient initialContent={content} />;
}