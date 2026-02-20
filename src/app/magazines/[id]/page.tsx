
'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Maximize2, Minimize2 } from 'lucide-react';
import HTMLFlipBook from 'react-pageflip';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
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
      <div className="h-full flex flex-col p-10 md:p-16">
        {props.children}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-sans text-[8px] font-bold uppercase tracking-widest text-black/30">
          Page {props.number}
        </div>
      </div>
    </div>
  );
});

Page.displayName = 'MagazinePage';

export default function MagazineViewer() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const bookRef = useRef<any>(null);
  const [mounted, setMounted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const magImg = PlaceHolderImages.find(img => img.id === 'mag-1');
  const featureImg = PlaceHolderImages.find(img => img.id === 'gallery-3');

  return (
    <main className="min-h-screen bg-[#0A0A0A] selection:bg-primary selection:text-white flex flex-col items-center justify-center p-6 md:p-12">
      
      {/* Absolute Header Navigation */}
      <div className="fixed top-0 left-0 w-full p-6 md:p-12 z-50 flex justify-between items-center pointer-events-none">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 font-sans text-[10px] font-semibold uppercase tracking-widest text-white/50 hover:text-white transition-colors pointer-events-auto"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Collective
        </motion.button>

        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-3 bg-white/5 backdrop-blur-md rounded-full border border-white/10 text-white/50 hover:text-white transition-all pointer-events-auto"
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </motion.button>
      </div>

      {/* The Flipbook Stage */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-7xl flex items-center justify-center pt-16"
      >
        {/* @ts-ignore */}
        <HTMLFlipBook
          width={440}
          height={586}
          size="stretch"
          minWidth={315}
          maxWidth={1000}
          minHeight={400}
          maxHeight={1533}
          maxShadowOpacity={0.5}
          showCover={true}
          mobileScrollSupport={true}
          ref={bookRef}
          className="shadow-[0_50px_100px_rgba(0,0,0,0.5)]"
        >
          {/* Page 1: Cover */}
          <Page number={1}>
            <div className="h-full flex flex-col justify-between -m-10 md:-m-16 relative">
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
              <div className="relative z-10 p-10 md:p-16 flex flex-col justify-end h-full">
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
            <div className="space-y-12">
              <div className="space-y-2">
                <span className="text-primary font-sans text-[10px] font-bold uppercase tracking-widest">Editorial</span>
                <h2 className="text-4xl font-sans font-black uppercase tracking-tight">The Structural<br/>Honesty</h2>
              </div>
              <div className="space-y-6">
                <p className="text-lg font-light leading-relaxed text-black/70 italic">
                  "In the era of synthetic complexity, we find truth in the grid. The modular city is not just a plan—it is a philosophy of existence."
                </p>
                <div className="w-12 h-0.5 bg-primary" />
                <p className="text-sm leading-relaxed text-black/60">
                  Welcome to the first edition of the FourSix46 Journal. Here, we examine the intersections of high-density urbanism and the biological imperative. We believe that the future of logistics is not just about movement, but about the integrity of the paths we create.
                </p>
              </div>
              <div className="pt-12">
                <span className="block font-sans text-[10px] font-bold uppercase text-black">Julian Thorne</span>
                <span className="block font-sans text-[8px] uppercase tracking-widest text-black/40">Chief Executive Officer</span>
              </div>
            </div>
          </Page>

          {/* Page 3: Inside Right - Pull Quote & Photo Essay */}
          <Page number={3}>
            <div className="h-full flex flex-col">
              <div className="flex-1 flex flex-col justify-center">
                <blockquote className="text-3xl md:text-4xl font-sans font-light leading-snug tracking-tight text-black border-l-4 border-primary pl-8">
                  "Sovereignty is the <span className="text-primary font-bold">new currency</span> of the digital age. Infrastructure must be the vault."
                </blockquote>
              </div>
              <div className="h-[40%] relative rounded-xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 mt-12">
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
            <div className="space-y-8">
              <h3 className="text-3xl font-sans font-black uppercase tracking-tighter">The Future of<br/>Kinetic Logistics</h3>
              <div className="columns-1 md:columns-2 gap-8 text-[11px] leading-relaxed text-black/70 space-y-4">
                <p>
                  <span className="float-left text-5xl font-sans font-black mr-3 mt-1 text-primary">T</span>he shift towards orbital-scale logistics requires more than just velocity; it demands a radical rethink of structural integrity. As we scale our cross-border nodes, we are observing a unique synthesis of AI-driven routing and biophilic design.
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
            <div className="h-full flex flex-col items-center justify-center -m-10 md:-m-16 bg-black text-white relative">
              <div className="space-y-8 text-center">
                <div className="w-32 h-32 relative mx-auto opacity-50">
                  <Image 
                    src="/logo.png" 
                    alt="Logo" 
                    fill 
                    className="object-contain"
                  />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-sans font-black uppercase tracking-widest">FOURSIX46</h4>
                  <p className="text-[8px] font-sans font-semibold uppercase tracking-[0.5em] text-white/30">
                    Quiet Luxury • Brutal Efficiency
                  </p>
                </div>
              </div>
              <div className="absolute bottom-16 w-full text-center">
                <span className="text-[6px] font-sans uppercase tracking-[0.8em] text-white/10">© 2026 HOUSE OF MULTIBRANDS ALL RIGHTS RESERVED</span>
              </div>
            </div>
          </Page>
        </HTMLFlipBook>
      </motion.div>

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] bg-radial-gradient from-primary/5 via-transparent to-transparent opacity-30" />
      </div>
    </main>
  );
}
