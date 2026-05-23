// admin/schemas/blogAuthorsSchema.ts
// FireCMS collection for Blog Authors.
// Fields match "Part 2 — CMS Fields > 4. Author" from the spec PDF.

import { buildCollection } from "firecms";
import { getCachedRoleSync } from "@/lib/roles";
import { withAuditLogs } from "@/lib/auditLogger";

export const blogAuthorsCollection = buildCollection({
  name: "Blog Authors",
  singularName: "Blog Author",
  path: "blog_authors",
  icon: "Person",
  group: "Blog",
  description: "People who write for the FourSix46 blog.",

  permissions: ({ authController }) => {
    const userEmail = authController.user?.email;
    const role = userEmail ? getCachedRoleSync(userEmail) : null;
    if (role === "admin") return { edit: true, create: true, delete: true };
    if (role === "editor") return { edit: true, create: true, delete: false };
    return { edit: false, create: false, delete: false };
  },

  callbacks: withAuditLogs("Blog Authors"),

  properties: {
    displayName: {
      name: "Display Name",
      dataType: "string",
      validation: { required: true, max: 40 },
      description: "How the byline reads. Max 40 chars.",
    },

    slug: {
      name: "Slug (URL)",
      dataType: "string",
      validation: { required: true },
      description: "Used as /blog/author/{slug}.",
    },

    avatar: {
      name: "Avatar",
      dataType: "string",
      storage: {
        storagePath: "blog/avatars",
        acceptedFiles: ["image/*"],
      },
      description: "Square image. Minimum 400×400 pixels.",
    },

    role: {
      name: "Role / Title",
      dataType: "string",
      description: "e.g. 'Partner, Ventures'",
    },

    shortBio: {
      name: "Short Bio",
      dataType: "string",
      multiline: true,
      validation: { max: 240 },
      description: "1–2 lines. Shown under articles. Max 240 chars.",
    },

    longBio: {
      name: "Long Bio (Rich Text)",
      dataType: "string",
      markdown: true,
      description: "Shown on the /blog/author/{slug} page.",
    },

    linkedinUrl: {
      name: "LinkedIn URL",
      dataType: "string",
      url: true,
      description: "Optional. Full URL e.g. https://linkedin.com/in/name",
    },

    twitterHandle: {
      name: "X / Twitter Handle",
      dataType: "string",
      description: "Without the @. Optional. e.g. 'the46dc'",
    },

    websiteUrl: {
      name: "Personal Website URL",
      dataType: "string",
      url: true,
      description: "Optional.",
    },

    email: {
      name: "Email",
      dataType: "string",
      email: true,
      description: "Optional. Displayed as a public mailto link on the author page.",
    },
  },
});