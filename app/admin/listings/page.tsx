'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

type Startup = {
  id: string
  title: string
  description: string
  founder_id: string
  moderation_status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

export default function AdminListingsPage() {
  const [listings, setListings] = useState<Startup[]>([])
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending')
  const [loading, setLoading] = useState(true)
  const [actioningId, setActioningId] = useState<string | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  async function load() {
    setLoading(true)
    let query = supabase.from('startups').select('*').order('created_at', { ascending: false })
    if (filter !== 'all') query = query.eq('moderation_status', filter)
    const { data } = await query
    setListings((data as Startup[]) ?? [])
    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  async function moderate(id: string, status: 'approved' | 'rejected', note?: string) {
    setActioningId(id)
    await fetch('/api/admin/listings/moderate', {
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
        <h1 className="text-2xl font-semibold">Listings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Review and moderate startup listings.
        </p>
      </div>

      <div className="flex gap-2">
        {(['pending', 'approved', 'rejected', 'all'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
              filter === f
                ? 'bg-foreground text-background'
                : 'bg-accent text-muted-foreground hover:text-foreground'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : listings.length === 0 ? (
        <p className="text-sm text-muted-foreground">No listings in this view.</p>
      ) : (
        <div className="space-y-3">
          {listings.map((s) => (
            <div key={s.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="font-medium truncate">{s.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {s.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Submitted {new Date(s.created_at).toLocaleDateString('en-IN')}
                  </p>
                </div>
                {s.moderation_status === 'pending' && (
                  <div className="flex gap-2 shrink-0">
                    <button
                      disabled={actioningId === s.id}
                      onClick={() => moderate(s.id, 'approved')}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      disabled={actioningId === s.id}
                      onClick={() => {
                        const note = window.prompt('Reason for rejection (shown to founder):')
                        if (note !== null) moderate(s.id, 'rejected', note)
                      }}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium bg-red-500/10 text-red-600 hover:bg-red-500/20 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                )}
                {s.moderation_status !== 'pending' && (
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 capitalize ${
                      s.moderation_status === 'approved'
                        ? 'bg-emerald-500/10 text-emerald-600'
                        : 'bg-red-500/10 text-red-600'
                    }`}
                  >
                    {s.moderation_status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
