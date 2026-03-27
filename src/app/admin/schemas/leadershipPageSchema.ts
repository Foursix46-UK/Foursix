import { buildCollection } from "firecms";

export const leadershipPageCollection = buildCollection({
  name: "Leadership Page Settings",
  singularName: "Leadership Page",
  path: "page_leadership",
  icon: "People",
  group: "Website Pages",
  description: "Manage the text for the Leadership overview page.",
  permissions: ({ user }) => ({ edit: true, create: false, delete: false }),
  properties: {
    heroLabel: { name: "Hero Label", dataType: "string", defaultValue: "Visionary Core" },
    heroTitle: { name: "Hero Title", dataType: "string", multiline: true, defaultValue: "Leadership\n& Visionaries" },
    heroSubtitle: { name: "Hero Subtitle", dataType: "string", multiline: true, defaultValue: "Meet the strategic architects driving the FourSix46 collective. A multi-disciplinary team committed to structural integrity, aesthetic purity, and global impact." },
    
    footerTitle: { name: "Footer Title", dataType: "string", defaultValue: "Institutional Relations" },
    footerText: { name: "Footer Text", dataType: "string", multiline: true, defaultValue: "Our leadership team actively engages with institutional partners and strategic investors to identify new frontier opportunities. Initiate a dialogue with our executive office." },
    ctaButton: { name: "CTA Button Text", dataType: "string", defaultValue: "Connect with Leadership" }
  }
});