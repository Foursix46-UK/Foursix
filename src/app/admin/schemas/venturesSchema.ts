//reference ventureschema
import { buildCollection, buildProperty } from "firecms";
import { getCachedRoleSync } from "@/lib/roles";
import { logAdminAction } from "@/lib/auditLogger";
import { withAuditLogs } from "@/lib/auditLogger";

export const venturesCollection = buildCollection({
  name: "Ventures",
  singularName: "Venture",
  path: "ventures",
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
  callbacks: withAuditLogs("Ventures"),
    
  icon: "BusinessCenter",
  properties: {
    // --- BASIC INFO ---
    title: { name: "Venture Name", dataType: "string", validation: { required: true }, defaultValue: "" },
    ventureSlug: { 
      name: "URL Slug", 
      dataType: "string", 
      description: "e.g., m-studio (no spaces)", 
      validation: { required: true },
      defaultValue: ""
    },
    ventureTagline: { name: "Tagline", dataType: "string", defaultValue: "" },
    desc: { name: "Short Description (Card View)", dataType: "string", defaultValue: "" },
    mission: { name: "Long Description / Mission", dataType: "string", multiline: true, defaultValue: "" },
    
    // --- MEDIA ---
    logo: { 
      name: "Venture Logo", 
      dataType: "string", 
      storage: { storagePath: "ventures/logos", acceptedFiles: ["image/*"] } 
    },
    heroImage: { 
      name: "Hero Image / Cover Visual", 
      dataType: "string", 
      storage: { storagePath: "ventures/hero", acceptedFiles: ["image/*"] } 
    },

    // --- METADATA ---
    industryCategory: { name: "Industry / Category", dataType: "string" },
    status: {
      name: "Status",
      dataType: "string",
      enumValues: {
        Active: "Active",
        Stealth: "Stealth",
        Archived: "Archived",
        "Coming Soon": "Coming Soon"
      }
    },
    launchYear: { name: "Launch Year", dataType: "number" },
    geography: { name: "Geography / Markets", dataType: "array", of: { dataType: "string" } },
    url: { name: "Website URL", dataType: "string", url: true },
    
    // --- TOGGLES & VISIBILITY LOGIC ---
    partOfBadgeToggle: { name: "Show 'FourSix46 Entity' Badge", dataType: "boolean", defaultValue: true },
    
    // 1. MASTER SWITCH
    visibilityToggle: { name: "Visible on Public Site (Master Switch)", dataType: "boolean", defaultValue: true },
    
    // 2. SUB SWITCH (Depends on Master Switch)
    displayOnHome: ({ values }) => buildProperty({
      name: "Display on Home Page Grid",
      dataType: "boolean",
      defaultValue: true,
      disabled: (values.visibilityToggle as any) === false ? {
        clearOnDisabled: true,
        disabledMessage: "Cannot display on home page because the venture is hidden from the entire site."
      } : false
    }),

    // --- ADDED: RELATIONAL DISPLAY TOGGLES ---
    showOperatingRegions: { name: "Show Operating Regions on Detail Page", dataType: "boolean", defaultValue: true },
    showRelatedNews: { name: "Show Related News on Detail Page", dataType: "boolean", defaultValue: true },
    showRelatedMagazines: { name: "Show Related Magazines on Detail Page", dataType: "boolean", defaultValue: true },

    // --- FRONTEND DESIGN PROPS ---
    displayOrder: { name: "Display Order", dataType: "number" },
    
    // 3. LAYOUT DROPDOWN (Depends on Sub Switch)
    size: ({ values }) => buildProperty({
      name: "Grid Size (Crucial for Layout)",
      dataType: "string",
      enumValues: { small: "Small (1x1)", wide: "Wide (2x1)", tall: "Tall (1x2)" },
      validation: { required: true },
      defaultValue: "small",
      disabled: (values.displayOnHome as any) === false || (values.visibilityToggle as any) === false ? {
        clearOnDisabled: false,
        disabledMessage: "Enable 'Display on Home Page' to set a grid size."
      } : false
    }),

    // --- ARRAYS & RELATIONS ---
    stats: {
      name: "Strategic Metrics",
      dataType: "array",
      of: buildProperty({
        dataType: "map",
        properties: {
          label: { name: "Stat Label", dataType: "string", description: "e.g., Active Projects" },
          value: { name: "Stat Value", dataType: "string", description: "e.g., 14 Cities" }
        }
      })
    },
    leadershipIds: {
      name: "Associated Leaders (IDs)",
      dataType: "array",
      of: { dataType: "string" },
      description: "Enter the slugs of the leaders associated with this venture."
    },

    // 👇 ADDED SEO FIELDS HERE 👇
    // --- SEO & META ---
    seoTitle: { 
      name: "SEO Meta Title", 
      dataType: "string", 
      description: "Optional: Override the default title for Google.",
      defaultValue: "" 
    },
    seoDescription: { 
      name: "SEO Meta Description", 
      dataType: "string", 
      description: "Optional: Override the default description for Google.",
      defaultValue: "" 
    }
  }
});