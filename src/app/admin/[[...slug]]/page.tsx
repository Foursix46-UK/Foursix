"use client";

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
    <div style={{ height: "100vh", width: "100vw", overflowY: "auto", overscrollBehavior: "none" }}>
      <FirebaseCMSApp
        name="FourSix46 System Admin"
        firebaseConfig={firebaseConfig}
        basePath="/admin"
        
        // --- THE FIX IS RIGHT HERE ---
        signInOptions={["password", "google.com"]} 
        
        authentication={async ({ user }: any) => {
          const allowedEmails = ["foursix46hq@gmail.com", "lucy123409876@gmail.com"];
          if (user?.email && allowedEmails.includes(user.email)) return true;
          throw new Error("Access Denied.");
        }}
        collections={[venturesCollection, newsCollection,leadershipCollection,globalCollection,globalSettingsCollection,magazineCollection,careersCollection,homePageCollection,faqCollection,aboutPageCollection,galleryPageCollection,venturesPageCollection,leadershipPageCollection,magazinesPageCollection,newsroomPageCollection,careersPageCollection,contactPageCollection]} 
      />
    </div>
  );
}