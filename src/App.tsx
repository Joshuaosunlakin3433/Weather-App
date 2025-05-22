import { ImDroplet } from "react-icons/im";
import { data } from "./API/Api";
import { LuWind } from "react-icons/lu";
import { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  interface WeatherInfo {
    location?: {
      name: string;
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
              }&q=${latitude},${longitude}&aqi=no&alerts=no
`);
            console.log(res.data);
            setWeatherInfo(res.data)
          } catch (error) {
            console.log("Error fetching weather data", error);
          }
        }
      };
      fetchData()
    });
  }, []);

  return (
    <div className="font-primary">
      {/* this div wraps the entire page so as to flex the two sections */}
      <div className="flex justify-between">
        {/* major section starts */}
        <div className="bg-white shadow-2xs w-3/4 p-5">
          <nav className="flex justify-between">
            <p className="text-black/80 font-semibold">{weatherInfo.location?.name}</p>
            <p className="font-semibold">21.04.2021</p>
          </nav>
          {/* big texts start */}

          <div className="flex flex-col items-center gap-9">
            <div>
              <div className="flex text-primary items-center gap-3">
                <span className="text-[14rem]">20°</span>
                <span className="-ml-7 mt-13">
                  <div className="flex gap-3 items-center">
                    <LuWind />
                    <p className="text-primary font-medium">6.1 mph</p>
                  </div>
                  <div className="flex gap-3 items-center">
                    <ImDroplet className="text-white" />
                    <p className="text-primary font-medium">90%</p>
                  </div>
                </span>
              </div>
              <p className="text-primary text-2xl font-semibold">Cloudy</p>
            </div>

            <div className="grid grid-cols-7 gap-2 mt-15">
              {data.map((item) => (
                <div className="flex flex-col gap-2 border-1 border-primary shadow-sm p-3 rounded-xl">
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
        </div>
        {/* major section ends */}
        {/* //minor section starts here */}
        <div className="bg-white/30 p-2 flex flex-col gap-8 font-semibold text-black/80 text-xl w-1/4">
          <div className="flex flex-col items-center gap-4">
            <h2>Good Morning</h2>
            <h2>12.27 PM</h2>
          </div>
          {/* minor second section starts */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex text-primary items-center gap-3">
              <span className="text-4xl">20°</span>
              <span>
                <div className="flex gap-2 items-center">
                  <LuWind />
                  <p className="text-black font-medium">6.1 mph</p>
                </div>
                <div className="flex gap-2 items-center">
                  <ImDroplet className="text-white" />
                  <p className="text-black font-medium">90%</p>
                </div>
              </span>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <p className="text-primary font-medium text-sm">Feels like 19°</p>
              <p className="text-primary font-semibold">Cloudy</p>
            </div>
          </div>
          {/* minor second section ends */}
          {/* Hourly Forcast cards minor section begins */}
          <div>
            <h4 className="text-center font-semibold mb-4">Hourly Forcast</h4>
            <div className="grid grid-cols-3 gap-2 mt-10">
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
