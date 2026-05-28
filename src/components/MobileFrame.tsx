'use client';

import React, { ReactNode } from 'react';
import { RefreshCw, Terminal } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-brand-background text-zinc-900 dark:text-white flex flex-col transition-colors duration-300">
      
      {/* 1. MOBILE RESPONSIVE LAYOUT (Hidden on Desktop) */}
      <div className="lg:hidden flex flex-col flex-1 min-h-screen">
        
        {/* Mobile Header Top Navbar */}
        <header className="h-14 border-b border-brand-border bg-white/85 dark:bg-zinc-900/85 backdrop-blur-md px-4 flex items-center justify-between sticky top-0 z-40 select-none">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-xp to-brand-cyber flex items-center justify-center text-white font-black shadow-neon-xp">
              <Terminal size={14} className="stroke-[2.5]" />
            </div>
            <span className="text-xs font-black text-zinc-900 dark:text-white tracking-widest uppercase">
              DevHub
            </span>
          </div>

          <div className="flex items-center gap-3">
            {profile && (
              <button 
                onClick={resetApp} 
                className="bg-red-500/10 hover:bg-red-500/20 text-red-500 dark:text-red-400 text-[9px] font-bold border border-red-500/20 px-2.5 py-1 rounded-full flex items-center gap-1 transition-colors duration-200"
                title="Reset Launchpad Onboarding"
              >
                <RefreshCw size={8} />
                Reset State
              </button>
            )}
            {profile && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={profile.photoUrl} alt="avatar" className="w-6 h-6 rounded-full border border-brand-border bg-zinc-100" />
            )}
          </div>
        </header>

        {/* Mobile Dashboard Body Content - takes full viewport width */}
        <main className="flex-1 flex flex-col overflow-y-auto px-4 py-4 pb-24 w-full">
          {children}
        </main>

        {/* Bottom Nav overlay for Mobile */}
        {overlay}
      </div>

      {/* 2. DESKTOP LAYOUT (Hidden on Mobile/Tablet) */}
      <div className="hidden lg:flex flex-1">
        <DesktopShell>
          {children}
        </DesktopShell>
      </div>

    </div>
  );
}
