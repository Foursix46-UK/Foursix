import { buildCollection } from "firecms";
import { getCachedRoleSync } from "@/lib/roles";
import { withAuditLogs } from "@/lib/auditLogger";

export const aboutPageCollection = buildCollection({
  name: "About Page Settings",
  singularName: "About Page",
  path: "page_about",
  icon: "Info",
  group: "Website Pages",
  description: "Manage the text, timeline, and video for the About/Vision page.",
  permissions: ({ authController }) => {
      const userEmail = authController.user?.email;
      const role = userEmail ? getCachedRoleSync(userEmail) : null;

      if (role === "admin" || role === "editor") {
          return { edit: true, create: false, delete: false }; 
      }
      return { edit: false, create: false, delete: false };
  },
  callbacks: withAuditLogs("About Page"),
  properties: {
    // ... (Keep ALL your existing properties exactly as they are here) ...
    heroLabel: { name: "Hero Label", dataType: "string", defaultValue: "Our Core Purpose" },
    heroTitle: { name: "Hero Title", dataType: "string", multiline: true, defaultValue: "A HUB FOR\nINNOVATION" },
    heroTypewriter: { name: "Typewriter Text", dataType: "string", multiline: true, defaultValue: "Architecting the global nodes of tomorrow. A collective of disruptive ventures unified by strategic leadership and generational impact." },
    videoLabel: { name: "Video Label", dataType: "string", defaultValue: "Brand Film" },
    videoSubtitle: { name: "Video Subtitle", dataType: "string", defaultValue: "FourSix46 Global Venture Company" },
    videoUrl: { name: "YouTube Embed URL", dataType: "string", defaultValue: "https://www.youtube.com/embed/9GSDG6MVKbI?autoplay=1&mute=1&loop=1&playlist=9GSDG6MVKbI&controls=1" },
    manifestoLabel: { name: "Manifesto Label", dataType: "string", defaultValue: "Strategic Purpose" },
    manifestoText: { name: "Manifesto Text", dataType: "string", multiline: true, defaultValue: "We believe that the future of human infrastructure is not found in synthetic isolation, but in the synthesis of biological imperative and structural clarity. FourSix46 is the architect of this transition — integrating global logistics, sovereign data management, and biophilic systems into a unified, resilient ecosystem for the next century." },
    timelineLabel: { name: "Timeline Label", dataType: "string", defaultValue: "The Journey" },
    timelineTitle: { name: "Timeline Title", dataType: "string", multiline: true, defaultValue: "Founding\nStory" },
    timelineSubtitle: { name: "Timeline Subtitle", dataType: "string", multiline: true, defaultValue: "Tracing the evolution from a singular design laboratory to a sovereign multi-brand collective." },
    timelineItems: {
      name: "Timeline Milestones",
      dataType: "array",
      of: {
        dataType: "map",
        properties: {
          year: { name: "Year", dataType: "string" },
          title: { name: "Title", dataType: "string" },
          content: { name: "Content", dataType: "string", multiline: true }
        }
      },
      defaultValue: [
        { year: "2018", title: "M-Studio Established", content: "FourSix46 roots take hold with the founding of M-Studio..." },
        { year: "2021", title: "Holding Entity Formulation", content: "Strategic pivot to a multi-brand holding structure..." },
        { year: "2023", title: "Sovereign Infrastructure", content: "Deployment of the first Nexus Core sovereign data nodes..." },
        { year: "2024", title: "Global Node Expansion", content: "Achieving full operational capacity in five global hubs..." },
      ]
    },
    leadershipLabel: { name: "Leadership Label", dataType: "string", defaultValue: "Institutional Relations" },
    leadershipTitle: { name: "Leadership Title", dataType: "string", defaultValue: "Core Leadership" },
    leadershipCtaText: { name: "Leadership Button Text", dataType: "string", defaultValue: "View Full Leadership Team" },

    // 👇 ADD THIS SEO SECTION TO THE BOTTOM
    seoTitle: { 
      name: "SEO Meta Title", 
      dataType: "string", 
      defaultValue: "About Us & Vision | FourSix46",
      description: "The title that appears in Google Search."
    },
    seoDescription: { 
      name: "SEO Meta Description", 
      dataType: "string", 
      defaultValue: "Architecting the global nodes of tomorrow. A collective of disruptive ventures unified by strategic leadership and generational impact.",
      description: "The short description below the title in Google Search."
    }
  }
});