
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const menuItems = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/vision" },
  { name: "Ventures", href: "/ventures" },
  { name: "Global", href: "/global" },
  { name: "Leadership", href: "/leadership" },
  { name: "Magazines", href: "/magazines" },
  { name: "Newsroom", href: "/newsroom" },
  { name: "Careers", href: "/careers" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header className="fixed top-0 left-0 w-full z-[100] pointer-events-none">
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between pointer-events-auto">
        
        {/* Left: Logo */}
        <div className="flex-1 flex justify-start items-center">
          <Link 
            href="/" 
            className={cn(
              "relative z-[110] transition-opacity duration-300 flex items-center",
              isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
            )}
          >
            <Image 
              src="/logo2.png" 
              alt="FourSix46 Logo" 
              width={400} 
              height={160} 
              className="h-16 md:h-20 w-auto object-contain"
              priority
            />
          </Link>
        </div>

        {/* Center: Desktop Navigation Dock */}
        <nav className="hidden lg:block flex-none">
          <ul className="flex items-center gap-1 p-1 bg-[#171717]/50 backdrop-blur-2xl border border-white/5 rounded-full shadow-2xl">
            <LayoutGroup id="nav-pill">
              {menuItems.map((item) => (
                <li key={item.href} className="relative">
                  <Link
                    href={item.href}
                    onMouseEnter={() => setHoveredPath(item.href)}
                    onMouseLeave={() => setHoveredPath(null)}
                    className={cn(
                      "relative z-10 px-4 py-2 font-sans text-[10px] font-semibold uppercase tracking-widest transition-colors duration-300 block",
                      pathname === item.href ? "text-white" : "text-muted hover:text-white"
                    )}
                  >
                    {item.name}
                  </Link>
                  
                  {hoveredPath === item.href && (
                    <motion.div
                      layoutId="nav-hover-pill"
                      className="absolute inset-0 bg-[#27A9E1]/20 rounded-full -z-10"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  
                  {pathname === item.href && (
                    <motion.div
                      layoutId="nav-active-dot"
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0.5 h-0.5 bg-primary rounded-full z-20"
                      transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                    />
                  )}
                </li>
              ))}
            </LayoutGroup>
          </ul>
        </nav>

        {/* Right: CTA Button */}
        <div className="hidden lg:flex flex-1 justify-end">
          <Link href="/partnership">
            <Button 
              variant="outline" 
              className="rounded-full border-white/20 bg-transparent font-sans text-[9px] font-semibold uppercase tracking-widest px-6 h-10 hover:bg-[#27A9E1] hover:border-[#27A9E1] hover:text-white transition-all duration-300"
            >
              Partner with Us
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger Trigger */}
        <div className="lg:hidden flex-1 flex justify-end">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative z-[150] w-12 h-12 flex items-center justify-center bg-[#171717]/60 backdrop-blur-xl border border-white/5 rounded-full group hover:border-primary transition-all duration-300 shadow-xl"
            aria-label="Toggle Menu"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[140] bg-[#0A0A0A] flex flex-col pointer-events-auto"
          >
            <div className="flex-1 flex flex-col justify-center px-10 md:px-20">
              <nav className="flex flex-col items-start space-y-6">
                {menuItems.map((item, idx) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + idx * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "text-3xl md:text-5xl font-sans font-light uppercase tracking-widest transition-all duration-300 block",
                        pathname === item.href 
                          ? "text-primary" 
                          : "text-white/60 hover:text-white"
                      )}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="pt-12"
                >
                  <Link href="/partnership" onClick={() => setIsOpen(false)}>
                    <Button 
                      className="rounded-full bg-[#27A9E1] hover:bg-[#27A9E1]/90 text-white font-sans font-semibold uppercase tracking-widest px-10 h-16 text-xs transition-all duration-300 shadow-lg"
                    >
                      Partner with Us
                    </Button>
                  </Link>
                </motion.div>
              </nav>
            </div>

            {/* Overlay Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="pb-12 px-10 md:px-20 flex flex-col md:flex-row justify-between items-center gap-8 bg-[#0A0A0A]"
            >
              <div className="text-white/20 font-sans text-[10px] font-semibold uppercase tracking-[0.4em] text-center md:text-left">
                <p>© 2026 FOURSIX46 COLLECTIVE</p>
                <p className="mt-1">STRUCTURAL INTEGRITY & AESTHETIC PURITY</p>
              </div>
              <div className="flex gap-10 font-sans text-[10px] font-bold uppercase tracking-widest text-white/40">
                <a href="#" className="hover:text-primary transition-colors">Instagram</a>
                <a href="#" className="hover:text-primary transition-colors">LinkedIn</a>
                <a href="#" className="hover:text-primary transition-colors">Twitter</a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
