/**
 * @fileOverview Shared data structure for the FourSix46 FAQ ecosystem.
 * This file serves as the single source of truth for all frequently asked questions.
 */

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "About FourSix46" | "Ventures & Business Model" | "Partnerships" | "Investment & Growth";
  featuredOnHome: boolean;
  displayOrder: number;
}

export const faqData: FAQItem[] = [
  {
    id: "faq-1",
    category: "About FourSix46",
    question: "What defines the FourSix46 collective?",
    answer: "FourSix46 is a premium multi-brand holding company that operates at the intersection of structural honesty and aesthetic purity. We identify and scale ventures that redefine high-density urbanism, orbital mobility, and sovereign infrastructure.",
    featuredOnHome: true,
    displayOrder: 1,
  },
  {
    id: "faq-2",
    category: "About FourSix46",
    question: "Where is the House of Multibrands headquartered?",
    answer: "Our global operations are anchored in London, with strategic nodes in New York, Tokyo, Dubai, and Singapore, allowing us to manage a diverse international portfolio of disruptive brands.",
    featuredOnHome: false,
    displayOrder: 2,
  },
  {
    id: "faq-3",
    category: "Ventures & Business Model",
    question: "How does FourSix46 select its portfolio ventures?",
    answer: "We look for 'frontier' technologies—ventures that solve fundamental structural problems with high-end design. Our focus is on long-term value creation through biophilic architecture, next-gen propulsion, and decentralized compute.",
    featuredOnHome: true,
    displayOrder: 1,
  },
  {
    id: "faq-4",
    category: "Ventures & Business Model",
    question: "What is the 'Quiet Luxury' approach to engineering?",
    answer: "Quiet Luxury in engineering means excellence that is felt, not shouted. It is the pursuit of functional perfection where every component serves a purpose, housed in a design that respects the user and the environment.",
    featuredOnHome: false,
    displayOrder: 2,
  },
  {
    id: "faq-5",
    category: "Partnerships",
    question: "How can my company collaborate with the collective?",
    answer: "We engage in strategic alliances that offer deep ecosystem integration. We look for partners who share our commitment to radical honesty and structural innovation. Inquiries can be initiated through our Dialogue portal.",
    featuredOnHome: true,
    displayOrder: 1,
  },
  {
    id: "faq-6",
    category: "Partnerships",
    question: "Do you offer white-label design services through M-Studio?",
    answer: "M-Studio primarily serves as the internal design laboratory for our ventures, but we occasionally partner with external organizations that align with our neo-brutalist aesthetic and strategic vision.",
    featuredOnHome: false,
    displayOrder: 2,
  },
  {
    id: "faq-7",
    category: "Investment & Growth",
    question: "What is your typical investment horizon?",
    answer: "We are not traditional venture capitalists; we are builders. Our horizon is generational. We invest in foundational infrastructure that will support the next century of human activity.",
    featuredOnHome: true,
    displayOrder: 1,
  },
  {
    id: "faq-8",
    category: "Investment & Growth",
    question: "How does FourSix46 manage risk across diverse sectors?",
    answer: "Risk is mitigated through venture synergy. While our industries are diverse (aerospace, architecture, data), they all rely on the same core principles of decentralized infrastructure and structural integrity, creating a resilient, unified ecosystem.",
    featuredOnHome: false,
    displayOrder: 2,
  },
  {
    id: "faq-9",
    category: "About FourSix46",
    question: "Is FourSix46 a venture capital firm?",
    answer: "No. While we allocate capital, we are a holding company and operational collective. We take active management roles in our ventures to ensure they adhere to our standards of structural and aesthetic excellence.",
    featuredOnHome: false,
    displayOrder: 3,
  },
  {
    id: "faq-10",
    category: "Ventures & Business Model",
    question: "Are the ventures sovereign entities?",
    answer: "Each venture operates with its own leadership and specialized focus, but they are unified by the FourSix46 parent brand's strategic nodes and shared technological infrastructure.",
    featuredOnHome: false,
    displayOrder: 3,
  },
  {
    id: "faq-11",
    category: "Partnerships",
    question: "What industries are currently eligible for partnership?",
    answer: "We are actively exploring biophilic systems, high-density energy storage, and orbital-scale logistics. However, we are open to any industry that requires high-fidelity design and structural innovation.",
    featuredOnHome: false,
    displayOrder: 3,
  },
  {
    id: "faq-12",
    category: "Investment & Growth",
    question: "Are you raising external capital for the parent brand?",
    answer: "FourSix46 primarily operates through internal capital allocation. We occasionally invite institutional partners for specific venture-scale expansions that align with our long-term roadmap.",
    featuredOnHome: false,
    displayOrder: 3,
  },
];
