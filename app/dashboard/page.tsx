import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { signOut } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profile && !profile.onboarding_complete) {
    redirect(profile.role ? "/onboarding/profile" : "/onboarding/role");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 pb-28 sm:py-16 md:pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">
            Welcome, {profile?.full_name || "there"}
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

      <p className="mt-6 text-center text-[13px] text-ink-muted">
        Startup listings, discovery, and applications land in the next phase.
      </p>
    </div>
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
