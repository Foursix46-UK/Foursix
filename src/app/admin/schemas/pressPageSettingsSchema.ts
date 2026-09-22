// Press page settings — singleton for /press. Same pattern as the other page settings
// collections: editors can edit the one document but never create or delete it. The
// document is created automatically on admin login (see ensureSingleton).
import { buildCollection } from "firecms";
import { getCachedRoleSync } from "@/lib/roles";
import { withAuditLogs } from "@/lib/auditLogger";

export const pressPageSettingsCollection = buildCollection({
  name: "Press Page Settings",
  singularName: "Press Page Settings",
  path: "pressPageSettings",
  icon: "Settings",
  group: "Website Pages",
  description: "Hero, media kit, contact block and SEO for /press. One document.",
  permissions: ({ authController }) => {
    const userEmail = authController.user?.email;
    const role = userEmail ? getCachedRoleSync(userEmail) : null;

    if (role === "admin" || role === "editor") return { edit: true, create: false, delete: false };
    return { edit: false, create: false, delete: false };
  },
  callbacks: withAuditLogs("Press Page Settings"),
  properties: {
    title: { name: "Page Title", dataType: "string", validation: { required: true } },
    subtitle: { name: "Eyebrow Label", dataType: "string", description: "Small label above the title." },
    description: { name: "Intro", dataType: "string", multiline: true },
    heroBackground: {
      name: "Hero Background Image",
      dataType: "string",
      storage: { storagePath: "press/hero", acceptedFiles: ["image/*"] },
    },

    mediaKitLabel: { name: "Media Kit Button Label", dataType: "string" },
    mediaKitUrl: {
      name: "Media Kit File",
      dataType: "string",
      storage: { storagePath: "press/media-kit", acceptedFiles: ["application/pdf", "application/zip", "image/*"] },
      description: "Upload a PDF or ZIP. The media kit block is hidden until a file is set.",
    },
    mediaAssetsTitle: { name: "Media Kit Heading", dataType: "string" },
    mediaAssetsDescription: { name: "Media Kit Description", dataType: "string", multiline: true },

    contactTitle: { name: "Contact Heading", dataType: "string" },
    contactSubtitle: { name: "Contact Eyebrow", dataType: "string" },
    contactDescription: { name: "Contact Description", dataType: "string", multiline: true },
    contactEmail: { name: "Press Email", dataType: "string", email: true },
    contactPhone: { name: "Press Phone", dataType: "string" },

    seoTitle: { name: "SEO Title", dataType: "string" },
    seoDescription: { name: "SEO Description", dataType: "string", multiline: true },
    ogImage: {
      name: "Social Share Image",
      dataType: "string",
      storage: { storagePath: "press/og", acceptedFiles: ["image/*"] },
    },
  },
});
