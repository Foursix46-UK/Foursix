// app/gallery/page.tsx
import { Metadata } from "next";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Schema from "@/components/seo/Schema";
import GalleryClient from "./GalleryClient";
import { getFirebaseImageUrl } from "@/lib/utils";

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const q = query(collection(db, "page_gallery"), limit(1));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      const title = data.seoTitle || "The Gallery | FourSix46";
      const description = data.seoDescription || "A visual archive of the FourSix46 venture ecosystem.";

      return {
        title: title,
        description: description,
        openGraph: { title, description, url: "https://foursix46.com/gallery" }
      };
    }
  } catch (error) {
    console.error("Error fetching gallery metadata:", error);
  }

  return { title: "The Gallery | FourSix46", description: "Visual Archive." };
}

export default async function GalleryPageServer() {
  let pageData = null;
  let schemaImages: any[] = [];

  try {
    const qGallery = query(collection(db, "page_gallery"), limit(1));
    const snapGallery = await getDocs(qGallery);
    
    if (!snapGallery.empty) {
      pageData = snapGallery.docs[0].data();
      
      // Build an array of ImageObjects for Google Schema
      if (pageData?.images && Array.isArray(pageData.images)) {
        schemaImages = pageData.images.map((img: any) => ({
          "@type": "ImageObject",
          "contentUrl": getFirebaseImageUrl(img.imageRef) || "https://foursix46.com/logo.png",
          "name": img.title || "Gallery Image",
          "description": img.description || "FourSix46 Visual Archive"
        }));
      }
    }
  } catch (error) {
    console.error("Error fetching gallery server data:", error);
  }

  // Build ImageGallery Schema
  const gallerySchema = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "name": pageData?.pageTitle || "The Gallery | FourSix46",
    "url": "https://foursix46.com/gallery",
    "description": pageData?.pageLabel || "Visual Archive",
    "image": schemaImages.length > 0 ? schemaImages : undefined
  };

  return (
    <>
      <Schema data={gallerySchema} />
      {/* Pass safely stringified data to the Client Component */}
      <GalleryClient initialPageData={JSON.parse(JSON.stringify(pageData || {}))} />
    </>
  );
}