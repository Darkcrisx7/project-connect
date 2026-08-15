import { createClient } from "@/lib/supabase/server";
import { ensureProfile } from "@/lib/supabase/ensure-profile";
import { redirect } from "next/navigation";
import { signOut } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { StartupCard } from "@/components/discover/startup-card";
import { UpgradeButton } from "@/components/premium/upgrade-button";
import { isPremium } from "@/lib/premium";
import { Plus, Compass, Inbox, Sparkles } from "lucide-react";
import type { Startup } from "@/lib/startup-constants";
import { AppHeader } from "@/components/layout/app-header";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const profile = await ensureProfile(supabase, user);

  if (!profile || !profile.onboarding_complete) {
    redirect(profile?.role ? "/onboarding/profile" : "/onboarding/role");
  }

  const pro = isPremium(profile);

  const { data: myStartups } = await supabase
    .from("startups")
    .select("*, profiles(full_name, college, avatar_url)")
    .eq("founder_id", user.id)
    .order("created_at", { ascending: false })
    .returns<Startup[]>();

  return (
    <>
      <AppHeader />
      <div className="mx-auto max-w-2xl px-4 py-12 pb-28 sm:py-16 md:pb-16">
        <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-semibold">
              Welcome, {profile?.full_name || "there"}
            </h1>
            {pro && (
              <span className="flex items-center gap-1 rounded-full bg-accent/15 px-2.5 py-0.5 font-mono text-[11px] text-accent-ink">
                <Sparkles size={12} /> Pro
              </span>
            )}
          </div>
          <p className="mt-1 text-[14px] text-ink-muted">
            {profile?.role?.replace("_", "-")} · {profile?.college}
          </p>
        </div>
        <form action={signOut}>
          <Button variant="outline" size="sm" type="submit">
            Log out
          </Button>
        </form>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant="primary" size="md" href="/startups/new">
          <Plus size={18} /> Post your idea
        </Button>
        <Button variant="outline" size="md" href="/discover">
          <Compass size={18} /> Browse startups
        </Button>
        <Button variant="outline" size="md" href="/applications">
          <Inbox size={18} /> My applications
        </Button>
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
        {pro ? (
          <>
            <h2 className="flex items-center gap-1.5 font-display text-[15px] font-semibold">
              <Sparkles size={16} className="text-accent" /> You&apos;re on Pro
            </h2>
            <p className="mt-1.5 text-[13px] text-ink-muted">
              Unlimited listings and applications, active until{" "}
              {new Date(profile.premium_until!).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}.
            </p>
            <div className="mt-4">
              <UpgradeButton
                userEmail={profile.email}
                userName={profile.full_name || ""}
                label="Extend by another month — ₹79"
                loadingLabel="Opening checkout…"
                variant="outline"
              />
            </div>
          </>
        ) : (
          <>
            <h2 className="font-display text-[15px] font-semibold">Free plan</h2>
            <p className="mt-1.5 text-[13px] text-ink-muted">
              1 active listing and 3 applications a month. Upgrade to Pro for
              unlimited listings and unlimited applications.
            </p>
            <div className="mt-4">
              <UpgradeButton userEmail={profile.email} userName={profile.full_name || ""} />
            </div>
          </>
        )}
      </div>

      {myStartups && myStartups.length > 0 && (
        <div className="mt-8">
          <h2 className="font-display text-[15px] font-semibold">Your listings</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {myStartups.map((s) => (
              <StartupCard key={s.id} startup={s} />
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
        <h2 className="font-display text-[15px] font-semibold">Your profile</h2>
        <dl className="mt-4 space-y-3 text-[14px]">
          <Row label="Bio" value={profile?.bio || "—"} />
          <Row label="Skills" value={profile?.skills?.join(", ") || "—"} />
          <Row label="Interests" value={profile?.interests?.join(", ") || "—"} />
          <Row label="Availability" value={profile?.availability || "—"} />
          <Row label="Location" value={profile?.location || "—"} />
        </dl>
      </div>
    </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border pb-3 last:border-0 last:pb-0">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="text-right">{value}</dd>
    </div>
  );
}
