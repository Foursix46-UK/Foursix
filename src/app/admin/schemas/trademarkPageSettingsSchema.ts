// Trademarks CMS — singleton page settings for /trademarks (foursix46.com).
// Follows the same singleton pattern as globalSettingsSchema.ts: permissions never allow
// create or delete, so editors can't spawn a second settings doc or remove the only one.
import { buildCollection, buildProperty } from "firecms";
import { getCachedRoleSync } from "@/lib/roles";
import { withAuditLogs } from "@/lib/auditLogger";

export const trademarkPageSettingsCollection = buildCollection({
  name: "Trademarks Page Settings",
  singularName: "Trademarks Page Settings",
  path: "trademarkPageSettings",
  permissions: ({ authController }) => {
    const userEmail = authController.user?.email;
    const role = userEmail ? getCachedRoleSync(userEmail) : null;

    if (role === "admin" || role === "editor") {
      return { edit: true, create: false, delete: false };
    }
    return { edit: false, create: false, delete: false };
  },
  callbacks: withAuditLogs("Trademarks Page Settings"),
  icon: "Settings",
  description: "Hero copy, FAQs and cross-site messaging for the /trademarks index page. One document.",
  properties: {
    pageTitle: { name: "Page Title", dataType: "string", validation: { required: true } },
    metaTitle: { name: "Meta Title", dataType: "string", validation: { required: true } },
    metaDescription: { name: "Meta Description", dataType: "string", multiline: true, validation: { required: true } },

    heroHeading: { name: "Hero Heading", dataType: "string", validation: { required: true } },
    heroBody: {
      name: "Hero Body",
      dataType: "string",
      markdown: true,
      validation: { required: true },
      description: "The two lede paragraphs under the hero heading.",
    },

    whyHeading: { name: "Why-section Heading", dataType: "string" },
    whyIntro: { name: "Why-section Intro", dataType: "string", multiline: true },
    whyColumns: {
      name: "Why Columns",
      dataType: "array",
      of: buildProperty({
        dataType: "map",
        properties: {
          heading: { name: "Heading", dataType: "string", validation: { required: true } },
          body: { name: "Body", dataType: "string", multiline: true, validation: { required: true } },
        },
      }),
      description: "Three by default, but not fixed at three.",
    },

    registerIntro: { name: "Register Intro", dataType: "string", multiline: true },
    registerFootnote: {
      name: "Register Footnote",
      dataType: "string",
      markdown: true,
      description: "The ™/® legal note shown under the register table.",
    },

    usageHeading: { name: "Usage-section Heading", dataType: "string" },
    usageIntro: { name: "Usage-section Intro", dataType: "string", multiline: true },
    usageRules: {
      name: "Usage Rules",
      dataType: "array",
      of: buildProperty({
        dataType: "map",
        properties: {
          lead: { name: "Lead", dataType: "string", validation: { required: true } },
          body: { name: "Body", dataType: "string", multiline: true, validation: { required: true } },
        },
      }),
    },
    usageCorrect: {
      name: "Usage — Correct Examples",
      dataType: "array",
      of: buildProperty({ dataType: "string" }),
    },
    usageIncorrect: {
      name: "Usage — Incorrect Examples",
      dataType: "array",
      of: buildProperty({ dataType: "string" }),
    },

    pageFaqs: {
      name: "Register-wide FAQs",
      dataType: "array",
      validation: { required: true, min: 1 },
      of: buildProperty({
        dataType: "map",
        properties: {
          question: { name: "Question", dataType: "string", validation: { required: true } },
          answer: { name: "Answer", dataType: "string", multiline: true, validation: { required: true } },
        },
      }),
    },

    crossSiteHeading: { name: "Cross-site Banner Heading", dataType: "string" },
    crossSiteBody: { name: "Cross-site Banner Body", dataType: "string", multiline: true },
    crossSiteUrl: { name: "Cross-site Banner URL", dataType: "string", url: true },
  },
});
