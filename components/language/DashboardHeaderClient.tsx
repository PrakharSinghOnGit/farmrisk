"use client";

import React from "react";
import { useLanguage } from "@/hooks/use-language";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

export function DashboardHeaderClient() {
  const { t } = useLanguage();

  return (
    <div className="flex items-center gap-3">
      <LanguageSwitcher theme="light" />
      <div className="hidden rounded-md bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800 sm:block">
        {t.dashboard.livePreview}
      </div>
    </div>
  );
}

export function DashboardHeaderSubtitle() {
  const { t } = useLanguage();

  return (
    <p className="text-sm text-slate-600">
      {t.dashboard.subtitle}
    </p>
  );
}
