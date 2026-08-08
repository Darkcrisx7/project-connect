"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { industries, stages, workModes } from "@/lib/startup-constants";
import { Search } from "lucide-react";
import { useTransition } from "react";

const selectClass =
  "h-11 rounded-xl border border-border bg-surface px-3 text-[14px] outline-none transition-colors focus:border-primary";

export function FiltersBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  }

  return (
    <div className="flex flex-wrap gap-2.5">
      <div className="relative min-w-[200px] flex-1">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
        <input
          defaultValue={searchParams.get("q") ?? ""}
          onChange={(e) => update("q", e.target.value)}
          placeholder="Search startups…"
          className={`${selectClass} w-full pl-9`}
        />
      </div>

      <select
        defaultValue={searchParams.get("industry") ?? ""}
        onChange={(e) => update("industry", e.target.value)}
        className={selectClass}
      >
        <option value="">All industries</option>
        {industries.map((i) => (
          <option key={i} value={i}>{i}</option>
        ))}
      </select>

      <select
        defaultValue={searchParams.get("stage") ?? ""}
        onChange={(e) => update("stage", e.target.value)}
        className={selectClass}
      >
        <option value="">Any stage</option>
        {stages.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>

      <select
        defaultValue={searchParams.get("workMode") ?? ""}
        onChange={(e) => update("workMode", e.target.value)}
        className={selectClass}
      >
        <option value="">Remote or not</option>
        {workModes.map((w) => (
          <option key={w.value} value={w.value}>{w.label}</option>
        ))}
      </select>

      <select
        defaultValue={searchParams.get("sort") ?? "newest"}
        onChange={(e) => update("sort", e.target.value)}
        className={selectClass}
      >
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
      </select>
    </div>
  );
}
