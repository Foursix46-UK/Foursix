import { buildCollection } from "firecms";
import { getCachedRoleSync } from "@/lib/roles";
import { withAuditLogs } from "@/lib/auditLogger";
import { TRADEMARKS_DEFAULTS as d } from "@/lib/trademarks-content";

/**
 * Trademarks page (/trademarks).
 *
 * Everything on the public page is edited here — nothing is hardcoded in the
 * component. The register is modelled as jurisdictions (UK IPO, India TMR) each
 * holding their own marks, which is how the page groups them.
 *
 * IMPORTANT: ® may only be shown once a registry has completed registration.
 * Marks still in examination must use ™. The "Status Type" field on each mark
 * drives that symbol automatically, so editors cannot accidentally publish ®
 * on a pending mark — doing so is an offence in both the UK and India.
 */
export const trademarksPageCollection = buildCollection({
  name: "Trademarks Page Settings",
  singularName: "Trademarks Page",
  path: "page_trademarks",
  icon: "VerifiedUser",
  group: "Website Pages",
  description:
    "Manage the /trademarks page: the register of marks, usage rules and FAQs. (Note: Only create ONE document in this collection).",
  permissions: ({ authController }) => {
    const userEmail = authController.user?.email;
    const role = userEmail ? getCachedRoleSync(userEmail) : null;

    if (role === "admin" || role === "editor") {
      return { edit: true, create: false, delete: false };
    }
    return { edit: false, create: false, delete: false };
  },
  callbacks: withAuditLogs("Trademarks Page"),
  properties: {
    // ── HERO ────────────────────────────────────────────────────────────────
    heroLabel: { name: "Hero Label", dataType: "string", defaultValue: "Trademarks" },
    heroTitle: {
      name: "Hero Title",
      dataType: "string",
      defaultValue: d.heroTitle,
    },
    heroLede1: {
      name: "Hero Paragraph 1",
      dataType: "string",
      multiline: true,
      defaultValue: d.heroLede1,
    },
    heroLede2: {
      name: "Hero Paragraph 2",
      dataType: "string",
      multiline: true,
      defaultValue: d.heroLede2,
    },

    // ── PRIMARY MARK CERTIFICATE ────────────────────────────────────────────
    certHeading: { name: "Certificate Heading", dataType: "string", defaultValue: "Primary mark" },
    certMark: { name: "Certificate — Mark", dataType: "string", defaultValue: "FourSix46" },
    certType: { name: "Certificate — Type", dataType: "string", defaultValue: "Word mark" },
    certNumber: { name: "Certificate — Number", dataType: "string", defaultValue: "UK00004301358" },
    certOffice: { name: "Certificate — Office", dataType: "string", defaultValue: "UK IPO" },
    certFiled: { name: "Certificate — Filed", dataType: "string", defaultValue: "26 Nov 2025" },
    certClasses: {
      name: "Certificate — Classes",
      dataType: "string",
      defaultValue: d.certClasses,
    },
    certStampTop: { name: "Stamp — Top Line", dataType: "string", defaultValue: "Registered" },
    certStampBottom: {
      name: "Stamp — Bottom Line",
      dataType: "string",
      defaultValue: d.certStampBottom,
    },

    // ── WHY WE REGISTER ─────────────────────────────────────────────────────
    whyTitle: {
      name: "Why Section — Title",
      dataType: "string",
      defaultValue: d.whyTitle,
    },
    whySubtitle: {
      name: "Why Section — Subtitle",
      dataType: "string",
      multiline: true,
      defaultValue: d.whySubtitle,
    },
    whyColumns: {
      name: "Why Section — Columns",
      dataType: "array",
      of: {
        dataType: "map",
        properties: {
          title: { name: "Column Title", dataType: "string", validation: { required: true } },
          body: { name: "Column Body", dataType: "string", multiline: true, validation: { required: true } },
        },
      },
      defaultValue: d.whyColumns,
    },

    // ── THE REGISTER ────────────────────────────────────────────────────────
    registerTitle: { name: "Register — Title", dataType: "string", defaultValue: "The register" },
    registerSubtitle: {
      name: "Register — Subtitle",
      dataType: "string",
      multiline: true,
      defaultValue: d.registerSubtitle,
    },
    jurisdictions: {
      name: "Register — Jurisdictions",
      dataType: "array",
      description:
        "One entry per registry office. Each holds its own list of marks; the count shown on the page is calculated automatically.",
      of: {
        dataType: "map",
        properties: {
          name: {
            name: "Jurisdiction Name",
            dataType: "string",
            validation: { required: true },
            description: "e.g. United Kingdom",
          },
          office: {
            name: "Registry Office",
            dataType: "string",
            description: "e.g. Intellectual Property Office",
          },
          marks: {
            name: "Marks",
            dataType: "array",
            of: {
              dataType: "map",
              properties: {
                name: { name: "Mark Name", dataType: "string", validation: { required: true } },
                kind: {
                  name: "Mark Kind",
                  dataType: "string",
                  defaultValue: "Word mark",
                  description: "e.g. Word mark, or Device mark — logo",
                },
                owner: {
                  name: "Proprietor",
                  dataType: "string",
                  description: "The name on the register, e.g. FOURSIX46 GLOBAL LTD",
                },
                statusType: {
                  name: "Status Type",
                  dataType: "string",
                  enumValues: {
                    registered: "Registered (shows ®)",
                    pending: "Pending / in examination (shows ™)",
                  },
                  defaultValue: "pending",
                  validation: { required: true },
                  description:
                    "Controls the ® or ™ symbol. Only set Registered once the registry has confirmed it — using ® early is an offence.",
                },
                statusLabel: {
                  name: "Status Label",
                  dataType: "string",
                  description:
                    "The exact wording from the registry, e.g. Registered, Formalities check passed, Ready for examination.",
                },
                applicationNumber: { name: "Application Number", dataType: "string" },
                classes: { name: "Classes", dataType: "string", description: "e.g. 25, 35, 39, 42, 43" },
                specimenImage: {
                  name: "Specimen — Logo Image",
                  dataType: "string",
                  storage: { storagePath: "trademarks/specimens", acceptedFiles: ["image/*"] },
                  description: "Upload for device/logo marks. Leave empty for word marks.",
                },
                recordUrl: { name: "View Record URL", dataType: "string", url: true },
                registryUrl: { name: "Registry URL", dataType: "string", url: true },
              },
            },
          },
        },
      },
      defaultValue: d.jurisdictions,
    },

    registerNote: {
      name: "Register — Footnote",
      dataType: "string",
      multiline: true,
      defaultValue: d.registerNote,
    },

    // ── USING OUR MARKS ─────────────────────────────────────────────────────
    usageTitle: { name: "Usage — Title", dataType: "string", defaultValue: "Using our marks" },
    usageSubtitle: {
      name: "Usage — Subtitle",
      dataType: "string",
      multiline: true,
      defaultValue: d.usageSubtitle,
    },
    usageRules: {
      name: "Usage — Rules",
      dataType: "array",
      of: {
        dataType: "map",
        properties: {
          lead: { name: "Rule (bold lead)", dataType: "string", validation: { required: true } },
          body: { name: "Rule Detail", dataType: "string", multiline: true },
        },
      },
      defaultValue: d.usageRules,
    },
    examplesHeading: {
      name: "Usage — Examples Heading",
      dataType: "string",
      defaultValue: d.examplesHeading,
    },
    usageExamples: {
      name: "Usage — Examples",
      dataType: "array",
      of: {
        dataType: "map",
        properties: {
          text: { name: "Example Text", dataType: "string", validation: { required: true } },
          correct: {
            name: "Is this correct usage?",
            dataType: "boolean",
            defaultValue: true,
            description: "On = shown with a tick. Off = shown struck through as incorrect.",
          },
        },
      },
      defaultValue: d.usageExamples,
    },

    // ── FAQ ─────────────────────────────────────────────────────────────────
    faqTitle: {
      name: "FAQ — Title",
      dataType: "string",
      defaultValue: d.faqTitle,
    },
    faqs: {
      name: "FAQ — Questions",
      dataType: "array",
      description:
        "Published as FAQPage structured data as well as shown on the page, so these can appear directly in Google results.",
      of: {
        dataType: "map",
        properties: {
          question: { name: "Question", dataType: "string", validation: { required: true } },
          answer: { name: "Answer", dataType: "string", multiline: true, validation: { required: true } },
        },
      },
      defaultValue: d.faqs,
    },

    // ── CROSS-LINK ──────────────────────────────────────────────────────────
    crossTitle: { name: "Cross-link — Title", dataType: "string", defaultValue: "Founder marks" },
    crossText: {
      name: "Cross-link — Text",
      dataType: "string",
      multiline: true,
      defaultValue: d.crossText,
    },
    crossButtonLabel: {
      name: "Cross-link — Button Label",
      dataType: "string",
      defaultValue: d.crossButtonLabel,
    },
    crossButtonUrl: {
      name: "Cross-link — Button URL",
      dataType: "string",
      url: true,
      defaultValue: d.crossButtonUrl,
    },

    // ── PAGE FOOTNOTE ───────────────────────────────────────────────────────
    footerNote: {
      name: "Page Footnote — Left",
      dataType: "string",
      defaultValue: d.footerNote,
    },
    lastUpdated: {
      name: "Page Footnote — Right",
      dataType: "string",
      defaultValue: d.lastUpdated,
      description: "Update this whenever you change a record, so readers know how current the page is.",
    },

    // ── SEO ─────────────────────────────────────────────────────────────────
    seoTitle: {
      name: "SEO Meta Title",
      dataType: "string",
      defaultValue: d.seoTitle,
      description: "The title that appears in Google Search.",
    },
    seoDescription: {
      name: "SEO Meta Description",
      dataType: "string",
      multiline: true,
      defaultValue: d.seoDescription,
      description: "The short description below the title in Google Search.",
    },
  },
});
