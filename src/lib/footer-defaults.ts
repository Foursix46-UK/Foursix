// Footer copy shared by the CMS schema, the /api/footer route and the Footer component,
// so the three can never disagree. Editors change these in the CMS under
// "Global Footer Settings"; an empty CMS field falls back to the value here.
import { CRUNCHBASE_URL } from "@/lib/seo";

export const FOOTER_DEFAULTS = {
  tagline:
    "The brand behind the brands: technology, systems, structure and scale, with logistics as an operational vertical.",
  /** {year} is replaced with the current year, so the line never goes stale. */
  copyrightLine: "© {year} FourSix46® Global Ltd",
  legalLine:
    "FourSix46® Global Ltd · Company No. 16712658 · Registered in England & Wales · 66 Paul Street, London EC2A 4NA",
  socialLinks: [
    { platform: "LinkedIn", url: "https://www.linkedin.com/company/foursix46" },
    { platform: "X (Twitter)", url: "https://x.com/FourSix46HQ" },
    { platform: "Instagram", url: "https://www.instagram.com/foursix46hq/" },
    { platform: "TikTok", url: "https://www.tiktok.com/@foursix46hq" },
    { platform: "Facebook", url: "https://www.facebook.com/FourSix46hq" },
    { platform: "YouTube", url: "https://www.youtube.com/@Foursix46hq" },
    { platform: "Crunchbase", url: CRUNCHBASE_URL },
  ],
};

export type FooterSocialLink = { platform: string; url: string };

/** CMS links, with the Crunchbase profile appended if the saved list predates it. */
export function withCrunchbase(links: FooterSocialLink[]): FooterSocialLink[] {
  const clean = links.filter((link) => link?.platform && link?.url);
  if (clean.some((link) => /crunchbase\.com/i.test(link.url))) return clean;
  return [...clean, { platform: "Crunchbase", url: CRUNCHBASE_URL }];
}
