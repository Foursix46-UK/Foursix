"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Linkedin, Globe, Mail, Twitter } from "lucide-react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { getFirebaseImageUrl } from "@/lib/utils";

function formatDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso)
    .toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
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

function authorLink(author: any): string | null {
  if (author.websiteUrl) return author.websiteUrl.startsWith("http") ? author.websiteUrl : `https://${author.websiteUrl}`;
  if (author.linkedinUrl) return author.linkedinUrl.startsWith("http") ? author.linkedinUrl : `https://${author.linkedinUrl}`;
  if (author.email) return `mailto:${author.email}`;
  return null;
}

function AuthorRow({ author }: { author: any }) {
  const avatarUrl = getFirebaseImageUrl(author.avatar);
  const href = authorLink(author);
  const nameNode = (
    <span className="text-white font-semibold text-sm group-hover:text-primary transition-colors">
      {author.displayName}
    </span>
  );

  return (
    <div className="flex items-center gap-3">
      {avatarUrl && (
        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/10 bg-surface flex-shrink-0">
          <Image src={avatarUrl} alt={author.displayName || "Author"} fill className="object-cover" />
        </div>
      )}
      <div className="flex flex-col">
        {href ? (
          <a href={href} target={href.startsWith("mailto:") ? undefined : "_blank"} rel="noopener noreferrer" className="group w-fit">
            {nameNode}
          </a>
        ) : (
          nameNode
        )}
        {author.role && <span className="text-white/40 text-[10px] uppercase tracking-widest font-semibold">{author.role}</span>}
      </div>
    </div>
  );
}

export default function BlogPostClient({ initialPost }: { initialPost: any }) {
  const post = initialPost;

  if (!post) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <h1 className="text-4xl font-black uppercase mb-4 text-white">Post Not Found</h1>
        <Link href="/blog">
          <Button variant="outline" className="rounded-none font-sans text-xs font-semibold uppercase tracking-widest px-8 text-white">
            Back to Blog
          </Button>
        </Link>
      </main>
    );
  }

  const coverImageUrl = getFirebaseImageUrl(post.coverImage);
  const authors: any[] = post.authors || [];
  const tags: any[] = post.tags || [];
  const related: any[] = post.related || [];

  return (
    <main className="min-h-screen bg-black text-white selection:bg-primary selection:text-white">
      <Navbar />

      <div className="max-w-3xl mx-auto pt-32 px-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 font-sans text-[10px] font-semibold uppercase tracking-widest text-white/70 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Blog
        </Link>
      </div>

      <header className="max-w-3xl mx-auto px-6 pt-10 text-left">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <CategoryPill category={post.category} />
          </div>

          <h1 className="text-4xl md:text-5xl font-sans font-semibold uppercase tracking-tighter text-white leading-[1.1] mb-6">
            {post.title}
          </h1>

          {post.standfirst && (
            <p className="text-xl md:text-2xl font-light text-white/70 leading-relaxed mb-8">{post.standfirst}</p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-6 border-t border-white/10 pt-6">
            <div className="flex flex-wrap items-center gap-8">
              {authors.map((author) => (
                <AuthorRow key={author.id} author={author} />
              ))}
            </div>
            <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest text-white/40 font-semibold">
              <span>{formatDate(post.publishDate)}</span>
              {typeof post.readingTime === "number" && (
                <>
                  <span className="w-1 h-1 bg-white/20 rounded-full" />
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {post.readingTime} min read
                  </span>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </header>

      {coverImageUrl && (
        <motion.figure
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="max-w-4xl mx-auto px-6 my-12"
        >
          <div className="relative w-full aspect-[16/9] overflow-hidden rounded-3xl border border-white/10 shadow-2xl bg-surface">
            <Image src={coverImageUrl} alt={post.coverImageAlt || post.title} fill className="object-cover" priority />
          </div>
          {(post.coverImageCaption || post.coverImageCredit) && (
            <figcaption className="mt-3 text-xs text-white/40 font-light flex justify-between gap-4 flex-wrap">
              <span>{post.coverImageCaption}</span>
              {post.coverImageCredit && <span className="text-white/30">{post.coverImageCredit}</span>}
            </figcaption>
          )}
        </motion.figure>
      )}

      <article className="max-w-3xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="prose prose-invert prose-lg max-w-none text-white/80 font-light leading-[1.8] prose-headings:font-sans prose-headings:uppercase prose-headings:tracking-tight prose-headings:text-white prose-a:text-primary prose-strong:text-white prose-img:rounded-2xl"
          dangerouslySetInnerHTML={{ __html: post.body || "" }}
        />

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-16 pt-8 border-t border-white/10">
            {tags.map((tag: any) => (
              <span
                key={tag.id}
                className="inline-flex items-center rounded-full border border-white/15 px-4 py-1.5 text-[10px] uppercase tracking-widest text-white/60 font-semibold"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        {authors.length > 0 && (
          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col gap-6">
            <p className="font-sans text-[10px] uppercase tracking-widest font-black text-white/40">Written by</p>
            {authors.map((author) => (
              <div key={author.id} className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                <AuthorRow author={author} />
                <div className="flex items-center gap-4 md:ml-2">
                  {author.shortBio && <p className="text-white/50 font-light text-sm max-w-xl">{author.shortBio}</p>}
                </div>
                <div className="flex items-center gap-3 md:ml-auto">
                  {author.linkedinUrl && (
                    <a href={author.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-primary transition-colors">
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {author.twitterHandle && (
                    <a
                      href={`https://x.com/${String(author.twitterHandle).replace(/^@/, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/40 hover:text-primary transition-colors"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                  )}
                  {author.websiteUrl && (
                    <a
                      href={author.websiteUrl.startsWith("http") ? author.websiteUrl : `https://${author.websiteUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/40 hover:text-primary transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                    </a>
                  )}
                  {author.email && (
                    <a href={`mailto:${author.email}`} className="text-white/40 hover:text-primary transition-colors">
                      <Mail className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Share / cross-link block */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <p className="font-sans text-[10px] uppercase tracking-widest font-black text-white">Share this post</p>
            <p className="font-sans text-[10px] uppercase tracking-widest text-white/40 font-bold">FourSix46 Blog</p>
          </div>
          <div className="flex items-center gap-6">
            <a
              href={`https://x.com/intent/tweet?url=${encodeURIComponent(`https://foursix46.com/blog/${post.slug}`)}&text=${encodeURIComponent(post.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-[10px] uppercase tracking-widest font-black hover:text-primary transition-colors text-white"
            >
              Share on X
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://foursix46.com/blog/${post.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-[10px] uppercase tracking-widest font-black hover:text-primary transition-colors text-white"
            >
              Share on LinkedIn
            </a>
            <Link href="/blog" className="font-sans text-[10px] uppercase tracking-widest font-black hover:text-primary transition-colors text-white">
              More Posts &rarr;
            </Link>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pb-32 border-t border-white/10 pt-24">
          <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.4em] text-white/30 mb-12">Related Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {related.map((r: any) => {
              const relatedImage = getFirebaseImageUrl(r.coverImage);
              return (
                <Link key={r.id} href={`/blog/${r.slug}`} className="group flex flex-col gap-4">
                  <div className="relative w-full aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-surface">
                    {relatedImage && (
                      <Image
                        src={relatedImage}
                        alt={r.coverImageAlt || r.title}
                        fill
                        className="object-cover transition-all duration-700 ease-in-out group-hover:scale-105"
                      />
                    )}
                  </div>
                  <CategoryPill category={r.category} />
                  <h3 className="text-lg font-sans font-semibold uppercase tracking-tight text-white leading-snug group-hover:text-primary transition-colors">
                    {r.title}
                  </h3>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
