// Page copy for /press, shared by the CMS seed and the page fallback so the two can
// never disagree. This is page chrome only: there are deliberately no default press
// mentions. An empty collection renders an honest empty state, never sample
// coverage — invented outlets on a live press page read as fabricated endorsements.
export const PRESS_PAGE_DEFAULTS = {
  title: "Press & Media",
  subtitle: "Coverage",
  description:
    "Features, interviews and coverage of FourSix46 Global Ltd and its ventures, linked to the original publication.",
  heroBackground: "",
  mediaKitLabel: "Download Media Kit",
  mediaKitUrl: "",
  mediaAssetsTitle: "Need media assets?",
  mediaAssetsDescription:
    "Logos, approved photography and company facts for coverage of FourSix46 and its ventures.",
  contactTitle: "Press enquiries",
  contactSubtitle: "Media contact",
  contactDescription:
    "For interview requests, comment and media collaborations, contact the press office directly.",
  contactEmail: "press@foursix46.com",
  contactPhone: "+44 0330 124 1966",
  seoTitle: "Press & Media — FourSix46",
  seoDescription:
    "Press coverage, interviews and media features about FourSix46 Global Ltd and its ventures, with links to each original article.",
  ogImage: "",
};

export const PRESS_MEDIA_TYPES = [
  "Article",
  "Interview",
  "Podcast",
  "Video",
  "Award",
  "Feature",
  "Profile",
] as const;
