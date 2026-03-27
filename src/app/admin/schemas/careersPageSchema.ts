import { buildCollection } from "firecms";

export const careersPageCollection = buildCollection({
  name: "Careers Page Settings",
  singularName: "Careers Page",
  path: "page_careers",
  icon: "Work",
  group: "Website Pages",
  permissions: ({ user }) => ({ edit: true, create: false, delete: false }),
  properties: {
    heroLabel: { name: "Hero Label", dataType: "string", defaultValue: "Join the Collective" },
    heroTitleMain: { name: "Hero Title (White)", dataType: "string", defaultValue: "HUMAN" },
    heroTitleHighlight: { name: "Hero Title (Faded)", dataType: "string", defaultValue: "CAPITAL" },
    
    cultureTitle: { name: "Culture Section Title", dataType: "string", defaultValue: "Culture & Values" },
    cultureText: { name: "Culture Text", dataType: "string", multiline: true, defaultValue: 'At FourSix46, we operate at the precise intersection of aesthetic purity and structural clarity. Our collective is built on the principle of "Quiet Luxury" — excellence that is felt, not shouted.' },
    cultureValues: {
      name: "Culture Values List",
      dataType: "array",
      of: {
        dataType: "map",
        properties: {
          title: { name: "Title", dataType: "string" },
          text: { name: "Description", dataType: "string", multiline: true }
        }
      },
      defaultValue: [
        { title: "Radical Honesty", text: "Functional excellence and raw structural truth over superficial polish." },
        { title: "Quiet Synergy", text: "The most impactful work happens through cross-disciplinary collaboration." }
      ]
    },
    
    appProcessTitle: { name: "App Process Title", dataType: "string", defaultValue: "Application Process" },
    appProcessText: { name: "App Process Text", dataType: "string", multiline: true, defaultValue: "Don't see a perfect fit? We are always looking for visionary talent. Initiate a talent inquiry with our strategic relations team." },
    appProcessButton: { name: "App Process Button", dataType: "string", defaultValue: "Contact Talent Team" },
    appProcessEmail: { name: "Talent Email Address", dataType: "string", defaultValue: "careers@foursix46.com" }
  }
});