// src/lib/auditLogger.ts
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function logAdminAction(
    action: "CREATE" | "UPDATE" | "DELETE",
    userEmail: string,
    collectionName: string,
    documentId: string
) {
    try {
        await addDoc(collection(db, "audit_logs"), {
            action,
            user: userEmail || "Unknown User",
            collection: collectionName,
            entityId: documentId,
            timestamp: serverTimestamp(),
        });
    } catch (error) {
        console.error("Failed to write audit log:", error);
    }
}

// We return 'any' here to bypass strict TypeScript checking in individual schemas
export const withAuditLogs = (collectionName: string): any => ({
    onSaveSuccess: async (props: any) => {
        // 👇 FIX IS HERE: Added props.context.authController
        const userEmail = props.context?.authController?.user?.email || "System"; 
        
        // Check both FireCMS v2 and v3 syntax for "is it a new document?"
        const isNew = props.status === "new" || props.context?.isNew;
        const action = isNew ? "CREATE" : "UPDATE";
        const entityId = props.entity?.id || props.entityId || "Unknown ID";
        
        await logAdminAction(action, userEmail, collectionName, entityId);
    },
    onDeleteSuccess: async (props: any) => {
        // 👇 FIX IS HERE: Added props.context.authController
        const userEmail = props.context?.authController?.user?.email || "System";
        const entityId = props.entity?.id || props.entityId || "Unknown ID";
        
        await logAdminAction("DELETE", userEmail, collectionName, entityId);
    }
});