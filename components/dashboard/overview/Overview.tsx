import AIOverview from "./AIOverview";
import { LocationSearchBar } from "./LocationSearchBar";
import Download from "./Download";
import Forcast from "./Forcast";
import Lightning from "./Lightning";
import HourlyWeather from "./HourlyWeather";
import SoilMoisture from "./SoilMoisture";
import Weather from "./Weather";

const Overview = () => {
  return (
    <>
      <Download />
      <LocationSearchBar />
      <Weather />
      <AIOverview />
      <Forcast />
      <HourlyWeather />
      <SoilMoisture />
      <Lightning />
    </>
  );
};

export default Overview;
