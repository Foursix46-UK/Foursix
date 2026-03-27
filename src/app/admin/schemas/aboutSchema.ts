import { buildCollection } from "firecms";

export const aboutPageCollection = buildCollection({
  name: "About Page Settings",
  singularName: "About Page",
  path: "page_about",
  icon: "Info",
  group: "Website Pages",
  description: "Manage the text, timeline, and video for the About/Vision page. (Note: Only create ONE document in this collection with the ID 'about').",
  permissions: ({ user }) => ({
    edit: true,
    create: false, 
    delete: false 
  }),
  properties: {
    // --- HERO SECTION ---
    heroLabel: { name: "Hero Label", dataType: "string", defaultValue: "Our Core Purpose" },
    heroTitle: { name: "Hero Title", dataType: "string", multiline: true, defaultValue: "A HUB FOR\nINNOVATION" },
    heroTypewriter: { name: "Typewriter Text", dataType: "string", multiline: true, defaultValue: "Architecting the global nodes of tomorrow. A collective of disruptive ventures unified by strategic leadership and generational impact." },
    
    // --- VIDEO SECTION ---
    videoLabel: { name: "Video Label", dataType: "string", defaultValue: "Brand Film" },
    videoSubtitle: { name: "Video Subtitle", dataType: "string", defaultValue: "FourSix46 Global Venture Company" },
    videoUrl: { name: "YouTube Embed URL", dataType: "string", defaultValue: "https://www.youtube.com/embed/9GSDG6MVKbI?autoplay=1&mute=1&loop=1&playlist=9GSDG6MVKbI&controls=1" },

    // --- STRATEGIC PURPOSE (MANIFESTO) ---
    manifestoLabel: { name: "Manifesto Label", dataType: "string", defaultValue: "Strategic Purpose" },
    manifestoText: { 
      name: "Manifesto Text", 
      dataType: "string", 
      multiline: true, 
      defaultValue: "We believe that the future of human infrastructure is not found in synthetic isolation, but in the synthesis of biological imperative and structural clarity. FourSix46 is the architect of this transition — integrating global logistics, sovereign data management, and biophilic systems into a unified, resilient ecosystem for the next century." 
    },

    // --- TIMELINE SECTION ---
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
        { year: "2018", title: "M-Studio Established", content: "FourSix46 roots take hold with the founding of M-Studio, a design laboratory focused on pioneering neo-brutalism for high-density corporate environments." },
        { year: "2021", title: "Holding Entity Formulation", content: "Strategic pivot to a multi-brand holding structure, formalizing the synergy between design, aerospace, and decentralized compute ventures." },
        { year: "2023", title: "Sovereign Infrastructure", content: "Deployment of the first Nexus Core sovereign data nodes and the successful launch of Rastlina's biophilic pilot towers." },
        { year: "2024", title: "Global Node Expansion", content: "Achieving full operational capacity in five global hubs (London, NY, Tokyo, Dubai, Singapore) and initiating orbital mobility tests with Vyoma." },
      ]
    },

    // --- LEADERSHIP SECTION (Headers Only) ---
    leadershipLabel: { name: "Leadership Label", dataType: "string", defaultValue: "Institutional Relations" },
    leadershipTitle: { name: "Leadership Title", dataType: "string", defaultValue: "Core Leadership" },
    leadershipCtaText: { name: "Leadership Button Text", dataType: "string", defaultValue: "View Full Leadership Team" }
  }
});