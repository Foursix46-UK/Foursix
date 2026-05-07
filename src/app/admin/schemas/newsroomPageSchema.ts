import { buildCollection } from "firecms";
import { getCachedRoleSync } from "@/lib/roles";
import { withAuditLogs } from "@/lib/auditLogger";

export const newsroomPageCollection = buildCollection({
  name: "Newsroom Page Settings",
  singularName: "Newsroom Page",
  path: "page_newsroom",
  icon: "Article",
  group: "Website Pages",
  permissions: ({ authController }) => {
    const userEmail = authController.user?.email;
    const role = userEmail ? getCachedRoleSync(userEmail) : null;

    if (role === "admin" || role === "editor") {
        return { edit: true, create: false, delete: false }; 
    }
    return { edit: false, create: false, delete: false };
},
callbacks: withAuditLogs("Newsroom Page"),
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
    footerButton: { name: "Subscribe Button Text", dataType: "string", defaultValue: "SUBSCRIBE" },
    seoTitle: { 
      name: "SEO Meta Title", 
      dataType: "string", 
      defaultValue: "Newsroom & Press | FourSix46",
      description: "The title that appears in Google Search."
    },
    seoDescription: { 
      name: "SEO Meta Description", 
      dataType: "string", 
      defaultValue: "Official press releases, announcements, and venture updates from the FourSix46 collective.",
      description: "The short description below the title in Google Search."
    }
  }
});