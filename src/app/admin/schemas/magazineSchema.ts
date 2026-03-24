import { buildCollection } from "firecms";

export const magazineCollection = buildCollection({
  name: "Magazines & Editorials",
  singularName: "Issue",
  path: "magazines",
  icon: "MenuBook",
  properties: {
    // --- COVER DATA (PAGE 1) ---
    articleTitle: { name: "Article Title", dataType: "string", validation: { required: true, max: 45 }, defaultValue: "" },
    slug: { name: "URL Slug", dataType: "string", validation: { required: true }, defaultValue: "" },
    magazineSeriesName: { name: "Series Name", dataType: "string", description: "e.g., THE FRONTIER", defaultValue: "" },
    issueVolume: { name: "Issue / Volume", dataType: "string", description: "e.g., VOL. 04", defaultValue: "" },
    themeTag: { name: "Theme Tag", dataType: "string", description: "e.g., BIOPHILIC", defaultValue: "" },
    coverImage: { name: "Cover Image", dataType: "string", storage: { storagePath: "magazines/covers", acceptedFiles: ["image/*"] } },

    // --- METADATA (PAGE 2) ---
    articleType: { name: "Article Type", dataType: "string", defaultValue: "ESSAY" },
    readingTime: { name: "Reading Time", dataType: "string", defaultValue: "12 MIN READ" },
    publishDate: { name: "Publish Date", dataType: "date", validation: { required: true } },
    authorContributor: { name: "Author / Contributor", dataType: "string", defaultValue: "" },

    // --- FIX: ASSOCIATED VENTURE MAPPING ---
    associatedVentureName: { 
      name: "Associated Venture Name (Display)", 
      dataType: "string", 
      description: "e.g., M-Studio. Leave blank if not applicable.",
      defaultValue: "" 
    },
    associatedVentureSlug: { 
      name: "Associated Venture Slug (Link)", 
      dataType: "string", 
      description: "e.g., m-studio",
      defaultValue: "" 
    },

    // --- INNER CONTENT (PAGES 2, 3, & 4) ---
    page2IntroText: { 
      name: "Page 2: Intro Paragraph", 
      dataType: "string", 
      multiline: true,
      validation: { max: 400 },
      description: "Keep it brief (Max 400 chars). This appears in italics on the left page.",
      defaultValue: "" 
    },
    page3PullQuote: { 
      name: "Page 3: Large Pull Quote", 
      dataType: "string", 
      validation: { max: 120 },
      description: "e.g., Sovereignty is the new currency of the digital age. (Max 120 chars)",
      defaultValue: "" 
    },
    page3Image: { 
      name: "Page 3: Feature Image", 
      dataType: "string", 
      storage: { storagePath: "magazines/features", acceptedFiles: ["image/*"] } 
    },
    page4MainText: { 
      name: "Page 4: Main Article Text", 
      dataType: "string", 
      multiline: true,
      validation: { max: 1400 },
      description: "Use double line breaks to separate paragraphs. Flows into two justified columns. (Max 1400 chars to prevent page overflow)",
      defaultValue: "" 
    },

    // --- TOGGLES ---
    featuredStoryToggle: { name: "Feature on Home Page", dataType: "boolean", defaultValue: false },
    visibilityToggle: { name: "Visible on Public Site", dataType: "boolean", defaultValue: true },
    displayOrder: { name: "Display Order", dataType: "number", defaultValue: 0 }
  }
});