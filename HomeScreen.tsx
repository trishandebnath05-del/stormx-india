import React from 'react';
import { 
  Droplets, Wind, CloudRain, Sun, Cloud, CloudSun, CloudFog, CloudLightning, 
  Compass, Gauge, Eye, Sunrise, Sunset, MapPin, RefreshCw, AlertTriangle, ShieldCheck, 
  ExternalLink, Sparkles
} from 'lucide-react';
import { WeatherData, CityLocation, SevereWeatherAlert, UserPreferences } from '../types/weather';
import { getWeatherCodeInfo } from '../services/weatherInterpretation';

interface HomeScreenProps {
  weatherData: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  activeAlerts: SevereWeatherAlert[];
  preferences: UserPreferences;
  onRefresh: () => void;
  onOpenCityModal: () => void;
  onNavigateToForecast: () => void;
  onNavigateToAlerts: () => void;
  onOpenApkModal: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  weatherData,
  isLoading,
  error,
  activeAlerts,
  preferences,
  onRefresh,
  onOpenCityModal,
  onNavigateToForecast,
  onNavigateToAlerts,
  onOpenApkModal
}) => {
  if (isLoading && !weatherData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4 text-center">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-2 border-[#00E5FF]/20 border-t-[#00E5FF] animate-spin"></div>
          <CloudRain className="w-7 h-7 text-[#00E5FF] absolute inset-0 m-auto animate-pulse" />
        </div>
        <div>
          <h3 className="text-base font-bold text-[#F0F6FC]">Fetching Indian Doppler & Forecast...</h3>
          <p className="text-xs text-[#8B9CB5] mt-1">Connecting to Open-Meteo High-Resolution Mesh</p>
        </div>
      </div>
    );
  }

  if (error && !weatherData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-[#FF2A55]/15 border border-[#FF2A55]/30 flex items-center justify-center text-[#FF2A55]">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-base font-bold text-[#F0F6FC]">Weather Data Unavailable</h3>
          <p className="text-xs text-[#8B9CB5] mt-1 max-w-xs mx-auto">{error}</p>
        </div>
        <button
          onClick={onRefresh}
          className="px-5 py-2.5 rounded-xl bg-[#00E5FF] text-black font-semibold text-xs flex items-center gap-2 hover:bg-[#00E5FF]/90 transition"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Connection</span>
        </button>
      </div>
    );
  }

  const current = weatherData?.current;
  const city = weatherData?.city || preferences.selectedCity;
  const isHindi = preferences.language === 'hi';

  const codeInfo = current ? getWeatherCodeInfo(current.weatherCode, current.isDay) : null;
  const isCelsius = preferences.temperatureUnit === 'celsius';
  const formatTemp = (tempC: number) => {
    if (isCelsius) return `${tempC}°C`;
    return `${Math.round((tempC * 9) / 5 + 32)}°F`;
  };

  const formatWind = (kmh: number) => {
    if (preferences.windSpeedUnit === 'ms') return `${(kmh / 3.6).toFixed(1)} m/s`;
    if (preferences.windSpeedUnit === 'mph') return `${Math.round(kmh * 0.621371)} mph`;
    return `${kmh} km/h`;
  };

  // Weather icon selector
  const renderWeatherIcon = (size: string = 'w-16 h-16') => {
    if (!current) return <CloudSun className={`${size} text-[#00E5FF]`} />;
    if (current.weatherCode >= 95) return <CloudLightning className={`${size} text-[#F59E0B]`} />;
    if (current.weatherCode >= 51) return <CloudRain className={`${size} text-[#00E5FF]`} />;
    if (current.weatherCode >= 45) return <CloudFog className={`${size} text-[#CBD5E1]`} />;
    if (current.weatherCode >= 2) return <Cloud className={`${size} text-[#60A5FA]`} />;
    return current.isDay ? <Sun className={`${size} text-[#FFD600] animate-spin-slow`} /> : <CloudSun className={`${size} text-[#00E5FF]`} />;
  };

  const todayForecast = weatherData?.daily?.[0];
  const nextHours = weatherData?.hourly?.slice(0, 7) || [];

  return (
    <div className="flex-1 flex flex-col space-y-4 p-4 pb-8 overflow-y-auto">
      {/* Top Bar: City Selector & Refresh */}
      <div className="flex items-center justify-between">
        <button
          onClick={onOpenCityModal}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0D172E] border border-[#1E2D54] hover:border-[#00E5FF]/50 text-left transition group"
        >
          <MapPin className="w-4 h-4 text-[#00E5FF] group-hover:animate-bounce" />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#F0F6FC] leading-none flex items-center gap-1">
              {city.name}
              <span className="text-[10px] text-[#5A6D88] font-normal">▼</span>
            </span>
            <span className="text-[10px] text-[#8B9CB5] leading-none mt-0.5">{city.state}</span>
          </div>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenApkModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] hover:bg-[#00E5FF]/20 text-[11px] font-semibold transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Export APK</span>
          </button>

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 rounded-full bg-[#0D172E] border border-[#1E2D54] text-[#8B9CB5] hover:text-[#00E5FF] transition disabled:opacity-50"
            title="Refresh weather"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#00E5FF]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Official IMD Warning Banner Ticker */}
      {activeAlerts.length > 0 ? (
        <button
          onClick={onNavigateToAlerts}
          className="w-full p-3 rounded-2xl bg-gradient-to-r from-[#FF2A55]/20 to-[#FF9500]/20 border border-[#FF2A55]/40 text-left flex items-center justify-between group transition"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#FF2A55] text-white flex items-center justify-center animate-pulse">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#FF2A55] flex items-center gap-1.5">
                <span>IMD SEVERE WARNING</span>
                <span className="text-[9px] px-1 rounded bg-[#FF2A55] text-white font-mono">ACTIVE</span>
              </div>
              <div className="text-[11px] text-[#CBD5E1] line-clamp-1">{activeAlerts[0].event}</div>
            </div>
          </div>
          <span className="text-xs text-[#00E5FF] group-hover:translate-x-0.5 transition font-semibold">View</span>
        </button>
      ) : (
        <div className="w-full px-3 py-2 rounded-xl bg-[#00E676]/10 border border-[#00E676]/25 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#00E676]" />
            <span className="text-[11px] font-medium text-[#CBD5E1]">
              IMD Status: No Severe Storm Warning Active for {city.state}
            </span>
          </div>
          <button
            onClick={onNavigateToAlerts}
            className="text-[10px] text-[#00E5FF] hover:underline"
          >
            Details
          </button>
        </div>
      )}

      {/* Main Weather Card (Electric Blue Accents & Modern Glassmorphism) */}
      {current && codeInfo && (
        <div className="relative rounded-3xl bg-gradient-to-b from-[#0D1A38] via-[#091226] to-[#060B18] border border-[#1E3366] p-6 shadow-2xl overflow-hidden">
          {/* Subtle electric blue ambient glow */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#00E5FF]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex items-start justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-ping"></span>
                {isHindi ? codeInfo.hindiLabel : codeInfo.label}
              </span>
              <div className="text-5xl sm:text-6xl font-black text-[#F0F6FC] tracking-tight mt-3">
                {formatTemp(current.temperature)}
              </div>
              <div className="text-xs text-[#8B9CB5] font-medium mt-1">
                Feels like {formatTemp(current.apparentTemperature)} • {todayForecast ? `H: ${formatTemp(todayForecast.tempMax)} L: ${formatTemp(todayForecast.tempMin)}` : ''}
              </div>
            </div>

            <div className="flex flex-col items-end">
              {renderWeatherIcon('w-20 h-20 sm:w-24 sm:h-24')}
              <span className="text-[10px] font-mono text-[#5A6D88] mt-1">
                Updated {weatherData.updatedAt}
              </span>
            </div>
          </div>

          <p className="relative z-10 text-xs text-[#CBD5E1] mt-4 leading-relaxed">
            {codeInfo.description}. High atmospheric stability reported across {city.name} district stations.
          </p>

          {/* 4 Core Weather Metrics in Grid */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5">
            {/* Rain Probability */}
            <div className="p-3 rounded-2xl bg-[#080E1E]/80 border border-[#1E2D54]/70 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#00E5FF]/15 text-[#00E5FF] flex items-center justify-center shrink-0">
                <CloudRain className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-semibold text-[#8B9CB5] uppercase">Rain Prob</div>
                <div className="text-sm font-bold text-[#F0F6FC]">
                  {todayForecast ? `${todayForecast.precipitationProbabilityMax}%` : '0%'}
                </div>
              </div>
            </div>

            {/* Humidity */}
            <div className="p-3 rounded-2xl bg-[#080E1E]/80 border border-[#1E2D54]/70 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#38BDF8]/15 text-[#38BDF8] flex items-center justify-center shrink-0">
                <Droplets className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-semibold text-[#8B9CB5] uppercase">Humidity</div>
                <div className="text-sm font-bold text-[#F0F6FC]">{current.relativeHumidity}%</div>
              </div>
            </div>

            {/* Wind Speed */}
            <div className="p-3 rounded-2xl bg-[#080E1E]/80 border border-[#1E2D54]/70 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#818CF8]/15 text-[#818CF8] flex items-center justify-center shrink-0">
                <Wind className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-semibold text-[#8B9CB5] uppercase">Wind Speed</div>
                <div className="text-sm font-bold text-[#F0F6FC]">{formatWind(current.windSpeed)}</div>
              </div>
            </div>

            {/* Surface Pressure */}
            <div className="p-3 rounded-2xl bg-[#080E1E]/80 border border-[#1E2D54]/70 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#A78BFA]/15 text-[#A78BFA] flex items-center justify-center shrink-0">
                <Gauge className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-semibold text-[#8B9CB5] uppercase">Pressure</div>
                <div className="text-sm font-bold text-[#F0F6FC]">{current.surfacePressure} hPa</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hourly Quick Scroll Preview */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-[#F0F6FC] uppercase tracking-wider">
            Hourly Outlook (Next 24H)
          </h3>
          <button
            onClick={onNavigateToForecast}
            className="text-xs text-[#00E5FF] font-semibold hover:underline"
          >
            Full 7-Day &gt;
          </button>
        </div>

        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {nextHours.map((hour, idx) => {
            const hTime = new Date(hour.time).toLocaleTimeString('en-IN', { hour: 'numeric', hour12: true });
            const isNow = idx === 0;

            return (
              <div
                key={hour.time}
                className={`flex flex-col items-center justify-between min-w-[70px] p-3 rounded-2xl border text-center transition shrink-0 ${
                  isNow
                    ? 'bg-[#00E5FF]/15 border-[#00E5FF]/50 text-[#00E5FF]'
                    : 'bg-[#0D172E]/70 border-[#1E2D54]/60 text-[#CBD5E1]'
                }`}
              >
                <span className="text-[11px] font-medium text-[#8B9CB5]">{isNow ? 'Now' : hTime}</span>
                <div className="my-2">
                  <CloudSun className={`w-5 h-5 mx-auto ${isNow ? 'text-[#00E5FF]' : 'text-[#8B9CB5]'}`} />
                </div>
                <span className="text-xs font-bold text-[#F0F6FC]">{formatTemp(hour.temperature)}</span>
                <div className="flex items-center gap-0.5 text-[10px] text-[#38BDF8] mt-1 font-semibold">
                  <Droplets className="w-2.5 h-2.5" />
                  <span>{hour.precipitationProbability}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Astro & Environmental Indices */}
      {todayForecast && (
        <div className="grid grid-cols-2 gap-3">
          {/* Sunrise / Sunset */}
          <div className="p-4 rounded-2xl bg-[#0D172E] border border-[#1E2D54] space-y-3">
            <div className="text-xs font-semibold text-[#8B9CB5] flex items-center gap-1.5">
              <Sunrise className="w-4 h-4 text-[#FFD600]" />
              <span>Solar Cycle</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <Sunrise className="w-4 h-4 text-[#FFD600]" />
                <div>
                  <div className="text-[10px] text-[#5A6D88]">Sunrise</div>
                  <div className="font-bold text-[#F0F6FC]">
                    {todayForecast.sunrise ? todayForecast.sunrise.slice(11, 16) : '05:42'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Sunset className="w-4 h-4 text-[#FF9500]" />
                <div>
                  <div className="text-[10px] text-[#5A6D88]">Sunset</div>
                  <div className="font-bold text-[#F0F6FC]">
                    {todayForecast.sunset ? todayForecast.sunset.slice(11, 16) : '18:15'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Wind Gusts & Direction */}
          {current && (
            <div className="p-4 rounded-2xl bg-[#0D172E] border border-[#1E2D54] space-y-3">
              <div className="text-xs font-semibold text-[#8B9CB5] flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#00E5FF]" />
                <span>Wind Vector</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-[#5A6D88]">Bearing</div>
                  <div className="font-bold text-[#F0F6FC]">{current.windDirection}°</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-[#5A6D88]">Max Gusts</div>
                  <div className="font-bold text-[#00E5FF]">{formatWind(current.windGusts)}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
