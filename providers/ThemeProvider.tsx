"use client";

import * as React from "react";

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
  [key: string]: unknown;
}) {
  React.useEffect(() => {
    // Check localStorage for preferred theme, defaulting to dark
    const savedTheme = localStorage.getItem("theme");
    const isDark = savedTheme ? savedTheme === "dark" : true;

    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return <div>{children}</div>;
}
