"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/navigation/Navbar";
import About from "@/components/sections/About";
import Footer from "@/components/layout/Footer";

// --- FIREBASE IMPORTS ---
import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AboutPage() {
  const [aboutData, setAboutData] = useState<any>(null);

  useEffect(() => {
    async function fetchAboutData() {
      try {
        const q = query(collection(db, "page_about"), limit(1));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setAboutData(querySnapshot.docs[0].data());
        }
      } catch (error) {
        console.error("Error fetching about page data:", error);
      }
    }
    fetchAboutData();
  }, []);

  return (
    <main className="min-h-screen bg-black overflow-x-hidden w-full max-w-[100vw] relative">
      <Navbar />
      <About data={aboutData} />
      <Footer />
    </main>
  );
}