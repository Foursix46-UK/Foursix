// Trademarks CMS — jurisdiction reference collection.
// Adding a country later means adding one row here. Nothing else in the trademark
// schema needs to change.
import { buildCollection, buildProperty } from "firecms";
import { getCachedRoleSync } from "@/lib/roles";
import { withAuditLogs } from "@/lib/auditLogger";

export const jurisdictionsCollection = buildCollection({
  name: "Trademark Jurisdictions",
  singularName: "Jurisdiction",
  path: "jurisdictions",
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
  callbacks: withAuditLogs("Trademark Jurisdictions"),
  icon: "Public",
  description: "A country's trademark registry — one row per office, referenced by every mark filed there.",
  defaultSize: "m",
  properties: {
    countryName: {
      name: "Country Name",
      dataType: "string",
      validation: { required: true },
      description: "e.g. United Kingdom, India",
    },
    countryCode: {
      name: "Country Code",
      dataType: "string",
      validation: { required: true },
      description: "ISO alpha-2, e.g. GB, IN",
    },
    officeName: {
      name: "Office Name",
      dataType: "string",
      validation: { required: true },
      description: "e.g. Intellectual Property Office, Trade Marks Registry",
    },
    officeShort: {
      name: "Office Short Name",
      dataType: "string",
      validation: { required: true },
      description: "Short form used on buttons and pills, e.g. UK IPO",
    },
    officeUrl: {
      name: "Office URL",
      dataType: "string",
      url: true,
      validation: { required: true },
      description: "Registry search homepage.",
    },
    recordUrlPattern: {
      name: "Record URL Pattern",
      dataType: "string",
      description:
        "Deep-link template, e.g. https://example.gov/record/{application_number} — used to auto-build verify links where the registry supports it. Leave blank if deepLinkSupported is false.",
    },
    deepLinkSupported: {
      name: "Deep Link Supported",
      dataType: "boolean",
      validation: { required: true },
      defaultValue: true,
      description:
        "False for IP India — their public search is session-based, so the verify button must point at the search page with the application number shown beside it for manual entry, rather than a direct record link.",
    },
    symbolRuleNote: {
      name: "Symbol Rule Note",
      dataType: "string",
      multiline: true,
      description: "Jurisdiction-specific note on ® misuse, surfaced in the register footnote.",
    },
    sortOrder: {
      name: "Sort Order",
      dataType: "number",
      validation: { required: true },
      description: "Controls the order jurisdiction groups appear in on the register.",
    },
    registryStages: {
      name: "Registry Stages",
      dataType: "array",
      of: buildProperty({
        dataType: "map",
        properties: {
          stageName: {
            name: "Stage Name",
            dataType: "string",
            validation: { required: true },
          },
          stageDescription: {
            name: "Stage Description",
            dataType: "string",
            multiline: true,
          },
        },
      }),
      description:
        "The full sequence of stages a mark filed in this jurisdiction's registry can pass through, in order — this ordering IS the sequence (FireCMS arrays preserve entry order, so there is no separate order field). Drives the \"Where this application stands\" timeline on each mark's detail page: stages up to and including the mark's current status are shown as complete/current. e.g. for UK IPO: Filed → Examination → Published → Registered. For India: Filed → Formalities check passed → Examination → Publication in the Trade Marks Journal → Opposition period → Registered. Leave empty and the site falls back to its default generic sequence.",
    },
  },
});
