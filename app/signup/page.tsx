"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { AuthShell, FieldError, inputClass } from "@/components/auth/auth-shell";
import { GoogleButton } from "@/components/auth/google-button";
import { Button } from "@/components/ui/button";
import { signUpWithEmail } from "@/app/auth/actions";
export default function SignupPage() {
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();
  return (
    <AuthShell
      title="Create your account"
      subtitle="Free to join. Takes about two minutes."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary">
            Log in
          </Link>
        </>
      }
    >
      <GoogleButton />
      <div className="my-5 flex items-center gap-3 text-[12px] text-ink-muted">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>
      <form
        action={(formData) =>
          startTransition(async () => {
            const res = await signUpWithEmail(formData);
            if (res?.error) setError(res.error);
          })
        }
        className="space-y-3"
      >
        <input name="fullName" type="text" required placeholder="Full name" className={inputClass} />
        <input name="email" type="email" required placeholder="Email" className={inputClass} />
        <input
          name="phoneNumber"
          type="tel"
          required
          placeholder="Mobile number"
          pattern="[0-9+ ]{10,15}"
          className={inputClass}
        />
        <input
          name="password"
          type="password"
          required
          minLength={8}
          placeholder="Password (min. 8 characters)"
          className={inputClass}
        />
        <FieldError message={error} />
        <Button type="submit" variant="primary" size="md" className="w-full">
          {pending ? "Creating account…" : "Create account"}
        </Button>
      </form>
      <p className="mt-4 text-center text-[12px] text-ink-muted">
        By joining you agree to keep your profile honest — no fake startups,
        no fake skills.
      </p>
    </AuthShell>
  );
}
