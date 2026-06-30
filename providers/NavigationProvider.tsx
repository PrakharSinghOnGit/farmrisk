"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import { navigationItems } from "@/constants/navigation";

type pageProp = {
  name: string;
  component: ReactNode;
};

type NavigationContextType = {
  currentPage: pageProp;
  setCurrentPage: (page: string) => void;
  pages: pageProp[];
};

export const NavigationContext = createContext<
  NavigationContextType | undefined
>(undefined);

const pages = navigationItems;

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCPage] = useState<pageProp>(navigationItems[0]);

  useEffect(() => {
    const lastPage = localStorage.getItem("lastPage");
    if (lastPage) {
      const foundPage = pages.find((p) => p.name === lastPage);
      if (foundPage) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCPage(foundPage);
      }
    }
  }, []);

  const setCurrentPage = (page: string) => {
    const foundPage = pages.find((p) => p.name === page);
    if (foundPage) {
      localStorage.setItem("lastPage", foundPage.name);
      setCPage(foundPage);
    }
  };

  return (
    <NavigationContext.Provider value={{ currentPage, setCurrentPage, pages }}>
      {children}
    </NavigationContext.Provider>
  );
}
