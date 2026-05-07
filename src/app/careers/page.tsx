// app/careers/page.tsx
import { Metadata } from "next";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Schema from "@/components/seo/Schema";
import CareersClient from "./CareersClient";

export const dynamic = 'force-dynamic';
export async function generateMetadata(): Promise<Metadata> {
  try {
    const q = query(collection(db, "page_careers"), limit(1));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      const title = data.seoTitle || "Careers | FourSix46";
      const description = data.seoDescription || data.cultureText || "Join the FourSix46 collective. Explore open positions.";

      return {
        title: title,
        description: description,
        openGraph: { title, description, url: "https://foursix46.com/careers" }
      };
    }
  } catch (error) {
    console.error("Error fetching careers metadata:", error);
  }

  return { title: "Careers | FourSix46", description: "Explore open positions." };
}

export default async function CareersPageServer() {
  let pageData = null;
  let jobsData: any[] = [];

  try {
    // 1. Fetch Page Content
    const pageQ = query(collection(db, "page_careers"), limit(1));
    const pageSnap = await getDocs(pageQ);
    if (!pageSnap.empty) pageData = pageSnap.docs[0].data();

    // 2. Fetch Open Jobs
    const qJobs = query(collection(db, "careers"), where("status", "==", "Open"));
    const snapshotJobs = await getDocs(qJobs);
    
    jobsData = snapshotJobs.docs.map(doc => {
      const data = doc.data();
      // Format the date on the server so we can safely pass it as a string to the client
      let formattedDate = "RECENT";
      let isoDate = new Date().toISOString(); // For Google Schema
      
      if (data.postedDate?.toDate) {
        const jsDate = data.postedDate.toDate();
        isoDate = jsDate.toISOString();
        formattedDate = jsDate.toLocaleDateString('en-US', { 
          month: 'short', day: 'numeric', year: 'numeric' 
        }).toUpperCase();
      }

      return {
        id: doc.id,
        ...data,
        salary: data.salary || "",
        responsibilities: data.responsibilities || [],
        requirements: data.requirements || [],
        applyUrl: data.applyUrl || "",
        applyEmail: data.applyEmail || "",
        postedDate: formattedDate, // Now a safe string!
        _isoDate: isoDate // Hidden field just for SEO Schema
      };
    });

  } catch (error) {
    console.error("Error fetching careers server data:", error);
  }

  // 3. Build Schema (Using Google's official 'JobPosting' structure for maximum SEO!)
  const careersSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Careers | FourSix46",
    "url": "https://foursix46.com/careers",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": jobsData.map((job, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "JobPosting",
          "title": job.title,
          "description": job.description,
          "datePosted": job._isoDate,
          "hiringOrganization": {
            "@type": "Organization",
            "name": job.departmentVenture || "FourSix46",
            "logo": "https://foursix46.com/logo.png"
          },
          "jobLocation": {
            "@type": "Place",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": job.location
            }
          },
          "employmentType": job.employmentType === "Full-Time" ? "FULL_TIME" : job.employmentType === "Part-Time" ? "PART_TIME" : "CONTRACTOR"
        }
      }))
    }
  };

  return (
    <>
      <Schema data={careersSchema} />
      {/* Pass safely stringified data to the Client Component */}
      <CareersClient 
        initialPageData={JSON.parse(JSON.stringify(pageData || {}))} 
        initialJobs={JSON.parse(JSON.stringify(jobsData || []))} 
      />
    </>
  );
}