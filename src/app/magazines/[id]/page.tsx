// app/magazines/[id]/page.tsx
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
  articleNode,
  faqNode,
  toIso,
  plainText,
  absoluteUrl,
} from "@/lib/seo";
import MagazineViewerClient from "./MagazineViewerClient";
import { getFirebaseImageUrl } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;

  try {
    const q = query(collection(db, "magazines"), where("slug", "==", id));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      return buildMetadata({
        title: data.seoTitle || `${data.articleTitle} | FourSix46`,
        description: data.seoDescription || plainText(data.page2IntroText, 160) || `Read ${data.articleTitle}.`,
        path: `/magazines/${id}`,
        image: getFirebaseImageUrl(data.coverImage),
        type: "article",
        publishedTime: toIso(data.publishDate),
        modifiedTime: toIso(data.updatedAt || data.publishDate),
      });
    }
  } catch (error) {
    console.error("Error fetching magazine metadata:", error);
  }

  return buildMetadata({
    title: "Publication Not Found | FourSix46",
    description: "This issue is no longer available.",
    path: `/magazines/${id}`,
    noindex: true,
  });
}

export default async function MagazineViewerServer({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const q = query(collection(db, "magazines"), where("slug", "==", id));
  const snapshot = await getDocs(q);

  // Real 404 rather than a 200 "issue not found" screen.
  if (snapshot.empty) notFound();

  const data = snapshot.docs[0].data();
  const dateObj = data.publishDate?.toDate() || new Date();
  const formattedDate = dateObj
    .toLocaleDateString("en-US", { month: "short", year: "numeric" })
    .toUpperCase();
  const page4Paragraphs = data.page4MainText
    ? data.page4MainText.split("\n").filter((p: string) => p.trim() !== "")
    : [];

  const issueData = {
    id: snapshot.docs[0].id,
    ...data,
    displayDate: formattedDate,
    _isoDate: dateObj.toISOString(),
    page4Paragraphs,
  };

  const path = `/magazines/${id}`;
  const coverImage = getFirebaseImageUrl(data.coverImage);
  const bodyText = plainText(
    [data.page2IntroText, data.page3MainText, data.page4MainText].filter(Boolean).join(" "),
    100000
  );

  const issueFaqs = Array.isArray(data.faqs)
    ? data.faqs.filter((faq: any) => faq?.question && faq?.answer)
    : [];

  const schema = graph(
    webPageNode({
      path,
      name: data.seoTitle || data.articleTitle,
      description: data.seoDescription || plainText(data.page2IntroText, 300),
      type: "WebPage",
      image: coverImage,
      primaryEntityId: `${absoluteUrl(path)}#article`,
      datePublished: dateObj.toISOString(),
      dateModified: toIso(data.updatedAt || data.publishDate),
    }),
    breadcrumbNode([
      { name: "Publications", path: "/magazines" },
      { name: data.articleTitle || id, path },
    ]),
    articleNode({
      path,
      headline: data.articleTitle,
      description: data.seoDescription || plainText(data.page2IntroText, 300),
      image: coverImage,
      datePublished: dateObj.toISOString(),
      dateModified: toIso(data.updatedAt || data.publishDate),
      type: "Article",
      authorName: data.authorContributor,
      authorIsFounder: /46dc|dinesh/i.test(String(data.authorContributor || "")),
      section: data.category || "Editorial",
      wordCount: bodyText ? bodyText.split(/\s+/).length : undefined,
      body: bodyText,
    }),
    faqNode(issueFaqs, path)
  );

  return (
    <>
      <JsonLd data={schema} id={`schema-magazine-${id}`} />
      <MagazineViewerClient initialIssue={JSON.parse(JSON.stringify(issueData))} />
    </>
  );
}
