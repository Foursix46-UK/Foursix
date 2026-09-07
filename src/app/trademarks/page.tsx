// app/trademarks/page.tsx
import { Metadata } from "next";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import JsonLd from "@/components/seo/JsonLd";
import {
  buildMetadata,
  graph,
  webPageNode,
  breadcrumbNode,
  faqNode,
  clean,
  absoluteUrl,
  toIso,
  trademarkSymbol,
  SITE_URL,
} from "@/lib/seo";
import TrademarksClient from "./TrademarksClient";

export const dynamic = "force-dynamic";

const FALLBACK_TITLE = "Trademarks | FourSix46";
const FALLBACK_DESCRIPTION =
  "Registered and pending trademarks held across the FourSix46 ecosystem, tracked against the official UK and Indian registers.";

// Shared by generateMetadata and the page body so both read the same data.
async function loadTrademarksData() {
  const [settingsSnap, jurisdictionsSnap, proprietorsSnap, trademarksSnap] = await Promise.all([
    getDocs(query(collection(db, "trademarkPageSettings"), limit(1))),
    getDocs(collection(db, "jurisdictions")),
    getDocs(collection(db, "proprietors")),
    getDocs(collection(db, "trademarks")),
  ]);

  const settings = settingsSnap.empty ? null : settingsSnap.docs[0].data();

  const jurisdictionsById = new Map<string, any>(
    jurisdictionsSnap.docs.map((d) => [d.id, { id: d.id, ...d.data() }] as [string, any])
  );
  const proprietorsById = new Map<string, any>(
    proprietorsSnap.docs.map((d) => [d.id, { id: d.id, ...d.data() }] as [string, any])
  );

  const trademarks = trademarksSnap.docs
    .map((doc) => {
      const data: any = doc.data();
      // `jurisdiction`/`proprietor` are FireCMS reference fields, so Firestore hands
      // them back as raw DocumentReference objects. We resolve them to plain data here
      // and rebuild the record explicitly below — a DocumentReference reaching
      // JSON.stringify (for the Client Component prop) throws on its circular
      // internal Firestore handle, so it must never survive past this point.
      const jurisdictionData = data.jurisdiction?.id ? jurisdictionsById.get(data.jurisdiction.id) : undefined;
      const proprietorData = data.proprietor?.id ? proprietorsById.get(data.proprietor.id) : undefined;

      return {
        id: doc.id,
        slug: data.slug,
        markName: data.markName,
        markType: data.markType,
        markImage: data.markImage,
        markImageBg: data.markImageBg,
        filingType: data.filingType,
        applicationNumber: data.applicationNumber,
        registrationNumber: data.registrationNumber,
        filingDate: data.filingDate ? toIso(data.filingDate) : undefined,
        registrationDate: data.registrationDate ? toIso(data.registrationDate) : undefined,
        status: data.status,
        statusUpdated: data.statusUpdated ? toIso(data.statusUpdated) : undefined,
        statusNote: data.statusNote,
        trademarkClasses: Array.isArray(data.trademarkClasses) ? data.trademarkClasses : [],
        summary: data.summary,
        isPrimary: !!data.isPrimary,
        sortOrder: typeof data.sortOrder === "number" ? data.sortOrder : 999,
        showOnParent: data.showOnParent !== false,
        jurisdictionData: jurisdictionData
          ? {
              id: jurisdictionData.id,
              countryName: jurisdictionData.countryName,
              countryCode: jurisdictionData.countryCode,
              officeName: jurisdictionData.officeName,
              officeShort: jurisdictionData.officeShort,
              officeUrl: jurisdictionData.officeUrl,
              recordUrlPattern: jurisdictionData.recordUrlPattern,
              deepLinkSupported: !!jurisdictionData.deepLinkSupported,
              symbolRuleNote: jurisdictionData.symbolRuleNote,
              sortOrder: typeof jurisdictionData.sortOrder === "number" ? jurisdictionData.sortOrder : 999,
            }
          : undefined,
        proprietorData: proprietorData
          ? {
              id: proprietorData.id,
              displayName: proprietorData.displayName,
              legalName: proprietorData.legalName,
              entityType: proprietorData.entityType,
            }
          : undefined,
      };
    })
    .filter((t) => t.showOnParent);

  return { settings, trademarks };
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { settings } = await loadTrademarksData();
    return buildMetadata({
      title: (settings as any)?.metaTitle || FALLBACK_TITLE,
      description: (settings as any)?.metaDescription || FALLBACK_DESCRIPTION,
      path: "/trademarks",
    });
  } catch (error) {
    console.error("Error fetching trademarks metadata:", error);
    return buildMetadata({ title: FALLBACK_TITLE, description: FALLBACK_DESCRIPTION, path: "/trademarks" });
  }
}

export default async function TrademarksPageServer() {
  let settings: any = null;
  let trademarks: any[] = [];

  try {
    const data = await loadTrademarksData();
    settings = data.settings;
    trademarks = data.trademarks;
  } catch (error) {
    console.error("Error fetching trademarks page data:", error);
  }

  const sorted = [...trademarks].sort((a, b) => {
    const jurA = a.jurisdictionData?.sortOrder ?? 999;
    const jurB = b.jurisdictionData?.sortOrder ?? 999;
    if (jurA !== jurB) return jurA - jurB;
    return (a.sortOrder ?? 999) - (b.sortOrder ?? 999);
  });

  const mostRecentUpdate = sorted.reduce((latest: string, t: any) => {
    return t.statusUpdated && t.statusUpdated > latest ? t.statusUpdated : latest;
  }, "");

  const schemaData = graph(
    webPageNode({
      path: "/trademarks",
      name: settings?.metaTitle || FALLBACK_TITLE,
      description: settings?.metaDescription || FALLBACK_DESCRIPTION,
      type: "CollectionPage",
      primaryEntityId: `${SITE_URL}/trademarks#list`,
      dateModified: mostRecentUpdate || undefined,
    }),
    breadcrumbNode([{ name: "Trademarks", path: "/trademarks" }]),
    {
      "@type": "ItemList",
      "@id": `${SITE_URL}/trademarks#list`,
      name: "FourSix46 trademarks",
      numberOfItems: sorted.length,
      itemListElement: sorted.map((t: any, index: number) =>
        clean({
          "@type": "ListItem",
          position: index + 1,
          url: t.slug ? absoluteUrl(`/trademarks/${t.slug}`) : undefined,
          name: t.markName ? `${t.markName}${trademarkSymbol(t.status)}` : undefined,
        })
      ),
    },
    faqNode(settings?.pageFaqs || [], "/trademarks")
  );

  return (
    <>
      <JsonLd data={schemaData} id="schema-trademarks" />
      <TrademarksClient
        initialSettings={JSON.parse(JSON.stringify(settings || {}))}
        initialTrademarks={JSON.parse(JSON.stringify(sorted))}
      />
    </>
  );
}
