
"use client";

import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const galleryImages = [
  { id: "gallery-1", span: "row-span-2" },
  { id: "gallery-2", span: "row-span-1" },
  { id: "gallery-3", span: "col-span-2" },
  { id: "gallery-4", span: "row-span-2" },
  { id: "gallery-5", span: "row-span-1" },
  { id: "gallery-6", span: "row-span-2" },
];

export default function GalleryPage() {
  const images = galleryImages.map((item) => {
    const data = PlaceHolderImages.find((img) => img.id === item.id);
    return { ...item, ...data };
  });

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <header className="mb-24">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="font-sans text-[10px] font-semibold uppercase tracking-[0.5em] text-primary mb-6 block"
          >
            Visual Archive
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="text-4xl md:text-5xl font-sans font-semibold uppercase tracking-tight leading-none text-white"
          >
            The Gallery
          </motion.h1>
        </header>

        {/* Masonry-style Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {images.map((image, idx) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1.0 + (idx * 0.1) }}
              className="relative break-inside-avoid group cursor-crosshair overflow-hidden rounded-xl border border-border bg-surface transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/5"
            >
              {image.imageUrl && (
                <div className="relative aspect-auto">
                  <Image
                    src={image.imageUrl}
                    alt={image.description || "Gallery Image"}
                    width={800}
                    height={1200}
                    className="w-full h-auto transition-all duration-700 ease-in-out group-hover:scale-105"
                    data-ai-hint={image.imageHint}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                    <div className="space-y-1">
                      <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.3em] text-primary">
                        {image.id}
                      </p>
                      <h3 className="text-lg font-semibold uppercase text-white tracking-tight">
                        {image.description}
                      </h3>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
