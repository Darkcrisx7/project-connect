import Link from "next/link";
import { MapPin, Users } from "lucide-react";
import type { Startup } from "@/lib/startup-constants";
const stageStyles: Record<string, string> = {
  idea: "bg-accent/15 text-accent-ink border-accent/30",
  mvp: "bg-primary/10 text-primary border-primary/30",
  revenue: "bg-success/10 text-success border-success/30",
};
const stageLabels: Record<string, string> = {
  idea: "Idea",
  mvp: "MVP",
  revenue: "Revenue",
};
export function StartupCard({ startup }: { startup: Startup }) {
  return (
    <Link
      href={`/startups/${startup.id}`}
      className="group flex flex-col rounded-2xl border border-border bg-surface p-5 transition-shadow hover:shadow-[0_8px_30px_-12px_rgba(91,76,255,0.25)]"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/50 font-display text-[17px] font-bold text-primary-ink">
          {startup.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
          <h3 className="font-display text-[17px] font-semibold truncate">{startup.name}</h3>
          <span className={`shrink-0 rounded-full border px-2.5 py-0.5 font-mono text-[11px] ${stageStyles[startup.stage]}`}>
            {stageLabels[startup.stage]}
          </span>
        </div>
      </div>
      <p className="mt-3 line-clamp-2 text-[14px] leading-relaxed text-ink-muted">
        {startup.pitch}
      </p>
      {startup.required_skills.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {startup.required_skills.slice(0, 3).map((role) => (
            <span
              key={role}
              className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] text-ink-muted"
            >
              {role}
            </span>
          ))}
        </div>
      )}
      <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-[12px] text-ink-muted">
        <span className="flex items-center gap-1">
          <MapPin size={13} /> {startup.location || startup.work_mode}
        </span>
        <span className="flex items-center gap-1">
          <Users size={13} /> {startup.team_size} on team
        </span>
      </div>
      {startup.profiles && (
        <p className="mt-3 font-mono text-[11px] text-ink-muted">
          {startup.profiles.full_name || "Founder"}
          {startup.profiles.college ? ` · ${startup.profiles.college}` : ""}
        </p>
      )}
    </Link>
  );
}
