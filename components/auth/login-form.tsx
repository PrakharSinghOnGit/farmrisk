"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  LoaderCircle,
  MessageSquareText,
  Phone,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AUTH_CONFIG } from "@/lib/auth/config";
import { normalizePhoneNumber } from "@/lib/auth/phone";
import { createClient } from "@/supabase/client";
import { cn } from "@/lib/utils";

type Step = "phone" | "otp";

function getSafeNextPath(value: string | null) {
  return value?.startsWith("/") && !value.startsWith("//")
    ? value
    : AUTH_CONFIG.authenticatedPath;
}

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [verifiedPhone, setVerifiedPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const [devLoginLoading, setDevLoginLoading] = useState(false);

  useEffect(() => {
    if (resendIn <= 0) return;

    const timer = window.setInterval(() => {
      setResendIn((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendIn]);

  async function sendOtp() {
    const normalizedPhone = normalizePhoneNumber(phone);

    if (!normalizedPhone) {
      setError("Enter a valid phone number with country code, such as +91.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithOtp({
      phone: normalizedPhone,
      options: { shouldCreateUser: true },
    });

    setIsLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    setVerifiedPhone(normalizedPhone);
    setStep("otp");
    setOtp("");
    setResendIn(AUTH_CONFIG.otpResendDelaySeconds);
  }

  async function handlePhoneSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await sendOtp();
  }

  async function handleOtpSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!new RegExp(`^\\d{${AUTH_CONFIG.otpLength}}$`).test(otp)) {
      setError(`Enter the ${AUTH_CONFIG.otpLength}-digit code.`);
      return;
    }

    setIsLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: verifyError } = await supabase.auth.verifyOtp({
      phone: verifiedPhone,
      token: otp,
      type: "sms",
    });

    setIsLoading(false);

    if (verifyError) {
      setError(verifyError.message);
      return;
    }

    router.replace(getSafeNextPath(searchParams.get("next")));
    router.refresh();
  }

  function changePhone() {
    setStep("phone");
    setOtp("");
    setError(null);
    setResendIn(0);
  }

  async function handleDevLogin() {
    setDevLoginLoading(true);
    setError(null);

    const response = await fetch("/auth/dev-login", { method: "POST" });

    setDevLoginLoading(false);

    if (!response.ok) {
      setError("Development login is only available while running locally.");
      return;
    }

    router.replace(getSafeNextPath(searchParams.get("next")));
    router.refresh();
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-emerald-950/10 bg-white p-6 shadow-xl shadow-emerald-950/5 sm:p-8",
        className,
      )}
      {...props}
    >
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          {step === "phone" ? (
            <Phone aria-hidden="true" className="size-5" />
          ) : (
            <MessageSquareText aria-hidden="true" className="size-5" />
          )}
        </div>
        <h1 className="text-2xl font-semibold text-slate-950">
          {step === "phone" ? "Sign in with your phone" : "Enter your code"}
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {step === "phone"
            ? "We’ll text you a one-time code. New phone numbers get a FarmRisk account automatically."
            : `We sent a ${AUTH_CONFIG.otpLength}-digit code to ${verifiedPhone}.`}
        </p>
      </div>

      {step === "phone" ? (
        <form onSubmit={handlePhoneSubmit} className="grid gap-5">
          <div className="grid gap-2">
            <label
              htmlFor="phone"
              className="text-sm font-medium text-slate-800"
            >
              Phone number
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder={AUTH_CONFIG.phonePlaceholder}
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              disabled={isLoading}
              required
              autoFocus
              className="text-slate-900 dark:text-slate-900"
            />
            <p className="text-xs text-slate-500">
              Include your country code. No email or password is needed.
            </p>
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading && (
              <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
            )}
            {isLoading ? "Sending code..." : "Send OTP"}
          </Button>

          {process.env.NODE_ENV === "development" ? (
            <Button
              type="button"
              variant="secondary"
              disabled={isLoading || devLoginLoading}
              onClick={handleDevLogin}
              className="w-full"
            >
              {devLoginLoading ? (
                <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Sparkles className="size-4" aria-hidden="true" />
              )}
              {devLoginLoading ? "Entering demo mode..." : "Continue in demo mode"}
            </Button>
          ) : null}
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit} className="grid gap-5">
          <div className="grid gap-2">
            <label htmlFor="otp" className="text-sm font-medium text-slate-800">
              One-time code
            </label>
            <Input
              id="otp"
              name="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern={`[0-9]{${AUTH_CONFIG.otpLength}}`}
              maxLength={AUTH_CONFIG.otpLength}
              placeholder="123456"
              value={otp}
              onChange={(event) =>
                setOtp(event.target.value.replace(/\D/g, ""))
              }
              disabled={isLoading}
              required
              autoFocus
              className="text-center text-lg tracking-[0.45em] text-slate-900 dark:text-slate-900"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading && (
              <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
            )}
            {isLoading ? "Verifying..." : "Verify and continue"}
          </Button>

          <div className="flex items-center justify-between gap-4 text-sm">
            <button
              type="button"
              onClick={changePhone}
              disabled={isLoading}
              className="text-slate-600 underline-offset-4 hover:underline"
            >
              Change number
            </button>
            <button
              type="button"
              onClick={sendOtp}
              disabled={isLoading || resendIn > 0}
              className="text-emerald-700 underline-offset-4 hover:underline disabled:text-slate-400"
            >
              {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend code"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
