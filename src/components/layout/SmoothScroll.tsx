"use client";

import { ReactLenis } from "lenis/react";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // 🚨 THE FIX: If we are on the admin panel, skip Lenis entirely!
  if (pathname?.startsWith("/admin")) {
    return <>{children}</>;
  }

  // Otherwise, run smooth scrolling for the rest of the website
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}