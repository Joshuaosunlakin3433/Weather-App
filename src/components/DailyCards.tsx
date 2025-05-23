import { toWeekDays } from "./ConvertToWeekDays";
import type { WeatherInfo } from "./WeatherInterface";

interface DailyCardsProps {
  weatherInfo: WeatherInfo;
  selectedDay: number;
  onDayClick: (dayIndex: number) => void;
}

export default function DailyCards({
  weatherInfo,
  selectedDay,
  onDayClick,
}: DailyCardsProps) {
return (
    <div className="daily-cards grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 mt-4 sm:mt-8 md:mt-15 px-2 sm:px-4">
        {weatherInfo?.forecast?.forecastday.map((day, index) => (
            <div
                key={index}
                className={`day-card ${
                    selectedDay === index
                        ? "active border border-primary shadow-2xs flex flex-col items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-2xl w-full max-w-[96px] cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out"
                        : "bg-linear-to-br from-gray-300 to-gray-500 shadow-2xs flex flex-col items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-2xl w-full max-w-[96px] cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out"
                }`}
                onClick={() => onDayClick(index)}
            >
                <h3 className="text-[10px] sm:text-xs text-black/80 font-extrabold">
                    {toWeekDays(day.date)}
                </h3>
                <p className="text-lg sm:text-xl text-primary font-extrabold">
                    {day.day.maxtemp_c}°
                </p>
                <p className="text-[10px] sm:text-xs text-primary font-semibold text-center">
                    {day.day.condition.text}
                </p>
            </div>
        ))}
    </div>
);
}
