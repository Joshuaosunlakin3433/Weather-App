import { ImDroplet } from "react-icons/im";
import { LuWind } from "react-icons/lu";

interface WeatherInfoProps {
  temp: number;
  windSpeed: number;
  humidity: number;
  weatherCondition: string;
}

const WeatherInfo = ({
  temp,
  windSpeed,
  humidity,
  weatherCondition,
}: WeatherInfoProps) => {
  return (
    <div>
      <div>
        <span>{temp}°</span>
        <div>
          <div>
            <p>{windSpeed}</p>
            <span>
              <LuWind />
            </span>
          </div>
          <div>
            <p>{humidity}</p>
            <span>
              <ImDroplet />
            </span>
          </div>
        </div>
      </div>
      <p>{weatherCondition}</p>
    </div>
  );
};

export default WeatherInfo;
