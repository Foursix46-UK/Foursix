// Trademarks CMS — main collection.
//
// One entry per mark. A word mark and a device mark for the same brand are two
// separate entries here — different numbers, different statuses, different protection.
//
// Scope note: the original spec (see docs shared by DC) models `mark_narrative` as its
// own collection keyed by (trademark, site) so foursix46.com and 46dc.com can carry
// different voice over the same registry facts. 46dc.com is out of scope for this build,
// so the narrative fields are flattened directly onto this record instead of a separate
// per-site collection. If 46dc.com trademark pages get built later, split `summary`
// through `ogImage` below out into a `markNarrativesCollection` keyed by site — the
// registry fields above them don't change.
//
// Legal note: there is deliberately NO `symbol` field here. Using ® on a mark that is not
// yet registered is an offence under the UK Trade Marks Act 1994 s.95 and India's Trade
// Marks Act 1999 s.107, so the ®/™ symbol is never something an editor sets — it is
// derived from `status` at render time (in the page code and JSON-LD builder), which
// makes the wrong symbol structurally impossible rather than just discouraged.
import { buildCollection, buildProperty } from "firecms";
import { getCachedRoleSync } from "@/lib/roles";
import { withAuditLogs } from "@/lib/auditLogger";

const MARK_TYPES = {
  "Word mark": "Word mark",
  "Device mark": "Device mark",
  "Combined mark": "Combined mark",
  "Series mark": "Series mark",
};

const FILING_TYPES = {
  "Single-class": "Single-class",
  "Multi-class": "Multi-class",
  "Separate applications per class": "Separate applications per class",
};

const IMAGE_BACKGROUNDS = {
  Light: "Light",
  Dark: "Dark",
  Transparent: "Transparent",
};

// Wording matches what each registry actually uses. Kept as one shared list so a
// per-class status (for separately filed marks) can't drift from the mark-level list.
const STATUS_OPTIONS = {
  Filed: "Filed",
  "Formalities check passed": "Formalities check passed",
  "Ready for examination": "Ready for examination",
  "Vienna codification": "Vienna codification",
  "Under examination": "Under examination",
  Objected: "Objected",
  Published: "Published",
  Opposed: "Opposed",
  Registered: "Registered",
  Lapsed: "Lapsed",
  Withdrawn: "Withdrawn",
  Refused: "Refused",
};

const NEEDS_IMAGE = (markType?: string) => markType === "Device mark" || markType === "Combined mark";
const IS_PER_CLASS_FILING = (filingType?: string) => filingType === "Separate applications per class";

export const trademarksCollection = buildCollection({
  name: "Trademarks",
  singularName: "Trademark",
  path: "trademarks",
  permissions: ({ authController }) => {
    const userEmail = authController.user?.email;
    const role = userEmail ? getCachedRoleSync(userEmail) : null;

    if (role === "admin") {
      return { edit: true, create: true, delete: true };
    }
    if (role === "editor") {
      return { edit: true, create: true, delete: false };
    }
    return { edit: false, create: false, delete: false };
  },
  callbacks: withAuditLogs("Trademarks"),
  icon: "Verified",
  description: "Registered and pending trademarks held across the FourSix46 ecosystem.",
  defaultSize: "m",
  properties: {
    // --- Identity ---
    markName: {
      name: "Mark Name",
      dataType: "string",
      validation: { required: true },
      description: "e.g. FourSix46, Cinevenn, 46DOGS",
    },
    slug: {
      name: "Slug",
      dataType: "string",
      validation: { required: true },
      description:
        "Used at /trademarks/{slug}. Include the mark type where a brand has both a word and device mark, e.g. 46dogs-word-mark, 46dogs-device-mark.",
    },
    markType: {
      name: "Mark Type",
      dataType: "string",
      validation: { required: true },
      enumValues: MARK_TYPES,
    },
    markImage: buildProperty(({ values }) => ({
      name: "Mark Image (as filed)",
      dataType: "string",
      storage: {
        storagePath: "trademarks",
        acceptedFiles: ["image/*"],
        metadata: { cacheControl: "max-age=31536000" },
      },
      validation: { required: NEEDS_IMAGE(values.markType as string) },
      disabled:
        values.markType === "Word mark"
          ? { hidden: true, clearOnDisabled: true }
          : false,
      description:
        "Required for Device and Combined marks — the artwork exactly as filed, not a current logo variant. Word marks render the name as text, so this stays hidden for them.",
    })),
    markImageBg: buildProperty(({ values }) => ({
      name: "Specimen Background",
      dataType: "string",
      enumValues: IMAGE_BACKGROUNDS,
      disabled:
        values.markType === "Word mark"
          ? { hidden: true, clearOnDisabled: true }
          : false,
      description: "Tells the specimen box whether to sit the artwork on white or preserve its own field. The 46 Dogs badge is Dark.",
    })),
    venture: {
      name: "Venture",
      dataType: "reference",
      path: "ventures",
      description: "Leave empty for personally-held marks (e.g. 46DC, 46DOGS) that aren't tied to a venture.",
    },

    // --- Registry particulars ---
    jurisdiction: {
      name: "Jurisdiction",
      dataType: "reference",
      path: "jurisdictions",
      validation: { required: true },
    },
    proprietor: {
      name: "Proprietor",
      dataType: "reference",
      path: "proprietors",
      validation: { required: true },
      description: "Non-negotiable — every mark states its legal owner.",
    },
    filingType: {
      name: "Filing Type",
      dataType: "string",
      validation: { required: true },
      enumValues: FILING_TYPES,
      description:
        "Single-class / Multi-class use the mark-level application number below. Separate applications per class hides it — enter a number on each class instead (e.g. Cinevenn's four applications).",
    },
    applicationNumber: buildProperty(({ values }) => ({
      name: "Application Number",
      dataType: "string",
      validation: { required: !IS_PER_CLASS_FILING(values.filingType as string) },
      disabled: IS_PER_CLASS_FILING(values.filingType as string)
        ? { hidden: true, clearOnDisabled: true, disabledMessage: "Entered per class below for separate applications." }
        : false,
      description: "Mark-level application number.",
    })),
    registrationNumber: {
      name: "Registration Number",
      dataType: "string",
      description: "Where the office issues a separate registration number.",
    },
    filingDate: {
      name: "Filing Date",
      dataType: "date",
      validation: { required: true },
    },
    registrationDate: {
      name: "Registration Date",
      dataType: "date",
      description: "Leave empty until registered.",
    },
    renewalDue: {
      name: "Renewal Due",
      dataType: "date",
      description: "Internal only — never rendered on the site. UK and Indian marks both renew on a 10-year cycle.",
    },
    officialRecordUrl: {
      name: "Official Record URL",
      dataType: "string",
      url: true,
    },
    journalUrl: {
      name: "Journal URL",
      dataType: "string",
      url: true,
      description: "Where the mark was published, if applicable.",
    },

    // --- Status ---
    status: {
      name: "Status",
      dataType: "string",
      validation: { required: true },
      enumValues: STATUS_OPTIONS,
      description:
        "Drives the ®/™ symbol shown on the site (® only once this is Registered) — there is no separate field for the symbol, it is computed from this value.",
    },
    statusUpdated: {
      name: "Status Updated",
      dataType: "date",
      validation: { required: true },
      description: "Feeds the \"Register last updated\" line.",
    },
    statusNote: {
      name: "Status Note",
      dataType: "string",
      description: "Short line shown beside the status pill.",
    },

    // --- Classes (repeatable) ---
    trademarkClasses: {
      name: "Classes (Nice Classification)",
      dataType: "array",
      validation: { required: true, min: 1 },
      of: buildProperty({
        dataType: "map",
        properties: {
          classNumber: {
            name: "Class Number",
            dataType: "number",
            validation: { required: true, min: 1, max: 45 },
            description: "The real Nice class (1–45). Never enter 99 — that is a filing code, not a class.",
          },
          classHeading: {
            name: "Class Heading",
            dataType: "string",
            validation: { required: true },
            description: "The official Nice heading for this class.",
          },
          specification: {
            name: "Specification (as filed)",
            dataType: "string",
            multiline: true,
            validation: { required: true },
            description:
              "The exact wording as filed — never paraphrased or tidied. This is a legal instrument, not marketing copy.",
          },
          applicationNumber: {
            name: "Application Number (this class)",
            dataType: "string",
            description: "Required only when Filing Type is \"Separate applications per class\".",
          },
          classStatus: {
            name: "Class Status",
            dataType: "string",
            enumValues: STATUS_OPTIONS,
            description: "Only needed for separately filed marks. Leave blank to inherit the mark-level status.",
          },
        },
      }),
      description: "One block per class. A multi-class mark has several; each carries the same mark-level application number unless filed separately.",
    },

    // --- Narrative (flattened single-site fields — see file header) ---
    summary: {
      name: "Summary",
      dataType: "string",
      multiline: true,
      validation: { required: true },
      description: "The lede shown under the mark name.",
    },
    story: {
      name: "Story",
      dataType: "string",
      markdown: true,
      validation: { required: true },
      description: "\"Why this mark exists\" — 2–4 paragraphs.",
    },
    classNote: {
      name: "Class Note",
      dataType: "string",
      description: "Explains the filing structure, e.g. why Cinevenn has four application numbers.",
    },
    usageEnabled: {
      name: "Show Usage Rules",
      dataType: "boolean",
      defaultValue: false,
      description: "Device and combined marks only — shows the correct/incorrect usage block.",
    },
    usageIntro: buildProperty(({ values }) => ({
      name: "Usage Intro",
      dataType: "string",
      disabled: !values.usageEnabled ? { hidden: true, clearOnDisabled: true } : false,
    })),
    usageCorrect: buildProperty(({ values }) => ({
      name: "Usage — Correct",
      dataType: "string",
      multiline: true,
      disabled: !values.usageEnabled ? { hidden: true, clearOnDisabled: true } : false,
    })),
    usageIncorrect: buildProperty(({ values }) => ({
      name: "Usage — Incorrect",
      dataType: "string",
      multiline: true,
      disabled: !values.usageEnabled ? { hidden: true, clearOnDisabled: true } : false,
    })),
    faqs: {
      name: "FAQs",
      dataType: "array",
      validation: { required: true, min: 1 },
      of: buildProperty({
        dataType: "map",
        properties: {
          question: { name: "Question", dataType: "string", validation: { required: true } },
          answer: { name: "Answer", dataType: "string", multiline: true, validation: { required: true } },
        },
      }),
      description: "4–6 per mark. Feeds the page's FAQPage schema.",
    },
    metaTitle: {
      name: "Meta Title",
      dataType: "string",
      validation: { required: true },
      description: "Pattern: {mark_name}{symbol} Trademark — {jurisdiction} — FourSix46",
    },
    metaDescription: {
      name: "Meta Description",
      dataType: "string",
      multiline: true,
      validation: { required: true },
    },
    ogImage: {
      name: "Social Share Image",
      dataType: "string",
      storage: {
        storagePath: "trademarks/og",
        acceptedFiles: ["image/*"],
      },
      description: "Falls back to the mark image, then a generated card, if left empty.",
    },

    // --- Display control ---
    isPrimary: {
      name: "Primary Mark",
      dataType: "boolean",
      defaultValue: false,
      description: "The one mark shown in the index page's hero certificate panel. Keep this true on exactly one record.",
    },
    sortOrder: {
      name: "Sort Order",
      dataType: "number",
      description: "Order within its jurisdiction group on the register.",
    },
    showOnParent: {
      name: "Show on foursix46.com",
      dataType: "boolean",
      defaultValue: true,
    },
    showOnFounder: {
      name: "Show on 46dc.com",
      dataType: "boolean",
      defaultValue: true,
      description: "Reserved for when the 46dc.com trademarks section is built — has no effect yet.",
    },
  },
});
