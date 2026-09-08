// app/trademarks/[slug]/page.tsx
import { Metadata } from "next";
import { collection, getDocs, query, where, getDoc, DocumentReference, DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { notFound } from "next/navigation";
import JsonLd from "@/components/seo/JsonLd";
import {
  buildMetadata,
  graph,
  webPageNode,
  breadcrumbNode,
  faqNode,
  toIso,
  absoluteUrl,
  trademarkSymbol,
  trademarkNode,
  ORG_ID,
  FOUNDER_ID,
  type TrademarkOwnerInput,
} from "@/lib/seo";
import { getFirebaseImageUrl } from "@/lib/utils";
import TrademarkClient from "./TrademarkClient";

export const revalidate = 300; // ISR: re-render in the background at most every 5 minutes instead of on every request

async function loadTrademark(slug: string) {
  const snap = await getDocs(query(collection(db, "trademarks"), where("slug", "==", slug)));
  if (snap.empty) return null;

  const raw: any = snap.docs[0].data();
  const id = snap.docs[0].id;

  // Cast to DocumentReference<DocumentData>: raw is `any`, so without this the
  // generic on getDoc() can't be inferred and silently defaults to `unknown`, which
  // then can't be spread below ("Spread types may only be created from object types").
  const [jurisdictionSnap, proprietorSnap, ventureSnap] = await Promise.all([
    raw.jurisdiction?.id ? getDoc(raw.jurisdiction as DocumentReference<DocumentData>) : Promise.resolve(null),
    raw.proprietor?.id ? getDoc(raw.proprietor as DocumentReference<DocumentData>) : Promise.resolve(null),
    raw.venture?.id ? getDoc(raw.venture as DocumentReference<DocumentData>) : Promise.resolve(null),
  ]);

  const jurisdictionData =
    jurisdictionSnap && jurisdictionSnap.exists() ? { id: jurisdictionSnap.id, ...jurisdictionSnap.data() } : null;
  const proprietorData =
    proprietorSnap && proprietorSnap.exists() ? { id: proprietorSnap.id, ...proprietorSnap.data() } : null;
  const ventureData: any =
    ventureSnap && ventureSnap.exists() ? { id: ventureSnap.id, ...ventureSnap.data() } : null;

  // Other marks in the ecosystem — small collection, fine to fetch in full and filter.
  // Also pull every jurisdiction so each related mark can carry its jurisdiction's
  // country name without an extra getDoc() per mark (same batch-and-map pattern the
  // index page uses for its own jurisdiction join).
  const [allSnap, allJurisdictionsSnap] = await Promise.all([
    getDocs(collection(db, "trademarks")),
    getDocs(collection(db, "jurisdictions")),
  ]);
  const jurisdictionsById = new Map<string, any>(
    allJurisdictionsSnap.docs.map((d) => [d.id, { id: d.id, ...d.data() }] as [string, any])
  );
  const related = allSnap.docs
    .map((d) => ({ id: d.id, ...(d.data() as any) }))
    .filter((t) => t.id !== id && t.showOnParent !== false)
    .map((t) => {
      const relatedJurisdiction = t.jurisdiction?.id ? jurisdictionsById.get(t.jurisdiction.id) : undefined;
      return {
        id: t.id,
        slug: t.slug,
        markName: t.markName,
        status: t.status,
        markType: t.markType,
        markImage: t.markImage,
        markImageBg: t.markImageBg,
        jurisdictionCountryName: relatedJurisdiction?.countryName,
      };
    });

  return {
    id,
    raw,
    jurisdictionData: jurisdictionData as any,
    proprietorData: proprietorData as any,
    ventureData: ventureData
      ? {
          id: ventureData.id,
          title: ventureData.title,
          ventureSlug: ventureData.ventureSlug,
          url: ventureData.url,
        }
      : null,
    related,
  };
}

/** Resolves a proprietor record to the owner shape trademarkNode() needs, reusing the
 * site's existing global @id anchors (ORG_ID / FOUNDER_ID) whenever the proprietor is
 * the parent company or its founder — the two proprietors seeded so far — so the mark's
 * owner node merges into the same entity graph as the rest of the site, rather than
 * forking off a duplicate, unlinked node. */
function resolveOwner(proprietorData: any, path: string): TrademarkOwnerInput {
  if (!proprietorData) {
    return { kind: "organization", id: ORG_ID, name: "FourSix46 Global Ltd" };
  }
  if (proprietorData.entityType === "Individual") {
    const isFounder = proprietorData.legalName === "KOYYALAMUDI DINESH CHANDRA";
    return {
      kind: "person",
      id: isFounder ? FOUNDER_ID : `${absoluteUrl(path)}#proprietor`,
      name: proprietorData.displayName,
      legalName: proprietorData.legalName,
      url: proprietorData.verifyUrl,
    };
  }
  const isParentCompany = proprietorData.legalName === "FOURSIX46 GLOBAL LTD";
  return {
    kind: "organization",
    id: isParentCompany ? ORG_ID : `${absoluteUrl(path)}#proprietor`,
    name: proprietorData.displayName,
    companyNumber: proprietorData.registrationNumber,
  };
}

function metaTitlePattern(markName: string, status: string, jurisdictionName?: string) {
  const symbol = trademarkSymbol(status);
  return `${markName}${symbol} Trademark${jurisdictionName ? ` — ${jurisdictionName}` : ""} — FourSix46`;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const data = await loadTrademark(slug);
    if (!data) {
      return buildMetadata({ title: "Trademark Not Found | FourSix46", description: "This mark is no longer listed.", path: `/trademarks/${slug}`, noindex: true });
    }
    const { raw, jurisdictionData } = data;
    return buildMetadata({
      title: raw.metaTitle || metaTitlePattern(raw.markName, raw.status, jurisdictionData?.countryName),
      description: raw.metaDescription || raw.summary,
      path: `/trademarks/${slug}`,
      image: raw.ogImage ? getFirebaseImageUrl(raw.ogImage) : raw.markImage ? getFirebaseImageUrl(raw.markImage) : null,
    });
  } catch (error) {
    console.error("Error fetching trademark metadata:", error);
    return buildMetadata({ title: "Trademark | FourSix46", description: "A FourSix46 trademark record.", path: `/trademarks/${slug}` });
  }
}

export default async function TrademarkPageServer({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await loadTrademark(slug);
  if (!data) notFound();

  const { raw, jurisdictionData, proprietorData, ventureData, related } = data;
  const path = `/trademarks/${slug}`;
  const owner = resolveOwner(proprietorData, path);

  const classes = Array.isArray(raw.trademarkClasses)
    ? raw.trademarkClasses.map((c: any) => ({ classNumber: c.classNumber, applicationNumber: c.applicationNumber }))
    : [];

  const { mark, owner: ownerNode } = trademarkNode({
    path,
    markName: raw.markName,
    markType: raw.markType,
    description: raw.summary,
    jurisdictionName: jurisdictionData?.countryName || "",
    officeName: jurisdictionData?.officeName || "",
    status: raw.status,
    filingDate: raw.filingDate ? toIso(raw.filingDate) : undefined,
    applicationNumber: raw.applicationNumber,
    classes,
    officialRecordUrl: raw.officialRecordUrl,
    ventureUrl: ventureData?.url,
    owner,
  });

  const schemaData = graph(
    webPageNode({
      path,
      name: raw.metaTitle || metaTitlePattern(raw.markName, raw.status, jurisdictionData?.countryName),
      description: raw.metaDescription || raw.summary,
      type: "WebPage",
      image: raw.markImage ? getFirebaseImageUrl(raw.markImage) : undefined,
      primaryEntityId: `${absoluteUrl(path)}#mark`,
      dateModified: raw.statusUpdated ? toIso(raw.statusUpdated) : undefined,
      datePublished: raw.filingDate ? toIso(raw.filingDate) : undefined,
    }),
    breadcrumbNode([
      { name: "Trademarks", path: "/trademarks" },
      { name: `${raw.markName}${trademarkSymbol(raw.status)}`, path },
    ]),
    mark,
    ownerNode,
    faqNode(raw.faqs || [], path)
  );

  const initialTrademark = {
    id: data.id,
    slug: raw.slug,
    markName: raw.markName,
    markType: raw.markType,
    markImage: raw.markImage,
    markImageBg: raw.markImageBg,
    filingType: raw.filingType,
    applicationNumber: raw.applicationNumber,
    registrationNumber: raw.registrationNumber,
    filingDate: raw.filingDate ? toIso(raw.filingDate) : undefined,
    registrationDate: raw.registrationDate ? toIso(raw.registrationDate) : undefined,
    officialRecordUrl: raw.officialRecordUrl,
    journalUrl: raw.journalUrl,
    status: raw.status,
    statusUpdated: raw.statusUpdated ? toIso(raw.statusUpdated) : undefined,
    statusNote: raw.statusNote,
    trademarkClasses: classes.length
      ? raw.trademarkClasses.map((c: any) => ({
          classNumber: c.classNumber,
          classHeading: c.classHeading,
          specification: c.specification,
          applicationNumber: c.applicationNumber,
          classStatus: c.classStatus,
        }))
      : [],
    summary: raw.summary,
    story: raw.story,
    classNote: raw.classNote,
    usageEnabled: !!raw.usageEnabled,
    usageIntro: raw.usageIntro,
    usageCorrect: raw.usageCorrect,
    usageIncorrect: raw.usageIncorrect,
    faqs: raw.faqs || [],
    jurisdictionData: jurisdictionData
      ? {
          countryName: jurisdictionData.countryName,
          countryCode: jurisdictionData.countryCode,
          officeName: jurisdictionData.officeName,
          officeShort: jurisdictionData.officeShort,
          officeUrl: jurisdictionData.officeUrl,
          recordUrlPattern: jurisdictionData.recordUrlPattern,
          deepLinkSupported: !!jurisdictionData.deepLinkSupported,
          symbolRuleNote: jurisdictionData.symbolRuleNote,
          registryStages: Array.isArray(jurisdictionData.registryStages)
            ? jurisdictionData.registryStages
                .filter((s: any) => s?.stageName)
                .map((s: any) => ({ stageName: s.stageName, stageDescription: s.stageDescription }))
            : [],
        }
      : null,
    proprietorData: proprietorData
      ? {
          displayName: proprietorData.displayName,
          legalName: proprietorData.legalName,
          entityType: proprietorData.entityType,
          verifyUrl: proprietorData.verifyUrl,
          bioShort: proprietorData.bioShort,
          registrationNumber: proprietorData.registrationNumber,
        }
      : null,
    ventureData,
    related,
  };

  return (
    <>
      <JsonLd data={schemaData} id={`schema-trademark-${slug}`} />
      <TrademarkClient initialTrademark={JSON.parse(JSON.stringify(initialTrademark))} />
    </>
  );
}
