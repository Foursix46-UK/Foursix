// app/blog/[slug]/page.tsx
import { Metadata } from "next";
import {
  collection,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  DocumentReference,
  DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { notFound } from "next/navigation";
import JsonLd from "@/components/seo/JsonLd";
import {
  buildMetadata,
  graph,
  webPageNode,
  breadcrumbNode,
  articleNode,
  clean,
  toIso,
  absoluteUrl,
} from "@/lib/seo";
import { getFirebaseImageUrl } from "@/lib/utils";
import BlogPostClient from "./BlogPostClient";

export const revalidate = 300; // ISR: re-render in the background at most every 5 minutes instead of on every request

type Ref = DocumentReference<DocumentData>;

async function resolveRefs(refs: any[]): Promise<any[]> {
  const list: Ref[] = Array.isArray(refs) ? refs.filter((r) => r?.id) : [];
  if (list.length === 0) return [];
  const snaps = await Promise.all(list.map((ref) => getDoc(ref as Ref)));
  return snaps.filter((s) => s.exists()).map((s) => ({ id: s.id, ...s.data() }));
}

async function loadRelatedFallback(categoryRef: any, excludeId: string) {
  if (!categoryRef?.id) return [];
  try {
    const snap = await getDocs(
      query(
        collection(db, "blog_posts"),
        where("categoryId", "==", categoryRef),
        where("status", "==", "published"),
        orderBy("publishDate", "desc"),
        limit(4)
      )
    );
    return snap.docs
      .filter((d) => d.id !== excludeId)
      .slice(0, 3)
      .map((d) => ({ id: d.id, ...(d.data() as any) }));
  } catch (error) {
    console.error("Error fetching related blog posts fallback:", error);
    return [];
  }
}

// Shared by generateMetadata and the page body so both read the same data.
async function loadBlogPost(slug: string) {
  const [postSnap, settingsSnap] = await Promise.all([
    getDocs(query(collection(db, "blog_posts"), where("slug", "==", slug), limit(1))),
    getDocs(query(collection(db, "blog_settings"), limit(1))),
  ]);

  if (postSnap.empty) return null;

  const raw: any = postSnap.docs[0].data();
  const id = postSnap.docs[0].id;

  if (raw.status !== "published") return null;

  const settings = settingsSnap.empty ? null : settingsSnap.docs[0].data();

  const [categorySnap, authors, tags] = await Promise.all([
    raw.categoryId?.id ? getDoc(raw.categoryId as Ref) : Promise.resolve(null),
    resolveRefs(raw.authorIds),
    resolveRefs(raw.tagIds),
  ]);
  const categoryData: any = categorySnap && categorySnap.exists() ? { id: categorySnap.id, ...categorySnap.data() } : null;

  let relatedRaw = await resolveRefs(raw.relatedPostIds);
  relatedRaw = relatedRaw.filter((p: any) => p.status === "published" && p.id !== id).slice(0, 3);
  if (relatedRaw.length === 0) {
    relatedRaw = await loadRelatedFallback(raw.categoryId, id);
  }

  // Resolve each related post's own category for its pill — small (<=3), fine in full.
  const relatedCategoryIds = Array.from(
    new Set(relatedRaw.map((p: any) => p.categoryId?.id).filter(Boolean))
  ) as string[];
  const relatedCategoriesById = new Map<string, any>();
  if (relatedCategoryIds.length > 0) {
    await Promise.all(
      relatedRaw.map(async (p: any) => {
        if (!p.categoryId?.id || relatedCategoriesById.has(p.categoryId.id)) return;
        const snap = await getDoc(p.categoryId as Ref);
        if (snap.exists()) relatedCategoriesById.set(p.categoryId.id, { id: snap.id, ...snap.data() });
      })
    );
  }

  const related = relatedRaw.map((p: any) => {
    const cat = p.categoryId?.id ? relatedCategoriesById.get(p.categoryId.id) : undefined;
    return {
      id: p.id,
      slug: p.slug,
      title: p.title,
      coverImage: p.coverImage,
      coverImageAlt: p.coverImageAlt,
      standfirst: p.standfirst,
      readingTime: p.readingTime,
      category: cat ? { id: cat.id, name: cat.name, slug: cat.slug, color: cat.color } : null,
    };
  });

  return { id, raw, settings, categoryData, authors, tags, related };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;

  try {
    const data = await loadBlogPost(slug);
    if (!data) {
      return buildMetadata({
        title: "Post Not Found | FourSix46 Blog",
        description: "This post is no longer available.",
        path: `/blog/${slug}`,
        noindex: true,
      });
    }

    const { raw, settings } = data;
    const image = raw.ogImage
      ? getFirebaseImageUrl(raw.ogImage)
      : raw.coverImage
      ? getFirebaseImageUrl(raw.coverImage)
      : settings?.defaultShareImage
      ? getFirebaseImageUrl(settings.defaultShareImage)
      : undefined;

    return buildMetadata({
      title: raw.seoTitle || `${raw.title} | FourSix46 Blog`,
      description: raw.seoDescription || raw.standfirst || "Read the latest from the FourSix46 blog.",
      path: `/blog/${slug}`,
      image,
      type: "article",
      publishedTime: toIso(raw.publishDate),
      modifiedTime: toIso(raw.publishDate),
    });
  } catch (error) {
    console.error("Error fetching blog post metadata:", error);
    return buildMetadata({
      title: "Blog | FourSix46",
      description: "Insight, essays and updates from the FourSix46 ecosystem.",
      path: `/blog/${slug}`,
    });
  }
}

export default async function BlogPostServer({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await loadBlogPost(slug);
  if (!data) notFound();

  const { id, raw, settings, categoryData, authors, tags, related } = data;
  const path = `/blog/${slug}`;
  const datePublished = toIso(raw.publishDate);
  const coverImageUrl = raw.coverImage ? getFirebaseImageUrl(raw.coverImage) : undefined;
  const shareImage = raw.ogImage
    ? getFirebaseImageUrl(raw.ogImage)
    : coverImageUrl || (settings?.defaultShareImage ? getFirebaseImageUrl(settings.defaultShareImage) : undefined);

  const primaryAuthor = authors[0];
  const authorNames = authors.map((a: any) => a.displayName).filter(Boolean).join(", ");
  const authorIsFounder = /46dc|dinesh/i.test(String(primaryAuthor?.displayName || primaryAuthor?.slug || ""));

  const schemaData = graph(
    webPageNode({
      path,
      name: raw.seoTitle || raw.title,
      description: raw.seoDescription || raw.standfirst,
      type: "WebPage",
      image: shareImage,
      primaryEntityId: `${absoluteUrl(path)}#article`,
      datePublished,
      dateModified: datePublished,
    }),
    breadcrumbNode([
      { name: "Blog", path: "/blog" },
      { name: raw.title || slug, path },
    ]),
    clean({
      ...articleNode({
        path,
        headline: raw.title,
        description: raw.seoDescription || raw.standfirst,
        image: shareImage,
        datePublished,
        dateModified: datePublished,
        type: "BlogPosting",
        authorName: authorNames || undefined,
        authorIsFounder,
        section: categoryData?.name,
        wordCount: raw.body ? String(raw.body).replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length : undefined,
      }),
    })
  );

  const initialPost = {
    id,
    slug: raw.slug,
    title: raw.title,
    standfirst: raw.standfirst,
    body: raw.body,
    coverImage: raw.coverImage,
    coverImageAlt: raw.coverImageAlt,
    coverImageCaption: raw.coverImageCaption,
    coverImageCredit: raw.coverImageCredit,
    publishDate: datePublished,
    readingTime: raw.readingTime,
    category: categoryData
      ? { id: categoryData.id, name: categoryData.name, slug: categoryData.slug, color: categoryData.color }
      : null,
    authors: authors.map((a: any) => ({
      id: a.id,
      displayName: a.displayName,
      slug: a.slug,
      avatar: a.avatar,
      role: a.role,
      shortBio: a.shortBio,
      email: a.email,
      linkedinUrl: a.linkedinUrl,
      twitterHandle: a.twitterHandle,
      websiteUrl: a.websiteUrl,
    })),
    tags: tags.map((t: any) => ({ id: t.id, name: t.name, slug: t.slug })),
    related,
  };

  return (
    <>
      <JsonLd data={schemaData} id={`schema-blog-${slug}`} />
      <BlogPostClient initialPost={JSON.parse(JSON.stringify(initialPost))} />
    </>
  );
}
