import { AppHeader } from "@/components/layout/app-header";
import { Mail, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <>
      <AppHeader />
      <div className="mx-auto max-w-2xl px-4 py-12 pb-28 sm:py-16 md:pb-16">
        <h1 className="font-display text-2xl font-semibold text-ink">Contact Us</h1>
        <p className="mt-2 text-[14px] text-ink-muted">
          Have a question, a problem with your account, or feedback for us? We&apos;d love to
          hear from you.
        </p>

        <div className="mt-8 space-y-4">
          <div className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-5">
            <Mail size={18} className="mt-0.5 shrink-0 text-primary" />
            <div>
              <p className="font-display text-[15px] font-semibold text-ink">Email</p>
              <a href="mailto:myprojectconnect6@gmail.com" className="mt-1 block text-[14px] text-primary hover:underline">
                myprojectconnect6@gmail.com
              </a>
              <p className="mt-1 text-[13px] text-ink-muted">
                We typically respond within 1–2 business days.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-5">
            <MapPin size={18} className="mt-0.5 shrink-0 text-primary" />
            <div>
              <p className="font-display text-[15px] font-semibold text-ink">Based in</p>
              <p className="mt-1 text-[14px] text-ink-muted">Bengaluru, Karnataka, India</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
