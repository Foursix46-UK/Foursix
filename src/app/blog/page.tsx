// app/blog/page.tsx
import { Metadata } from "next";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore/lite";
import { db } from "@/lib/firebase-lite";
import JsonLd from "@/components/seo/JsonLd";
import { getFirebaseImageUrl } from "@/lib/utils";
import BlogClient from "./BlogClient";
import {
  buildMetadata,
  graph,
  webPageNode,
  breadcrumbNode,
  clean,
  plainText,
  toIso,
  absoluteUrl,
  SITE_URL,
  ORG_ID,
} from "@/lib/seo";

export const revalidate = 300;

// ─────────────────────────────────────────────────────────────────────────────
// SEO METADATA
// ─────────────────────────────────────────────────────────────────────────────
export async function generateMetadata(): Promise<Metadata> {
  const fallbackTitle = "Blog | FourSix46";
  const fallbackDescription = "Stories from FourSix46 ventures, press & people.";

  try {
    const snap = await getDocs(query(collection(db, "blog_settings"), limit(1)));
    if (!snap.empty) {
      const s = snap.docs[0].data();
      return buildMetadata({
        title: s.seoTitle || s.blogPageTitle || fallbackTitle,
        description: s.seoDescription || s.blogPageTagline || fallbackDescription,
        path: "/blog",
        image: s.defaultShareImage ? getFirebaseImageUrl(s.defaultShareImage) : undefined,
      });
    }
  } catch (e) {
    console.error("Blog metadata fetch error:", e);
  }

  return buildMetadata({ title: fallbackTitle, description: fallbackDescription, path: "/blog" });
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default async function BlogPageServer() {
  let settings: any = null;
  let posts: any[] = [];
  let categories: any[] = [];

  try {
    const [snapSettings, snapPosts, snapAuthors, snapCats] = await Promise.all([
      getDocs(query(collection(db, "blog_settings"), limit(1))),
      getDocs(
        query(
          collection(db, "blog_posts"),
          where("status", "==", "published"),
          orderBy("publishDate", "desc")
        )
      ),
      getDocs(collection(db, "blog_authors")),
      getDocs(query(collection(db, "blog_categories"), orderBy("sortOrder", "asc"))),
    ]);

    if (!snapSettings.empty) settings = snapSettings.docs[0].data();

    // Build one author map and enrich all post cards from it.
    const authorsMap = new Map();
    snapAuthors.docs.forEach((doc) => authorsMap.set(doc.id, doc.data()));

    // 3. Map posts and attach author names
    posts = snapPosts.docs.map((doc) => {
      const data = doc.data();

      // Extract author IDs safely
      const authorIds = Array.isArray(data.authorIds)
        ? data.authorIds.map((r: any) => (typeof r === 'object' && r !== null ? r.id : r))
        : [];

      // Get primary author name from our map
      const primaryAuthorId = authorIds[0];
      const authorData = authorsMap.get(primaryAuthorId);

      return {
        id: doc.id,
        ...data,
        // The display name we need for the card
        authorName: authorData?.displayName || "FourSix46",
        
        // Safely extract other IDs
        categoryId: (typeof data.categoryId === 'object' && data.categoryId !== null)
          ? (data.categoryId as any).id
          : data.categoryId,
        authorIds,
        tagIds: Array.isArray(data.tagIds)
          ? data.tagIds.map((r: any) => (typeof r === 'object' && r !== null ? r.id : r))
          : [],
        relatedPostIds: Array.isArray(data.relatedPostIds)
          ? data.relatedPostIds.map((r: any) => (typeof r === 'object' && r !== null ? r.id : r))
          : [],
      };
    });

    categories = snapCats.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.error("Blog page fetch error:", e);
  }

  // ── Structured data ────────────────────────────────────────────────────────
  // Blog + an ItemList of every published post, so Google can see the full index
  // from the listing page alone. Each post also carries its own BlogPosting node.
  const blogSchema = graph(
    webPageNode({
      path: "/blog",
      name: settings?.seoTitle || settings?.blogPageTitle || "Blog | FourSix46",
      description:
        settings?.seoDescription ||
        settings?.blogPageTagline ||
        "Stories from FourSix46 ventures, press & people.",
      type: "CollectionPage",
      primaryEntityId: `${SITE_URL}/blog#blog`,
      dateModified: posts[0] ? toIso(posts[0].publishDate) : undefined,
    }),
    breadcrumbNode([{ name: "Blog", path: "/blog" }]),
    {
      "@type": "Blog",
      "@id": `${SITE_URL}/blog#blog`,
      name: settings?.blogPageTitle || "FourSix46 Blog",
      url: absoluteUrl("/blog"),
      description:
        plainText(settings?.blogPageTagline, 300) ||
        "Stories from FourSix46 ventures, press & people.",
      publisher: { "@id": ORG_ID },
      inLanguage: "en-GB",
      blogPost: posts.slice(0, 50).map((post: any) =>
        clean({
          "@type": "BlogPosting",
          "@id": post.slug ? `${absoluteUrl(`/blog/${post.slug}`)}#article` : undefined,
          headline: plainText(post.title, 110),
          description: plainText(post.standfirst || post.seoDescription, 200) || undefined,
          url: post.slug ? absoluteUrl(`/blog/${post.slug}`) : undefined,
          datePublished: toIso(post.publishDate),
          image: post.ogImage || post.coverImage
            ? getFirebaseImageUrl(post.ogImage || post.coverImage)
            : undefined,
          author: { "@type": "Person", name: post.authorName || "FourSix46" },
        })
      ),
    },
    {
      "@type": "ItemList",
      "@id": `${SITE_URL}/blog#list`,
      name: "FourSix46 blog posts",
      numberOfItems: posts.length,
      itemListElement: posts.map((post: any, index: number) =>
        clean({
          "@type": "ListItem",
          position: index + 1,
          name: post.title,
          url: post.slug ? absoluteUrl(`/blog/${post.slug}`) : undefined,
        })
      ),
    }
  );

  return (
    <>
      <JsonLd data={blogSchema} id="schema-blog" />
      <BlogClient
        initialSettings={JSON.parse(JSON.stringify(settings || {}))}
        initialPosts={JSON.parse(JSON.stringify(posts))}
        initialCategories={JSON.parse(JSON.stringify(categories))}
      />
    </>
  );
}