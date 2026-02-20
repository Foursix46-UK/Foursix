
"use client";

import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import PartnerWithUs from "@/components/sections/PartnerWithUs";
import { motion } from "framer-motion";

export default function PartnershipPage() {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      
      {/* Spacer for fixed navbar */}
      <div className="pt-24">
        <PartnerWithUs />
      </div>

      <Footer />
    </main>
  );
}
