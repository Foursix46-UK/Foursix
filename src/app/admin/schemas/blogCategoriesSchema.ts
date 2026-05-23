// admin/schemas/blogCategoriesSchema.ts
// FireCMS collection for Blog Categories.
// Fields match "Part 2 — CMS Fields > 2. Category" from the spec PDF.

import { buildCollection } from "firecms";
import { getCachedRoleSync } from "@/lib/roles";
import { withAuditLogs } from "@/lib/auditLogger";

export const blogCategoriesCollection = buildCollection({
  name: "Blog Categories",
  singularName: "Blog Category",
  path: "blog_categories",
  icon: "Label",
  group: "Blog",
  description:
    "Buckets that group posts (e.g. Ventures, Press, People, Insights). Category pills on the blog list page come from here.",

  permissions: ({ authController }) => {
    const userEmail = authController.user?.email;
    const role = userEmail ? getCachedRoleSync(userEmail) : null;
    if (role === "admin") return { edit: true, create: true, delete: true };
    if (role === "editor") return { edit: true, create: true, delete: false };
    return { edit: false, create: false, delete: false };
  },

  callbacks: withAuditLogs("Blog Categories"),
  initialSort: ["sortOrder", "asc"],

  properties: {
    name: {
      name: "Name",
      dataType: "string",
      validation: { required: true, max: 40 },
      description: "Display name. Max 40 chars.",
    },

    slug: {
      name: "Slug (URL)",
      dataType: "string",
      validation: { required: true },
      description: "Used as /blog/category/{slug}. Lowercase, hyphens.",
    },

    description: {
      name: "Description",
      dataType: "string",
      multiline: true,
      validation: { max: 280 },
      description:
        "Shown on the category page header. Max 280 chars.",
    },

    coverImage: {
      name: "Cover Image",
      dataType: "string",
      storage: {
        storagePath: "blog/category-banners",
        acceptedFiles: ["image/*"],
      },
      description: "Optional banner for the category page.",
    },

    // Hex color for the pill (e.g. '#FFD100')
    color: {
      name: "Pill Color (Hex)",
      dataType: "string",
      description:
        "Hex color for the category pill, e.g. #FFD100. Defaults to brand accent if empty.",
    },

    sortOrder: {
      name: "Sort Order",
      dataType: "number",
      description:
        "Controls the order of pills on the /blog page. Lower number = appears earlier.",
    },

    seoTitle: {
      name: "SEO Meta Title",
      dataType: "string",
      description:
        "Optional. Auto-generated from Name + Description if empty.",
    },

    seoDescription: {
      name: "SEO Meta Description",
      dataType: "string",
      multiline: true,
      description:
        "Optional. Auto-generated from Name + Description if empty.",
    },
  },
});