'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import HTMLFlipBook from 'react-pageflip';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Navbar from '@/components/navigation/Navbar';
import { magazineData } from '@/lib/magazine-data';
import { Button } from '@/components/ui/button';

// --- Types ---
interface PageProps {
  children: React.ReactNode;
  number: number;
}

// --- Page Component (Forward Ref required for react-pageflip) ---
const Page = React.forwardRef<HTMLDivElement, PageProps>((props, ref) => {
  return (
    <div className="page relative h-full w-full bg-[#F5F5F7] text-black shadow-2xl overflow-hidden" ref={ref}>
      <div className="h-full flex flex-col p-8 md:p-12">
        {props.children}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-sans text-[8px] font-bold uppercase tracking-widest text-black/20">
          Page {props.number}
        </div>
      </div>
    </div>
  );
});

Page.displayName = 'MagazinePage';

// --- Base Dimensions for Scaling ---
const BASE_PAGE_WIDTH = 440;
const BASE_PAGE_HEIGHT = 586;
const BASE_BOOK_WIDTH = BASE_PAGE_WIDTH * 2;

export default function MagazineViewer() {
  const params = useParams();
  const slug = params.id as string;
  const bookRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [mounted, setMounted] = useState(false);
  const [scale, setScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  const issue = magazineData.find(m => m.slug === slug);

  // --- Dynamic Scaling & Responsive Logic ---
  const handleResize = useCallback(() => {
    if (!containerRef.current) return;
    
    const width = window.innerWidth;
    setIsMobile(width < 768);

    const padding = 60; // Safe margin for UI elements
    const availableWidth = width - padding;
    const availableHeight = containerRef.current.offsetHeight - padding;
    
    const scaleX = availableWidth / BASE_BOOK_WIDTH;
    const scaleY = availableHeight / BASE_PAGE_HEIGHT;
    
    const newScale = Math.min(scaleX, scaleY, 1); 
    setScale(newScale);
  }, []);

  useEffect(() => {
    setMounted(true);
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  if (!mounted) return null;

  if (!issue) {
    return (
      <main className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
        <h1 className="text-4xl font-black uppercase mb-4 text-white">Issue Not Found</h1>
        <Link href="/magazines">
          <Button variant="outline" className="rounded-none font-sans text-xs font-semibold uppercase tracking-widest px-8 text-white">
            Back to Magazines
          </Button>
        </Link>
      </main>
    );
  }

  const magImg = PlaceHolderImages.find(img => img.id === issue.coverImage);

  // --- Mobile Layout (Native Vertical Scroll) ---
  if (isMobile) {
    return (
      <main className="min-h-screen w-full bg-[#0A0A0A] text-white flex flex-col selection:bg-primary selection:text-white pb-24">
        <Navbar />
        
        <div className="pt-24 px-6 shrink-0 z-50 flex justify-between items-center">
          <Link 
            href="/magazines"
            className="inline-flex items-center gap-2 font-sans text-[10px] font-semibold uppercase tracking-widest text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3 h-3" /> Back to Magazines
          </Link>
        </div>

        <div className="flex flex-col gap-16 px-6 mt-12">
          {/* Section 1: Cover */}
          <section className="relative aspect-[3/4] w-full rounded-xl overflow-hidden shadow-2xl border border-white/5">
            {magImg && (
              <Image
                src={magImg.imageUrl}
                alt="Cover"
                fill
                className="object-cover"
                priority
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8">
              <span className="text-white font-sans text-[8px] font-bold uppercase tracking-[0.5em] mb-2 block">{issue.issueVolume}</span>
              <h1 className="text-5xl font-sans font-black uppercase text-white tracking-tighter leading-none">
                {issue.articleTitle.split(' ').map((w, i) => (
                  <span key={i} className="block">{w}</span>
                ))}
              </h1>
            </div>
          </section>

          {/* Section 2: Header Metadata */}
          <section className="space-y-6">
            <div className="space-y-1">
              <span className="text-primary font-sans text-[10px] font-bold uppercase tracking-widest">
                {issue.magazineSeriesName} · {issue.articleType} · {issue.readingTime} · {issue.publishDate}
              </span>
              <h2 className="text-3xl font-sans font-black uppercase tracking-tight">{issue.articleTitle}</h2>
            </div>
            
            <div className="pt-4 border-t border-white/5">
              <span className="block font-sans text-[10px] font-bold uppercase text-white">{issue.authorContributor}</span>
              <span className="block font-sans text-[8px] uppercase tracking-widest text-white/40">{issue.themeTag} Specialist</span>
            </div>
          </section>

          {/* Section 3: Dynamic Body Content */}
          <section className="space-y-12">
            {issue.bodyContent.map((block, idx) => (
              <div key={idx} className="space-y-4">
                {block.type === 'text' && (
                  <p className="text-lg font-light leading-relaxed text-white/80 font-sans">
                    {block.content}
                  </p>
                )}
                {block.type === 'image' && block.url && (
                  <div className="space-y-3">
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 grayscale">
                      <Image src={block.url} alt={block.content} fill className="object-cover" />
                    </div>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold text-center italic">{block.caption || block.content}</p>
                  </div>
                )}
              </div>
            ))}
          </section>

          {/* Section 5: Back Cover */}
          <section className="pt-12 border-t border-white/10 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 relative opacity-30 grayscale invert">
              <Image 
                src="/logo2.png" 
                alt="Logo" 
                fill 
                className="object-contain"
              />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-sans font-black uppercase tracking-widest">FOURSIX46</h4>
              <p className="text-[6px] font-sans font-semibold uppercase tracking-[0.5em] text-white/30">
                Quiet Luxury • Brutal Efficiency
              </p>
            </div>
            <span className="text-[5px] font-sans uppercase tracking-[0.8em] text-white/10 mt-8 block">© 2026 HOUSE OF MULTIBRANDS ALL RIGHTS RESERVED</span>
          </section>
        </div>
      </main>
    );
  }

  // --- Desktop Layout (3D Flipbook) ---
  return (
    <main className="h-screen w-full bg-[#0A0A0A] flex flex-col overflow-hidden selection:bg-primary selection:text-white">
      <Navbar />

      <div className="shrink-0 px-8 pt-24 md:pt-28 flex justify-between items-center z-40">
        <Link 
          href="/magazines"
          className="inline-flex items-center gap-2 font-sans text-[10px] font-semibold uppercase tracking-widest text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3 h-3" /> Back to Magazines
        </Link>
      </div>

      <div 
        ref={containerRef}
        className="flex-1 w-full flex items-center justify-center p-6 overflow-hidden relative"
      >
        <div 
          style={{ 
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
            width: `${BASE_BOOK_WIDTH}px`,
            height: `${BASE_PAGE_HEIGHT}px`,
            transition: 'transform 0.3s ease-out',
            willChange: 'transform'
          }}
          className="relative shadow-[0_50px_100px_rgba(0,0,0,0.6)]"
        >
          {/* @ts-ignore */}
          <HTMLFlipBook
            width={BASE_PAGE_WIDTH}
            height={BASE_PAGE_HEIGHT}
            size="stretch"
            minWidth={315}
            maxWidth={1000}
            minHeight={400}
            maxHeight={1533}
            maxShadowOpacity={0.5}
            showCover={true}
            mobileScrollSupport={true}
            ref={bookRef}
            className="flipbook-root"
          >
            {/* Page 1: Cover */}
            <Page number={1}>
              <div className="h-full flex flex-col justify-between -m-8 md:-m-12 relative">
                <div className="absolute inset-0 z-0">
                  {magImg && (
                    <Image
                      src={magImg.imageUrl}
                      alt="Cover"
                      fill
                      className="object-cover"
                      priority
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>
                <div className="relative z-10 p-8 md:p-12 flex flex-col justify-end h-full">
                  <span className="text-white font-sans text-[10px] font-bold uppercase tracking-[0.5em] mb-4">{issue.issueVolume}</span>
                  <h1 className="text-6xl md:text-8xl font-sans font-black uppercase text-white tracking-tighter leading-none mb-4">
                    {issue.articleTitle.split(' ').map((w, i) => (
                      <span key={i} className="block">{w}</span>
                    ))}
                  </h1>
                  <p className="text-white/60 font-sans text-[10px] font-semibold uppercase tracking-widest">
                    {issue.magazineSeriesName} • {issue.themeTag}
                  </p>
                </div>
              </div>
            </Page>

            {/* Page 2: Inside Left - Author & Intro */}
            <Page number={2}>
              <div className="space-y-10">
                <div className="space-y-2">
                  <span className="text-primary font-sans text-[10px] font-bold uppercase tracking-widest">{issue.articleType} · {issue.readingTime} · {issue.publishDate}</span>
                  <h2 className="text-3xl font-sans font-black uppercase tracking-tight leading-tight">{issue.articleTitle}</h2>
                </div>
                <div className="space-y-6">
                  {issue.bodyContent.filter(b => b.type === 'text').slice(0, 1).map((b, i) => (
                    <p key={i} className="text-base font-light leading-relaxed text-black/70 italic">
                      "{b.content}"
                    </p>
                  ))}
                  <div className="w-12 h-0.5 bg-primary" />
                </div>
                <div className="pt-8">
                  <span className="block font-sans text-[10px] font-bold uppercase text-black">{issue.authorContributor}</span>
                  <span className="block font-sans text-[8px] uppercase tracking-widest text-black/40">{issue.themeTag} Architecture</span>
                </div>
              </div>
            </Page>

            {/* Page 3: Inside Right - Inline Media Feature */}
            <Page number={3}>
              <div className="h-full flex flex-col">
                <div className="flex-1 flex flex-col justify-center">
                  <blockquote className="text-2xl md:text-3xl font-sans font-light leading-snug tracking-tight text-black border-l-4 border-primary pl-8">
                    "Sovereignty is the <span className="text-primary font-bold">new currency</span> of the digital age."
                  </blockquote>
                </div>
                {issue.bodyContent.find(b => b.type === 'image') && (
                  <div className="h-[45%] relative rounded-xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 mt-8 border border-black/5">
                    <Image
                      src={issue.bodyContent.find(b => b.type === 'image')?.url || ''}
                      alt="Feature"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </Page>

            {/* Page 4: Detailed Content */}
            <Page number={4}>
              <div className="space-y-6">
                <h3 className="text-2xl font-sans font-black uppercase tracking-tighter">Strategic Deep-Dive</h3>
                <div className="columns-1 md:columns-2 gap-6 text-[10px] leading-relaxed text-black/70 space-y-4">
                  {issue.bodyContent.filter(b => b.type === 'text').map((b, i) => (
                    <p key={i}>
                      {i === 0 && <span className="float-left text-4xl font-sans font-black mr-2 mt-1 text-primary">{issue.articleTitle.charAt(0)}</span>}
                      {b.content}
                    </p>
                  ))}
                </div>
              </div>
            </Page>

            {/* Page 5: Back Cover */}
            <Page number={5}>
              <div className="h-full flex flex-col items-center justify-center -m-8 md:-m-12 bg-black text-white relative">
                <div className="space-y-8 text-center">
                  <div className="w-32 h-32 relative mx-auto opacity-30">
                    <Image 
                      src="/logo2.png" 
                      alt="Logo" 
                      fill 
                      className="object-contain"
                    />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-sans font-black uppercase tracking-widest">FOURSIX46</h4>
                    <p className="text-[7px] font-sans font-semibold uppercase tracking-[0.5em] text-white/30">
                      Quiet Luxury • Brutal Efficiency
                    </p>
                  </div>
                </div>
                <div className="absolute bottom-12 w-full text-center">
                  <span className="text-[5px] font-sans uppercase tracking-[0.8em] text-white/10">© 2026 HOUSE OF MULTIBRANDS ALL RIGHTS RESERVED</span>
                </div>
              </div>
            </Page>
          </HTMLFlipBook>
        </div>
      </div>

      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] bg-radial-gradient from-primary/5 via-transparent to-transparent opacity-20" />
      </div>
    </main>
  );
}
