import { createClient } from "@/lib/supabase/server";
import { ensureProfile } from "@/lib/supabase/ensure-profile";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const profile = await ensureProfile(supabase, data.user);
      const next = profile?.onboarding_complete ? "/dashboard" : "/onboarding/role";
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth-failed`);
}
