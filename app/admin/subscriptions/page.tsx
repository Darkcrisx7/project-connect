'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

type ProUser = {
  id: string
  full_name: string | null
  email: string
  is_pro: boolean
  pro_expires_at: string | null
}

export default function AdminSubscriptionsPage() {
  const [users, setUsers] = useState<ProUser[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name, email, is_pro, pro_expires_at')
        .eq('is_pro', true)
        .order('pro_expires_at', { ascending: true })
      setUsers((data as ProUser[]) ?? [])
      setLoading(false)
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const now = new Date()
  const expiringSoon = users.filter((u) => {
    if (!u.pro_expires_at) return false
    const days = (new Date(u.pro_expires_at).getTime() - now.getTime()) / 86400000
    return days > 0 && days <= 3
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Subscriptions</h1>
        <p className="text-ink-muted text-sm mt-1">
          Active Pro subscribers · ₹79/month each · {users.length} active
        </p>
      </div>

      {expiringSoon.length > 0 && (
        <div className="rounded-xl border border-accent/60 bg-accent/5 p-4 text-sm">
          {expiringSoon.length} subscription(s) expiring within 3 days.
        </div>
      )}

      {loading ? (
        <p className="text-sm text-ink-muted">Loading…</p>
      ) : users.length === 0 ? (
        <p className="text-sm text-ink-muted">No active Pro subscribers yet.</p>
      ) : (
        <div className="rounded-xl border border-border bg-surface overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-accent/50 text-ink-muted">
              <tr>
                <th className="text-left font-medium px-4 py-3">Name</th>
                <th className="text-left font-medium px-4 py-3">Email</th>
                <th className="text-left font-medium px-4 py-3">Renews / expires</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-border">
                  <td className="px-4 py-3">{u.full_name ?? '—'}</td>
                  <td className="px-4 py-3 text-ink-muted">{u.email}</td>
                  <td className="px-4 py-3">
                    {u.pro_expires_at
                      ? new Date(u.pro_expires_at).toLocaleDateString('en-IN')
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
