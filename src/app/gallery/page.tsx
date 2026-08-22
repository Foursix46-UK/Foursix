// app/gallery/page.tsx
import { Metadata } from "next";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata, graph, webPageNode, breadcrumbNode, toIso, SITE_URL } from "@/lib/seo";
import GalleryClient from "./GalleryClient";
import { getFirebaseImageUrl } from "@/lib/utils";

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const fallbackTitle = "The Gallery | FourSix46";
  const fallbackDescription = "A visual archive of the FourSix46 venture ecosystem.";

  try {
    const q = query(collection(db, "page_gallery"), limit(1));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      return buildMetadata({
        title: data.seoTitle || fallbackTitle,
        description: data.seoDescription || fallbackDescription,
        path: "/gallery",
        image: data.images?.[0]?.imageRef ? getFirebaseImageUrl(data.images[0].imageRef) : undefined,
      });
    }
  } catch (error) {
    console.error("Error fetching gallery metadata:", error);
  }

  return buildMetadata({ title: fallbackTitle, description: fallbackDescription, path: "/gallery" });
}

export default async function GalleryPageServer() {
  let pageData: any = null;
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

  // ImageGallery + every ImageObject, so the archive is eligible for Google Images.
  const gallerySchema = graph(
    webPageNode({
      path: "/gallery",
      name: pageData?.seoTitle || pageData?.pageTitle || "The Gallery | FourSix46",
      description: pageData?.seoDescription || pageData?.pageLabel || "FourSix46 visual archive.",
      type: "ImageGallery",
      image: schemaImages[0]?.contentUrl,
      primaryEntityId: `${SITE_URL}/gallery#images`,
      dateModified: toIso(pageData?.updatedAt),
    }),
    breadcrumbNode([{ name: "Gallery", path: "/gallery" }]),
    schemaImages.length > 0
      ? {
          "@type": "ImageGallery",
          "@id": `${SITE_URL}/gallery#images`,
          name: pageData?.pageTitle || "FourSix46 Gallery",
          numberOfItems: schemaImages.length,
          image: schemaImages,
        }
      : null
  );

  return (
    <>
      <JsonLd data={gallerySchema} id="schema-gallery" />
      {/* Pass safely stringified data to the Client Component */}
      <GalleryClient initialPageData={JSON.parse(JSON.stringify(pageData || {}))} />
    </>
  );
}