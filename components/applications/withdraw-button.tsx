"use client";

import { useTransition } from "react";
import { withdrawApplication } from "@/app/applications/actions";

export function WithdrawButton({
  applicationId,
  startupId,
}: {
  applicationId: string;
  startupId: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await withdrawApplication(applicationId, startupId);
        })
      }
      className="text-[12px] text-ink-muted underline decoration-dotted hover:text-danger disabled:opacity-60"
    >
      {pending ? "Withdrawing…" : "Withdraw application"}
    </button>
  );
}
