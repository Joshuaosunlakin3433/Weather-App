
interface HourlyData {
  time: string;
  temp_c: number;
  condition: { text: string };
  date: string;
}

interface HourlySidebarProps {
  hourlyData: HourlyData[];
}

export default function HourlySidebar({ hourlyData }: HourlySidebarProps) {
  return (
    <div className="hourly-sidebar p-2 sm:p-3 lg:p-4">
      <h4 className="text-center font-medium text-black/80 text-xl sm:text-2xl mb-3 sm:mb-5 ">Hourly Forecast</h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-2 bg-white/90 mt-2 sm:mt-3">
        {hourlyData.map((hour, index) => (
          <div
        key={index}
        className="shadow-sm shadow-gray-300 flex flex-col items-center gap-2 sm:gap-3 p-2 sm:p-3 lg:p-3 rounded-xl sm:rounded-2xl w-full mx-auto mb-2 cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out"
          >
        <p className="text-black/80 font-bold text-xs sm:text-sm">
          {new Date(`2000-01-01T${hour.time.slice(11, 16)}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
          })}
        </p>
        <p className="text-primary font-medium text-lg sm:text-xl">{hour.temp_c}°</p>
        <p className="text-primary font-medium text-xs sm:text-sm text-center">
          {hour.condition.text}
        </p>
          </div>
        ))}
      </div>
        </div>
  );
}
