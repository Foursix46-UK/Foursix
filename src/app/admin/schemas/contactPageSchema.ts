import { buildCollection } from "firecms";
import { getCachedRoleSync } from "@/lib/roles";
import { withAuditLogs } from "@/lib/auditLogger";

export const contactPageCollection = buildCollection({
  name: "Contact Page Settings",
  singularName: "Contact Page",
  path: "page_contact",
  icon: "ContactMail",
  group: "Website Pages",
  permissions: ({ authController }) => {
      const userEmail = authController.user?.email;
      const role = userEmail ? getCachedRoleSync(userEmail) : null;

      if (role === "admin" || role === "editor") {
          return { edit: true, create: false, delete: false }; 
      }
      return { edit: false, create: false, delete: false };
  },
  callbacks: withAuditLogs("Contact Page"),
  properties: {
    heroLabel: { name: "Hero Label", dataType: "string", defaultValue: "Engagement" },
    heroTitle: { name: "Hero Title", dataType: "string", defaultValue: "CONTACT" },
    
    formTitle: { name: "Form Title", dataType: "string", defaultValue: "Inquiry Form" },
    formSubtitle: { name: "Form Subtitle", dataType: "string", multiline: true, defaultValue: "Please provide the details of your request. Our strategic relations team will review and respond within 24 hours." },
    institutionalNote: { name: "Institutional Note", dataType: "string", multiline: true, defaultValue: "For institutional investment inquiries, please select 'Investment' in the form or contact our strategic relations lead directly at contact@foursix46.com." },
    
    directCommTitle: { name: "Direct Comm Title", dataType: "string", defaultValue: "Direct Communication" },
    generalEmail: { name: "General Email", dataType: "string", defaultValue: "contact@foursix46.com" },
    partnersEmail: { name: "Partners & Investment Email", dataType: "string", defaultValue: "partners@foursix46.com" },
    pressEmail: { name: "Press & Media Email", dataType: "string", defaultValue: "press@foursix46.com" },
    careersEmail: { name: "Careers & Talent Email", dataType: "string", defaultValue: "careers@foursix46.com" },
    phone: { name: "Phone Number", dataType: "string", defaultValue: "+44 0330 124 1966" },
    
    hubsTitle: { name: "Hubs Title", dataType: "string", defaultValue: "Strategic Hubs" },
    hubs: {
      name: "Strategic Hubs Locations",
      dataType: "array",
      of: {
        dataType: "map",
        properties: {
          city: { name: "City", dataType: "string" },
          role: { name: "Hub Role", dataType: "string" },
          address: { name: "Full Address", dataType: "string", multiline: true }
        }
      },
      defaultValue: [
        { city: "London", role: "Global Headquarters", address: "66 Paul Street, London, EC2A 4NA, United Kingdom" },
        { city: "New York", role: "Venture Capital & Media Hub", address: "250 Vesey St, New York, NY 10281, United States" },
        { city: "Tokyo", role: "Biophilic Systems Research", address: "1-5-1 Marunouchi, Chiyoda City, Tokyo 100-6510, Japan" }
      ]
    }
, // <-- Make sure there is a comma here!

    // 👇 ADD SEO FIELDS HERE
    seoTitle: { 
      name: "SEO Meta Title", 
      dataType: "string", 
      defaultValue: "Contact Us | FourSix46",
      description: "The title that appears in Google Search."
    },
    seoDescription: { 
      name: "SEO Meta Description", 
      dataType: "string", 
      defaultValue: "Contact FourSix46 for strategic partnerships, media inquiries, careers, or general information.",
      description: "The short description below the title in Google Search."
    }
  }
});