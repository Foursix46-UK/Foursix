"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Seed / restore the singleton `page_trademarks` document.
//
// Firestore rules (correctly) reject unauthenticated writes, so this document
// cannot be created by a build script or from the server. It has to be written
// by a signed-in admin. This view lives inside the CMS, so the write carries
// the current admin's credentials and passes the rules like any other edit.
//
// `@/lib/firebase` reuses the default Firebase app, which is the same one
// FireCMS signed in with — so the session here is the admin's session.
// ─────────────────────────────────────────────────────────────────────────────

import { useCallback, useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  setDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { TRADEMARKS_DEFAULTS } from "@/lib/trademarks-content";

const COLLECTION = "page_trademarks";

/** Firestore rejects `undefined`; optional CMS fields are simply omitted. */
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

type State =
  | { status: "checking" }
  | { status: "missing" }
  | { status: "exists"; id: string }
  | { status: "working" }
  | { status: "done"; id: string }
  | { status: "error"; message: string };

export default function SeedTrademarksView() {
  const [state, setState] = useState<State>({ status: "checking" });

  const check = useCallback(async () => {
    try {
      const snap = await getDocs(collection(db, COLLECTION));
      setState(
        snap.empty
          ? { status: "missing" }
          : { status: "exists", id: snap.docs[0].id }
      );
    } catch (error: any) {
      setState({ status: "error", message: error?.message ?? String(error) });
    }
  }, []);

  useEffect(() => {
    check();
  }, [check]);

  const payload = () => ({
    ...stripUndefined(TRADEMARKS_DEFAULTS),
    updatedAt: serverTimestamp(),
  });

  const create = async () => {
    setState({ status: "working" });
    try {
      const ref = await addDoc(collection(db, COLLECTION), {
        ...payload(),
        createdAt: serverTimestamp(),
      });
      setState({ status: "done", id: ref.id });
    } catch (error: any) {
      setState({ status: "error", message: error?.message ?? String(error) });
    }
  };

  const restore = async (id: string) => {
    if (
      !window.confirm(
        "This overwrites every field on the Trademarks page with the shipped defaults. Any edits you have made will be lost. Continue?"
      )
    )
      return;
    setState({ status: "working" });
    try {
      await setDoc(doc(db, COLLECTION, id), payload(), { merge: true });
      setState({ status: "done", id });
    } catch (error: any) {
      setState({ status: "error", message: error?.message ?? String(error) });
    }
  };

  const markCount = TRADEMARKS_DEFAULTS.jurisdictions.reduce(
    (total, jurisdiction) => total + jurisdiction.marks.length,
    0
  );

  return (
    <div style={wrap}>
      <h1 style={h1}>Trademarks page — set up content</h1>
      <p style={p}>
        This writes the Trademarks page content into Firestore as a normal CMS
        document, so <strong>Website Pages → Trademarks Page Settings</strong>{" "}
        edits it and the public page reflects your changes.
      </p>
      <p style={pMuted}>
        It creates one document in <code style={code}>{COLLECTION}</code>{" "}
        containing {TRADEMARKS_DEFAULTS.jurisdictions.length} jurisdictions and{" "}
        {markCount} marks, plus every heading, paragraph, usage rule and FAQ on
        the page.
      </p>

      {state.status === "checking" && <p style={pMuted}>Checking…</p>}

      {state.status === "working" && <p style={pMuted}>Writing…</p>}

      {state.status === "missing" && (
        <>
          <p style={p}>
            No document exists yet, so the public page is currently falling back
            to its built-in copy.
          </p>
          <button style={primary} onClick={create}>
            Create the Trademarks document
          </button>
        </>
      )}

      {state.status === "exists" && (
        <>
          <p style={p}>
            A document already exists (<code style={code}>{state.id}</code>).
            Edit it under Website Pages → Trademarks Page Settings.
          </p>
          <button style={secondary} onClick={() => restore(state.id)}>
            Restore shipped defaults (overwrites your edits)
          </button>
        </>
      )}

      {state.status === "done" && (
        <>
          <p style={ok}>
            Saved. Document <code style={code}>{state.id}</code> is live — open
            Website Pages → Trademarks Page Settings to edit it, then reload
            /trademarks.
          </p>
          <button style={secondary} onClick={check}>
            Check again
          </button>
        </>
      )}

      {state.status === "error" && (
        <>
          <p style={err}>{state.message}</p>
          <button style={secondary} onClick={check}>
            Try again
          </button>
        </>
      )}
    </div>
  );
}

const wrap: React.CSSProperties = {
  maxWidth: 720,
  margin: "0 auto",
  padding: "48px 24px",
  fontFamily: "system-ui, sans-serif",
  lineHeight: 1.6,
};
const h1: React.CSSProperties = { fontSize: 24, fontWeight: 600, marginBottom: 16 };
const p: React.CSSProperties = { marginBottom: 12 };
const pMuted: React.CSSProperties = { marginBottom: 12, opacity: 0.7 };
const code: React.CSSProperties = {
  background: "rgba(128,128,128,0.15)",
  padding: "2px 6px",
  borderRadius: 4,
  fontFamily: "ui-monospace, monospace",
  fontSize: 13,
};
const buttonBase: React.CSSProperties = {
  border: "none",
  borderRadius: 6,
  padding: "10px 18px",
  fontSize: 14,
  fontWeight: 500,
  cursor: "pointer",
  marginTop: 8,
};
const primary: React.CSSProperties = { ...buttonBase, background: "#1c7ef3", color: "#fff" };
const secondary: React.CSSProperties = {
  ...buttonBase,
  background: "transparent",
  color: "inherit",
  border: "1px solid rgba(128,128,128,0.4)",
};
const ok: React.CSSProperties = { marginBottom: 12, color: "#16a34a" };
const err: React.CSSProperties = { marginBottom: 12, color: "#dc2626" };
