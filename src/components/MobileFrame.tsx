'use client';

import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  RefreshCw, Terminal, Menu, X, Home, Hammer, Compass, Users, MessageSquare, Bell, Bookmark, Sun, Moon 
} from 'lucide-react';
import { useUserState } from '../context/UserStateContext';
import DesktopShell from './DesktopShell';

export default function MobileFrame({
  children,
  overlay,
}: {
  children: ReactNode;
  overlay?: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, resetApp, theme, toggleTheme } = useUserState();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const menuItems = [
    { label: 'Home', href: '/home', icon: Home },
    { label: 'Build', href: '/build', icon: Hammer },
    { label: 'Opportunities', href: '/opportunities', icon: Compass },
    { label: 'People', href: '/people', icon: Users },
    { label: 'Messages', href: '/messages', icon: MessageSquare, badge: 3 },
    { label: 'Notifications', href: '/home', icon: Bell, badge: 5 },
    { label: 'Bookmarks', href: '/bookmarks', icon: Bookmark },
  ];

  return (
    <div className="min-h-screen bg-brand-background text-zinc-900 dark:text-white flex flex-col transition-colors duration-300">
      
      {/* 1. MOBILE RESPONSIVE LAYOUT (Hidden on Desktop) */}
      <div className="lg:hidden flex flex-col flex-1 min-h-screen">
        
        {/* Mobile Header Top Navbar */}
        <header className="h-14 border-b border-brand-border bg-white/85 dark:bg-zinc-900/85 backdrop-blur-md px-4 flex items-center justify-between sticky top-0 z-40 select-none">
          <div className="flex items-center gap-2.5">
            {profile && (
              <button 
                onClick={() => setIsDrawerOpen(true)}
                className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-650 dark:text-zinc-350 transition-colors"
                aria-label="Open menu"
              >
                <Menu size={18} />
              </button>
            )}
            
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-brand-xp to-brand-cyber flex items-center justify-center text-white font-black shadow-neon-xp">
                <Terminal size={12} className="stroke-[2.5]" />
              </div>
              <span className="text-[11px] font-black text-zinc-900 dark:text-white tracking-widest uppercase">
                DevHub
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {profile && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={profile.photoUrl} alt="avatar" className="w-6 h-6 rounded-full border border-brand-border bg-zinc-100" />
            )}
          </div>
        </header>

        {/* Mobile Sliding Sidebar Drawer Overlay */}
        {isDrawerOpen && (
          <div className="fixed inset-0 z-50 flex">
            {/* Backdrop dark overlay */}
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
              onClick={() => setIsDrawerOpen(false)}
            />

            {/* Sliding Drawer body */}
            <aside className="relative flex w-[240px] max-w-xs flex-col gap-5 border-r border-brand-border bg-white dark:bg-zinc-950 p-5 shadow-2xl transition-transform duration-300 transform translate-x-0 h-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-xp to-brand-cyber flex items-center justify-center text-white font-black shadow-neon-xp">
                    <Terminal size={14} className="stroke-[2.5]" />
                  </div>
                  <span className="text-xs font-black text-zinc-900 dark:text-white tracking-widest uppercase">
                    DevHub
                  </span>
                </div>
                <button 
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Links List */}
              <nav className="flex-1 space-y-0.5 overflow-y-auto">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setIsDrawerOpen(false)}
                      className={`group flex items-center justify-between rounded-xl px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-150 border ${
                        isActive 
                          ? 'bg-zinc-100 dark:bg-zinc-900/50 text-zinc-950 dark:text-white border-zinc-200 dark:border-white/5 shadow-glass' 
                          : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 border-transparent hover:bg-zinc-100/50 dark:hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={14} className={`shrink-0 ${isActive ? 'text-brand-xp' : 'text-zinc-400 dark:text-zinc-550 group-hover:text-zinc-700 dark:group-hover:text-zinc-300'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[8px] font-black bg-brand-xp text-white dark:text-black px-1.5 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Theme Switcher in Mobile Drawer */}
              <button 
                onClick={() => {
                  toggleTheme();
                  setIsDrawerOpen(false);
                }}
                className="flex items-center justify-between w-full px-3 py-2 rounded-xl border border-brand-border bg-zinc-50 dark:bg-zinc-900/10 hover:bg-zinc-100 dark:hover:bg-zinc-900/30 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-all duration-150 text-[9px] font-black uppercase tracking-wider"
              >
                <span className="flex items-center gap-2">
                  {theme === 'light' ? (
                    <Sun size={13} className="text-amber-500" />
                  ) : (
                    <Moon size={13} className="text-brand-xp" />
                  )}
                  <span>{theme === 'light' ? 'Light' : 'Dark'}</span>
                </span>
                <span className="text-[7px] bg-zinc-200 dark:bg-white/5 border border-brand-border text-zinc-400 dark:text-zinc-650 px-1 rounded font-black">
                  Theme
                </span>
              </button>

              {/* User profile footer */}
              {profile && (
                <div className="border-t border-brand-border pt-3.5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={profile.photoUrl} alt="avatar" className="w-8 h-8 rounded-full border border-brand-border bg-zinc-100" />
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-black text-zinc-800 dark:text-white leading-tight">{profile.name}</span>
                      <span className="text-[8px] text-zinc-450 dark:text-zinc-550 font-bold lowercase">@{profile.name.toLowerCase().replace(/\s+/g, '')}</span>
                    </div>
                  </div>
                </div>
              )}
            </aside>
          </div>
        )}

        {/* Mobile Dashboard Body Content - takes full viewport width */}
        <main className="flex-1 flex flex-col overflow-y-auto px-4 py-4 pb-6 w-full">
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
