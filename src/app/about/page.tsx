// app/about/page.tsx
import { Metadata } from "next";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata, graph, webPageNode, breadcrumbNode, toIso, ORG_ID } from "@/lib/seo";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import About from "@/components/sections/About";

export const dynamic = 'force-dynamic';
// 1. Generate Dynamic SEO
export async function generateMetadata(): Promise<Metadata> {
  const fallbackTitle = "About Us & Vision | FourSix46";
  const fallbackDescription =
    "A collective of disruptive ventures unified by strategic leadership, operating under FourSix46 Global Ltd.";

  try {
    const q = query(collection(db, "page_about"), limit(1));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      return buildMetadata({
        title: data.seoTitle || fallbackTitle,
        description: data.seoDescription || data.heroTypewriter || fallbackDescription,
        path: "/about",
        image: data.ogImage,
      });
    }
  } catch (error) {
    console.error("Error fetching about metadata:", error);
  }

  return buildMetadata({ title: fallbackTitle, description: fallbackDescription, path: "/about" });
}

export default async function AboutPageServer() {
  let aboutData: any = null;
  let featuredLeaders: any[] = [];

  try {
    // Fetch Page Text
    const qAbout = query(collection(db, "page_about"), limit(1));
    const snapAbout = await getDocs(qAbout);
    if (!snapAbout.empty) aboutData = snapAbout.docs[0].data();

    // Fetch Featured Leaders for the bottom of the page
    const qLeaders = collection(db, "leadership");
    const snapLeaders = await getDocs(qLeaders);
    const allLeaders = snapLeaders.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    featuredLeaders = allLeaders
      .filter((leader: any) => leader.featuredOnAboutPage === true)
      .sort((a: any, b: any) => (a.displayOrder || 0) - (b.displayOrder || 0));

  } catch (error) {
    console.error("Error fetching about page data on server:", error);
  }

  // 2. Page graph: AboutPage + breadcrumb + the leadership team, all bound by @id to
  //    the Organization node emitted site-wide from the root layout.
  const aboutSchema = graph(
    webPageNode({
      path: "/about",
      name: aboutData?.seoTitle || "About FourSix46",
      description: aboutData?.seoDescription || aboutData?.heroTypewriter,
      type: "AboutPage",
      primaryEntityId: ORG_ID,
      dateModified: toIso(aboutData?.updatedAt),
    }),
    breadcrumbNode([{ name: "About", path: "/about" }]),
    featuredLeaders.length > 0
      ? {
          "@type": "Organization",
          "@id": ORG_ID,
          employee: featuredLeaders.map((leader: any) => ({
            "@type": "Person",
            name: leader.fullName,
            jobTitle: leader.roleTitle,
            url: leader.slug ? `https://foursix46.com/leadership/${leader.slug}` : undefined,
          })),
        }
      : null
  );

  return (
    <main className="min-h-screen bg-black overflow-x-hidden w-full max-w-[100vw] relative">
      <JsonLd data={aboutSchema} id="schema-about" />
      <Navbar />
      
      {/* 3. Pass data safely stringified to the client component */}
      <About 
        initialAboutData={JSON.parse(JSON.stringify(aboutData || {}))} 
        initialLeaders={JSON.parse(JSON.stringify(featuredLeaders || []))} 
      />
      
      <Footer />
    </main>
  );
}