import Navbar from "@/components/navigation/Navbar";
import Magazines from "@/components/sections/Magazines";
import Footer from "@/components/layout/Footer";

export default function MagazinesPage() {
  return (
    <main className="min-h-screen pt-24">
      <Navbar />
      <div className="py-12">
        <Magazines />
        <div className="max-w-7xl mx-auto px-6 py-24 border-t border-border mt-12">
          <h2 className="text-4xl font-headline font-black uppercase mb-8">The Editorial Vision</h2>
          <p className="text-xl text-muted max-w-2xl leading-relaxed mb-12">
            The Journal is our quarterly deep-dive into the philosophies that drive our ventures. 
            From architectural biophilia to the future of orbital mobility, we explore the 
            narratives shaping our world.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-surface border border-border rounded-xl">
              <span className="text-primary font-sans text-xs font-semibold uppercase tracking-widest block mb-4">Volume 01</span>
              <h3 className="text-2xl font-black uppercase mb-4">The Grid</h3>
              <p className="text-sm text-muted">A study in modular urbanism and the digital structure of modern cities.</p>
            </div>
            <div className="p-8 bg-surface border border-border rounded-xl">
              <span className="text-secondary font-sans text-xs font-semibold uppercase tracking-widest block mb-4">Volume 02</span>
              <h3 className="text-2xl font-black uppercase mb-4">Bio-Syn</h3>
              <p className="text-sm text-muted">Exploring the synthesis of biological systems and synthetic technology.</p>
            </div>
            <div className="p-8 bg-surface border border-border rounded-xl opacity-50">
              <span className="text-accent font-sans text-xs font-semibold uppercase tracking-widest block mb-4">Coming Soon</span>
              <h3 className="text-2xl font-black uppercase mb-4">Volume 03</h3>
              <p className="text-sm text-muted">Kinetic Motion: The velocity of change in the post-industrial era.</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
