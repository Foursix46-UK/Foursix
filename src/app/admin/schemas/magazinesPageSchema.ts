import { buildCollection } from "firecms";
import { getCachedRoleSync } from "@/lib/roles";
import { withAuditLogs } from "@/lib/auditLogger";

export const magazinesPageCollection = buildCollection({
  name: "Magazines Page Settings",
  singularName: "Magazines Page",
  path: "page_magazines",
  icon: "MenuBook",
  group: "Website Pages",
  description: "Manage the text for the main Magazines overview page.",
  permissions: ({ authController }) => {
    const userEmail = authController.user?.email;
    const role = userEmail ? getCachedRoleSync(userEmail) : null;

    if (role === "admin" || role === "editor") {
        return { edit: true, create: false, delete: false }; 
    }
    return { edit: false, create: false, delete: false };
},
callbacks: withAuditLogs("Magazines Page"),
  properties: {
    heroLabel: { name: "Hero Label", dataType: "string", defaultValue: "The Editorial Archive" },
    heroTitle: { name: "Hero Title", dataType: "string", defaultValue: "PUBLICATIONS" },
    heroSubtitle: { name: "Hero Subtitle", dataType: "string", multiline: true, defaultValue: "Our quarterly deep-dive into the philosophies that drive our ventures. From architectural biophilia to the future of orbital mobility, we examine the narratives shaping our world." },
    
    footerLabel: { name: "Footer Label", dataType: "string", defaultValue: "Intelligence Network" },
    footerTitle: { name: "Footer Title", dataType: "string", defaultValue: "SUBSCRIBE TO UPDATES" },
    footerText: { name: "Footer Text", dataType: "string", multiline: true, defaultValue: "Receive official press releases, venture launches, and corporate announcements directly to your inbox." },
    footerButton: { name: "Subscribe Button Text", dataType: "string", defaultValue: "SUBSCRIBE" },
    seoTitle: { 
      name: "SEO Meta Title", 
      dataType: "string", 
      defaultValue: "Publications | FourSix46",
      description: "The title that appears in Google Search."
    },
    seoDescription: { 
      name: "SEO Meta Description", 
      dataType: "string", 
      defaultValue: "Our quarterly deep-dive into the philosophies that drive our ventures.",
      description: "The short description below the title in Google Search."
    }
  }
});