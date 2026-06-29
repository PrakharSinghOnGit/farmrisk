"use client";

import { Moon, Sun } from "lucide-react";
import { useModeAnimation } from "react-theme-switch-animation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ModeToggleProps {
  isScrolled?: boolean;
}

export function ModeToggle({ isScrolled = true }: ModeToggleProps) {
  const { ref, toggleSwitchTheme } = useModeAnimation({
    duration: 500,
  });

  return (
    <div className="relative inline-block text-left">
      <Button
        ref={ref}
        variant="outline"
        size={isScrolled ? "icon-sm" : "icon-lg"}
        className={cn(
          "text-black dark:text-white border-black/50 dark:border-slate-200/60 rounded-full cursor-pointer p-2",
          isScrolled ? "w-10 h-10" : "",
        )}
        onClick={toggleSwitchTheme}
        aria-label="Toggle theme"
      >
        <Sun className="scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
        <Moon className="absolute scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      </Button>
    </div>
  );
}
