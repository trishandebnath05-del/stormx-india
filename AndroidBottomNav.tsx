import React from 'react';
import { CloudSun, CalendarRange, AlertTriangle, Newspaper, Settings } from 'lucide-react';

export type ScreenTab = 'home' | 'forecast' | 'alerts' | 'news' | 'settings';

interface AndroidBottomNavProps {
  currentTab: ScreenTab;
  onTabChange: (tab: ScreenTab) => void;
  hasActiveAlert?: boolean;
}

export const AndroidBottomNav: React.FC<AndroidBottomNavProps> = ({
  currentTab,
  onTabChange,
  hasActiveAlert = false
}) => {
  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(12);
      } catch {
        // ignore
      }
    }
  };

  const navItems = [
    { id: 'home' as ScreenTab, label: 'Home', icon: CloudSun },
    { id: 'forecast' as ScreenTab, label: 'Forecast', icon: CalendarRange },
    { id: 'alerts' as ScreenTab, label: 'IMD Alerts', icon: AlertTriangle, hasBadge: hasActiveAlert },
    { id: 'news' as ScreenTab, label: 'News', icon: Newspaper },
    { id: 'settings' as ScreenTab, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-full bg-[#080E1E]/95 backdrop-blur-md border-t border-[#1E2D54]/70 px-2 py-1.5 flex items-center justify-around z-30 select-none">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => {
              triggerHaptic();
              onTabChange(item.id);
            }}
            className="flex flex-col items-center justify-center flex-1 py-1 group relative transition-all duration-200"
          >
            {/* Material 3 active pill background */}
            <div
              className={`relative flex items-center justify-center px-4 py-1 rounded-full transition-all duration-300 ${
                isActive
                  ? 'bg-[#00E5FF]/15 text-[#00E5FF] shadow-[0_0_12px_rgba(0,229,255,0.35)]'
                  : 'text-[#8B9CB5] hover:text-[#CBD5E1]'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'}`} />

              {/* Alert notification badge */}
              {item.hasBadge && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#FF2A55] ring-2 ring-[#080E1E] animate-pulse"></span>
              )}
            </div>

            <span
              className={`text-[11px] mt-1 font-medium tracking-tight transition-colors duration-200 ${
                isActive ? 'text-[#00E5FF] font-semibold' : 'text-[#8B9CB5]'
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
