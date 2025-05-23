import { useState, useEffect, useCallback } from "react";
import { toWeekDays } from "./ConvertToWeekDays";
import useWeatherData from "./useWeatherData";
import type { WeatherInfo } from "./WeatherInterface";
// import weatherInfo from './WeatherInfo';

export default function WeatherApp() {
  const [selectedDay, setSelectedDay] = useState(0); // 0 = today, 1 = tomorrow, etc.
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

      // If it's today, start from current hour
      // If it's future days, start from hour 0
      const startHour = dayIndex === 0 ? currentHour : 0;

      // Get 6 hours of data
      const sixHours = [];
      for (let i = 0; i < 6; i++) {
        const hourIndex = startHour + i;

        // Make sure we don't go beyond 23 hours
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
  // Handle day card click

  if (loading) return <div>Loading weather...</div>;
  if (error) return <div>Error loading weather data</div>;
  if (!weatherInfo) return <div>No weather data available</div>;
  if (!weatherInfo || !weatherInfo.forecast) return null;

  // Update hourly data when selected day changes
  const handleDayClick = (dayIndex: number) => {
    setSelectedDay(dayIndex);
  };

  return (
    <div className="weather-app">
      {/* Main section - Daily cards */}
      <div className="daily-cards">
        {weatherInfo?.forecast.forecastday.map((day, index) => (
          <div
            key={index}
            className={`day-card ${selectedDay === index ? "active" : ""}`}
            onClick={() => handleDayClick(index)}
          >
            <h3>{toWeekDays(day.date)}</h3>
            <p>{day.day.condition.text}</p>
            <p>
              {day.day.maxtemp_c}°C / {day.day.mintemp_c}°C
            </p>
          </div>
        ))}
      </div>

      {/* Sidebar - Hourly cards */}
      <div className="hourly-sidebar">
        <h4 className="text-center font-medium">Hourly Forcast</h4>
        {hourlyData.map((hour, index) => (
          <div
            key={index}
            className="flex flex-col gap-2 border-1 border-primary shadow-sm p-3 rounded-xl items-center"
          >
            <p className="text-black/90 font-medium text-sm">
              {toWeekDays(hour.date)}
            </p>
            <p className="text-primary font-medium">{hour.temp_c}°</p>
            <p className="text-primary font-medium text-base">
              {hour.condition.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
