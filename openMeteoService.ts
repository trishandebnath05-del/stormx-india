import { CityLocation, WeatherData, CurrentWeather, HourlyForecastItem, DailyForecastItem } from '../types/weather';
import { POPULAR_INDIAN_CITIES } from '../data/indianCities';

/**
 * Open-Meteo Weather Forecast Service
 * Free, high-resolution open data API with no API key requirement.
 */
export async function fetchWeatherData(city: CityLocation): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}` +
    `&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,cloud_cover,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m` +
    `&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,weather_code,wind_speed_10m,uv_index` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,precipitation_probability_max,wind_speed_10m_max` +
    `&timezone=auto&forecast_days=8`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Weather service returned HTTP ${response.status}`);
  }

  const data = await response.json();

  const current: CurrentWeather = {
    temperature: Math.round(data.current?.temperature_2m ?? 0),
    apparentTemperature: Math.round(data.current?.apparent_temperature ?? 0),
    relativeHumidity: Math.round(data.current?.relative_humidity_2m ?? 0),
    windSpeed: Math.round(data.current?.wind_speed_10m ?? 0),
    windDirection: Math.round(data.current?.wind_direction_10m ?? 0),
    windGusts: Math.round(data.current?.wind_gusts_10m ?? 0),
    precipitation: data.current?.precipitation ?? 0,
    rain: data.current?.rain ?? 0,
    weatherCode: data.current?.weather_code ?? 0,
    cloudCover: data.current?.cloud_cover ?? 0,
    surfacePressure: Math.round(data.current?.surface_pressure ?? 1013),
    isDay: (data.current?.is_day ?? 1) === 1,
    time: data.current?.time ?? new Date().toISOString()
  };

  // Extract next 24 hours of hourly data
  const hourly: HourlyForecastItem[] = [];
  if (data.hourly && Array.isArray(data.hourly.time)) {
    const nowIso = new Date().toISOString().slice(0, 13); // YYYY-MM-DDTHH
    let startIndex = data.hourly.time.findIndex((t: string) => t.startsWith(nowIso));
    if (startIndex === -1) startIndex = 0;

    for (let i = startIndex; i < Math.min(startIndex + 24, data.hourly.time.length); i++) {
      hourly.push({
        time: data.hourly.time[i],
        temperature: Math.round(data.hourly.temperature_2m?.[i] ?? 0),
        relativeHumidity: Math.round(data.hourly.relative_humidity_2m?.[i] ?? 0),
        precipitationProbability: Math.round(data.hourly.precipitation_probability?.[i] ?? 0),
        precipitation: Number((data.hourly.precipitation?.[i] ?? 0).toFixed(1)),
        weatherCode: data.hourly.weather_code?.[i] ?? 0,
        windSpeed: Math.round(data.hourly.wind_speed_10m?.[i] ?? 0),
        uvIndex: Math.round(data.hourly.uv_index?.[i] ?? 0)
      });
    }
  }

  // Extract 7-8 days of daily data
  const daily: DailyForecastItem[] = [];
  if (data.daily && Array.isArray(data.daily.time)) {
    for (let i = 0; i < data.daily.time.length; i++) {
      daily.push({
        date: data.daily.time[i],
        weatherCode: data.daily.weather_code?.[i] ?? 0,
        tempMax: Math.round(data.daily.temperature_2m_max?.[i] ?? 0),
        tempMin: Math.round(data.daily.temperature_2m_min?.[i] ?? 0),
        apparentMax: Math.round(data.daily.apparent_temperature_max?.[i] ?? 0),
        apparentMin: Math.round(data.daily.apparent_temperature_min?.[i] ?? 0),
        sunrise: data.daily.sunrise?.[i] ?? '',
        sunset: data.daily.sunset?.[i] ?? '',
        precipitationSum: Number((data.daily.precipitation_sum?.[i] ?? 0).toFixed(1)),
        precipitationProbabilityMax: Math.round(data.daily.precipitation_probability_max?.[i] ?? 0),
        windSpeedMax: Math.round(data.daily.wind_speed_10m_max?.[i] ?? 0)
      });
    }
  }

  return {
    city,
    current,
    hourly,
    daily,
    updatedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  };
}

/**
 * Search Indian cities using Open-Meteo Geocoding API with local curated fallback
 */
export async function searchCities(query: string): Promise<CityLocation[]> {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return POPULAR_INDIAN_CITIES.slice(0, 10);

  // Search local pre-indexed cities first
  const localMatches = POPULAR_INDIAN_CITIES.filter(
    c => c.name.toLowerCase().includes(cleanQuery) || c.state.toLowerCase().includes(cleanQuery)
  );

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) return localMatches;

    const data = await res.json();
    if (!data.results || !Array.isArray(data.results)) {
      return localMatches;
    }

    const apiResults: CityLocation[] = data.results
      .filter((item: { country?: string; country_code?: string }) => 
        item.country === 'India' || item.country_code === 'IN' || !item.country
      )
      .map((item: { id: number; name: string; admin1?: string; country?: string; latitude: number; longitude: number; elevation?: number }) => ({
        id: item.id || `${item.name}-${item.latitude}`,
        name: item.name,
        state: item.admin1 || 'India',
        country: item.country || 'India',
        latitude: item.latitude,
        longitude: item.longitude,
        elevation: item.elevation,
        isCustom: true
      }));

    // Merge without duplicates
    const combined = [...localMatches];
    for (const apiCity of apiResults) {
      if (!combined.some(c => Math.abs(c.latitude - apiCity.latitude) < 0.05 && Math.abs(c.longitude - apiCity.longitude) < 0.05)) {
        combined.push(apiCity);
      }
    }
    return combined;
  } catch (err) {
    console.warn('Geocoding search failed, using local Indian cities index:', err);
    return localMatches;
  }
}

/**
 * Find closest registered Indian city by geolocation coordinates
 */
export function findClosestCity(lat: number, lon: number): CityLocation {
  let closest = POPULAR_INDIAN_CITIES[0];
  let minDistance = Infinity;

  for (const city of POPULAR_INDIAN_CITIES) {
    const dLat = city.latitude - lat;
    const dLon = city.longitude - lon;
    const dist = Math.sqrt(dLat * dLat + dLon * dLon);
    if (dist < minDistance) {
      minDistance = dist;
      closest = city;
    }
  }

  // If very close (< 0.4 deg ~ 45km), use the known city name; else create a custom pin
  if (minDistance < 0.45) {
    return closest;
  }

  return {
    id: `custom-${lat.toFixed(3)}-${lon.toFixed(3)}`,
    name: `Current Location (${closest.state})`,
    state: closest.state,
    country: 'India',
    latitude: lat,
    longitude: lon,
    isCustom: true
  };
}
