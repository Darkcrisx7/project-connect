"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { markNotificationRead } from "@/app/notifications/actions";

type Notification = {
  id: string;
  title: string;
  body: string | null;
  link: string | null;
  is_read: boolean;
  created_at: string;
};

function timeAgo(dateStr: string) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function NotificationBell({
  notifications,
  unreadCount,
}: {
  notifications: Notification[];
  unreadCount: number;
}) {
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-surface hover:text-ink"
        aria-label="Notifications"
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-danger" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-80 rounded-2xl border border-border bg-surface shadow-lg">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="font-display text-[14px] font-semibold">Notifications</span>
            <Link href="/notifications" onClick={() => setOpen(false)} className="text-[12px] text-primary hover:underline">
              View all
            </Link>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 && (
              <p className="px-4 py-6 text-center text-[13px] text-ink-muted">Nothing yet</p>
            )}
            {notifications.map((n) => (
              <Link
                key={n.id}
                href={n.link ?? "/notifications"}
                onClick={() => {
                  setOpen(false);
                  if (!n.is_read) startTransition(() => markNotificationRead(n.id));
                }}
                className={`block border-b border-border px-4 py-3 last:border-0 hover:bg-background ${
                  n.is_read ? "" : "bg-primary/5"
                }`}
              >
                <p className="text-[13px] font-medium">{n.title}</p>
                <p className="mt-0.5 font-mono text-[11px] text-ink-muted">{timeAgo(n.created_at)}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
