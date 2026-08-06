"use client";

import { Suspense, useState, useTransition } from "react";
import Link from "next/link";
import { AuthShell, FieldError, inputClass } from "@/components/auth/auth-shell";
import { GoogleButton } from "@/components/auth/google-button";
import { Button } from "@/components/ui/button";
import { signInWithEmail } from "@/app/auth/actions";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();
  const params = useSearchParams();
  const checkEmail = params.get("check-email");

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to see your matches and applications."
      footer={
        <>
          New here?{" "}
          <Link href="/signup" className="font-medium text-primary">
            Create an account
          </Link>
        </>
      }
    >
      {checkEmail && (
        <p className="mb-4 rounded-lg bg-success/10 px-3 py-2 text-[13px] text-success">
          Check your inbox to confirm your email, then log in.
        </p>
      )}

      <GoogleButton />

      <div className="my-5 flex items-center gap-3 text-[12px] text-ink-muted">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>

      <form
        action={(formData) =>
          startTransition(async () => {
            const res = await signInWithEmail(formData);
            if (res?.error) setError(res.error);
          })
        }
        className="space-y-3"
      >
        <div>
          <input name="email" type="email" required placeholder="Email" className={inputClass} />
        </div>
        <div>
          <input name="password" type="password" required placeholder="Password" className={inputClass} />
        </div>
        <FieldError message={error} />
        <Button type="submit" variant="primary" size="md" className="w-full">
          {pending ? "Logging in…" : "Log in"}
        </Button>
      </form>
    </AuthShell>
  );
}
