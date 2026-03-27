import { buildCollection } from "firecms";

export const newsroomPageCollection = buildCollection({
  name: "Newsroom Page Settings",
  singularName: "Newsroom Page",
  path: "page_newsroom",
  icon: "Article",
  group: "Website Pages",
  permissions: ({ user }) => ({ edit: true, create: false, delete: false }),
  properties: {
    heroLabel: { name: "Hero Label", dataType: "string", defaultValue: "Press & Announcements" },
    heroTitle: { name: "Hero Title", dataType: "string", defaultValue: "NEWSROOM" },
    heroSubtitle: { name: "Hero Subtitle", dataType: "string", multiline: true, defaultValue: "Official press releases, announcements, and venture updates from the FourSix46 collective." },
    pressInquiryText: { name: "Press Inquiry Text", dataType: "string", defaultValue: "For press and media inquiries:" },
    pressEmail: { name: "Press Email", dataType: "string", defaultValue: "press@foursix46.com" },
    
    // --- NEW: NEWSLETTER SECTION ---
    footerLabel: { name: "Newsletter Label", dataType: "string", defaultValue: "Intelligence Network" },
    footerTitle: { name: "Newsletter Title", dataType: "string", defaultValue: "SUBSCRIBE TO UPDATES" },
    footerText: { name: "Newsletter Text", dataType: "string", multiline: true, defaultValue: "Receive official press releases, venture launches, and corporate announcements directly to your inbox." },
    footerButton: { name: "Subscribe Button Text", dataType: "string", defaultValue: "SUBSCRIBE" }
  }
});