import React, { useState, useEffect } from 'react';
import { Search, MapPin, Navigation, X, Check, Loader2 } from 'lucide-react';
import { CityLocation } from '../types/weather';
import { POPULAR_INDIAN_CITIES } from '../data/indianCities';
import { searchCities, findClosestCity } from '../services/openMeteoService';

interface CitySearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCity: CityLocation;
  onSelectCity: (city: CityLocation) => void;
}

export const CitySearchModal: React.FC<CitySearchModalProps> = ({
  isOpen,
  onClose,
  selectedCity,
  onSelectCity
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CityLocation[]>(POPULAR_INDIAN_CITIES.slice(0, 12));
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setLocationError(null);
      setResults(POPULAR_INDIAN_CITIES.slice(0, 12));
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults(POPULAR_INDIAN_CITIES.slice(0, 12));
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const found = await searchCities(query);
        setResults(found);
      } catch (err) {
        console.warn('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const city = findClosestCity(pos.coords.latitude, pos.coords.longitude);
        onSelectCity(city);
        onClose();
      },
      (err) => {
        setIsLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setLocationError('Location permission was denied. Please select a city manually below.');
        } else {
          setLocationError('Unable to retrieve position. Please choose from the list.');
        }
      },
      { timeout: 8000, enableHighAccuracy: false }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#080E1E] border border-[#1E2D54] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Top Header */}
        <div className="p-4 border-b border-[#1E2D54]/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#00E5FF]" />
            <h2 className="text-base font-bold text-[#F0F6FC]">Select Indian City</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#1E2D54]/50 text-[#8B9CB5] hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#8B9CB5]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Indian city, district or state..."
              className="w-full bg-[#0D172E] border border-[#1E2D54] rounded-xl pl-10 pr-10 py-2.5 text-sm text-[#F0F6FC] placeholder-[#5A6D88] focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-3 text-[#8B9CB5] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* GPS Button */}
          <button
            onClick={handleUseGPS}
            disabled={isLocating}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] hover:bg-[#00E5FF]/20 text-xs font-semibold tracking-wide transition disabled:opacity-50"
          >
            {isLocating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Locating nearest Indian station...</span>
              </>
            ) : (
              <>
                <Navigation className="w-4 h-4" />
                <span>Use Current Location (GPS)</span>
              </>
            )}
          </button>

          {locationError && (
            <div className="text-[11px] text-[#FF2A55] bg-[#FF2A55]/10 border border-[#FF2A55]/30 rounded-lg p-2.5 leading-relaxed">
              {locationError}
            </div>
          )}
        </div>

        {/* City List */}
        <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-1">
          <div className="text-[11px] font-bold text-[#5A6D88] uppercase tracking-wider px-2 py-1">
            {query ? `Search Results (${results.length})` : 'Popular Weather Hubs'}
          </div>

          {isSearching ? (
            <div className="flex items-center justify-center py-10 text-[#8B9CB5] gap-2 text-xs">
              <Loader2 className="w-4 h-4 animate-spin text-[#00E5FF]" />
              <span>Searching Open-Meteo Indian Geocoding...</span>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-10 text-[#8B9CB5] text-xs">
              No matching Indian city found. Try a broader state or district name.
            </div>
          ) : (
            results.map((city) => {
              const isSelected = selectedCity.name === city.name;
              return (
                <button
                  key={`${city.name}-${city.latitude}`}
                  onClick={() => {
                    onSelectCity(city);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition ${
                    isSelected
                      ? 'bg-[#00E5FF]/10 border-[#00E5FF]/40 text-[#00E5FF]'
                      : 'bg-[#0D172E]/60 border-[#1E2D54]/50 hover:bg-[#132247]/60 text-[#CBD5E1]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isSelected ? 'bg-[#00E5FF] text-black font-bold' : 'bg-[#1E2D54]/50 text-[#8B9CB5]'
                      }`}
                    >
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-[#F0F6FC]">{city.name}</div>
                      <div className="text-xs text-[#8B9CB5]">{city.state}, {city.country}</div>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-[#00E5FF] flex items-center justify-center text-black">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
