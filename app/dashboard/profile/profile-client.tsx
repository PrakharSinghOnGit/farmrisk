"use client";

import React from "react";
import { ProfileForm } from "./profile-form";
import { useLanguage } from "@/hooks/use-language";
import type { Profile } from "@/types/database";

export function ProfileClient({
  profile,
  phone,
}: {
  profile: Profile | null;
  phone: string;
}) {
  const { t } = useLanguage();

  return (
    <main className="flex-1 p-4 sm:p-6">
      <section className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-7">
          <p className="text-sm font-medium text-emerald-700">
            {t.profile.eyebrow}
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-950">
            {t.profile.title}
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {t.profile.desc}
          </p>
        </div>
        <ProfileForm
          profile={profile}
          phone={phone}
        />
      </section>
    </main>
  );
}
