"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Clock } from "lucide-react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import { getFirebaseImageUrl } from "@/lib/utils";

function formatDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso)
    .toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
    .toUpperCase();
}

function CategoryPill({ category }: { category: { name: string; color?: string } | null }) {
  if (!category) return null;
  const color = category.color || "#27A9E1";
  return (
    <span
      className="inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-widest"
      style={{ color, borderColor: `${color}66`, backgroundColor: `${color}1A` }}
    >
      {category.name}
    </span>
  );
}

function AuthorByline({ authors, publishDate, readingTime }: { authors: any[]; publishDate?: string; readingTime?: number }) {
  const names = authors.map((a) => a.displayName).filter(Boolean).join(", ");
  return (
    <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-widest text-white/40 font-semibold">
      {names && <span className="text-white/60">{names}</span>}
      {names && <span className="w-1 h-1 bg-white/20 rounded-full" />}
      <span>{formatDate(publishDate)}</span>
      {typeof readingTime === "number" && (
        <>
          <span className="w-1 h-1 bg-white/20 rounded-full" />
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> {readingTime} min read
          </span>
        </>
      )}
    </div>
  );
}

function PostCard({ post, index }: { post: any; index: number }) {
  const imageUrl = getFirebaseImageUrl(post.coverImage);
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: (index % 6) * 0.06 }}
      className="group flex flex-col"
    >
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative w-full aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-surface mb-6">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={post.coverImageAlt || post.title}
              fill
              className="object-cover transition-all duration-700 ease-in-out group-hover:scale-105"
            />
          )}
        </div>
        <div className="flex flex-col items-start gap-3">
          <CategoryPill category={post.category} />
          <h3 className="text-xl md:text-2xl font-sans font-semibold uppercase tracking-tight text-white leading-snug group-hover:text-primary transition-colors">
            {post.title}
          </h3>
          {post.standfirst && (
            <p className="text-white/60 font-light text-sm leading-relaxed line-clamp-2">{post.standfirst}</p>
          )}
          <AuthorByline authors={post.authors} publishDate={post.publishDate} readingTime={post.readingTime} />
        </div>
      </Link>
    </motion.article>
  );
}

export default function BlogClient({
  initialSettings,
  initialCategories,
  initialPosts,
}: {
  initialSettings: any;
  initialCategories: any[];
  initialPosts: any[];
}) {
  const settings = initialSettings || {};
  const categories = initialCategories || [];
  const posts = initialPosts || [];

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const postsPerPage = typeof settings.postsPerPage === "number" && settings.postsPerPage > 0 ? settings.postsPerPage : 9;
  const [visibleCount, setVisibleCount] = useState(postsPerPage);

  const heroPost = useMemo(() => posts.find((p) => p.pinned) || posts.find((p) => p.featured) || null, [posts]);

  const filteredPosts = useMemo(() => {
    const rest = heroPost ? posts.filter((p) => p.id !== heroPost.id) : posts;
    if (activeCategory === "all") return rest;
    return rest.filter((p) => p.category?.slug === activeCategory);
  }, [posts, activeCategory, heroPost]);

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  const handleCategoryChange = (slug: string) => {
    setActiveCategory(slug);
    setVisibleCount(postsPerPage);
  };

  return (
    <main className="min-h-screen bg-black text-white selection:bg-primary selection:text-white">
      <Navbar />

      <header className="pt-40 pb-20 px-6 text-center max-w-7xl mx-auto">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-primary uppercase tracking-widest text-[10px] font-semibold mb-4 block"
        >
          FourSix46 Editorial
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-8xl uppercase tracking-tighter font-semibold text-white"
        >
          {settings.blogPageTitle || "BLOG"}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-white/60 text-lg mt-6 font-light max-w-2xl mx-auto tracking-tight whitespace-pre-wrap"
        >
          {settings.blogPageTagline || "Insight, essays and updates from the FourSix46 ecosystem."}
        </motion.p>
      </header>

      {heroPost && (
        <section className="max-w-7xl mx-auto px-6 mb-20">
          <Link
            href={`/blog/${heroPost.slug}`}
            className="group grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center border border-white/10 rounded-3xl p-6 md:p-10 bg-surface/40 hover:border-primary/40 transition-colors"
          >
            <div className="relative w-full aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-surface">
              {getFirebaseImageUrl(heroPost.coverImage) && (
                <Image
                  src={getFirebaseImageUrl(heroPost.coverImage)}
                  alt={heroPost.coverImageAlt || heroPost.title}
                  fill
                  priority
                  className="object-cover transition-all duration-700 ease-in-out group-hover:scale-105"
                />
              )}
            </div>
            <div className="flex flex-col items-start gap-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                {heroPost.pinned ? "Pinned" : "Featured"}
              </span>
              <CategoryPill category={heroPost.category} />
              <h2 className="text-3xl md:text-5xl font-sans font-semibold uppercase tracking-tighter text-white leading-tight group-hover:text-primary transition-colors">
                {heroPost.title}
              </h2>
              {heroPost.standfirst && (
                <p className="text-white/60 font-light text-base md:text-lg leading-relaxed line-clamp-3">
                  {heroPost.standfirst}
                </p>
              )}
              <AuthorByline authors={heroPost.authors} publishDate={heroPost.publishDate} readingTime={heroPost.readingTime} />
            </div>
          </Link>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-6 mb-16 overflow-x-auto pb-4 no-scrollbar">
        <div className="flex items-center justify-center gap-3 min-w-max">
          <button
            onClick={() => handleCategoryChange("all")}
            className={`rounded-full border px-6 py-2 text-[10px] uppercase tracking-widest font-semibold transition-all duration-300 ${
              activeCategory === "all" ? "bg-white border-white text-black" : "border-white/20 text-white hover:border-white/50"
            }`}
          >
            All Posts
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.slug)}
              className={`rounded-full border px-6 py-2 text-[10px] uppercase tracking-widest font-semibold transition-all duration-300 ${
                activeCategory === cat.slug ? "bg-white border-white text-black" : "border-white/20 text-white hover:border-white/50"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24 min-h-[50vh]">
        <AnimatePresence mode="popLayout">
          {visiblePosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {visiblePosts.map((post, idx) => (
                <PostCard key={post.id} post={post} index={idx} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center w-full">
              <p className="text-white/20 uppercase tracking-widest font-bold text-xs">No posts found in this category.</p>
            </div>
          )}
        </AnimatePresence>

        {hasMore && (
          <div className="flex justify-center mt-16">
            <button
              onClick={() => setVisibleCount((c: number) => c + postsPerPage)}
              className="rounded-full border border-white/20 px-10 py-3 text-[10px] uppercase tracking-widest font-semibold text-white hover:border-primary hover:text-primary transition-all duration-300"
            >
              Load More
            </button>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
