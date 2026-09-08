// src/lib/trademarks-content.ts
//
// The trademark register content, in one place.
//
// This is the single source of truth for two consumers:
//   • the CMS schema (app/admin/schemas/trademarksPageSchema.ts) uses it for the
//     default values, so creating the document in the admin pre-fills every field;
//   • the page (app/trademarks/page.tsx) falls back to it when no CMS document
//     exists yet, so /trademarks is complete from the moment it ships.
//
// Once an editor saves the document in the CMS, that document wins for every field
// it defines. Edit there, not here — this only supplies the starting point.
//
// ⚠️ ® vs ™: statusType "registered" renders ®, anything else renders ™. Using ®
// before a registry has confirmed registration is an offence in both the UK and
// India, so never set "registered" ahead of the register itself.

export type TrademarkMark = {
  name: string;
  kind: string;
  owner: string;
  statusType: "registered" | "pending";
  statusLabel: string;
  applicationNumber: string;
  classes: string;
  specimenImage?: string;
  recordUrl?: string;
  registryUrl?: string;
};

export type TrademarkJurisdiction = {
  name: string;
  office: string;
  marks: TrademarkMark[];
};

export const TRADEMARK_JURISDICTIONS: TrademarkJurisdiction[] = [
  {
    name: "United Kingdom",
    office: "Intellectual Property Office",
    marks: [
      {
        name: "FourSix46",
        kind: "Word mark",
        owner: "FOURSIX46 GLOBAL LTD",
        statusType: "registered",
        statusLabel: "Registered",
        applicationNumber: "UK00004301358",
        classes: "25, 35, 39, 42, 43",
      },
      {
        name: "FourSix46",
        kind: "Device mark — logo",
        owner: "FOURSIX46 GLOBAL LTD",
        statusType: "registered",
        statusLabel: "Registered",
        applicationNumber: "UK00004301383",
        classes: "25, 35, 39, 42, 43",
      },
    ],
  },
  {
    name: "India",
    office: "Trade Marks Registry",
    marks: [
      {
        name: "Cinevenn",
        kind: "Word mark",
        owner: "FOURSIX46 GLOBAL LTD",
        statusType: "pending",
        statusLabel: "Formalities check passed",
        applicationNumber: "7573210 – 7573213",
        classes: "9, 35, 41, 42",
      },
      {
        name: "46DC",
        kind: "Word mark",
        owner: "KOYYALAMUDI DINESH CHANDRA",
        statusType: "pending",
        statusLabel: "Ready for examination",
        applicationNumber: "7970222",
        classes: "35, 41",
      },
      {
        name: "46DOGS",
        kind: "Word mark",
        owner: "KOYYALAMUDI DINESH CHANDRA",
        statusType: "pending",
        statusLabel: "Ready for examination",
        applicationNumber: "7970541",
        classes: "36, 44, 45",
      },
      {
        name: "46DOGS",
        kind: "Device mark — logo",
        owner: "KOYYALAMUDI DINESH CHANDRA",
        statusType: "pending",
        statusLabel: "Vienna codification",
        applicationNumber: "7970116",
        classes: "36, 44, 45",
      },
    ],
  },
];

export const TRADEMARKS_DEFAULTS = {
  heroLabel: "Trademarks",
  heroTitle: "The marks behind the ecosystem",
  heroLede1:
    "FourSix46 holds registered and pending trademarks across the United Kingdom and India, covering the parent brand and every venture built beneath it.",
  heroLede2:
    "Each record links to the official government register, so anything stated here can be verified independently — by a partner, an investor, a journalist, or anyone else who needs to check.",

  certHeading: "Primary mark",
  certMark: "FourSix46",
  certType: "Word mark",
  certNumber: "UK00004301358",
  certOffice: "UK IPO",
  certFiled: "26 Nov 2025",
  certClasses: "25, 35, 39, 42, 43",
  certStampTop: "Registered",
  certStampBottom: "United Kingdom",

  whyTitle: "Why we register our marks",
  whySubtitle:
    "A parent brand is only as strong as its claim to its own name. Registration is how that claim stops being a statement and becomes a matter of public record.",
  whyColumns: [
    {
      title: "One identity, held properly",
      body: "FourSix46 exists to hold independent ventures under a single standard. That only works if the name is owned outright rather than merely used, so the parent mark was registered before the ecosystem grew around it.",
    },
    {
      title: "Protection before scale",
      body: "Each venture is filed where it actually trades, in the classes matching what it actually does. Filing early costs little. Recovering a name someone else registered first costs a great deal.",
    },
    {
      title: "Verifiable in public",
      body: "Every mark here sits on a government register anyone can search. We publish the numbers rather than the claims, because a number can be checked and a promise cannot.",
    },
  ],

  registerTitle: "The register",
  registerSubtitle:
    "Every FourSix46 mark, grouped by the office it is filed with, with the proprietor named on each. Status reflects the most recent update from that registry.",
  jurisdictions: TRADEMARK_JURISDICTIONS,
  registerNote:
    "Marks shown as registered carry the ® symbol. Marks still in examination carry ™ until the registry confirms registration — using ® before a mark is registered is an offence in both the United Kingdom and India, so this page tracks status rather than assuming it.",

  usageTitle: "Using our marks",
  usageSubtitle:
    "Journalists, partners and directories are welcome to refer to FourSix46 and its ventures. These are the conventions we ask you to follow.",
  usageRules: [
    { lead: "Keep the spelling and casing.", body: "FourSix46 is one word with a capital F and S. Not Four Six 46, not Foursix46, not FOURSIX46." },
    { lead: "Use the right symbol.", body: "® for registered marks, ™ for marks still in examination. The register above shows which is which." },
    { lead: "Word marks protect the word.", body: "A registered word mark covers the name in any typeface. The device mark covers the logo as filed." },
    { lead: "Don't alter the logo.", body: "No recolouring, stretching, cropping or rebuilding a mark inside another lockup." },
    { lead: "Don't imply endorsement.", body: "Referring to us is fine. Suggesting a partnership or approval that does not exist is not." },
  ],
  examplesHeading: "In running text",
  usageExamples: [
    { text: "FourSix46® Global Ltd", correct: true },
    { text: "Cinevenn™, a FourSix46® venture", correct: true },
    { text: "Foursix 46 Ltd", correct: false },
    { text: "Cinevenn®", correct: false },
    { text: "the FourSix46 group of companies", correct: false },
  ],

  faqTitle: "Questions about our trademarks",
  faqs: [
    { question: "Is FourSix46 a registered trademark?", answer: "Yes. FourSix46 is registered with the UK Intellectual Property Office as both a word mark (UK00004301358) and a device mark covering the logo (UK00004301383), across Classes 25, 35, 39, 42 and 43." },
    { question: "Who owns the FourSix46 trademarks?", answer: "The UK marks and the Cinevenn applications are held by FOURSIX46 GLOBAL LTD, registered in England and Wales. The 46DC and 46DOGS applications are held personally by the founder. Every record on this page names its own proprietor." },
    { question: "Why do some marks show ™ instead of ®?", answer: "® may only be used once a registry has completed registration. Marks still moving through examination carry ™, which signals a claim to the mark without asserting a registration that has not happened." },
    { question: "What is the difference between the word mark and the device mark?", answer: "A word mark protects the name itself in any styling. A device mark protects the logo exactly as filed. FourSix46 and 46DOGS are each protected both ways, which is why they appear twice on this register." },
    { question: "Are the ventures trademarked separately from the parent brand?", answer: "Yes. Each venture is filed in its own right, in the jurisdiction where it trades and in the classes matching its actual services. The parent registration does not automatically extend to venture names." },
    { question: "How can I verify these trademarks independently?", answer: "Every record links to the official government register — the UK IPO for British marks, the Indian Trade Marks Registry for Indian ones. Both are free, public and searchable by application number." },
  ],

  crossTitle: "Founder marks",
  crossText:
    "The same six marks are listed on the founder register, written from his side rather than the company's.",
  crossButtonLabel: "46dc.com/trademarks",
  crossButtonUrl: "https://www.46dc.com/trademarks",

  footerNote: "FourSix46® Global Ltd — Company No. 16712658",
  lastUpdated: "Register last updated 3 September 2026",

  seoTitle: "Trademarks | FourSix46®",
  seoDescription:
    "The registered and pending trademarks held by FourSix46® Global Ltd across the UK and India, with application numbers linking to the official government registers.",
};
