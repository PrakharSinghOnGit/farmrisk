"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import { selectedVillage } from "@/app/dashboard/_data/dashboard-data";

export type SelectedLocation = {
  lat: number;
  lng: number;
  name: string;
  displayName: string;
};

type LocationContextValue = {
  location: SelectedLocation;
  setLocation: (location: SelectedLocation) => void;
};

const LocationContext = createContext<LocationContextValue | null>(null);

const DEFAULT_LOCATION: SelectedLocation = {
  lat: selectedVillage.latitude,
  lng: selectedVillage.longitude,
  name: selectedVillage.name,
  displayName: "Dholka, Ahmedabad, Gujarat, India",
};

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<SelectedLocation>(DEFAULT_LOCATION);

  return (
    <LocationContext.Provider value={{ location, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationContext(): LocationContextValue {
  const ctx = useContext(LocationContext);
  if (!ctx) {
    throw new Error("useLocationContext must be used inside <LocationProvider>");
  }
  return ctx;
}
