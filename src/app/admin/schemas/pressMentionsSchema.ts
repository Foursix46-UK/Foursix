// Press & Media — one document per piece of coverage, shown on /press.
// Mirrors the 46dc.com press collection: headline, outlet, type, date, link, summary,
// pull quote, thumbnail, outlet logo and an optional downloadable asset.
import { buildCollection } from "firecms";
import { getCachedRoleSync } from "@/lib/roles";
import { withAuditLogs } from "@/lib/auditLogger";
import { PRESS_MEDIA_TYPES } from "@/lib/press-defaults";

export const pressMentionsCollection = buildCollection({
  name: "Press & Media",
  singularName: "Press Mention",
  path: "pressMentions",
  icon: "Campaign",
  group: "Website Content",
  description: "Coverage shown on /press. Only entries with status Published appear on the site.",
  permissions: ({ authController }) => {
    const userEmail = authController.user?.email;
    const role = userEmail ? getCachedRoleSync(userEmail) : null;

    if (role === "admin") return { edit: true, create: true, delete: true };
    if (role === "editor" || role === "author") return { edit: true, create: true, delete: false };
    return { edit: false, create: false, delete: false };
  },
  callbacks: withAuditLogs("Press & Media"),
  properties: {
    title: {
      name: "Headline",
      dataType: "string",
      validation: { required: true },
      description: "The article headline, as published by the outlet.",
    },
    outlet: {
      name: "Media Outlet",
      dataType: "string",
      validation: { required: true },
      description: "e.g. BBC News, The Guardian, Financial Times.",
    },
    mediaType: {
      name: "Media Type",
      dataType: "string",
      enumValues: Object.fromEntries(PRESS_MEDIA_TYPES.map((t) => [t, t])),
      defaultValue: "Article",
    },
    date: {
      name: "Publication Date",
      dataType: "date",
      validation: { required: true },
      description: "The date the outlet published the piece. Newest appears first.",
    },
    url: {
      name: "Article URL",
      dataType: "string",
      url: true,
      validation: { required: true },
      description: "Link to the original article on the outlet's site.",
    },
    description: {
      name: "Short Description",
      dataType: "string",
      multiline: true,
      description: "One or two sentences on what the piece covers.",
    },
    pullQuote: {
      name: "Pull Quote",
      dataType: "string",
      multiline: true,
      description: "Optional. A sentence quoted verbatim from the article.",
    },
    thumbnail: {
      name: "Cover / Thumbnail Image",
      dataType: "string",
      storage: {
        storagePath: "press/thumbnails",
        acceptedFiles: ["image/*"],
        metadata: { cacheControl: "max-age=1000000" },
      },
      description: "Shown beside the entry. Falls back to the outlet logo, then the outlet name.",
    },
    thumbnailAlt: {
      name: "Thumbnail Alt Text",
      dataType: "string",
      description: "Describes the image for screen readers. Falls back to the headline.",
    },
    outletLogo: {
      name: "Outlet Logo",
      dataType: "string",
      storage: {
        storagePath: "press/logos",
        acceptedFiles: ["image/*"],
        metadata: { cacheControl: "max-age=1000000" },
      },
      description: "Used when there is no thumbnail.",
    },
    downloadableAsset: {
      name: "Downloadable Asset",
      dataType: "string",
      storage: {
        storagePath: "press/assets",
        acceptedFiles: ["image/*", "application/pdf"],
      },
      description: "Optional. A PDF or image offered as a download alongside the link.",
    },
    featured: {
      name: "Featured",
      dataType: "boolean",
      defaultValue: false,
      description: "Featured entries are pinned above the rest.",
    },
    sortOrder: {
      name: "Sort Order",
      dataType: "number",
      defaultValue: 0,
      description: "Lower numbers first among entries with the same featured state. Ties sort by date, newest first.",
    },
    status: {
      name: "Status",
      dataType: "string",
      enumValues: { published: "Published", draft: "Draft" },
      defaultValue: "draft",
      validation: { required: true },
      description: "Drafts are saved but never shown on the site.",
    },
  },
});
