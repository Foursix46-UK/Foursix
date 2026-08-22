// app/global/[slug]/page.tsx
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
import RegionalClient from "./RegionalClient";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;

  try {
    const q = query(collection(db, "global"), where("slug", "==", slug));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      return buildMetadata({
        title: data.seoTitle || `${data.cityRegion} Node | FourSix46`,
        description:
          data.seoDescription ||
          plainText(data.marketDescription, 160) ||
          `Explore the FourSix46 presence in ${data.cityRegion}.`,
        path: `/global/${slug}`,
        image: data.heroImage,
      });
    }
  } catch (error) {
    console.error("Error fetching regional metadata:", error);
  }

  return buildMetadata({
    title: "Node Not Found | FourSix46",
    description: "This regional node is no longer listed.",
    path: `/global/${slug}`,
    noindex: true,
  });
}

export default async function RegionalDetailPageServer({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const q = query(collection(db, "global"), where("slug", "==", slug));
  const snapshot = await getDocs(q);

  // Real 404 rather than a 200 "node not found" screen.
  if (snapshot.empty) notFound();

  const locData = snapshot.docs[0].data();

  // Cross-reference with active Ventures
  const vQuery = query(collection(db, "ventures"), where("visibilityToggle", "==", true));
  const vSnap = await getDocs(vQuery);

  const activeVentureSlugs = vSnap.docs.map((d) => d.data().ventureSlug);
  const activeVentureNames = vSnap.docs.map((d) => d.data().title.toLowerCase());

  const rawVentures = locData.ventures || [];
  const safeVentures = rawVentures.filter((v: any) => {
    const vIdentifier =
      typeof v === "string" ? v.toLowerCase().replace(/\s+/g, "-") : v.slug || v.name.toLowerCase().replace(/\s+/g, "-");
    const vName = typeof v === "string" ? v.toLowerCase() : v.name.toLowerCase();
    return activeVentureSlugs.includes(vIdentifier) || activeVentureNames.includes(vName);
  });

  const locationData = { id: snapshot.docs[0].id, ...locData, ventures: safeVentures };
  const path = `/global/${slug}`;

  const schema = graph(
    webPageNode({
      path,
      name: locData.seoTitle || `${locData.cityRegion} Node | FourSix46`,
      description: locData.seoDescription || plainText(locData.marketDescription, 300),
      type: "WebPage",
      image: locData.heroImage,
      primaryEntityId: `${absoluteUrl(path)}#place`,
      dateModified: toIso(locData.updatedAt),
    }),
    breadcrumbNode([
      { name: "Global", path: "/global" },
      { name: locData.cityRegion || slug, path },
    ]),
    clean({
      "@type": "Place",
      "@id": `${absoluteUrl(path)}#place`,
      name: `${locData.cityRegion} — FourSix46`,
      description: plainText(locData.marketDescription, 500) || undefined,
      url: absoluteUrl(path),
      geo:
        locData.mapCoordinates?.lat && locData.mapCoordinates?.lng
          ? {
              "@type": "GeoCoordinates",
              latitude: locData.mapCoordinates.lat,
              longitude: locData.mapCoordinates.lng,
            }
          : undefined,
      address: clean({
        "@type": "PostalAddress",
        addressLocality: locData.cityRegion,
        addressCountry: locData.country,
      }),
      containedInPlace: locData.country
        ? { "@type": "Country", name: locData.country }
        : undefined,
    }),
    {
      "@type": "Organization",
      "@id": ORG_ID,
      areaServed: { "@id": `${absoluteUrl(path)}#place` },
    }
  );

  return (
    <>
      <JsonLd data={schema} id={`schema-node-${slug}`} />
      <RegionalClient initialLocation={JSON.parse(JSON.stringify(locationData))} />
    </>
  );
}
