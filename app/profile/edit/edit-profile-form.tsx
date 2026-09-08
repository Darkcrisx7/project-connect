"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { FieldError, inputClass } from "@/components/auth/auth-shell";
import { updateProfile } from "@/app/profile/actions";

type Profile = {
  college: string | null;
  course: string | null;
  year: string | null;
  location: string | null;
  phone_number: string | null;
  bio: string | null;
  skills: string[] | null;
  interests: string[] | null;
  preferred_role: string | null;
  availability: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
};

const label = "mb-1.5 block text-[13px] font-medium text-ink-muted";

export function EditProfileForm({ profile }: { profile: Profile }) {
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(formData) =>
        startTransition(async () => {
          const res = await updateProfile(formData);
          if (res?.error) setError(res.error);
        })
      }
      className="mt-8 space-y-5"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label}>College</label>
          <input
            name="college"
            required
            defaultValue={profile.college ?? ""}
            placeholder="e.g. IIT Bombay"
            className={inputClass}
          />
        </div>
        <div>
          <label className={label}>Course</label>
          <input
            name="course"
            required
            defaultValue={profile.course ?? ""}
            placeholder="e.g. B.Tech CSE"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label}>Year</label>
          <select name="year" required defaultValue={profile.year ?? ""} className={inputClass}>
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
          <input
            name="location"
            required
            defaultValue={profile.location ?? ""}
            placeholder="e.g. Bengaluru"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={label}>Mobile number</label>
        <input
          name="phoneNumber"
          type="tel"
          inputMode="numeric"
          required
          defaultValue={profile.phone_number ?? ""}
          placeholder="10-digit mobile number"
          className={inputClass}
        />
        <p className="mt-1 text-[12px] text-ink-muted">
          Needed for payment receipts if you ever upgrade to Pro. We won&apos;t share it publicly.
        </p>
      </div>

      <div>
        <label className={label}>Short bio</label>
        <textarea
          name="bio"
          rows={3}
          maxLength={400}
          defaultValue={profile.bio ?? ""}
          placeholder="What have you built or worked on?"
          className={`${inputClass} h-auto py-3`}
        />
      </div>

      <div>
        <label className={label}>Skills (comma separated)</label>
        <input
          name="skills"
          defaultValue={(profile.skills ?? []).join(", ")}
          placeholder="React, Figma, Growth Marketing"
          className={inputClass}
        />
      </div>

      <div>
        <label className={label}>Interests (comma separated)</label>
        <input
          name="interests"
          defaultValue={(profile.interests ?? []).join(", ")}
          placeholder="FinTech, Climate, EdTech"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label}>Preferred role</label>
          <input
            name="preferredRole"
            defaultValue={profile.preferred_role ?? ""}
            placeholder="e.g. Frontend Developer"
            className={inputClass}
          />
        </div>
        <div>
          <label className={label}>Availability</label>
          <select
            name="availability"
            required
            defaultValue={profile.availability ?? ""}
            className={inputClass}
          >
            <option value="" disabled>Select</option>
            <option value="part_time">Part-time</option>
            <option value="full_time">Full-time</option>
            <option value="exploring">Just exploring</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <input
          name="githubUrl"
          defaultValue={profile.github_url ?? ""}
          placeholder="GitHub URL (optional)"
          className={inputClass}
        />
        <input
          name="linkedinUrl"
          defaultValue={profile.linkedin_url ?? ""}
          placeholder="LinkedIn URL (optional)"
          className={inputClass}
        />
        <input
          name="portfolioUrl"
          defaultValue={profile.portfolio_url ?? ""}
          placeholder="Portfolio URL (optional)"
          className={inputClass}
        />
      </div>

      <FieldError message={error} />

      <Button type="submit" variant="primary" size="lg" className="w-full">
        {pending ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
