// app/blog/page.tsx
import { Metadata } from "next";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import JsonLd from "@/components/seo/JsonLd";
import {
  buildMetadata,
  graph,
  webPageNode,
  breadcrumbNode,
  clean,
  plainText,
  absoluteUrl,
  toIso,
  SITE_URL,
} from "@/lib/seo";
import { getFirebaseImageUrl } from "@/lib/utils";
import BlogClient from "./BlogClient";

export const revalidate = 300; // ISR: re-render in the background at most every 5 minutes instead of on every request

const FALLBACK_TITLE = "Blog | FourSix46";
const FALLBACK_TAGLINE =
  "Insight, essays and updates from the FourSix46 ecosystem.";

// Shared by generateMetadata and the page body so both read the same data.
async function loadBlogData() {
  const [settingsSnap, categoriesSnap, authorsSnap, postsSnap] = await Promise.all([
    getDocs(query(collection(db, "blog_settings"), limit(1))),
    getDocs(query(collection(db, "blog_categories"), orderBy("sortOrder", "asc"))),
    getDocs(collection(db, "blog_authors")),
    getDocs(
      query(collection(db, "blog_posts"), where("status", "==", "published"), orderBy("publishDate", "desc"))
    ),
  ]);

  const settings = settingsSnap.empty ? null : settingsSnap.docs[0].data();

  const categoriesById = new Map<string, any>(
    categoriesSnap.docs.map((d) => [d.id, { id: d.id, ...d.data() }] as [string, any])
  );
  const authorsById = new Map<string, any>(
    authorsSnap.docs.map((d) => [d.id, { id: d.id, ...d.data() }] as [string, any])
  );

  const categories = categoriesSnap.docs.map((d) => {
    const data: any = d.data();
    return {
      id: d.id,
      name: data.name,
      slug: data.slug,
      color: data.color,
      description: data.description,
      sortOrder: typeof data.sortOrder === "number" ? data.sortOrder : 999,
    };
  });

  const posts = postsSnap.docs.map((doc) => {
    const data: any = doc.data();

    // `categoryId`/`authorIds` are Firestore reference fields — resolve them against
    // the maps built above instead of a per-post read, so this stays a single round
    // trip per collection no matter how many posts there are.
    const categoryData = data.categoryId?.id ? categoriesById.get(data.categoryId.id) : undefined;
    const authorRefs: any[] = Array.isArray(data.authorIds) ? data.authorIds : [];
    const authors = authorRefs
      .map((ref) => (ref?.id ? authorsById.get(ref.id) : undefined))
      .filter(Boolean)
      .map((a: any) => ({ id: a.id, displayName: a.displayName, slug: a.slug, avatar: a.avatar }));

    return {
      id: doc.id,
      slug: data.slug,
      title: data.title,
      standfirst: data.standfirst,
      seoDescription: data.seoDescription,
      coverImage: data.coverImage,
      coverImageAlt: data.coverImageAlt,
      publishDate: toIso(data.publishDate),
      readingTime: data.readingTime,
      featured: !!data.featured,
      pinned: !!data.pinned,
      category: categoryData
        ? { id: categoryData.id, name: categoryData.name, slug: categoryData.slug, color: categoryData.color }
        : null,
      authors,
    };
  });

  return { settings, categories, posts };
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { settings } = await loadBlogData();
    return buildMetadata({
      title: settings?.blogPageTitle || FALLBACK_TITLE,
      description: settings?.blogPageTagline || FALLBACK_TAGLINE,
      path: "/blog",
      image: settings?.defaultShareImage ? getFirebaseImageUrl(settings.defaultShareImage) : undefined,
    });
  } catch (error) {
    console.error("Error fetching blog metadata:", error);
    return buildMetadata({ title: FALLBACK_TITLE, description: FALLBACK_TAGLINE, path: "/blog" });
  }
}

export default async function BlogPageServer() {
  let settings: any = null;
  let categories: any[] = [];
  let posts: any[] = [];

  try {
    const data = await loadBlogData();
    settings = data.settings;
    categories = data.categories;
    posts = data.posts;
  } catch (error) {
    console.error("Error fetching blog page data:", error);
  }

  const schemaData = graph(
    webPageNode({
      path: "/blog",
      name: settings?.blogPageTitle || FALLBACK_TITLE,
      description: settings?.blogPageTagline || FALLBACK_TAGLINE,
      type: "CollectionPage",
      primaryEntityId: `${SITE_URL}/blog#list`,
      dateModified: posts[0]?.publishDate || undefined,
    }),
    breadcrumbNode([{ name: "Blog", path: "/blog" }]),
    {
      "@type": "ItemList",
      "@id": `${SITE_URL}/blog#list`,
      name: "FourSix46 blog posts",
      numberOfItems: posts.length,
      itemListElement: posts.map((post: any, index: number) =>
        clean({
          "@type": "ListItem",
          position: index + 1,
          url: post.slug ? absoluteUrl(`/blog/${post.slug}`) : undefined,
          name: post.title,
          description: plainText(post.seoDescription || post.standfirst, 160) || undefined,
        })
      ),
    }
  );

  return (
    <>
      <JsonLd data={schemaData} id="schema-blog" />
      <BlogClient
        initialSettings={JSON.parse(JSON.stringify(settings || {}))}
        initialCategories={JSON.parse(JSON.stringify(categories))}
        initialPosts={JSON.parse(JSON.stringify(posts))}
      />
    </>
  );
}
