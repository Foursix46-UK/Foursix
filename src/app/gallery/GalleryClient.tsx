"use client";

import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import Image from "next/image";
import { getFirebaseImageUrl } from "@/lib/utils";

interface GalleryItem {
  imageRef: string;
  title: string;
  description: string;
}

// 👇 Accept the data instantly from the server
export default function GalleryClient({ initialPageData }: { initialPageData: any }) {
  const data = initialPageData;
  const images: GalleryItem[] = data?.images || [];

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <header className="mb-24">
          <motion.span 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="font-sans text-[10px] font-semibold uppercase tracking-[0.5em] text-primary mb-6 block"
          >
            {data?.pageLabel || "Visual Archive"}
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="text-4xl md:text-5xl font-sans font-semibold uppercase tracking-tight leading-none text-white"
          >
            {data?.pageTitle || "The Gallery"}
          </motion.h1>
        </header>

        {/* Masonry-style Grid - Renders instantly! */}
        {images.length === 0 ? (
           <div className="w-full flex items-center justify-center py-32 border border-white/5 rounded-2xl bg-white/5">
             <span className="font-sans text-xs uppercase tracking-[0.3em] text-white/40">Archive Empty</span>
           </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {images.map((image, idx) => {
              const imageUrl = getFirebaseImageUrl(image.imageRef);
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + (idx * 0.1) }} 
                  className="relative break-inside-avoid group cursor-crosshair overflow-hidden rounded-xl border border-border bg-surface transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/5"
                >
                  {imageUrl && (
                    <div className="relative aspect-auto">
                      <Image
                        src={imageUrl}
                        alt={image.description || "Gallery Image"}
                        width={800}
                        height={1200}
                        className="w-full h-auto transition-all duration-700 ease-in-out group-hover:scale-105"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                        <div className="space-y-1">
                          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.3em] text-primary">
                            {image.title}
                          </p>
                          <h3 className="text-lg font-semibold uppercase text-white tracking-tight">
                            {image.description}
                          </h3>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}