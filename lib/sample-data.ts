export type SampleStartup = {
  name: string;
  pitch: string;
  stage: "Idea" | "MVP" | "Revenue";
  industry: string;
  location: string;
  workMode: "Remote" | "Hybrid" | "On-site";
  rolesNeeded: string[];
  founder: string;
  college: string;
  teamSize: number;
};

export const sampleStartups: SampleStartup[] = [
  {
    name: "Fasal Mitra",
    pitch: "Crop advisory over WhatsApp for small farmers in Tier-3 towns",
    stage: "MVP",
    industry: "AgriTech",
    location: "Indore, MP",
    workMode: "Hybrid",
    rolesNeeded: ["Backend Engineer", "Growth Marketer"],
    founder: "Ritika Solanki",
    college: "IIT Indore",
    teamSize: 3,
  },
  {
    name: "Notemate",
    pitch: "Turn lecture recordings into shareable, searchable notes",
    stage: "Revenue",
    industry: "EdTech",
    location: "Bengaluru, KA",
    workMode: "Remote",
    rolesNeeded: ["iOS Developer", "UI Designer"],
    founder: "Arjun Nair",
    college: "PES University",
    teamSize: 5,
  },
  {
    name: "Thelawala",
    pitch: "Inventory and micro-credit app for street food vendors",
    stage: "Idea",
    industry: "FinTech",
    location: "Lucknow, UP",
    workMode: "On-site",
    rolesNeeded: ["Co-founder (Business)", "Android Developer"],
    founder: "Sneha Pathak",
    college: "BBD University",
    teamSize: 2,
  },
  {
    name: "GigCampus",
    pitch: "Verified freelance gigs for students, posted by local businesses",
    stage: "MVP",
    industry: "Marketplace",
    location: "Pune, MH",
    workMode: "Remote",
    rolesNeeded: ["Full Stack Engineer", "Content Writer"],
    founder: "Devansh Kulkarni",
    college: "COEP Technological University",
    teamSize: 4,
  },
  {
    name: "Sehat Line",
    pitch: "Regional-language teleconsultation for first-generation smartphone users",
    stage: "MVP",
    industry: "HealthTech",
    location: "Jaipur, RJ",
    workMode: "Hybrid",
    rolesNeeded: ["ML Engineer", "Product Designer"],
    founder: "Ayesha Khan",
    college: "MNIT Jaipur",
    teamSize: 6,
  },
  {
    name: "Wardrobe Loop",
    pitch: "Peer-to-peer clothing rentals for college fests and interviews",
    stage: "Idea",
    industry: "Consumer",
    location: "Delhi, DL",
    workMode: "On-site",
    rolesNeeded: ["Co-founder (Ops)", "Social Media Lead"],
    founder: "Karan Mehta",
    college: "Delhi Technological University",
    teamSize: 2,
  },
];

export const sampleStats = [
  { label: "Student founders", value: 2400 },
  { label: "Startup teams formed", value: 380 },
  { label: "Colleges represented", value: 190 },
  { label: "Roles filled", value: 910 },
];

export const sampleTestimonials = [
  {
    quote:
      "I posted my idea on a Friday and had a backend co-founder from a different city by Monday. We're now building full-time.",
    name: "Ritika Solanki",
    role: "Founder, Fasal Mitra",
    college: "IIT Indore",
  },
  {
    quote:
      "I wasn't looking to start a company — I just wanted to design for a real product. Now I own equity in one.",
    name: "Priya Ramesh",
    role: "Product Designer, Notemate",
    college: "NID Ahmedabad",
  },
  {
    quote:
      "Every other platform assumed you already had a team. This one assumed you didn't, and helped anyway.",
    name: "Devansh Kulkarni",
    role: "Founder, GigCampus",
    college: "COEP Technological University",
  },
];
