import { SiteNav } from "@/components/landing/site-nav";
import { Check } from "lucide-react";

const freeFeatures = [
  "1 active startup listing",
  "3 applications per month",
  "Discover and browse startups",
  "Basic profile",
];

const proFeatures = [
  "Unlimited active listings",
  "Unlimited applications",
  "Premium discovery features",
  "Priority visibility for your listings",
];

export default function PricingPage() {
  return (
    <>
      <SiteNav />
      <div className="mx-auto max-w-2xl px-4 py-12 pb-28 sm:py-16 md:pb-16">
        <h1 className="font-display text-2xl font-semibold text-ink">Pricing</h1>
        <p className="mt-2 text-[14px] text-ink-muted">
          Simple pricing for student founders. Start free, upgrade whenever you need more.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="font-display text-[17px] font-semibold text-ink">Free</h2>
            <p className="mt-1 text-[28px] font-semibold text-ink">₹0</p>
            <p className="text-[13px] text-ink-muted">forever</p>
            <ul className="mt-5 space-y-2.5">
              {freeFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2 text-[14px] text-ink-muted">
                  <Check size={16} className="mt-0.5 shrink-0 text-success" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-primary/40 bg-surface p-6">
            <h2 className="flex items-center gap-2 font-display text-[17px] font-semibold text-ink">
              Pro
            </h2>
            <p className="mt-1 text-[28px] font-semibold text-ink">
              ₹79 <span className="text-[15px] font-normal text-ink-muted">/ month (INR)</span>
            </p>
            <p className="text-[13px] text-ink-muted">billed monthly, no auto-renewal</p>
            <ul className="mt-5 space-y-2.5">
              {proFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2 text-[14px] text-ink-muted">
                  <Check size={16} className="mt-0.5 shrink-0 text-primary" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-6 text-[13px] text-ink-muted">
          All prices are in Indian Rupees (INR) and inclusive of applicable taxes. See our{" "}
          <a href="/refund-policy" className="text-primary hover:underline">
            Refund &amp; Cancellation Policy
          </a>{" "}
          for billing details.
        </p>
      </div>
    </>
  );
}
