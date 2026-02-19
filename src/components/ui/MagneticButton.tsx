"use client";

import React, { useRef, useState } from "react";
import { motion, useSpring, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: React.ReactNode;
  href?: string;
  className?: string;
  onClick?: () => void;
  variant?: "cyan" | "white";
}

export default function MagneticButton({
  children,
  href,
  className,
  onClick,
  variant = "cyan",
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Magnetic Physics Config
  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  // Handle Mouse Move for Magnetic Pull
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!buttonRef.current) return;

    const { clientX, clientY } = e;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    
    // Calculate distance from center
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;

    // Apply strength (0.35 means it follows the mouse by 35% of the distance)
    x.set(distanceX * 0.35);
    y.set(distanceY * 0.35);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const fillColors = {
    cyan: "bg-[#27A9E1]",
    white: "bg-white",
  };

  const ButtonContent = (
    <motion.div
      ref={buttonRef}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative group px-10 py-5 rounded-full border border-white/20 overflow-hidden cursor-pointer transition-colors duration-500",
        isHovered ? "border-transparent" : "bg-transparent",
        className
      )}
    >
      {/* Liquid Fill Layer */}
      <motion.div
        initial={{ y: "100%", borderRadius: "50%" }}
        animate={
          isHovered 
            ? { y: "0%", borderRadius: "0%" } 
            : { y: "100%", borderRadius: "50%" }
        }
        transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
        className={cn(
          "absolute inset-0 z-0",
          fillColors[variant]
        )}
      />

      {/* Text / Children */}
      <span 
        className={cn(
          "relative z-10 font-sans text-xs font-semibold uppercase tracking-[0.2em] transition-colors duration-500 block text-center",
          isHovered 
            ? (variant === "white" ? "text-black" : "text-white") 
            : "text-white"
        )}
      >
        {children}
      </span>
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block no-underline" onClick={onClick}>
        {ButtonContent}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className="inline-block bg-transparent border-none p-0 outline-none">
      {ButtonContent}
    </button>
  );
}
