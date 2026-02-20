
"use client";

import React, { useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: React.ReactNode;
  href?: string;
  className?: string;
  onClick?: () => void;
  variant?: "cyan" | "white" | "black" | "blue";
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
    black: "bg-black",
    blue: "bg-[#27A9E1]",
  };

  const ButtonContent = (
    <motion.div
      ref={buttonRef}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative group px-8 py-3 rounded-full border overflow-hidden cursor-pointer transition-colors duration-500",
        // Border logic: use white or variant color outline when filling (hovered)
        isHovered 
          ? (variant === "blue" ? "border-[#27A9E1]" : "border-white")
          : (variant === "black" ? "border-black/20" : "border-white/20"),
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
          // Text color logic based on variant and hover state
          isHovered 
            ? (variant === "white" ? "text-black" : "text-white") 
            : (variant === "black" ? "text-black" : "text-white")
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
