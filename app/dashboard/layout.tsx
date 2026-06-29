import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { createClient } from "@/supabase/server";
import {
  DashboardHeaderClient,
  DashboardHeaderSubtitle,
} from "@/components/language/DashboardHeaderClient";
import { DashboardClientShell } from "./_components/dashboard-client-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />
      <SidebarInset className="min-h-svh bg-[linear-gradient(180deg,#f7f9f4_0%,#eef4ea_100%)]">
        <header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-700">
                FarmRisk
              </p>
              <DashboardHeaderSubtitle />
            </div>
          </div>
          <DashboardHeaderClient />
        </header>
        <DashboardClientShell>{children}</DashboardClientShell>
      </SidebarInset>
    </SidebarProvider>
  );
}
