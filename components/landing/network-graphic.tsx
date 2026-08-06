"use client";

import { motion } from "framer-motion";

/**
 * Signature visual: student nodes (initials) drawing connecting lines to
 * each other and settling into a small team cluster — literal "founders
 * finding their team," rendered as a sketch-like network rather than a
 * generic stat/gradient hero.
 */
const nodes = [
  { id: "a", x: 60, y: 40, label: "RS", role: "Founder" },
  { id: "b", x: 220, y: 20, label: "AN", role: "iOS" },
  { id: "c", x: 300, y: 130, label: "SP", role: "Design" },
  { id: "d", x: 170, y: 190, label: "DK", role: "Backend" },
  { id: "e", x: 30, y: 160, label: "AK", role: "Growth" },
];

const edges: [string, string][] = [
  ["a", "b"],
  ["a", "d"],
  ["a", "e"],
  ["b", "c"],
  ["c", "d"],
];

function point(id: string) {
  const n = nodes.find((n) => n.id === id)!;
  return n;
}

export function NetworkGraphic() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      <svg viewBox="0 0 340 240" className="h-full w-full overflow-visible">
        {edges.map(([from, to], i) => {
          const a = point(from);
          const b = point(to);
          return (
            <motion.line
              key={`${from}-${to}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="var(--primary)"
              strokeWidth={1.5}
              strokeDasharray="4 5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.55 }}
              transition={{ duration: 1, delay: 0.4 + i * 0.15, ease: "easeInOut" }}
            />
          );
        })}

        {nodes.map((n, i) => (
          <motion.g
            key={n.id}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: i * 0.12, ease: "backOut" }}
          >
            <circle
              cx={n.x}
              cy={n.y}
              r={26}
              fill="var(--surface)"
              stroke={i === 0 ? "var(--accent)" : "var(--primary)"}
              strokeWidth={i === 0 ? 2.5 : 1.5}
            />
            <text
              x={n.x}
              y={n.y + 5}
              textAnchor="middle"
              fontSize="13"
              fontWeight={600}
              fontFamily="var(--font-display)"
              fill="var(--ink)"
            >
              {n.label}
            </text>
            <text
              x={n.x}
              y={n.y + 42}
              textAnchor="middle"
              fontSize="9"
              fontFamily="var(--font-mono)"
              fill="var(--ink-muted)"
            >
              {n.role}
            </text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}
