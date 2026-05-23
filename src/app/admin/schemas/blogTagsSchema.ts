// admin/schemas/blogTagsSchema.ts
// FireCMS collection for Blog Tags.
// Fields match "Part 2 — CMS Fields > 3. Tag" from the spec PDF.

import { buildCollection } from "firecms";
import { getCachedRoleSync } from "@/lib/roles";
import { withAuditLogs } from "@/lib/auditLogger";

export const blogTagsCollection = buildCollection({
  name: "Blog Tags",
  singularName: "Blog Tag",
  path: "blog_tags",
  icon: "Tag",
  group: "Blog",
  description:
    "Free-form keywords, lighter than categories. Used as filter pills at the bottom of posts.",

  permissions: ({ authController }) => {
    const userEmail = authController.user?.email;
    const role = userEmail ? getCachedRoleSync(userEmail) : null;
    if (role === "admin") return { edit: true, create: true, delete: true };
    if (role === "editor" || role === "author")
      return { edit: true, create: true, delete: false };
    return { edit: false, create: false, delete: false };
  },

  callbacks: withAuditLogs("Blog Tags"),

  properties: {
    name: {
      name: "Name",
      dataType: "string",
      validation: { required: true, max: 30 },
      description: "Display name. Max 30 chars.",
    },

    slug: {
      name: "Slug (URL)",
      dataType: "string",
      validation: { required: true },
      description: "Used as /blog/tag/{slug}. Lowercase, hyphens.",
    },

    description: {
      name: "Description",
      dataType: "string",
      multiline: true,
      description: "Optional. Shown on the tag page header.",
    },
  },
});