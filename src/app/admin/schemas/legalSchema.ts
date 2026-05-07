import { buildCollection } from "firecms";
import { getCachedRoleSync } from "@/lib/roles";
import { withAuditLogs } from "@/lib/auditLogger";

export const legalCollection = buildCollection({
  name: "Legal Pages Settings",
  singularName: "Legal Pages",
  path: "page_legal",
  icon: "Gavel",
  group: "Website Pages",
  description: "Manage the actual text content for your Privacy Policy, Terms, and Cookie pages.",
  permissions: ({ authController }) => {
    const userEmail = authController.user?.email;
    const role = userEmail ? getCachedRoleSync(userEmail) : null;

    if (role === "admin" || role === "editor") {
        return { edit: true, create: false, delete: false }; 
    }
    return { edit: false, create: false, delete: false };
  },
  callbacks: withAuditLogs("Legal Pages"),
  properties: {
    privacyPolicy: { 
      name: "Privacy Policy Content", 
      dataType: "string", 
      markdown: true,
      description: "Paste the privacy policy text here."
    },
    termsOfUse: { 
      name: "Terms of Service Content", 
      dataType: "string", 
      markdown: true 
    },
    cookiePolicy: { 
      name: "Cookie Policy Content", 
      dataType: "string", 
      markdown: true 
    },

    // 👇 ADDED: SEO Fields for all 3 pages
    privacySeoTitle: { name: "Privacy SEO Title", dataType: "string", defaultValue: "Privacy Policy | FourSix46" },
    privacySeoDesc: { name: "Privacy SEO Description", dataType: "string", defaultValue: "Read the FourSix46 Privacy Policy." },
    
    termsSeoTitle: { name: "Terms SEO Title", dataType: "string", defaultValue: "Terms of Service | FourSix46" },
    termsSeoDesc: { name: "Terms SEO Description", dataType: "string", defaultValue: "Read the FourSix46 Terms of Service." },
    
    cookieSeoTitle: { name: "Cookie SEO Title", dataType: "string", defaultValue: "Cookie Policy | FourSix46" },
    cookieSeoDesc: { name: "Cookie SEO Description", dataType: "string", defaultValue: "Read the FourSix46 Cookie Policy." }
  }
});