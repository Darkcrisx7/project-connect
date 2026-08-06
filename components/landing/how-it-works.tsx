"use client";

import { motion } from "framer-motion";
import { NotebookPen, Users2, Hammer } from "lucide-react";

const steps = [
  {
    icon: NotebookPen,
    title: "Sketch the idea",
    body: "Post your startup idea with the problem, the stage it's at, and the roles you're missing. Takes ten minutes, no pitch deck required.",
  },
  {
    icon: Users2,
    title: "Match with your team",
    body: "Students who fit — by skill, interest, and college — can find and apply to your listing. You review, shortlist, and accept.",
  },
  {
    icon: Hammer,
    title: "Build together",
    body: "Once you're connected, contact details unlock and you take it from the app into a real working session.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <div className="mb-14 max-w-lg">
        <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          From notebook to team, in three steps
        </h2>
      </div>

      <div className="relative grid gap-6 md:grid-cols-3">
        <div
          aria-hidden
          className="absolute left-0 right-0 top-11 hidden h-px bg-border md:block"
        />
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="relative rounded-2xl border border-border bg-surface p-6"
          >
            <div className="relative z-10 flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-ink">
              <step.icon size={20} />
            </div>
            <p className="mt-5 font-mono text-xs text-ink-muted">
              STEP {i + 1}
            </p>
            <h3 className="mt-1 font-display text-lg font-semibold">
              {step.title}
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">
              {step.body}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
