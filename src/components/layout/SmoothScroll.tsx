"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Lenis keeps its own virtual scroll position, separate from the browser's native
 * scrollTop. Because SmoothScroll wraps every route as a persistent layout (it never
 * unmounts between page navigations), Lenis doesn't know a client-side navigation just
 * happened and simply keeps whatever offset it had on the previous page — this is what
 * caused pages to sometimes open scrolled to the middle/bottom instead of the top.
 *
 * This resets both the Lenis-managed scroll and the native scroll on every route change.
 */
function ScrollReset() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
  }, [pathname, lenis]);

  return null;
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // 🚨 THE FIX: If we are on the admin panel, skip Lenis entirely!
  if (pathname?.startsWith("/admin")) {
    return <>{children}</>;
  }

  // Otherwise, run smooth scrolling for the rest of the website
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
      <ScrollReset />
      {children}
    </ReactLenis>
  );
}