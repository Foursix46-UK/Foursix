// app/page.tsx
//reference home page
import { Metadata } from "next";
import { collection, getDocs, query, limit, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import JsonLd from "@/components/seo/JsonLd";
import HomeClient from "./HomeClient";
import {
  buildMetadata,
  graph,
  webPageNode,
  faqNode,
  clean,
  toIso,
  plainText,
  absoluteUrl,
  ORG_ID,
  FOUNDER_ID,
  SITE_URL,
} from "@/lib/seo";

export const revalidate = 300;
export async function generateMetadata(): Promise<Metadata> {
  const fallbackTitle = "FourSix46® | Building Scalable Ventures Across Industries";
  const fallbackDescription =
    "FourSix46® Global Ltd is a UK-based parent brand building scalable ventures across technology and emerging industries, with logistics forming part of its structured, system-driven ecosystem.";

  try {
    const qHome = query(collection(db, "page_home"), limit(1));
    const snapshot = await getDocs(qHome);

    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      return buildMetadata({
        title: data.seoTitle || fallbackTitle,
        description: data.seoDescription || data.heroSubtitle || fallbackDescription,
        path: "/",
        image: data.ogImage || data.logoUrl,
      });
    }
  } catch (error) {
    console.error("Error fetching home metadata:", error);
  }

  return buildMetadata({ title: fallbackTitle, description: fallbackDescription, path: "/" });
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

  // 2. Build the page graph.
  //    The permanent Organization / Founder / WebSite nodes come from the root layout;
  //    here we only add what the CMS knows — the live venture list and homepage FAQs —
  //    attached to the same @id so Google merges them into one entity.
  const ventureList = venturesData
    .filter((venture: any) => venture.visibilityToggle !== false)
    .map((venture: any, index: number) =>
      clean({
        "@type": "ListItem",
        position: index + 1,
        name: venture.title || venture.name,
        description: plainText(venture.ventureTagline, 160) || undefined,
        url: venture.ventureSlug ? absoluteUrl(`/ventures/${venture.ventureSlug}`) : undefined,
      })
    );

  const organizationUpdate = homeData
    ? clean({
        "@type": "Organization",
        "@id": ORG_ID,
        description: plainText(homeData.heroSubtitle, 300) || undefined,
        founder: { "@id": FOUNDER_ID },
        subOrganization: venturesData
          .filter((venture: any) => venture.visibilityToggle !== false)
          .map((venture: any) =>
            clean({
              "@type": "Organization",
              name: venture.title || venture.name,
              url: venture.ventureSlug ? absoluteUrl(`/ventures/${venture.ventureSlug}`) : undefined,
            })
          ),
        sameAs: Array.isArray(homeData.socialLinks)
          ? homeData.socialLinks.map((link: any) => (typeof link === "string" ? link : link?.url)).filter(Boolean)
          : undefined,
      })
    : null;

  const homeSchema = graph(
    webPageNode({
      path: "/",
      name: homeData?.seoTitle || "FourSix46® | Building Scalable Ventures Across Industries",
      description: homeData?.seoDescription || homeData?.heroSubtitle,
      type: "WebPage",
      primaryEntityId: ORG_ID,
      hasBreadcrumb: false,
      dateModified: toIso(homeData?.updatedAt),
    }),
    organizationUpdate,
    ventureList.length > 0
      ? {
          "@type": "ItemList",
          "@id": `${SITE_URL}/#ventures`,
          name: "FourSix46 ventures",
          numberOfItems: ventureList.length,
          itemListElement: ventureList,
        }
      : null,
    faqNode(
      faqData.map((faq: any) => ({ question: faq.question, answer: faq.answer })),
      "/"
    )
  );

  return (
    <>
      {/* 3. Inject the page graph for search engines and AI crawlers */}
      <JsonLd data={homeSchema} id="schema-home" />
      
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