"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, LogOut } from "lucide-react";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { createClient } from "@/supabase/client";
import { useLanguage } from "@/hooks/use-language";

export function SidebarLogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { t, language } = useLanguage();

  async function logout() {
    setIsLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut({ scope: "local" });
    if (process.env.NODE_ENV === "development") {
      await fetch("/auth/dev-logout", { method: "POST" });
    }
    router.replace("/auth/login");
    router.refresh();
  }

  const loggingOutText =
    language === "hi"
      ? "लॉग आउट हो रहा है..."
      : language === "mr"
        ? "लॉग आउट होत आहे..."
        : language === "ta"
          ? "வெளியேறுகிறது..."
          : language === "gu"
            ? "લૉગ આઉટ થઈ રહ્યું છે..."
            : "Logging out...";

  return (
    <SidebarMenuButton
      type="button"
      variant="outline"
      onClick={logout}
      disabled={isLoading}
      tooltip={t.sidebar.logout}
    >
      {isLoading ? (
        <LoaderCircle className="animate-spin" aria-hidden="true" />
      ) : (
        <LogOut aria-hidden="true" />
      )}
      <span>{isLoading ? loggingOutText : t.sidebar.logout}</span>
    </SidebarMenuButton>
  );
}
