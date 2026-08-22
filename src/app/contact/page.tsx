// app/contact/page.tsx
import { Metadata } from "next";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata, graph, webPageNode, breadcrumbNode, clean, toIso, ORG_ID } from "@/lib/seo";
import ContactClient from "./ContactClient";

export const dynamic = 'force-dynamic';
export async function generateMetadata(): Promise<Metadata> {
  const fallbackTitle = "Contact Us | FourSix46";
  const fallbackDescription = "Contact FourSix46 Global Ltd for strategic partnerships, press and general enquiries.";

  try {
    const q = query(collection(db, "page_contact"), limit(1));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      return buildMetadata({
        title: data.seoTitle || fallbackTitle,
        description: data.seoDescription || data.formSubtitle || fallbackDescription,
        path: "/contact",
        image: data.ogImage,
      });
    }
  } catch (error) {
    console.error("Error fetching contact metadata:", error);
  }

  return buildMetadata({ title: fallbackTitle, description: fallbackDescription, path: "/contact" });
}

export default async function ContactPageServer() {
  let pageData: any = null;

  try {
    const qContact = query(collection(db, "page_contact"), limit(1));
    const snapContact = await getDocs(qContact);
    if (!snapContact.empty) pageData = snapContact.docs[0].data();
  } catch (error) {
    console.error("Error fetching contact server data:", error);
  }

  // ContactPage + the contact points, attached to the site-wide Organization @id so the
  // phone and email surface in the knowledge panel rather than as an orphan entity.
  const contactSchema = graph(
    webPageNode({
      path: "/contact",
      name: pageData?.seoTitle || "Contact FourSix46",
      description: pageData?.seoDescription || pageData?.formSubtitle,
      type: "ContactPage",
      primaryEntityId: ORG_ID,
      dateModified: toIso(pageData?.updatedAt),
    }),
    breadcrumbNode([{ name: "Contact", path: "/contact" }]),
    {
      "@type": "Organization",
      "@id": ORG_ID,
      contactPoint: [
        clean({
          "@type": "ContactPoint",
          telephone: pageData?.phone || "+44 330 124 1966",
          email: pageData?.generalEmail || "contact@foursix46.com",
          contactType: "customer service",
          areaServed: "GB",
          availableLanguage: ["en"],
        }),
        pageData?.pressEmail
          ? clean({
              "@type": "ContactPoint",
              email: pageData.pressEmail,
              contactType: "public relations",
              availableLanguage: ["en"],
            })
          : null,
        pageData?.partnersEmail
          ? clean({
              "@type": "ContactPoint",
              email: pageData.partnersEmail,
              contactType: "sales",
              availableLanguage: ["en"],
            })
          : null,
        pageData?.careersEmail
          ? clean({
              "@type": "ContactPoint",
              email: pageData.careersEmail,
              contactType: "human resources",
              availableLanguage: ["en"],
            })
          : null,
      ].filter(Boolean),
    }
  );

  return (
    <>
      <JsonLd data={contactSchema} id="schema-contact" />
      {/* Pass safely stringified data to the Client Component */}
      <ContactClient initialPageData={JSON.parse(JSON.stringify(pageData || {}))} />
    </>
  );
}