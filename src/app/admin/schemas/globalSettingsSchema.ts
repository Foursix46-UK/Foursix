import { buildCollection } from "firecms";
import { getCachedRoleSync } from "@/lib/roles";
import { withAuditLogs } from "@/lib/auditLogger";
import { GLOBAL_STAT_LABELS } from "@/components/sections/GlobalPresence";

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
  description: "Manage the statistics (values and labels) shown on the Global Presence component.",
  properties: {
    // Four stats around the globe. Each has a value and its own editable label.
    activeCountries: { name: "Stat 1 — Value", dataType: "string", defaultValue: "5" },
    activeCountriesLabel: { name: "Stat 1 — Label", dataType: "string", defaultValue: GLOBAL_STAT_LABELS.activeCountriesLabel, description: "Shown under the Stat 1 value. Empty uses \"Active Countries\"." },
    ventureNodes: { name: "Stat 2 — Value", dataType: "string", defaultValue: "12+" },
    ventureNodesLabel: { name: "Stat 2 — Label", dataType: "string", defaultValue: GLOBAL_STAT_LABELS.ventureNodesLabel, description: "Shown under the Stat 2 value. Empty uses \"Venture Nodes\"." },
    systemArchitecture: { name: "Stat 3 — Value", dataType: "string", defaultValue: "Distributed" },
    systemArchitectureLabel: { name: "Stat 3 — Label", dataType: "string", defaultValue: GLOBAL_STAT_LABELS.systemArchitectureLabel, description: "Shown under the Stat 3 value. Empty uses \"System Architecture\"." },
    operationalUptime: { name: "Stat 4 — Value", dataType: "string", defaultValue: "24/7" },
    operationalUptimeLabel: { name: "Stat 4 — Label", dataType: "string", defaultValue: GLOBAL_STAT_LABELS.operationalUptimeLabel, description: "Shown under the Stat 4 value. Empty uses \"Operational uptime\"." },

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