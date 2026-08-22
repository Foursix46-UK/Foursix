// Branded 404. Reached whenever a detail page calls notFound() for an unknown slug, so
// it returns a real 404 status instead of a soft 404 — the difference decides whether
// Google drops the URL or keeps recrawling a dead page.
import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Page Not Found | FourSix46",
  description: "The page you are looking for is no longer available.",
  robots: { index: false, follow: true },
};

const suggestions = [
  { name: "Ventures", href: "/ventures" },
  { name: "Newsroom", href: "/newsroom" },
  { name: "Leadership", href: "/leadership" },
  { name: "Sitemap", href: "/sitemap" },
];

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-primary selection:text-white font-sans tracking-tight flex flex-col">
      <Navbar />

      <div className="flex-grow flex items-center justify-center pt-40 pb-32 px-6">
        <div className="max-w-xl w-full text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary mb-6 block">
            Error 404
          </span>
          <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-6">
            Page Not Found
          </h1>
          <p className="text-white/50 font-light leading-relaxed mb-10">
            This page has moved or no longer exists. Everything currently published is
            listed on the sitemap.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {suggestions.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border border-white/15 px-5 py-3 text-[10px] font-semibold uppercase tracking-widest text-white/60 hover:text-white hover:border-primary transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
