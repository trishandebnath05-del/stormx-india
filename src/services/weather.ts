/**
 * StormX India - Type Definitions
 */

export interface CityLocation {
  id: number | string;
  name: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  isCustom?: boolean;
}

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  relativeHumidity: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  precipitation: number;
  rain: number;
  weatherCode: number;
  cloudCover: number;
  surfacePressure: number;
  isDay: boolean;
  time: string;
}

export interface HourlyForecastItem {
  time: string;
  temperature: number;
  relativeHumidity: number;
  precipitationProbability: number;
  precipitation: number;
  weatherCode: number;
  windSpeed: number;
  uvIndex: number;
}

export interface DailyForecastItem {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  apparentMax: number;
  apparentMin: number;
  sunrise: string;
  sunset: string;
  precipitationSum: number;
  precipitationProbabilityMax: number;
  windSpeedMax: number;
}

export interface WeatherData {
  city: CityLocation;
  current: CurrentWeather;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  updatedAt: string;
}

export type AlertSeverity = 'RED' | 'ORANGE' | 'YELLOW' | 'GREEN';

export interface SevereWeatherAlert {
  id: string;
  severity: AlertSeverity;
  event: string;
  affectedArea: string;
  validFrom: string;
  validUntil: string;
  source: string;
  sourceUrl: string;
  description: string;
  instruction: string;
  isOfficialIMD: boolean;
  zone: string;
}

export interface IMDFeedStatus {
  isConfigured: boolean;
  isReachable: boolean;
  lastChecked: string;
  sourceUrl: string;
  sourceName: string;
  errorMessage?: string;
  feedType: 'CAP-RSS' | 'MAUSAM-BULLETIN' | 'OFFICIAL-PORTAL';
}

export type NewsCategory = 'national' | 'technology' | 'sports' | 'entertainment';
export type NewsLanguage = 'en' | 'hi';

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  category: NewsCategory;
  language: NewsLanguage;
  publishedAt: string;
  imageUrl?: string;
}

export interface UserPreferences {
  selectedCity: CityLocation;
  temperatureUnit: 'celsius' | 'fahrenheit';
  windSpeedUnit: 'kmh' | 'ms' | 'mph';
  language: 'en' | 'hi' | 'bn' | 'ta' | 'te';
  notificationsEnabled: boolean;
  severeStormChannel: boolean;
  dailyForecastChannel: boolean;
  rainNowcastChannel: boolean;
  customNewsApiKey?: string;
}
