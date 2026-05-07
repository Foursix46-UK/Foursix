import { buildCollection } from "firecms";
import { getCachedRoleSync } from "@/lib/roles";
import { withAuditLogs } from "@/lib/auditLogger";

export const subscribersCollection = buildCollection({
  name: "Newsletter Subscribers",
  singularName: "Subscriber",
  path: "subscribers",
  icon: "Email",
  group: "User Data",
  description: "Log of users who requested to join the newsletter. (Actual active status is managed in Brevo).",
  permissions: ({ authController }) => {
    const userEmail = authController.user?.email;
    const role = userEmail ? getCachedRoleSync(userEmail) : null;

    if (role === "admin") return { edit: true, create: false, delete: true };
    if (role === "editor") return { edit: true, create: false, delete: false };
    
    return { edit: false, create: false, delete: false }; // Authors blocked
},
callbacks: withAuditLogs("Subscribers"),

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