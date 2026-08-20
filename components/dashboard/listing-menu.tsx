"use client";

import { useState, useTransition } from "react";
import { MoreVertical, Trash2 } from "lucide-react";
import { deleteStartup } from "@/app/startups/actions";

export function ListingMenu({
  startupId,
  startupName,
}: {
  startupId: string;
  startupName: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!window.confirm(`Delete "${startupName}"? This can't be undone.`)) return;
    startTransition(async () => {
      const res = await deleteStartup(startupId);
      if (res?.error) {
        alert(res.error);
      }
      setOpen(false);
    });
  }

  return (
    <div className="absolute right-4 top-14">
      <button
        type="button"
        aria-label="More options"
        onClick={(e) => {
          e.preventDefault();
          setOpen((v) => !v);
        }}
        className="rounded-full p-1 text-ink-muted transition-colors hover:bg-background hover:text-ink"
      >
        <MoreVertical size={16} />
      </button>
      {open && (
        <div className="absolute right-0 z-10 mt-1 w-40 rounded-xl border border-border bg-surface p-1 shadow-lg">
          <button
            type="button"
            disabled={pending}
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[13px] text-danger hover:bg-danger/10 disabled:opacity-50"
          >
            <Trash2 size={14} /> {pending ? "Deleting…" : "Delete listing"}
          </button>
        </div>
      )}
    </div>
  );
}
