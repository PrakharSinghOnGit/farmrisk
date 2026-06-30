"use client";

import { useNavigation } from "@/hooks/use-Navigation";
export default function DashboardContent() {
  const { currentPage } = useNavigation();
  return currentPage.component;
}
