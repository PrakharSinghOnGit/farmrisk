"use client";

import React from "react";
import AIOverview from "./AIOverview";
import { LocationSearchBar } from "./LocationSearchBar";
import Forcast from "./Forcast";
import Lightning from "./Lightning";
import HourlyWeather from "./HourlyWeather";
import SoilMoisture from "./SoilMoisture";
import Weather from "./Weather";
import { useWeather } from "@/hooks/use-weather";

const Overview = () => {
  const weatherData = useWeather();
  const { hourly, isLoading } = weatherData;

  return (
    <div className="flex flex-col gap-4 w-full">
      <LocationSearchBar />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full items-stretch">
        <div className="col-span-1 flex">
          <Weather weatherData={weatherData} />
        </div>
        <div className="col-span-1 lg:col-span-2 flex">
          <AIOverview />
        </div>
      </div>

      <Forcast hourly={hourly} isLoading={isLoading} />
      <HourlyWeather hourly={hourly} isLoading={isLoading} />

      <SoilMoisture />
      <Lightning />
    </div>
  );
};

export default Overview;
