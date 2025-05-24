import { useState, useEffect } from "react";
import axios from "axios";

function useWeatherData() {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown | null>(null);
  const apiKey = import.meta.env.VITE_API_KEY;

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
              
              // Mobile-friendly axios configuration
              const axiosConfig = {
                timeout: 15000, // Increase timeout for mobile
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
                  'User-Agent': 'WeatherApp/1.0' // Custom user agent
                },
                validateStatus: function (status: number) {
                  return status < 500; // Accept any status less than 500
                }
              };

              // Fixed URL - removed duplicate q parameter
              const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${latitude},${longitude}&days=7&aqi=no&alerts=no`;
              
              console.log('API URL:', apiUrl); // Debug log
              
              const res = await axios.get(apiUrl, axiosConfig);
              
              console.log('API Response:', res.data);
              setWeatherInfo(res.data);
              setError(null);
            } catch (error) {
              console.log("Error fetching weather data", error);
              // More detailed error logging
              if (axios.isAxiosError(error)) {
                console.log("Axios error details:", {
                  message: error.message,
                  status: error.response?.status,
                  statusText: error.response?.statusText,
                  data: error.response?.data
                });
              }
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
      },
      {
        enableHighAccuracy: false, // Changed to false for better mobile compatibility
        maximumAge: 300000, // Cache location for 5 minutes
        timeout: 30000, // Increased timeout for mobile devices
      }
    );
  }, []);

  return { weatherInfo, latitude, longitude, loading, error };
}

export default useWeatherData;