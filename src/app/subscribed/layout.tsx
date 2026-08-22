// Confirmation page — reached only after a form submission, so it carries no search
// value and must never enter the index (it would compete with real pages and read as
// thin content to a crawler).
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Subscription Confirmed | FourSix46",
  description: "Your subscription to the FourSix46 intelligence network is confirmed.",
  path: "/subscribed",
  noindex: true,
});

export default function SubscribedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
