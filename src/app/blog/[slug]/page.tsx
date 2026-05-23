// app/blog/[slug]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { collection, getDocs, query, where, limit, documentId, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Schema from "@/components/seo/Schema";
import BlogDetailClient from "./BlogDetailClient";

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
      const title = post.seoTitle || `${post.title} | FourSix46 Blog`;
      const description = post.seoDescription || post.standfirst || "Read this article on the FourSix46 Blog.";
      
      return {
        title,
        description,
        openGraph: {
          title,
          description,
          url: `https://foursix46.com/blog/${slug}`,
          images: [post.ogImage || post.coverImage || "https://foursix46.com/default-og.png"],
        },
      };
    }
  } catch (e) {
    console.error("Error fetching post metadata:", e);
  }
  return { title: "Blog Article | FourSix46" };
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

  // ── JSON-LD structured data (Article Schema) ──────────────────────────
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://foursix46.com/blog/${slug}`
    },
    "headline": post.title,
    "description": post.standfirst,
    "image": post.coverImage,
    "author": {
      "@type": "Person",
      "name": author?.displayName || "FourSix46",
      "url": author?.websiteUrl || "https://foursix46.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "FourSix46 Global Ltd",
      "logo": {
        "@type": "ImageObject",
        "url": "https://foursix46.com/logo.png"
      }
    },
    "datePublished": post.publishDate?.toDate ? post.publishDate.toDate().toISOString() : new Date().toISOString(),
  };

  return (
    <>
      <Schema data={articleSchema} />
      <BlogDetailClient 
        initialPost={JSON.parse(JSON.stringify(post))}
        initialCategory={JSON.parse(JSON.stringify(category || {}))}
        initialAuthor={JSON.parse(JSON.stringify(author || {}))}
        initialTags={JSON.parse(JSON.stringify(tags))}
        initialRelated={JSON.parse(JSON.stringify(relatedPosts))}
      />
    </>
  );
}