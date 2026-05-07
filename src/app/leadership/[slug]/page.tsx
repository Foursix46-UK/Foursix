// app/leadership/[slug]/page.tsx
import { Metadata } from "next";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Schema from "@/components/seo/Schema";
import ProfileClient from "./ProfileClient";
import { getFirebaseImageUrl } from "@/lib/utils";

// 👇 FIX: Await the params object before using the slug
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const { slug } = await params; // <--- This is the fix for Next.js 14/15
    
    const q = query(collection(db, "leadership"), where("slug", "==", slug));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      const title = data.seoTitle || `${data.fullName} | ${data.roleTitle}`;
      const description = data.seoDescription || data.shortBio || `Profile of ${data.fullName}.`;
      return { title, description, openGraph: { title, description, url: `https://foursix46.com/leadership/${slug}` } };
    }
  } catch (error) {
    console.error("Error fetching leader metadata:", error);
  }
  return { title: "Leadership Profile | FourSix46", description: "Executive Profile." };
}

// 👇 FIX: Await the params object here too
export default async function LeaderProfileServer({ params }: { params: Promise<{ slug: string }> }) {
  let leaderData: any = null;

  try {
    const { slug } = await params; // <--- And here!

    const q = query(collection(db, "leadership"), where("slug", "==", slug));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      const paragraphs = data.longBio ? data.longBio.split('\n').filter((p: string) => p.trim() !== '') : [];
      leaderData = { id: snapshot.docs[0].id, ...data, bioArray: paragraphs };
    }
  } catch (error) {
    console.error("Error fetching leader server data:", error);
  }

  // Generate 'Person' Schema for Google Knowledge Graph
  let socialUrls: string[] = [];
  if (leaderData?.socialLinks && Array.isArray(leaderData.socialLinks)) {
    socialUrls = leaderData.socialLinks.map((s: any) => s.url).filter(Boolean);
  } else if (leaderData?.socials && typeof leaderData.socials === 'object') {
    socialUrls = Object.values(leaderData.socials).filter(Boolean) as string[];
  }

  const personSchema = leaderData ? {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": leaderData.fullName,
    "jobTitle": leaderData.roleTitle,
    "description": leaderData.shortBio,
    "image": getFirebaseImageUrl(leaderData.profilePhoto) || undefined,
    "worksFor": {
      "@type": "Organization",
      "name": leaderData.associatedVentureName || "FourSix46"
    },
    "sameAs": socialUrls.length > 0 ? socialUrls : undefined
  } : null;

  return (
    <>
      {personSchema && <Schema data={personSchema} />}
      <ProfileClient initialLeader={JSON.parse(JSON.stringify(leaderData))} />
    </>
  );
}