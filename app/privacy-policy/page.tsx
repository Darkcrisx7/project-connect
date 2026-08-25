import { SiteNav } from "@/components/landing/site-nav";

export default function PrivacyPolicyPage() {
  return (
    <>
      <SiteNav />
      <div className="mx-auto max-w-2xl px-4 py-12 pb-28 sm:py-16 md:pb-16 text-[14px] leading-relaxed text-ink-muted">
        <h1 className="font-display text-2xl font-semibold text-ink">Privacy Policy</h1>
        <p className="mt-2 text-[13px]">Last updated: 20 August 2026</p>

        <p className="mt-6">
          Bangalore Teamup (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates the
          Bangalore Teamup platform (the &quot;Service&quot;), which helps student founders in
          India find co-founders and team members. This Privacy Policy explains what
          information we collect, how we use it, and the choices you have.
        </p>

        <h2 className="mt-8 font-display text-[17px] font-semibold text-ink">1. Information we collect</h2>
        <p className="mt-2">When you create an account and use the Service, we collect:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Account information: name, email address, mobile number, college/institution</li>
          <li>Profile information: role, skills, interests, availability, location, bio</li>
          <li>Content you post: startup listings, applications, messages sent through the platform</li>
          <li>Payment information: processed by our payment gateway partner — we do not store your card, UPI, or bank details ourselves</li>
          <li>Usage data: pages visited, actions taken, device/browser information, collected automatically</li>
        </ul>

        <h2 className="mt-8 font-display text-[17px] font-semibold text-ink">2. How we use your information</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>To create and manage your account</li>
          <li>To show your profile and listings to other users as intended by the Service</li>
          <li>To process applications and connect founders with applicants</li>
          <li>To process Pro subscription payments and manage billing</li>
          <li>To send you notifications about activity relevant to you (applications, status updates)</li>
          <li>To contact you about product updates, offers, or promotions — you can opt out at any time</li>
          <li>To maintain platform safety, including moderation and enforcement of our Terms</li>
        </ul>

        <h2 className="mt-8 font-display text-[17px] font-semibold text-ink">3. Sharing of information</h2>
        <p className="mt-2">We do not sell your personal information. We share data only with:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Other users, limited to what your profile/listing settings make visible (e.g. your listing is public; your direct contact details are only shared with founders/applicants after a connection is accepted)</li>
          <li>Service providers who help us operate the platform: our database and hosting provider, and our payment gateway for processing subscriptions</li>
          <li>Authorities, where required by law</li>
        </ul>

        <h2 className="mt-8 font-display text-[17px] font-semibold text-ink">4. Data retention</h2>
        <p className="mt-2">
          We retain your information for as long as your account is active. If you delete your
          account or request deletion, we remove your personal data within a reasonable period,
          except where retention is required for legal or accounting purposes.
        </p>

        <h2 className="mt-8 font-display text-[17px] font-semibold text-ink">5. Your rights</h2>
        <p className="mt-2">
          You can access, correct, or request deletion of your personal information at any time
          by contacting us at the email below. You can also update most profile details directly
          from your account settings.
        </p>

        <h2 className="mt-8 font-display text-[17px] font-semibold text-ink">6. Security</h2>
        <p className="mt-2">
          We use industry-standard measures, including encrypted connections and access controls,
          to protect your data. No method of transmission or storage is 100% secure, and we
          cannot guarantee absolute security.
        </p>

        <h2 className="mt-8 font-display text-[17px] font-semibold text-ink">7. Changes to this policy</h2>
        <p className="mt-2">
          We may update this Privacy Policy from time to time. We will post the updated version
          on this page with a revised &quot;Last updated&quot; date.
        </p>

        <h2 className="mt-8 font-display text-[17px] font-semibold text-ink">8. Contact us</h2>
        <p className="mt-2">
          For any privacy-related questions or requests, contact us at:{" "}
          <a href="mailto:myprojectconnect6@gmail.com" className="text-primary hover:underline">
            myprojectconnect6@gmail.com
          </a>
        </p>
      </div>
    </>
  );
}
