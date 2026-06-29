"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import {
  LayoutDashboard,
  Map,
  CloudSun,
  Settings,
  HelpCircle,
  LucideIcon,
  Lock,
} from "lucide-react";
import { SIDEBAR_NAV_ITEMS, SIDEBAR_FOOTER_ITEMS } from "@/constants/content";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
} from "@/components/ui/sidebar";
import { SidebarLogoutButton } from "@/components/auth/LogoutButton";
import { useLanguage } from "@/hooks/use-language";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  layout: LayoutDashboard,
  map: Map,
  cloud: CloudSun,
  settings: Settings,
  help: HelpCircle,
};

const titleKeys: Record<string, string> = {
  Overview: "overview",
  "Farm Map": "farmMap",
  "Weather Stats": "weatherStats",
  Profile: "profile",
  Settings: "settings",
};

export function AppSidebar() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    setIsLoggedIn(
      !!user ||
        (typeof document !== "undefined" &&
          document.cookie.includes("farmrisk_dev_session=1")),
    );
  }, [user]);

  const getTranslatedTitle = (originalTitle: string) => {
    const key = titleKeys[originalTitle];
    if (key && t.sidebar && (t.sidebar as any)[key]) {
      return (t.sidebar as any)[key];
    }
    return originalTitle;
  };

  return (
    <Sidebar className="border-r border-slate-200 bg-white">
      <SidebarHeader className="border-b border-slate-100 p-4">
        <span className="text-lg font-bold tracking-wide text-emerald-700">
          {t.title}
        </span>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {SIDEBAR_NAV_ITEMS.map((item) => {
              const IconComponent = iconMap[item.iconName] || HelpCircle;
              const isLocked =
                mounted && !isLoggedIn && item.link !== "/dashboard";

              return (
                <SidebarMenuItem key={item.link}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.link}
                      onClick={(e) => {
                        if (isLocked) {
                          e.preventDefault();
                          const confirmLogin = window.confirm(
                            "You need a personalized account to access this feature. Would you like to sign in/register now?",
                          );
                          if (confirmLogin) {
                            router.push(
                              "/auth/login?next=" +
                                encodeURIComponent(item.link),
                            );
                          }
                        }
                      }}
                      className={cn(isLocked && "opacity-60")}
                    >
                      <IconComponent />
                      <span className="flex items-center gap-1.5 justify-between w-full">
                        <span>{getTranslatedTitle(item.title)}</span>
                        {isLocked && (
                          <Lock className="size-3.5 text-slate-400 shrink-0" />
                        )}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-100 p-4">
        <SidebarMenu>
          {SIDEBAR_FOOTER_ITEMS.map((item) => {
            const IconComponent = iconMap[item.iconName] || Settings;
            const isLocked = mounted && !isLoggedIn;

            return (
              <SidebarMenuItem key={item.link}>
                <SidebarMenuButton asChild>
                  <Link
                    href={item.link}
                    onClick={(e) => {
                      if (isLocked) {
                        e.preventDefault();
                        const confirmLogin = window.confirm(
                          "You need a personalized account to access this feature. Would you like to sign in/register now?",
                        );
                        if (confirmLogin) {
                          router.push(
                            "/auth/login?next=" + encodeURIComponent(item.link),
                          );
                        }
                      }
                    }}
                    className={cn(isLocked && "opacity-60")}
                  >
                    <IconComponent />
                    <span className="flex items-center gap-1.5 justify-between w-full truncate">
                      <span className="truncate">
                        {getTranslatedTitle(item.title)}
                      </span>
                      {isLocked && (
                        <Lock className="size-3.5 text-slate-400 shrink-0" />
                      )}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
          {mounted && isLoggedIn && (
            <SidebarMenuItem>
              <SidebarLogoutButton />
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
export default AppSidebar;
