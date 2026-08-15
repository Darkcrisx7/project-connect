import { createClient } from "@/lib/supabase/server";
import { StartupCard } from "@/components/discover/startup-card";
import { FiltersBar } from "@/components/discover/filters-bar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Suspense } from "react";
import type { Startup } from "@/lib/startup-constants";
import { AppHeader } from "@/components/layout/app-header";

type SearchParams = {
  q?: string;
  industry?: string;
  stage?: string;
  workMode?: string;
  sort?: string;
};

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("startups")
    .select("*, profiles(full_name, college, avatar_url)")
    .eq("is_active", true);

  if (params.q) {
    query = query.or(`name.ilike.%${params.q}%,pitch.ilike.%${params.q}%`);
  }
  if (params.industry) query = query.eq("industry", params.industry);
  if (params.stage) query = query.eq("stage", params.stage);
  if (params.workMode) query = query.eq("work_mode", params.workMode);

  query = query.order("created_at", { ascending: params.sort === "oldest" });

  const { data: startups, error } = await query.returns<Startup[]>();

  return (
    <>
      <AppHeader />
      <div className="mx-auto max-w-6xl px-4 py-10 pb-28 sm:py-14 md:pb-14">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Discover startups
          </h1>
          <p className="mt-1 text-[14px] text-ink-muted">
            {startups?.length ?? 0} team{startups?.length === 1 ? "" : "s"} looking for people right now.
          </p>
        </div>
        <Button variant="primary" size="md" href="/startups/new">
          <Plus size={18} /> Post your idea
        </Button>
      </div>

      <div className="mb-8">
        <Suspense fallback={<div className="h-11" />}>
          <FiltersBar />
        </Suspense>
      </div>

      {error && (
        <p className="rounded-lg bg-danger/10 px-4 py-3 text-[13px] text-danger">
          Couldn&apos;t load startups: {error.message}
        </p>
      )}

      {!error && startups?.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center">
          <p className="font-display text-lg font-semibold">No startups match yet</p>
          <p className="mt-1 text-[14px] text-ink-muted">
            Try clearing a filter, or be the first to post one.
          </p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {startups?.map((startup) => (
          <StartupCard key={startup.id} startup={startup} />
        ))}
      </div>
    </div>
    </>
  );
}
