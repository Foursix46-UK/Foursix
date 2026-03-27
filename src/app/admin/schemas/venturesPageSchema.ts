import { buildCollection } from "firecms";

export const venturesPageCollection = buildCollection({
  name: "Ventures Page Settings",
  singularName: "Ventures Page",
  path: "page_ventures",
  icon: "Business",
  group: "Website Pages",
  description: "Manage the text for the main Ventures overview page.",
  permissions: ({ user }) => ({ edit: true, create: false, delete: false }),
  properties: {
    heroLabel: { name: "Hero Label", dataType: "string", defaultValue: "The Collective" },
    heroTitleMain: { name: "Hero Title (White)", dataType: "string", defaultValue: "OUR" },
    heroTitleHighlight: { name: "Hero Title (Faded)", dataType: "string", defaultValue: "VENTURES" },
    heroSubtitle: { name: "Hero Subtitle", dataType: "string", multiline: true, defaultValue: "FourSix46 actively manages a diverse portfolio of disruptive brands. Our approach combines capital allocation with deep operational expertise in design, engineering, and brand narrative." },
    
    footerTitle: { name: "Footer Title", dataType: "string", defaultValue: "Strategic Investment" },
    footerText: { name: "Footer Text", dataType: "string", multiline: true, defaultValue: "We identify and accelerate ventures that operate at the frontier of high-density urbanism, orbital mobility, and sovereign infrastructure. Each portfolio entity is a node in our global strategic network." },
    
    ctaTitle: { name: "CTA Box Title", dataType: "string", defaultValue: "Inquiry" },
    ctaText: { name: "CTA Box Text", dataType: "string", multiline: true, defaultValue: "Interested in partnership or strategic allocation opportunities within our collective?" },
    ctaButton: { name: "CTA Button Text", dataType: "string", defaultValue: "Connect with our team" }
  }
});