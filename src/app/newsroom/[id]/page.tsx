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
  clean,
  toIso,
  plainText,
  absoluteUrl,
  ORG_ID,
} from "@/lib/seo";
import ArticleClient from "./ArticleClient";
import { getFirebaseImageUrl } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;

  try {
    const q = query(collection(db, "news"), where("slug", "==", id));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      return buildMetadata({
        title: data.seoTitle || `${data.title} | FourSix46 News`,
        description:
          data.seoDescription || data.desc || data.subHeadline || "Read the latest press release from FourSix46.",
        path: `/newsroom/${id}`,
        image: getFirebaseImageUrl(data.heroImage),
        type: "article",
        publishedTime: toIso(data.publishDate),
        modifiedTime: toIso(data.updatedAt || data.publishDate),
      });
    }
  } catch (error) {
    console.error("Error fetching article metadata:", error);
  }

  return buildMetadata({
    title: "Article Not Found | FourSix46",
    description: "This article is no longer available.",
    path: `/newsroom/${id}`,
    noindex: true,
  });
}

export default async function NewsArticleServer({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const q = query(collection(db, "news"), where("slug", "==", id));
  const snapshot = await getDocs(q);

  // Real 404 instead of a 200 "not found" screen, so crawlers drop the URL cleanly.
  if (snapshot.empty) notFound();

  const data = snapshot.docs[0].data();
  const dateObj = data.publishDate?.toDate() || new Date();
  const formattedDate = dateObj
    .toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    .toUpperCase();
  const paragraphs = data.bodyContent
    ? data.bodyContent.split("\n").filter((p: string) => p.trim() !== "")
    : [];

  const articleData = {
    id: snapshot.docs[0].id,
    ...data,
    date: formattedDate,
    _isoDate: dateObj.toISOString(),
    contentArray: paragraphs,
  };

  const path = `/newsroom/${id}`;
  const heroImage = getFirebaseImageUrl(data.heroImage);
  const bodyText = plainText(data.bodyContent, 100000);

  // Editorial pieces are BlogPosting; official announcements stay NewsArticle. Both are
  // valid Article subtypes, but the right one tells Google which surface to consider.
  const isEditorial = /blog|editorial|insight|opinion|essay/i.test(String(data.category || ""));

  // Optional per-article Q&A from the CMS ("FAQ (Optional)" field on the news record).
  // When an editor fills it in, the article becomes eligible for the FAQ rich result.
  const articleFaqs = Array.isArray(data.faqs)
    ? data.faqs.filter((faq: any) => faq?.question && faq?.answer)
    : [];

  const schema = graph(
    webPageNode({
      path,
      name: data.seoTitle || data.title,
      description: data.seoDescription || data.desc || data.subHeadline,
      type: "WebPage",
      image: heroImage,
      primaryEntityId: `${absoluteUrl(path)}#article`,
      datePublished: dateObj.toISOString(),
      dateModified: toIso(data.updatedAt || data.publishDate),
    }),
    breadcrumbNode([
      { name: "Newsroom", path: "/newsroom" },
      { name: data.title || id, path },
    ]),
    clean({
      ...articleNode({
        path,
        headline: data.title,
        description: data.seoDescription || data.desc || data.subHeadline,
        image: heroImage,
        datePublished: dateObj.toISOString(),
        dateModified: toIso(data.updatedAt || data.publishDate),
        type: isEditorial ? "BlogPosting" : "NewsArticle",
        authorName: data.authorSource,
        // Pieces credited to the founder resolve to the shared founder Person entity.
        authorIsFounder: /46dc|dinesh/i.test(String(data.authorSource || "")),
        section: data.category,
        wordCount: bodyText ? bodyText.split(/\s+/).length : undefined,
        body: bodyText,
      }),
      alternativeHeadline: data.subHeadline || undefined,
      mentions: data.associatedVentureSlug
        ? [
            {
              "@type": "Organization",
              name: data.associatedVentureName || data.associatedVentureSlug,
              url: absoluteUrl(`/ventures/${data.associatedVentureSlug}`),
            },
          ]
        : undefined,
      citation: Array.isArray(data.externalCoverageLinks) && data.externalCoverageLinks.length > 0
        ? data.externalCoverageLinks
        : undefined,
      copyrightHolder: { "@id": ORG_ID },
    }),
    faqNode(articleFaqs, path)
  );

  return (
    <>
      <JsonLd data={schema} id={`schema-news-${id}`} />
      <ArticleClient initialArticle={JSON.parse(JSON.stringify(articleData))} />
    </>
  );
}
