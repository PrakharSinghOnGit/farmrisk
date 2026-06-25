"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pickaxe, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";
import { useLanguage } from "@/hooks/use-language";

interface AuthButtonsProps {
  className?: string;
  isScrolled?: boolean;
}

export function AuthButtons({ className, isScrolled }: AuthButtonsProps) {
  const { user, loading } = useAuth();
  const { t } = useLanguage();

  if (loading) {
    return <div className="bg-foreground/50 rounded-lg h-9 w-24" />;
  }

  if (user) {
    return (
      <div
        className={cn(
          "bg-foreground/10 border p-0.5",
          isScrolled ? "rounded-lg" : "rounded-xl",
          className
        )}
      >
        <Button
          asChild
          size={isScrolled ? "sm" : "lg"}
          className={cn(
            isScrolled ? "rounded-lg h-8 px-3 text-xs" : "rounded-xl px-5 text-base",
            className
          )}
        >
          <Link href="/dashboard">
            <span className="flex gap-1.5 items-center">
              <LayoutDashboard className={isScrolled ? "size-3.5" : "size-4"} />
              {t.nav.goDashboard}
            </span>
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-foreground/10 border p-0.5",
        isScrolled ? "rounded-lg" : "rounded-xl",
        className
      )}
    >
      <Button
        asChild
        size={isScrolled ? "sm" : "lg"}
        className={cn(
          isScrolled ? "rounded-lg h-8 px-3 text-xs" : "rounded-xl px-5 text-base"
        )}
      >
        <Link href="/dashboard">
          <span className="flex gap-1.5 items-center text-nowrap">
            {t.nav.getStarted}
            <Pickaxe className={isScrolled ? "size-3.5" : "size-4"} />
          </span>
        </Link>
      </Button>
    </div>
  );
}
