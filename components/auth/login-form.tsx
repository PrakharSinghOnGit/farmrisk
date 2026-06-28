"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LoaderCircle, Lock, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AUTH_CONFIG } from "@/lib/auth/config";
import { normalizePhoneNumber } from "@/lib/auth/phone";
import { createClient } from "@/supabase/client";
import { cn } from "@/lib/utils";

type Mode = "login" | "register";

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
  const [mode, setMode] = useState<Mode>("login");
  
  // Form fields
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // OTP login logic (DISABLED FOR NOW, preserved as requested)
  /*
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [otp, setOtp] = useState("");
  const [verifiedPhone, setVerifiedPhone] = useState("");
  const [resendIn, setResendIn] = useState(0);

  async function sendOtp() {
    const normalizedPhone = normalizePhoneNumber(phone);
    if (!normalizedPhone) {
      setError("Enter a valid phone number with country code.");
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
  */

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    
    const normalizedPhone = normalizePhoneNumber(phone);
    if (!normalizedPhone) {
      setError("Enter a valid phone number with country code, such as +91.");
      return;
    }

    if (mode === "register") {
      if (!name.trim()) {
        setError("Name is required.");
        return;
      }
      if (!surname.trim()) {
        setError("Surname is required.");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    } else {
      if (!password) {
        setError("Password is required.");
        return;
      }
    }

    setIsLoading(true);
    const supabase = createClient();

    try {
      if (mode === "register") {
        const { error: signUpError } = await supabase.auth.signUp({
          phone: normalizedPhone,
          password: password,
          options: {
            data: {
              first_name: name,
              last_name: surname,
            },
          },
        });

        if (signUpError) {
          setError(signUpError.message);
          setIsLoading(false);
          return;
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          phone: normalizedPhone,
          password: password,
        });

        if (signInError) {
          setError(signInError.message);
          setIsLoading(false);
          return;
        }
      }

      router.replace(getSafeNextPath(searchParams.get("next")));
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred.");
      setIsLoading(false);
    }
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-emerald-950/10 bg-white p-6 shadow-xl shadow-emerald-950/5 sm:p-8 text-slate-900 dark:text-slate-900",
        className,
      )}
      {...props}
    >
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          {mode === "login" ? <Lock className="size-5" /> : <User className="size-5" />}
        </div>
        <h1 className="text-2xl font-semibold">
          {mode === "login" ? "Sign in to FarmRisk" : "Create your account"}
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {mode === "login"
            ? "Enter your credentials to access your personalized dashboard."
            : "Register to get a personalized dashboard and advanced features."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4">
        {mode === "register" && (
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium text-slate-800">
                Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="surname" className="text-sm font-medium text-slate-800">
                Surname
              </label>
              <Input
                id="surname"
                type="text"
                placeholder="Surname"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>
        )}

        <div className="grid gap-2">
          <label htmlFor="phone" className="text-sm font-medium text-slate-800">
            Phone number
          </label>
          <Input
            id="phone"
            type="tel"
            placeholder={AUTH_CONFIG.phonePlaceholder}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={isLoading}
            required
            autoFocus
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="password" className="text-sm font-medium text-slate-800">
            Password
          </label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        {mode === "register" && (
          <div className="grid gap-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-800">
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
        )}

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && (
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          )}
          {isLoading
            ? mode === "login"
              ? "Signing in..."
              : "Registering..."
            : mode === "login"
            ? "Sign In"
            : "Register"}
        </Button>

        <div className="text-center mt-2">
          <button
            type="button"
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError(null);
            }}
            className="text-sm text-emerald-700 hover:underline"
            disabled={isLoading}
          >
            {mode === "login"
              ? "Don't have an account? Register"
              : "Already have an account? Sign In"}
          </button>
        </div>
      </form>
    </div>
  );
}
