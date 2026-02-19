import Navbar from "@/components/navigation/Navbar";
import GlobalPresence from "@/components/sections/GlobalPresence";
import Footer from "@/components/layout/Footer";

export default function GlobalPage() {
  return (
    <main className="min-h-screen pt-24">
      <Navbar />
      <div className="py-12">
        <GlobalPresence />
        <div className="max-w-7xl mx-auto px-6 py-24 border-t border-border mt-12">
          <h2 className="text-4xl font-headline font-black uppercase mb-8">Strategic Nodes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-2">
              <h3 className="text-lg font-black uppercase">London</h3>
              <p className="text-muted text-sm">European Operations & Design HQ</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-black uppercase">New York</h3>
              <p className="text-muted text-sm">Venture Capital & Media Hub</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-black uppercase">Dubai</h3>
              <p className="text-muted text-sm">Orbital Mobility R&D</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-black uppercase">Tokyo</h3>
              <p className="text-muted text-sm">Biophilic Systems Research</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
