"use client";

import React from "react";
import { useLanguage } from "@/hooks/use-language";

const SoilMoisture = () => {
  const { t } = useLanguage();
  return (
    <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-1.5 mt-2">
      {t.dashboard.soilMoisture}
    </div>
  );
};

export default SoilMoisture;
