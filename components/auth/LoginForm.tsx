"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { normalizePhoneNumber } from "@/lib/auth/phone";
import { createClient } from "@/supabase/client";
import { cn } from "@/lib/utils";

type Mode = "login" | "register";

function getSafeNextPath(value: string | null) {
  return value?.startsWith("/") && !value.startsWith("//")
    ? value
    : "/dashboard";
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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const normalizedPhone = normalizePhoneNumber(phone);
    const loginId = `${normalizedPhone}@farmrisk.app`;
    if (!normalizedPhone) {
      setError("Invalid Phone number. Please enter a valid 10-digit.");
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
          email: loginId,
          password: password,
          options: {
            data: {
              first_name: name,
              last_name: surname,
              phone: normalizedPhone,
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
          email: loginId,
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred.");
      setIsLoading(false);
    }
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-background p-6 shadow-xl sm:p-10 text-slate-900 dark:text-slate-900",
        className,
      )}
      {...props}
    >
      <div className="mb-6 text-center">
        <h1 className="text-2xl text-foreground font-semibold">
          {mode === "login" ? "Sign in to FarmRisk" : "Create your account"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4">
        {mode === "register" && (
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-foreground"
              >
                Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Name"
                value={name}
                className="text-foreground"
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div className="grid gap-2">
              <label
                htmlFor="surname"
                className="text-sm font-medium text-foreground"
              >
                Surname
              </label>
              <Input
                id="surname"
                type="text"
                placeholder="Surname"
                value={surname}
                className="text-foreground"
                onChange={(e) => setSurname(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>
        )}

        <div className="grid gap-2">
          <label
            htmlFor="phone"
            className="text-sm font-medium text-muted-foreground"
          >
            Phone number
          </label>
          <Input
            id="phone"
            type="tel"
            placeholder={"1234567890"}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={isLoading}
            className="text-foreground"
            required
            autoFocus
          />
        </div>

        <div className="grid gap-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-muted-foreground"
          >
            Password
          </label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            className="text-foreground"
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        {mode === "register" && (
          <div className="grid gap-2">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-foreground"
            >
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              className="text-foreground"
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
