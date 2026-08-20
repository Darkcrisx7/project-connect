import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Cache the maintenance-mode flag in memory for a short window so we're not
// hitting Supabase on every single page request. This resets on cold starts,
// and a stale value can persist for up to CACHE_MS after an admin flips the
// toggle — worth knowing, but a small trade-off for real site-wide speed.
const CACHE_MS = 20_000;
let cached: { value: boolean; expiresAt: number } | null = null;

async function isMaintenanceMode(): Promise<boolean> {
  if (cached && cached.expiresAt > Date.now()) {
    return cached.value;
  }
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/platform_settings?key=eq.maintenance_mode&select=value`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        cache: "no-store",
      }
    );
    const data = await res.json();
    const value = data?.[0]?.value === true;
    cached = { value, expiresAt: Date.now() + CACHE_MS };
    return value;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isExempt =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api/admin") ||
    pathname === "/maintenance";

  if (!isExempt && (await isMaintenanceMode())) {
    const url = request.nextUrl.clone();
    url.pathname = "/maintenance";
    return NextResponse.redirect(url);
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
