
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

const footerLinks = {
  ecosystem: [
    { name: "Home", href: "/" },
    { name: "Vision & Ethos", href: "/vision" },
    { name: "Our Ventures", href: "/ventures" },
    { name: "Global Footprint", href: "/global" },
    { name: "Leadership", href: "/leadership" },
  ],
  intelligence: [
    { name: "Magazines", href: "/magazines" },
    { name: "Newsroom", href: "/newsroom" },
    { name: "Gallery", href: "/gallery" },
    { name: "Careers", href: "/careers" },
    { name: "Contact Us", href: "/contact" },
  ],
  foursixVerse: [
    { name: "Partner with Us", href: "/partnership", isAccent: true },
    { name: "LinkedIn", href: "#" },
    { name: "X (Twitter)", href: "#" },
    { name: "Instagram", href: "#" },
    { name: "Newsletter", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-[#171717] pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Top Section: Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-24">
          {/* Column 1: Brand */}
          <div className="space-y-6">
            <Link 
              href="/" 
              className="inline-block transition-none hover:opacity-100 active:opacity-100"
            >
              <Image 
                src="/logo2.png" 
                alt="FourSix46 Logo" 
                width={300} 
                height={100} 
                className="h-20 w-auto object-contain block"
                priority
              />
            </Link>
            <p className="text-[#A1A1AA] text-sm leading-relaxed max-w-xs font-sans">
              Building the future of logistics, tech, and global impact through structural integrity and aesthetic purity.
            </p>
          </div>

          {/* Column 2: Ecosystem */}
          <div className="space-y-6">
            <h4 className="text-white font-sans text-xs font-semibold uppercase tracking-widest">Ecosystem</h4>
            <ul className="space-y-4 font-sans">
              {footerLinks.ecosystem.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Intelligence */}
          <div className="space-y-6">
            <h4 className="text-white font-sans text-xs font-semibold uppercase tracking-widest">Intelligence</h4>
            <ul className="space-y-4 font-sans">
              {footerLinks.intelligence.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: FOURSIX VERSE */}
          <div className="space-y-6">
            <h4 className="text-white font-sans text-xs font-semibold uppercase tracking-widest">FOURSIX VERSE</h4>
            <ul className="space-y-4 font-sans">
              {footerLinks.foursixVerse.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className={cn(
                      "transition-colors text-sm",
                      link.isAccent 
                        ? "text-[#27A9E1] hover:text-[#27A9E1]/80 font-semibold" 
                        : "text-[#A1A1AA] hover:text-[#27A9E1]"
                    )}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section: Sub-footer */}
        <div className="border-t border-[#171717] pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[#A1A1AA] font-sans text-[10px] font-semibold uppercase tracking-widest">
            © 2026 FourSix46. All rights reserved.
          </div>
          
          <div className="flex gap-8 font-sans">
            <Link 
              href="#" 
              className="text-[#A1A1AA] hover:text-[#FAFAFA] text-sm transition-colors"
            >
              Privacy Policy
            </Link>
            <Link 
              href="#" 
              className="text-[#A1A1AA] hover:text-[#FAFAFA] text-sm transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
