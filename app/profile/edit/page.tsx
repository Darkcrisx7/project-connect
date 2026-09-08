import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { EditProfileForm } from "./edit-profile-form";

export default async function EditProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/onboarding/role");

  return (
    <>
      <AppHeader />
      <div className="mx-auto max-w-xl px-4 py-12 sm:py-16">
        <h1 className="font-display text-2xl font-semibold">Edit your profile</h1>
        <p className="mt-2 text-[14px] text-ink-muted">
          Keep this up to date — it&apos;s what founders and teammates see.
        </p>
        <EditProfileForm profile={profile} />
      </div>
    </>
  );
}
