/**
 * @fileOverview Single source of truth for FourSix46 Magazine publications.
 * Strictly aligned with enterprise CMS fields for long-form editorial content.
 */

export interface BodyContentBlock {
  type: 'text' | 'image' | 'video';
  content: string;
  url?: string;
  caption?: string;
}

export interface MagazineIssue {
  slug: string;
  magazineSeriesName: string;
  issueVolume: string;
  articleTitle: string;
  articleType: 'Essay' | 'Interview' | 'Founder Note' | 'Editorial';
  coverImage: string; // Image ID matching placeholder-images.json
  bodyContent: BodyContentBlock[];
  authorContributor: string;
  readingTime: string;
  themeTag: string;
  publishDate: string;
  featuredStoryToggle: boolean;
  seoFields: {
    title: string;
    description: string;
  };
}

export const magazineData: MagazineIssue[] = [
  {
    slug: "the-grid",
    magazineSeriesName: "Urban Systems",
    issueVolume: "Volume 01",
    articleTitle: "The Structural Honesty",
    articleType: "Editorial",
    coverImage: "mag-1",
    themeTag: "Infrastructure",
    authorContributor: "Julian Thorne",
    readingTime: "12 Min Read",
    publishDate: "OCT 2025",
    featuredStoryToggle: true,
    seoFields: {
      title: "The Grid: Structural Honesty | FourSix46 Magazine",
      description: "Exploring the foundational infrastructure of tomorrow's digital and physical ecosystems."
    },
    bodyContent: [
      {
        type: 'text',
        content: "In the era of synthetic complexity, we find truth in the grid. The modular city is not just a plan—it is a philosophy of existence. We examine the intersections of high-density urbanism and the biological imperative."
      },
      {
        type: 'image',
        content: "The Brutalist Logic",
        url: "https://images.unsplash.com/photo-1646580061173-f7b475f00934?q=80&w=2000",
        caption: "A study in modular structural clarity."
      },
      {
        type: 'text',
        content: "By distributing our compute nodes across sovereign data hubs, we eliminate the vulnerabilities of centralized networks. This is the 'House of Multibrands' philosophy in action—leveraging synergy between ventures."
      }
    ]
  },
  {
    slug: "bio-syn",
    magazineSeriesName: "Bio-Infrastructure",
    issueVolume: "Volume 02",
    articleTitle: "Synthesizing Vitality",
    articleType: "Essay",
    coverImage: "mag-2",
    themeTag: "Biophilia",
    authorContributor: "Elena Volkov",
    readingTime: "8 Min Read",
    publishDate: "DEC 2025",
    featuredStoryToggle: true,
    seoFields: {
      title: "Bio-Syn: Synthesizing Vitality | FourSix46 Magazine",
      description: "The intersection of biology and synthetic technology in modern urban brutalism."
    },
    bodyContent: [
      {
        type: 'text',
        content: "The flagship 'Green Lung' project in Singapore reaches practical completion, successfully integrating complex living ecosystems with urban brutalist aesthetics."
      },
      {
        type: 'text',
        content: "Rastlina believes that the future of the city is not built against nature, but through it. Our vertical forests provide more than just aesthetic value; they are functional lungs for the modern city."
      }
    ]
  },
  {
    slug: "sovereign",
    magazineSeriesName: "Sovereign Tech",
    issueVolume: "Volume 03",
    articleTitle: "The Vault of the Digital Age",
    articleType: "Interview",
    coverImage: "gallery-3",
    themeTag: "Decentralization",
    authorContributor: "Aris Chen",
    readingTime: "15 Min Read",
    publishDate: "FEB 2026",
    featuredStoryToggle: false,
    seoFields: {
      title: "Sovereign: Digital Vaults | FourSix46 Magazine",
      description: "Securing decentralized compute nodes across global strategic sectors."
    },
    bodyContent: [
      {
        type: 'text',
        content: "Sovereignty is the new currency of the digital age. Infrastructure must be the vault. Nexus Core provides the decentralized backbone for a sovereign digital age."
      }
    ]
  }
];
