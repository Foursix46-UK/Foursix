import { buildCollection } from "firecms";
import { getCachedRoleSync } from "@/lib/roles";
import { withAuditLogs } from "@/lib/auditLogger";

export const partnershipPageCollection = buildCollection({
  name: "Partnership Page Settings",
  singularName: "Partnership Page",
  path: "page_partnership",
  icon: "Handshake",
  group: "Website Pages",
  description: "Manage the text and PDF download for the Partnership page. (Note: Only create ONE document in this collection).",
  permissions: ({ authController }) => {
    const userEmail = authController.user?.email;
    const role = userEmail ? getCachedRoleSync(userEmail) : null;

    if (role === "admin" || role === "editor") {
        return { edit: true, create: false, delete: false }; 
    }
    return { edit: false, create: false, delete: false };
  },
  callbacks: withAuditLogs("Partnership Page"),
  properties: {
    heroLabel: { name: "Hero Label", dataType: "string", defaultValue: "Synergy" },
    heroTitle: { name: "Hero Title", dataType: "string", defaultValue: "CO-CREATE THE FUTURE" },
    mainDescription: { 
      name: "Main Description", 
      dataType: "string", 
      multiline: true, 
      defaultValue: "FourSix46 serves as a parent brand that identifies, scales, and unifies high-impact ventures. We provide the structural integrity and strategic leadership required to dominate the frontiers of logistics, data, and tech." 
    },
    
    pillars: {
      name: "Partnership Pillars",
      dataType: "array",
      of: {
        dataType: "map",
        properties: {
          title: { name: "Pillar Title", dataType: "string" },
          desc: { name: "Pillar Description", dataType: "string", multiline: true }
        }
      },
      defaultValue: [
        { title: "Strategic Alliances", desc: "Forging cross-industry ventures and deep ecosystem integration for mutual scaling." },
        { title: "Institutional Capital", desc: "Facilitating global investment and strategic allocation into frontier markets." },
        { title: "Technology Nodes", desc: "Co-developing biophilic and sovereign infrastructure through shared R&D." }
      ]
    },

    ctaTitle: { name: "CTA Title", dataType: "string", defaultValue: "Ready to scale?" },
    ctaSubtitle: { name: "CTA Subtitle", dataType: "string", defaultValue: "Interested in partnering or investing with FourSix46? Let’s initiate the dialogue." },
    ctaButtonText: { name: "CTA Button Text", dataType: "string", defaultValue: "START PARTNERSHIP ENQUIRY" },
    
    brandDeckPdf: { 
      name: "Brand Deck PDF Upload", 
      dataType: "string", 
      storage: { storagePath: "partnership/docs", acceptedFiles: ["application/pdf"] } 
    },

    // --- SEO SECTION ---
    seoTitle: { 
      name: "SEO Meta Title", 
      dataType: "string", 
      defaultValue: "Partner With Us | FourSix46",
      description: "The title that appears in Google Search."
    },
    seoDescription: { 
      name: "SEO Meta Description", 
      dataType: "string", 
      defaultValue: "Co-create the future with FourSix46. Strategic alliances, institutional capital, and technology nodes.",
      description: "The short description below the title in Google Search."
    }
  }
});