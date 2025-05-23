import { LuWind } from "react-icons/lu";
import useWeatherData from "./useWeatherData";
import { BsDroplet } from "react-icons/bs";
import type { WeatherInfo } from "./WeatherInterface";

const MinorSectionBody = () => {
  const { weatherInfo, loading, error } = useWeatherData() as {
    weatherInfo: WeatherInfo | null;
    loading: boolean;
    error: unknown;
  };

  if (loading) return <div>Loading weather...</div>;
  if (error) return <div>Error loading weather data</div>;
  if (!weatherInfo) return <div>No weather data available</div>;
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex text-primary items-center gap-2 md:gap-3 lg:gap-4">
        <span className="text-3xl md:4xl lg:text-6xl">{weatherInfo.current?.temp_c}°</span>
        <span className="flex flex-col gap-1.5 md:gap-2">
          <div className="flex gap-2 items-center">
            <LuWind className="text-sm lg:text-lg" />
            <p className="text-black font-bold text-xs md:text-sm">
              {weatherInfo.current?.wind_mph} mph
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <BsDroplet className="text-sm md:text-lg" />
            <p className="text-black font-bold text-xs md:text-sm">
              {weatherInfo.current?.humidity}%
            </p>
          </div>
        </span>
      </div>
      <div className="flex flex-col gap-2 items-center">
        <p className="text-primary font-semibold text-xs md:text-sm">
          Feels like {weatherInfo.current?.feelslike_c}°
        </p>
        <p className="text-primary font-bold text-base">
          {weatherInfo.current?.condition.text}
        </p>
      </div>
    </div>
  );
};

export default MinorSectionBody;
