// Trademarks CMS — proprietor reference collection.
// The legally recorded owner of a mark. Kept separate from `trademark` so a mark can be
// reassigned to a different entity later (e.g. 46Dogs moving to a UK CIO) without touching
// the mark record itself — just relink the `proprietor` field.
import { buildCollection } from "firecms";
import { getCachedRoleSync } from "@/lib/roles";
import { withAuditLogs } from "@/lib/auditLogger";

export const proprietorsCollection = buildCollection({
  name: "Trademark Proprietors",
  singularName: "Proprietor",
  path: "proprietors",
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
  callbacks: withAuditLogs("Trademark Proprietors"),
  icon: "Badge",
  description: "The legal owner recorded on a trademark application — a company or an individual.",
  properties: {
    legalName: {
      name: "Legal Name (as recorded at the registry)",
      dataType: "string",
      validation: { required: true },
      description: "Exactly as filed. e.g. FOURSIX46 GLOBAL LTD, KOYYALAMUDI DINESH CHANDRA",
    },
    displayName: {
      name: "Display Name",
      dataType: "string",
      validation: { required: true },
      description: "Readable form used in prose. e.g. FourSix46 Global Ltd, Dinesh Koyyalamudi",
    },
    entityType: {
      name: "Entity Type",
      dataType: "string",
      validation: { required: true },
      enumValues: {
        Company: "Company",
        Individual: "Individual",
        Charity: "Charity",
        Trust: "Trust",
      },
    },
    registrationNumber: {
      name: "Registration Number",
      dataType: "string",
      description: "Companies House number, charity number, etc.",
    },
    registeredCountry: { name: "Registered Country", dataType: "string" },
    verifyUrl: {
      name: "Verify URL",
      dataType: "string",
      url: true,
      description: "Companies House record, or the founder's About page.",
    },
    bioShort: {
      name: "Short Bio",
      dataType: "string",
      description: "One line shown on the proprietor card on mark sub-pages.",
    },
  },
});
