import { buildCollection } from "firecms";
// 👇 1. Import the sync cache reader we built
import { getCachedRoleSync } from "@/lib/roles"; 
import { withAuditLogs } from "@/lib/auditLogger";
export const adminUsersCollection = buildCollection({
    name: "System Admins",
    path: "system_admins",
    
    permissions: ({ authController }) => {
        // 👇 2. Get the user's email safely
        const userEmail = authController.user?.email;
        
        // 👇 3. Read instantly from our memory cache!
        const role = userEmail ? getCachedRoleSync(userEmail) : null;
        
        if (role === "admin") {
            return { edit: true, create: true, delete: true };
        }
        
        // Editors and Authors cannot edit the system admins!
        return { edit: false, create: false, delete: false }; 
    },
    callbacks: withAuditLogs("Admin Users"),

    properties: {
        email: {
            name: "Email Address",
            dataType: "string",
            email: true,
            validation: { required: true }
        },
        role: {
            name: "Role",
            dataType: "string",
            enumValues: {
                admin: "Admin (Full Access)",
                editor: "Editor (Cannot Delete)",
                author: "Author (Create/Edit Only)"
            },
            validation: { required: true }
        }
    }
});