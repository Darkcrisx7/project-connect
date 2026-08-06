import { brand } from "@/config/brand";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <div className="grid-texture relative overflow-hidden rounded-3xl border border-border bg-primary px-6 py-16 text-center sm:px-12">
        <h2 className="relative font-display text-3xl font-semibold tracking-tight text-primary-ink sm:text-5xl">
          Stop building alone.
        </h2>
        <p className="relative mx-auto mt-4 max-w-md text-primary-ink/75">
          Create your profile in under two minutes and see who&apos;s already
          looking for someone like you.
        </p>
        <div className="relative mt-8 flex justify-center">
          <Button variant="accent" size="lg" href="/signup">
            Join {brand.name} <ArrowRight size={18} />
          </Button>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border pb-24 pt-12 md:pb-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary font-display text-xs font-semibold text-primary-ink">
                {brand.logoInitial}
              </span>
              <span className="font-display text-[15px] font-semibold">
                {brand.name}
              </span>
            </div>
            <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-ink-muted">
              {brand.tagline}.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-8 text-[13px] sm:grid-cols-3">
            <div>
              <p className="font-medium text-ink">Platform</p>
              <ul className="mt-3 space-y-2 text-ink-muted">
                <li><a href="#how-it-works" className="hover:text-ink">How it works</a></li>
                <li><a href="#startups" className="hover:text-ink">Discover startups</a></li>
                <li><a href="/signup" className="hover:text-ink">Post an idea</a></li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-ink">Company</p>
              <ul className="mt-3 space-y-2 text-ink-muted">
                <li><a href="#stories" className="hover:text-ink">Stories</a></li>
                <li><a href="#faq" className="hover:text-ink">FAQ</a></li>
                <li><a href={`mailto:${brand.contact.email}`} className="hover:text-ink">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>

        <p className="mt-12 font-mono text-[11px] text-ink-muted">
          © {new Date().getFullYear()} {brand.name}. Built for student founders in India.
        </p>
      </div>
    </footer>
  );
}
