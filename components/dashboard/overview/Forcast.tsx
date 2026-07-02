"use client";

import React from "react";
import { useLanguage } from "@/hooks/use-language";

const Forcast = () => {
  const { t } = useLanguage();
  return (
    <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-1.5">
      {t.dashboard.forecast}
    </div>
  );
};

export default Forcast;
