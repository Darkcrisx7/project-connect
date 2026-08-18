'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

type Settings = {
  maintenance_mode: boolean
  new_signups_enabled: boolean
  free_tier_listing_limit: number
  free_tier_application_limit: number
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('platform_settings').select('key, value')
      if (data) {
        const obj = Object.fromEntries(data.map((r) => [r.key, r.value]))
        setSettings({
          maintenance_mode: obj.maintenance_mode ?? false,
          new_signups_enabled: obj.new_signups_enabled ?? true,
          free_tier_listing_limit: obj.free_tier_listing_limit ?? 1,
          free_tier_application_limit: obj.free_tier_application_limit ?? 3,
        })
      }
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function save() {
    if (!settings) return
    setSaving(true)
    await fetch('/api/admin/settings/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (!settings) return <p className="text-sm text-ink-muted">Loading…</p>

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-ink-muted text-sm mt-1">
          Platform-wide configuration and feature flags.
        </p>
      </div>

      <div className="space-y-4">
        <label className="flex items-center justify-between rounded-xl border border-border bg-surface p-4">
          <div>
            <div className="font-medium text-sm">Maintenance mode</div>
            <div className="text-xs text-ink-muted mt-0.5">
              Shows a maintenance page to all non-admin users.
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.maintenance_mode}
            onChange={(e) => setSettings({ ...settings, maintenance_mode: e.target.checked })}
            className="h-5 w-5"
          />
        </label>

        <label className="flex items-center justify-between rounded-xl border border-border bg-surface p-4">
          <div>
            <div className="font-medium text-sm">New signups enabled</div>
            <div className="text-xs text-ink-muted mt-0.5">
              Turn off to temporarily pause new registrations.
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.new_signups_enabled}
            onChange={(e) => setSettings({ ...settings, new_signups_enabled: e.target.checked })}
            className="h-5 w-5"
          />
        </label>

        <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
          <div>
            <div className="font-medium text-sm mb-1">Free tier listing limit</div>
            <input
              type="number"
              min={0}
              value={settings.free_tier_listing_limit}
              onChange={(e) =>
                setSettings({ ...settings, free_tier_listing_limit: Number(e.target.value) })
              }
              className="w-24 rounded-lg border border-border bg-background px-3 py-1.5 text-sm"
            />
          </div>
          <div>
            <div className="font-medium text-sm mb-1">Free tier application limit / month</div>
            <input
              type="number"
              min={0}
              value={settings.free_tier_application_limit}
              onChange={(e) =>
                setSettings({ ...settings, free_tier_application_limit: Number(e.target.value) })
              }
              className="w-24 rounded-lg border border-border bg-background px-3 py-1.5 text-sm"
            />
          </div>
        </div>
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-ink disabled:opacity-50"
      >
        {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save changes'}
      </button>
    </div>
  )
}
