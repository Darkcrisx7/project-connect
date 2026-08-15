import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Lightbulb, Bell, Megaphone } from "lucide-react";
import { markAllNotificationsRead } from "@/app/notifications/actions";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/layout/app-header";

const iconByType: Record<string, typeof Lightbulb> = {
  new_application: Lightbulb,
  status_update: Bell,
  announcement: Megaphone,
};

function timeAgo(dateStr: string) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default async function NotificationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  const hasUnread = notifications?.some((n) => !n.is_read);

  return (
    <>
      <AppHeader />
      <div className="mx-auto max-w-2xl px-4 py-10 pb-28 sm:py-14 md:pb-14">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">Notifications</h1>
        {hasUnread && (
          <form action={markAllNotificationsRead}>
            <Button variant="outline" size="sm" type="submit">
              Mark all read
            </Button>
          </form>
        )}
      </div>

      {notifications?.length === 0 && (
        <div className="mt-8 rounded-2xl border border-dashed border-border py-16 text-center">
          <p className="font-display text-lg font-semibold">Nothing yet</p>
          <p className="mt-1 text-[14px] text-ink-muted">
            You&apos;ll see application updates and responses here.
          </p>
        </div>
      )}

      <div className="mt-6 space-y-2">
        {notifications?.map((n) => {
          const Icon = iconByType[n.type] ?? Bell;
          const content = (
            <div
              className={`flex items-start gap-3 rounded-xl border p-4 transition-colors ${
                n.is_read ? "border-border bg-surface" : "border-primary/30 bg-primary/5"
              }`}
            >
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon size={15} />
              </span>
              <div className="flex-1">
                <p className="text-[14px] font-medium">{n.title}</p>
                {n.body && <p className="mt-0.5 text-[13px] text-ink-muted">{n.body}</p>}
                <p className="mt-1 font-mono text-[11px] text-ink-muted">{timeAgo(n.created_at)}</p>
              </div>
              {!n.is_read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />}
            </div>
          );

          return n.link ? (
            <Link key={n.id} href={n.link}>
              {content}
            </Link>
          ) : (
            <div key={n.id}>{content}</div>
          );
        })}
      </div>
    </div>
    </>
  );
}
