import { buildCollection } from "firecms";
import { getCachedRoleSync } from "@/lib/roles";
import { withAuditLogs } from "@/lib/auditLogger";

export const globalSettingsCollection = buildCollection({
  name: "Global Page Settings",
  singularName: "Settings",
  path: "globalSettings",
  permissions: ({ authController }) => {
        const userEmail = authController.user?.email;
        const role = userEmail ? getCachedRoleSync(userEmail) : null;

        if (role === "admin" || role === "editor") {
            // Both can edit. Neither can create a second page or delete the existing one.
            return { edit: true, create: false, delete: false }; 
        }
        return { edit: false, create: false, delete: false };
    },
    callbacks: withAuditLogs("Global Settings"),
  icon: "Settings",
  description: "Manage the aggregate statistics shown on the Global Presence component.",
  properties: {
    activeCountries: { name: "Active Countries (Text)", dataType: "string", defaultValue: "5" },
    ventureNodes: { name: "Venture Nodes (Text)", dataType: "string", defaultValue: "12+" },
    systemArchitecture: { name: "System Architecture (Text)", dataType: "string", defaultValue: "Distributed" },
    operationalUptime: { name: "Operational Uptime (Text)", dataType: "string", defaultValue: "24/7" },

    seoTitle: { 
      name: "SEO Meta Title", 
      dataType: "string", 
      defaultValue: "Global Presence | FourSix46",
      description: "The title that appears in Google Search."
    },
    seoDescription: { 
      name: "SEO Meta Description", 
      dataType: "string", 
      defaultValue: "Explore FourSix46's global nodes and strategic regional operations.",
      description: "The short description below the title in Google Search."
    }
  }
});