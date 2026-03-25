"use client";

import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
// FIX: Imported the actual PartnerWithUs component!
import PartnerWithUs from "@/components/sections/PartnerWithUs"; 

export default function PartnershipPage() {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      
      {/* We don't need the extra header text here because your PartnerWithUs component already has a gorgeous Hero header built-in! */}
      <PartnerWithUs />

      <Footer />
    </main>
  );
}