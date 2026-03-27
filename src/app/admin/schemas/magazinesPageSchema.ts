import { buildCollection } from "firecms";

export const magazinesPageCollection = buildCollection({
  name: "Magazines Page Settings",
  singularName: "Magazines Page",
  path: "page_magazines",
  icon: "MenuBook",
  group: "Website Pages",
  description: "Manage the text for the main Magazines overview page.",
  permissions: ({ user }) => ({ edit: true, create: false, delete: false }),
  properties: {
    heroLabel: { name: "Hero Label", dataType: "string", defaultValue: "The Editorial Archive" },
    heroTitle: { name: "Hero Title", dataType: "string", defaultValue: "PUBLICATIONS" },
    heroSubtitle: { name: "Hero Subtitle", dataType: "string", multiline: true, defaultValue: "Our quarterly deep-dive into the philosophies that drive our ventures. From architectural biophilia to the future of orbital mobility, we examine the narratives shaping our world." },
    
    footerLabel: { name: "Footer Label", dataType: "string", defaultValue: "Intelligence Network" },
    footerTitle: { name: "Footer Title", dataType: "string", defaultValue: "SUBSCRIBE TO UPDATES" },
    footerText: { name: "Footer Text", dataType: "string", multiline: true, defaultValue: "Receive official press releases, venture launches, and corporate announcements directly to your inbox." },
    footerButton: { name: "Subscribe Button Text", dataType: "string", defaultValue: "SUBSCRIBE" }
  }
});