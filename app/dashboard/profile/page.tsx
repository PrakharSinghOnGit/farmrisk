import { redirect } from "next/navigation";
import { ProfileClient } from "@/app/dashboard/profile/profile-client";
import { AUTH_CONFIG } from "@/lib/auth/config";
import {
  hasDevSessionCookie,
  readDevProfile,
} from "@/lib/auth/dev";
import { createClient } from "@/supabase/server";

export default async function ProfilePage() {
  const supabase = await createClient();
  const isDevSession = await hasDevSessionCookie();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !isDevSession) {
    redirect(AUTH_CONFIG.loginPath);
  }

  const { data: profile } = user
    ? await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle()
    : { data: null };

  const devProfile = await readDevProfile();
  const resolvedProfile =
    profile ??
    (isDevSession
      ? {
          id: "dev-user",
          full_name: devProfile.fullName,
          age: devProfile.age,
          location: devProfile.location,
          metadata: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      : null);

  return (
    <ProfileClient
      profile={resolvedProfile}
      phone={user?.phone ?? "+91 99999 99999"}
    />
  );
}
