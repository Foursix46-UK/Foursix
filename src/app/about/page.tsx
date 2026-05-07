// app/about/page.tsx
import { Metadata } from "next";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Schema from "@/components/seo/Schema";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import About from "@/components/sections/About";

export const dynamic = 'force-dynamic';
// 1. Generate Dynamic SEO
export async function generateMetadata(): Promise<Metadata> {
  try {
    const q = query(collection(db, "page_about"), limit(1));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      const title = data.seoTitle || "About Us & Vision | FourSix46";
      const description = data.seoDescription || data.heroTypewriter || "A collective of disruptive ventures unified by strategic leadership.";

      return {
        title: title,
        description: description,
        openGraph: { title, description, url: "https://foursix46.com/about" }
      };
    }
  } catch (error) {
    console.error("Error fetching about metadata:", error);
  }

  return {
    title: "About Us & Vision | FourSix46",
    description: "A collective of disruptive ventures unified by strategic leadership."
  };
}

export default async function AboutPageServer() {
  let aboutData = null;
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

  // 2. Generate AboutPage Schema for Google
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About FourSix46",
    "url": "https://foursix46.com/about",
    "description": aboutData?.heroTypewriter || "Architecting the global nodes of tomorrow.",
    "mainEntity": {
      "@type": "Organization",
      "name": "FourSix46",
      "foundingDate": "2018"
    }
  };

  return (
    <main className="min-h-screen bg-black overflow-x-hidden w-full max-w-[100vw] relative">
      <Schema data={aboutSchema} />
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