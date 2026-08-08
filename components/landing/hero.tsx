"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { NetworkGraphic } from "@/components/landing/network-graphic";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="grid-texture absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />

      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-14 sm:px-6 sm:pt-20 md:grid-cols-2 md:pb-24 md:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs text-ink-muted">
            Built for Indian campuses
          </span>

          <h1 className="mt-5 font-display text-[2.4rem] font-semibold leading-[1.08] tracking-tight sm:text-6xl">
            Your idea needs
            <br />
            a <span className="text-primary">team</span>, not just
            <br />
            a <span className="text-accent">grade</span>.
          </h1>

          <p className="mt-5 max-w-md text-[17px] leading-relaxed text-ink-muted">
            Project Connect is where student founders share startup ideas,
            find co-founders, and build real teams — before anyone&apos;s
            heard of them.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button variant="accent" size="lg" href="/signup">
              Post your idea <ArrowRight size={18} />
            </Button>
            <Button variant="outline" size="lg" href="/discover">
              Browse startups
            </Button>
          </div>

          <p className="mt-6 font-mono text-xs text-ink-muted">
            2,400+ student founders · 190+ colleges · free to join
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <NetworkGraphic />
        </motion.div>
      </div>
    </section>
  );
}
