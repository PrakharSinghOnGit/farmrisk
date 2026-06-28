"use client";

import { Moon, Sun } from "lucide-react";
import { useModeAnimation } from "react-theme-switch-animation";
import { Button } from "@/components/ui/button";

interface ModeToggleProps {
  isScrolled?: boolean;
}

export function ModeToggle({ isScrolled = true }: ModeToggleProps) {
  const { ref, toggleSwitchTheme } = useModeAnimation({
    duration: 400, // Optional: adjust animation duration
  });

  return (
    <div>
      <Button
        ref={ref}
        variant="outline"
        size={isScrolled ? "icon-sm" : "icon-lg"}
        className="text-black dark:text-white rounded-full cursor-pointer"
        // onClick={() => changeTheme()}
        onClick={toggleSwitchTheme}
        aria-label="Toggle theme"
      >
        <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      </Button>
    </div>
  );
}
