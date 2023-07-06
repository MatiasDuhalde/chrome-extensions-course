const OPEN_WEATHER_API_KEY = 'e0b33c647da0630d95332b3fbf1f79ca';

export interface OpenWeatherData {
  name: string;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: {
    description: string;
    icon: string;
    id: number;
    main: string;
  }[];
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
}

export enum OpenWeatherTemperatureUnit {
  Metric = 'metric',
  Imperial = 'imperial',
  Standard = 'standard',
}

export async function fetchOpenWeatherData(
  city: string,
  units: OpenWeatherTemperatureUnit,
): Promise<OpenWeatherData> {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPEN_WEATHER_API_KEY}&units=${units}`,
  );

  if (!res.ok) {
    throw new Error('There was a problem fetching weather data');
  }

  const data = (await res.json()) as OpenWeatherData;

  return data;
}

export function getWeatherIconSrc(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}
