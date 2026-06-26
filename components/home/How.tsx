"use client";

import React from "react";
import { useLanguage } from "@/hooks/use-language";

const How = () => {
  const { t } = useLanguage();
  return (
    <section id="how-it-works" className="py-24 text-center text-xl font-bold uppercase tracking-wider text-slate-800">
      {t.nav.howItWorks}
    </section>
  );
};

export default How;
