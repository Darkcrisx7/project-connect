"use client";

import { motion } from "framer-motion";
import { MapPin, Users } from "lucide-react";
import { sampleStartups } from "@/lib/sample-data";
import { Button } from "@/components/ui/button";

const stageStyles: Record<string, string> = {
  Idea: "bg-accent/15 text-accent-ink border-accent/30",
  MVP: "bg-primary/10 text-primary border-primary/30",
  Revenue: "bg-success/10 text-success border-success/30",
};

export function StartupShowcase() {
  return (
    <section id="startups" className="bg-surface py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Startups looking for teammates
            </h2>
            <p className="mt-2 text-ink-muted">
              A live sample of what&apos;s on the platform right now.
            </p>
          </div>
          <Button variant="outline" href="/discover">
            View all startups
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sampleStartups.map((s, i) => (
            <motion.article
              key={s.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}
              className="group flex flex-col rounded-2xl border border-border bg-background p-5 transition-shadow hover:shadow-[0_8px_30px_-12px_rgba(91,76,255,0.25)]"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-[17px] font-semibold">
                  {s.name}
                </h3>
                <span
                  className={`shrink-0 rounded-full border px-2.5 py-0.5 font-mono text-[11px] ${stageStyles[s.stage]}`}
                >
                  {s.stage}
                </span>
              </div>

              <p className="mt-2 text-[14px] leading-relaxed text-ink-muted">
                {s.pitch}
              </p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {s.rolesNeeded.map((role) => (
                  <span
                    key={role}
                    className="rounded-full bg-surface border border-border px-2.5 py-1 text-[11px] text-ink-muted"
                  >
                    {role}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-[12px] text-ink-muted">
                <span className="flex items-center gap-1">
                  <MapPin size={13} /> {s.location}
                </span>
                <span className="flex items-center gap-1">
                  <Users size={13} /> {s.teamSize} on team
                </span>
              </div>

              <p className="mt-3 font-mono text-[11px] text-ink-muted">
                {s.founder} · {s.college}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
