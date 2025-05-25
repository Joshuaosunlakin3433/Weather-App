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

const App = () => {
  const [selectedDay, setSelectedDay] = useState(0);
  const [showCityInput, setShowCityInput] = useState(false);
  const [cityInput, setCityInput] = useState("");

  interface HourlyData {
    time: string;
    temp_c: number;
    condition: { text: string };
    date: string;
  }

  const [hourlyData, setHourlyData] = useState<HourlyData[]>([]);

  const {
    weatherInfo,
    loading,
    error,
    // debugInfo,
    locationMethod,
    fetchWeatherByCity,
  } = useWeatherData() as {
    weatherInfo: WeatherInfo | null;
    loading: boolean;
    error: unknown;
    debugInfo: string;
    locationMethod: "gps" | "manual" | "default";
    fetchWeatherByCity: (city: string) => void;
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

  const handleCitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cityInput.trim()) {
      fetchWeatherByCity(cityInput.trim());
      setShowCityInput(false);
      setCityInput("");
    }
  };

  // Function to format date to dd.mm.yyyy format
  const formatDate = (date: string | undefined) =>
    date ? date.slice(0, 10).split("-").reverse().join(".") : "";

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-lg mb-4 animate-ping text-center">Loading weather...</div>
        {/* <div
          style={{
            fontSize: "14px",
            color: "#666",
            padding: "10px",
            background: "#f5f5f5",
            borderRadius: "8px",
            maxWidth: "400px",
            textAlign: "center",
          }}
        >
          🐛 Debug: {debugInfo}
        </div> */}
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        {/* <div className="text-lg mb-4">Error loading weather data</div> */}
        {/* <div
          style={{
            fontSize: "14px",
            color: "#d00",
            padding: "10px",
            background: "#fee",
            borderRadius: "8px",
            maxWidth: "400px",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          🐛 Debug: {debugInfo}
        </div> */}
        <button
          onClick={() => setShowCityInput(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Enter City Manually
        </button>
      </div>
    );

  if (!weatherInfo) return <div>No weather data available</div>;
  if (!weatherInfo || !weatherInfo.forecast) return null;

  return (
    <div>
      {/* City Input Modal */}
      {showCityInput && (
        <div className="fixed inset-0 bg-linear-to-br from-gray-300 to-gray-400 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-black/70">Enter Your City</h3>
            <form onSubmit={handleCitySubmit}>
              <input
                type="text"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                placeholder="Enter city name..."
                className="border border-gray-300 rounded px-3 py-2 w-full mb-4 outline-none focus:border-gray-200"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-linear-to-r from-gray-300 to-gray-400 hover:from-gray-400 hover:to-gray-300 text-white px-4 py-2 rounded"
                >
                  Get Weather
                </button>
                <button
                  type="button"
                  onClick={() => setShowCityInput(false)}
                  className="bg-white border-1 border-gray-300 text-black/70 px-4 py-2 rounded hover:bg-gray-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="weather-app font-primary flex flex-col lg:flex-row justify-between min-h-screen">
        <div className="bg-white shadow-2xs w-full lg:w-3/4 p-3 lg:p-5">
          <nav className="flex justify-between px-2 lg:px-0 mb-5 sticky top-0 bg-white z-10 py-3">
            <div className="flex items-center gap-2">
              <p className="text-black/80 font-semibold text-sm lg:text-base lg:ml-15">
                {weatherInfo.location?.name}
              </p>
              {locationMethod === "default" && (
                <button
                  onClick={() => setShowCityInput(true)}
                  className="bg-linear-to-r from-gray-300 to-gray-400 hover:from-gray-400 hover:to-gray-300 shadow-2xs py-1.5 px-3 rounded-md text-black/80 text-xs transition-all duration-300"
                >
                  Change Location
                </button>
              )}
            </div>
            <p className="font-semibold text-sm lg:text-base lg:mr-15">
              {formatDate(weatherInfo.location?.localtime)}
            </p>
          </nav>

          <div className="flex flex-col items-center gap-6 lg:gap-9">
            <div>
              <div className="relative flex text-primary items-center justify-center gap-2 lg:gap-3 w-[19.3rem] sm:w-[25rem] lg:w-[37rem]">
                <div className="flex flex-col gap-3 items-center bg-red ">
                  <span className="text-[3.5rem] sm:text-[8rem] lg:text-[13rem]">
                    {weatherInfo.current?.temp_c}°
                  </span>
                  <p className="text-primary text-center sm:text-xl lg:text-3xl font-semibold mt- sm:mt-0">
                    {weatherInfo.current?.condition.text}
                  </p>
                </div>

                <span className="absolute right-5 top-11 sm:top-26 sm:right-1.5 lg:top-42 lg:right-0 flex flex-col gap-1.5">
                  <div className="flex gap-2 lg:gap-3 items-center">
                    <LuWind className="text-sm sm:text-lg lg:text-xl" />
                    <p className="text-primary font-medium text-sm lg:text-lg">
                      {weatherInfo.current?.wind_mph} mph
                    </p>
                  </div>
                  <div className="flex gap-2 lg:gap-3 items-center">
                    <BsDroplet className="text-sm sm:text-lg lg:text-xl" />
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
          <MinorSectionBody weatherInfo={weatherInfo} loading={loading} error={error}/>
          <HourlySidebar hourlyData={hourlyData} />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default App;
