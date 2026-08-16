import { getAdminSupabaseClient } from '@/lib/admin'
import {
  Users,
  Rocket,
  FileText,
  IndianRupee,
  Flag,
  Clock,
} from 'lucide-react'

async function getStats() {
  const supabase = getAdminSupabaseClient()

  const [
    { count: totalUsers },
    { count: totalStartups },
    { count: pendingListings },
    { count: totalApplications },
    { count: openReports },
    { count: proUsers },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('startups').select('*', { count: 'exact', head: true }),
    supabase
      .from('startups')
      .select('*', { count: 'exact', head: true })
      .eq('moderation_status', 'pending'),
    supabase.from('applications').select('*', { count: 'exact', head: true }),
    supabase
      .from('reports')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'open'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_pro', true),
  ])

  // Revenue estimate: Pro users × ₹79. Swap for a real sum over your
  // payments table if you're logging individual transactions.
  const estimatedMonthlyRevenue = (proUsers ?? 0) * 79

  return {
    totalUsers: totalUsers ?? 0,
    totalStartups: totalStartups ?? 0,
    pendingListings: pendingListings ?? 0,
    totalApplications: totalApplications ?? 0,
    openReports: openReports ?? 0,
    proUsers: proUsers ?? 0,
    estimatedMonthlyRevenue,
  }
}

const cards = (stats: Awaited<ReturnType<typeof getStats>>) => [
  { label: 'Total users', value: stats.totalUsers, icon: Users },
  { label: 'Total listings', value: stats.totalStartups, icon: Rocket },
  { label: 'Pending review', value: stats.pendingListings, icon: Clock, alert: stats.pendingListings > 0 },
  { label: 'Total applications', value: stats.totalApplications, icon: FileText },
  { label: 'Open reports', value: stats.openReports, icon: Flag, alert: stats.openReports > 0 },
  { label: 'Pro subscribers', value: stats.proUsers, icon: IndianRupee },
]

export default async function AdminDashboardPage() {
  const stats = await getStats()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Platform overview and key metrics.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {cards(stats).map((c) => {
          const Icon = c.icon
          return (
            <div
              key={c.label}
              className={`rounded-xl border p-5 bg-card ${
                c.alert ? 'border-amber-400/60' : 'border-border'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <Icon className="h-5 w-5 text-muted-foreground" />
                {c.alert && (
                  <span className="text-xs font-medium text-amber-500">
                    Needs attention
                  </span>
                )}
              </div>
              <div className="text-2xl font-semibold">{c.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{c.label}</div>
            </div>
          )
        })}
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <div className="text-sm text-muted-foreground">
          Estimated monthly recurring revenue
        </div>
        <div className="text-3xl font-semibold mt-1">
          ₹{stats.estimatedMonthlyRevenue.toLocaleString('en-IN')}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          Based on {stats.proUsers} active Pro subscriber(s) × ₹79/month.
        </div>
      </div>
    </div>
  )
}
