"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Map,
  CloudSun,
  Settings,
  HelpCircle,
  LucideIcon,
} from "lucide-react";
import {
  SIDEBAR_NAV_ITEMS,
  SIDEBAR_FOOTER_ITEMS,
} from "@/constants/content";
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
import { SidebarLogoutButton } from "@/components/auth/logout-button";
import { useLanguage } from "@/hooks/use-language";

const iconMap: Record<string, LucideIcon> = {
  layout: LayoutDashboard,
  map: Map,
  cloud: CloudSun,
  settings: Settings,
  help: HelpCircle,
};

const titleKeys: Record<string, string> = {
  "Overview": "overview",
  "Farm Map": "farmMap",
  "Weather Stats": "weatherStats",
  "Profile": "profile",
  "Settings": "settings",
};

export function AppSidebar() {
  const { t } = useLanguage();

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

              return (
                <SidebarMenuItem key={item.link}>
                  <SidebarMenuButton asChild>
                    <Link href={item.link}>
                      <IconComponent />
                      <span>{getTranslatedTitle(item.title)}</span>
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

            return (
              <SidebarMenuItem key={item.link}>
                <SidebarMenuButton asChild>
                  <Link href={item.link}>
                    <IconComponent />
                    <span className="truncate">{getTranslatedTitle(item.title)}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
          <SidebarMenuItem>
            <SidebarLogoutButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
export default AppSidebar;
