import { buildCollection } from "firecms";

export const galleryPageCollection = buildCollection({
  name: "Gallery Page Settings",
  singularName: "Gallery Page",
  path: "page_gallery",
  icon: "PhotoLibrary",
  group: "Website Pages",
  description: "Manage the text and images for the Gallery page. (Note: Only create ONE document in this collection).",
  
  permissions: ({ user }) => ({
    edit: true,
    create: false, // <-- UNLOCKED: Set to false after creating the first document!
    delete: false 
  }),
  
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
    }
  }
});