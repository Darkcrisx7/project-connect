"use client";

import Link from "next/link";
import { brand } from "@/config/brand";
import { Button } from "@/components/ui/button";
import { Compass, Home, User, Rocket } from "lucide-react";

export function SiteNav() {
  return (
    <>
      {/* Top nav — desktop + mobile */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/70 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-display text-sm font-semibold text-primary-ink">
              {brand.logoInitial}
            </span>
            <span className="font-display text-[17px] font-semibold tracking-tight">
              {brand.name}
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#how-it-works" className="text-sm text-ink-muted hover:text-ink transition-colors">
              How it works
            </a>
            <a href="/discover" className="text-sm text-ink-muted hover:text-ink transition-colors">
              Discover startups
            </a>
            <a href="#stories" className="text-sm text-ink-muted hover:text-ink transition-colors">
              Stories
            </a>
            <a href="#faq" className="text-sm text-ink-muted hover:text-ink transition-colors">
              FAQ
            </a>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Button variant="ghost" size="sm" href="/login">
              Log in
            </Button>
            <Button variant="primary" size="sm" href="/signup">
              Join free
            </Button>
          </div>

          {/* Mobile: single compact CTA, primary nav lives in bottom bar */}
          <div className="md:hidden">
            <Button variant="primary" size="sm" href="/signup">
              Join
            </Button>
          </div>
        </div>
      </header>

      {/* Bottom nav — mobile only, native-app feel */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-surface/95 backdrop-blur-lg pb-[env(safe-area-inset-bottom)] md:hidden">
        <div className="mx-auto flex max-w-md items-center justify-around px-2">
          {[
            { icon: Home, label: "Home", href: "/" },
            { icon: Compass, label: "Discover", href: "/discover" },
            { icon: Rocket, label: "Post idea", href: "/startups/new" },
            { icon: User, label: "Profile", href: "/login" },
          ].map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              className="flex min-h-[48px] flex-1 flex-col items-center justify-center gap-0.5 py-2 text-ink-muted active:text-primary transition-colors"
            >
              <Icon size={20} strokeWidth={2} />
              <span className="text-[11px] font-medium">{label}</span>
            </a>
          ))}
        </div>
      </nav>
    </>
  );
}
