import { data } from "./API/Api";
import { LuWind } from "react-icons/lu";
import { useEffect, useState } from "react";
import axios from "axios";
import Greeting from "./components/Greeting";
import TimeComponent from "./components/Time";
import { BsDroplet } from "react-icons/bs";

const App = () => {
  interface WeatherInfo {
    location?: {
      name: string;
      localtime: string;
    };
    current?: {
      temp_c: number;
      wind_mph: number;
      humidity: number;
      feelslike_c: number;
      condition: {
        text: string;
      };
    };
    forecast?: {
      forecastday: {
        date: string;
        day: {
          maxtemp_c: number;
          mintemp_c: number;
          condition: {
            text: string;
          };
        };
      }[];
    };
  }
  const [weatherInfo, setWeatherInfo] = useState<WeatherInfo>({});
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setLatitude(latitude);
      setLongitude(longitude);
      console.log(longitude, latitude);

      const fetchData = async () => {
        if (latitude && longitude) {
          try {
            const res =
              await axios.get(`http://api.weatherapi.com/v1/forecast.json?key=${
                import.meta.env.VITE_API_KEY
              }&q=${latitude},${longitude}&q=&days=7&aqi=no&alerts=no
`);
            console.log(res.data);
            setWeatherInfo(res.data);
          } catch (error) {
            console.log("Error fetching weather data", error);
          }
        }
      };
      fetchData();
    });
  }, []);

  // function to format date from API to a more readable format
  const formatDate = (date: string | undefined) =>
    date ? date.slice(0, 10).split("-").reverse().join(".") : "";
  //function to convert date string to weekday
  const toWeekDays = (dateString: string | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    console.log(date);
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    console.log(dayName);
    return dayName;
  };

  //function to render greetings based on user browsers time

  return (
    <div className="font-primary">
      {/* this div wraps the entire page so as to flex the two sections */}
      <div className="flex justify-between">
        {/* major section starts */}
        <div className="bg-white shadow-2xs w-3/4 p-5">
          <nav className="flex justify-between">
            <p className="text-black/80 font-semibold">
              {weatherInfo.location?.name}
            </p>
            <p className="font-semibold">
              {formatDate(weatherInfo.location?.localtime)}
            </p>
          </nav>
          {/* big texts start */}

          <div className="flex flex-col items-center gap-9">
            <div>
              <div className="flex text-primary items-center gap-3">
                <div className="flex flex-col items-center">
                  <span className="text-[14rem]">
                    {weatherInfo.current?.temp_c}°
                  </span>
                  <p className="text-primary text-2xl font-semibold -mt-10 ml-10">
                    {weatherInfo.current?.condition.text}
                  </p>
                </div>

                <span className="-ml-7 mt-13">
                  <div className="flex gap-3 items-center">
                    <LuWind className="text-xl"/>
                    <p className="text-primary font-medium text-lg">
                      {weatherInfo.current?.wind_mph} mph
                    </p>
                  </div>
                  <div className="flex gap-3 items-center">
                    <BsDroplet className="text-xl"/>

                    <p className="text-primary font-medium text-lg">
                      {weatherInfo.current?.humidity}%
                    </p>
                  </div>
                </span>
              </div>
            </div>
            {/* //major section cards forcast begins */}
            <div className="grid grid-cols-7 gap-2 mt-15">
              {weatherInfo.forecast?.forecastday.map((item) => (
                <div
                  key={item.date}
                  className="flex flex-col items-center gap-2 border-1 border-primary shadow-sm p-3 rounded-xl"
                >
                  <p className="text-black/90 font-medium text-sm">
                    {toWeekDays(item.date)}
                  </p>
                  <p className="text-primary font-medium">
                    {item.day.maxtemp_c}°
                  </p>
                  <p className="text-primary font-medium text-base text-center">
                    {item.day.condition.text}
                  </p>
                </div>
              ))}
            </div>
            {/* major section card forcast ends            */}
          </div>
        </div>
        {/* major section ends */}
        {/* //minor section starts here */}
        <div className="bg-white/30 border-l-1 pt-4 lg:h-[100vh] border-primary p-2 flex flex-col gap-8 font-semibold text-black/80 text-xl w-1/4">
          <div className="flex flex-col items-center gap-4">
            <Greeting className="lg:text-3xl" />
            <TimeComponent className="text-2xl" />
          </div>
          {/* minor second section starts */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex text-primary items-center gap-4">
              <span className="text-6xl">{weatherInfo.current?.temp_c}°</span>
              <span className="flex flex-col gap-2">
                <div className="flex gap-2 items-center">
                  <LuWind className="text-lg"/>
                  <p className="text-black font-bold text-sm">
                    {weatherInfo.current?.wind_mph} mph
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  <BsDroplet className="text-lg"/>
                  <p className="text-black font-bold text-sm">
                    {weatherInfo.current?.humidity}%
                  </p>
                </div>
              </span>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <p className="text-primary font-semibold text-sm">
                Feels like {weatherInfo.current?.feelslike_c}°
              </p>
              <p className="text-primary font-bold">
                {weatherInfo.current?.condition.text}
              </p>
            </div>
          </div>
          {/* minor second section ends */}
          {/* Hourly Forcast cards minor section begins */}
          <div>
            <h4 className="text-center font-medium">Hourly Forcast</h4>
            <div className="grid grid-cols-3 gap-2 mt-6">
              {data.slice(0, 6).map((item) => (
                <div className="flex flex-col gap-2 border-1 border-primary shadow-sm p-3 rounded-xl items-center">
                  <p className="text-black/90 font-medium text-sm">
                    {item.day}
                  </p>
                  <p className="text-primary font-medium">
                    {item.mainTemperature}°
                  </p>
                  <p className="text-primary font-medium text-base">
                    {item.mainWeather}
                  </p>
                </div>
              ))}
            </div>
          </div>
          {/* Hourly Forcast cards minor section ends */}
        </div>
      </div>
    </div>
  );
};

export default App;
