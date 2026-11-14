import { buildCollection } from "firecms";
import { getCachedRoleSync } from "@/lib/roles";
import { withAuditLogs } from "@/lib/auditLogger";
import { FOOTER_DEFAULTS } from "@/lib/footer-defaults";

export const footerCollection = buildCollection({
  name: "Global Footer Settings",
  singularName: "Footer",
  path: "layout_footer",
  icon: "ViewStream",
  group: "Website Layout",
  description: "Manage the footer tagline, copyright line, legal line and social links. (Note: Only create ONE document).",
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
    tagline: {
      name: "Tagline",
      dataType: "string",
      multiline: true,
      defaultValue: FOOTER_DEFAULTS.tagline,
      description: "Shown under the logo on every page. Leave empty to use the default tagline.",
    },
    copyrightLine: {
      name: "Copyright line",
      dataType: "string",
      defaultValue: FOOTER_DEFAULTS.copyrightLine,
      description: "Write {year} where the year goes and it always shows the current year, e.g. \"© {year} FourSix46® Global Ltd\".",
    },
    legalLine: {
      name: "Legal line",
      dataType: "string",
      multiline: true,
      defaultValue: FOOTER_DEFAULTS.legalLine,
      description: "Shown directly under the copyright line: company name, number, registration and registered office.",
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
      defaultValue: FOOTER_DEFAULTS.socialLinks,
      description: "The Crunchbase profile is always shown; it is added automatically if this list does not include it.",
    }
  }
});