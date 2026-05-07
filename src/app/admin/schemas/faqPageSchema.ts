import { buildCollection } from "firecms";
import { getCachedRoleSync } from "@/lib/roles";
import { withAuditLogs } from "@/lib/auditLogger";

export const pageFaqCollection = buildCollection({
  name: "FAQ Page Settings",
  singularName: "FAQ Page Config",
  path: "page_faq",
  icon: "Settings",
  group: "Website Pages",
  description: "Global settings and SEO for the main FAQ page.",
  permissions: ({ authController }) => {
        const userEmail = authController.user?.email;
        const role = userEmail ? getCachedRoleSync(userEmail) : null;
        if (role === "admin" || role === "editor") {
    return { edit: true, create: false, delete: false }; 
}
        return { edit: false, create: false, delete: false };
    },
    callbacks: withAuditLogs("FAQ Page"),
  properties: {
    // You can add hero titles here later if you want!
    seoTitle: { 
      name: "SEO Meta Title", 
      dataType: "string", 
      defaultValue: "Intelligence & FAQ | FourSix46",
      validation: { required: true }
    },
    seoDescription: { 
      name: "SEO Meta Description", 
      dataType: "string", 
      defaultValue: "Comprehensive strategic clarity on our ventures, partnership models, and global infrastructure scaling.",
      validation: { required: true }
    }
  }
});