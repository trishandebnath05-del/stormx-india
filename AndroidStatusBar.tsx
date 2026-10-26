import React, { useState, useEffect } from 'react';
import { Wifi, SignalHigh, BatteryMedium } from 'lucide-react';

export const AndroidStatusBar: React.FC = () => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-[#050914] text-[#8B9CB5] px-5 pt-2 pb-1.5 flex items-center justify-between text-xs font-semibold tracking-wide select-none z-30">
      <div className="flex items-center gap-1.5 text-[#F0F6FC] font-mono">
        <span>{time || '09:41'}</span>
      </div>

      {/* Simulated Android camera punch-hole cutout */}
      <div className="hidden sm:block w-3.5 h-3.5 rounded-full bg-[#020408] border border-[#1E2D54]/60 mx-auto -mt-0.5"></div>

      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-[#00E5FF] tracking-wider px-1 py-0.2 rounded bg-[#00E5FF]/10 border border-[#00E5FF]/30">
          5G
        </span>
        <SignalHigh className="w-3.5 h-3.5 text-[#8B9CB5]" />
        <Wifi className="w-3.5 h-3.5 text-[#8B9CB5]" />
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-[#8B9CB5]">88%</span>
          <BatteryMedium className="w-4 h-4 text-[#00E5FF]" />
        </div>
      </div>
    </div>
  );
};
