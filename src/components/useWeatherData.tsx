import { useState, useEffect, useCallback } from "react";
import axios from "axios";

function useWeatherData() {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('Initializing...');
  const [locationMethod, setLocationMethod] = useState<'gps' | 'manual' | 'default'>('default');

  // API key from environment variables
  const apiKey = import.meta.env.VITE_API_KEY;

  // Function to fetch weather by coordinates
  const fetchWeatherByCoordinates = useCallback(async (lat: number, lng: number) => {
    try {
      setLoading(true);
      setDebugInfo('Making API request with coordinates...');
      
      const axiosConfig = {
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        validateStatus: function (status: number) {
          return status < 500;
        }
      };

      const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lng}&days=7&aqi=no&alerts=no`;
      setDebugInfo(`API URL: ${apiUrl.substring(0, 100)}...`);
      
      console.log('API URL:', apiUrl);
      
      const res = await axios.get(apiUrl, axiosConfig);
      
      setDebugInfo(`API Success! Status: ${res.status}`);
      console.log('API Response:', res.data);
      setWeatherInfo(res.data);
      setError(null);
      setLocationMethod('gps');
    } catch (error) {
      console.log("Error fetching weather data", error);
      
      let errorMsg = 'Unknown error occurred';
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          errorMsg = `API Error: ${error.response.status} - ${error.response.statusText}`;
          setDebugInfo(`${errorMsg}. Data: ${JSON.stringify(error.response.data)}`);
        } else if (error.request) {
          errorMsg = 'Network Error: No response from server';
          setDebugInfo(`${errorMsg}. Check internet connection.`);
        } else {
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
  }, [apiKey]);

  // Function to fetch weather by city name
  const fetchWeatherByCity = useCallback(async (city: string) => {
    try {
      setLoading(true);
      setError(null);
      setDebugInfo(`Fetching weather for city: ${city}`);
      
      const axiosConfig = {
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        validateStatus: function (status: number) {
          return status < 500;
        }
      };

      const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(city)}&days=7&aqi=no&alerts=no`;
      setDebugInfo(`API URL: ${apiUrl.substring(0, 100)}...`);
      
      console.log('API URL:', apiUrl);
      
      const res = await axios.get(apiUrl, axiosConfig);
      
      setDebugInfo(`API Success! Status: ${res.status} - Location: ${res.data.location?.name}`);
      console.log('API Response:', res.data);
      setWeatherInfo(res.data);
      setError(null);
      setLocationMethod('manual');
    } catch (error) {
      console.log("Error fetching weather data by city", error);
      
      let errorMsg = 'Unknown error occurred';
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          if (error.response.status === 400) {
            errorMsg = `City not found: "${city}". Please check spelling and try again.`;
          } else {
            errorMsg = `API Error: ${error.response.status} - ${error.response.statusText}`;
          }
          setDebugInfo(`${errorMsg}. Data: ${JSON.stringify(error.response.data)}`);
        } else if (error.request) {
          errorMsg = 'Network Error: No response from server';
          setDebugInfo(`${errorMsg}. Check internet connection.`);
        } else {
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
  }, [apiKey]);

  // Function to fetch default weather (fallback to a default city)
  const fetchDefaultWeather = useCallback(async () => {
    try {
      setDebugInfo('Fetching default weather (London)...');
      await fetchWeatherByCity('London');
      setLocationMethod('default');
    } catch (error: unknown) {
      setDebugInfo(`Failed to fetch default weather: ${error}`);
      setError('Could not load weather data');
    }
  }, [fetchWeatherByCity]);

  useEffect(() => {
    setDebugInfo(`Starting app... API Key: ${apiKey ? 'Present' : 'MISSING!'}`);
    
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      const msg = 'Geolocation not supported, using default location';
      setDebugInfo(msg);
      fetchDefaultWeather();
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
        
        fetchWeatherByCoordinates(latitude, longitude);
      },
      (error) => {
        let geoErrorMsg = 'Location access failed, using default location';
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            geoErrorMsg = 'Location access denied, using default location';
            break;
          case error.POSITION_UNAVAILABLE:
            geoErrorMsg = 'Location unavailable, using default location';
            break;
          case error.TIMEOUT:
            geoErrorMsg = 'Location request timed out, using default location';
            break;
          default:
            geoErrorMsg = `Location error: ${error.message}, using default location`;
            break;
        }
        
        setDebugInfo(geoErrorMsg);
        console.log("Geolocation error:", error);
        
        // Instead of setting error, fall back to default location
        fetchDefaultWeather();
      },
      {
        enableHighAccuracy: false,
        maximumAge: 300000,
        timeout: 5000,
      }
    );
  }, [fetchWeatherByCoordinates, fetchDefaultWeather, apiKey]);

  return { 
    weatherInfo, 
    latitude, 
    longitude, 
    loading, 
    error, 
    debugInfo, 
    locationMethod,
    fetchWeatherByCity 
  };
}

export default useWeatherData;