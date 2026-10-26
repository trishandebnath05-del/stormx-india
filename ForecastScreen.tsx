import React, { useState } from 'react';
import { 
  Calendar, Clock, CloudRain, Droplets, Wind, Sun, ChevronDown, 
  ChevronUp, Sunrise, Sunset, ShieldCheck, Thermometer 
} from 'lucide-react';
import { WeatherData, UserPreferences, DailyForecastItem } from '../types/weather';
import { getWeatherCodeInfo } from '../services/weatherInterpretation';

interface ForecastScreenProps {
  weatherData: WeatherData | null;
  preferences: UserPreferences;
  onOpenCityModal: () => void;
}

export const ForecastScreen: React.FC<ForecastScreenProps> = ({
  weatherData,
  preferences,
  onOpenCityModal
}) => {
  const [expandedDay, setExpandedDay] = useState<number | null>(0);
  const [forecastTab, setForecastTab] = useState<'hourly' | 'daily'>('hourly');

  if (!weatherData) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 text-center text-[#8B9CB5]">
        Loading forecast datasets...
      </div>
    );
  }

  const isHindi = preferences.language === 'hi';
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

  // Find min and max for relative temperature bar calculations across 7 days
  const allMax = Math.max(...weatherData.daily.map(d => d.tempMax));
  const allMin = Math.min(...weatherData.daily.map(d => d.tempMin));
  const tempRange = Math.max(allMax - allMin, 1);

  return (
    <div className="flex-1 flex flex-col space-y-4 p-4 pb-8 overflow-y-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#F0F6FC]">Weather Outlook</h2>
          <p className="text-xs text-[#8B9CB5] flex items-center gap-1">
            <span>{weatherData.city.name}, {weatherData.city.state}</span>
            <button onClick={onOpenCityModal} className="text-[#00E5FF] hover:underline font-semibold ml-1">
              Change
            </button>
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-[#0D172E] border border-[#1E2D54] rounded-xl">
          <button
            onClick={() => setForecastTab('hourly')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              forecastTab === 'hourly'
                ? 'bg-[#00E5FF] text-black shadow-[0_0_10px_rgba(0,229,255,0.35)]'
                : 'text-[#8B9CB5] hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>24H Hourly</span>
          </button>
          <button
            onClick={() => setForecastTab('daily')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              forecastTab === 'daily'
                ? 'bg-[#00E5FF] text-black shadow-[0_0_10px_rgba(0,229,255,0.35)]'
                : 'text-[#8B9CB5] hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>7-Day Daily</span>
          </button>
        </div>
      </div>

      {forecastTab === 'hourly' ? (
        /* Hourly Detailed List */
        <div className="space-y-2.5">
          <div className="text-[11px] font-bold text-[#5A6D88] uppercase tracking-wider px-1">
            Hour-by-Hour Timeline with Rain Probability
          </div>

          <div className="space-y-2">
            {weatherData.hourly.map((hour, idx) => {
              const dateObj = new Date(hour.time);
              const timeLabel = idx === 0 ? 'Now' : dateObj.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });
              const info = getWeatherCodeInfo(hour.weatherCode);

              return (
                <div
                  key={hour.time}
                  className="p-3.5 rounded-2xl bg-[#0D172E] border border-[#1E2D54]/70 hover:border-[#00E5FF]/40 transition flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-center w-14">
                      <div className="text-xs font-bold text-[#F0F6FC]">{timeLabel}</div>
                      <div className="text-[10px] text-[#8B9CB5] font-mono">
                        {dateObj.toLocaleDateString('en-IN', { weekday: 'short' })}
                      </div>
                    </div>

                    <div className="w-px h-8 bg-[#1E2D54]"></div>

                    <div>
                      <div className="text-xs font-semibold text-[#CBD5E1]">
                        {isHindi ? info.hindiLabel : info.label}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-[#8B9CB5] mt-0.5">
                        <span className="flex items-center gap-0.5 text-[#00E5FF]">
                          <CloudRain className="w-3 h-3" />
                          <span>{hour.precipitationProbability}%</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5">
                          <Wind className="w-3 h-3" />
                          <span>{formatWind(hour.windSpeed)}</span>
                        </span>
                        {hour.uvIndex > 0 && (
                          <>
                            <span>•</span>
                            <span>UV {hour.uvIndex}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-bold text-[#F0F6FC]">{formatTemp(hour.temperature)}</div>
                    {hour.precipitation > 0 && (
                      <div className="text-[10px] text-[#38BDF8] font-mono">{hour.precipitation} mm</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* 7-Day Extended Forecast */
        <div className="space-y-3">
          <div className="text-[11px] font-bold text-[#5A6D88] uppercase tracking-wider px-1">
            7-Day Synoptic Outlook & Thermal Range
          </div>

          <div className="space-y-2">
            {weatherData.daily.map((day: DailyForecastItem, idx: number) => {
              const dateObj = new Date(day.date);
              const dayName = idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : dateObj.toLocaleDateString('en-IN', { weekday: 'long' });
              const formattedDate = dateObj.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
              const info = getWeatherCodeInfo(day.weatherCode);
              const isExpanded = expandedDay === idx;

              // Compute percentage offsets for visual temperature bar
              const leftPercent = Math.max(0, Math.min(100, ((day.tempMin - allMin) / tempRange) * 100));
              const rightPercent = Math.max(0, Math.min(100, ((allMax - day.tempMax) / tempRange) * 100));

              return (
                <div
                  key={day.date}
                  className="rounded-2xl bg-[#0D172E] border border-[#1E2D54]/70 overflow-hidden transition"
                >
                  <button
                    onClick={() => setExpandedDay(isExpanded ? null : idx)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-[#132247]/40 transition"
                  >
                    <div className="w-28">
                      <div className="text-sm font-bold text-[#F0F6FC]">{dayName}</div>
                      <div className="text-[11px] text-[#8B9CB5]">{formattedDate}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="text-xs font-semibold text-[#CBD5E1]">
                          {isHindi ? info.hindiLabel : info.label}
                        </div>
                        {day.precipitationProbabilityMax > 0 && (
                          <div className="text-[10px] text-[#00E5FF] font-semibold flex items-center gap-1 justify-end">
                            <Droplets className="w-2.5 h-2.5" />
                            <span>{day.precipitationProbabilityMax}% rain</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Temperature Range Bar */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#8B9CB5] font-mono w-7 text-right">
                        {formatTemp(day.tempMin)}
                      </span>
                      <div className="w-16 sm:w-24 h-2 bg-[#050914] rounded-full overflow-hidden flex relative">
                        <div
                          className="h-full bg-gradient-to-r from-[#00E5FF] to-[#FF9500] rounded-full"
                          style={{
                            marginLeft: `${leftPercent}%`,
                            width: `${Math.max(15, 100 - leftPercent - rightPercent)}%`
                          }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-[#F0F6FC] font-mono w-7">
                        {formatTemp(day.tempMax)}
                      </span>
                    </div>

                    <div className="text-[#8B9CB5] ml-1">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {/* Expanded Day Details */}
                  {isExpanded && (
                    <div className="p-4 pt-1 bg-[#080E1E]/80 border-t border-[#1E2D54]/40 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="p-2.5 rounded-xl bg-[#0D172E] border border-[#1E2D54]">
                        <span className="text-[10px] text-[#8B9CB5] block">Apparent High / Low</span>
                        <span className="font-semibold text-[#F0F6FC]">
                          {formatTemp(day.apparentMax)} / {formatTemp(day.apparentMin)}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#0D172E] border border-[#1E2D54]">
                        <span className="text-[10px] text-[#8B9CB5] block">Rain Total</span>
                        <span className="font-semibold text-[#00E5FF]">{day.precipitationSum} mm</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#0D172E] border border-[#1E2D54]">
                        <span className="text-[10px] text-[#8B9CB5] block">Peak Wind Gusts</span>
                        <span className="font-semibold text-[#F0F6FC]">{formatWind(day.windSpeedMax)}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#0D172E] border border-[#1E2D54]">
                        <span className="text-[10px] text-[#8B9CB5] block">Solar Hours</span>
                        <span className="font-semibold text-[#FFD600]">
                          {day.sunrise ? day.sunrise.slice(11, 16) : '05:40'} - {day.sunset ? day.sunset.slice(11, 16) : '18:15'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
