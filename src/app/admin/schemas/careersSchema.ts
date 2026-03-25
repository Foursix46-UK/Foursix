import { buildCollection } from "firecms";

export const careersCollection = buildCollection({
  name: "Careers & Jobs",
  singularName: "Job Posting",
  path: "careers",
  icon: "Work",
  group: "Ecosystem",
  properties: {
    title: { name: "Job Title", dataType: "string", validation: { required: true }, defaultValue: "" },
    departmentVenture: { name: "Department / Venture", dataType: "string", description: "e.g., M-Studio, FourSix46 Holding", defaultValue: "" },
    employmentType: {
      name: "Employment Type",
      dataType: "string",
      enumValues: {
        "Full-Time": "Full-Time",
        "Part-Time": "Part-Time",
        "Contract": "Contract",
        "Internship": "Internship"
      },
      defaultValue: "Full-Time"
    },
    location: { name: "Location", dataType: "string", description: "e.g., Remote / London, UK", defaultValue: "" },
    description: { name: "Job Description", dataType: "string", multiline: true, defaultValue: "" },
    
    responsibilities: { 
      name: "Responsibilities", 
      dataType: "array", 
      of: { dataType: "string" },
      description: "Press 'Add' for each new bullet point."
    },
    requirements: { 
      name: "Requirements", 
      dataType: "array", 
      of: { dataType: "string" },
      description: "Press 'Add' for each new bullet point."
    },
    
    // --- MUTUALLY EXCLUSIVE FIELDS (Using FireCMS Property Builders) ---
    applyUrl: ({ values }) => ({ 
      name: "Apply URL (Link)", 
      dataType: "string", 
      description: "External ATS link (e.g., https://...). This field locks if an Email is entered.",
      defaultValue: "",
      // Locks if applyEmail has any text
      disabled: Boolean(values?.applyEmail) 
    }),
    applyEmail: ({ values }) => ({
      name: "Apply Email",
      dataType: "string",
      description: "Direct email address (e.g., careers@foursix46.com). This field locks if a URL is entered.",
      defaultValue: "",
      // Locks if applyUrl has any text
      disabled: Boolean(values?.applyUrl) 
    }),
    // ------------------------------------------------------------------

    status: {
      name: "Status",
      dataType: "string",
      enumValues: {
        "Open": "Open",
        "Closed": "Closed"
      },
      defaultValue: "Open"
    },
    postedDate: { name: "Posted Date", dataType: "date", validation: { required: true } },
    referenceCode: { name: "Internal Reference Code", dataType: "string", description: "e.g., FS46-OP-01", defaultValue: "" }
  }
});