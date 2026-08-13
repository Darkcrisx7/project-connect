export function isPremium(profile: { premium_until?: string | null } | null | undefined) {
  if (!profile?.premium_until) return false;
  return new Date(profile.premium_until).getTime() > Date.now();
}
