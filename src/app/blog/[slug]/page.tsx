// app/blog/[slug]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { collection, getDocs, query, where, limit, documentId, orderBy } from "firebase/firestore/lite";
import { db } from "@/lib/firebase-lite";
import JsonLd from "@/components/seo/JsonLd";
import { getFirebaseImageUrl } from "@/lib/utils";
// Runs DOMPurify against jsdom on the server and the native DOM in the browser, so the
// article body can be sanitized here and shipped inside the server HTML.
import DOMPurify from "isomorphic-dompurify";
import BlogDetailClient from "./BlogDetailClient";
import {
  buildMetadata,
  graph,
  webPageNode,
  breadcrumbNode,
  articleNode,
  faqNode,
  clean,
  plainText,
  toIso,
  absoluteUrl,
  ORG_ID,
  FOUNDER_ID,
} from "@/lib/seo";

export const dynamic = "force-dynamic";

// ─────────────────────────────────────────────────────────────────────────────
// SEO METADATA
// ─────────────────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;

  try {
    const snap = await getDocs(query(collection(db, "blog_posts"), where("slug", "==", slug), limit(1)));
    if (!snap.empty) {
      const post = snap.docs[0].data();
      return buildMetadata({
        title: post.seoTitle || `${post.title} | FourSix46 Blog`,
        description:
          post.seoDescription || plainText(post.standfirst, 160) || "Read this article on the FourSix46 Blog.",
        path: `/blog/${slug}`,
        // Cover images are stored as Storage paths; schema and OG need absolute URLs.
        image: getFirebaseImageUrl(post.ogImage || post.coverImage),
        type: "article",
        publishedTime: toIso(post.publishDate),
        modifiedTime: toIso(post.updatedAt || post.publishDate),
        // Drafts, scheduled and archived posts must never be indexed even if the URL leaks.
        noindex: post.status !== "published",
      });
    }
  } catch (e) {
    console.error("Error fetching post metadata:", e);
  }

  return buildMetadata({
    title: "Article Not Found | FourSix46",
    description: "This article is no longer available.",
    path: `/blog/${slug}`,
    noindex: true,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// SERVER PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default async function BlogDetailPageServer({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  let post: any = null;
  let category: any = null;
  let author: any = null;
  let tags: any[] = [];
  let relatedPosts: any[] = [];

  try {
    // 1. Fetch the main post
    const qPost = query(collection(db, "blog_posts"), where("slug", "==", slug), limit(1));
    const snapPost = await getDocs(qPost);
    
    if (snapPost.empty) return notFound();
    
    post = { id: snapPost.docs[0].id, ...snapPost.docs[0].data() };

    // 2. Fetch Category
    // 2. Fetch Category (Safely extracting the ID from the Reference object)
    if (post.categoryId) {
      const catId = typeof post.categoryId === 'string' ? post.categoryId : post.categoryId.id;
      const snapCat = await getDocs(query(collection(db, "blog_categories"), where(documentId(), "==", catId)));
      if (!snapCat.empty) category = { id: snapCat.docs[0].id, ...snapCat.docs[0].data() };
    }

    // 3. Fetch Primary Author 
    if (post.authorIds && post.authorIds.length > 0) {
      const authId = typeof post.authorIds[0] === 'string' ? post.authorIds[0] : post.authorIds[0].id;
      const snapAuthor = await getDocs(query(collection(db, "blog_authors"), where(documentId(), "==", authId)));
      if (!snapAuthor.empty) author = { id: snapAuthor.docs[0].id, ...snapAuthor.docs[0].data() };
    }

    // 4. Fetch Tags
    if (post.tagIds && post.tagIds.length > 0) {
      const tagIdsList = post.tagIds.map((t: any) => typeof t === 'string' ? t : t.id).slice(0, 10);
      const snapTags = await getDocs(query(collection(db, "blog_tags"), where(documentId(), "in", tagIdsList)));
      tags = snapTags.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    // 5. Fetch Related Posts
    if (post.relatedPostIds && post.relatedPostIds.length > 0) {
      const relatedIdsList = post.relatedPostIds.map((r: any) => typeof r === 'string' ? r : r.id).slice(0, 3);
      const snapRelated = await getDocs(query(collection(db, "blog_posts"), where(documentId(), "in", relatedIdsList)));
      relatedPosts = snapRelated.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } else if (post.categoryId) {
      // Auto-fallback
      const catId = typeof post.categoryId === 'string' ? post.categoryId : post.categoryId.id;
      const snapRelated = await getDocs(
        query(
          collection(db, "blog_posts"),
          where("categoryId", "==", catId), // 👈 Use safe catId
          where("status", "==", "published"),
          orderBy("publishDate", "desc"),
          limit(4)
        )
      );
      relatedPosts = snapRelated.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(p => p.id !== post.id)
        .slice(0, 3);
    }

  } catch (error) {
    console.error("Error fetching blog post details:", error);
    return notFound();
  }

  // ── JSON-LD structured data ────────────────────────────────────────────────
  const path = `/blog/${slug}`;
  // Sanitize on the server so the article text is in the HTML itself. Doing this in a
  // client useEffect left the entire body out of View Source — invisible to any reader
  // that does not execute JavaScript.
  const safeBodyHtml = DOMPurify.sanitize(post.body || "");

  const rawImage = post.ogImage || post.coverImage;
  const image = rawImage ? getFirebaseImageUrl(rawImage) : undefined;
  const publishedIso = toIso(post.publishDate);
  const modifiedIso = toIso(post.updatedAt || post.publishDate);
  const bodyText = plainText(post.body, 100000);

  // The founder resolves to the site-wide Person entity so every piece he authors
  // strengthens one identity rather than creating a new one per post.
  const authorIsFounder =
    /46dc|dinesh/i.test(String(author?.displayName || "")) || author?.websiteUrl === "https://www.46dc.com";

  const authorSameAs = [author?.linkedinUrl, author?.websiteUrl,
    author?.twitterHandle
      ? `https://x.com/${String(author.twitterHandle).replace(/^@/, "")}`
      : undefined,
  ].filter(Boolean) as string[];

  const authorNode = authorIsFounder
    ? { "@id": FOUNDER_ID }
    : clean({
        "@type": "Person",
        "@id": author?.slug ? `${absoluteUrl(`/blog/author/${author.slug}`)}#person` : undefined,
        name: author?.displayName || "FourSix46",
        jobTitle: author?.role || undefined,
        description: plainText(author?.shortBio, 300) || undefined,
        image: author?.avatar ? getFirebaseImageUrl(author.avatar) : undefined,
        url: author?.websiteUrl || absoluteUrl("/blog"),
        worksFor: { "@id": ORG_ID },
        sameAs: authorSameAs.length > 0 ? authorSameAs : undefined,
      });

  // Optional per-post Q&A from the CMS ("FAQ (Optional)" on the blog post record).
  // Filling it in makes the post eligible for Google's FAQ rich result.
  const postFaqs = Array.isArray(post.faqs)
    ? post.faqs.filter((faq: any) => faq?.question && faq?.answer)
    : [];

  const articleSchema = graph(
    webPageNode({
      path,
      name: post.seoTitle || post.title,
      description: post.seoDescription || plainText(post.standfirst, 300),
      type: "WebPage",
      image,
      primaryEntityId: `${absoluteUrl(path)}#article`,
      datePublished: publishedIso,
      dateModified: modifiedIso,
    }),
    breadcrumbNode([
      { name: "Blog", path: "/blog" },
      { name: post.title || slug, path },
    ]),
    clean({
      ...articleNode({
        path,
        headline: post.title,
        description: post.seoDescription || plainText(post.standfirst, 300),
        image,
        datePublished: publishedIso,
        dateModified: modifiedIso,
        type: "BlogPosting",
        section: category?.name,
        wordCount: bodyText ? bodyText.split(/\s+/).length : undefined,
        body: bodyText,
      }),
      // articleNode() defaults the author to the organisation; the blog knows the real one.
      author: authorNode,
      alternativeHeadline: plainText(post.standfirst, 240) || undefined,
      keywords: tags.length > 0 ? tags.map((tag: any) => tag.name).filter(Boolean) : undefined,
      timeRequired: post.readingTime ? `PT${parseInt(String(post.readingTime), 10) || 3}M` : undefined,
      isPartOf: { "@id": `${absoluteUrl("/blog")}#blog` },
      copyrightHolder: { "@id": ORG_ID },
      copyrightYear: publishedIso.slice(0, 4),
    }),
    faqNode(postFaqs, path)
  );

  return (
    <>
      <JsonLd data={articleSchema} id={`schema-blog-${slug}`} />
      <BlogDetailClient 
        initialPost={JSON.parse(JSON.stringify(post))}
        initialBodyHtml={safeBodyHtml}
        initialCategory={JSON.parse(JSON.stringify(category || {}))}
        initialAuthor={JSON.parse(JSON.stringify(author || {}))}
        initialTags={JSON.parse(JSON.stringify(tags))}
        initialRelated={JSON.parse(JSON.stringify(relatedPosts))}
      />
    </>
  );
}