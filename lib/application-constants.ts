export const applicationStatusLabels: Record<string, string> = {
  pending: "Pending",
  shortlisted: "Shortlisted",
  accepted: "Accepted",
  rejected: "Not a fit",
};

export const applicationStatusStyles: Record<string, string> = {
  pending: "bg-surface text-ink-muted border-border",
  shortlisted: "bg-accent/15 text-accent-ink border-accent/30",
  accepted: "bg-success/10 text-success border-success/30",
  rejected: "bg-danger/10 text-danger border-danger/30",
};

export type Application = {
  id: string;
  startup_id: string;
  applicant_id: string;
  intro: string;
  why_join: string;
  status: "pending" | "shortlisted" | "accepted" | "rejected";
  created_at: string;
  updated_at: string;
  startups?: {
    id: string;
    name: string;
    pitch: string;
    stage: string;
    founder_id: string;
    profiles?: { full_name: string | null } | null;
  } | null;
  profiles?: {
    full_name: string | null;
    college: string | null;
    avatar_url: string | null;
    skills: string[];
    preferred_role: string | null;
    github_url: string | null;
    linkedin_url: string | null;
    portfolio_url: string | null;
  } | null;
};
