import { SiteNav } from "@/components/landing/site-nav";

export default function RefundPolicyPage() {
  return (
    <>
      <SiteNav />
      <div className="mx-auto max-w-2xl px-4 py-12 pb-28 sm:py-16 md:pb-16 text-[14px] leading-relaxed text-ink-muted">
        <h1 className="font-display text-2xl font-semibold text-ink">Refund &amp; Cancellation Policy</h1>
        <p className="mt-2 text-[13px]">Last updated: 20 August 2026</p>

        <p className="mt-6">
          This policy applies to the Project Connect &quot;Pro&quot; subscription (₹79/month).
          Please read it before purchasing.
        </p>

        <h2 className="mt-8 font-display text-[17px] font-semibold text-ink">1. Nature of the service</h2>
        <p className="mt-2">
          Pro is a digital subscription that unlocks unlimited listings, unlimited applications,
          and premium discovery features for the duration of the active billing period. Access
          begins immediately upon successful payment.
        </p>

        <h2 className="mt-8 font-display text-[17px] font-semibold text-ink">2. Cancellations</h2>
        <p className="mt-2">
          Pro does not auto-renew — each month is a one-time purchase that you extend manually
          from your dashboard when you choose to. There is nothing to &quot;cancel&quot;: if you
          don&apos;t extend, your Pro access simply ends on its expiry date and your account
          returns to the Free plan.
        </p>

        <h2 className="mt-8 font-display text-[17px] font-semibold text-ink">3. Refunds</h2>
        <p className="mt-2">
          Because Pro access is granted immediately and in full for the billing period, payments
          are generally non-refundable once processed. We make an exception in the following
          cases:
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>You were charged more than once for the same billing period (duplicate charge)</li>
          <li>A technical error on our end prevented you from accessing Pro features after payment</li>
          <li>You were charged but the payment did not go through correctly on our system (failed transaction still debited)</li>
        </ul>
        <p className="mt-2">
          To request a refund under one of these circumstances, email us within 7 days of the
          charge with your registered email and the payment reference number.
        </p>

        <h2 className="mt-8 font-display text-[17px] font-semibold text-ink">4. Refund processing time</h2>
        <p className="mt-2">
          Approved refunds are processed back to your original payment method within 5–7 business
          days, depending on your bank or payment provider.
        </p>

        <h2 className="mt-8 font-display text-[17px] font-semibold text-ink">5. Contact us</h2>
        <p className="mt-2">
          For billing questions or refund requests, contact us at:{" "}
          <a href="mailto:myprojectconnect6@gmail.com" className="text-primary hover:underline">
            myprojectconnect6@gmail.com
          </a>
        </p>
      </div>
    </>
  );
}
