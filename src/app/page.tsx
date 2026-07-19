// app/page.tsx
//reference home page
import { Metadata } from "next";
import { collection, getDocs, query, limit, where, orderBy } from "firebase/firestore/lite";
import { db } from "@/lib/firebase-lite";
import Schema from "@/components/seo/Schema";
import HomeClient from "./HomeClient";

export const revalidate = 300;
export async function generateMetadata(): Promise<Metadata> {
  try {
    const qHome = query(collection(db, "page_home"), limit(1));
    const snapshot = await getDocs(qHome);
    
    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      const title = data.seoTitle || "FourSix46 | House of Multibrands";
      const description = data.seoDescription || data.heroSubtitle || "A premium, multi-brand holding company specializing in luxury and neo-brutalism design.";

      return {
        title: title,
        description: description,
        openGraph: {
          title: title,
          description: description,
          url: "https://foursix46.com",
        }
      };
    }
  } catch (error) {
    console.error("Error fetching home metadata:", error);
  }
  return { 
    title: "FourSix46 | House of Multibrands", 
    description: "A premium, multi-brand holding company." 
  };
}

export default async function Home() {
  // 1. Fetch data strictly for the Schema on the Server
  let homeData: any = null;
  let venturesData: any[] = [];
  let faqData: any[] = [];
  
  // Initialize the new Global variables
  let globalStatsData: any = null;
  let globalMarkersData: any[] = [];

  // 👇 Initialize Magazines variable
  let magazinesData: any[] = [];
  let newsData: any[] = [];
  try {
    const qHome = query(collection(db, "page_home"), limit(1));
    const qVentures = collection(db, "ventures");
    const qFaqs = query(
      collection(db, "faqs"),
      where("status", "==", "Published"),
      orderBy("displayOrder", "asc")
    );
    const qGlobalStats = query(collection(db, "globalSettings"), limit(1));
    const qGlobalMarkers = query(collection(db, "global"), where("visibilityToggle", "==", true));
    const qMags = query(
      collection(db, "magazines"),
      where("visibilityToggle", "==", true),
      where("featuredStoryToggle", "==", true),
      orderBy("displayOrder", "asc")
    );
    const qNews = query(
      collection(db, "news"),
      where("visibilityToggle", "==", true),
      where("displayOnHome", "==", true),
      orderBy("publishDate", "desc")
    );

    // Run all independent Firestore reads in parallel to reduce TTFB.
    const [
      homeSnapshot,
      venturesSnapshot,
      faqSnapshot,
      statsSnapshot,
      markersSnapshot,
      magsSnapshot,
      newsSnapshot,
    ] = await Promise.all([
      getDocs(qHome),
      getDocs(qVentures),
      getDocs(qFaqs),
      getDocs(qGlobalStats),
      getDocs(qGlobalMarkers),
      getDocs(qMags),
      getDocs(qNews),
    ]);

    if (!homeSnapshot.empty) {
      homeData = homeSnapshot.docs[0].data();
    }

    venturesData = venturesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Filter for Homepage display
    const fetchedFaqs = faqSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    faqData = fetchedFaqs.filter((faq: any) => 
      faq.displayLocation === "Homepage" || faq.featuredOnHome === true
    );

    if (!statsSnapshot.empty) {
      globalStatsData = statsSnapshot.docs[0].data();
    }

    globalMarkersData = markersSnapshot.docs.map(doc => {
      const data = doc.data();
      return { 
        location: [data.mapCoordinates?.lat || 0, data.mapCoordinates?.lng || 0], 
        size: 0.1 
      };
    });

    magazinesData = magsSnapshot.docs.map(doc => {
      const data = doc.data();
      const dateObj = data.publishDate?.toDate() || new Date();
      return { 
        id: doc.id, 
        ...data, 
        displayDate: dateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase() 
      };
    });
    newsData = newsSnapshot.docs.map(doc => {
      const data = doc.data();
      const dateObj = data.publishDate?.toDate() || new Date();
      return { 
        id: doc.id, 
        ...data, 
        date: dateObj.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase() 
      };
    });

  } catch (error) {
    console.error("Server Error fetching schema data:", error);
  }

  // <-- REPLACED: Added exact Block 4 from client
  const homepageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "FourSix46® Global Ltd — The Parent Brand",
    "url": "https://foursix46.com",
    "description": "FourSix46 Global Ltd — a UK-registered parent brand building a multi-industry ecosystem across technology, digital platforms, and modern services from London, United Kingdom.",
    "about": {
      "@type": "Organization",
      "name": "FourSix46 Global Ltd",
      "identifier": "16712658"
    },
    "creator": {
      "@type": "Person",
      "name": "Dinesh Koyyalamudi",
      "alternateName": "46DC"
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://foursix46.com"
        }
      ]
    }
  };

  return (
    <>
      {/* 3. Inject Schema silently for Google Bots */}
      <Schema data={homepageSchema} />
      
      {/* 4. Pass EVERYTHING to the Client Component */}
      <HomeClient 
        initialHomeData={JSON.parse(JSON.stringify(homeData || {}))} 
        initialVentures={JSON.parse(JSON.stringify(venturesData || []))} 
        initialFaqs={JSON.parse(JSON.stringify(faqData || []))} 
        initialGlobalStats={JSON.parse(JSON.stringify(globalStatsData || {}))}
        initialGlobalMarkers={JSON.parse(JSON.stringify(globalMarkersData || []))}
        // 👇 Pass Magazines safely
        initialMagazines={JSON.parse(JSON.stringify(magazinesData || []))}
        initialNews={JSON.parse(JSON.stringify(newsData || []))}
      />
    </>
  );
}