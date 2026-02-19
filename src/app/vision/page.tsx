import Navbar from "@/components/navigation/Navbar";
import Vision from "@/components/sections/Vision";
import GlobalPresence from "@/components/sections/GlobalPresence";
import Footer from "@/components/layout/Footer";

export default function VisionPage() {
  return (
    <main className="min-h-screen pt-24">
      <Navbar />
      <div className="py-12">
        <Vision />
        <div className="max-w-7xl mx-auto px-6 py-24 border-t border-border mt-12">
          <h2 className="text-4xl font-headline font-black uppercase mb-8">The Ethos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-lg text-muted leading-relaxed">
            <p>
              Founded on the principles of neo-brutalism and quiet luxury, FourSix46 was established to 
              bridge the gap between functional excellence and aesthetic purity. We believe that true 
              innovation happens at the intersection of diverse disciplines.
            </p>
            <p>
              Our leadership team brings decades of experience across technology, design, and finance, 
              united by a single vision: to cultivate ventures that define the future of human experience.
            </p>
          </div>
        </div>
        <GlobalPresence />
      </div>
      <Footer />
    </main>
  );
}
