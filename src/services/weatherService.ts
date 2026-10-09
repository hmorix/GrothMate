import { WeatherData } from '../types';

export class WeatherService {
  /**
   * Geocode a city name to latitude and longitude using free Open-Meteo Geocoding
   */
  static async geocodeCity(cityName: string): Promise<{ lat: number; lon: number; name: string; country: string } | null> {
    try {
      const trimmed = cityName.trim();
      if (!trimmed) return null;

      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=1&language=en&format=json`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Geocoding HTTP error ${res.status}`);
      const data = await res.json();

      if (data.results && data.results.length > 0) {
        const item = data.results[0];
        return {
          lat: item.latitude,
          lon: item.longitude,
          name: item.name,
          country: item.country || ''
        };
      }
      return null;
    } catch (err) {
      console.warn("Geocoding lookup failed, falling back to default coordinates:", err);
      return null;
    }
  }

  /**
   * Fetch current weather & 7-day forecast from Open-Meteo (100% Free, No API key needed)
   */
  static async fetchWeather(lat: number, lon: number, cityName = "Your City", country = ""): Promise<WeatherData> {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,uv_index_max&timezone=auto`;
      
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Weather API error ${res.status}`);
      const data = await res.json();

      const current = data.current;
      const daily = data.daily;

      const weatherDesc = this.mapWeatherCode(current.weather_code);
      
      const forecastDays = (daily.time || []).slice(0, 7).map((dateStr: string, idx: number) => ({
        date: dateStr,
        tempMax: Math.round(daily.temperature_2m_max?.[idx] ?? 25),
        tempMin: Math.round(daily.temperature_2m_min?.[idx] ?? 18),
        rainProbability: daily.precipitation_probability_max?.[idx] ?? 0,
        precipitationMm: daily.precipitation_sum?.[idx] ?? 0,
        weatherCode: daily.weather_code?.[idx] ?? 0,
        description: this.mapWeatherCode(daily.weather_code?.[idx] ?? 0)
      }));

      // Calculate upcoming rain in next 24-48h
      const upcomingRainMm = (daily.precipitation_sum?.[0] ?? 0) + (daily.precipitation_sum?.[1] ?? 0);

      return {
        city: cityName,
        country: country,
        temperatureC: Math.round(current.temperature_2m),
        humidity: Math.round(current.relative_humidity_2m),
        weatherCode: current.weather_code,
        weatherDescription: weatherDesc,
        precipitationMm: current.precipitation ?? 0,
        forecastRainNext24hMm: upcomingRainMm,
        uvIndex: daily.uv_index_max?.[0] ?? 5,
        windSpeedKmh: Math.round(current.wind_speed_10m ?? 8),
        forecastDays
      };
    } catch (err) {
      console.warn("Failed to fetch live weather, using reliable seasonal fallback:", err);
      return this.getFallbackWeather(cityName, country);
    }
  }

  static mapWeatherCode(code: number): string {
    if (code === 0) return "Clear sunny skies";
    if (code === 1 || code === 2) return "Partly cloudy with soft sun";
    if (code === 3) return "Overcast";
    if (code >= 45 && code <= 48) return "Misty / Foggy morning";
    if (code >= 51 && code <= 55) return "Light drizzle";
    if (code >= 61 && code <= 65) return "Moderate rainfall";
    if (code >= 71 && code <= 77) return "Chilly snowfall";
    if (code >= 80 && code <= 82) return "Passing rain showers";
    if (code >= 95) return "Thunderstorms";
    return "Gentle outdoor weather";
  }

  static getFallbackWeather(city = "New Delhi", country = "India"): WeatherData {
    return {
      city,
      country,
      temperatureC: 26,
      humidity: 58,
      weatherCode: 1,
      weatherDescription: "Warm pleasant sunshine",
      precipitationMm: 0,
      forecastRainNext24hMm: 0.2,
      uvIndex: 6,
      windSpeedKmh: 9,
      forecastDays: [
        { date: "Today", tempMax: 28, tempMin: 19, rainProbability: 10, precipitationMm: 0, weatherCode: 1, description: "Sunny & dry" },
        { date: "Tomorrow", tempMax: 29, tempMin: 20, rainProbability: 15, precipitationMm: 0, weatherCode: 1, description: "Clear daylight" },
        { date: "Day 3", tempMax: 27, tempMin: 18, rainProbability: 35, precipitationMm: 1.5, weatherCode: 61, description: "Light shower" },
        { date: "Day 4", tempMax: 26, tempMin: 18, rainProbability: 20, precipitationMm: 0, weatherCode: 2, description: "Partly cloudy" },
        { date: "Day 5", tempMax: 27, tempMin: 19, rainProbability: 10, precipitationMm: 0, weatherCode: 1, description: "Pleasant sun" },
      ]
    };
  }
}
