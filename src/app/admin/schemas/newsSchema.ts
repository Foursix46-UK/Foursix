import { buildCollection } from "firecms";
import { getCachedRoleSync } from "@/lib/roles";
import { withAuditLogs } from "@/lib/auditLogger";

export const newsCollection = buildCollection({
  name: "Newsroom & Press",
  singularName: "Article",
  path: "news",
  icon: "Newspaper",
  permissions: ({ authController }) => {
        const userEmail = authController.user?.email;
        const role = userEmail ? getCachedRoleSync(userEmail) : null;

        if (role === "admin") {
            return { edit: true, create: true, delete: true }; 
        }
        
        if (role === "editor" || role === "author") {
            return { edit: true, create: true, delete: false }; // Hide delete button
        }

        return { edit: false, create: false, delete: false };
    },
    callbacks: withAuditLogs("News"),
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

    // --- FAQ (Optional) ---
    // Filling this in makes the article eligible for Google's FAQ rich result.
    // The questions are published as FAQPage structured data automatically.
    faqs: {
      name: "FAQ (Optional)",
      dataType: "array",
      description: "Question and answer pairs shown to Google as FAQ structured data for this article.",
      of: {
        dataType: "map",
        properties: {
          question: { name: "Question", dataType: "string", validation: { required: true } },
          answer: { name: "Answer", dataType: "string", multiline: true, validation: { required: true } }
        }
      }
    },

    // --- TOGGLES & SEO ---
    displayOnHome: { name: "Display on Home Page", dataType: "boolean", defaultValue: false },
    // --- FIX: ADDED EXPANSION TOGGLE ---
    showOnGlobalExpansion: { name: "Show in Global Expansion Updates", dataType: "boolean", defaultValue: false },
    visibilityToggle: { name: "Visible on Public Site", dataType: "boolean", defaultValue: true },
    seoTitle: { name: "SEO Meta Title", dataType: "string", defaultValue: "" },
    seoDescription: { name: "SEO Meta Description", dataType: "string", defaultValue: "" }
  }
});