
'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Maximize2, Minimize2 } from 'lucide-react';
import HTMLFlipBook from 'react-pageflip';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Navbar from '@/components/navigation/Navbar';

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
  const router = useRouter();
  const id = params.id as string;
  const bookRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [mounted, setMounted] = useState(false);
  const [scale, setScale] = useState(1);

  // --- Dynamic Scaling Logic ---
  useEffect(() => {
    setMounted(true);
    
    const handleResize = () => {
      if (!containerRef.current) return;
      
      const padding = 60; // Safe margin for UI elements
      const availableWidth = window.innerWidth - padding;
      const availableHeight = containerRef.current.offsetHeight - padding;
      
      const scaleX = availableWidth / BASE_BOOK_WIDTH;
      const scaleY = availableHeight / BASE_PAGE_HEIGHT;
      
      // Use the smaller scale factor to ensure it fits both directions
      // Mobile handling: if screen is narrow, we'll likely show 1 page, 
      // but react-pageflip manages its own single-page mode. 
      // Here we scale the 2-page base proportionally.
      const newScale = Math.min(scaleX, scaleY, 1); 
      setScale(newScale);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!mounted) return null;

  const magImg = PlaceHolderImages.find(img => img.id === 'mag-1');
  const featureImg = PlaceHolderImages.find(img => img.id === 'gallery-3');

  return (
    <main className="h-screen w-full bg-[#0A0A0A] flex flex-col overflow-hidden selection:bg-primary selection:text-white">
      {/* Global Navbar */}
      <div className="shrink-0 z-50">
        <Navbar />
      </div>

      {/* Sub-Header Navigation */}
      <div className="shrink-0 px-8 pt-24 md:pt-28 flex justify-between items-center z-40">
        <Link 
          href="/#magazines"
          className="inline-flex items-center gap-2 font-sans text-[10px] font-semibold uppercase tracking-widest text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3 h-3" /> Back to Magazines
        </Link>
      </div>

      {/* The Immersive Stage */}
      <div 
        ref={containerRef}
        className="flex-1 w-full flex items-center justify-center p-6 overflow-hidden relative"
      >
        {/* Scaling Wrapper: Proportional scale of everything inside */}
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
                  <span className="text-white font-sans text-[10px] font-bold uppercase tracking-[0.5em] mb-4">Volume 01</span>
                  <h1 className="text-6xl md:text-8xl font-sans font-black uppercase text-white tracking-tighter leading-none mb-4">
                    THE<br/>GRID
                  </h1>
                  <p className="text-white/60 font-sans text-[10px] font-semibold uppercase tracking-widest">
                    Infrastructure • Design • Sovereignty
                  </p>
                </div>
              </div>
            </Page>

            {/* Page 2: Inside Left - Director's Note */}
            <Page number={2}>
              <div className="space-y-10">
                <div className="space-y-2">
                  <span className="text-primary font-sans text-[10px] font-bold uppercase tracking-widest">Editorial</span>
                  <h2 className="text-3xl font-sans font-black uppercase tracking-tight">The Structural<br/>Honesty</h2>
                </div>
                <div className="space-y-6">
                  <p className="text-base font-light leading-relaxed text-black/70 italic">
                    "In the era of synthetic complexity, we find truth in the grid. The modular city is not just a plan—it is a philosophy of existence."
                  </p>
                  <div className="w-12 h-0.5 bg-primary" />
                  <p className="text-[11px] leading-relaxed text-black/60">
                    Welcome to the first edition of the FourSix46 Journal. Here, we examine the intersections of high-density urbanism and the biological imperative. We believe that the future of logistics is not just about movement, but about the integrity of the paths we create.
                  </p>
                </div>
                <div className="pt-8">
                  <span className="block font-sans text-[10px] font-bold uppercase text-black">Julian Thorne</span>
                  <span className="block font-sans text-[8px] uppercase tracking-widest text-black/40">Chief Executive Officer</span>
                </div>
              </div>
            </Page>

            {/* Page 3: Inside Right - Pull Quote & Photo Essay */}
            <Page number={3}>
              <div className="h-full flex flex-col">
                <div className="flex-1 flex flex-col justify-center">
                  <blockquote className="text-2xl md:text-3xl font-sans font-light leading-snug tracking-tight text-black border-l-4 border-primary pl-8">
                    "Sovereignty is the <span className="text-primary font-bold">new currency</span> of the digital age. Infrastructure must be the vault."
                  </blockquote>
                </div>
                <div className="h-[45%] relative rounded-xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 mt-8">
                  {featureImg && (
                    <Image
                      src={featureImg.imageUrl}
                      alt="Feature"
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
              </div>
            </Page>

            {/* Page 4: Feature Article */}
            <Page number={4}>
              <div className="space-y-6">
                <h3 className="text-2xl font-sans font-black uppercase tracking-tighter">The Future of<br/>Kinetic Logistics</h3>
                <div className="columns-1 md:columns-2 gap-6 text-[10px] leading-relaxed text-black/70 space-y-4">
                  <p>
                    <span className="float-left text-4xl font-sans font-black mr-2 mt-1 text-primary">T</span>he shift towards orbital-scale logistics requires more than just velocity; it demands a radical rethink of structural integrity. As we scale our cross-border nodes, we are observing a unique synthesis of AI-driven routing and biophilic design.
                  </p>
                  <p>
                    By distributing our compute nodes across sovereign data hubs, we eliminate the vulnerabilities of centralized networks. This is the "House of Multibrands" philosophy in action—leveraging the synergy between our ventures to create a vault that is as aesthetically pure as it is functionally superior.
                  </p>
                  <p>
                    Current field tests in low earth orbit have shown a 400% increase in propulsion efficiency when managed by our decentralized AI arrays. This is the velocity of the future.
                  </p>
                </div>
              </div>
            </Page>

            {/* Page 5: Back Cover */}
            <Page number={5}>
              <div className="h-full flex flex-col items-center justify-center -m-8 md:-m-12 bg-black text-white relative">
                <div className="space-y-8 text-center">
                  <div className="w-24 h-24 relative mx-auto opacity-30">
                    <Image 
                      src="/logo.png" 
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

      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] bg-radial-gradient from-primary/5 via-transparent to-transparent opacity-20" />
      </div>
    </main>
  );
}

