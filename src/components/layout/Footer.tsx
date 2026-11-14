"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

import { FOOTER_DEFAULTS, withCrunchbase, type FooterSocialLink } from "@/lib/footer-defaults";

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
    { name: "Press & Media", href: "/press" },
    { name: "Gallery", href: "/gallery" },
    { name: "Careers", href: "/careers" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact Us", href: "/contact" },
  ],
};

type FooterPost = { slug: string; title: string };

export default function Footer() {
  const [footerData, setFooterData] = useState<any>(null);
  const [latestPosts, setLatestPosts] = useState<FooterPost[]>([]);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    let cancelled = false;
    // Settings and the latest posts come from our own API route (read on the server),
    // so nothing here depends on the Firestore SDK working in the visitor's browser.
    fetch("/api/footer")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        setFooterData(data.settings || null);
        setLatestPosts(Array.isArray(data.posts) ? data.posts : []);
      })
      .catch((error) => console.error("Error fetching footer data:", error));
    return () => {
      cancelled = true;
    };
  }, []);

  // CMS value first, then the shared default — an empty CMS field never blanks the footer.
  const tagline = footerData?.tagline || FOOTER_DEFAULTS.tagline;
  const copyrightLine = String(footerData?.copyrightLine || FOOTER_DEFAULTS.copyrightLine).replace(
    /\{year\}/gi,
    String(currentYear)
  );
  const legalLine = footerData?.legalLine || FOOTER_DEFAULTS.legalLine;
  const socialLinks: FooterSocialLink[] =
    Array.isArray(footerData?.socialLinks) && footerData.socialLinks.length > 0
      ? withCrunchbase(footerData.socialLinks)
      : FOOTER_DEFAULTS.socialLinks;

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
                alt="FourSix46® logo" 
                width={300} 
                height={100} 
                className="h-20 w-auto object-contain block"
                priority
              />
            </Link>
            <p className="text-[#A1A1AA] text-sm leading-relaxed max-w-xs font-sans">
              {tagline}
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
              {socialLinks.map((link) => (
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

          {/* Column 5: latest posts from /blog. The "Read All" link is always present, so
              the column is never a dead end while the posts load. */}
          <div className="space-y-6">
            <h4 className="text-white font-sans text-xs font-semibold uppercase tracking-widest">Blogs</h4>
            <ul className="space-y-4 font-sans flex flex-col">
              {latestPosts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors text-sm line-clamp-2 leading-relaxed"
                    title={post.title}
                  >
                    {post.title}
                  </Link>
                </li>
              ))}
              <li className={latestPosts.length > 0 ? "pt-2" : undefined}>
                <Link href="/blog" className="text-[#27A9E1] hover:text-[#27A9E1]/80 transition-colors text-[10px] font-bold uppercase tracking-widest inline-flex items-center gap-1">
                  Read All
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Section: Sub-footer */}
        <div className="border-t border-[#171717] pt-8 flex flex-col items-center md:items-start gap-8">
          
          {/* Top Row of Sub-footer: Copyright & Legal */}
          <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left space-y-2">
              <p className="text-[#A1A1AA] font-sans text-[10px] font-semibold uppercase tracking-widest">
                {copyrightLine}
              </p>
              {/* Legal line: company number and registered office, directly under the copyright. */}
              <p className="text-[#A1A1AA]/80 font-sans text-[11px] leading-relaxed">{legalLine}</p>
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
              <Link href="/trademarks" prefetch={false} className="text-[#A1A1AA] hover:text-[#FAFAFA] text-sm transition-colors">
                Trademarks
              </Link>
              {/* HTML sitemap — the crawlable index of every public page. */}
              <Link href="/sitemap" prefetch={false} className="text-[#A1A1AA] hover:text-[#FAFAFA] text-sm transition-colors">
                Sitemap
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