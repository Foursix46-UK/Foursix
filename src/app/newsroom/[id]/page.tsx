import { Metadata } from "next";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Schema from "@/components/seo/Schema";
import ArticleClient from "./ArticleClient";
import { getFirebaseImageUrl } from "@/lib/utils";

// 👇 FIX: Await params for Next 15 rules!
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  try {
    const { id } = await params;
    const q = query(collection(db, "news"), where("slug", "==", id));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      const title = data.seoTitle || `${data.title} | FourSix46 News`;
      const description = data.seoDescription || data.desc || "Read the latest press release from FourSix46.";
      return { 
        title, 
        description, 
        openGraph: { title, description, url: `https://foursix46.com/newsroom/${id}`, images: [getFirebaseImageUrl(data.heroImage) || ""] } 
      };
    }
  } catch (error) {
    console.error("Error fetching article metadata:", error);
  }
  return { title: "News Article | FourSix46", description: "FourSix46 Press Release." };
}

export default async function NewsArticleServer({ params }: { params: Promise<{ id: string }> }) {
  let articleData: any = null;

  try {
    const { id } = await params;
    const q = query(collection(db, "news"), where("slug", "==", id));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      const dateObj = data.publishDate?.toDate() || new Date();
      const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase();
      const paragraphs = data.bodyContent ? data.bodyContent.split('\n').filter((p: string) => p.trim() !== '') : [];

      articleData = { 
        id: snapshot.docs[0].id, 
        ...data, 
        date: formattedDate,
        _isoDate: dateObj.toISOString(),
        contentArray: paragraphs 
      };
    }
  } catch (error) {
    console.error("Error fetching article details:", error);
  }

  // Build NewsArticle Schema
  const articleSchema = articleData ? {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": articleData.title,
    "image": getFirebaseImageUrl(articleData.heroImage) || undefined,
    "datePublished": articleData._isoDate,
    "author": {
      "@type": "Organization",
      "name": articleData.authorSource || "FourSix46"
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
      <ArticleClient initialArticle={JSON.parse(JSON.stringify(articleData))} />
    </>
  );
}