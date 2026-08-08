"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { FieldError, inputClass } from "@/components/auth/auth-shell";
import { createStartup } from "@/app/startups/actions";
import { industries, stages, workModes, roleCommitments } from "@/lib/startup-constants";

const label = "mb-1.5 block text-[13px] font-medium text-ink-muted";
const textareaClass = `${inputClass} h-auto py-3`;

export default function NewStartupPage() {
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  return (
    <div className="mx-auto max-w-xl px-4 py-12 pb-28 sm:py-16 md:pb-16">
      <h1 className="font-display text-2xl font-semibold">Post your idea</h1>
      <p className="mt-2 text-[14px] text-ink-muted">
        Ten minutes, no pitch deck required. You can edit this later.
      </p>

      <form
        action={(formData) =>
          startTransition(async () => {
            const res = await createStartup(formData);
            if (res?.error) setError(res.error);
          })
        }
        className="mt-8 space-y-5"
      >
        <div>
          <label className={label}>Startup name</label>
          <input name="name" required placeholder="e.g. Fasal Mitra" className={inputClass} />
        </div>

        <div>
          <label className={label}>One-line pitch</label>
          <input
            name="pitch"
            required
            maxLength={160}
            placeholder="Crop advisory over WhatsApp for small farmers"
            className={inputClass}
          />
        </div>

        <div>
          <label className={label}>Problem (optional)</label>
          <textarea name="problem" rows={2} className={textareaClass} />
        </div>

        <div>
          <label className={label}>Solution (optional)</label>
          <textarea name="solution" rows={2} className={textareaClass} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={label}>Stage</label>
            <select name="stage" required defaultValue="idea" className={inputClass}>
              {stages.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={label}>Industry</label>
            <select name="industry" required defaultValue="" className={inputClass}>
              <option value="" disabled>Select</option>
              {industries.map((i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={label}>City</label>
            <input name="location" placeholder="e.g. Bengaluru" className={inputClass} />
          </div>
          <div>
            <label className={label}>Work mode</label>
            <select name="workMode" required defaultValue="remote" className={inputClass}>
              {workModes.map((w) => (
                <option key={w.value} value={w.value}>{w.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={label}>Roles you need (comma separated)</label>
          <input
            name="requiredSkills"
            placeholder="Backend Engineer, Growth Marketer"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={label}>Number of open roles</label>
            <input name="openRoles" type="number" min={1} max={20} defaultValue={1} required className={inputClass} />
          </div>
          <div>
            <label className={label}>Commitment</label>
            <select name="commitment" defaultValue="" className={inputClass}>
              <option value="">Not specified</option>
              {roleCommitments.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={label}>Equity offered (optional)</label>
            <input name="equityOffered" placeholder="e.g. 5-10%" className={inputClass} />
          </div>
          <div>
            <label className={label}>Current team size</label>
            <input name="teamSize" type="number" min={1} max={50} defaultValue={1} required className={inputClass} />
          </div>
        </div>

        <div>
          <label className={label}>Application deadline (optional)</label>
          <input name="applicationDeadline" type="date" className={inputClass} />
        </div>

        <FieldError message={error} />

        <Button type="submit" variant="primary" size="lg" className="w-full">
          {pending ? "Posting…" : "Post startup"}
        </Button>
      </form>
    </div>
  );
}
