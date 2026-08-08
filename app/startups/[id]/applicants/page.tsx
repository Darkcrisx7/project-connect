import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Link as LinkIcon, Globe, Mail } from "lucide-react";
import {
  applicationStatusLabels,
  applicationStatusStyles,
  type Application,
} from "@/lib/application-constants";
import { StatusControls } from "@/components/applications/status-controls";

export default async function ApplicantsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: startup } = await supabase
    .from("startups")
    .select("id, name, founder_id")
    .eq("id", id)
    .single();

  if (!startup) notFound();
  if (startup.founder_id !== user.id) {
    redirect(`/startups/${id}`);
  }

  const { data: applications } = await supabase
    .from("applications")
    .select("*, profiles(full_name, college, avatar_url, skills, preferred_role, github_url, linkedin_url, portfolio_url)")
    .eq("startup_id", id)
    .order("created_at", { ascending: false })
    .returns<Application[]>();

  // Emails are fetched separately through a database function that only
  // returns a result for accepted applications — not selected directly off
  // profiles, so contact stays locked at the database level, not just the UI.
  const acceptedApplicantIds =
    applications?.filter((a) => a.status === "accepted").map((a) => a.applicant_id) ?? [];

  const emailByApplicantId = new Map<string, string>();
  for (const applicantId of acceptedApplicantIds) {
    const { data: email } = await supabase.rpc("get_contact_email", { other_id: applicantId });
    if (email) emailByApplicantId.set(applicantId, email);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 pb-28 sm:py-14 md:pb-14">
      <Link href={`/startups/${id}`} className="inline-flex items-center gap-1.5 text-[13px] text-ink-muted hover:text-ink">
        <ArrowLeft size={15} /> Back to listing
      </Link>

      <h1 className="mt-4 font-display text-2xl font-semibold">
        Applicants for {startup.name}
      </h1>
      <p className="mt-1 text-[14px] text-ink-muted">
        {applications?.length ?? 0} application{applications?.length === 1 ? "" : "s"}
      </p>

      {applications?.length === 0 && (
        <div className="mt-8 rounded-2xl border border-dashed border-border py-16 text-center">
          <p className="font-display text-lg font-semibold">No applications yet</p>
          <p className="mt-1 text-[14px] text-ink-muted">
            Share your listing to start getting applicants.
          </p>
        </div>
      )}

      <div className="mt-6 space-y-4">
        {applications?.map((app) => (
          <div key={app.id} className="rounded-2xl border border-border bg-surface p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-[15px] font-semibold">
                  {app.profiles?.full_name || "Applicant"}
                </p>
                <p className="text-[13px] text-ink-muted">
                  {app.profiles?.college}
                  {app.profiles?.preferred_role ? ` · ${app.profiles.preferred_role}` : ""}
                </p>
              </div>
              <span className={`rounded-full border px-2.5 py-0.5 text-[11px] ${applicationStatusStyles[app.status]}`}>
                {applicationStatusLabels[app.status]}
              </span>
            </div>

            {app.profiles?.skills && app.profiles.skills.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {app.profiles.skills.map((s) => (
                  <span key={s} className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] text-ink-muted">
                    {s}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-4 space-y-3 text-[14px]">
              <div>
                <p className="text-[12px] font-medium text-ink-muted">Introduction</p>
                <p className="mt-0.5 leading-relaxed">{app.intro}</p>
              </div>
              <div>
                <p className="text-[12px] font-medium text-ink-muted">Why they want to join</p>
                <p className="mt-0.5 leading-relaxed">{app.why_join}</p>
              </div>
            </div>

            {app.status === "accepted" && (
              <div className="mt-4 flex flex-wrap gap-3 rounded-xl bg-success/5 border border-success/20 px-3.5 py-3 text-[13px]">
                {emailByApplicantId.get(app.applicant_id) && (
                  <a href={`mailto:${emailByApplicantId.get(app.applicant_id)}`} className="flex items-center gap-1.5 text-success hover:underline">
                    <Mail size={14} /> {emailByApplicantId.get(app.applicant_id)}
                  </a>
                )}
                {app.profiles?.github_url && (
                  <a href={app.profiles.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-ink-muted hover:text-ink">
                    <LinkIcon size={14} /> GitHub
                  </a>
                )}
                {app.profiles?.linkedin_url && (
                  <a href={app.profiles.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-ink-muted hover:text-ink">
                    <LinkIcon size={14} /> LinkedIn
                  </a>
                )}
                {app.profiles?.portfolio_url && (
                  <a href={app.profiles.portfolio_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-ink-muted hover:text-ink">
                    <Globe size={14} /> Portfolio
                  </a>
                )}
              </div>
            )}

            <div className="mt-4">
              <StatusControls applicationId={app.id} startupId={id} currentStatus={app.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
