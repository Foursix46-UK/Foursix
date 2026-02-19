import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

const footerLinks = {
  quickLinks: [
    { name: "Home", href: "/" },
    { name: "Vision", href: "/vision" },
    { name: "Ventures", href: "/ventures" },
    { name: "Magazines", href: "/magazines" },
  ],
  company: [
    { name: "Newsroom", href: "/newsroom" },
    { name: "Gallery", href: "/gallery" },
    { name: "Careers", href: "/careers" },
  ],
  connect: [
    { name: "Partner with Us", href: "/contact", isAccent: true },
    { name: "LinkedIn", href: "#" },
    { name: "Twitter", href: "#" },
    { name: "Instagram", href: "#" },
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
            <Link href="/" className="inline-block">
              <Image 
                src="/logo.png" 
                alt="FourSix46 Logo" 
                width={180} 
                height={60} 
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-[#A1A1AA] text-sm leading-relaxed max-w-xs">
              Building the future of logistics, tech, and global impact through structural integrity and aesthetic purity.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-6">
            <h4 className="text-white text-xs font-bold uppercase tracking-[0.2em]">Quick Links</h4>
            <ul className="space-y-4">
              {footerLinks.quickLinks.map((link) => (
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

          {/* Column 3: Company */}
          <div className="space-y-6">
            <h4 className="text-white text-xs font-bold uppercase tracking-[0.2em]">Company</h4>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
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

          {/* Column 4: Connect */}
          <div className="space-y-6">
            <h4 className="text-white text-xs font-bold uppercase tracking-[0.2em]">Connect</h4>
            <ul className="space-y-4">
              {footerLinks.connect.map((link) => (
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
          <div className="text-[#A1A1AA] text-sm font-code">
            © 2026 FourSix46. All rights reserved.
          </div>
          
          <div className="flex gap-8">
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
