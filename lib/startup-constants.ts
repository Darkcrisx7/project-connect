export const industries = [
  "AgriTech",
  "EdTech",
  "FinTech",
  "HealthTech",
  "Consumer",
  "Marketplace",
  "SaaS",
  "AI/ML",
  "Climate",
  "Gaming",
  "Social",
  "Other",
] as const;

export const stages = [
  { value: "idea", label: "Idea" },
  { value: "mvp", label: "MVP" },
  { value: "revenue", label: "Revenue" },
] as const;

export const workModes = [
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "onsite", label: "On-site" },
] as const;

export const roleCommitments = [
  { value: "part_time", label: "Part-time" },
  { value: "full_time", label: "Full-time" },
] as const;

export type Startup = {
  id: string;
  founder_id: string;
  name: string;
  pitch: string;
  problem: string | null;
  solution: string | null;
  stage: "idea" | "mvp" | "revenue";
  industry: string;
  location: string | null;
  work_mode: "remote" | "hybrid" | "onsite";
  required_skills: string[];
  open_roles: number;
  commitment: "part_time" | "full_time" | null;
  equity_offered: string | null;
  application_deadline: string | null;
  team_size: number;
  banner_url: string | null;
  logo_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string | null;
    college: string | null;
    avatar_url: string | null;
  } | null;
};
