// ─────────────────────────────────────────────────────────────────────────────
// Seed the Trademarks collections on first admin login.
//
// Firestore rules allow public reads but reject unauthenticated writes, so these
// documents cannot be created by a build step, a seed script or the server —
// only from a browser session signed in as an admin. This runs once the CMS has
// authenticated, which is the only context where the write is permitted.
//
// Order matters: proprietors and jurisdictions are written first because each
// trademark stores a real DocumentReference to them, not a copied string. That
// is what lets a proprietor be renamed, or a mark assigned to a new entity,
// without touching any mark record.
//
// Idempotent throughout — a collection that already holds documents is skipped,
// so an editor's changes are never overwritten on a later login.
// ─────────────────────────────────────────────────────────────────────────────

import {
  collection,
  getDocs,
  addDoc,
  doc,
  setDoc,
  serverTimestamp,
  limit,
  query,
  DocumentReference,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  PROPRIETOR_SEED,
  JURISDICTION_SEED,
  TRADEMARK_SEED,
  TRADEMARK_PAGE_SETTINGS_SEED,
} from "@/lib/trademarks-seed";

/** Firestore rejects `undefined`; optional CMS fields are omitted instead. */
function stripUndefined<T>(value: T): T {
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

async function isEmpty(collectionName: string): Promise<boolean> {
  const snap = await getDocs(query(collection(db, collectionName), limit(1)));
  return snap.empty;
}

/**
 * Writes each seed row at a known document id so the reference wiring below is
 * deterministic, and returns id -> DocumentReference for the trademark writes.
 */
async function seedReferenceCollection(
  collectionName: string,
  rows: ReadonlyArray<Record<string, any> & { key: string }>
): Promise<Record<string, DocumentReference>> {
  const refs: Record<string, DocumentReference> = {};

  for (const row of rows) {
    const { key, ...fields } = row;
    const ref = doc(db, collectionName, key);
    refs[key] = ref;
    await setDoc(
      ref,
      { ...stripUndefined(fields), createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { merge: true }
    );
  }

  return refs;
}

export type SeedResult = {
  created: string[];
  skipped: string[];
  error?: unknown;
};

export async function ensureTrademarkData(): Promise<SeedResult> {
  const created: string[] = [];
  const skipped: string[] = [];

  try {
    // Reference data is written with merge:true at fixed ids, so re-running
    // restores a row an editor deleted by accident without duplicating any.
    const proprietorRefs = await seedReferenceCollection(
      "proprietors",
      PROPRIETOR_SEED as unknown as Array<Record<string, any> & { key: string }>
    );
    const jurisdictionRefs = await seedReferenceCollection(
      "jurisdictions",
      JURISDICTION_SEED as unknown as Array<Record<string, any> & { key: string }>
    );
    created.push("proprietors", "jurisdictions");

    // The marks themselves are only written when the collection is empty —
    // these carry editor-authored narrative, so a re-run must never clobber it.
    if (await isEmpty("trademarks")) {
      for (const mark of TRADEMARK_SEED) {
        const { key, proprietorKey, jurisdictionKey, ...fields } = mark as any;
        await setDoc(doc(db, "trademarks", key), {
          ...stripUndefined(fields),
          proprietor: proprietorRefs[proprietorKey],
          jurisdiction: jurisdictionRefs[jurisdictionKey],
          showOnParent: true,
          showOnFounder: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      created.push(`trademarks (${TRADEMARK_SEED.length})`);
    } else {
      skipped.push("trademarks");
    }

    if (await isEmpty("trademarkPageSettings")) {
      await addDoc(collection(db, "trademarkPageSettings"), {
        ...stripUndefined(TRADEMARK_PAGE_SETTINGS_SEED),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      created.push("trademarkPageSettings");
    } else {
      skipped.push("trademarkPageSettings");
    }

    return { created, skipped };
  } catch (error) {
    // A non-admin signing in will be rejected by the rules. That is expected and
    // must not break the CMS shell, so this never throws.
    return { created, skipped, error };
  }
}
