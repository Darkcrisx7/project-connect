"use server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isPremium } from "@/lib/premium";
const startupSchema = z.object({
  name: z.string().min(2, "Give your startup a name"),
  pitch: z.string().min(10, "Write a one-line pitch (at least 10 characters)").max(160, "Keep the pitch under 160 characters"),
  problem: z.string().optional(),
  solution: z.string().optional(),
  stage: z.enum(["idea", "mvp", "revenue"]),
  industry: z.string().min(2, "Pick an industry"),
  location: z.string().optional(),
  workMode: z.enum(["remote", "hybrid", "onsite"]),
  requiredSkills: z.string().optional(),
  openRoles: z.coerce.number().int().min(1).max(20),
  commitment: z.enum(["part_time", "full_time"]).optional().or(z.literal("")),
  equityOffered: z.string().optional(),
  applicationDeadline: z.string().optional(),
  teamSize: z.coerce.number().int().min(1).max(50),
});
export async function createStartup(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = startupSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your inputs" };
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase
    .from("profiles")
    .select("premium_until")
    .eq("id", user.id)
    .single();
  if (!isPremium(profile)) {
    const { count } = await supabase
      .from("startups")
      .select("id", { count: "exact", head: true })
      .eq("founder_id", user.id)
      .eq("is_active", true);
    if ((count ?? 0) >= 1) {
      return {
        error: "Free plan allows 1 active listing. Upgrade to Pro (₹79/mo) from your dashboard for unlimited listings.",
      };
    }
  }
  const toArray = (v?: string) =>
    v ? v.split(",").map((s) => s.trim()).filter(Boolean) : [];
  const { data, error } = await supabase
    .from("startups")
    .insert({
      founder_id: user.id,
      name: parsed.data.name,
      pitch: parsed.data.pitch,
      problem: parsed.data.problem || null,
      solution: parsed.data.solution || null,
      stage: parsed.data.stage,
      industry: parsed.data.industry,
      location: parsed.data.location || null,
      work_mode: parsed.data.workMode,
      required_skills: toArray(parsed.data.requiredSkills),
      open_roles: parsed.data.openRoles,
      commitment: parsed.data.commitment || null,
      equity_offered: parsed.data.equityOffered || null,
      application_deadline: parsed.data.applicationDeadline || null,
      team_size: parsed.data.teamSize,
    })
    .select("id")
    .single();
  if (error || !data) {
    return { error: error?.message ?? "Couldn't save your listing — try again." };
  }
  redirect(`/startups/${data.id}`);
}

export async function deleteStartup(startupId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("startups")
    .delete()
    .eq("id", startupId)
    .eq("founder_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { success: true };
}
