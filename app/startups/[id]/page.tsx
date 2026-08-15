import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Users, Calendar, Briefcase, ArrowLeft, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApplyForm } from "@/components/applications/apply-form";
import { WithdrawButton } from "@/components/applications/withdraw-button";
import { applicationStatusLabels, applicationStatusStyles } from "@/lib/application-constants";
import type { Startup } from "@/lib/startup-constants";
import { AppHeader } from "@/components/layout/app-header";

const stageLabels: Record<string, string> = { idea: "Idea", mvp: "MVP", revenue: "Revenue" };
const workModeLabels: Record<string, string> = { remote: "Remote", hybrid: "Hybrid", onsite: "On-site" };
const commitmentLabels: Record<string, string> = { part_time: "Part-time", full_time: "Full-time" };

export default async function StartupDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: startup } = await supabase
    .from("startups")
    .select("*, profiles(full_name, college, avatar_url)")
    .eq("id", id)
    .single<Startup>();

  if (!startup) notFound();

  const isOwner = user?.id === startup.founder_id;

  const { data: myApplication } = user && !isOwner
    ? await supabase
        .from("applications")
        .select("id, status")
        .eq("startup_id", id)
        .eq("applicant_id", user.id)
        .maybeSingle()
    : { data: null };

  return (
    <>
      <AppHeader />
      <div className="mx-auto max-w-2xl px-4 py-10 pb-28 sm:py-14 md:pb-14">
      <Link href="/discover" className="inline-flex items-center gap-1.5 text-[13px] text-ink-muted hover:text-ink">
        <ArrowLeft size={15} /> Back to discover
      </Link>

      <div className="mt-6 flex items-start justify-between gap-4">
        <div>
          <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 font-mono text-[11px] text-primary">
            {stageLabels[startup.stage]}
          </span>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">
            {startup.name}
          </h1>
          <p className="mt-2 text-[16px] text-ink-muted">{startup.pitch}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-4 text-[13px] text-ink-muted">
        <span className="flex items-center gap-1.5">
          <MapPin size={14} /> {startup.location || workModeLabels[startup.work_mode]}
        </span>
        <span className="flex items-center gap-1.5">
          <Users size={14} /> {startup.team_size} on team
        </span>
        <span className="flex items-center gap-1.5">
          <Briefcase size={14} /> {startup.open_roles} open role{startup.open_roles === 1 ? "" : "s"}
        </span>
        {startup.application_deadline && (
          <span className="flex items-center gap-1.5">
            <Calendar size={14} /> Apply by {new Date(startup.application_deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
          </span>
        )}
      </div>

      {startup.required_skills.length > 0 && (
        <div className="mt-6">
          <h2 className="font-display text-[14px] font-semibold">Looking for</h2>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {startup.required_skills.map((role) => (
              <span key={role} className="rounded-full border border-border bg-surface px-3 py-1 text-[13px]">
                {role}
              </span>
            ))}
          </div>
        </div>
      )}

      {(startup.problem || startup.solution) && (
        <div className="mt-8 space-y-6 rounded-2xl border border-border bg-surface p-6">
          {startup.problem && (
            <div>
              <h2 className="font-display text-[14px] font-semibold">Problem</h2>
              <p className="mt-1.5 text-[14px] leading-relaxed text-ink-muted">{startup.problem}</p>
            </div>
          )}
          {startup.solution && (
            <div>
              <h2 className="font-display text-[14px] font-semibold">Solution</h2>
              <p className="mt-1.5 text-[14px] leading-relaxed text-ink-muted">{startup.solution}</p>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-5">
        <div>
          <p className="font-display text-[14px] font-semibold">
            {startup.profiles?.full_name || "Founder"}
          </p>
          <p className="text-[13px] text-ink-muted">
            {startup.profiles?.college}
            {startup.commitment ? ` · ${commitmentLabels[startup.commitment]}` : ""}
            {startup.equity_offered ? ` · ${startup.equity_offered} equity` : ""}
          </p>
        </div>
        {isOwner ? (
          <div className="flex items-center gap-3">
            {startup.open_roles > 0 && (
              <Button variant="outline" size="md" href={`/startups/${startup.id}/applicants`}>
                <Inbox size={16} /> View applicants
              </Button>
            )}
            <span className="rounded-full bg-background px-3 py-1.5 text-[12px] text-ink-muted">
              This is your listing
            </span>
          </div>
        ) : myApplication ? (
          <div className="text-right">
            <span
              className={`rounded-full border px-3 py-1.5 text-[12px] ${applicationStatusStyles[myApplication.status]}`}
            >
              {applicationStatusLabels[myApplication.status]}
            </span>
            <div className="mt-1.5">
              <WithdrawButton applicationId={myApplication.id} startupId={startup.id} />
            </div>
          </div>
        ) : user ? (
          <ApplyForm startupId={startup.id} />
        ) : (
          <Button variant="primary" size="md" href={`/login?next=/startups/${startup.id}`}>
            Log in to apply
          </Button>
        )}
      </div>
    </div>
    </>
  );
}
