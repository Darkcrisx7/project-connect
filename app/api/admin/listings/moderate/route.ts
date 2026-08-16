import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, getAdminSupabaseClient } from '@/lib/admin'

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
  } catch {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
  }

  const { id, status, note } = await req.json()

  if (!id || !['approved', 'rejected'].includes(status)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const supabase = getAdminSupabaseClient()

  const { error } = await supabase
    .from('startups')
    .update({ moderation_status: status, moderation_note: note ?? null })
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Optional: notify the founder. Only runs if you already have a
  // notifications table + insert pattern from Phase 5 — reuse that here.
  // Left as a comment since your exact notification schema may differ:
  //
  // const { data: startup } = await supabase.from('startups').select('founder_id, title').eq('id', id).single()
  // if (startup) {
  //   await supabase.from('notifications').insert({
  //     user_id: startup.founder_id,
  //     type: status === 'approved' ? 'listing_approved' : 'listing_rejected',
  //     message: status === 'approved'
  //       ? `Your listing "${startup.title}" was approved and is now live.`
  //       : `Your listing "${startup.title}" was rejected. ${note ?? ''}`,
  //   })
  // }

  return NextResponse.json({ success: true })
}
