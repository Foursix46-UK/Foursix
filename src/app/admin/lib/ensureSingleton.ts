// Create a page-settings document if its collection is empty.
//
// Page-settings collections deny `create` in the CMS so editors can't make a second
// copy — which also means nobody can make the first one. Firestore rules reject
// unauthenticated writes, so it can't be seeded from a script either. This runs in
// the admin once a user has signed in, the one context where the write is allowed.
// Only ever writes into an empty collection, so it never overwrites an edit.
import { collection, getDocs, addDoc, serverTimestamp, limit, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function ensureSingleton(collectionName: string, defaults: Record<string, unknown>) {
  try {
    const existing = await getDocs(query(collection(db, collectionName), limit(1)));
    if (!existing.empty) return;
    await addDoc(collection(db, collectionName), {
      ...defaults,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch {
    // A signed-in user without write access is rejected by the rules. Expected, and
    // must not break the CMS shell.
  }
}
