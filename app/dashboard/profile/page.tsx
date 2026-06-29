import { redirect } from "next/navigation";
import { ProfileClient } from "@/app/dashboard/profile/profile-client";
import { createClient } from "@/supabase/server";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = user
    ? await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle()
    : { data: null };

  return (
    <ProfileClient profile={profile} phone={user?.phone ?? "+91 99999 99999"} />
  );
}
