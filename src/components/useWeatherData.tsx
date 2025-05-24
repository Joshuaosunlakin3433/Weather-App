import { useState, useEffect } from "react";
import axios from "axios";

function useWeatherData() {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('Initializing...'); // Added debug state
  const apiKey = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    setDebugInfo(`Starting app... API Key: ${apiKey ? 'Present' : 'MISSING!'}`);
    
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      const msg = 'Geolocation is not supported by this browser';
      setDebugInfo(msg);
      setError(msg);
      setLoading(false);
      return;
    }

    setDebugInfo('Requesting location permission...');
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);
        setDebugInfo(`Location obtained: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        console.log(longitude, latitude);

        const fetchData = async () => {
          if (latitude && longitude) {
            try {
              setLoading(true);
              setDebugInfo('Making API request...');
              
              // Removed User-Agent header that was causing issues
              const axiosConfig = {
                timeout: 15000,
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
                },
                validateStatus: function (status: number) {
                  return status < 500;
                }
              };

              const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${latitude},${longitude}&days=7&aqi=no&alerts=no`;
              setDebugInfo(`API URL: ${apiUrl.substring(0, 100)}...`);
              
              console.log('API URL:', apiUrl);
              
              const res = await axios.get(apiUrl, axiosConfig);
              
              setDebugInfo(`API Success! Status: ${res.status}`);
              console.log('API Response:', res.data);
              setWeatherInfo(res.data);
              setError(null);
            } catch (error) {
              console.log("Error fetching weather data", error);
              
              let errorMsg = 'Unknown error occurred';
              
              if (axios.isAxiosError(error)) {
                if (error.response) {
                  // Server responded with error status
                  errorMsg = `API Error: ${error.response.status} - ${error.response.statusText}`;
                  setDebugInfo(`${errorMsg}. Data: ${JSON.stringify(error.response.data)}`);
                } else if (error.request) {
                  // Request was made but no response received
                  errorMsg = 'Network Error: No response from server';
                  setDebugInfo(`${errorMsg}. Check internet connection.`);
                } else {
                  // Error in setting up the request
                  errorMsg = `Request Error: ${error.message}`;
                  setDebugInfo(errorMsg);
                }
                
                console.log("Axios error details:", {
                  message: error.message,
                  status: error.response?.status,
                  statusText: error.response?.statusText,
                  data: error.response?.data
                });
              } else {
                errorMsg = `Unexpected error: ${error}`;
                setDebugInfo(errorMsg);
              }
              
              setError(errorMsg);
            } finally {
              setLoading(false);
            }
          }
        };
        fetchData();
      },
      (error) => {
        let geoErrorMsg = 'Location access failed';
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            geoErrorMsg = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            geoErrorMsg = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            geoErrorMsg = 'Location request timed out';
            break;
          default:
            geoErrorMsg = `Location error: ${error.message}`;
            break;
        }
        
        setDebugInfo(geoErrorMsg);
        console.log("Geolocation error:", error);
        setError(geoErrorMsg);
        setLoading(false);
      },
      {
        enableHighAccuracy: false,
        maximumAge: 300000,
        timeout: 30000,
      }
    );
  }, []);

  return { weatherInfo, latitude, longitude, loading, error, debugInfo };
}

export default useWeatherData;