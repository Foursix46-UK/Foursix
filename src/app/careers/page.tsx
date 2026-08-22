// app/careers/page.tsx
import { Metadata } from "next";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import JsonLd from "@/components/seo/JsonLd";
import {
  buildMetadata,
  graph,
  webPageNode,
  breadcrumbNode,
  clean,
  plainText,
  toIso,
  SITE_URL,
  ORG_ID,
} from "@/lib/seo";
import CareersClient from "./CareersClient";

export const dynamic = 'force-dynamic';
export async function generateMetadata(): Promise<Metadata> {
  const fallbackTitle = "Careers | FourSix46";
  const fallbackDescription = "Join the FourSix46 collective. Explore open positions across the group.";

  try {
    const q = query(collection(db, "page_careers"), limit(1));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      return buildMetadata({
        title: data.seoTitle || fallbackTitle,
        description: data.seoDescription || plainText(data.cultureText, 160) || fallbackDescription,
        path: "/careers",
        image: data.ogImage,
      });
    }
  } catch (error) {
    console.error("Error fetching careers metadata:", error);
  }

  return buildMetadata({ title: fallbackTitle, description: fallbackDescription, path: "/careers" });
}

export default async function CareersPageServer() {
  let pageData: any = null;
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

  // 3. Build the graph. JobPosting is Google's official job-listing type — each open
  //    role becomes eligible for the Google Jobs surface on its own.
  const careersSchema = graph(
    webPageNode({
      path: "/careers",
      name: pageData?.seoTitle || "Careers | FourSix46",
      description: pageData?.seoDescription || plainText(pageData?.cultureText, 300) || "Explore open positions.",
      type: "CollectionPage",
      primaryEntityId: `${SITE_URL}/careers#jobs`,
      dateModified: toIso(pageData?.updatedAt),
    }),
    breadcrumbNode([{ name: "Careers", path: "/careers" }]),
    {
      "@type": "ItemList",
      "@id": `${SITE_URL}/careers#jobs`,
      name: "Open positions at FourSix46",
      numberOfItems: jobsData.length,
      itemListElement: jobsData.map((job: any, index: number) =>
        clean({
          "@type": "ListItem",
          position: index + 1,
          item: clean({
            "@type": "JobPosting",
            title: job.title,
            description: plainText(job.description, 5000) || job.title,
            datePosted: job._isoDate,
            validThrough: job.closingDate ? toIso(job.closingDate) : undefined,
            employmentType:
              job.employmentType === "Full-Time"
                ? "FULL_TIME"
                : job.employmentType === "Part-Time"
                ? "PART_TIME"
                : job.employmentType === "Internship"
                ? "INTERN"
                : "CONTRACTOR",
            hiringOrganization: clean({
              "@type": "Organization",
              name: job.departmentVenture || "FourSix46 Global Ltd",
              sameAs: SITE_URL,
              logo: `${SITE_URL}/logo.png`,
            }),
            jobLocation: clean({
              "@type": "Place",
              address: clean({
                "@type": "PostalAddress",
                addressLocality: job.location,
                addressCountry: job.country || "GB",
              }),
            }),
            // Remote roles need this explicitly or Google filters them out of location searches.
            jobLocationType: /remote/i.test(String(job.location || "")) ? "TELECOMMUTE" : undefined,
            applicantLocationRequirements: /remote/i.test(String(job.location || ""))
              ? { "@type": "Country", name: job.country || "GB" }
              : undefined,
            directApply: Boolean(job.applyUrl || job.applyEmail),
            industry: job.departmentVenture || undefined,
            parentOrganization: { "@id": ORG_ID },
          }),
        })
      ),
    }
  );

  return (
    <>
      <JsonLd data={careersSchema} id="schema-careers" />
      {/* Pass safely stringified data to the Client Component */}
      <CareersClient 
        initialPageData={JSON.parse(JSON.stringify(pageData || {}))} 
        initialJobs={JSON.parse(JSON.stringify(jobsData || []))} 
      />
    </>
  );
}