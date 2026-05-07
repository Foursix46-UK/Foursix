"use client";

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ArrowLeft } from 'lucide-react';
import HTMLFlipBook from 'react-pageflip';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/navigation/Navbar';
import { Button } from '@/components/ui/button';
import { getFirebaseImageUrl } from '@/lib/utils';

// --- Types & Components ---
interface PageProps {
  children: React.ReactNode;
  number: number;
  isMobile?: boolean; 
}

const Page = React.forwardRef<HTMLDivElement, PageProps>((props, ref) => {
  return (
    <div className="page relative h-full w-full bg-[#F5F5F7] text-black shadow-2xl overflow-hidden" ref={ref}>
      <div className={`h-full flex flex-col ${props.isMobile ? 'p-6' : 'p-10'} overflow-hidden`}>
        {props.children}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-sans text-[8px] font-bold uppercase tracking-widest text-black/20">
          Page {props.number}
        </div>
      </div>
    </div>
  );
});

Page.displayName = 'MagazinePage';

const BASE_PAGE_WIDTH = 440;
const BASE_PAGE_HEIGHT = 586;
const BASE_BOOK_WIDTH = BASE_PAGE_WIDTH * 2;

// 👇 Accept initialIssue from the Server
export default function MagazineViewerClient({ initialIssue }: { initialIssue: any }) {
  
  const bookRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [mounted, setMounted] = useState(false);
  const [scale, setScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  // Instantly use the data passed from the server
  const issue = initialIssue;

  const handleResize = useCallback(() => {
    if (!containerRef.current) return;
    
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isPortrait = height > width;

    setIsMobile(width < 768);

    const padding = 40;
    const availableWidth = width - padding;
    const availableHeight = containerRef.current.offsetHeight - padding;
    
    const requiredWidth = isPortrait ? BASE_PAGE_WIDTH : BASE_BOOK_WIDTH;
    const scaleX = availableWidth / requiredWidth;
    const scaleY = availableHeight / BASE_PAGE_HEIGHT;
    
    const newScale = Math.min(scaleX, scaleY, 1); 
    setScale(newScale);
  }, []);

  useEffect(() => {
    setMounted(true);
    window.addEventListener('resize', handleResize);
    setTimeout(handleResize, 100);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize, issue]);

  if (!mounted) return null;

  if (!issue) {
    return (
      <main className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-white">
        <h1 className="text-4xl font-black uppercase mb-4">Issue Not Found</h1>
        <Link href="/magazines">
          <Button variant="outline" className="rounded-none font-sans text-xs font-semibold uppercase tracking-widest px-8">
            Back to Magazines
          </Button>
        </Link>
      </main>
    );
  }

  const coverUrl = getFirebaseImageUrl(issue.coverImage);
  const featureImageUrl = getFirebaseImageUrl(issue.page3Image);

  const paragraphs = issue.page4Paragraphs || [];
  const midIndex = Math.ceil(paragraphs.length / 2);
  const page4Text = isMobile ? paragraphs.slice(0, midIndex) : paragraphs;
  const page5Text = isMobile ? paragraphs.slice(midIndex) : [];

  return (
    <main className="h-[100dvh] w-full bg-[#0A0A0A] flex flex-col overflow-hidden selection:bg-primary selection:text-white">
      <Navbar />

      <div className="shrink-0 px-8 pt-32 flex justify-between items-center z-40">
        <Link 
          href="/magazines"
          className="inline-flex items-center gap-2 font-sans text-[10px] font-semibold uppercase tracking-widest text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3 h-3" /> Back to Magazines
        </Link>
      </div>

      <div ref={containerRef} className="flex-1 w-full flex items-center justify-center p-6 overflow-hidden relative">
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
          {isMobile ? (
            /* @ts-ignore */
            <HTMLFlipBook
              key="mobile-book"
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
              usePortrait={true}
              swipeDistance={30}
              ref={bookRef}
              className="flipbook-root"
            >
              {/* Page 1 */}
              <Page number={1} isMobile={true}>
                <div className="h-full flex flex-col justify-between -m-6 relative overflow-hidden">
                  <div className="absolute inset-0 z-0">
                  {coverUrl && <Image src={coverUrl} alt="Cover" fill className="object-cover" priority unoptimized />}                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                  <div className="relative z-10 flex flex-col justify-end h-full p-6">
                    <span className="text-white font-sans font-bold uppercase tracking-[0.5em] text-[8px] mb-2">{issue.issueVolume}</span>
                    <h1 className="font-sans font-black uppercase text-white tracking-tighter leading-[0.9] break-words overflow-hidden text-4xl mb-2">{issue.articleTitle}</h1>
                    <p className="text-white/60 font-sans font-semibold uppercase tracking-widest truncate text-[8px]">
                      {issue.magazineSeriesName} • {issue.themeTag}
                      {issue.associatedVentureName && ` • ${issue.associatedVentureName}`}
                    </p>
                  </div>
                </div>
              </Page>

              {/* Page 2 */}
              <Page number={2} isMobile={true}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <span className="text-primary font-sans font-bold uppercase tracking-widest text-[8px]">{issue.articleType} · {issue.readingTime} · {issue.displayDate}</span>
                    <h2 className="font-sans font-black uppercase tracking-tight leading-tight break-words text-2xl">{issue.articleTitle}</h2>
                  </div>
                  <div className="space-y-4">
                    {issue.page2IntroText && <p className="font-light leading-relaxed text-black/70 italic text-justify text-xs">"{issue.page2IntroText}"</p>}
                    <div className="w-12 h-0.5 bg-primary" />
                  </div>
                  <div className="pt-2">
                    <span className="block font-sans font-bold uppercase text-black text-[8px]">{issue.authorContributor}</span>
                    <span className="block font-sans uppercase tracking-widest text-black/40 text-[6px]">{issue.themeTag} Editorial</span>
                  </div>
                </div>
              </Page>

              {/* Page 3 */}
              <Page number={3} isMobile={true}>
                <div className="h-full flex flex-col">
                  <div className="flex-1 flex flex-col justify-center">
                    {issue.page3PullQuote && (
                      <blockquote className="font-sans font-light leading-snug tracking-tight text-black border-l-4 border-primary text-xl pl-4">{issue.page3PullQuote}</blockquote>
                    )}
                  </div>
                  {featureImageUrl && (
                    <div className="relative rounded-xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 border border-black/5 h-[55%] mt-4">
                    <Image src={featureImageUrl} alt="Feature" fill className="object-cover" unoptimized />                    </div>
                  )}
                </div>
              </Page>

              {/* Page 4 */}
              <Page number={4} isMobile={true}>
                <div className="h-full flex flex-col space-y-4">
                  <h3 className="font-sans font-black uppercase tracking-tighter text-black/80 shrink-0 text-lg">Strategic Deep-Dive</h3>
                  <div className="text-[10px] leading-relaxed text-black/70 flex-1 overflow-hidden text-justify columns-1 space-y-3 gap-4">
                    {page4Text.map((paragraph: string, i: number) => (
                      <p key={i}>
                        {i === 0 && <span className="float-left font-sans font-black text-primary text-3xl mr-1.5 mt-0.5">{issue.articleTitle.charAt(0)}</span>}
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </Page>

              {/* Page 5 */}
              <Page number={5} isMobile={true}>
                <div className="space-y-4 h-full flex flex-col pt-2">
                  <div className="columns-1 gap-4 text-[10px] leading-relaxed text-black/70 space-y-3 flex-1 overflow-hidden text-justify">
                    {page5Text.map((paragraph: string, i: number) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </Page>

              {/* Page 6 */}
              <Page number={6} isMobile={true}>
                <div className="h-full flex flex-col items-center justify-center bg-black text-white relative -m-6">
                  <div className="space-y-8 text-center px-8">
                    <div className="w-32 h-32 relative mx-auto opacity-30 grayscale invert">
                      <Image src="/logo.png" alt="Logo" fill className="object-contain" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-lg font-sans font-black uppercase tracking-widest">FOURSIX46</h4>
                      <p className="text-[7px] font-sans font-semibold uppercase tracking-[0.5em] text-white/30">Quiet Luxury • Brutal Efficiency</p>
                    </div>
                  </div>
                  <div className="absolute bottom-12 w-full text-center">
                    <span className="text-[5px] font-sans uppercase tracking-[0.8em] text-white/10">© 2026 FOURSIX46 GLOBAL LTD. ALL RIGHTS RESERVED</span>
                  </div>
                </div>
              </Page>
            </HTMLFlipBook>
          ) : (
            /* @ts-ignore */
            <HTMLFlipBook
              key="desktop-book"
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
              usePortrait={true}
              swipeDistance={30}
              ref={bookRef}
              className="flipbook-root"
            >
              {/* Page 1 */}
              <Page number={1} isMobile={false}>
                <div className="h-full flex flex-col justify-between -m-10 relative overflow-hidden">
                  <div className="absolute inset-0 z-0">
{coverUrl && <Image src={coverUrl} alt="Cover" fill className="object-cover" priority unoptimized />}                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                  <div className="relative z-10 flex flex-col justify-end h-full p-10">
                    <span className="text-white font-sans font-bold uppercase tracking-[0.5em] text-[10px] mb-4">{issue.issueVolume}</span>
                    <h1 className="font-sans font-black uppercase text-white tracking-tighter leading-[0.9] break-words overflow-hidden text-5xl mb-4">{issue.articleTitle}</h1>
                    <p className="text-white/60 font-sans font-semibold uppercase tracking-widest truncate text-[10px]">
                      {issue.magazineSeriesName} • {issue.themeTag}
                      {issue.associatedVentureName && ` • ${issue.associatedVentureName}`}
                    </p>
                  </div>
                </div>
              </Page>

              {/* Page 2 */}
              <Page number={2} isMobile={false}>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <span className="text-primary font-sans font-bold uppercase tracking-widest text-[10px]">{issue.articleType} · {issue.readingTime} · {issue.displayDate}</span>
                    <h2 className="font-sans font-black uppercase tracking-tight leading-tight break-words text-3xl">{issue.articleTitle}</h2>
                  </div>
                  <div className="space-y-6">
                    {issue.page2IntroText && <p className="font-light leading-relaxed text-black/70 italic text-justify text-sm">"{issue.page2IntroText}"</p>}
                    <div className="w-12 h-0.5 bg-primary" />
                  </div>
                  <div className="pt-4">
                    <span className="block font-sans font-bold uppercase text-black text-[10px]">{issue.authorContributor}</span>
                    <span className="block font-sans uppercase tracking-widest text-black/40 text-[8px]">{issue.themeTag} Editorial</span>
                  </div>
                </div>
              </Page>

              {/* Page 3 */}
              <Page number={3} isMobile={false}>
                <div className="h-full flex flex-col">
                  <div className="flex-1 flex flex-col justify-center">
                    {issue.page3PullQuote && (
                      <blockquote className="font-sans font-light leading-snug tracking-tight text-black border-l-4 border-primary text-2xl pl-6">{issue.page3PullQuote}</blockquote>
                    )}
                  </div>
                  {featureImageUrl && (
                    <div className="relative rounded-xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 border border-black/5 h-[45%] mt-8">
                    <Image src={featureImageUrl} alt="Feature" fill className="object-cover" unoptimized />                    </div>
                  )}
                </div>
              </Page>

              {/* Page 4 */}
              <Page number={4} isMobile={false}>
                <div className="h-full flex flex-col space-y-6">
                  <h3 className="font-sans font-black uppercase tracking-tighter text-black/80 shrink-0 text-xl">Strategic Deep-Dive</h3>
                  <div className="text-[10px] leading-relaxed text-black/70 flex-1 overflow-hidden text-justify columns-2 space-y-4 gap-6">
                    {page4Text.map((paragraph: string, i: number) => (
                      <p key={i}>
                        {i === 0 && <span className="float-left font-sans font-black text-primary text-4xl mr-2 mt-1">{issue.articleTitle.charAt(0)}</span>}
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </Page>

              {/* Page 5 */}
              <Page number={5} isMobile={false}>
                <div className="h-full flex flex-col items-center justify-center bg-black text-white relative -m-10">
                  <div className="space-y-8 text-center px-8">
                    <div className="w-32 h-32 relative mx-auto opacity-30 grayscale invert">
                      <Image src="/logo.png" alt="Logo" fill className="object-contain" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-lg font-sans font-black uppercase tracking-widest">FOURSIX46</h4>
                      <p className="text-[7px] font-sans font-semibold uppercase tracking-[0.5em] text-white/30">Quiet Luxury • Brutal Efficiency</p>
                    </div>
                  </div>
                  <div className="absolute bottom-12 w-full text-center">
                    <span className="text-[5px] font-sans uppercase tracking-[0.8em] text-white/10">© 2026 FOURSIX46 GLOBAL LTD. ALL RIGHTS RESERVED</span>
                  </div>
                </div>
              </Page>
            </HTMLFlipBook>
          )}
        </div>
      </div>

      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] bg-radial-gradient from-primary/5 via-transparent to-transparent opacity-20" />
      </div>
    </main>
  );
}