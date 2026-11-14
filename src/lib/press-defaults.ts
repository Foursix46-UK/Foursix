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
  contactPhone: "+44 330 124 1966",
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

type PressLabelInput = { mediaType?: string; outlet?: string; paid?: boolean };

/** Lead-in for the card label, by Media Type. */
const PRESS_LABEL_PREFIX: Record<string, string> = {
  Interview: "Interview on",
  Profile: "Contributor at",
  Article: "Article in",
  Feature: "Featured in",
  Podcast: "Podcast on",
  Video: "Video on",
  Award: "Award from",
};

/**
 * The label on a press card, e.g. "Interview on Brainz Magazine".
 *
 * Paid or sponsored entries can never claim "Featured in": they read "Interview on"
 * for interviews and "Writes for" for everything else, whatever the Media Type says.
 */
export function pressCardLabel({ mediaType, outlet, paid }: PressLabelInput): string {
  const type = mediaType || "Article";
  const prefix = paid
    ? type === "Interview"
      ? "Interview on"
      : "Writes for"
    : PRESS_LABEL_PREFIX[type] || "Article in";
  return outlet ? `${prefix} ${outlet}` : type;
}

/** The card button: the CMS "Button label" first, then the default for the Media Type. */
export function pressButtonLabel({ buttonLabel, mediaType }: { buttonLabel?: string; mediaType?: string }): string {
  return String(buttonLabel || "").trim() || (mediaType === "Profile" ? "View profile" : "Read article");
}
