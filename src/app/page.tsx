import Navbar from "@/components/navigation/Navbar";
import Hero from "@/components/sections/Hero";
import Ventures from "@/components/sections/Ventures";
import Vision from "@/components/sections/Vision";
import Magazines from "@/components/sections/Magazines";
import GlobalPresence from "@/components/sections/GlobalPresence";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      
      <section className="relative">
        <Ventures />
        <div className="max-w-7xl mx-auto px-6 pb-24 flex justify-end">
          <Link href="/ventures" className="group flex items-center gap-2 text-sm font-code uppercase tracking-widest text-primary hover:text-white transition-colors">
            Explore All Ventures <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <section className="relative bg-background">
        <Vision />
        <div className="max-w-7xl mx-auto px-6 pb-24 flex justify-start lg:justify-end">
          <Link href="/vision" className="group flex items-center gap-2 text-sm font-code uppercase tracking-widest text-primary hover:text-white transition-colors">
            Our Full Story <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <section className="relative">
        <Magazines />
        <div className="max-w-7xl mx-auto px-6 pb-24 flex justify-center">
          <Link href="/magazines" className="group flex items-center gap-2 text-sm font-code uppercase tracking-widest text-primary hover:text-white transition-colors">
            Browse All Issues <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <section className="relative">
        <GlobalPresence />
        <div className="max-w-7xl mx-auto px-6 pb-24 flex justify-start">
          <Link href="/vision#global" className="group flex items-center gap-2 text-sm font-code uppercase tracking-widest text-primary hover:text-white transition-colors">
            Explore Global Hubs <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <Contact />
      <Footer />
    </main>
  );
}
