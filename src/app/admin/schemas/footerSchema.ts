import { buildCollection } from "firecms";
import { getCachedRoleSync } from "@/lib/roles";
import { withAuditLogs } from "@/lib/auditLogger";

export const footerCollection = buildCollection({
  name: "Global Footer Settings",
  singularName: "Footer",
  path: "layout_footer",
  icon: "ViewStream",
  group: "Website Layout",
  description: "Manage the footer text and social links. (Note: Only create ONE document).",
  permissions: ({ authController }) => {
        const userEmail = authController.user?.email;
        const role = userEmail ? getCachedRoleSync(userEmail) : null;

        if (role === "admin" || role === "editor") {
            // Both can edit. Neither can create a second page or delete the existing one.
            return { edit: true, create: false, delete: false }; 
        }
        return { edit: false, create: false, delete: false };
    },
    callbacks: withAuditLogs("Footer"),
  properties: {
    brandDescription: { 
      name: "Brand Description", 
      dataType: "string", 
      multiline: true,
      defaultValue: "Building the future of logistics, tech, and global impact through structural integrity and aesthetic purity." 
    },
    
    // --- SOCIAL LINKS ---
    socialLinks: {
      name: "FOURSIX VERSE (Social Links)",
      dataType: "array",
      of: {
        dataType: "map",
        properties: {
          platform: { name: "Platform Name", dataType: "string" },
          url: { name: "Profile URL", dataType: "string" }
        }
      },
      defaultValue: [
        { platform: "LinkedIn", url: "https://www.linkedin.com/company/foursix46" },
        { platform: "X (Twitter)", url: "https://x.com/FourSix46HQ" },
        { platform: "Instagram", url: "https://www.instagram.com/foursix46hq/" },
        { platform: "TikTok", url: "https://www.tiktok.com/@foursix46hq" },
        { platform: "Facebook", url: "https://www.facebook.com/FourSix46hq" },
        { platform: "YouTube", url: "https://www.youtube.com/@Foursix46hq" }
      ]
    }
  }
});