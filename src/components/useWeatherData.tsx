// useEffect to fetch weather data based on user's geolocation
import { useState, useEffect } from "react";
import axios from "axios";

function useWeatherData() {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);
        console.log(longitude, latitude);

        const fetchData = async () => {
          if (latitude && longitude) {
            try {
              setLoading(true);
              const res = await axios.get(
                `http://api.weatherapi.com/v1/forecast.json?key=${
                  import.meta.env.VITE_API_KEY
                }&q=${latitude},${longitude}&q=&days=7&aqi=no&alerts=no`
              );
              console.log(res.data);
              setWeatherInfo(res.data);
              setError(null);
            } catch (error) {
              console.log("Error fetching weather data", error);
              setError(error);
            } finally {
              setLoading(false);
            }
          }
        };
        fetchData();
      },
      (error) => {
        console.log("Geolocation error:", error);
        setError(error);
        setLoading(false);
      }
    );
  }, []);

  return { weatherInfo, latitude, longitude, loading, error };
}

export default useWeatherData;
