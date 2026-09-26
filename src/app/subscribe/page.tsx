import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import SubscribeClient from "./SubscribeClient";

export const metadata: Metadata = buildMetadata({
  title: "Subscribe | FourSix46® Intelligence",
  description:
    "Subscribe to receive official press releases, venture updates, and strategic announcements directly from the FourSix46® ecosystem.",
  path: "/subscribe",
});

export default function SubscribePage() {
  return <SubscribeClient />;
}
