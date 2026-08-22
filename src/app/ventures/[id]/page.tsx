// app/ventures/[id]/page.tsx
//reference ventures/id/page
import { Metadata } from "next";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { notFound } from "next/navigation";
import JsonLd from "@/components/seo/JsonLd";
import {
  buildMetadata,
  graph,
  webPageNode,
  breadcrumbNode,
  clean,
  plainText,
  toIso,
  absoluteUrl,
  ORG_ID,
} from "@/lib/seo";
import { getFirebaseImageUrl } from "@/lib/utils";
import VentureClient from "./VentureClient";

// 👇 FIX: Await the params promise
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;

  try {
    const qVenture = query(collection(db, "ventures"), where("ventureSlug", "==", id));
    const snapVenture = await getDocs(qVenture);

    if (!snapVenture.empty) {
      const venture = snapVenture.docs[0].data();
      return buildMetadata({
        title: venture.seoTitle || `${venture.title} | FourSix46`,
        description:
          venture.seoDescription || venture.ventureTagline || `${venture.title}, a FourSix46 venture.`,
        path: `/ventures/${id}`,
        image: getFirebaseImageUrl(venture.heroImage),
      });
    }
  } catch (error) {
    console.error("Error fetching venture metadata:", error);
  }

  // Unknown slug: the page itself returns a real 404, so keep it out of the index.
  return buildMetadata({
    title: "Venture Not Found | FourSix46",
    description: "This venture is no longer listed.",
    path: `/ventures/${id}`,
    noindex: true,
  });
}

export default async function VenturePageServer({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const qVenture = query(collection(db, "ventures"), where("ventureSlug", "==", id));
  const snapVenture = await getDocs(qVenture);

  // A real 404 rather than a 200 page saying "not found" — soft 404s waste crawl budget.
  if (snapVenture.empty) notFound();

  const rawVenture = snapVenture.docs[0].data();

  // We stringify/parse to safely pass Firebase objects to Client components
  const initialVentureData = JSON.parse(
    JSON.stringify({ id: snapVenture.docs[0].id, ...rawVenture })
  );

  const path = `/ventures/${id}`;
  const heroImage = getFirebaseImageUrl(rawVenture.heroImage);

  const schemaData = graph(
    webPageNode({
      path,
      name: rawVenture.seoTitle || `${rawVenture.title} | FourSix46`,
      description: rawVenture.seoDescription || rawVenture.ventureTagline,
      type: "WebPage",
      image: heroImage,
      primaryEntityId: `${absoluteUrl(path)}#venture`,
      dateModified: toIso(rawVenture.updatedAt),
    }),
    breadcrumbNode([
      { name: "Ventures", path: "/ventures" },
      { name: rawVenture.title || id, path },
    ]),
    clean({
      "@type": "Organization",
      "@id": `${absoluteUrl(path)}#venture`,
      name: rawVenture.title,
      description:
        plainText(rawVenture.mission || rawVenture.desc || rawVenture.ventureTagline, 500) || undefined,
      slogan: rawVenture.ventureTagline || undefined,
      url: absoluteUrl(path),
      logo: rawVenture.logo ? getFirebaseImageUrl(rawVenture.logo) : heroImage,
      image: heroImage,
      foundingDate: rawVenture.launchYear ? String(rawVenture.launchYear) : undefined,
      knowsAbout: rawVenture.industryCategory || undefined,
      areaServed: Array.isArray(rawVenture.geography) ? rawVenture.geography : undefined,
      parentOrganization: { "@id": ORG_ID },
      // The venture's own live domain, so Google links the two entities together.
      sameAs: rawVenture.url ? [rawVenture.url] : undefined,
    })
  );

  return (
    <>
      <JsonLd data={schemaData} id={`schema-venture-${id}`} />
      {/* Pass the data so it loads instantly */}
      <VentureClient initialVenture={initialVentureData} />
    </>
  );
}
