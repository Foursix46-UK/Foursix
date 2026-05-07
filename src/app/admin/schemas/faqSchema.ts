import { buildCollection } from "firecms";
import { getCachedRoleSync } from "@/lib/roles";
import { withAuditLogs } from "@/lib/auditLogger";

export const faqCollection = buildCollection({
  name: "FAQs & Intelligence",
  singularName: "FAQ",
  path: "faqs",
  permissions: ({ authController }) => {
        const userEmail = authController.user?.email;
        const role = userEmail ? getCachedRoleSync(userEmail) : null;

        if (role === "admin") return { edit: true, create: true, delete: true }; 
        if (role === "editor" || role === "author") return { edit: true, create: true, delete: false };
        return { edit: false, create: false, delete: false };
    },
  callbacks: withAuditLogs("FAQs"),
  icon: "QuestionAnswer",
  group: "Website Pages",
  properties: {
    // --- CORE CONTENT ---
    question: { 
      name: "Question", 
      dataType: "string", 
      validation: { required: true } 
    },
    answer: { 
      name: "Answer (Rich Text)", 
      dataType: "string", 
      markdown: true,
      validation: { required: true } 
    },
    category: {
      name: "Category",
      dataType: "string",
      validation: { required: true },
      defaultValue: "About FourSix46", // Applied fix for React warning
      enumValues: {
        "About FourSix46": "About FourSix46",
        "Ventures & Business Model": "Ventures & Business Model",
        "Partnerships": "Partnerships",
        "Investment & Growth": "Investment & Growth",
        "Global Presence": "Global Presence",
        "Careers": "Careers",
        "Media & Press": "Media & Press"
      }
    },
    
    // --- DISPLAY & ROUTING ---
    status: {
      name: "Publish Status",
      dataType: "string",
      enumValues: {
        "Published": "Published",
        "Draft": "Draft"
      },
      defaultValue: "Published"
    },
    displayLocation: {
      name: "Display Location",
      dataType: "string",
      enumValues: {
        "Homepage": "Homepage",
        "FAQ Page Only": "FAQ Page Only"
        // Footer Snippet removed as requested
      },
      defaultValue: "FAQ Page Only"
    },
    displayOrder: { 
      name: "Sort Order", 
      dataType: "number", 
      defaultValue: 0,
      description: "Lower numbers appear first (e.g., 0, 1, 2...)"
    },
    featuredOnHome: { 
      name: "Featured FAQ (Legacy Toggle)", 
      dataType: "boolean", 
      defaultValue: false,
      description: "Quick toggle to push to the homepage."
    },
    
    // --- RELATIONS & SCHEMA ---
    relatedVenture: {
      name: "Related Venture",
      dataType: "reference",
      path: "ventures", 
      description: "Optional: Link this FAQ to a specific venture."
    },
    structuredDataToggle: {
      name: "Enable Auto Schema",
      dataType: "boolean",
      defaultValue: true,
      description: "Injects Google FAQPage Schema automatically."
    }
  }
});