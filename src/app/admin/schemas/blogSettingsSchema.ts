// admin/schemas/blogSettingsSchema.ts
// Single settings doc + read-only newsletter signups.
// Newsletter provider fields removed — emails go straight to Firestore.

import { buildCollection } from "firecms";
import { getCachedRoleSync } from "@/lib/roles";
import { withAuditLogs } from "@/lib/auditLogger";

export const blogSettingsCollection = buildCollection({
  name: "Blog Settings",
  singularName: "Blog Settings",
  path: "blog_settings",
  icon: "Settings",
  group: "Blog",
  description: "Global blog settings. Edit once — controls page title, tagline, and footer.",

  permissions: ({ authController }) => {
    const userEmail = authController.user?.email;
    const role = userEmail ? getCachedRoleSync(userEmail) : null;
    if (role === "admin") return { edit: true, create: false, delete: false };
    return { edit: false, create: false, delete: false };
  },

  callbacks: withAuditLogs("Blog Settings"),

  properties: {
    blogPageTitle: {
      name: "Blog Page Title",
      dataType: "string",
      defaultValue: "Blog",
      description: "Shown as the H1 on /blog.",
    },
    blogPageTagline: {
      name: "Blog Page Tagline",
      dataType: "string",
      description: "Subheading shown under the title on /blog.",
    },
    defaultShareImage: {
      name: "Default Share Image",
      dataType: "string",
      storage: { storagePath: "blog/defaults", acceptedFiles: ["image/*"] },
      description: "Fallback OG image when a post has no cover or OG image.",
    },
    postsPerPage: {
      name: "Posts Per Page",
      dataType: "number",
      defaultValue: 12,
      description: "How many posts per grid page. Default 12.",
    },
    footerLatestPostCount: {
      name: "Footer — Latest Post Count",
      dataType: "number",
      defaultValue: 3,
      description: "How many recent post titles to show in the footer column. Default 3.",
    },
  },
});

// Read-only newsletter signups — admins view & export to CSV
export const blogNewsletterSignupsCollection = buildCollection({
  name: "Blog Newsletter Signups",
  singularName: "Newsletter Signup",
  path: "blog_newsletter_signups",
  icon: "Email",
  group: "Blog",
  description: "Auto-collected email signups. Read-only in the CMS — export via the Firebase console CSV export.",

  permissions: () => ({ edit: false, create: false, delete: false }),

  properties: {
    email: { name: "Email", dataType: "string", email: true },
    sourcePage: { name: "Source Page", dataType: "string" },
    signupDate: { name: "Signup Date", dataType: "date", mode: "date_time" },
    consentGiven: { name: "Consent Given", dataType: "boolean" },
  },
});