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
import Schema from "@/components/seo/Schema";
import BlogClient from "./BlogClient";

export const revalidate = 300;

// ─────────────────────────────────────────────────────────────────────────────
// SEO METADATA
// ─────────────────────────────────────────────────────────────────────────────
export async function generateMetadata(): Promise<Metadata> {
  try {
    const snap = await getDocs(query(collection(db, "blog_settings"), limit(1)));
    if (!snap.empty) {
      const s = snap.docs[0].data();
      const title = s.seoTitle || s.blogPageTitle || "Blog | FourSix46";
      const description =
        s.seoDescription ||
        s.blogPageTagline ||
        "Stories from FourSix46 ventures, press & people.";
      return {
        title,
        description,
        openGraph: {
          title,
          description,
          url: "https://foursix46.com/blog",
        },
      };
    }
  } catch (e) {
    console.error("Blog metadata fetch error:", e);
  }

  return {
    title: "Blog | FourSix46",
    description: "Stories from FourSix46 ventures, press & people.",
    openGraph: {
      title: "Blog | FourSix46",
      description: "Stories from FourSix46 ventures, press & people.",
      url: "https://foursix46.com/blog",
    },
  };
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

  // ... (keep the rest of your existing schema and return statement) ...

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: settings?.blogPageTitle || "Blog",
    url: "https://foursix46.com/blog",
    description:
      settings?.blogPageTagline ||
      "Stories from FourSix46 ventures, press & people.",
    publisher: {
      "@type": "Organization",
      name: "FourSix46 Global Ltd",
      url: "https://foursix46.com",
    },
  };

  return (
    <>
      <Schema data={blogSchema} />
      <BlogClient
        initialSettings={JSON.parse(JSON.stringify(settings || {}))}
        initialPosts={JSON.parse(JSON.stringify(posts))}
        initialCategories={JSON.parse(JSON.stringify(categories))}
      />
    </>
  );
}