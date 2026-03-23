import { buildCollection } from "firecms";

export const newsCollection = buildCollection({
  name: "Newsroom & Press",
  singularName: "Article",
  path: "news",
  icon: "Newspaper",
  properties: {
    // --- BASIC INFO ---
    title: { name: "Headline", dataType: "string", validation: { required: true }, defaultValue: "" },
    slug: { 
      name: "URL Slug", 
      dataType: "string", 
      description: "e.g., q1-orbital-expansion (no spaces)", 
      validation: { required: true },
      defaultValue: ""
    },
    subHeadline: { name: "Sub-headline", dataType: "string", defaultValue: "" },
    desc: { name: "Short Summary (Card View)", dataType: "string", defaultValue: "" },
    
    // --- METADATA ---
    category: {
      name: "Category",
      dataType: "string",
      description: "e.g., Press Release, Award, or type any custom category.",
      validation: { required: true },
      defaultValue: "Press Release"
    },
    authorSource: { name: "Author / Source", dataType: "string", defaultValue: "Strategic Relations Office" },
    publishDate: { name: "Publish Date", dataType: "date", validation: { required: true } },
    readTime: { name: "Read Time", dataType: "string", description: "e.g., 5 MIN READ", defaultValue: "3 MIN READ" },

    // --- MEDIA & CONTENT ---
    heroImage: { 
      name: "Featured Image", 
      dataType: "string", 
      storage: { storagePath: "news/images", acceptedFiles: ["image/*"] } 
    },
    bodyContent: { 
      name: "Body Content", 
      dataType: "string", 
      multiline: true,
      description: "Use double line breaks to separate paragraphs.",
      defaultValue: ""
    },
    pdfAttachment: {
      name: "PDF Attachment (Press Kit)",
      dataType: "string",
      storage: { storagePath: "news/pdfs", acceptedFiles: ["application/pdf"] }
    },
    externalCoverageLinks: {
      name: "External Coverage Links",
      dataType: "array",
      of: { dataType: "string", url: true }
    },

    // --- TOGGLES & SEO ---
    displayOnHome: { name: "Display on Home Page", dataType: "boolean", defaultValue: false },
    visibilityToggle: { name: "Visible on Public Site", dataType: "boolean", defaultValue: true },
    seoTitle: { name: "SEO Meta Title", dataType: "string", defaultValue: "" },
    seoDescription: { name: "SEO Meta Description", dataType: "string", defaultValue: "" }
  }
});