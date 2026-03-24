import { buildCollection, buildProperty } from "firecms";

export const globalCollection = buildCollection({
  name: "Global Presence",
  singularName: "Location",
  path: "global",
  icon: "Public",
  properties: {
    // --- BASIC INFO ---
    country: { name: "Country", dataType: "string", validation: { required: true }, defaultValue: "" },
    cityRegion: { name: "City / Region", dataType: "string", validation: { required: true }, defaultValue: "" },
    slug: { 
      name: "URL Slug", 
      dataType: "string", 
      description: "e.g., singapore (no spaces, used for the URL)", 
      validation: { required: true },
      defaultValue: ""
    },
    
    // --- METADATA ---
    status: {
      name: "Status",
      dataType: "string",
      enumValues: {
        "Live": "Live",
        "Planned": "Planned",
        "Research": "Research"
      },
      validation: { required: true },
      defaultValue: "Live"
    },
    yearEntered: { 
      name: "Year Entered / Target Year", 
      dataType: "string", 
      description: "e.g., 2024",
      defaultValue: "" 
    },

    // --- DESCRIPTIONS ---
    marketDescription: { 
      name: "Short Market Description", 
      dataType: "string", 
      description: "Appears on the main Global map page.",
      defaultValue: "" 
    },
    longDescription: { 
      name: "Detailed Market Analysis", 
      dataType: "string", 
      multiline: true,
      description: "Appears on the dedicated regional detail page.",
      defaultValue: "" 
    },

    // --- FIX: SAFE VENTURE MAPPING ---
    ventures: {
      name: "Ventures Operating Here",
      dataType: "array",
      of: buildProperty({
        dataType: "map",
        properties: {
          name: { name: "Venture Name (Display)", dataType: "string", description: "e.g., M-Studio" },
          slug: { name: "Venture Slug (Link)", dataType: "string", description: "e.g., m-studio" }
        }
      })
    },

    // --- MEDIA & MAP DATA ---
    flag: { 
      name: "Emoji Flag", 
      dataType: "string", 
      description: "Paste an emoji here! e.g., 🇸🇬",
      defaultValue: ""
    },
    regionIcon: { 
      name: "Region Photo / Icon", 
      dataType: "string", 
      storage: { storagePath: "global/photos", acceptedFiles: ["image/*"] } 
    },
    mapCoordinates: {
      name: "Map Coordinates (For 3D Globe)",
      dataType: "map",
      properties: {
        lat: { name: "Latitude", dataType: "number", description: "e.g., 1.3521" },
        lng: { name: "Longitude", dataType: "number", description: "e.g., 103.8198" }
      }
    },

    // --- TOGGLES ---
    visibilityToggle: { name: "Visible on Public Site", dataType: "boolean", defaultValue: true },
    displayOrder: { name: "Display Order", dataType: "number", defaultValue: 0 }
  }
});