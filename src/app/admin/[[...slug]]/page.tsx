//reference admin/slug/page.tsx
"use client";
import { getUserRole } from "@/lib/roles"; // 👈 IMPORT THE FETCHER
import { adminUsersCollection } from "../schemas/adminUsersSchema";
import { useState, useEffect } from "react";
import { FirebaseCMSApp } from "firecms";
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
    // We removed the forced overflow and overscroll rules
    <div style={{ height: "100vh", width: "100vw" }}>
      <FirebaseCMSApp
        name="FourSix46 System Admin"
        firebaseConfig={firebaseConfig}
        basePath="/admin"
        signInOptions={["password", "google.com"]} 
        authentication={async ({ user }: any) => {
          if (!user?.email) throw new Error("No email provided.");
          
          // This fetches from Firebase AND saves it to our cache
          const role = await getUserRole(user.email);
          
          if (role) {
            return true; // Just return true! TS will be happy.
          }
          
          throw new Error("Access Denied. You are not registered as an Admin.");
        }}
        collections={[auditLogCollection,partnershipPageCollection,pageFaqCollection,adminUsersCollection,venturesCollection, newsCollection,leadershipCollection,globalCollection,globalSettingsCollection,magazineCollection,careersCollection,homePageCollection,faqCollection,aboutPageCollection,galleryPageCollection,venturesPageCollection,leadershipPageCollection,magazinesPageCollection,newsroomPageCollection,careersPageCollection,contactPageCollection,subscribersCollection,footerCollection,legalCollection]} 
      />
    </div>
  );
}