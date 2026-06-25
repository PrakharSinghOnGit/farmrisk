"use client";

import { useActionState } from "react";
import { LoaderCircle, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Profile } from "@/types/database";
import {
  initialProfileFormState,
  saveProfile,
} from "@/app/dashboard/profile/actions";
import { useLanguage } from "@/hooks/use-language";

export function ProfileForm({
  profile,
  phone,
}: {
  profile: Profile | null;
  phone: string;
}) {
  const [state, action, isPending] = useActionState(
    saveProfile,
    initialProfileFormState,
  );
  const { t } = useLanguage();

  return (
    <form action={action} className="grid gap-5">
      <div className="grid gap-2">
        <label htmlFor="phone" className="text-sm font-medium text-slate-800">
          {t.profile.phoneLabel}
        </label>
        <Input id="phone" value={phone} disabled />
        <p className="text-xs text-slate-500">
          {t.profile.phoneDesc}
        </p>
      </div>

      <div className="grid gap-2">
        <label
          htmlFor="fullName"
          className="text-sm font-medium text-slate-800"
        >
          {t.profile.nameLabel}
        </label>
        <Input
          id="fullName"
          name="fullName"
          type="text"
          maxLength={120}
          defaultValue={profile?.full_name ?? ""}
          placeholder={t.profile.namePlaceholder}
        />
      </div>

      <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
        <div className="grid gap-2">
          <label htmlFor="age" className="text-sm font-medium text-slate-800">
            {t.profile.ageLabel}
          </label>
          <Input
            id="age"
            name="age"
            type="number"
            inputMode="numeric"
            min={1}
            max={120}
            defaultValue={profile?.age ?? ""}
            placeholder={t.profile.agePlaceholder}
          />
        </div>

        <div className="grid gap-2">
          <label
            htmlFor="location"
            className="text-sm font-medium text-slate-800"
          >
            {t.profile.locationLabel}
          </label>
          <Input
            id="location"
            name="location"
            type="text"
            maxLength={200}
            defaultValue={profile?.location ?? ""}
            placeholder={t.profile.locationPlaceholder}
          />
        </div>
      </div>

      {state.message && (
        <p
          role="status"
          className={
            state.status === "error" ? "text-sm text-red-600" : "text-sm text-emerald-700"
          }
        >
          {state.message}
        </p>
      )}

      <Button type="submit" disabled={isPending} className="w-fit">
        {isPending ? (
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <Save className="size-4" aria-hidden="true" />
        )}
        {isPending ? t.profile.savingBtn : t.profile.saveBtn}
      </Button>
    </form>
  );
}
