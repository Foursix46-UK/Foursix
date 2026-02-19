import Navbar from "@/components/navigation/Navbar";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/layout/Footer";

export default function ContactPage() {
  return (
    <main className="min-h-screen pt-24">
      <Navbar />
      <div className="py-12">
        <Contact />
        <div className="max-w-7xl mx-auto px-6 py-24 border-t border-border mt-12 grid grid-cols-1 md:grid-cols-2 gap-24">
          <div>
            <h2 className="text-2xl font-black uppercase mb-6">General Inquiries</h2>
            <p className="text-muted font-sans text-xs font-semibold uppercase tracking-widest">info@foursix46.com</p>
            <p className="text-muted font-sans text-xs font-semibold uppercase tracking-widest">+44 (0) 20 7946 0123</p>
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase mb-6">HQ Address</h2>
            <p className="text-muted font-sans text-xs font-semibold uppercase tracking-widest">
              Level 46, The Shard<br />
              32 London Bridge St<br />
              London SE1 9SG
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
