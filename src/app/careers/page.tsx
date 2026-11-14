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
  hiringOrganizationNode,
} from "@/lib/seo";
import CareersClient from "./CareersClient";
import { JOB_STATUS, LISTED_JOB_STATUSES } from "@/lib/careers";

export const revalidate = 300; // ISR: re-render in the background at most every 5 minutes instead of on every request
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
    // Open jobs and "Application Closed" jobs are both listed; fully Closed jobs are not.
    const qJobs = query(collection(db, "careers"), where("status", "in", LISTED_JOB_STATUSES));
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

    // Open roles first, then roles whose applications have closed; newest first within each.
    jobsData.sort(
      (a: any, b: any) =>
        Number(a.status !== JOB_STATUS.OPEN) - Number(b.status !== JOB_STATUS.OPEN) ||
        String(b._isoDate).localeCompare(String(a._isoDate))
    );
  } catch (error) {
    console.error("Error fetching careers server data:", error);
  }

  // Only roles that still accept applications are offered to Google Jobs — a posting
  // nobody can apply to must not be advertised as one.
  const openJobs = jobsData.filter((job: any) => job.status === JOB_STATUS.OPEN);

  // 3. Build the graph. JobPosting is Google's official job-listing type — each open
  //    role becomes eligible for the Google Jobs surface on its own.
  const careersSchema = graph(
    webPageNode({
      path: "/careers",
      name: pageData?.seoTitle || "Careers | FourSix46",
      description: pageData?.seoDescription || plainText(pageData?.cultureText) || "Explore open positions.",
      type: "CollectionPage",
      primaryEntityId: `${SITE_URL}/careers#jobs`,
      dateModified: toIso(pageData?.updatedAt),
    }),
    breadcrumbNode([{ name: "Careers", path: "/careers" }]),
    {
      "@type": "ItemList",
      "@id": `${SITE_URL}/careers#jobs`,
      name: "Open positions at FourSix46",
      numberOfItems: openJobs.length,
      itemListElement: openJobs.map((job: any, index: number) => {
        const isRemote = /remote/i.test(String(job.location || ""));
        // "London, UK" -> "London": addressLocality is the town only, the country has its own field.
        const locality = String(job.location || "").split(",")[0].trim();
        return clean({
          "@type": "ListItem",
          position: index + 1,
          item: clean({
            "@type": "JobPosting",
            title: job.title,
            description: plainText(job.description) || job.title,
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
            // Stack46 and Route46 Couriers hire under their own names (lib/seo.ts).
            hiringOrganization: hiringOrganizationNode(job.departmentVenture),
            // Remote roles carry no jobLocation at all — TELECOMMUTE plus the country
            // applicants must be in is the complete, valid description.
            jobLocation: isRemote
              ? undefined
              : clean({
                  "@type": "Place",
                  address: clean({
                    "@type": "PostalAddress",
                    addressLocality: locality || "London",
                    addressCountry: job.country || "GB",
                  }),
                }),
            jobLocationType: isRemote ? "TELECOMMUTE" : undefined,
            applicantLocationRequirements: isRemote
              ? { "@type": "Country", name: job.country || "GB" }
              : undefined,
            directApply: Boolean(job.applyUrl || job.applyEmail),
            industry: job.departmentVenture || undefined,
          }),
        });
      }),
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