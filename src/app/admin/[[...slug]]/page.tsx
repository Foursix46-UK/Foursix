// admin/[...slug]/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// UPDATED: Added all Blog collections (blogPostsCollection, blogCategoriesCollection,
//          blogTagsCollection, blogAuthorsCollection, blogSettingsCollection,
//          blogNewsletterSignupsCollection) to the FireCMS collections array.
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { getUserRole } from "@/lib/roles";
import { adminUsersCollection } from "../schemas/adminUsersSchema";
import { useState, useEffect } from "react";
import { FirebaseCMSApp } from "firecms";

// ── Existing collections ──────────────────────────────────────────────────────
import { venturesCollection } from "../schemas/venturesSchema";
import { newsCollection } from "../schemas/newsSchema";
import { leadershipCollection } from "../schemas/leadershipSchema";
import { globalCollection } from "../schemas/globalSchema";
import { globalSettingsCollection } from "../schemas/globalSettingsSchema";
import { magazineCollection } from "../schemas/magazineSchema";
import { careersCollection } from "../schemas/careersSchema";
import { homePageCollection } from "../schemas/homeSchema";
import { faqCollection } from "../schemas/faqSchema";
import { aboutPageCollection } from "../schemas/aboutSchema";
import { galleryPageCollection } from "../schemas/gallerySchema";
import { venturesPageCollection } from "../schemas/venturesPageSchema";
import { leadershipPageCollection } from "../schemas/leadershipPageSchema";
import { magazinesPageCollection } from "../schemas/magazinesPageSchema";
import { newsroomPageCollection } from "../schemas/newsroomPageSchema";
import { careersPageCollection } from "../schemas/careersPageSchema";
import { contactPageCollection } from "../schemas/contactPageSchema";
import { subscribersCollection } from "../schemas/subscribersSchema";
import { footerCollection } from "../schemas/footerSchema";
import { legalCollection } from "../schemas/legalSchema";
import { pageFaqCollection } from "../schemas/faqPageSchema";
import { partnershipPageCollection } from "../schemas/partnershipPageSchema";
import { auditLogCollection } from "../schemas/auditLogsSchema";

// ── NEW: Blog collections ─────────────────────────────────────────────────────
import { blogPostsCollection } from "../schemas/blogPostsSchema";
import { blogCategoriesCollection } from "../schemas/blogCategoriesSchema";
import { blogTagsCollection } from "../schemas/blogTagsSchema";
import { blogAuthorsCollection } from "../schemas/blogAuthorsSchema";
import {
  blogSettingsCollection,
  blogNewsletterSignupsCollection,
} from "../schemas/blogSettingsSchema";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-screen w-screen bg-[#0A0A0A]" />;

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <FirebaseCMSApp
        name="FourSix46 System Admin"
        firebaseConfig={firebaseConfig}
        basePath="/admin"
        signInOptions={["password", "google.com"]}
        authentication={async ({ user }: any) => {
          if (!user?.email) throw new Error("No email provided.");
          const role = await getUserRole(user.email);
          if (role) return true;
          throw new Error(
            "Access Denied. You are not registered as an Admin."
          );
        }}
        collections={[
          // ── Audit / Users ───────────────────────────────────────────────
          auditLogCollection,
          adminUsersCollection,

          // ── Blog (NEW) ──────────────────────────────────────────────────
          // Grouped under "Blog" in the sidebar
          blogPostsCollection,
          blogCategoriesCollection,
          blogTagsCollection,
          blogAuthorsCollection,
          blogSettingsCollection,
          blogNewsletterSignupsCollection,

          // ── Website Content ─────────────────────────────────────────────
          venturesCollection,
          newsCollection,
          leadershipCollection,
          globalCollection,
          globalSettingsCollection,
          magazineCollection,
          careersCollection,
          faqCollection,
          subscribersCollection,
          legalCollection,

          // ── Website Pages ────────────────────────────────────────────────
          homePageCollection,
          aboutPageCollection,
          galleryPageCollection,
          venturesPageCollection,
          leadershipPageCollection,
          magazinesPageCollection,
          newsroomPageCollection,
          careersPageCollection,
          contactPageCollection,
          partnershipPageCollection,
          pageFaqCollection,

          // ── Global ───────────────────────────────────────────────────────
          footerCollection,
        ]}
      />
    </div>
  );
}