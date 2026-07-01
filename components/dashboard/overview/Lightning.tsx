"use client";

import React from "react";
import { useLanguage } from "@/hooks/use-language";

const Lightning = () => {
  const { t } = useLanguage();
  return (
    <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-1.5 mt-2">
      {t.dashboard.lightning}
    </div>
  );
};

export default Lightning;
