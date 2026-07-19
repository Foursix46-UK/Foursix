// app/magazines/[id]/page.tsx
import { Metadata } from "next";
import { collection, getDocs, query, where } from "firebase/firestore/lite";
import { db } from "@/lib/firebase-lite";
import Schema from "@/components/seo/Schema";
import MagazineViewerClient from "./MagazineViewerClient";
import { getFirebaseImageUrl } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  try {
    const { id } = await params;
    const q = query(collection(db, "magazines"), where("slug", "==", id));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      const title = data.seoTitle || `${data.articleTitle} | FourSix46`;
      const description = data.seoDescription || data.page2IntroText || `Read ${data.articleTitle}.`;
      return { 
        title, 
        description, 
        openGraph: { title, description, url: `https://foursix46.com/magazines/${id}`, images: [getFirebaseImageUrl(data.coverImage) || ""] } 
      };
    }
  } catch (error) {
    console.error("Error fetching magazine metadata:", error);
  }
  return { title: "Publication | FourSix46", description: "FourSix46 Magazine Issue." };
}

export default async function MagazineViewerServer({ params }: { params: Promise<{ id: string }> }) {
  let issueData: any = null;

  try {
    const { id } = await params;
    const q = query(collection(db, "magazines"), where("slug", "==", id));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      const dateObj = data.publishDate?.toDate() || new Date();
      const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase();
      const page4Paragraphs = data.page4MainText ? data.page4MainText.split('\n').filter((p: string) => p.trim() !== '') : [];

      issueData = { 
        id: snapshot.docs[0].id, 
        ...data, 
        displayDate: formattedDate,
        _isoDate: dateObj.toISOString(),
        page4Paragraphs 
      };
    }
  } catch (error) {
    console.error("Error fetching magazine details:", error);
  }

  // Build Article Schema
  const articleSchema = issueData ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": issueData.articleTitle,
    "image": getFirebaseImageUrl(issueData.coverImage) || undefined,
    "datePublished": issueData._isoDate,
    "author": {
      "@type": "Person",
      "name": issueData.authorContributor
    },
    "publisher": {
      "@type": "Organization",
      "name": "FourSix46",
      "logo": {
        "@type": "ImageObject",
        "url": "https://foursix46.com/logo.png"
      }
    }
  } : null;

  return (
    <>
      {articleSchema && <Schema data={articleSchema} />}
      <MagazineViewerClient initialIssue={JSON.parse(JSON.stringify(issueData))} />
    </>
  );
}