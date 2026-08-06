"use client";

import { motion } from "framer-motion";
import { sampleStats, sampleTestimonials } from "@/lib/sample-data";
import { AnimatedCounter } from "@/components/landing/animated-counter";

export function StatsBand() {
  return (
    <section className="border-y border-border bg-primary py-14">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 sm:px-6 md:grid-cols-4">
        {sampleStats.map((stat) => (
          <div key={stat.label} className="text-center md:text-left">
            <p className="font-display text-3xl font-semibold text-primary-ink sm:text-4xl">
              <AnimatedCounter value={stat.value} />
              <span className="text-accent">+</span>
            </p>
            <p className="mt-1 text-[13px] text-primary-ink/70">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Testimonials() {
  return (
    <section id="stories" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <h2 className="mb-10 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        Teams that started here
      </h2>
      <div className="grid gap-4 md:grid-cols-3">
        {sampleTestimonials.map((t, i) => (
          <motion.figure
            key={t.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="flex flex-col rounded-2xl border border-border bg-surface p-6"
          >
            <blockquote className="text-[15px] leading-relaxed text-ink">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-5 border-t border-border pt-4">
              <p className="text-[14px] font-medium">{t.name}</p>
              <p className="text-[12px] text-ink-muted">
                {t.role} · {t.college}
              </p>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}

const faqs = [
  {
    q: "Is Project Connect only for engineers?",
    a: "No. Startups on the platform need designers, marketers, business and finance students, content creators and more — not just developers.",
  },
  {
    q: "Do I need a startup idea to join?",
    a: "Not at all. Most students join to find a team to work with, not to found something themselves.",
  },
  {
    q: "How do I contact a founder or applicant?",
    a: "You send a connection request first. Contact details only unlock after both sides accept — we never expose phone numbers directly.",
  },
  {
    q: "Is it free?",
    a: "Yes. Free accounts can create a profile, apply to a limited number of startups, and save listings. Premium removes the application limit and unlocks priority visibility.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="bg-surface py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="mb-10 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Questions, answered
        </h2>
        <div className="divide-y divide-border rounded-2xl border border-border bg-background">
          {faqs.map((item) => (
            <details key={item.q} className="group p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-medium">
                {item.q}
                <span className="shrink-0 text-ink-muted transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-[14px] leading-relaxed text-ink-muted">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
