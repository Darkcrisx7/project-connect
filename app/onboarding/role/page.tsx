"use client";

import { useTransition } from "react";
import { motion } from "framer-motion";
import { Lightbulb, Users, Wrench } from "lucide-react";
import { setRole } from "@/app/onboarding/actions";

const roles = [
  {
    id: "founder" as const,
    icon: Lightbulb,
    title: "I have an idea",
    body: "You want to post a startup idea and find a team to build it with.",
  },
  {
    id: "co_founder" as const,
    icon: Users,
    title: "I want to co-found",
    body: "You're looking to join something early, as an equal partner, not just a role.",
  },
  {
    id: "team_member" as const,
    icon: Wrench,
    title: "I want to join a team",
    body: "You want to contribute a skill — design, code, growth, ops — to a startup already forming.",
  },
];

export default function RoleSelectionPage() {
  const [pending, startTransition] = useTransition();

  return (
    <div className="grid-texture flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <h1 className="text-center font-display text-2xl font-semibold">
          What brings you here?
        </h1>
        <p className="mt-2 text-center text-[14px] text-ink-muted">
          This decides what your dashboard looks like — you can change it later.
        </p>

        <div className="mt-8 space-y-3">
          {roles.map((role, i) => (
            <motion.button
              key={role.id}
              type="button"
              disabled={pending}
              onClick={() => startTransition(async () => {
                await setRole(role.id);
              })}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex w-full items-start gap-4 rounded-2xl border border-border bg-surface p-5 text-left transition-colors hover:border-primary disabled:opacity-60"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <role.icon size={20} />
              </span>
              <span>
                <span className="block font-display text-[15px] font-semibold">
                  {role.title}
                </span>
                <span className="mt-0.5 block text-[13px] text-ink-muted">
                  {role.body}
                </span>
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
