import Navbar from "@/components/navigation/Navbar";
import Ventures from "@/components/sections/Ventures";
import Footer from "@/components/layout/Footer";

export default function VenturesPage() {
  return (
    <main className="min-h-screen pt-24">
      <Navbar />
      <div className="py-12">
        <Ventures />
        <div className="max-w-7xl mx-auto px-6 py-24 border-t border-border mt-12">
          <h2 className="text-4xl font-headline font-black uppercase mb-8">Strategic Investment</h2>
          <p className="text-xl text-muted max-w-2xl leading-relaxed">
            FourSix46 actively manages a diverse portfolio of disruptive brands. Our approach combines 
            capital allocation with deep operational expertise in design, engineering, and brand narrative.
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
