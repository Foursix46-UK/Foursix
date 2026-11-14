// app/page.tsx
//reference home page
import { Metadata } from "next";
import { collection, getDocs, query, limit, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import JsonLd from "@/components/seo/JsonLd";
import HomeClient from "./HomeClient";
import { getFirebaseImageUrl } from "@/lib/utils";
import type { FeaturedOutlet } from "@/components/sections/AsFeaturedIn";
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
  let featuredOutlets: FeaturedOutlet[] = [];
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
    const qPress = query(collection(db, "pressMentions"), where("status", "==", "published"));

    // Run all independent Firestore reads in parallel to reduce TTFB.
    const [
      homeSnapshot,
      venturesSnapshot,
      faqSnapshot,
      statsSnapshot,
      markersSnapshot,
      magsSnapshot,
      newsSnapshot,
      pressSnapshot,
    ] = await Promise.all([
      getDocs(qHome),
      getDocs(qVentures),
      getDocs(qFaqs),
      getDocs(qGlobalStats),
      getDocs(qGlobalMarkers),
      getDocs(qMags),
      getDocs(qNews),
      getDocs(qPress),
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

    // "As featured in": published press entries, newest first, one per outlet. Paid or
    // sponsored placements are left out — the strip claims "featured in", which those
    // entries may never say (same rule as their cards on /press).
    const seenOutlets = new Set<string>();
    featuredOutlets = pressSnapshot.docs
      .map((doc) => ({ id: doc.id, data: doc.data() }))
      .filter(({ data }) => data.outlet && data.url && data.showOnHomepage !== false && data.paidOrSponsored !== true)
      .sort((a, b) => (b.data.date?.toMillis?.() || 0) - (a.data.date?.toMillis?.() || 0))
      .filter(({ data }) => {
        const key = String(data.outlet).trim().toLowerCase();
        if (seenOutlets.has(key)) return false;
        seenOutlets.add(key);
        return true;
      })
      .map(({ id, data }) => ({
        id,
        outlet: String(data.outlet).trim(),
        outletLogo: data.outletLogo ? getFirebaseImageUrl(data.outletLogo) : "",
        url: String(data.url),
      }));
  } catch (error) {
    console.error("Server Error fetching schema data:", error);
  }

  // 2. Build the page graph.
  //    The permanent Organization / Founder / WebSite nodes come from the root layout and
  //    are the ONLY definition of the organisation — this page must not emit a second
  //    Organization entry. Here we only add the live venture list and homepage FAQs.
  const ventureList = venturesData
    .filter((venture: any) => venture.visibilityToggle !== false)
    .map((venture: any, index: number) =>
      clean({
        "@type": "ListItem",
        position: index + 1,
        name: venture.title || venture.name,
        description: plainText(venture.ventureTagline) || undefined,
        url: venture.ventureSlug ? absoluteUrl(`/ventures/${venture.ventureSlug}`) : undefined,
      })
    );

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

      {/* 4. Pre-paint preloader flag. This runs while the HTML is still parsing, so on
             a first visit the cover (see globals.css) is painted on the very first
             frame — the page content is in the HTML for crawlers, but a human never
             sees it flash before the preloader animation. Repeat visits in the same
             session skip it entirely. */}
      <script
        dangerouslySetInnerHTML={{
          __html:
            "try{if(sessionStorage.getItem('home_preloader_seen')!=='1'){document.documentElement.setAttribute('data-preloading','1')}}catch(e){}",
        }}
      />
      
      {/* 5. Pass EVERYTHING to the Client Component */}
      <HomeClient 
        initialHomeData={JSON.parse(JSON.stringify(homeData || {}))} 
        initialVentures={JSON.parse(JSON.stringify(venturesData || []))} 
        initialFaqs={JSON.parse(JSON.stringify(faqData || []))} 
        initialGlobalStats={JSON.parse(JSON.stringify(globalStatsData || {}))}
        initialGlobalMarkers={JSON.parse(JSON.stringify(globalMarkersData || []))}
        // 👇 Pass Magazines safely
        initialMagazines={JSON.parse(JSON.stringify(magazinesData || []))}
        initialNews={JSON.parse(JSON.stringify(newsData || []))}
        initialFeaturedOutlets={homeData?.showFeaturedIn === false ? [] : featuredOutlets}
      />
    </>
  );
}