// GET /api/footer — footer settings and the latest blog posts in one small JSON response.
//
// The footer is a client component rendered inside many client pages, so it cannot
// read Firestore on the server itself. It used to query Firestore from the browser,
// where one failed read left the Blogs column on "No recent posts." for every visitor.
// Reading here, on the server, removes that failure mode and keeps the Firestore SDK
// out of the footer's client bundle.
import { NextResponse } from "next/server";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore/lite";
import { db } from "@/lib/firebase-lite";

export const dynamic = "force-dynamic";

const POST_COUNT = 3;

function toMillis(raw: any): number {
  if (!raw) return 0;
  if (typeof raw?.toMillis === "function") return raw.toMillis();
  if (typeof raw?.seconds === "number") return raw.seconds * 1000;
  const parsed = new Date(raw).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
}

async function getSettings() {
  try {
    const snap = await getDocs(query(collection(db, "layout_footer"), limit(1)));
    if (snap.empty) return {};
    const data = snap.docs[0].data();
    return {
      tagline: data.tagline || "",
      copyrightLine: data.copyrightLine || "",
      legalLine: data.legalLine || "",
      socialLinks: Array.isArray(data.socialLinks) ? data.socialLinks : [],
    };
  } catch (error) {
    console.error("[api/footer] settings read failed:", error);
    return {};
  }
}

async function getLatestPosts() {
  const published = where("status", "==", "published");
  const toPost = (doc: any) => {
    const data = doc.data();
    return { slug: String(data.slug || ""), title: String(data.title || ""), dateMs: toMillis(data.publishDate) };
  };

  try {
    const snap = await getDocs(
      query(collection(db, "blog_posts"), published, orderBy("publishDate", "desc"), limit(POST_COUNT))
    );
    return snap.docs.map(toPost).filter((post) => post.slug && post.title);
  } catch (error) {
    // The ordered query needs a composite index. If it is ever missing, sort here
    // instead of leaving the column empty.
    console.error("[api/footer] ordered posts query failed, sorting in memory:", error);
    try {
      const snap = await getDocs(query(collection(db, "blog_posts"), published));
      return snap.docs
        .map(toPost)
        .filter((post) => post.slug && post.title)
        .sort((a, b) => b.dateMs - a.dateMs)
        .slice(0, POST_COUNT);
    } catch (fallbackError) {
      console.error("[api/footer] posts read failed:", fallbackError);
      return [];
    }
  }
}

export async function GET() {
  const [settings, posts] = await Promise.all([getSettings(), getLatestPosts()]);

  return NextResponse.json(
    { settings, posts: posts.map(({ slug, title }) => ({ slug, title })) },
    // Short CDN cache: a new post or a footer edit shows within a minute.
    { headers: { "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=300" } }
  );
}
