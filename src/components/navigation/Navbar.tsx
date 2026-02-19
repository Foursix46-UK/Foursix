
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const menuItems = [
  { name: "Home", href: "/" },
  { name: "Vision", href: "/vision" },
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

  // Disable scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  // Close menu on navigation
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header className="fixed top-0 left-0 w-full z-[100] pointer-events-none">
      <div className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center pointer-events-auto">
        {/* Logo - Premium Branding */}
        <Link 
          href="/" 
          className="text-2xl font-headline font-black tracking-tighter text-foreground relative z-[110]"
        >
          FOURSIX<span className="text-primary">46</span>
        </Link>

        {/* Desktop Navigation: Floating Dock */}
        <nav className="hidden lg:block absolute left-1/2 -translate-x-1/2">
          <ul className="flex items-center gap-1 p-1 bg-[#171717]/50 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl">
            <LayoutGroup id="nav-pill">
              {menuItems.map((item) => (
                <li key={item.href} className="relative">
                  <Link
                    href={item.href}
                    onMouseEnter={() => setHoveredPath(item.href)}
                    onMouseLeave={() => setHoveredPath(null)}
                    className={cn(
                      "relative z-10 px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-300 block",
                      pathname === item.href ? "text-white" : "text-muted hover:text-white"
                    )}
                  >
                    {item.name}
                  </Link>
                  
                  {/* Shared Layout Hover Pill */}
                  {hoveredPath === item.href && (
                    <motion.div
                      layoutId="nav-hover-pill"
                      className="absolute inset-0 bg-[#27A9E1]/20 rounded-full -z-10"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                    />
                  )}
                  
                  {/* Active Indicator */}
                  {pathname === item.href && (
                    <motion.div
                      layoutId="nav-active-dot"
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full z-20"
                      transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                    />
                  )}
                </li>
              ))}
            </LayoutGroup>
          </ul>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden relative z-[110] w-14 h-14 flex items-center justify-center bg-[#171717]/80 backdrop-blur-xl border border-white/10 rounded-full group hover:border-primary transition-all duration-500 shadow-xl"
          aria-label="Toggle Menu"
        >
          <div className="relative w-6 h-4">
            <motion.span
              animate={isOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              className="absolute top-0 left-0 w-full h-0.5 bg-foreground block rounded-full"
              transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
            />
            <motion.span
              animate={isOpen ? { opacity: 0, x: 10 } : { opacity: 1, x: 0 }}
              className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-0.5 bg-foreground block rounded-full"
              transition={{ duration: 0.3 }}
            />
            <motion.span
              animate={isOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 14 }}
              className="absolute top-0 left-0 w-full h-0.5 bg-foreground block rounded-full"
              transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
            />
          </div>
        </button>
      </div>

      {/* Mobile Full-Screen Overlay Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[105] bg-[#0A0A0A] flex flex-col justify-center items-center pointer-events-auto"
          >
            {/* Background Decorative Element */}
            <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30vw] font-black text-white/5 select-none leading-none">
                 MENU
               </div>
            </div>

            <div className="flex flex-col items-center gap-4 px-12 relative z-10">
              {menuItems.map((item, idx) => (
                <div key={item.href} className="overflow-hidden">
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{
                      duration: 0.8,
                      delay: idx * 0.05,
                      ease: [0.76, 0, 0.24, 1],
                    }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "text-5xl md:text-8xl font-headline font-black uppercase tracking-tighter hover:text-primary transition-all duration-500 block py-2",
                        pathname === item.href ? "text-primary" : "text-foreground"
                      )}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                </div>
              ))}
            </div>

            {/* Mobile Footer Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.6 }}
              className="absolute bottom-12 left-0 w-full px-12 flex flex-col md:flex-row justify-between items-center gap-8"
            >
              <div className="text-muted text-[10px] font-code uppercase tracking-[0.3em] space-y-2 text-center md:text-left">
                <p>© 2024 FOURSIX46 COLLECTIVE</p>
                <p>STRUCTURAL INTEGRITY & AESTHETIC PURITY</p>
              </div>
              <div className="flex gap-10 text-[10px] font-black uppercase tracking-[0.4em]">
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
