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
  description: "Coverage shown on /press. Only entries with status Published appear on the site, and the page updates as soon as an entry is saved.",
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
      description:
        "Sets the card label: Interview \"Interview on [Outlet]\", Profile \"Contributor at [Outlet]\", Article \"Article in [Outlet]\", Feature \"Featured in [Outlet]\". Interviews are listed under the Interviews heading, everything else under Coverage.",
    },
    paidOrSponsored: {
      name: "Paid or sponsored",
      dataType: "boolean",
      defaultValue: false,
      description:
        "Tick for paid, sponsored or contributor placements. The card will never say \"Featured in\": it shows \"Interview on\" for Interviews and \"Writes for\" for everything else, whatever the Media Type.",
    },
    buttonLabel: {
      name: "Button label",
      dataType: "string",
      description: "Text on the card button. Leave empty for the default: \"Read article\", or \"View profile\" when the Media Type is Profile.",
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
      description: "Shows the \"Featured\" badge on the card. The badge appears only while this is switched on.",
    },
    showOnHomepage: {
      name: "Show in homepage \"As featured in\"",
      dataType: "boolean",
      defaultValue: true,
      description:
        "Adds this outlet to the \"As featured in\" strip on the homepage (Published entries only). Paid or sponsored entries never appear there, because the strip says \"featured in\". Each outlet appears once; upload an Outlet Logo to show the logo instead of the name.",
    },
    sortOrder: {
      name: "Sort Order",
      dataType: "number",
      defaultValue: 0,
      description: "Entries are listed newest first by Publication Date. This only breaks ties between entries published on the same day (lower first).",
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
