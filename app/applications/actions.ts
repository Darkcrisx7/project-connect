"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isPremium } from "@/lib/premium";

const applySchema = z.object({
  startupId: z.string().uuid(),
  intro: z.string().min(10, "Write a short introduction (at least 10 characters)").max(500),
  whyJoin: z.string().min(10, "Say why you want to join (at least 10 characters)").max(500),
});

export async function applyToStartup(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = applySchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your inputs" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: startup } = await supabase
    .from("startups")
    .select("founder_id")
    .eq("id", parsed.data.startupId)
    .single();

  if (startup?.founder_id === user.id) {
    return { error: "You can't apply to your own listing." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("premium_until")
    .eq("id", user.id)
    .single();

  if (!isPremium(profile)) {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count } = await supabase
      .from("applications")
      .select("id", { count: "exact", head: true })
      .eq("applicant_id", user.id)
      .gte("created_at", startOfMonth.toISOString());

    if ((count ?? 0) >= 3) {
      return {
        error: "You've used your 3 free applications this month. Upgrade to Pro (₹59/mo) for unlimited applications.",
      };
    }
  }

  const { error } = await supabase.from("applications").insert({
    startup_id: parsed.data.startupId,
    applicant_id: user.id,
    intro: parsed.data.intro,
    why_join: parsed.data.whyJoin,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "You've already applied to this startup." };
    }
    return { error: error.message };
  }

  revalidatePath(`/startups/${parsed.data.startupId}`);
  return { success: true };
}

export async function withdrawApplication(applicationId: string, startupId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("applications").delete().eq("id", applicationId);
  revalidatePath(`/startups/${startupId}`);
  revalidatePath("/applications");
}

export async function updateApplicationStatus(
  applicationId: string,
  status: "shortlisted" | "accepted" | "rejected",
  startupId: string
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("applications")
    .update({ status })
    .eq("id", applicationId)
    .select("id")
    .single();

  if (error || !data) {
    return {
      error:
        error?.message ??
        "Couldn't update that application — you may not have permission.",
    };
  }

  revalidatePath(`/startups/${startupId}/applicants`);
  return { success: true };
}
