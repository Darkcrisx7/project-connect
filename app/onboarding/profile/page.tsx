"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { FieldError, inputClass } from "@/components/auth/auth-shell";
import { saveProfile } from "@/app/onboarding/actions";

const label = "mb-1.5 block text-[13px] font-medium text-ink-muted";

export default function ProfilePage() {
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:py-16">
      <h1 className="font-display text-2xl font-semibold">Build your profile</h1>
      <p className="mt-2 text-[14px] text-ink-muted">
        This is what founders and teammates see. Be specific — &ldquo;React Native,
        shipped 1 app&rdquo; beats &ldquo;good at coding.&rdquo;
      </p>

      <form
        action={(formData) =>
          startTransition(async () => {
            const res = await saveProfile(formData);
            if (res?.error) setError(res.error);
          })
        }
        className="mt-8 space-y-5"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={label}>College</label>
            <input name="college" required placeholder="e.g. IIT Bombay" className={inputClass} />
          </div>
          <div>
            <label className={label}>Course</label>
            <input name="course" required placeholder="e.g. B.Tech CSE" className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={label}>Year</label>
            <select name="year" required className={inputClass} defaultValue="">
              <option value="" disabled>Select year</option>
              <option value="1st year">1st year</option>
              <option value="2nd year">2nd year</option>
              <option value="3rd year">3rd year</option>
              <option value="4th year">4th year</option>
              <option value="Graduate">Graduate</option>
              <option value="Postgraduate">Postgraduate</option>
            </select>
          </div>
          <div>
            <label className={label}>City</label>
            <input name="location" required placeholder="e.g. Bengaluru" className={inputClass} />
          </div>
        </div>

        <div>
          <label className={label}>Short bio</label>
          <textarea
            name="bio"
            rows={3}
            maxLength={400}
            placeholder="What have you built or worked on?"
            className={`${inputClass} h-auto py-3`}
          />
        </div>

        <div>
          <label className={label}>Skills (comma separated)</label>
          <input name="skills" placeholder="React, Figma, Growth Marketing" className={inputClass} />
        </div>

        <div>
          <label className={label}>Interests (comma separated)</label>
          <input name="interests" placeholder="FinTech, Climate, EdTech" className={inputClass} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={label}>Preferred role</label>
            <input name="preferredRole" placeholder="e.g. Frontend Developer" className={inputClass} />
          </div>
          <div>
            <label className={label}>Availability</label>
            <select name="availability" required className={inputClass} defaultValue="">
              <option value="" disabled>Select</option>
              <option value="part_time">Part-time</option>
              <option value="full_time">Full-time</option>
              <option value="exploring">Just exploring</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          <input name="githubUrl" placeholder="GitHub URL (optional)" className={inputClass} />
          <input name="linkedinUrl" placeholder="LinkedIn URL (optional)" className={inputClass} />
          <input name="portfolioUrl" placeholder="Portfolio URL (optional)" className={inputClass} />
        </div>

        <FieldError message={error} />

        <Button type="submit" variant="primary" size="lg" className="w-full">
          {pending ? "Saving…" : "Finish setting up"}
        </Button>
      </form>
    </div>
  );
}
