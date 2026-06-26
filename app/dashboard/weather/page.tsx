"use client";

import React from "react";
import { useLanguage } from "@/hooks/use-language";

export default function Weather() {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 gap-7 min-w-dvh text-2xl font-bold uppercase tracking-wider text-slate-800">
      {t.sidebar.weatherStats}
    </div>
  );
}
