// app/leadership/[slug]/page.tsx
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
  FOUNDER_ID,
} from "@/lib/seo";
import ProfileClient from "./ProfileClient";
import { getFirebaseImageUrl } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;

  try {
    const q = query(collection(db, "leadership"), where("slug", "==", slug));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      return buildMetadata({
        title: data.seoTitle || `${data.fullName} — ${data.roleTitle} | FourSix46`,
        description: data.seoDescription || plainText(data.shortBio, 160) || `Profile of ${data.fullName}.`,
        path: `/leadership/${slug}`,
        image: getFirebaseImageUrl(data.profilePhoto),
        type: "profile",
      });
    }
  } catch (error) {
    console.error("Error fetching leader metadata:", error);
  }

  return buildMetadata({
    title: "Profile Not Found | FourSix46",
    description: "This profile is no longer listed.",
    path: `/leadership/${slug}`,
    noindex: true,
  });
}

export default async function LeaderProfileServer({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const q = query(collection(db, "leadership"), where("slug", "==", slug));
  const snapshot = await getDocs(q);

  // Real 404 rather than a 200 "profile not found" screen.
  if (snapshot.empty) notFound();

  const data = snapshot.docs[0].data();
  const paragraphs = data.longBio
    ? data.longBio.split("\n").filter((p: string) => p.trim() !== "")
    : [];
  const leaderData = { id: snapshot.docs[0].id, ...data, bioArray: paragraphs };

  // Social profiles feed sameAs, which is how Google ties a person to their other accounts.
  let socialUrls: string[] = [];
  if (Array.isArray(data.socialLinks)) {
    socialUrls = data.socialLinks.map((s: any) => s?.url).filter(Boolean);
  } else if (data.socials && typeof data.socials === "object") {
    socialUrls = Object.values(data.socials).filter(Boolean) as string[];
  }

  const path = `/leadership/${slug}`;
  const photo = getFirebaseImageUrl(data.profilePhoto);

  // The founder has a canonical @id shared across the whole site; everyone else gets a
  // page-scoped one.
  const isFounder = /46dc|dinesh/i.test(String(data.fullName || "")) || data.isFounder === true;
  const personId = isFounder ? FOUNDER_ID : `${absoluteUrl(path)}#person`;

  const schema = graph(
    webPageNode({
      path,
      name: data.seoTitle || `${data.fullName} | FourSix46`,
      description: data.seoDescription || plainText(data.shortBio, 300),
      type: "ProfilePage",
      image: photo,
      primaryEntityId: personId,
      dateModified: toIso(data.updatedAt),
    }),
    breadcrumbNode([
      { name: "Leadership", path: "/leadership" },
      { name: data.fullName || slug, path },
    ]),
    clean({
      "@type": "Person",
      "@id": personId,
      name: data.fullName,
      jobTitle: data.roleTitle,
      description: plainText(data.shortBio || data.longBio, 500) || undefined,
      image: photo,
      url: absoluteUrl(path),
      worksFor: { "@id": ORG_ID },
      ...(isFounder ? { founderOf: { "@id": ORG_ID } } : {}),
      affiliation: data.associatedVentureName
        ? { "@type": "Organization", name: data.associatedVentureName }
        : undefined,
      sameAs: socialUrls.length > 0 ? socialUrls : undefined,
    })
  );

  return (
    <>
      <JsonLd data={schema} id={`schema-leader-${slug}`} />
      <ProfileClient initialLeader={JSON.parse(JSON.stringify(leaderData))} />
    </>
  );
}
