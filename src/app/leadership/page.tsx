// app/leadership/page.tsx
import { Metadata } from "next";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import JsonLd from "@/components/seo/JsonLd";
import {
  buildMetadata,
  graph,
  webPageNode,
  breadcrumbNode,
  clean,
  plainText,
  absoluteUrl,
  toIso,
  SITE_URL,
  ORG_ID,
} from "@/lib/seo";
import LeadershipClient from "./LedershipClient";

export const dynamic = 'force-dynamic';
export async function generateMetadata(): Promise<Metadata> {
  const fallbackTitle = "Leadership & Visionaries | FourSix46";
  const fallbackDescription = "Meet the strategic architects driving the FourSix46 collective.";

  try {
    const q = query(collection(db, "page_leadership"), limit(1));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      return buildMetadata({
        title: data.seoTitle || fallbackTitle,
        description: data.seoDescription || data.heroSubtitle || fallbackDescription,
        path: "/leadership",
        image: data.ogImage,
      });
    }
  } catch (error) {
    console.error("Error fetching leadership metadata:", error);
  }

  return buildMetadata({ title: fallbackTitle, description: fallbackDescription, path: "/leadership" });
}

export default async function LeadershipPageServer() {
  let pageData: any = null;
  let leadersData: any[] = [];

  try {
    // 1. Fetch CMS Page Text
    const pageQ = query(collection(db, "page_leadership"), limit(1));
    const pageSnap = await getDocs(pageQ);
    if (!pageSnap.empty) pageData = pageSnap.docs[0].data();

    // 2. Fetch Leaders
    const leadersQ = query(collection(db, "leadership"), orderBy("displayOrder", "asc"));
    const leadersSnap = await getDocs(leadersQ);
    leadersData = leadersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching leadership server data:", error);
  }

  // 3. Build the graph: CollectionPage + breadcrumb + an ItemList of Person entities.
  const leadershipSchema = graph(
    webPageNode({
      path: "/leadership",
      name: pageData?.seoTitle || "Leadership | FourSix46",
      description: pageData?.seoDescription || pageData?.heroSubtitle || "Our executive team.",
      type: "CollectionPage",
      primaryEntityId: `${SITE_URL}/leadership#list`,
      dateModified: toIso(pageData?.updatedAt),
    }),
    breadcrumbNode([{ name: "Leadership", path: "/leadership" }]),
    {
      "@type": "ItemList",
      "@id": `${SITE_URL}/leadership#list`,
      name: "FourSix46 leadership",
      numberOfItems: leadersData.length,
      itemListElement: leadersData.map((leader: any, index: number) =>
        clean({
          "@type": "ListItem",
          position: index + 1,
          url: leader.slug ? absoluteUrl(`/leadership/${leader.slug}`) : undefined,
          item: clean({
            "@type": "Person",
            name: leader.fullName,
            jobTitle: leader.roleTitle,
            description: plainText(leader.shortBio, 200) || undefined,
            worksFor: { "@id": ORG_ID },
            url: leader.slug ? absoluteUrl(`/leadership/${leader.slug}`) : undefined,
          }),
        })
      ),
    }
  );

  return (
    <>
      <JsonLd data={leadershipSchema} id="schema-leadership" />
      <LeadershipClient 
        initialPageData={JSON.parse(JSON.stringify(pageData || {}))}
        initialLeaders={JSON.parse(JSON.stringify(leadersData || []))}
      />
    </>
  );
}