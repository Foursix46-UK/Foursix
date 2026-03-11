/**
 * @fileOverview Single source of truth for FourSix46 Leadership profiles.
 * Strictly aligned with enterprise CMS fields.
 */

export interface LeadershipProfile {
  id: string;
  fullName: string;
  roleTitle: string;
  shortBio: string;
  longBio: string;
  profilePhoto: string; // Image ID matching placeholder-images.json
  socials: {
    linkedin?: string;
    twitter?: string;
    website?: string;
    instagram?: string;
  };
  displayOrder: number;
  isActive: boolean; // Active / Alumni toggle
  featuredOnAboutPage: boolean;
}

export const leadershipData: LeadershipProfile[] = [
  {
    id: "julian-thorne",
    fullName: "Julian Thorne",
    roleTitle: "Chief Executive & Founder",
    shortBio: "Orchestrating cross-border logistics and scaling multi-venture operations for the holding group.",
    longBio: "With over two decades of experience in global strategic allocation and industrial design, Julian founded FourSix46 to bridge the gap between functional excellence and aesthetic purity. Under his leadership, the collective has grown into a sovereign network of disruptive ventures spanning aerospace, architecture, and decentralized compute. His philosophy of 'Quiet Luxury' drives every strategic node in the FourSix46 ecosystem.",
    profilePhoto: "team-1",
    socials: {
      linkedin: "https://linkedin.com/in/j-thorne",
      twitter: "https://twitter.com/jthorne",
      website: "https://foursix46.com"
    },
    displayOrder: 1,
    isActive: true,
    featuredOnAboutPage: true,
  },
  {
    id: "alara-vane",
    fullName: "Alara Vane",
    roleTitle: "Creative Principal",
    shortBio: "Defining brand narratives that balance aesthetic purity with structural honesty.",
    longBio: "Alara leads the visual and narrative direction for the entire FourSix46 portfolio. Her work at M-Studio has redefined neo-brutalism for a new generation of luxury seekers. She believes that the most impactful brands are those that communicate through clarity, precision, and structural truth rather than superficial noise.",
    profilePhoto: "team-1",
    socials: {
      linkedin: "https://linkedin.com/in/a-vane",
      instagram: "https://instagram.com/alara.studio",
      website: "https://m-studio.example.com"
    },
    displayOrder: 2,
    isActive: true,
    featuredOnAboutPage: true,
  },
  {
    id: "marcus-key",
    fullName: "Marcus Key",
    roleTitle: "Global Operations Lead",
    shortBio: "Driving biophilic integration and sovereign infrastructure across our global portfolio.",
    longBio: "Marcus oversees the logistical complexity of FourSix46's global footprint. From the deployment of Nexus Core nodes to the architectural oversight of Rastlina's vertical forests, he ensures that the holding company's vision is executed with absolute precision. His focus is on long-term sustainability and the operational resilience of our multi-venture synergy.",
    profilePhoto: "team-1",
    socials: {
      linkedin: "https://linkedin.com/in/m-key",
      twitter: "https://twitter.com/mkey_ops"
    },
    displayOrder: 3,
    isActive: true,
    featuredOnAboutPage: true,
  },
  {
    id: "elena-volkov",
    fullName: "Dr. Elena Volkov",
    roleTitle: "Strategy Principal",
    shortBio: "Leading R&D for orbital mobility and next-generation propulsion systems.",
    longBio: "Dr. Volkov brings a deep scientific background to the FourSix46 leadership team. As the strategic mind behind Vyoma's aerospace advancements, she explores the frontiers of kinetic motion and orbital-scale logistics. Her research-driven approach ensures that our ventures remain at the absolute edge of technological possibility.",
    profilePhoto: "team-1",
    socials: {
      linkedin: "https://linkedin.com/in/e-volkov",
      twitter: "https://twitter.com/volkov_sci",
      instagram: "https://instagram.com/dr.volkov"
    },
    displayOrder: 4,
    isActive: true,
    featuredOnAboutPage: false,
  },
  {
    id: "aris-chen",
    fullName: "Aris Chen",
    roleTitle: "Infrastructure Architect",
    shortBio: "Former Lead Architect for sovereign compute nodes.",
    longBio: "Aris was instrumental in the foundational phase of Nexus Core, establishing the decentralized protocols that now power our global data nodes. His work focused on post-quantum security and structural resilience in digital infrastructure.",
    profilePhoto: "team-1",
    socials: {
      linkedin: "https://linkedin.com/in/aris-chen",
      website: "https://arischen.io"
    },
    displayOrder: 5,
    isActive: false, // Alumni Example
    featuredOnAboutPage: false,
  }
];
