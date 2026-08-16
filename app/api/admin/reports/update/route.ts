import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, getAdminSupabaseClient } from '@/lib/admin'

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
  } catch {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
  }

  const { id, status, note } = await req.json()
  const validStatuses = ['open', 'reviewing', 'resolved', 'dismissed']

  if (!id || !validStatuses.includes(status)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const supabase = getAdminSupabaseClient()

  const update: Record<string, unknown> = { status }
  if (note) update.admin_note = note
  if (status === 'resolved' || status === 'dismissed') {
    update.resolved_at = new Date().toISOString()
  }

  const { error } = await supabase.from('reports').update(update).eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
