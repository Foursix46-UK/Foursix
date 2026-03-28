import { buildCollection } from "firecms";

export const legalCollection = buildCollection({
  name: "Legal Pages Settings",
  singularName: "Legal Pages",
  path: "page_legal",
  icon: "Gavel",
  group: "Website Pages",
  description: "Manage the actual text content for your Privacy Policy, Terms, and Cookie pages.",
  permissions: ({ user }) => ({ edit: true, create: true, delete: false }),
  properties: {
    privacyPolicy: { 
      name: "Privacy Policy Content", 
      dataType: "string", 
      markdown: true, // This gives the client a nice rich-text editor in FireCMS!
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
    }
  }
});