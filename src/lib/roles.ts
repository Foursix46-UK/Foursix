import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type UserRole = "admin" | "editor" | "author";

// A small memory cache so we don't spam Firebase with read requests!
const roleCache = new Map<string, UserRole>();

export async function getUserRole(email: string): Promise<UserRole | null> {
  // If we already looked them up this session, return it instantly
  if (roleCache.has(email)) return roleCache.get(email)!;

  try {
    // Look them up in the Firestore database
    const q = query(collection(db, "system_admins"), where("email", "==", email));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const role = snapshot.docs[0].data().role as UserRole;
      roleCache.set(email, role); // Save to cache
      return role;
    }
  } catch (error) {
    console.error("Error fetching user role:", error);
  }

  return null; // Not found in database
}
export function getCachedRoleSync(email: string): UserRole | null {
  return roleCache.get(email) || null;
}