// ─────────────────────────────────────────────────────────────────────────────
// Seed content for the Trademarks CMS.
//
// These are registry facts, not marketing copy: application numbers, filing
// dates, proprietor names and class specifications are transcribed from the UK
// IPO and Indian Trade Marks Registry records. Treat every value here as it
// would be treated on the register itself — `legalName` and `specification` in
// particular are quoted exactly as filed and must not be tidied.
//
// There is deliberately no `symbol` anywhere below. ®/™ is derived from
// `status` at render time (see trademarkSymbol in lib/seo.ts), because using ®
// before registration is an offence in both jurisdictions.
// ─────────────────────────────────────────────────────────────────────────────

export const PROPRIETOR_SEED = [
  {
    key: "foursix46-global-ltd",
    // Exactly as recorded at Companies House and on the UK IPO register.
    legalName: "FOURSIX46 GLOBAL LTD",
    displayName: "FourSix46 Global Ltd",
    entityType: "Company",
    registrationNumber: "16712658",
    registeredCountry: "United Kingdom",
    verifyUrl: "https://find-and-update.company-information.service.gov.uk/company/16712658",
    bioShort:
      "The UK-registered parent company holding the FourSix46 marks and its venture brands.",
  },
  {
    key: "koyyalamudi-dinesh-chandra",
    // The Indian filings are recorded under this name order. Showing only the
    // display name would make the register look like it belongs to someone
    // else — see the FAQ that explains the difference.
    legalName: "KOYYALAMUDI DINESH CHANDRA",
    displayName: "Dinesh Koyyalamudi",
    entityType: "Individual",
    registrationNumber: "",
    registeredCountry: "India",
    verifyUrl: "https://www.46dc.com/about",
    bioShort: "Founder of FourSix46 Global Ltd. Holds the 46DC and 46DOGS marks personally.",
  },
] as const;

export const JURISDICTION_SEED = [
  {
    key: "united-kingdom",
    countryName: "United Kingdom",
    countryCode: "GB",
    officeName: "Intellectual Property Office",
    officeShort: "UK IPO",
    officeUrl: "https://www.gov.uk/government/organisations/intellectual-property-office",
    recordUrlPattern:
      "https://trademarks.ipo.gov.uk/ipo-tmcase/page/Results/1/{application_number}",
    deepLinkSupported: true,
    symbolRuleNote:
      "Under section 95 of the Trade Marks Act 1994 it is an offence to represent a mark as registered in the United Kingdom when it is not.",
    sortOrder: 1,
    registryStages: [
      { stageName: "Application filed", stageDescription: "The application is submitted to the UK IPO." },
      { stageName: "Examination", stageDescription: "The office checks the mark for distinctiveness and earlier conflicting rights." },
      { stageName: "Publication", stageDescription: "The mark is published in the Trade Marks Journal for public inspection." },
      { stageName: "Opposition period", stageDescription: "A two-month window in which any third party may oppose registration." },
      { stageName: "Registered", stageDescription: "The certificate issues and the mark may carry ®." },
    ],
  },
  {
    key: "india",
    countryName: "India",
    countryCode: "IN",
    officeName: "Trade Marks Registry",
    officeShort: "IP India",
    officeUrl: "https://tmrsearch.ipindia.gov.in/tmrpublicsearch/",
    // IP India's public search is session-based, so a per-mark deep link cannot
    // be built. The button points at the search page and the number is shown
    // beside it for manual entry.
    recordUrlPattern: "",
    deepLinkSupported: false,
    symbolRuleNote:
      "Under section 107 of the Trade Marks Act 1999 it is an offence to represent a mark as registered in India when it is not.",
    sortOrder: 2,
    registryStages: [
      { stageName: "Application filed", stageDescription: "Form TM-A is submitted to the Trade Marks Registry." },
      { stageName: "Formalities check passed", stageDescription: "The registry confirms the application is complete and correctly filed." },
      { stageName: "Vienna codification", stageDescription: "Device marks are assigned codes describing their visual elements." },
      { stageName: "Examination", stageDescription: "The registry reviews the mark and issues an examination report." },
      { stageName: "Published", stageDescription: "The accepted mark is published in the Trade Marks Journal." },
      { stageName: "Opposition period", stageDescription: "A four-month window in which any third party may oppose registration." },
      { stageName: "Registered", stageDescription: "The certificate issues and the mark may carry ®." },
    ],
  },
] as const;

const UK_CLASSES = [
  { classNumber: 25, classHeading: "Clothing, footwear, headgear" },
  { classNumber: 35, classHeading: "Advertising; business management; business administration" },
  { classNumber: 39, classHeading: "Transport; packaging and storage of goods; travel arrangement" },
  { classNumber: 42, classHeading: "Scientific and technological services; design and development of software" },
  { classNumber: 43, classHeading: "Services for providing food and drink; temporary accommodation" },
];

export const TRADEMARK_SEED = [
  {
    key: "foursix46-word-mark",
    markName: "FourSix46",
    slug: "foursix46-word-mark",
    markType: "Word mark",
    proprietorKey: "foursix46-global-ltd",
    jurisdictionKey: "united-kingdom",
    filingType: "Multi-class",
    applicationNumber: "UK00004301358",
    filingDate: "2025-11-26",
    registrationDate: "2025-11-26",
    status: "Registered",
    statusUpdated: "2026-09-03",
    statusNote: "Registered across five classes.",
    trademarkClasses: UK_CLASSES,
    summary:
      "The word mark protecting the FourSix46 name itself, in any typeface, across the five classes the group trades in.",
    story:
      "FourSix46 is the parent brand that every venture in the group carries. A word mark protects the name rather than its styling, which means the protection survives a rebrand, a new logo, or a different typeface on a different product.\n\nIt was filed across five classes because the group operates across five distinct areas in the eyes of a registry, and filing only the obvious one would have left the rest of the business unprotected.",
    classNote:
      "Filed as a single multi-class application, so one application number covers all five classes.",
    isPrimary: true,
    sortOrder: 1,
    faqs: [
      {
        question: "Is FourSix46 a registered trademark?",
        answer:
          "Yes. FourSix46 is registered with the UK Intellectual Property Office as a word mark under UK00004301358, covering Classes 25, 35, 39, 42 and 43.",
      },
      {
        question: "What is the difference between the word mark and the device mark?",
        answer:
          "A word mark protects the name itself in any styling. A device mark protects the logo exactly as filed. FourSix46 is protected both ways, which is why it appears twice on this register.",
      },
    ],
  },
  {
    key: "foursix46-device-mark",
    markName: "FourSix46",
    slug: "foursix46-device-mark",
    markType: "Device mark",
    markImageBg: "Light",
    proprietorKey: "foursix46-global-ltd",
    jurisdictionKey: "united-kingdom",
    filingType: "Multi-class",
    applicationNumber: "UK00004301383",
    filingDate: "2025-11-26",
    registrationDate: "2025-11-26",
    status: "Registered",
    statusUpdated: "2026-09-03",
    statusNote: "Registered across five classes.",
    trademarkClasses: UK_CLASSES,
    summary:
      "The device mark protecting the FourSix46 logo exactly as filed, across the same five classes as the word mark.",
    story:
      "Filed alongside the word mark on the same day. Where the word mark protects the name in any form, this one protects the artwork itself — the specific logo as it was submitted to the registry.\n\nHolding both is what allows the brand to be defended whether a third party copies the name, the mark, or both.",
    usageEnabled: true,
    usageIntro:
      "The device mark covers the logo as filed. Reproducing it accurately is what keeps the registration enforceable.",
    usageCorrect:
      "Reproduce the logo at the supplied proportions, in the supplied colours, with clear space on all sides.",
    usageIncorrect:
      "Do not recolour, stretch, crop, rotate, or rebuild the mark inside another lockup.",
    sortOrder: 2,
    faqs: [
      {
        question: "Can I use the FourSix46 logo?",
        answer:
          "Only with written permission, and only as filed. The device mark is registered, so altered reproductions are both a brand problem and an infringement risk.",
      },
    ],
  },
  {
    key: "cinevenn",
    markName: "Cinevenn",
    slug: "cinevenn",
    markType: "Word mark",
    proprietorKey: "foursix46-global-ltd",
    jurisdictionKey: "india",
    // The one mark filed as four separate single-class applications, which is
    // why the class blocks below each carry their own number.
    filingType: "Separate applications per class",
    applicationNumber: "",
    filingDate: "2026-03-03",
    status: "Formalities check passed",
    statusUpdated: "2026-09-03",
    statusNote: "Four applications, one per class.",
    trademarkClasses: [
      {
        classNumber: 9,
        classHeading: "Scientific and technological apparatus; computer software",
        applicationNumber: "7573210",
        specification:
          "Downloadable computer software and mobile applications for professional networking in the field of film, media and entertainment; downloadable software for talent discovery, project listings, digital portfolios and collaboration; downloadable software for uploading, sharing and viewing multimedia content; downloadable application software for communication, messaging and content management in the entertainment industry.",
      },
      {
        classNumber: 35,
        classHeading: "Advertising; business management; business administration",
        applicationNumber: "7573211",
        specification:
          "Online business networking services in the field of film, media and entertainment; providing an online marketplace for buyers and sellers of creative services in the entertainment industry; talent recruitment and placement services; advertising and promotional services for professionals and projects in the field of film and media; business management and consultancy services relating to the entertainment industry; providing online platforms for professional collaboration and commercial interactions in the field of film and entertainment.",
      },
      {
        classNumber: 41,
        classHeading: "Education; training; entertainment; cultural activities",
        applicationNumber: "7573212",
        specification:
          "Providing online entertainment services; providing information relating to film, media and entertainment; providing online non-downloadable multimedia content; organization and hosting of auditions, talent showcases and industry-related events; publication of digital content in the field of film and entertainment; providing online platforms for showcasing creative works and talent.",
      },
      {
        classNumber: 42,
        classHeading: "Scientific and technological services; design and development of software",
        applicationNumber: "7573213",
        specification:
          "Providing temporary use of non-downloadable web-based software for professional networking in the field of film, media and entertainment; providing a platform as a service (PaaS) featuring software for talent discovery, project collaboration, digital portfolio hosting and multimedia content sharing; design, development and maintenance of computer software; hosting of digital platforms for user-generated content and professional interaction in the entertainment industry.",
      },
    ],
    summary:
      "The mark protecting FourSix46's film industry platform in the territory where it launches first: India, the world's largest film market by volume.",
    story:
      "Cinevenn is being built as the digital infrastructure for cinema collaboration — connecting directors, producers, writers and crew the way professional networks connect everyone else. A platform whose entire value is the trust of the people on it cannot afford ambiguity about its own name.\n\nIt is filed across four classes because the platform does four distinct things in the eyes of a registry: it is downloadable software, a business networking and recruitment service, an entertainment and content service, and a hosted software platform. Filing only the obvious class would have left three quarters of the product unprotected.\n\nIndia was chosen as the first filing territory for the same reason it was chosen as the first launch market. Filing where a venture actually trades, rather than defensively everywhere, keeps protection meaningful and the register honest.",
    classNote:
      "India permits either a single multi-class application or separate single-class applications. Cinevenn was filed the second way, which means each class progresses through examination on its own timeline and can be defended independently.",
    sortOrder: 3,
    faqs: [
      {
        question: "Is Cinevenn a registered trademark?",
        answer:
          "Not yet. Four applications were filed with the Indian Trade Marks Registry on 3 March 2026 covering Classes 9, 35, 41 and 42. All four have passed the formalities check and await examination. Until registration completes, the mark is used as Cinevenn™ rather than Cinevenn®.",
      },
      {
        question: "Who owns the Cinevenn trademark?",
        answer:
          "FourSix46 Global Ltd, registered in England and Wales under company number 16712658. Cinevenn is a company venture rather than a personally held brand.",
      },
      {
        question: "Why are there four application numbers for one mark?",
        answer:
          "India permits either a single multi-class application or separate single-class applications. Cinevenn was filed the second way, which means each class progresses through examination on its own timeline and can be defended independently.",
      },
      {
        question: "What do the four classes cover?",
        answer:
          "Class 9 covers the downloadable app and software. Class 35 covers business networking, talent recruitment and the creative-services marketplace. Class 41 covers entertainment services, auditions, showcases and published content. Class 42 covers the hosted platform and software development.",
      },
      {
        question: "Why was Cinevenn filed in India rather than the United Kingdom?",
        answer:
          "Cinevenn launches in India first, and trademark protection is territorial — a mark is filed where the venture actually trades. Further territories will be filed as the platform expands, and each will appear on this register.",
      },
      {
        question: "How long until Cinevenn is registered?",
        answer:
          "An unopposed Indian application typically takes twelve to eighteen months from filing, moving through examination, publication in the Trade Marks Journal, and a four-month opposition window before registration.",
      },
    ],
  },
  {
    key: "46dc",
    markName: "46DC",
    slug: "46dc",
    markType: "Word mark",
    proprietorKey: "koyyalamudi-dinesh-chandra",
    jurisdictionKey: "india",
    filingType: "Multi-class",
    applicationNumber: "7970222",
    filingDate: "2026-09-02",
    status: "Ready for examination",
    statusUpdated: "2026-09-03",
    trademarkClasses: [
      { classNumber: 35, classHeading: "Advertising; business management; business administration" },
      { classNumber: 41, classHeading: "Education; training; entertainment; cultural activities" },
    ],
    summary:
      "The founder's personal mark, held individually rather than by the company, covering advisory and published work.",
    story:
      "46DC is a personal brand rather than a company venture, which is why it is filed in the founder's own name rather than under FourSix46 Global Ltd. Keeping the two separate on the register keeps the ownership question unambiguous.",
    classNote:
      "Filed as one multi-class application under Class 99, which is a filing code rather than a Nice class. The real classes are 35 and 41.",
    sortOrder: 4,
    faqs: [
      {
        question: "Why is 46DC filed personally rather than by the company?",
        answer:
          "46DC is the founder's personal brand, not a company venture. It is recorded at the registry under the legal name Koyyalamudi Dinesh Chandra.",
      },
    ],
  },
  {
    key: "46dogs-word-mark",
    markName: "46DOGS",
    slug: "46dogs-word-mark",
    markType: "Word mark",
    proprietorKey: "koyyalamudi-dinesh-chandra",
    jurisdictionKey: "india",
    filingType: "Multi-class",
    applicationNumber: "7970541",
    filingDate: "2026-09-02",
    status: "Ready for examination",
    statusUpdated: "2026-09-03",
    trademarkClasses: [
      { classNumber: 36, classHeading: "Insurance; financial affairs; monetary affairs" },
      { classNumber: 44, classHeading: "Medical services; veterinary services; hygienic and beauty care" },
      { classNumber: 45, classHeading: "Legal services; security services; personal and social services" },
    ],
    summary:
      "The word mark for the 46DOGS animal welfare initiative, covering the name in any typeface.",
    story:
      "46DOGS is an animal welfare initiative currently held personally, with a UK charitable incorporated organisation planned. When that entity exists the marks may be assigned to it — the register will be updated to show the new proprietor at that point.",
    classNote:
      "Filed as one multi-class application under Class 99, which is a filing code rather than a Nice class. The real classes are 36, 44 and 45.",
    sortOrder: 5,
    faqs: [
      {
        question: "Why are there two 46DOGS entries?",
        answer:
          "One protects the name in any typeface, the other protects the badge artwork exactly as filed. They are separate applications with separate numbers and separate statuses.",
      },
    ],
  },
  {
    key: "46dogs-device-mark",
    markName: "46DOGS",
    slug: "46dogs-device-mark",
    markType: "Device mark",
    markImageBg: "Dark",
    proprietorKey: "koyyalamudi-dinesh-chandra",
    jurisdictionKey: "india",
    filingType: "Multi-class",
    applicationNumber: "7970116",
    filingDate: "2026-09-02",
    // Vienna codification is a device-mark-only stage: the registry assigns
    // codes describing the artwork's visual elements before examination.
    status: "Vienna codification",
    statusUpdated: "2026-09-03",
    trademarkClasses: [
      { classNumber: 36, classHeading: "Insurance; financial affairs; monetary affairs" },
      { classNumber: 44, classHeading: "Medical services; veterinary services; hygienic and beauty care" },
      { classNumber: 45, classHeading: "Legal services; security services; personal and social services" },
    ],
    summary:
      "The device mark for the 46DOGS badge, protecting the artwork exactly as filed.",
    story:
      "The badge is the mark most people will recognise, so it is protected separately from the name. It is currently at Vienna codification, the stage where the registry records the visual elements of a device mark before examination begins.",
    usageEnabled: true,
    usageIntro: "The badge sits on its own dark field. Do not place it on a light background.",
    usageCorrect: "Reproduce the badge as filed, on its own dark field, with clear space on all sides.",
    usageIncorrect: "Do not recolour the badge, place it on white, or separate the artwork from its field.",
    sortOrder: 6,
    faqs: [],
  },
] as const;

export const TRADEMARK_PAGE_SETTINGS_SEED = {
  pageTitle: "Trademarks",
  metaTitle: "Trademarks — FourSix46 Global Ltd",
  metaDescription:
    "The registered and pending trademarks held across the FourSix46 ecosystem, with application numbers, filing dates and links to the official registers.",
  heroHeading: "Trademarks",
  heroBody:
    "Every mark held across the FourSix46 ecosystem, listed with its application number, filing date, proprietor and current status.\n\nNothing on this page needs to be taken on trust. Each entry links to the public register it came from, so any claim here can be checked against the government record that supports it.",
  whyHeading: "Why this register exists",
  whyIntro:
    "A trademark is only as good as the public's ability to verify it. Publishing the register is how a claim becomes checkable.",
  whyColumns: [
    {
      heading: "Protection is territorial",
      body: "A mark is registered in a specific country, for specific goods and services. There is no such thing as a worldwide trademark, and a register that implies otherwise is misleading.",
    },
    {
      heading: "Word marks and device marks differ",
      body: "A word mark protects the name in any typeface. A device mark protects the logo exactly as filed. Brands protected both ways appear twice here, because they are two separate registrations.",
    },
    {
      heading: "Status changes over time",
      body: "Applications move through examination, publication and an opposition window before registration. This register is reviewed quarterly so the status shown matches the register itself.",
    },
  ],
  registerIntro:
    "Grouped by the registry that holds each mark. Application numbers are shown exactly as recorded.",
  registerFootnote:
    "® indicates a mark registered in the jurisdiction shown. ™ indicates an application that has been filed but not yet registered. The symbol shown against each mark is derived from its registry status and is never set by hand — representing an unregistered mark as registered is an offence under section 95 of the UK Trade Marks Act 1994 and section 107 of India's Trade Marks Act 1999.",
  usageHeading: "Using our marks",
  usageIntro:
    "These marks identify FourSix46 Global Ltd and its ventures. They may be used to refer to us accurately; they may not be used in a way that suggests endorsement, partnership or affiliation that does not exist.",
  usageRules: [
    {
      lead: "Word marks protect the word.",
      body: "A registered word mark covers the name in any typeface. The device mark covers the logo as filed.",
    },
    {
      lead: "Don't alter the logo.",
      body: "No recolouring, stretching, cropping or rebuilding a mark inside another lockup.",
    },
    {
      lead: "Use the correct symbol.",
      body: "® only where the mark is registered in that territory. ™ everywhere else.",
    },
  ],
  usageCorrect: [
    "FourSix46® is a registered trademark of FourSix46 Global Ltd.",
    "Built on the Cinevenn™ platform.",
  ],
  usageIncorrect: [
    "Cinevenn® — the mark is not yet registered.",
    "A FourSix46 partner — implies an affiliation that does not exist.",
  ],
  pageFaqs: [
    {
      question: "Why does the proprietor name differ from the founder's name?",
      answer:
        "Indian filings are recorded as Koyyalamudi Dinesh Chandra, which is the same person as Dinesh Koyyalamudi in a different name order. The register shows the legal name exactly as recorded so it matches the government record when cross-checked.",
    },
    {
      question: "Why do some marks show ™ rather than ®?",
      answer:
        "® may only be used once a mark is registered in that jurisdiction. Marks still moving through examination carry ™. The symbol here is derived from the registry status rather than set by hand.",
    },
    {
      question: "Are these marks registered worldwide?",
      answer:
        "No. Trademark protection is territorial. Each entry states the jurisdiction it covers, and further territories are filed as ventures expand into them.",
    },
    {
      question: "How often is this register updated?",
      answer:
        "It is reviewed quarterly, and updated immediately whenever a registry issues a status change. Each entry shows the date its status was last confirmed.",
    },
  ],
  crossSiteHeading: "The same register, from the founder's side",
  crossSiteBody:
    "Every mark in the ecosystem is listed on both sites — the same records, written from each side.",
  crossSiteUrl: "https://www.46dc.com/trademarks",
};
