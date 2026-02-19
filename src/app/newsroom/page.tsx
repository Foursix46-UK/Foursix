import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowUpRight } from "lucide-react";

const news = [
  {
    date: "MAR 12, 2024",
    title: "FourSix46 Announces Strategic Investment in Orbital Propulsion Systems",
    category: "Corporate",
    excerpt: "Vyoma receives significant Series B funding to accelerate development of next-gen satellite propulsion."
  },
  {
    date: "FEB 28, 2024",
    title: "Rastlina Wins Global Architecture Award for Biophilic Tower Concept",
    category: "Ventures",
    excerpt: "The 'Green Lung' project recognized for its revolutionary integration of nature and high-density urban living."
  },
  {
    date: "JAN 15, 2024",
    title: "Nexus Core Deploys Decentralized Compute Hub in Scandinavia",
    category: "Technology",
    excerpt: "New zero-emission data center provides sovereign compute resources for European enterprises."
  },
  {
    date: "DEC 05, 2023",
    title: "The Journal Volume 02: Bio-Syn Released Worldwide",
    category: "Editorial",
    excerpt: "Our latest issue explores the synthesis of biological intelligence and artificial systems."
  }
];

export default function NewsroomPage() {
  return (
    <main className="min-h-screen pt-24 bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-24">
        <header className="mb-24">
          <h1 className="text-sm font-code uppercase tracking-[0.4em] text-primary mb-6">Newsroom</h1>
          <h2 className="text-7xl md:text-9xl font-headline font-black uppercase tracking-tighter">
            PRESS RELEASES
          </h2>
        </header>

        <div className="space-y-12">
          {news.map((item, idx) => (
            <article 
              key={idx}
              className="group relative py-12 border-b border-border hover:bg-surface/50 transition-colors px-6 -mx-6 rounded-xl cursor-pointer"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-8">
                <div className="md:w-48">
                  <span className="text-xs font-code text-muted uppercase tracking-widest">{item.date}</span>
                  <div className="mt-2">
                    <span className="px-2 py-1 bg-surface border border-border text-[10px] font-black uppercase tracking-widest text-secondary">
                      {item.category}
                    </span>
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-3xl md:text-4xl font-headline font-black uppercase group-hover:text-primary transition-colors mb-4">
                    {item.title}
                  </h3>
                  <p className="text-muted text-lg max-w-3xl leading-relaxed">
                    {item.excerpt}
                  </p>
                </div>

                <div className="hidden md:block">
                  <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
                    <ArrowUpRight className="w-6 h-6 group-hover:text-white" />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
