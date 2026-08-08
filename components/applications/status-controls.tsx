"use client";

import { useState, useTransition } from "react";
import { updateApplicationStatus } from "@/app/applications/actions";

const options = [
  { value: "shortlisted" as const, label: "Shortlist" },
  { value: "accepted" as const, label: "Accept" },
  { value: "rejected" as const, label: "Reject" },
];

export function StatusControls({
  applicationId,
  startupId,
  currentStatus,
}: {
  applicationId: string;
  startupId: string;
  currentStatus: string;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string>();

  return (
    <div className="flex flex-wrap items-center gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          disabled={pending || currentStatus === opt.value}
          onClick={() =>
            startTransition(async () => {
              setError(undefined);
              const res = await updateApplicationStatus(applicationId, opt.value, startupId);
              if (res?.error) setError(res.error);
            })
          }
          className="rounded-full border border-border bg-background px-3.5 py-1.5 text-[12px] font-medium transition-colors hover:border-primary disabled:cursor-not-allowed disabled:opacity-40"
        >
          {opt.label}
        </button>
      ))}
      {error && <span className="text-[12px] text-danger">{error}</span>}
    </div>
  );
}
