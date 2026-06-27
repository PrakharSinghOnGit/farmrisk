"use client";

import { LocationProvider } from "@/providers/location-provider";
import type { ReactNode } from "react";

export function DashboardClientShell({ children }: { children: ReactNode }) {
  return <LocationProvider>{children}</LocationProvider>;
}
