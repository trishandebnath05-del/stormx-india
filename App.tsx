import React, { useState, useEffect, useCallback } from 'react';
import { 
  CloudLightning, Smartphone, Monitor, Bell, AlertTriangle, 
  RefreshCw, MapPin, Sparkles, FolderArchive 
} from 'lucide-react';
import { 
  WeatherData, CityLocation, SevereWeatherAlert, IMDFeedStatus, 
  NewsArticle, NewsCategory, NewsLanguage, UserPreferences 
} from './types/weather';
import { POPULAR_INDIAN_CITIES } from './data/indianCities';
import { fetchWeatherData } from './services/openMeteoService';
import { checkIMDOfficialAlerts } from './services/imdAlertsService';
import { fetchIndianNews } from './services/newsService';
import { AndroidStatusBar } from './components/AndroidStatusBar';
import { AndroidBottomNav, ScreenTab } from './components/AndroidBottomNav';
import { CitySearchModal } from './components/CitySearchModal';
import { ClosedAppNotificationModal } from './components/ClosedAppNotificationModal';
import { ApkExportModal } from './components/ApkExportModal';
import { HomeScreen } from './screens/HomeScreen';
import { ForecastScreen } from './screens/ForecastScreen';
import { AlertsScreen } from './screens/AlertsScreen';
import { NewsScreen } from './screens/NewsScreen';
import { SettingsScreen } from './screens/SettingsScreen';

const DEFAULT_PREFERENCES: UserPreferences = {
  selectedCity: POPULAR_INDIAN_CITIES[0], // New Delhi
  temperatureUnit: 'celsius',
  windSpeedUnit: 'kmh',
  language: 'en',
  notificationsEnabled: true,
  severeStormChannel: true,
  dailyForecastChannel: true,
  rainNowcastChannel: true,
};

export default function App() {
  // Navigation & View Mode
  const [currentTab, setCurrentTab] = useState<ScreenTab>('home');
  const [isPhoneFrame, setIsPhoneFrame] = useState(false);

  // User Preferences
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem('stormx_india_prefs');
      if (saved) return { ...DEFAULT_PREFERENCES, ...JSON.parse(saved) };
    } catch {
      // ignore
    }
    return DEFAULT_PREFERENCES;
  });

  // Weather state
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  // IMD Alerts state
  const [alerts, setAlerts] = useState<SevereWeatherAlert[]>([]);
  const [imdStatus, setImdStatus] = useState<IMDFeedStatus>({
    isConfigured: true,
    isReachable: false,
    lastChecked: 'Initializing...',
    sourceUrl: 'https://mausam.imd.gov.in',
    sourceName: 'India Meteorological Department (IMD)',
    feedType: 'MAUSAM-BULLETIN'
  });
  const [isCheckingAlerts, setIsCheckingAlerts] = useState(false);

  // News state
  const [newsCategory, setNewsCategory] = useState<NewsCategory>('national');
  const [newsLanguage, setNewsLanguage] = useState<NewsLanguage>('en');
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [newsSourceUsed, setNewsSourceUsed] = useState<string>('Live Indian Wire');
  const [isNewsLoading, setIsNewsLoading] = useState(false);

  // Modals
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);
  const [isClosedAppModalOpen, setIsClosedAppModalOpen] = useState(false);

  // Save preferences to localStorage
  const handleUpdatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences((prev) => {
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem('stormx_india_prefs', JSON.stringify(updated));
      } catch (err) {
        console.warn('Storage save failed', err);
      }
      return updated;
    });
  };

  // Fetch Weather
  const loadWeather = useCallback(async (city: CityLocation) => {
    setIsWeatherLoading(true);
    setWeatherError(null);
    try {
      const data = await fetchWeatherData(city);
      setWeatherData(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to retrieve weather forecast.';
      setWeatherError(msg);
    } finally {
      setIsWeatherLoading(false);
    }
  }, []);

  // Fetch IMD Alerts
  const loadAlerts = useCallback(async (city?: CityLocation) => {
    setIsCheckingAlerts(true);
    try {
      const result = await checkIMDOfficialAlerts(city);
      setAlerts(result.alerts);
      setImdStatus(result.status);
    } catch (err) {
      console.warn('Alerts check error:', err);
    } finally {
      setIsCheckingAlerts(false);
    }
  }, []);

  // Fetch News
  const loadNews = useCallback(async (cat: NewsCategory, lang: NewsLanguage, apiKey?: string) => {
    setIsNewsLoading(true);
    try {
      const { articles: resArticles, sourceUsed } = await fetchIndianNews(cat, lang, apiKey);
      setNewsArticles(resArticles);
      setNewsSourceUsed(sourceUsed);
    } catch (err) {
      console.warn('News load error:', err);
    } finally {
      setIsNewsLoading(false);
    }
  }, []);

  // Initial loads & city changes
  useEffect(() => {
    loadWeather(preferences.selectedCity);
    loadAlerts(preferences.selectedCity);
  }, [preferences.selectedCity, loadWeather, loadAlerts]);

  // Load news when category or language changes
  useEffect(() => {
    loadNews(newsCategory, newsLanguage, preferences.customNewsApiKey);
  }, [newsCategory, newsLanguage, preferences.customNewsApiKey, loadNews]);

  // Select city handler
  const handleSelectCity = (newCity: CityLocation) => {
    handleUpdatePreferences({ selectedCity: newCity });
  };

  // Screen Content Renderer
  const renderScreenContent = () => {
    switch (currentTab) {
      case 'home':
        return (
          <HomeScreen
            weatherData={weatherData}
            isLoading={isWeatherLoading}
            error={weatherError}
            activeAlerts={alerts}
            preferences={preferences}
            onRefresh={() => loadWeather(preferences.selectedCity)}
            onOpenCityModal={() => setIsCityModalOpen(true)}
            onNavigateToForecast={() => setCurrentTab('forecast')}
            onNavigateToAlerts={() => setCurrentTab('alerts')}
            onOpenApkModal={() => setIsApkModalOpen(true)}
          />
        );
      case 'forecast':
        return (
          <ForecastScreen
            weatherData={weatherData}
            preferences={preferences}
            onOpenCityModal={() => setIsCityModalOpen(true)}
          />
        );
      case 'alerts':
        return (
          <AlertsScreen
            alerts={alerts}
            status={imdStatus}
            selectedCity={preferences.selectedCity}
            isChecking={isCheckingAlerts}
            onRefreshAlerts={() => loadAlerts(preferences.selectedCity)}
          />
        );
      case 'news':
        return (
          <NewsScreen
            articles={newsArticles}
            isLoading={isNewsLoading}
            sourceUsed={newsSourceUsed}
            selectedCategory={newsCategory}
            selectedLanguage={newsLanguage}
            customApiKey={preferences.customNewsApiKey || ''}
            onSelectCategory={setNewsCategory}
            onSelectLanguage={setNewsLanguage}
            onSaveApiKey={(key) => handleUpdatePreferences({ customNewsApiKey: key })}
            onRefresh={() => loadNews(newsCategory, newsLanguage, preferences.customNewsApiKey)}
          />
        );
      case 'settings':
        return (
          <SettingsScreen
            preferences={preferences}
            onUpdatePreferences={handleUpdatePreferences}
            onOpenCityModal={() => setIsCityModalOpen(true)}
            onOpenApkModal={() => setIsApkModalOpen(true)}
            onOpenClosedAppModal={() => setIsClosedAppModalOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#050914] text-[#F0F6FC] flex flex-col items-center justify-start antialiased selection:bg-[#00E5FF] selection:text-black">
      {/* Top Global Navigation Bar (Controls Phone Bezel & Export Suite) */}
      <header className="w-full bg-[#080E1E]/95 border-b border-[#1E2D54]/70 px-4 py-2.5 z-40 sticky top-0 backdrop-blur-md">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          {/* Logo & Identity */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#00E5FF] to-[#2979FF] flex items-center justify-center text-black shadow-[0_0_15px_rgba(0,229,255,0.4)]">
              <CloudLightning className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-[#F0F6FC]">StormX</span>
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-[#00E5FF]">India</span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 ml-1">
                  KOTLIN / COMPOSE
                </span>
              </div>
              <span className="text-[10px] text-[#8B9CB5] tracking-wide">
                Live Open-Meteo • IMD Official Alerts • Zero Budget APK
              </span>
            </div>
          </div>

          {/* Quick Actions Header */}
          <div className="flex items-center gap-2">
            {/* View Mode Toggle: Android Phone Frame vs Responsive Fullscreen */}
            <button
              onClick={() => setIsPhoneFrame(!isPhoneFrame)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0D172E] border border-[#1E2D54] hover:border-[#00E5FF]/50 text-xs font-semibold text-[#CBD5E1] transition"
              title="Toggle Android Device Frame"
            >
              {isPhoneFrame ? (
                <>
                  <Monitor className="w-3.5 h-3.5 text-[#00E5FF]" />
                  <span>Full View</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-[#00E5FF]" />
                  <span>Phone Frame</span>
                </>
              )}
            </button>

            {/* APK Builder button */}
            <button
              onClick={() => setIsApkModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#2979FF] hover:opacity-90 text-black text-xs font-bold shadow-[0_0_12px_rgba(0,229,255,0.35)] transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>APK & Code</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container: Android Phone Frame OR Full Responsive Layout */}
      <main className="w-full flex-1 flex items-center justify-center p-0 sm:py-6 sm:px-4">
        {isPhoneFrame ? (
          /* Realistic Native Android Phone Bezel Frame */
          <div className="relative w-full max-w-[420px] h-[860px] bg-[#000000] rounded-[52px] border-[10px] border-[#1A253E] shadow-[0_0_50px_rgba(0,229,255,0.15)] flex flex-col overflow-hidden ring-1 ring-white/10">
            {/* Phone Speaker & punchhole camera */}
            <div className="absolute top-2 inset-x-0 mx-auto w-24 h-4 bg-transparent flex items-center justify-center z-50 pointer-events-none">
              <div className="w-12 h-1 bg-[#1A253E] rounded-full"></div>
            </div>

            {/* Android Status Bar */}
            <AndroidStatusBar />

            {/* Scrollable Screen Content */}
            <div className="flex-1 flex flex-col overflow-hidden bg-[#050914] relative">
              {renderScreenContent()}
            </div>

            {/* Android Material 3 Bottom Navigation */}
            <AndroidBottomNav
              currentTab={currentTab}
              onTabChange={setCurrentTab}
              hasActiveAlert={alerts.length > 0}
            />

            {/* Android Gesture Navigation Bar Pill */}
            <div className="w-full bg-[#080E1E] pb-2 pt-1 flex items-center justify-center select-none">
              <div className="w-32 h-1 bg-[#8B9CB5]/40 rounded-full"></div>
            </div>
          </div>
        ) : (
          /* Responsive Edge-to-Edge Layout (Fits mobile phones, tablets, desktop perfectly) */
          <div className="w-full max-w-2xl bg-[#080E1E]/40 sm:border border-[#1E2D54]/70 sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden min-h-[calc(100vh-65px)]">
            {/* Simulated Android Status Bar */}
            <AndroidStatusBar />

            {/* Screen Content */}
            <div className="flex-1 flex flex-col overflow-hidden bg-[#050914]">
              {renderScreenContent()}
            </div>

            {/* Android Bottom Navigation */}
            <div className="sticky bottom-0 z-30">
              <AndroidBottomNav
                currentTab={currentTab}
                onTabChange={setCurrentTab}
                hasActiveAlert={alerts.length > 0}
              />
              <div className="w-full bg-[#080E1E] pb-1.5 pt-0.5 flex items-center justify-center select-none">
                <div className="w-28 h-1 bg-[#8B9CB5]/30 rounded-full"></div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Interactive Modals */}
      <CitySearchModal
        isOpen={isCityModalOpen}
        onClose={() => setIsCityModalOpen(false)}
        selectedCity={preferences.selectedCity}
        onSelectCity={handleSelectCity}
      />

      <ClosedAppNotificationModal
        isOpen={isClosedAppModalOpen}
        onClose={() => setIsClosedAppModalOpen(false)}
      />

      <ApkExportModal
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
      />
    </div>
  );
}
