"use client";

import React from "react";
import { useLanguage } from "@/hooks/use-language";

const Solution = () => {
  const { t } = useLanguage();
  return (
    <section id="solution" className="py-24 text-center text-xl font-bold uppercase tracking-wider text-slate-800">
      {t.nav.solution}
    </section>
  );
};

export default Solution;
