import { buildCollection } from "firecms";

export const globalSettingsCollection = buildCollection({
  name: "Global Page Settings",
  singularName: "Settings",
  path: "globalSettings",
  icon: "Settings",
  description: "Manage the aggregate statistics shown on the Global Presence component.",
  properties: {
    activeCountries: { name: "Active Countries (Text)", dataType: "string", defaultValue: "5" },
    ventureNodes: { name: "Venture Nodes (Text)", dataType: "string", defaultValue: "12+" },
    projectedRevenue: { name: "Projected Revenue (Text)", dataType: "string", defaultValue: "$10B+" },
    operationalUptime: { name: "Operational Uptime (Text)", dataType: "string", defaultValue: "24/7" },
  }
});