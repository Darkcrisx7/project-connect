"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const editProfileSchema = z.object({
  college: z.string().min(2, "Enter your college"),
  course: z.string().min(2, "Enter your course"),
  year: z.string().min(1, "Select your year"),
  location: z.string().min(2, "Enter your city"),
  phoneNumber: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  bio: z.string().max(400, "Keep it under 400 characters").optional(),
  skills: z.string().optional(),
  interests: z.string().optional(),
  preferredRole: z.string().optional(),
  availability: z.enum(["part_time", "full_time", "exploring"]),
  githubUrl: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  linkedinUrl: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  portfolioUrl: z.string().url("Enter a valid URL").optional().or(z.literal("")),
});

export async function updateProfile(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = editProfileSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your inputs" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const toArray = (v?: string) =>
    v ? v.split(",").map((s) => s.trim()).filter(Boolean) : [];

  const { data, error } = await supabase
    .from("profiles")
    .update({
      college: parsed.data.college,
      course: parsed.data.course,
      year: parsed.data.year,
      location: parsed.data.location,
      phone_number: parsed.data.phoneNumber,
      bio: parsed.data.bio || null,
      skills: toArray(parsed.data.skills),
      interests: toArray(parsed.data.interests),
      preferred_role: parsed.data.preferredRole || null,
      availability: parsed.data.availability,
      github_url: parsed.data.githubUrl || null,
      linkedin_url: parsed.data.linkedinUrl || null,
      portfolio_url: parsed.data.portfolioUrl || null,
    })
    .eq("id", user.id)
    .select("id")
    .single();

  if (error || !data) {
    return {
      error:
        error?.message ??
        "Save didn't go through (0 rows updated) — this usually means a database permissions rule is blocking it.",
    };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
