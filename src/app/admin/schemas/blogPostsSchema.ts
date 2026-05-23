// admin/schemas/blogPostsSchema.ts
// FireCMS collection for individual Blog Posts.
// Fields strictly match "Part 2 — CMS Fields > 1. Blog Post" from the spec PDF.

import { buildCollection, buildProperty } from "firecms";
import { getCachedRoleSync } from "@/lib/roles";
import { withAuditLogs } from "@/lib/auditLogger";

export const blogPostsCollection = buildCollection({
  name: "Blog Posts",
  singularName: "Blog Post",
  path: "blog_posts",
  icon: "Article",
  group: "Blog",
  description: "Create and manage all blog articles published on foursix46.com/blog.",

  // --- ROLE-BASED PERMISSIONS ---
  // Admins: full CRUD. Editors & Authors: create/edit but cannot delete.
  permissions: ({ authController }) => {
    const userEmail = authController.user?.email;
    const role = userEmail ? getCachedRoleSync(userEmail) : null;

    if (role === "admin") {
      return { edit: true, create: true, delete: true };
    }
    if (role === "editor" || role === "author") {
      return { edit: true, create: true, delete: false };
    }
    return { edit: false, create: false, delete: false };
  },

  // Audit trail — logs every create/update/delete to the auditLogs collection
  // ── AUDIT LOGS + AUTO-FILL MAGIC ──
  // ── AUDIT LOGS + AUTO-FILL MAGIC ──
  callbacks: {
    ...withAuditLogs("Blog Posts"),
    onPreSave: (props) => {
      const values = { ...props.values };
      
      // Tell TypeScript these are definitely strings
      const titleStr = typeof values.title === 'string' ? values.title : '';
      const standfirstStr = typeof values.standfirst === 'string' ? values.standfirst : '';
      
      // Auto-generate Slug if empty
      if (!values.slug && titleStr) {
        values.slug = titleStr.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }
      
      // Auto-generate SEO Title if empty
      if (!values.seoTitle && titleStr) {
        values.seoTitle = titleStr.substring(0, 60);
      }
      
      // Auto-generate SEO Description from Standfirst if empty
      if (!values.seoDescription && standfirstStr) {
        values.seoDescription = standfirstStr.substring(0, 160);
      }

      // Preserve your existing audit logs
      const audit = withAuditLogs("Blog Posts");
      if (audit.onPreSave) {
        return audit.onPreSave({ ...props, values });
      }
      
      return values;
    }
  },
  // Default sort: newest published date first
  initialSort: ["publishDate", "desc"],

  properties: {
    // ─────────────────────────────────────────────
    // CORE CONTENT
    // ─────────────────────────────────────────────

    title: {
      name: "Title",
      dataType: "string",
      validation: {
        required: true,
        max: 120,
      },
      description: "The post headline. Max 120 chars.",
    },

    slug: {
      name: "Slug (URL)",
      dataType: "string",
      validation: { required: true },
      description:
        "Auto-fill from title; editable. Lowercase, hyphens only. Used as /blog/{slug}.",
    },

    standfirst: {
      name: "Standfirst / Deck",
      dataType: "string",
      multiline: true,
      validation: { max: 240 },
      description:
        "1–2 sentence summary shown under the title and on post cards. Max 240 chars.",
    },

    body: buildProperty({
      name: "Body (Rich Text)",
      dataType: "string",
      config: {
        richText: true,
      },
      description: "The article content. Use the toolbar for formatting.",
    }),


    // ─────────────────────────────────────────────
    // MEDIA
    // ─────────────────────────────────────────────

    coverImage: {
      name: "Cover Image",
      dataType: "string",
      validation: { required: true },
      storage: {
        storagePath: "blog/covers",
        acceptedFiles: ["image/*"],
        metadata: {
          cacheControl: "max-age=1000000",
        },
      },
      description:
        "Required. Hero image on the post page + thumbnail on cards. Add alt text below.",
    },

    coverImageAlt: {
      name: "Cover Image — Alt Text",
      dataType: "string",
      description: "Describe the image for accessibility and SEO.",
    },

    coverImageCaption: {
      name: "Cover Image — Caption",
      dataType: "string",
      description: "Optional caption shown below the image on the detail page.",
    },

    coverImageCredit: {
      name: "Cover Image — Photo Credit",
      dataType: "string",
      description: "e.g. 'Photo: Jane Doe / Unsplash'",
    },

    // Social / OG override image
    ogImage: {
      name: "Social Share Image (OG)",
      dataType: "string",
      storage: {
        storagePath: "blog/og",
        acceptedFiles: ["image/*"],
      },
      description:
        "Shown when shared on WhatsApp / LinkedIn / X. Falls back to Cover Image if empty.",
    },

    // ─────────────────────────────────────────────
    // TAXONOMY — References stored as string IDs/slugs
    // ─────────────────────────────────────────────

    // Single category reference (stored as the category document ID)
    categoryId: {
      name: "Category",
      dataType: "reference", // 👈 Changed from "string" to "reference"
      path: "blog_categories", // 👈 Points to your categories collection
      description: "Pick one category from the dropdown.",
    },

    tagIds: {
      name: "Tags",
      dataType: "array",
      of: { 
        dataType: "reference", 
        path: "blog_tags" 
      },
      description: "Pick or type any number of tags.",
    },

    authorIds: {
      name: "Author(s)",
      dataType: "array",
      of: { 
        dataType: "reference", 
        path: "blog_authors" 
      },
      validation: { min: 1 },
      description: "At least one required. First author is the primary.",
    },

    // ─────────────────────────────────────────────
    // PUBLISHING CONTROLS
    // ─────────────────────────────────────────────

    status: {
      name: "Status",
      dataType: "string",
      enumValues: {
        draft: "Draft",
        scheduled: "Scheduled",
        published: "Published",
        archived: "Archived",
      },
      defaultValue: "draft",
      description:
        "Only 'Published' status is visible on the live site. Use 'Scheduled' to auto-publish.",
    },

    publishDate: {
      name: "Publish Date & Time",
      dataType: "date",
      mode: "date_time",
      description:
        "When it goes live. If set to a future date/time the post auto-publishes at that time.",
    },

    // ─────────────────────────────────────────────
    // FEATURE / PIN FLAGS
    // ─────────────────────────────────────────────

    featured: {
      name: "Featured Post",
      dataType: "boolean",
      defaultValue: false,
      description:
        "If ON, this post becomes the large hero card at the top of /blog. Only one post should be featured at a time.",
    },

    pinned: {
      name: "Pinned Post",
      dataType: "boolean",
      defaultValue: false,
      description:
        "If ON, this post stays at the top of its category page.",
    },

    // ─────────────────────────────────────────────
    // READING TIME
    // ─────────────────────────────────────────────

    readingTime: {
      name: "Reading Time (minutes)",
      dataType: "number",
      description:
        "Auto-calculated from word count by the frontend. Editor can override here.",
    },

    // ─────────────────────────────────────────────
    // RELATED POSTS (editor-picked)
    // ─────────────────────────────────────────────

    relatedPostIds: {
      name: "Related Posts (Editor-Picked)",
      dataType: "array",
      of: { 
        dataType: "reference", 
        path: "blog_posts" 
      },
      description: "Optional. Select up to 3 related posts from the dropdown.",
    },

    // ─────────────────────────────────────────────
    // SEO & META
    // ─────────────────────────────────────────────

    seoTitle: {
      name: "SEO Meta Title",
      dataType: "string",
      validation: { max: 60 },
      description:
        "For Google. Falls back to the Post Title if empty. Max 60 chars.",
    },

    seoDescription: {
      name: "SEO Meta Description",
      dataType: "string",
      multiline: true,
      validation: { max: 160 },
      description:
        "For Google. Falls back to Standfirst if empty. Max 160 chars.",
    },
  },
});