'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { Wifi, Battery, Signal, RefreshCw } from 'lucide-react';
import { useUserState } from '../context/UserStateContext';
import DesktopShell from './DesktopShell';

export default function MobileFrame({
  children,
  overlay,
}: {
  children: ReactNode;
  overlay?: ReactNode;
}) {
  const { profile, resetApp } = useUserState();
  const [time, setTime] = useState('12:00');

  // Time clock update for mock phone status bar
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      setTime(`${hours}:${minutes} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#050508] text-[#f3f4f6] flex font-sans lg:items-stretch lg:justify-start overflow-hidden lg:overflow-visible p-2 sm:p-6 lg:p-0">
      
      {/* 1. Ambient Background Cyber Meshes - Mobile only */}
      <div className="lg:hidden glow-bg bg-purple-900/30 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] -top-20 -left-20" />
      <div className="lg:hidden glow-bg bg-teal-900/20 w-[280px] h-[280px] sm:w-[450px] sm:h-[450px] bottom-10 -right-10" />
      <div className="lg:hidden glow-bg bg-orange-900/10 w-[200px] h-[200px] sm:w-[350px] sm:h-[350px] top-1/2 left-1/3" />

      {/* Mobile frame */}
      <div className="lg:hidden relative w-full max-w-[390px] h-[100vh] sm:h-[844px] bg-[#08080c] sm:rounded-[50px] sm:border-[10px] sm:border-[#1e1e2d] sm:shadow-[0_0_80px_rgba(0,0,0,0.8),0_0_0_2px_rgba(255,255,255,0.05)] overflow-hidden flex flex-col z-10 transition-all duration-300 mx-auto">
        <div className="hidden sm:block phone-notch">
          <div className="absolute top-[7px] right-[24px] w-3 h-3 bg-zinc-900 rounded-full border border-zinc-800" />
        </div>

        <div className="h-12 bg-black/40 backdrop-blur-md border-b border-white/5 flex items-end justify-between px-6 pb-2 select-none z-40 shrink-0">
          <span className="text-xs font-semibold tracking-wide text-zinc-300">{time}</span>
          <div className="flex items-center gap-1.5 text-zinc-300">
            <Signal size={12} className="opacity-90" />
            <span className="text-[10px] font-medium opacity-90">5G</span>
            <Wifi size={12} className="opacity-90" />
            <div className="flex items-center gap-0.5">
              <span className="text-[9px] font-semibold mr-0.5">98%</span>
              <Battery size={15} className="opacity-90 rotate-0" />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col pb-16 scrollbar-thin">
          {children}
        </div>

        {overlay}

        {profile && (
          <button 
            onClick={resetApp} 
            className="absolute top-14 right-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[9px] font-medium border border-red-500/20 px-2 py-1 rounded-full flex items-center gap-1 transition-colors duration-200 z-50 shadow-lg"
            title="Reset Launchpad Onboarding"
          >
            <RefreshCw size={8} />
            Reset State
          </button>
        )}
      </div>

      <DesktopShell>
        {children}
      </DesktopShell>
    </div>
  );
}
