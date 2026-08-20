import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Mail, Inbox } from "lucide-react";
import {
  applicationStatusLabels,
  applicationStatusStyles,
  type Application,
} from "@/lib/application-constants";
import { WithdrawButton } from "@/components/applications/withdraw-button";
import { AppHeader } from "@/components/layout/app-header";
export default async function MyApplicationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: applications } = await supabase
    .from("applications")
    .select("*, startups(id, name, pitch, stage, founder_id, profiles(full_name))")
    .eq("applicant_id", user.id)
    .order("created_at", { ascending: false })
    .returns<Application[]>();
  // Founder contact is only resolved through a database function that
  // returns a result solely for accepted applications — contact stays
  // locked at the database level, not just hidden in the UI.
  const acceptedFounderIds =
    applications?.filter((a) => a.status === "accepted").map((a) => a.startups?.founder_id).filter((id): id is string => !!id) ?? [];
  const emailByFounderId = new Map<string, string>();
  for (const founderId of acceptedFounderIds) {
    const { data: email } = await supabase.rpc("get_contact_email", { other_id: founderId });
    if (email) emailByFounderId.set(founderId, email);
  }
  return (
    <>
      <AppHeader />
      <div className="mx-auto max-w-2xl px-4 py-10 pb-28 sm:py-14 md:pb-14">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/15">
            <Inbox size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-semibold">Your applications</h1>
            <p className="text-[14px] text-ink-muted">{applications?.length ?? 0} sent</p>
          </div>
        </div>

        {applications?.length === 0 && (
          <div className="mt-8 flex flex-col items-center rounded-2xl border border-dashed border-border py-16 text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-accent/15">
              <Inbox size={24} className="text-accent" />
            </div>
            <p className="font-display text-lg font-semibold">No applications yet</p>
            <p className="mt-1 text-[14px] text-ink-muted">
              <Link href="/discover" className="text-primary hover:underline">Browse startups</Link> and apply to ones that fit.
            </p>
          </div>
        )}

        <div className="mt-6 space-y-3">
          {applications?.map((app) => {
            const founderEmail = app.startups?.founder_id
              ? emailByFounderId.get(app.startups.founder_id)
              : undefined;
            return (
              <div
                key={app.id}
                className="rounded-2xl border border-border bg-surface p-5 transition-shadow hover:shadow-[0_8px_30px_-12px_rgba(91,76,255,0.25)]"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/50 font-display text-[17px] font-bold text-primary-ink">
                    {app.startups?.name?.charAt(0).toUpperCase() ?? "?"}
                  </div>
                  <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        href={`/startups/${app.startups?.id}`}
                        className="font-display text-[15px] font-semibold hover:text-primary"
                      >
                        {app.startups?.name}
                      </Link>
                      <p className="mt-0.5 text-[13px] text-ink-muted line-clamp-2">
                        {app.startups?.pitch}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] ${applicationStatusStyles[app.status]}`}
                    >
                      {applicationStatusLabels[app.status]}
                    </span>
                  </div>
                </div>
                {app.status === "accepted" && founderEmail && (
                  <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-success/5 border border-success/20 px-3 py-2 text-[13px] text-success">
                    <Mail size={14} />
                    <a href={`mailto:${founderEmail}`} className="hover:underline">
                      {app.startups?.profiles?.full_name || "Founder"} · {founderEmail}
                    </a>
                  </div>
                )}
                {app.status === "pending" && (
                  <div className="mt-3">
                    <WithdrawButton applicationId={app.id} startupId={app.startups?.id ?? ""} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
