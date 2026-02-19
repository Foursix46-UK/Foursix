
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const menuItems = [
  { name: "Home", href: "/" },
  { name: "Ventures", href: "/ventures" },
  { name: "Vision", href: "/vision" },
  { name: "Magazines", href: "/magazines" },
  { name: "Gallery", href: "/gallery" },
  { name: "Newsroom", href: "/newsroom" },
  { name: "Careers", href: "/careers" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 w-full z-50 transition-all duration-300 px-6 py-4 flex justify-between items-center",
          scrolled || isOpen ? "bg-background/80 backdrop-blur-md border-b" : "bg-transparent"
        )}
      >
        <Link href="/" className="text-xl font-headline font-black tracking-tighter text-foreground z-[60]">
          FOURSIX<span className="text-primary">46</span>
        </Link>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative z-[60] w-12 h-12 flex items-center justify-center bg-surface border border-border rounded-full hover:border-primary transition-colors"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
              >
                <X className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ opacity: 0, rotate: 90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -90 }}
              >
                <Menu className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[55] bg-background flex flex-col justify-center items-center"
          >
            <div className="grid gap-4 md:gap-8 text-center max-h-[80vh] overflow-y-auto py-20">
              {menuItems.map((item, idx) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.05 }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "text-4xl md:text-6xl font-headline font-black hover:text-primary transition-colors uppercase tracking-tight",
                      pathname === item.href ? "text-primary" : "text-foreground"
                    )}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="absolute bottom-12 left-0 w-full px-12 flex justify-between items-end"
            >
              <div className="text-muted text-sm space-y-1">
                <p>© 2024 FOURSIX46</p>
                <p>HOUSE OF MULTIBRANDS</p>
              </div>
              <div className="flex gap-6 text-sm font-bold uppercase tracking-widest">
                <a href="#" className="hover:text-secondary">Instagram</a>
                <a href="#" className="hover:text-secondary">LinkedIn</a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
