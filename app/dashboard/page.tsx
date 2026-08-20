import { createClient } from "@/lib/supabase/server";
import { ensureProfile } from "@/lib/supabase/ensure-profile";
import { redirect } from "next/navigation";
import { signOut } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { StartupCard } from "@/components/discover/startup-card";
import { UpgradeButton } from "@/components/premium/upgrade-button";
import { isPremium } from "@/lib/premium";
import {
  Plus,
  Compass,
  Inbox,
  Sparkles,
  Rocket,
  Crown,
  Code2,
  Heart,
  Clock,
  MapPin,
  BarChart3,
  User,
  MoreVertical,
} from "lucide-react";
import type { Startup } from "@/lib/startup-constants";
import { AppHeader } from "@/components/layout/app-header";

function getGreeting() {
  const istHour = Number(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata", hour: "2-digit", hour12: false })
  );
  if (istHour < 12) return "Good morning";
  if (istHour < 17) return "Good afternoon";
  return "Good evening";
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

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
      <div className="mx-auto max-w-5xl px-4 py-12 pb-28 sm:py-16 md:pb-16">
        {/* Hero row */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold sm:text-[28px]">
              {getGreeting()}, {profile?.full_name || "there"} 👋
            </h1>
            <p className="mt-1 text-[14px] text-ink-muted">
              {profile?.role?.replace("_", "-")} · {profile?.college}
            </p>
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
          </div>

          {/* Decorative hero composition */}
          <div className="relative hidden h-44 w-64 shrink-0 items-center justify-center sm:flex">
            <div className="absolute h-32 w-32 rounded-full bg-primary/25 blur-3xl" />
            <div className="absolute left-0 top-2 flex h-14 w-14 -rotate-6 items-center justify-center rounded-2xl border border-border bg-surface shadow-lg">
              <BarChart3 size={22} className="text-primary" />
            </div>
            <div className="absolute right-2 top-0 flex h-12 w-12 rotate-6 items-center justify-center rounded-2xl border border-border bg-surface shadow-lg">
              <User size={20} className="text-accent" />
            </div>
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-primary/40 bg-gradient-to-br from-primary to-primary/60 shadow-[0_0_40px_-8px_rgba(91,76,255,0.6)]">
              <Rocket size={36} className="text-primary-ink" />
            </div>
          </div>

          <form action={signOut} className="lg:self-start">
            <Button variant="outline" size="sm" type="submit">
              Log out
            </Button>
          </form>
        </div>

        {/* Plan card */}
        <div className="relative mt-8 overflow-hidden rounded-2xl border border-border bg-surface p-6 sm:p-8">
          <div
            className={`pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full blur-3xl ${
              pro ? "bg-primary/25" : "bg-accent/20"
            }`}
          />
          <div className="relative flex items-center justify-between gap-6">
            <div>
              {pro ? (
                <>
                  <h2 className="flex items-center gap-1.5 font-display text-[16px] font-semibold">
                    <Crown size={16} className="text-primary" /> You&apos;re on Pro
                  </h2>
                  <p className="mt-1.5 max-w-md text-[13px] text-ink-muted">
                    Unlimited listings, applications and premium discovery features.
                  </p>
                  <p className="mt-3 text-[12px] text-ink-muted">
                    Active until{" "}
                    {new Date(profile.premium_until!).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <div className="mt-4">
                    <UpgradeButton
                      userEmail={profile.email}
                      userName={profile.full_name || ""}
                      label="Extend for ₹79"
                      loadingLabel="Opening checkout…"
                    />
                  </div>
                </>
              ) : (
                <>
                  <h2 className="font-display text-[16px] font-semibold">Free plan</h2>
                  <p className="mt-1.5 max-w-md text-[13px] text-ink-muted">
                    1 active listing and 3 applications a month. Upgrade to Pro for
                    unlimited listings and unlimited applications.
                  </p>
                  <div className="mt-4">
                    <UpgradeButton userEmail={profile.email} userName={profile.full_name || ""} />
                  </div>
                </>
              )}
            </div>
            <div
              className={`relative hidden shrink-0 h-28 w-28 items-center justify-center rounded-full sm:flex ${
                pro ? "bg-primary/15" : "bg-accent/15"
              }`}
            >
              <div className="absolute h-full w-full animate-pulse rounded-full border border-current opacity-20" />
              {pro ? (
                <Crown size={44} className="text-primary" />
              ) : (
                <Rocket size={44} className="text-accent" />
              )}
            </div>
          </div>
        </div>

        {/* Two-column: listings + profile */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="flex items-center gap-2 font-display text-[15px] font-semibold">
              <Rocket size={16} className="text-primary" /> Your listings
            </h2>
            {myStartups && myStartups.length > 0 ? (
              <div className="mt-4 space-y-4">
                {myStartups.map((s) => (
                  <div key={s.id} className="relative">
                    <StartupCard startup={s} />
                    <button
                      type="button"
                      aria-label="More options"
                      className="absolute right-4 top-4 rounded-full p-1 text-ink-muted transition-colors hover:bg-background hover:text-ink"
                    >
                      <MoreVertical size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-[13px] text-ink-muted">
                You haven&apos;t posted an idea yet.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="flex items-center gap-2 font-display text-[15px] font-semibold">
              <User size={16} className="text-primary" /> Your profile
            </h2>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/60 font-display text-[17px] font-semibold text-primary-ink">
                {initials(profile?.full_name || "?")}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-display text-[15px] font-semibold truncate">
                    {profile?.full_name || "Your profile"}
                  </h3>
                  {pro && (
                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[10px] text-accent-ink">
                      <Sparkles size={10} /> Pro
                    </span>
                  )}
                </div>
                <p className="text-[13px] text-ink-muted truncate">
                  {profile?.role?.replace("_", "-")} · {profile?.college}
                </p>
                {profile?.location && (
                  <p className="mt-0.5 flex items-center gap-1 text-[12px] text-ink-muted">
                    <MapPin size={11} /> {profile.location}
                  </p>
                )}
              </div>
            </div>

            {profile?.bio && (
              <p className="mt-4 text-[13px] leading-relaxed text-ink-muted">{profile.bio}</p>
            )}

            <dl className="mt-5 space-y-3 text-[14px]">
              <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
                <dt className="flex items-center gap-1.5 shrink-0 text-ink-muted">
                  <Code2 size={14} /> Skills
                </dt>
                <dd className="flex flex-wrap justify-end gap-1.5">
                  {profile?.skills && profile.skills.length > 0 ? (
                    profile.skills.map((skill: string) => (
                      <span
                        key={skill}
                        className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] text-primary"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-ink-muted">—</span>
                  )}
                </dd>
              </div>
              <Row icon={<Heart size={14} />} label="Interests" value={profile?.interests?.join(", ") || "—"} />
              <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
                <dt className="flex items-center gap-1.5 text-ink-muted">
                  <Clock size={14} /> Availability
                </dt>
                <dd>
                  {profile?.availability ? (
                    <span className="rounded-full bg-success/10 px-2.5 py-0.5 text-[11px] text-success">
                      {profile.availability}
                    </span>
                  ) : (
                    "—"
                  )}
                </dd>
              </div>
              <Row icon={<MapPin size={14} />} label="Location" value={profile?.location || "—"} isLast />
            </dl>
          </div>
        </div>
      </div>
    </>
  );
}

function Row({
  icon,
  label,
  value,
  isLast,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  isLast?: boolean;
}) {
  return (
    <div className={`flex justify-between gap-4 pb-3 ${isLast ? "" : "border-b border-border"}`}>
      <dt className="flex items-center gap-1.5 text-ink-muted">
        {icon}
        {label}
      </dt>
      <dd className="text-right">{value}</dd>
    </div>
  );
}
