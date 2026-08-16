// File path in your repo: lib/admin.ts

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

// ⚠️ Replace with your actual email(s). You can add more than one.
const ADMIN_EMAILS = ['hraheebbasha@gmail.com']

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  return ADMIN_EMAILS.includes(email.toLowerCase())
}

// Use in Server Components / Server Actions / Route Handlers to get the
// current user and confirm they're an admin. Throws if not.
export async function requireAdmin() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {}, // no-op, we're only reading here
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !isAdminEmail(user.email)) {
    throw new Error('Not authorized')
  }

  return user
}

// Service-role client — bypasses RLS. ONLY use this inside admin API routes
// after requireAdmin() has already confirmed the caller is an admin.
// NEXT_PUBLIC_SUPABASE_URL is safe to expose; SUPABASE_SERVICE_ROLE_KEY must
// NEVER have the NEXT_PUBLIC_ prefix and must only be read server-side.
export function getAdminSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}
