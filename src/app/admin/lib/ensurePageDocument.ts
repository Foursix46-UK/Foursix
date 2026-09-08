// ─────────────────────────────────────────────────────────────────────────────
// Create a page's singleton CMS document if it does not exist yet.
//
// Firestore rules allow public reads but reject unauthenticated writes, so a
// page's first document cannot be created by a build step, a seed script or the
// server — only by a signed-in admin. This runs in the browser once an admin has
// authenticated in the CMS, which is the only context where the write is allowed.
//
// It is idempotent: if any document already exists in the collection it does
// nothing, so an admin's edits are never overwritten on a later login.
// ─────────────────────────────────────────────────────────────────────────────

import { collection, getDocs, addDoc, serverTimestamp, limit, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

/** Firestore rejects `undefined`; optional CMS fields are omitted instead. */
export function stripUndefined<T>(value: T): T {
  if (Array.isArray(value)) return value.map(stripUndefined) as unknown as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, stripUndefined(v)])
    ) as T;
  }
  return value;
}

export type EnsureResult =
  | { created: false; reason: "exists" | "error"; id?: string; error?: unknown }
  | { created: true; id: string };

export async function ensurePageDocument(
  collectionName: string,
  defaults: Record<string, unknown>
): Promise<EnsureResult> {
  try {
    const existing = await getDocs(query(collection(db, collectionName), limit(1)));
    if (!existing.empty) {
      return { created: false, reason: "exists", id: existing.docs[0].id };
    }

    const ref = await addDoc(collection(db, collectionName), {
      ...stripUndefined(defaults),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { created: true, id: ref.id };
  } catch (error) {
    // A non-admin signing in will be rejected by the rules. That is expected and
    // must not break the CMS shell, so this never throws.
    return { created: false, reason: "error", error };
  }
}
