
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const menuItems = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/vision" },
  { name: "Ventures", href: "/ventures" },
  { name: "Magazines", href: "/magazines" },
  { name: "Newsroom", href: "/newsroom" },
  { name: "Gallery", href: "/gallery" },
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
              src="/logo.png" 
              alt="FourSix46 Logo" 
              width={200} 
              height={80} 
              className="h-10 md:h-14 w-auto object-contain"
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
          <Link href="/#partner">
            <Button 
              variant="outline" 
              className="rounded-full border-white/20 bg-transparent font-sans text-[9px] font-semibold uppercase tracking-widest px-6 h-10 hover:bg-[#27A9E1] hover:border-[#27A9E1] hover:text-white transition-all duration-300"
            >
              Partner with Us
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger Icon */}
        <div className="lg:hidden flex-1 flex justify-end">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative z-[150] w-10 h-10 flex items-center justify-center bg-[#171717]/60 backdrop-blur-xl border border-white/5 rounded-full group hover:border-primary transition-all duration-300 shadow-xl"
            aria-label="Toggle Menu"
          >
            <div className="relative w-5 h-3">
              <motion.span
                animate={isOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                className="absolute top-0 left-0 w-full h-px bg-foreground block"
                transition={{ duration: 0.3 }}
              />
              <motion.span
                animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-px bg-foreground block"
                transition={{ duration: 0.2 }}
              />
              <motion.span
                animate={isOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 10 }}
                className="absolute top-0 left-0 w-full h-px bg-foreground block"
                transition={{ duration: 0.3 }}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer (Slider-style) */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-140 bg-[#0A0A0A] flex flex-col pointer-events-auto"
          >
            {/* Nav Container */}
            <div className="flex-1 flex flex-col pt-32 px-10 md:px-20 relative z-10 overflow-y-auto">
              <nav className="flex flex-col items-start space-y-4">
                {menuItems.map((item, idx) => (
                  <div key={item.href} className="overflow-hidden">
                    <motion.div
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "100%" }}
                      transition={{
                        duration: 0.6,
                        delay: idx * 0.04,
                        ease: [0.76, 0, 0.24, 1],
                      }}
                    >
                      <Link
                        href={item.href}
                        className={cn(
                          "text-xl font-sans font-semibold uppercase tracking-tight transition-all duration-300 block py-2",
                          pathname === item.href 
                            ? "text-primary" 
                            : "text-foreground hover:text-primary"
                        )}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  </div>
                ))}

                {/* Mobile CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.4 }}
                  className="pt-6"
                >
                  <Link href="/#partner" className="block">
                    <Button 
                      className="rounded-full bg-[#27A9E1] hover:bg-[#27A9E1]/90 text-white font-sans font-semibold uppercase tracking-widest px-8 h-12 text-[10px] transition-all duration-300 shadow-lg"
                    >
                      Partner with Us
                    </Button>
                  </Link>
                </motion.div>
              </nav>
            </div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ delay: 0.5 }}
              className="mt-auto pb-10 px-10 md:px-20 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10 bg-[#0A0A0A]"
            >
              <div className="text-muted-foreground font-sans text-[8px] font-semibold uppercase tracking-[0.3em] space-y-1 text-center md:text-left">
                <p>© 2026 FOURSIX46 COLLECTIVE</p>
                <p>STRUCTURAL INTEGRITY & AESTHETIC PURITY</p>
              </div>
              <div className="flex gap-8 font-sans text-[8px] font-semibold uppercase tracking-[0.3em]">
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
