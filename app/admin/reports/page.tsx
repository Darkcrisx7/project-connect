'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

type Report = {
  id: string
  reporter_id: string
  target_type: 'startup' | 'user'
  target_id: string
  reason: string
  details: string | null
  status: 'open' | 'reviewing' | 'resolved' | 'dismissed'
  admin_note: string | null
  created_at: string
}

const statusStyles: Record<Report['status'], string> = {
  open: 'bg-accent/10 text-accent',
  reviewing: 'bg-primary/10 text-primary',
  resolved: 'bg-success/10 text-success',
  dismissed: 'bg-border text-ink-muted',
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [filter, setFilter] = useState<Report['status'] | 'all'>('open')
  const [loading, setLoading] = useState(true)
  const [actioningId, setActioningId] = useState<string | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  async function load() {
    setLoading(true)
    let query = supabase.from('reports').select('*').order('created_at', { ascending: false })
    if (filter !== 'all') query = query.eq('status', filter)
    const { data } = await query
    setReports((data as Report[]) ?? [])
    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  async function updateStatus(id: string, status: Report['status']) {
    setActioningId(id)
    const note =
      status === 'resolved' || status === 'dismissed'
        ? window.prompt('Admin note (optional):') ?? undefined
        : undefined
    await fetch('/api/admin/reports/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status, note }),
    })
    setActioningId(null)
    load()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Reports</h1>
        <p className="text-ink-muted text-sm mt-1">
          User-submitted reports on listings and accounts.
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(['open', 'reviewing', 'resolved', 'dismissed', 'all'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
              filter === f
                ? 'bg-primary text-primary-ink'
                : 'bg-accent text-ink-muted hover:text-ink'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-ink-muted">Loading…</p>
      ) : reports.length === 0 ? (
        <p className="text-sm text-ink-muted">No reports in this view.</p>
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <div key={r.id} className="rounded-xl border border-border bg-surface p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-accent capitalize">
                      {r.target_type}
                    </span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusStyles[r.status]}`}>
                      {r.status}
                    </span>
                  </div>
                  <p className="font-medium mt-2">{r.reason}</p>
                  {r.details && (
                    <p className="text-sm text-ink-muted mt-1">{r.details}</p>
                  )}
                  <p className="text-xs text-ink-muted mt-2">
                    Reported {new Date(r.created_at).toLocaleDateString('en-IN')} · target ID: {r.target_id}
                  </p>
                  {r.admin_note && (
                    <p className="text-xs text-ink-muted mt-1 italic">Note: {r.admin_note}</p>
                  )}
                </div>
                {(r.status === 'open' || r.status === 'reviewing') && (
                  <div className="flex flex-col gap-2 shrink-0">
                    {r.status === 'open' && (
                      <button
                        disabled={actioningId === r.id}
                        onClick={() => updateStatus(r.id, 'reviewing')}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-50"
                      >
                        Start review
                      </button>
                    )}
                    <button
                      disabled={actioningId === r.id}
                      onClick={() => updateStatus(r.id, 'resolved')}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium bg-success/10 text-success hover:bg-success/20 disabled:opacity-50"
                    >
                      Resolve
                    </button>
                    <button
                      disabled={actioningId === r.id}
                      onClick={() => updateStatus(r.id, 'dismissed')}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium bg-accent text-ink-muted hover:text-ink disabled:opacity-50"
                    >
                      Dismiss
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
