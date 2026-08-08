"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { FieldError, inputClass } from "@/components/auth/auth-shell";
import { applyToStartup } from "@/app/applications/actions";

const textareaClass = `${inputClass} h-auto py-3`;

export function ApplyForm({ startupId }: { startupId: string }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string>();
  const [submitted, setSubmitted] = useState(false);
  const [pending, startTransition] = useTransition();

  if (submitted) {
    return (
      <p className="rounded-lg bg-success/10 px-4 py-2.5 text-[13px] text-success">
        Application sent — you&apos;ll be notified if the founder responds.
      </p>
    );
  }

  if (!open) {
    return (
      <Button variant="primary" size="md" onClick={() => setOpen(true)}>
        Apply
      </Button>
    );
  }

  return (
    <form
      action={(formData) =>
        startTransition(async () => {
          const res = await applyToStartup(formData);
          if (res?.error) setError(res.error);
          else setSubmitted(true);
        })
      }
      className="w-full space-y-3"
    >
      <input type="hidden" name="startupId" value={startupId} />
      <div>
        <label className="mb-1.5 block text-[13px] font-medium text-ink-muted">
          Short introduction
        </label>
        <textarea
          name="intro"
          required
          rows={2}
          maxLength={500}
          placeholder="Who you are and what you've built"
          className={textareaClass}
        />
      </div>
      <div>
        <label className="mb-1.5 block text-[13px] font-medium text-ink-muted">
          Why this startup?
        </label>
        <textarea
          name="whyJoin"
          required
          rows={2}
          maxLength={500}
          placeholder="Why you want to join this specific team"
          className={textareaClass}
        />
      </div>
      <FieldError message={error} />
      <div className="flex gap-2">
        <Button type="submit" variant="primary" size="md">
          {pending ? "Sending…" : "Send application"}
        </Button>
        <Button type="button" variant="outline" size="md" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
