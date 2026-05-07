import { buildCollection, buildProperty } from "firecms";
import { getCachedRoleSync } from "@/lib/roles";
import { withAuditLogs } from "@/lib/auditLogger";

export const leadershipCollection = buildCollection({
  name: "Leadership",
  singularName: "Leader",
  path: "leadership",
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
    callbacks: withAuditLogs("Leadership"),
  icon: "Group",
  properties: {
    // --- BASIC INFO ---
    fullName: { name: "Full Name", dataType: "string", validation: { required: true }, defaultValue: "" },
    slug: { 
      name: "URL Slug", 
      dataType: "string", 
      description: "e.g., julian-thorne (no spaces, used for the URL)", 
      validation: { required: true },
      defaultValue: ""
    },
    roleTitle: { name: "Role / Title", dataType: "string", validation: { required: true }, defaultValue: "" },
    
    // --- FIX: SPLIT NAME (DISPLAY) AND ID (LINKING) ---
    associatedVentureName: { 
      name: "Associated Venture Name (Display)", 
      dataType: "string", 
      description: "e.g., FourSix46, M-Studio. This is what the public sees.",
      defaultValue: "" 
    },
    associatedVentureSlug: { 
      name: "Associated Venture Slug (Link)", 
      dataType: "string", 
      description: "e.g., m-studio. Used to create the beautiful URL.",
      defaultValue: "" 
    },
    
    // --- BIOGRAPHY ---
    shortBio: { name: "Short Bio (Card View)", dataType: "string", defaultValue: "" },
    longBio: { 
      name: "Full Biography", 
      dataType: "string", 
      multiline: true, 
      description: "Use double line breaks to separate paragraphs.",
      defaultValue: "" 
    },
    
    // --- MEDIA ---
    profilePhoto: { 
      name: "Profile Photo", 
      dataType: "string", 
      storage: { storagePath: "leadership/photos", acceptedFiles: ["image/*"] } 
    },

    // --- METADATA & TOGGLES ---
    isActive: { 
      name: "Active Leader", 
      dataType: "boolean", 
      defaultValue: true,
      description: "Turn off to display the 'Alumni' badge."
    },
    featuredOnAboutPage: { 
      name: "Featured on About Page", 
      dataType: "boolean", 
      defaultValue: false 
    },
    displayOrder: { name: "Display Order", dataType: "number", defaultValue: 0 },

    // --- DYNAMIC SOCIAL LINKS ---
    socialLinks: {
      name: "Social & External Links",
      dataType: "array",
      of: buildProperty({
        dataType: "map",
        properties: {
          label: { name: "Link Label", dataType: "string", description: "e.g., Instagram, LinkedIn, Personal Site" },
          url: { name: "Full URL", dataType: "string", url: true }
        }
      })
    },
    seoTitle: { 
      name: "SEO Meta Title", 
      dataType: "string", 
      description: "Optional: Override the default Google title (e.g., 'Julian Thorne | CEO').",
      defaultValue: "" 
    },
    seoDescription: { 
      name: "SEO Meta Description", 
      dataType: "string", 
      description: "Optional: Override the default Google description.",
      defaultValue: "" 
    }
  }
});