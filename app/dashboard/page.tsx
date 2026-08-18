import { createClient } from "@/lib/supabase/server";
import { ensureProfile } from "@/lib/supabase/ensure-profile";
import { redirect } from "next/navigation";
import { signOut } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { StartupCard } from "@/components/discover/startup-card";
import { UpgradeButton } from "@/components/premium/upgrade-button";
import { isPremium } from "@/lib/premium";
import { Plus, Compass, Inbox, Sparkles, Rocket, Crown, Code2, Heart, Clock, MapPin } from "lucide-react";
import type { Startup } from "@/lib/startup-constants";
import { AppHeader } from "@/components/layout/app-header";

function getGreeting() {
  // Compute in IST regardless of server timezone, since the audience is India-based.
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
      <div className="mx-auto max-w-2xl px-4 py-12 pb-28 sm:py-16 md:pb-16">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold">
              {getGreeting()}, {profile?.full_name || "there"} 👋
            </h1>
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

        <div className="relative mt-8 overflow-hidden rounded-2xl border border-border bg-surface p-6">
          {/* Decorative gradient blob */}
          <div
            className={`pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl ${
              pro ? "bg-primary/25" : "bg-accent/20"
            }`}
          />
          <div className="relative flex items-start justify-between gap-4">
            <div>
              {pro ? (
                <>
                  <h2 className="flex items-center gap-1.5 font-display text-[15px] font-semibold">
                    <Sparkles size={16} className="text-accent" /> You&apos;re on Pro
                  </h2>
                  <p className="mt-1.5 text-[13px] text-ink-muted">
                    Unlimited listings and applications, active until{" "}
                    {new Date(profile.premium_until!).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                    .
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
            <div
              className={`hidden shrink-0 items-center justify-center rounded-2xl p-4 sm:flex ${
                pro ? "bg-primary/15" : "bg-accent/15"
              }`}
            >
              {pro ? (
                <Crown size={32} className="text-primary" />
              ) : (
                <Rocket size={32} className="text-accent" />
              )}
            </div>
          </div>
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
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary font-display text-[15px] font-semibold text-primary-ink">
              {initials(profile?.full_name || "?")}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="font-display text-[15px] font-semibold truncate">
                  {profile?.full_name || "Your profile"}
                </h2>
                {pro && (
                  <span className="flex shrink-0 items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[10px] text-accent-ink">
                    <Sparkles size={10} /> Pro
                  </span>
                )}
              </div>
              <p className="text-[13px] text-ink-muted truncate">
                {profile?.role?.replace("_", "-")} · {profile?.college}
              </p>
            </div>
          </div>

          <dl className="mt-5 space-y-3 text-[14px]">
            <Row icon={<Code2 size={14} />} label="Skills" value={profile?.skills?.join(", ") || "—"} />
            <Row icon={<Heart size={14} />} label="Interests" value={profile?.interests?.join(", ") || "—"} />
            <Row icon={<Clock size={14} />} label="Availability" value={profile?.availability || "—"} />
            <Row icon={<MapPin size={14} />} label="Location" value={profile?.location || "—"} />
          </dl>
        </div>
      </div>
    </>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border pb-3 last:border-0 last:pb-0">
      <dt className="flex items-center gap-1.5 text-ink-muted">
        {icon}
        {label}
      </dt>
      <dd className="text-right">{value}</dd>
    </div>
  );
}
