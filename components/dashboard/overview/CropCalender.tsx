"use client";

import { useLocationContext } from "@/providers/LocationProvider";
import React, { useState, useEffect } from "react";
import { type CropOption } from "./Overview";
import { Badge } from "@/components/ui/badge";

interface CalendarEvent {
  crop: string;
  season: string;
  sowingPeriod: string;
  harvestingPeriod: string;
  sowFromMon: number | null;
  sowToMon: number | null;
  harvFromMon: number | null;
  harvToMon: number | null;
}

interface CalendarAPIResponse {
  success: boolean;
  state: string;
  district: string;
  districtCode: string | null;
  calendar: CalendarEvent[];
}

interface CropCalenderProps {
  selectedCrop: CropOption;
}

const MONTHS_LABELS = [
  "J",
  "F",
  "M",
  "A",
  "M",
  "J",
  "J",
  "A",
  "S",
  "O",
  "N",
  "D",
];

const CropCalender = ({ selectedCrop }: CropCalenderProps) => {
  const { location } = useLocationContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<CalendarAPIResponse | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchCalendar() {
      if (!location.lat || !location.lng) return;

      setLoading(true);
      setError(null);
      setData(null);
      localStorage.removeItem("farmrisk-crop-calendar");
      window.dispatchEvent(new CustomEvent("farmrisk-calendar-loading"));

      try {
        console.log(
          `[CropCalender] Fetching: /api/calender?lat=${location.lat}&lng=${location.lng}&crop=${selectedCrop.id}`,
        );
        const response = await fetch(
          `/api/calender?lat=${location.lat}&lng=${location.lng}&crop=${selectedCrop.id}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: CalendarAPIResponse = await response.json();
        console.log("[CropCalender] Fetched calendar data:", result);
        if (result.success) {
          setData(result);
          localStorage.setItem("farmrisk-crop-calendar", JSON.stringify(result.calendar));
          window.dispatchEvent(new CustomEvent("farmrisk-calendar-loaded", { detail: result.calendar }));
        } else {
          throw new Error("API responded with success: false");
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Error fetching crop calendar:", err);
          setError(err.message || "Failed to load crop calendar");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchCalendar();

    return () => {
      controller.abort();
    };
  }, [location.lat, location.lng, selectedCrop.id]);

  if (loading) {
    return (
      <div className="w-full bg-card border border-border rounded-xl p-5 shadow-sm select-none">
        <p className="text-xs text-muted-foreground animate-pulse pl-1.5">
          Fetching regional crop calendar matching &quot;{selectedCrop.name}
          &quot;...
        </p>
      </div>
    );
  }

  if (error || !data || !data.calendar || data.calendar.length === 0) {
    return null;
  }

  // Find current month index (1-12) and day calculation for the "Today" marker pin position
  const today = new Date();
  const currentMonthNum = today.getMonth() + 1; // 1 to 12
  const currentDayNum = today.getDate();
  const totalDaysInMonth = new Date(
    today.getFullYear(),
    currentMonthNum,
    0,
  ).getDate();

  // Percent positioning helper for absolute marker placement across the grid layout width
  const todayPercentPosition =
    (currentMonthNum - 1 + currentDayNum / totalDaysInMonth) * (100 / 12);

  return (
    <div className="w-full bg-card border border-border rounded-xl p-5 shadow-sm select-none transition-all">
      {/* 1. COMPONENT HEADER STRIP */}
      <div className="flex items-center justify-between mb-3 border-b border-border/40 pb-2">
        <div className="flex gap-3 items-center justify-between">
          <h3 className="text-xs font-bold text-foreground tracking-wider uppercase">
            Crop Calendar
          </h3>
          <Badge>{selectedCrop.name}</Badge>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-2 bg-zinc-200 dark:bg-zinc-800 rounded-xs border border-border/40" />
            <span>Off-Season</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-2 bg-emerald-500 rounded-xs" />
            <span>Sowing Window</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-2 bg-amber-500/30 rounded-xs border border-amber-500/20" />
            <span>Growing Stage</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-2 bg-rose-500 rounded-xs" />
            <span>Harvest Period</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-0.5 h-3 bg-zinc-950 dark:bg-zinc-100" />
            <span className="font-medium text-foreground/80">Today Pin</span>
          </div>
        </div>
      </div>

      {/* 2. RENDER EACH CALENDAR SEASON TRACK RECORD */}
      {data.calendar.map((event, idx) => {
        // Fallback or map standard seasonal bounds
        const startSow = event.sowFromMon || 6;
        const endSow = event.sowToMon || startSow;
        const startHarv = event.harvFromMon || 11;
        const endHarv = event.harvToMon || startHarv;

        return (
          <div key={idx} className="mb-4 last:mb-0">
            {/* SUBTITLE META DETS */}
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-foreground/90">
                {event.season || "Kharif"} Season
              </span>
            </div>

            {/* TIMELINE SLIDER CONTAINER TRACK */}
            <div className="relative w-full h-8 bg-zinc-100 dark:bg-zinc-900 rounded-lg overflow-hidden border border-border/40">
              {/* BACKPLANE MONTH SEGMENT COLS FOR ACCURATE GRID TRACKING */}
              <div className="absolute inset-0 grid grid-cols-12 w-full h-full pointer-events-none">
                {MONTHS_LABELS.map((m, mIdx) => (
                  <div
                    key={mIdx}
                    className="flex items-center justify-center border-r border-border/10 last:border-r-0 text-[10px] font-medium text-muted-foreground/40"
                  >
                    {m}
                  </div>
                ))}
              </div>

              {/* A. GROWING SEASON BACKGROUND FILL LAYER (YELLOW DULL COVERAGE BETWEEN SOW AND HARVEST) */}
              <div
                className="absolute h-full bg-amber-500/20 dark:bg-amber-400/10 border-x border-amber-500/10"
                style={{
                  left: `${(startSow - 1) * (100 / 12)}%`,
                  width: `${(endHarv >= startSow ? endHarv - startSow + 1 : 12 - startSow + endHarv + 1) * (100 / 12)}%`,
                }}
              />

              {/* B. SOWING BLOCK TARGET OVERLAY (GREEN) */}
              <div
                className="absolute h-full bg-emerald-600 dark:bg-emerald-500 rounded-l-sm transition-all"
                style={{
                  left: `${(startSow - 1) * (100 / 12)}%`,
                  width: `${(endSow - startSow + 1) * (100 / 12)}%`,
                }}
              />

              {/* C. HARVESTING BLOCK TARGET OVERLAY (RED) */}
              <div
                className="absolute h-full bg-rose-600 dark:bg-rose-500 rounded-r-sm transition-all"
                style={{
                  left: `${(startHarv - 1) * (100 / 12)}%`,
                  width: `${(endHarv - startHarv + 1) * (100 / 12)}%`,
                }}
              />

              {/* D. TODAY INDICATOR VERTICAL PIN LINE LAYER */}
              <div
                className="absolute top-0 bottom-0 w-[2px] bg-zinc-900 dark:bg-zinc-100 z-10 shadow-xs flex items-center justify-center"
                style={{ left: `${todayPercentPosition}%` }}
              >
                <span className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-zinc-950 dark:bg-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CropCalender;
