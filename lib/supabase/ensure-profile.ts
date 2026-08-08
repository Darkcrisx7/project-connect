import type { SupabaseClient, User } from "@supabase/supabase-js";

export async function ensureProfile(supabase: SupabaseClient, user: User) {
  const { data: existing } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (existing) return existing;

  const { data: created } = await supabase
    .from("profiles")
    .insert({
      id: user.id,
      email: user.email!,
      full_name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
      avatar_url: user.user_metadata?.avatar_url ?? null,
    })
    .select("*")
    .single();

  return created;
}
