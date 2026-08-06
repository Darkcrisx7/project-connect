import Link from "next/link";
import { brand } from "@/config/brand";
import type { ReactNode } from "react";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="grid-texture flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-display text-sm font-semibold text-primary-ink">
            {brand.logoInitial}
          </span>
          <span className="font-display text-[17px] font-semibold tracking-tight">
            {brand.name}
          </span>
        </Link>

        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-7">
          <h1 className="font-display text-xl font-semibold">{title}</h1>
          <p className="mt-1 text-[14px] text-ink-muted">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>

        <p className="mt-6 text-center text-[13px] text-ink-muted">{footer}</p>
      </div>
    </div>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-[12px] text-danger">{message}</p>;
}

export const inputClass =
  "h-12 w-full rounded-xl border border-border bg-background px-4 text-[15px] outline-none transition-colors focus:border-primary";
