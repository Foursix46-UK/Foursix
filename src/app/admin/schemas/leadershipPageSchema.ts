import { buildCollection } from "firecms";
import { getCachedRoleSync } from "@/lib/roles";
import { withAuditLogs } from "@/lib/auditLogger";

export const leadershipPageCollection = buildCollection({
  name: "Leadership Page Settings",
  singularName: "Leadership Page",
  path: "page_leadership",
  icon: "People",
  group: "Website Pages",
  description: "Manage the text for the Leadership overview page.",
  permissions: ({ authController }) => {
        const userEmail = authController.user?.email;
        const role = userEmail ? getCachedRoleSync(userEmail) : null;

        if (role === "admin" || role === "editor") {
            // Both can edit. Neither can create a second page or delete the existing one.
            return { edit: true, create: false, delete: false }; 
        }
        return { edit: false, create: false, delete: false };
    },
    callbacks: withAuditLogs("Leadership Page"),
  properties: {
    heroLabel: { name: "Hero Label", dataType: "string", defaultValue: "Visionary Core" },
    heroTitle: { name: "Hero Title", dataType: "string", multiline: true, defaultValue: "Leadership\n& Visionaries" },
    heroSubtitle: { name: "Hero Subtitle", dataType: "string", multiline: true, defaultValue: "Meet the strategic architects driving the FourSix46 collective. A multi-disciplinary team committed to structural integrity, aesthetic purity, and global impact." },
    
    footerTitle: { name: "Footer Title", dataType: "string", defaultValue: "Institutional Relations" },
    footerText: { name: "Footer Text", dataType: "string", multiline: true, defaultValue: "Our leadership team actively engages with institutional partners and strategic investors to identify new frontier opportunities. Initiate a dialogue with our executive office." },
    ctaButton: { name: "CTA Button Text", dataType: "string", defaultValue: "Connect with Leadership" },
    seoTitle: { 
      name: "SEO Meta Title", 
      dataType: "string", 
      defaultValue: "Leadership | FourSix46",
      description: "The title that appears in Google Search."
    },
    seoDescription: { 
      name: "SEO Meta Description", 
      dataType: "string", 
      defaultValue: "Meet the strategic architects driving the FourSix46 collective.",
      description: "The short description below the title in Google Search."
    }
  
  }
});