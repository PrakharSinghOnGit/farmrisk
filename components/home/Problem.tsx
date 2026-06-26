"use client";

import React from "react";
import { useLanguage } from "@/hooks/use-language";

const Problem = () => {
  const { t } = useLanguage();
  return (
    <section id="problem" className="py-24 text-center text-xl font-bold uppercase tracking-wider text-slate-800">
      {t.nav.problem}
    </section>
  );
};

export default Problem;
