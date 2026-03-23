import { buildCollection, buildProperty } from "firecms";

export const leadershipCollection = buildCollection({
  name: "Leadership",
  singularName: "Leader",
  path: "leadership",
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
    }
  }
});