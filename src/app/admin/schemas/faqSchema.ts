import { buildCollection } from "firecms";

export const faqCollection = buildCollection({
  name: "FAQs",
  singularName: "FAQ",
  path: "faqs",
  icon: "QuestionAnswer",
  group: "Website Pages",
  properties: {
    question: { 
      name: "Question", 
      dataType: "string", 
      validation: { required: true } 
    },
    answer: { 
      name: "Answer", 
      dataType: "string", 
      multiline: true, 
      validation: { required: true } 
    },
    category: {
      name: "Category",
      dataType: "string",
      validation: { required: true },
      description: "Type the category name (e.g., 'General', 'Investment'). Exact spelling groups them together automatically."
    },
    featuredOnHome: { 
      name: "Display on Home Page?", 
      dataType: "boolean", 
      defaultValue: false,
      description: "Toggle on to show this FAQ on the main landing page."
    },
    displayOrder: { 
      name: "Display Order", 
      dataType: "number", 
      defaultValue: 0,
      description: "Lower numbers appear first (e.g., 0, 1, 2...)"
    }
  }
});