import { buildCollection } from "firecms";
import { getCachedRoleSync } from "@/lib/roles";

export const auditLogCollection = buildCollection({
    name: "Audit Logs",
    path: "audit_logs",
    icon: "History",
    group: "System",
    // Only Admins can see the history of who edited what
    permissions: ({ authController }) => {
        const userEmail = authController.user?.email;
        const role = userEmail ? getCachedRoleSync(userEmail) : null;
        return { 
            edit: false, 
            create: false, 
            delete: role === "admin" 
        };
    },
    properties: {
        timestamp: { name: "Time", dataType: "date" },
        user: { name: "User", dataType: "string" },
        action: { name: "Action", dataType: "string" },
        collection: { name: "Collection", dataType: "string" },
        entityId: { name: "Document ID", dataType: "string" }
    }
});