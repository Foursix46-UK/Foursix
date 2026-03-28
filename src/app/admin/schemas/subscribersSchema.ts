import { buildCollection } from "firecms";

export const subscribersCollection = buildCollection({
  name: "Newsletter Subscribers",
  singularName: "Subscriber",
  path: "subscribers",
  icon: "Email",
  group: "User Data",
  description: "Log of users who requested to join the newsletter. (Actual active status is managed in Brevo).",
  permissions: ({ user }) => ({ edit: true, create: false, delete: true }),
  properties: {
    email: { name: "Email Address", dataType: "string", validation: { required: true } },
    consent: { name: "GDPR Consent Given", dataType: "boolean" },
    status: { 
      name: "Status", 
      dataType: "string", 
      enumValues: { pending: "Pending Confirmation", active: "Active" },
      defaultValue: "pending"
    },
    source: { name: "Signup Source", dataType: "string" },
    ipAddress: { name: "IP Address", dataType: "string" },
    subscribedAt: { name: "Date Subscribed", dataType: "date", autoValue: "on_create" }
  }
});