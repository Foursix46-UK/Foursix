import { buildCollection } from "firecms";

export const homePageCollection = buildCollection({
  name: "Home Page Settings",
  singularName: "Home Page",
  path: "page_home", 
  icon: "Home",
  group: "Website Pages", 
  description: "Manage the text, headers, and FAQs for the main landing page. (Note: Only create ONE document in this collection with the ID 'home').",
  permissions: ({ user }) => ({
    edit: true,
    create: false, 
    delete: false 
  }),
  properties: {
    // ==========================================
    // 1. HERO SECTION
    // ==========================================
    heroBadge: { name: "Hero Badge", dataType: "string", defaultValue: "Established 2024" },
    heroTitleLine1: { name: "Hero Title (Line 1)", dataType: "string", defaultValue: "Welcome to the" },
    heroTitleHighlight: { name: "Hero Title (Highlight - Blue)", dataType: "string", defaultValue: "House of" },
    heroTitleLine3: { name: "Hero Title (Line 3)", dataType: "string", defaultValue: "Multibrands." },
    heroSubtitle: { name: "Hero Subtitle", dataType: "string", multiline: true, defaultValue: "Building the future of logistics, tech, and global impact.\nA multi-venture holding company driving strategic growth through Quiet Luxury and Brutal Efficiency." },
    heroMarqueeLogos: { name: "Hero Marquee Text/Logos", dataType: "array", of: { dataType: "string" }, defaultValue: ["RASTLINA", "VYOMA", "FOURSIX", "M-STUDIO", "ELITE", "NEXUS", "KINETIC", "LUXE"] },

    // ==========================================
    // 2. VISION SECTION
    // ==========================================
    visionLabel: { name: "Vision Label", dataType: "string", defaultValue: "Our Purpose" },
    visionTitle: { name: "Vision Title", dataType: "string", defaultValue: "Mission" },
    visionStatement: { name: "Main Mission Statement", dataType: "string", multiline: true, defaultValue: "We do not just build companies. We engineer ecosystems. FourSix46 is a parent brand dedicated to shaping the future of global logistics, sovereign data, and biophilic tech." },
    visionPrinciples: {
      name: "Core Principles (The 4 Cards)",
      dataType: "array",
      of: {
        dataType: "map",
        properties: {
          title: { name: "Title", dataType: "string" },
          description: { name: "Description", dataType: "string", multiline: true }
        }
      },
      defaultValue: [
        { title: "Neo-Brutalism", description: "Structural clarity and raw honesty in every venture." },
        { title: "Quiet Luxury", description: "Sophistication through absolute precision and poise." },
        { title: "Sovereign Scale", description: "Distributed, secure, and sovereign infrastructure nodes." },
        { title: "Global Synergy", description: "Unifying cross-border ventures for maximum impact." }
      ]
    },
    visionQuote: { name: "Leadership Quote", dataType: "string", multiline: true, defaultValue: "\"Our vision extends beyond singular ventures. We are building the structural integrity for tomorrow's boldest ideas.\"" },
    visionQuoteAuthor: { name: "Quote Author Name", dataType: "string", defaultValue: "Julian Thorne" },
    visionQuoteRole: { name: "Quote Author Role", dataType: "string", defaultValue: "Chief Executive" },
    visionCtaText: { name: "Vision Button Text", dataType: "string", defaultValue: "Our Full Story" },

    // ==========================================
    // 3. SECTION HEADERS & CTAS
    // ==========================================
    venturesLabel: { name: "Ventures Label", dataType: "string", defaultValue: "Portfolio" },
    venturesTitle: { name: "Ventures Title", dataType: "string", defaultValue: "Ventures" },
    venturesCtaText: { name: "Ventures Button Text", dataType: "string", defaultValue: "Explore All Ventures" },

    newsroomLabel: { name: "Newsroom Label", dataType: "string", defaultValue: "Press & Announcements" },
    newsroomTitle: { name: "Newsroom Title", dataType: "string", defaultValue: "NEWSROOM" },
    newsroomSubtitle: { name: "Newsroom Subtitle", dataType: "string", multiline: true, defaultValue: "Tracking the velocity of our ventures and the impact of our global strategic nodes through the lens of structural innovation." },
    newsroomCtaText: { name: "Newsroom Button Text", dataType: "string", defaultValue: "View All Releases" },

    magazinesLabel: { name: "Magazines Label", dataType: "string", defaultValue: "Publications" },
    magazinesTitle: { name: "Magazines Title", dataType: "string", defaultValue: "MAGAZINES" },
    magazinesCtaText: { name: "Magazines Button Text", dataType: "string", defaultValue: "Explore Publications" },
    
    globalLabel: { name: "Global Label", dataType: "string", defaultValue: "International" },
    globalTitle: { name: "Global Title", dataType: "string", defaultValue: "GLOBAL PRESENCE" },
    globalCtaText: { name: "Global Button Text", dataType: "string", defaultValue: "Explore Our Global Footprint" },

    // ==========================================
    // 4. FAQ SECTION (Headers Only)
    // ==========================================
    faqLabel: { name: "FAQ Label", dataType: "string", defaultValue: "Intelligence" },
    faqTitle: { name: "FAQ Title", dataType: "string", defaultValue: "STRATEGIC CLARITY" },
    faqCtaText: { name: "FAQ Button Text", dataType: "string", defaultValue: "Read All FAQs" },
  }
});