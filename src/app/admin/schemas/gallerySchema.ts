import { buildCollection } from "firecms";
import { getCachedRoleSync } from "@/lib/roles";
import { withAuditLogs } from "@/lib/auditLogger";

export const galleryPageCollection = buildCollection({
  name: "Gallery Page Settings",
  singularName: "Gallery Page",
  path: "page_gallery",
  icon: "PhotoLibrary",
  group: "Website Pages",
  description: "Manage the text and images for the Gallery page. (Note: Only create ONE document in this collection).",
  
  permissions: ({ authController }) => {
        const userEmail = authController.user?.email;
        const role = userEmail ? getCachedRoleSync(userEmail) : null;

        if (role === "admin" || role === "editor") {
            // Both can edit. Neither can create a second page or delete the existing one.
            return { edit: true, create: false, delete: false }; 
        }
        return { edit: false, create: false, delete: false };
    },
    callbacks: withAuditLogs("Gallery"),
  
  properties: {
    pageLabel: { 
      name: "Page Label", 
      dataType: "string", 
      defaultValue: "Visual Archive" 
    },
    pageTitle: { 
      name: "Page Title", 
      dataType: "string", 
      defaultValue: "The Gallery" 
    },
    images: {
      name: "Gallery Images",
      dataType: "array",
      of: {
        dataType: "map",
        properties: {
          imageRef: {
            name: "Upload Image",
            dataType: "string",
            storage: {
              storagePath: "gallery",
              acceptedFiles: ["image/*"]
            }
          },
          title: { 
            name: "Image Title / ID", 
            dataType: "string", 
            defaultValue: "GALLERY-1",
            description: "Shows up in small red text on hover."
          },
          description: { 
            name: "Description", 
            dataType: "string",
            description: "Shows up in white text on hover."
          }
        }
      }
    },
    seoTitle: { 
      name: "SEO Meta Title", 
      dataType: "string", 
      defaultValue: "Gallery | FourSix46",
      description: "The title that appears in Google Search."
    },
    seoDescription: { 
      name: "SEO Meta Description", 
      dataType: "string", 
      defaultValue: "A visual archive of the FourSix46 venture ecosystem.",
      description: "The short description below the title in Google Search."
    }
  }
});