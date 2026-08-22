// The CMS. Kept out of the index entirely — it is behind auth and has no public value.
// robots.txt disallows /admin/ as well; this is the belt-and-braces meta directive for
// crawlers that reach the URL some other way.
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | FourSix46",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
