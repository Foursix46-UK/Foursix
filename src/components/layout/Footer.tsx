"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

// --- FIREBASE IMPORTS ---
import { collection, getDocs, query, limit, orderBy, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Static Links that drive the core navigation
const staticLinks = {
  ecosystem: [
    { name: "Home", href: "/" },
    { name: "Vision & Ethos", href: "/about" },
    { name: "Our Ventures", href: "/ventures" },
    { name: "Global Footprint", href: "/global" },
    { name: "Leadership", href: "/leadership" },
    { name: "Partner with Us", href: "/partnership", isAccent: true },
  ],
  intelligence: [
    { name: "Magazines", href: "/magazines" },
    { name: "Newsroom", href: "/newsroom" },
    { name: "Gallery", href: "/gallery" },
    { name: "Careers", href: "/careers" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact Us", href: "/contact" },
  ],
};

const defaultSocialLinks = [
  { platform: "LinkedIn", url: "https://www.linkedin.com/company/foursix46" },
  { platform: "X (Twitter)", url: "https://x.com/FourSix46HQ" },
  { platform: "Instagram", url: "https://www.instagram.com/foursix46hq/" },
  { platform: "TikTok", url: "https://www.tiktok.com/@foursix46hq" },
  { platform: "Facebook", url: "https://www.facebook.com/FourSix46hq" },
  { platform: "YouTube", url: "https://www.youtube.com/@Foursix46hq" },
];

export default function Footer() {
  const [footerData, setFooterData] = useState<any>(null);
  const [latestPosts, setLatestPosts] = useState<any[]>([]);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    async function fetchFooterData() {
      try {
        // 1. Fetch General Footer Layout Data
        const qLayout = query(collection(db, "layout_footer"), limit(1));
        const snapshotLayout = await getDocs(qLayout);
        if (!snapshotLayout.empty) setFooterData(snapshotLayout.docs[0].data());

        // 2. Fetch the 3 Latest Published Blog Posts!
        const qPosts = query(
          collection(db, "blog_posts"),
          where("status", "==", "published"),
          orderBy("publishDate", "desc"),
          limit(3)
        );
        const snapshotPosts = await getDocs(qPosts);
        setLatestPosts(snapshotPosts.docs.map(doc => doc.data()));

      } catch (error) {
        console.error("Error fetching footer data:", error);
      }
    }
    fetchFooterData();
  }, []);

  const socialLinks = footerData?.socialLinks || defaultSocialLinks;

  return (
    <footer className="bg-[#0A0A0A] border-t border-[#171717] pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Top Section: Grid Layout (Updated to 5 columns!) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-24">
          
          {/* Column 1: Brand */}
          <div className="space-y-6">
            <Link 
              href="/" 
              prefetch={true}
              className="inline-block transition-none hover:opacity-100 active:opacity-100"
            >
              <Image 
                src="/logo.png" 
                alt="FourSix46 Logo" 
                width={300} 
                height={100} 
                className="h-20 w-auto object-contain block"
                priority
              />
            </Link>
            <p className="text-[#A1A1AA] text-sm leading-relaxed max-w-xs font-sans">
              {footerData?.brandDescription || "Building the future of logistics, tech, and global impact through structural integrity and aesthetic purity."}
            </p>
          </div>

          {/* Column 2: Ecosystem */}
          <div className="space-y-6">
            <h4 className="text-white font-sans text-xs font-semibold uppercase tracking-widest">Ecosystem</h4>
            <ul className="space-y-4 font-sans">
              {staticLinks.ecosystem.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    prefetch={true}
                    className={cn(
                      "transition-colors text-sm",
                      link.isAccent 
                        ? "text-[#27A9E1] hover:text-[#27A9E1]/80 font-semibold" 
                        : "text-[#A1A1AA] hover:text-[#FAFAFA]"
                    )}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Intelligence */}
          <div className="space-y-6">
            <h4 className="text-white font-sans text-xs font-semibold uppercase tracking-widest">Intelligence</h4>
            <ul className="space-y-4 font-sans">
              {staticLinks.intelligence.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    prefetch={true}
                    className="text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: FOURSIX VERSE (CMS Driven) */}
          <div className="space-y-6">
            <h4 className="text-white font-sans text-xs font-semibold uppercase tracking-widest">FOURSIX VERSE</h4>
            <ul className="space-y-4 font-sans">
              {socialLinks.map((link: any) => (
                <li key={link.platform}>
                  <a 
                    href={link.url} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#A1A1AA] hover:text-[#27A9E1] transition-colors text-sm"
                  >
                    {link.platform}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 👇 Column 5: LATEST FROM THE BLOG */}
          <div className="space-y-6">
            <h4 className="text-white font-sans text-xs font-semibold uppercase tracking-widest">Blogs</h4>
            <ul className="space-y-4 font-sans flex flex-col">
              {latestPosts.length > 0 ? (
                latestPosts.map((post) => (
                  <li key={post.slug}>
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors text-sm line-clamp-2 leading-relaxed"
                      title={post.title}
                    >
                      {post.title}
                    </Link>
                  </li>
                ))
              ) : (
                <li>
                  <span className="text-[#A1A1AA] text-sm italic">No recent posts.</span>
                </li>
              )}
              {latestPosts.length > 0 && (
                <li className="pt-2">
                  <Link href="/blog" className="text-[#27A9E1] hover:text-[#27A9E1]/80 transition-colors text-[10px] font-bold uppercase tracking-widest inline-flex items-center gap-1">
                    Read All
                  </Link>
                </li>
              )}
            </ul>
          </div>

        </div>

        {/* Bottom Section: Sub-footer */}
        <div className="border-t border-[#171717] pt-8 flex flex-col items-center md:items-start gap-8">
          
          {/* Top Row of Sub-footer: Copyright & Legal */}
          <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-[#A1A1AA] font-sans text-[10px] font-semibold uppercase tracking-widest text-center md:text-left">
              © {currentYear} FourSix46 Global Ltd. All rights reserved.
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 md:gap-8 font-sans">
              <Link href="/privacy" prefetch={true} className="text-[#A1A1AA] hover:text-[#FAFAFA] text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" prefetch={true} className="text-[#A1A1AA] hover:text-[#FAFAFA] text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" prefetch={true} className="text-[#A1A1AA] hover:text-[#FAFAFA] text-sm transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>

          {/* Bottom Row of Sub-footer: Attribution */}
          <div className="w-full flex justify-center text-[#A1A1AA] font-sans text-sm pb-4">
            <div className="flex items-center gap-1 text-center">
              Designed & built by
              <a
                href="https://stack46.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[#27A9E1] hover:underline ml-1"
              >
                <span className="font-semibold">Stack46</span>
              </a>
              <span className="mx-1">·</span>
              <span>Full-stack software agency</span>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}