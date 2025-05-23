import { useState, useEffect, useCallback } from "react";
import useWeatherData from "./components/useWeatherData";
import type { WeatherInfo } from "./components/WeatherInterface";
import DailyCards from "./components/DailyCards";
import HourlySidebar from "./components/HourlyCards";
import { MinorSectionHeader } from "./components/MinorSectionHeader";
import MinorSectionBody from "./components/MinorSectionBody";
import { BsDroplet } from "react-icons/bs";
import { LuWind } from "react-icons/lu";
import Footer from "./components/Footer";

const App = ()=> {
  const [selectedDay, setSelectedDay] = useState(0);

  interface HourlyData {
    time: string;
    temp_c: number;
    condition: { text: string };
    date: string;
  }

  const [hourlyData, setHourlyData] = useState<HourlyData[]>([]);

  const { weatherInfo, loading, error } = useWeatherData() as {
    weatherInfo: WeatherInfo | null;
    loading: boolean;
    error: unknown;
  };

  // Function to get 6 hours of data starting from current hour
  const getHourlyData = useCallback(
    (dayIndex: number) => {
      if (!weatherInfo || !weatherInfo.forecast) return [];

      const currentHour = new Date().getHours();
      const selectedDayData = weatherInfo.forecast.forecastday[dayIndex];

      const startHour = dayIndex === 0 ? currentHour : 0;

      const sixHours = [];
      for (let i = 0; i < 6; i++) {
        const hourIndex = startHour + i;

        if (hourIndex < 24) {
          const hourData = selectedDayData.hour[hourIndex];
          sixHours.push({
            ...hourData,
            date: selectedDayData.date,
          });
        }
      }
      return sixHours;
    },
    [weatherInfo]
  );

  useEffect(() => {
    if (weatherInfo) {
      const newHourlyData = getHourlyData(selectedDay);
      setHourlyData(newHourlyData);
    }
  }, [selectedDay, weatherInfo, getHourlyData]);

  const handleDayClick = (dayIndex: number) => {
    setSelectedDay(dayIndex);
  };
  // Function to format date to dd.mm.yyyy format
  const formatDate = (date: string | undefined) =>
    date ? date.slice(0, 10).split("-").reverse().join(".") : "";

  if (loading) return <div>Loading weather...</div>;
  if (error) return <div>Error loading weather data</div>;
  if (!weatherInfo) return <div>No weather data available</div>;
  if (!weatherInfo || !weatherInfo.forecast) return null;

  return (
    <div>
       <div className="weather-app font-primary flex flex-col lg:flex-row justify-between min-h-screen">
      <div className="bg-white shadow-2xs w-full lg:w-3/4 p-3 lg:p-5">
      <nav className="flex justify-between px-2 lg:px-0 mb-5 sticky top-0 bg-white z-10 py-3">
        <p className="text-black/80 font-semibold text-sm lg:text-base lg:ml-15">
        {weatherInfo.location?.name}
        </p>
        <p className="font-semibold text-sm lg:text-base lg:mr-15">
        {formatDate(weatherInfo.location?.localtime)}
        </p>
      </nav>
      <div className="flex flex-col items-center gap-6 lg:gap-9">
        <div >
        <div className="flex text-primary items-center gap-2 lg:gap-3 ">
          <div className="flex flex-col gap-3 items-center">
          <span className="text-[3.5rem] sm:text-[8rem] lg:text-[13rem]">
            {weatherInfo.current?.temp_c}°
          </span>
          <p className="text-primary text-base sm:text-xl lg:text-3xl font-semibold -mt-2 lg:-mt-10 lg:ml-10">
            {weatherInfo.current?.condition.text}
          </p>
          </div>

          <span className="-ml-5 lg:-ml-7 mt-6 lg:mt-13 flex flex-col gap-1.5  ">
          <div className="flex gap-2 lg:gap-3 items-center">
            <LuWind className="text-sm md:text-base lg:text-xl" />
            <p className="text-primary font-medium text-sm lg:text-lg">
            {weatherInfo.current?.wind_mph} mph
            </p>
          </div>
          <div className="flex gap-2 lg:gap-3 items-center">
            <BsDroplet className="text-sm md:text-base lg:text-xl" />
            <p className="text-primary font-medium text-sm lg:text-lg">
            {weatherInfo.current?.humidity}%
            </p>
          </div>
          </span>
        </div>
        </div>
        <DailyCards
        weatherInfo={weatherInfo}
        selectedDay={selectedDay}
        onDayClick={handleDayClick}
        />
      </div>
      
      </div>
      <div className="bg-white/30 border-t-1 lg:border-l-1 lg:border-t-0 border-primary p-2 flex flex-col gap-8 lg:gap-15 font-semibold text-black/80 text-lg lg:text-xl w-full lg:w-1/4">
      <MinorSectionHeader />
      <MinorSectionBody />
      <HourlySidebar hourlyData={hourlyData} />
      </div>
      
    </div>
      <Footer />
    </div>
   
  );
}
export default App;