export interface WeatherInfo {
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
        hour: {
          time: string;
          temp_c: number;
          condition: {
            text:string;
          }
        }[];
      }[];
    };
  }