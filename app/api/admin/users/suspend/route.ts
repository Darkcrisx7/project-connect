import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, getAdminSupabaseClient } from '@/lib/admin'

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
  } catch {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
  }

  const { id, suspend, reason } = await req.json()

  if (!id || typeof suspend !== 'boolean') {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const supabase = getAdminSupabaseClient()

  const { error } = await supabase
    .from('profiles')
    .update({
      is_suspended: suspend,
      suspended_reason: suspend ? reason ?? null : null,
    })
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
