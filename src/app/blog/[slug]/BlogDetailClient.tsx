"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { ArrowRight,ArrowLeft, Clock, User, Link as LinkIcon, Twitter, Linkedin, Mail, ThumbsUp, ThumbsDown } from "lucide-react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import { getFirebaseImageUrl } from "@/lib/utils";
import DOMPurify from 'dompurify';
// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function toDate(value: any): Date | null {
  if (!value) return null;
  if (value?.seconds) return new Date(value.seconds * 1000);
  if (typeof value === "string") return new Date(value);
  return null;
}

function formatDate(value: any): string {
  const d = toDate(value);
  if (!d) return "";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function BlogDetailClient({ initialPost, initialCategory, initialAuthor, initialTags, initialRelated }: any) {
  const post = initialPost;
  const category = initialCategory;
  const author = initialAuthor;
  const tags = initialTags;
  const related = initialRelated;

  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  // FIX: Provide a default value so the server and client match
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const imgUrl = getFirebaseImageUrl(post.coverImage);
  const authorImgUrl = getFirebaseImageUrl(author?.avatar);

  // ── Share Logic ──
  // Use useMemo to ensure these only recalculate when currentUrl changes
  const shareUrls = React.useMemo(() => ({
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(post.title)}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(post.title)}`,
    email: `mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(`Read this article: ${currentUrl}`)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${post.title} - ${currentUrl}`)}`
  }), [currentUrl, post.title]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const ShareButtons = ({ className = "" }: { className?: string }) => (
    <div className={`flex items-center gap-4 ${className}`}>
      <button onClick={handleCopyLink} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors relative group">
        <LinkIcon className="w-4 h-4 text-white/70" />
        {copied && <span className="absolute -top-8 text-[9px] uppercase tracking-widest text-primary font-bold">Copied</span>}
      </button>
      {/* Ensure href uses the shareUrls object */}
      <a href={currentUrl ? shareUrls.twitter : "#"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#1DA1F2] hover:border-[#1DA1F2] transition-colors">
        <Twitter className="w-4 h-4 text-white/70" />
      </a>
      <a href={currentUrl ? shareUrls.linkedin : "#"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#0A66C2] hover:border-[#0A66C2] transition-colors">
        <Linkedin className="w-4 h-4 text-white/70" />
      </a>
      <a href={currentUrl ? shareUrls.email : "#"} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
        <Mail className="w-4 h-4 text-white/70" />
      </a>
    </div>
  );
function BackButton() {
  return (
    <Link 
      href="/blog" 
      className="fixed top-24 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-md border border-white/10 rounded-full text-white/70 hover:text-white hover:border-white/30 transition-all duration-300"
    >
      <ArrowLeft className="w-4 h-4" />
      <span className="text-[10px] font-bold uppercase tracking-widest">Back</span>
    </Link>
  );
}

  // ... rest of your return statement

  return (
    <main className="min-h-screen bg-black">
      <BackButton />
      <Navbar />

      <div className="pt-32 pb-24">
        {/* ── 1. HEADER & BREADCRUMB ── */}
        <header className="max-w-4xl mx-auto px-6 mb-12 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 font-sans text-[9px] font-bold uppercase tracking-[0.2em] text-white/30 mb-8">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-white/70">{category.name || "Editorial"}</span>
          </div>

          {category.name && (
            <Link href="/blog">
              <span 
                className="inline-block px-3 py-1 rounded-full font-sans text-[9px] font-bold uppercase tracking-[0.15em] bg-white/5 mb-6"
                style={{ color: category.color || "rgba(255,255,255,0.4)" }}
              >
                {category.name}
              </span>
            </Link>
          )}

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl lg:text-6xl font-sans font-semibold uppercase tracking-tighter leading-tight text-white mb-6">
            {post.title}
          </motion.h1>

          {post.standfirst && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-lg md:text-xl text-white/60 font-light leading-relaxed mb-8 max-w-3xl md:mx-0 mx-auto">
              {post.standfirst}
            </motion.p>
          )}

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-[10px] font-sans font-bold uppercase tracking-widest text-white/40 border-t border-white/5 pt-8">
            {authorImgUrl && (
              <div className="w-8 h-8 rounded-full overflow-hidden relative">
                <Image src={authorImgUrl} alt={author.displayName} fill className="object-cover" />
              </div>
            )}
            <span className="text-white">{author?.displayName || "FourSix46"}</span>
            <span className="w-1 h-1 rounded-full bg-white/10" />
            <span>{formatDate(post.publishDate)}</span>
            <span className="w-1 h-1 rounded-full bg-white/10" />
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readingTime || 5} min read</span>
          </div>
        </header>

        {/* ── 2. HERO IMAGE ── */}
        <div className="max-w-6xl mx-auto px-6 mb-16">
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-white/5 border border-white/5">
            {imgUrl && <Image src={imgUrl} alt={post.coverImageAlt || post.title} fill className="object-cover" priority />}
          </div>
          {(post.coverImageCaption || post.coverImageCredit) && (
            <div className="flex items-center justify-between mt-4 text-[10px] font-sans font-bold uppercase tracking-widest text-white/30">
              <span>{post.coverImageCaption}</span>
              <span>{post.coverImageCredit}</span>
            </div>
          )}
        </div>

        {/* ── 3. BODY LAYOUT (Left Rail + Center Content) ── */}
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 relative">
          
          {/* Mobile Share (Hidden on Desktop) */}
          <div className="lg:hidden flex flex-col items-center justify-center border-y border-white/5 py-8 mb-8">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30 mb-4">Share Article</span>
            <ShareButtons />
          </div>

          {/* Desktop Left Rail: Sticky Share */}
          <aside className="hidden lg:block lg:col-span-2">
            <div className="sticky top-32 flex flex-col gap-6">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">Share</span>
              <ShareButtons className="flex-col items-start" />
            </div>
          </aside>

          {/* Article Content (Center, max ~720px wide) */}
          <article 
  className="lg:col-span-8 max-w-[720px] mx-auto w-full prose prose-invert prose-p:text-white/60 prose-p:font-light prose-headings:text-white prose-headings:font-sans prose-headings:uppercase prose-a:text-primary"
  dangerouslySetInnerHTML={{ 
    __html: DOMPurify.sanitize(post.body || "") 
  }} 
/>

          {/* Right Rail (Empty for spacing) */}
          <div className="hidden lg:block lg:col-span-2"></div>
        </div>

        {/* ── 4. POST-ARTICLE SECTIONS ── */}
        <div className="max-w-[720px] mx-auto px-6 mt-16 space-y-16">
          
          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-8 border-t border-white/5">
              {tags.map((tag: any) => (
                <span key={tag.id} className="px-3 py-1 rounded-full bg-white/5 text-[9px] font-bold uppercase tracking-widest text-white/40">
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

          {/* Feedback */}
          <div className="flex items-center justify-between p-6 rounded-2xl bg-surface border border-white/5">
            <span className="text-xs font-bold uppercase tracking-widest text-white/60">Was this article helpful?</span>
            <div className="flex gap-2">
              <button onClick={() => setFeedback("up")} className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${feedback === "up" ? "bg-primary border-primary text-black" : "border-white/10 text-white/50 hover:bg-white/10"}`}>
                <ThumbsUp className="w-4 h-4" />
              </button>
              <button onClick={() => setFeedback("down")} className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${feedback === "down" ? "bg-white border-white text-black" : "border-white/10 text-white/50 hover:bg-white/10"}`}>
                <ThumbsDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Author Card */}
          {author && (
            <div className="p-8 rounded-2xl border border-white/5 bg-transparent flex flex-col md:flex-row gap-6 items-start">
              {authorImgUrl && (
                <div className="w-20 h-20 rounded-full overflow-hidden relative shrink-0">
                  <Image src={authorImgUrl} alt={author.displayName} fill className="object-cover" />
                </div>
              )}
              <div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-primary mb-1 block">Written By</span>
                <h4 className="text-xl font-sans font-semibold uppercase tracking-tighter text-white mb-1">{author.displayName}</h4>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-4">{author.role}</p>
                <p className="text-sm text-white/60 font-light leading-relaxed mb-4">{author.shortBio}</p>
                <div className="flex gap-3">
                  {author.linkedinUrl && <a href={author.linkedinUrl} target="_blank" rel="noreferrer" className="text-white/40 hover:text-white transition-colors"><Linkedin className="w-4 h-4" /></a>}
                  {author.twitterHandle && <a href={`https://twitter.com/${author.twitterHandle}`} target="_blank" rel="noreferrer" className="text-white/40 hover:text-white transition-colors"><Twitter className="w-4 h-4" /></a>}
                  {author.websiteUrl && <a href={author.websiteUrl} target="_blank" rel="noreferrer" className="text-white/40 hover:text-white transition-colors"><LinkIcon className="w-4 h-4" /></a>}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── 5. RELATED POSTS ── */}
        {related.length > 0 && (
          <div className="max-w-7xl mx-auto px-6 mt-32 border-t border-white/5 pt-24">
            <div className="flex items-center justify-between mb-12">
              <h3 className="text-3xl font-sans font-semibold uppercase tracking-tighter text-white">Continue Reading</h3>
              <Link href="/blog" className="hidden md:flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-primary transition-colors">
                View All Posts <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((rel: any) => {
                const relImg = getFirebaseImageUrl(rel.coverImage);
                return (
                  <Link key={rel.id} href={`/blog/${rel.slug}`} className="group flex flex-col rounded-2xl overflow-hidden border border-white/5 bg-surface hover:border-white/10 transition-colors duration-300">
                    <div className="relative aspect-video bg-white/5 overflow-hidden">
                      {relImg && <Image src={relImg} alt={rel.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />}
                    </div>
                    <div className="p-6 flex flex-col gap-4">
                      <h4 className="text-base font-sans font-semibold uppercase tracking-tight leading-snug text-white group-hover:text-primary transition-colors duration-200 line-clamp-2">
                        {rel.title}
                      </h4>
                      <div className="mt-auto flex items-center gap-2 text-[9px] font-sans font-bold uppercase tracking-widest text-white/25">
                        <span>{formatDate(rel.publishDate)}</span>
                        <span>·</span>
                        <span>{rel.readingTime || 5} min read</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            
            <Link href="/blog" className="md:hidden flex items-center justify-center gap-2 mt-8 text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-primary transition-colors">
              View All Posts <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}

      </div>
      <Footer />
    </main>
  );
}