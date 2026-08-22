import { SiteNav } from "@/components/landing/site-nav";

export default function TermsPage() {
  return (
    <>
      <SiteNav />
      <div className="mx-auto max-w-2xl px-4 py-12 pb-28 sm:py-16 md:pb-16 text-[14px] leading-relaxed text-ink-muted">
        <h1 className="font-display text-2xl font-semibold text-ink">Terms &amp; Conditions</h1>
        <p className="mt-2 text-[13px]">Last updated: 20 August 2026</p>

        <p className="mt-6">
          These Terms &amp; Conditions (&quot;Terms&quot;) govern your use of Project Connect
          (the &quot;Service&quot;). By creating an account or using the Service, you agree to
          these Terms.
        </p>

        <h2 className="mt-8 font-display text-[17px] font-semibold text-ink">1. Eligibility</h2>
        <p className="mt-2">
          The Service is intended for students and recent graduates in India who are 18 years
          of age or older. By using the Service, you confirm that you meet this requirement.
        </p>

        <h2 className="mt-8 font-display text-[17px] font-semibold text-ink">2. Your account</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>You are responsible for the accuracy of the information you provide, including your name, contact details, and profile information</li>
          <li>You are responsible for keeping your login credentials secure</li>
          <li>You agree not to create fake listings, misrepresent your identity, or impersonate others</li>
        </ul>

        <h2 className="mt-8 font-display text-[17px] font-semibold text-ink">3. Acceptable use</h2>
        <p className="mt-2">You agree not to:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Post fraudulent, misleading, or fake startup listings or profiles</li>
          <li>Use the Service for spam, harassment, or unsolicited commercial messaging</li>
          <li>Attempt to interfere with, disrupt, or gain unauthorized access to the Service</li>
          <li>Use the Service for any unlawful purpose</li>
        </ul>
        <p className="mt-2">
          We reserve the right to remove content, suspend, or terminate accounts that violate
          these Terms, at our discretion.
        </p>

        <h2 className="mt-8 font-display text-[17px] font-semibold text-ink">4. Pro subscription</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>The Service offers a free plan and a paid &quot;Pro&quot; plan at ₹79 per month</li>
          <li>Pro subscriptions are billed monthly and do not auto-renew unless you explicitly extend them</li>
          <li>Prices are subject to change with reasonable notice</li>
          <li>See our Refund &amp; Cancellation Policy for details on cancellations and refunds</li>
        </ul>

        <h2 className="mt-8 font-display text-[17px] font-semibold text-ink">5. Content ownership</h2>
        <p className="mt-2">
          You retain ownership of the content you post (listings, profile information, messages).
          By posting content, you grant us a license to display it within the Service for the
          purpose of operating the platform.
        </p>

        <h2 className="mt-8 font-display text-[17px] font-semibold text-ink">6. No guarantee of outcomes</h2>
        <p className="mt-2">
          Project Connect is a platform that helps students discover and connect with potential
          co-founders and team members. We do not guarantee that you will find a team, a
          startup, or that any startup listed will succeed. Any agreements you make with other
          users (equity, roles, responsibilities) are solely between you and them.
        </p>

        <h2 className="mt-8 font-display text-[17px] font-semibold text-ink">7. Limitation of liability</h2>
        <p className="mt-2">
          The Service is provided &quot;as is&quot;. To the fullest extent permitted by law, we
          are not liable for any indirect, incidental, or consequential damages arising from your
          use of the Service, including disputes between users.
        </p>

        <h2 className="mt-8 font-display text-[17px] font-semibold text-ink">8. Governing law</h2>
        <p className="mt-2">
          These Terms are governed by the laws of India. Any disputes will be subject to the
          jurisdiction of the courts of India.
        </p>

        <h2 className="mt-8 font-display text-[17px] font-semibold text-ink">9. Contact us</h2>
        <p className="mt-2">
          For any questions about these Terms, contact us at:{" "}
          <a href="mailto:myprojectconnect6@gmail.com" className="text-primary hover:underline">
            myprojectconnect6@gmail.com
          </a>
        </p>
      </div>
    </>
  );
}
