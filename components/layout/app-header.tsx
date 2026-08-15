import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { brand } from "@/config/brand";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { Compass, Inbox, LayoutDashboard } from "lucide-react";

export async function AppHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let notifications: {
    id: string;
    title: string;
    body: string | null;
    link: string | null;
    is_read: boolean;
    created_at: string;
  }[] = [];
  let unreadCount = 0;

  if (user) {
    const { data } = await supabase
      .from("notifications")
      .select("id, title, body, link, is_read, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(8);
    notifications = data ?? [];

    const { count } = await supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_read", false);
    unreadCount = count ?? 0;
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-display text-sm font-semibold text-primary-ink">
            {brand.logoInitial}
          </span>
          <span className="hidden font-display text-[17px] font-semibold tracking-tight sm:inline">
            {brand.name}
          </span>
        </Link>

        {user ? (
          <nav className="flex items-center gap-1">
            <Link
              href="/dashboard"
              className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-[13px] text-ink-muted hover:bg-surface hover:text-ink sm:flex"
            >
              <LayoutDashboard size={16} /> Dashboard
            </Link>
            <Link
              href="/discover"
              className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-[13px] text-ink-muted hover:bg-surface hover:text-ink sm:flex"
            >
              <Compass size={16} /> Discover
            </Link>
            <Link
              href="/applications"
              className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-[13px] text-ink-muted hover:bg-surface hover:text-ink sm:flex"
            >
              <Inbox size={16} /> Applications
            </Link>
            <NotificationBell notifications={notifications} unreadCount={unreadCount} />
          </nav>
        ) : (
          <Link href="/login" className="text-[14px] font-medium text-primary">
            Log in
          </Link>
        )}
      </div>
    </header>
  );
}
