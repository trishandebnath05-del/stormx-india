import React, { useState } from 'react';
import { 
  Settings, MapPin, Thermometer, Wind, Globe, Bell, 
  Shield, Check, ExternalLink, Sparkles, FolderArchive, 
  HelpCircle, Smartphone, Volume2, Zap, ChevronRight 
} from 'lucide-react';
import { UserPreferences, CityLocation } from '../types/weather';
import { ANDROID_NOTIFICATION_CHANNELS, requestNotificationPermission, dispatchNotification } from '../services/notificationManager';

interface SettingsScreenProps {
  preferences: UserPreferences;
  onUpdatePreferences: (updates: Partial<UserPreferences>) => void;
  onOpenCityModal: () => void;
  onOpenApkModal: () => void;
  onOpenClosedAppModal: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  preferences,
  onUpdatePreferences,
  onOpenCityModal,
  onOpenApkModal,
  onOpenClosedAppModal
}) => {
  const [permissionStatus, setPermissionStatus] = useState<string>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'unsupported'
  );
  const [testSent, setTestSent] = useState(false);

  const handleRequestPermission = async () => {
    const res = await requestNotificationPermission();
    setPermissionStatus(res);
    if (res === 'granted') {
      onUpdatePreferences({ notificationsEnabled: true });
      dispatchNotification('StormX India Notifications Active', 'Severe storm channels are now configured.');
    }
  };

  const handleTestNotification = () => {
    setTestSent(true);
    dispatchNotification(
      'StormX India: IMD Radar Test',
      'Test notification triggered successfully on Android channel: severe_weather_alerts'
    );
    setTimeout(() => setTestSent(false), 2500);
  };

  return (
    <div className="flex-1 flex flex-col space-y-5 p-4 pb-12 overflow-y-auto">
      {/* Top Header */}
      <div>
        <h2 className="text-lg font-bold text-[#F0F6FC]">Preferences & System</h2>
        <p className="text-xs text-[#8B9CB5]">Configure Indian telemetry, units, and notification channels</p>
      </div>

      {/* Manual City Selection Card */}
      <div className="p-4 rounded-2xl bg-[#0D172E] border border-[#1E2D54] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-[#F0F6FC]">
            <MapPin className="w-4 h-4 text-[#00E5FF]" />
            <span>Active Weather Station</span>
          </div>
          <button
            onClick={onOpenCityModal}
            className="px-3 py-1 rounded-lg bg-[#00E5FF]/10 text-[#00E5FF] hover:bg-[#00E5FF]/20 text-xs font-semibold border border-[#00E5FF]/30 transition"
          >
            Change City
          </button>
        </div>

        <div className="p-3 rounded-xl bg-[#080E1E] border border-[#1E2D54]/70 flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-[#F0F6FC]">{preferences.selectedCity.name}</div>
            <div className="text-xs text-[#8B9CB5]">
              {preferences.selectedCity.state}, {preferences.selectedCity.country}
            </div>
          </div>
          <div className="text-[11px] font-mono text-[#5A6D88] text-right">
            <div>Lat: {preferences.selectedCity.latitude.toFixed(2)}°</div>
            <div>Lon: {preferences.selectedCity.longitude.toFixed(2)}°</div>
          </div>
        </div>
      </div>

      {/* Units Selection Card (Celsius / Fahrenheit & Wind speed) */}
      <div className="p-4 rounded-2xl bg-[#0D172E] border border-[#1E2D54] space-y-4">
        <div className="text-xs font-bold text-[#F0F6FC] flex items-center gap-2">
          <Thermometer className="w-4 h-4 text-[#00E5FF]" />
          <span>Measurement Units</span>
        </div>

        {/* Temperature Unit */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-[#CBD5E1]">Temperature Scale</div>
            <div className="text-[11px] text-[#8B9CB5]">Standard metric Celsius vs Fahrenheit</div>
          </div>
          <div className="flex items-center p-1 bg-[#050914] border border-[#1E2D54] rounded-xl">
            <button
              onClick={() => onUpdatePreferences({ temperatureUnit: 'celsius' })}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                preferences.temperatureUnit === 'celsius'
                  ? 'bg-[#00E5FF] text-black shadow-[0_0_8px_rgba(0,229,255,0.4)]'
                  : 'text-[#8B9CB5] hover:text-white'
              }`}
            >
              °C (Celsius)
            </button>
            <button
              onClick={() => onUpdatePreferences({ temperatureUnit: 'fahrenheit' })}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                preferences.temperatureUnit === 'fahrenheit'
                  ? 'bg-[#00E5FF] text-black shadow-[0_0_8px_rgba(0,229,255,0.4)]'
                  : 'text-[#8B9CB5] hover:text-white'
              }`}
            >
              °F (Fahrenheit)
            </button>
          </div>
        </div>

        <div className="w-full h-px bg-[#1E2D54]/50"></div>

        {/* Wind Speed Unit */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-[#CBD5E1]">Wind Speed Unit</div>
            <div className="text-[11px] text-[#8B9CB5]">Default km/h for Indian meteorological stations</div>
          </div>
          <div className="flex items-center p-1 bg-[#050914] border border-[#1E2D54] rounded-xl">
            {(['kmh', 'ms', 'mph'] as const).map((unit) => (
              <button
                key={unit}
                onClick={() => onUpdatePreferences({ windSpeedUnit: unit })}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  preferences.windSpeedUnit === unit
                    ? 'bg-[#00E5FF] text-black shadow-[0_0_8px_rgba(0,229,255,0.4)]'
                    : 'text-[#8B9CB5] hover:text-white'
                }`}
              >
                {unit === 'kmh' ? 'km/h' : unit === 'ms' ? 'm/s' : 'mph'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Language Preference */}
      <div className="p-4 rounded-2xl bg-[#0D172E] border border-[#1E2D54] space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-[#F0F6FC] flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#00E5FF]" />
            <span>Interface Language</span>
          </div>
          <span className="text-[10px] text-[#8B9CB5] font-mono">Bilingual IMD</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { id: 'en' as const, label: 'English', sub: 'Default' },
            { id: 'hi' as const, label: 'हिन्दी', sub: 'Hindi' },
            { id: 'bn' as const, label: 'বাংলা', sub: 'Bengali' },
            { id: 'ta' as const, label: 'தமிழ்', sub: 'Tamil' },
            { id: 'te' as const, label: 'తెలుగు', sub: 'Telugu' },
          ].map((lang) => {
            const isSelected = preferences.language === lang.id;
            return (
              <button
                key={lang.id}
                onClick={() => onUpdatePreferences({ language: lang.id })}
                className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                  isSelected
                    ? 'bg-[#00E5FF]/15 border-[#00E5FF]/50 text-[#00E5FF]'
                    : 'bg-[#080E1E] border-[#1E2D54]/70 text-[#CBD5E1] hover:bg-[#132247]/40'
                }`}
              >
                <div>
                  <div className="font-semibold text-xs text-[#F0F6FC]">{lang.label}</div>
                  <div className="text-[10px] text-[#8B9CB5]">{lang.sub}</div>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#00E5FF]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Android Notification Channels & Permission Handling */}
      <div className="p-4 rounded-2xl bg-[#0D172E] border border-[#1E2D54] space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-[#F0F6FC] flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#00E5FF]" />
            <span>Android Notification Channels</span>
          </div>
          <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold ${
            permissionStatus === 'granted'
              ? 'bg-[#00E676]/15 text-[#00E676] border border-[#00E676]/30'
              : 'bg-[#FF9500]/15 text-[#FF9500] border border-[#FF9500]/30'
          }`}>
            Status: {permissionStatus.toUpperCase()}
          </span>
        </div>

        {permissionStatus !== 'granted' && (
          <div className="p-3 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-between gap-2">
            <div className="text-xs text-[#CBD5E1]">
              Enable system alerts for IMD squall warnings and rain nowcasts.
            </div>
            <button
              onClick={handleRequestPermission}
              className="px-3 py-1.5 rounded-lg bg-[#00E5FF] text-black text-xs font-bold hover:bg-[#00E5FF]/90 transition shrink-0"
            >
              Grant Permission
            </button>
          </div>
        )}

        {/* 3 Prepared Android Channels */}
        <div className="space-y-2">
          {ANDROID_NOTIFICATION_CHANNELS.map((ch) => {
            const isEnabled = 
              ch.id === 'stormx_severe_alerts' ? preferences.severeStormChannel :
              ch.id === 'stormx_daily_forecast' ? preferences.dailyForecastChannel :
              preferences.rainNowcastChannel;

            const handleToggle = () => {
              if (ch.id === 'stormx_severe_alerts') {
                onUpdatePreferences({ severeStormChannel: !preferences.severeStormChannel });
              } else if (ch.id === 'stormx_daily_forecast') {
                onUpdatePreferences({ dailyForecastChannel: !preferences.dailyForecastChannel });
              } else {
                onUpdatePreferences({ rainNowcastChannel: !preferences.rainNowcastChannel });
              }
            };

            return (
              <div
                key={ch.id}
                className="p-3 rounded-xl bg-[#080E1E] border border-[#1E2D54]/70 flex items-center justify-between gap-3"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#F0F6FC]">{ch.name}</span>
                    <span className="text-[9px] px-1 rounded bg-[#1E2D54] text-[#00E5FF] font-mono">
                      {ch.importance}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#8B9CB5] leading-relaxed">{ch.description}</p>
                </div>

                <button
                  onClick={handleToggle}
                  className={`w-11 h-6 rounded-full transition p-0.5 shrink-0 ${
                    isEnabled ? 'bg-[#00E5FF]' : 'bg-[#1E2D54]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-black transition transform ${
                      isEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  ></div>
                </button>
              </div>
            );
          })}
        </div>

        {/* Action Buttons: Test Notification + Closed App Explanation */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <button
            onClick={handleTestNotification}
            className="flex-1 py-2 px-3 rounded-xl bg-[#0D172E] border border-[#1E2D54] hover:border-[#00E5FF]/40 text-xs font-semibold text-[#CBD5E1] flex items-center justify-center gap-1.5 transition"
          >
            {testSent ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#00E676]" />
                <span className="text-[#00E676]">Dispatched Test Toast!</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span>Trigger Test Channel Toast</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenClosedAppModal}
            className="flex-1 py-2 px-3 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 hover:bg-[#00E5FF]/20 text-xs font-semibold text-[#00E5FF] flex items-center justify-center gap-1.5 transition"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Closed-App Notification Architecture</span>
          </button>
        </div>
      </div>

      {/* APK Export & Native Android Suite Launcher */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0D172E] via-[#0D1C38] to-[#0D172E] border border-[#00E5FF]/40 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-[#F0F6FC]">
            <FolderArchive className="w-4 h-4 text-[#00E5FF]" />
            <span>Native Android Studio APK Suite</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-[#00E676]/15 text-[#00E676] font-semibold">
            Zero Budget & Free Tools
          </span>
        </div>

        <p className="text-xs text-[#CBD5E1] leading-relaxed">
          Export the complete Kotlin & Jetpack Compose codebase or trigger the automated 
          <strong> GitHub Actions runner</strong> to compile <code className="text-[#00E5FF]">app-debug.apk</code> directly on your phone with no PC required.
        </p>

        <button
          onClick={onOpenApkModal}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#2979FF] hover:opacity-90 text-black text-xs font-bold flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,229,255,0.3)] transition"
        >
          <Sparkles className="w-4 h-4" />
          <span>Open APK Builder & Source Code Exporter</span>
        </button>
      </div>

      {/* About StormX India */}
      <div className="p-4 rounded-2xl bg-[#080E1E] border border-[#1E2D54]/50 text-xs text-[#8B9CB5] space-y-1.5">
        <div className="font-bold text-[#F0F6FC]">StormX India v1.0.0</div>
        <p>
          High-performance Indian weather telemetry powered by Open-Meteo High-Resolution Mesh, 
          India Meteorological Department (IMD) official alerts, and NDMA Sachet early warning feeds.
        </p>
      </div>
    </div>
  );
};
