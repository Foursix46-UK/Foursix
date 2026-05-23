// app/blog/BlogClient.tsx
// ─────────────────────────────────────────────────────────────────────────────
// CLIENT COMPONENT — Blog list page UI
// Spec: foursix46_blog_spec_simple.pdf — Page A
//
// Sections rendered (top → bottom):
//   1. Navbar (existing)
//   2. Page title + tagline
//   3. Featured post hero card
//   4. Category filter pills
//   5. Post grid (3-col desktop / 2-col tablet / 1-col mobile, 12 per page)
//      — Newsletter signup band inserted after row 1 (after card 3) and at bottom
//   6. Pagination
//   7. Footer (existing)
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Search, Clock, User } from "lucide-react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import { getFirebaseImageUrl } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  standfirst?: string;
  coverImage?: string;
  coverImageAlt?: string;
  categoryId?: string;
  authorIds?: string[];
  authorName?: string; // Add this
  authorAvatar?: string; // Add this
  publishDate?: any; // Firestore Timestamp serialised to { seconds, nanoseconds }
  readingTime?: number;
  featured?: boolean;
  status: string;
}

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  color?: string;
}

interface Props {
  initialSettings: any;
  initialPosts: BlogPost[];
  initialCategories: BlogCategory[];
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** Convert a serialised Firestore Timestamp (or ISO string) to a JS Date. */
function toDate(value: any): Date | null {
  if (!value) return null;
  if (value?.seconds) return new Date(value.seconds * 1000);
  if (typeof value === "string") return new Date(value);
  return null;
}

function formatDate(value: any): string {
  const d = toDate(value);
  if (!d) return "";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Estimated reading time from word count if not stored in CMS. */
function estimateReadingTime(post: BlogPost): number {
  return post.readingTime ?? 5;
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

/** Small category pill used on cards and the filter row. */
function CategoryPill({
  label,
  color,
  onClick,
  active,
}: {
  label: string;
  color?: string;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center px-3 py-1 rounded-full
        font-sans text-[9px] font-bold uppercase tracking-[0.15em]
        transition-all duration-200 cursor-pointer whitespace-nowrap
        ${
          active
            ? "bg-primary text-black"
            : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80"
        }
      `}
      style={active && color ? { backgroundColor: color, color: "#000" } : {}}
    >
      {label}
    </button>
  );
}

/** The large featured post hero card (top of the list page). */
function FeaturedCard({
  post,
  categoryName,
  categoryColor,
}: {
  post: BlogPost;
  categoryName: string;
  categoryColor?: string;
}) {
  const imgUrl = getFirebaseImageUrl(post.coverImage);
  const readTime = estimateReadingTime(post);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="
        grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden
        border border-white/5 bg-surface
      "
    >
      {/* ── Cover image (left column on desktop) ── */}
      <div className="relative aspect-video md:aspect-auto min-h-[280px] bg-white/5 overflow-hidden">
        {imgUrl ? (
          <Image
            src={imgUrl}
            alt={post.coverImageAlt || post.title}
            fill
            className="object-cover"
            priority
            unoptimized
          />
        ) : (
          // Placeholder grid pattern when no image
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(255,255,255,.3) 39px,rgba(255,255,255,.3) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(255,255,255,.3) 39px,rgba(255,255,255,.3) 40px)",
            }}
          />
        )}
      </div>

      {/* ── Text content (right column) ── */}
      <div className="flex flex-col justify-center p-10 md:p-14 gap-6">
        {/* FEATURED · CATEGORY label */}
        <div className="flex items-center gap-3">
          <span className="font-sans text-[9px] font-bold uppercase tracking-[0.2em] text-primary">
            Featured
          </span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span
            className="font-sans text-[9px] font-bold uppercase tracking-[0.2em]"
            style={{ color: categoryColor || "rgba(255,255,255,0.4)" }}
          >
            {categoryName}
          </span>
        </div>

        <h2 className="text-3xl md:text-4xl font-sans font-semibold uppercase tracking-tighter leading-tight text-white">
          {post.title}
        </h2>

        {post.standfirst && (
          <p className="text-sm text-white/50 font-light leading-relaxed">
            {post.standfirst}
          </p>
        )}

        {/* Meta line */}
<div className="flex items-center gap-3 text-[10px] font-sans font-semibold uppercase tracking-widest text-white/30">
  <User className="w-3 h-3" />
  <span>{post.authorName || "FourSix46"}</span> {/* Changed from hardcoded string */}
  <span className="w-1 h-1 rounded-full bg-white/10" />
  <span>{formatDate(post.publishDate)}</span>
  <span className="w-1 h-1 rounded-full bg-white/10" />
  <Clock className="w-3 h-3" />
  <span>{readTime} min read</span>
</div>

        <Link
          href={`/blog/${post.slug}`}
          className="
            inline-flex items-center gap-2 self-start
            font-sans text-[10px] font-bold uppercase tracking-widest
            text-black bg-primary px-6 py-3 rounded-none
            hover:bg-white transition-colors duration-200
          "
        >
          Read article <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.article>
  );
}

/** Standard post card used in the grid. */
function PostCard({ post, categoryName, categoryColor, index }: {
  post: BlogPost;
  categoryName: string;
  categoryColor?: string;
  index: number;
}) {
  const imgUrl = getFirebaseImageUrl(post.coverImage);
  const readTime = estimateReadingTime(post);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="
        group flex flex-col rounded-2xl overflow-hidden
        border border-white/5 bg-surface hover:border-white/10
        transition-colors duration-300
      "
    >
      {/* Cover image — 16:9 */}
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative aspect-video bg-white/5 overflow-hidden">
          {imgUrl ? (
            <Image
              src={imgUrl}
              alt={post.coverImageAlt || post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg,transparent,transparent 19px,rgba(255,255,255,.3) 19px,rgba(255,255,255,.3) 20px),repeating-linear-gradient(90deg,transparent,transparent 19px,rgba(255,255,255,.3) 19px,rgba(255,255,255,.3) 20px)",
              }}
            />
          )}
        </div>
      </Link>

      <div className="flex flex-col flex-1 p-6 gap-4">
        {/* Category pill */}
        <span
          className="self-start font-sans text-[9px] font-bold uppercase tracking-[0.15em] px-2 py-1 rounded-full bg-white/5"
          style={{ color: categoryColor || "rgba(255,255,255,0.4)" }}
        >
          {categoryName}
        </span>

        {/* Title */}
        <Link href={`/blog/${post.slug}`}>
          <h3 className="text-base font-sans font-semibold uppercase tracking-tight leading-snug text-white group-hover:text-primary transition-colors duration-200 line-clamp-3">
            {post.title}
          </h3>
        </Link>

        {/* Excerpt */}
        {post.standfirst && (
          <p className="text-xs text-white/40 font-light leading-relaxed line-clamp-2">
            {post.standfirst}
          </p>
        )}

        {/* Meta */}
        <div className="mt-auto flex items-center gap-2 text-[9px] font-sans font-bold uppercase tracking-widest text-white/25">
  <span>{post.authorName || "FourSix46"}</span> {/* Changed from hardcoded string */}
  <span>·</span>
  <span>{formatDate(post.publishDate)}</span>
  <span>·</span>
  <span>{readTime} min</span>
</div>
      </div>
    </motion.article>
  );
}

/** Newsletter signup band — appears mid-grid and at the bottom. */
/** Newsletter signup band — appears mid-grid and at the bottom. */
function NewsletterBand() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!email || !email.includes("@")) return;
    setLoading(true);
    try {
      // POST to our simplified API route which just writes to Firebase
      await fetch("/api/blog/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, sourcePage: "/blog" }),
      });
      // Immediately show the success state in the UI!
      setSubmitted(true);
    } catch {
      // Silently fail — do not block the user experience
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="col-span-full my-4">
      <div className="rounded-2xl border border-white/5 bg-surface px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <p className="font-sans text-sm font-bold uppercase tracking-widest text-white mb-1">
            STAY INFORMED
          </p>
          <p className="text-xs text-white/40 font-light">
            The FourSix46® Intelligence Brief
          </p>
        </div>
        
        {submitted ? (
          <p className="text-xs font-sans font-bold uppercase tracking-widest text-primary">
            ✓ You're subscribed
          </p>
        ) : (
          <div className="flex items-center gap-0 w-full md:w-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="your@email.com"
              className="
                bg-black border border-white/10 border-r-0
                px-4 py-3 text-xs text-white placeholder:text-white/20
                font-sans outline-none w-full md:w-64
                focus:border-primary transition-colors
              "
            />
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="
                px-6 py-3 bg-primary text-black
                font-sans text-[10px] font-bold uppercase tracking-widest
                hover:bg-white transition-colors duration-200
                disabled:opacity-50 whitespace-nowrap
              "
            >
              {loading ? "..." : "JOIN THE BRIEFING"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/** Pagination controls. */
function Pagination({
  currentPage,
  totalPages,
  onChange,
}: {
  currentPage: number;
  totalPages: number;
  onChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  // Build page number array with ellipsis
  const pages: (number | "...")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  const btn = (label: React.ReactNode, onClick: () => void, disabled: boolean, active = false) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-9 h-9 flex items-center justify-center
        font-sans text-[10px] font-bold uppercase tracking-widest
        border transition-colors duration-200
        ${active ? "border-primary text-primary bg-primary/10" : "border-white/10 text-white/40 hover:border-white/30 hover:text-white/70"}
        disabled:opacity-20 disabled:cursor-not-allowed
      `}
    >
      {label}
    </button>
  );

  return (
    <div className="flex items-center justify-center gap-2 mt-16">
      {btn("‹", () => onChange(currentPage - 1), currentPage === 1)}
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={i} className="text-white/20 text-xs px-1">…</span>
        ) : (
          btn(p, () => onChange(p as number), false, p === currentPage)
        )
      )}
      {btn("›", () => onChange(currentPage + 1), currentPage === totalPages)}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN CLIENT COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function BlogClient({
  initialSettings,
  initialPosts,
  initialCategories,
}: Props) {
  const POSTS_PER_PAGE = initialSettings?.postsPerPage ?? 12;

  // ── State ────────────────────────────────────────────────────────────────
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // ── Derived data ─────────────────────────────────────────────────────────

  // Build a quick lookup: categoryId → { name, color }
  const catMap = useMemo(() => {
    const m: Record<string, { name: string; color?: string }> = {};
    initialCategories.forEach((c) => {
      m[c.id] = { name: c.name, color: c.color };
    });
    return m;
  }, [initialCategories]);

  // The one featured post (first one marked featured)
  const featuredPost = useMemo(
    () => initialPosts.find((p) => p.featured) ?? null,
    [initialPosts]
  );

  // Non-featured posts for the grid
  const gridPosts = useMemo(
    () => initialPosts.filter((p) => !p.featured),
    [initialPosts]
  );

  // Apply category filter + search
  // ── Apply category filter + search ──
// ── Apply category filter + search ──
  // ── Apply category filter + search ──
  const filteredPosts = useMemo(() => {
    return gridPosts.filter((p) => {
      // 1. Force ID extraction
      const postCatId = (p.categoryId && typeof p.categoryId === 'object') 
        ? (p.categoryId as any).id 
        : p.categoryId;

      // 2. LOGGING: This will tell us if it's the category or the search causing the issue
      console.log(`Checking post: "${p.title}" | Post CatID: "${postCatId}" | Active Filter: "${activeCategory}"`);

      const matchCat = activeCategory === "all" || postCatId === activeCategory;
      const matchSearch =
        searchQuery === "" ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.standfirst ?? "").toLowerCase().includes(searchQuery.toLowerCase());
        
      return matchCat && matchSearch;
    });
  }, [gridPosts, activeCategory, searchQuery]); // Paginate
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  // Reset to page 1 when filter or search changes
  function changeCategory(id: string) {
    setActiveCategory(id);
    setCurrentPage(1);
  }

  // Split paginated posts: first 3 get the newsletter band inserted after them
  const firstRow = paginatedPosts.slice(0, 3);
  const restRows = paginatedPosts.slice(3);

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-black">
      <Navbar />

      <div className="pt-24">
        {/* ── Page header ── */}
        <header className="px-6 py-16 max-w-7xl mx-auto border-b border-white/5">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-sans text-[10px] font-semibold uppercase tracking-[0.5em] text-primary mb-4 block"
          >
            FourSix46
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-sans font-semibold uppercase tracking-tight leading-none mb-4"
          >
            {initialSettings?.blogPageTitle || "Blog"}
          </motion.h1>
          {initialSettings?.blogPageTagline && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-base text-white/40 font-light"
            >
              {initialSettings.blogPageTagline}
            </motion.p>
          )}
        </header>

        <div className="max-w-7xl mx-auto px-6 py-16 space-y-16">
          {/* ── Featured post hero card ── */}
          {featuredPost && (
            <section>
              <FeaturedCard
                post={featuredPost}
                categoryName={
                  catMap[featuredPost.categoryId ?? ""]?.name ?? "Editorial"
                }
                categoryColor={catMap[featuredPost.categoryId ?? ""]?.color}
              />
            </section>
          )}

          {/* ── Filter pills + search ── */}
          <section className="space-y-4">
            <p className="font-sans text-[9px] font-bold uppercase tracking-[0.3em] text-white/25">
              Filter by category
            </p>
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Pills */}
              <div className="flex flex-wrap gap-2">
                <CategoryPill
                  label="All"
                  active={activeCategory === "all"}
                  onClick={() => changeCategory("all")}
                />
                {initialCategories.map((cat) => (
                  <CategoryPill
                    key={cat.id}
                    label={cat.name}
                    color={cat.color}
                    active={activeCategory === cat.id}
                    onClick={() => changeCategory(cat.id)}
                  />
                ))}
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-white/30" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search"
                  className="
                    bg-white/5 border border-white/10 pl-8 pr-4 py-2
                    text-xs text-white placeholder:text-white/20 font-sans
                    outline-none focus:border-primary transition-colors w-40
                  "
                />
              </div>
            </div>
          </section>

          {/* ── Post grid ── */}
          <section>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeCategory}-${currentPage}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {paginatedPosts.length === 0 ? (
                  <p className="text-white/30 text-sm text-center py-24">
                    No posts found.
                  </p>
                ) : (
                  <>
                    {/* First 3 posts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {firstRow.map((post, i) => (
                        <PostCard
                          key={post.id}
                          post={post}
                          categoryName={
                            catMap[post.categoryId ?? ""]?.name ?? "Editorial"
                          }
                          categoryColor={catMap[post.categoryId ?? ""]?.color}
                          index={i}
                        />
                      ))}
                    </div>

                    

                    {/* Remaining posts */}
                    {restRows.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                        {restRows.map((post, i) => (
                          <PostCard
                            key={post.id}
                            post={post}
                            categoryName={
                              catMap[post.categoryId ?? ""]?.name ?? "Editorial"
                            }
                            categoryColor={catMap[post.categoryId ?? ""]?.color}
                            index={i + 3}
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onChange={setCurrentPage}
            />
          </section>

          {/* Newsletter band — bottom of page */}
          <NewsletterBand />
        </div>
      </div>

      <Footer />
    </main>
  );
}