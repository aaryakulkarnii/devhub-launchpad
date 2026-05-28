'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, Compass, User, Terminal, Flame, Sun, Moon,
  Hammer, Users, BrainCircuit, MessageSquare, Bell, Bookmark, Sparkles
} from 'lucide-react';
import { useUserState } from '../context/UserStateContext';

export default function DesktopShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, theme, toggleTheme } = useUserState();

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
    <div className="hidden lg:flex h-screen w-full bg-brand-background text-zinc-900 dark:text-zinc-150 overflow-hidden transition-colors duration-300">
      
      {/* SIDEBAR CONTAINER */}
      <aside className="flex h-screen w-[240px] flex-col gap-5 border-r border-brand-border bg-white dark:bg-zinc-950/80 backdrop-blur-xl px-5 py-6 sticky top-0 shrink-0 select-none">
        
        {/* LOGO */}
        <div className="flex items-center gap-2 px-1">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-xp to-brand-cyber flex items-center justify-center text-white font-black shadow-neon-xp">
            <Terminal size={18} className="stroke-[2.5]" />
          </div>
          <span className="text-sm font-black text-zinc-900 dark:text-white tracking-widest uppercase">
            DevHub
          </span>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto pr-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 border ${
                  isActive 
                    ? 'bg-zinc-100 dark:bg-zinc-900/50 text-zinc-950 dark:text-white border-zinc-200 dark:border-white/5 shadow-glass' 
                    : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 border-transparent hover:bg-zinc-100/50 dark:hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={15} className={`shrink-0 ${isActive ? 'text-brand-xp' : 'text-zinc-400 dark:text-zinc-555 group-hover:text-zinc-700 dark:group-hover:text-zinc-300'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-black bg-brand-xp text-white dark:text-black px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* THEME SWITCHER */}
        <button 
          onClick={toggleTheme}
          className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl border border-brand-border bg-zinc-50 dark:bg-zinc-900/10 hover:bg-zinc-100 dark:hover:bg-zinc-900/30 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-all duration-200 text-[10px] font-black uppercase tracking-wider"
        >
          <span className="flex items-center gap-2">
            {theme === 'light' ? (
              <Sun size={14} className="text-amber-500" />
            ) : (
              <Moon size={14} className="text-brand-xp" />
            )}
            <span>{theme === 'light' ? 'Light Mode' : 'Dark Mode'}</span>
          </span>
          <span className="text-[8px] bg-zinc-200 dark:bg-white/5 border border-brand-border text-zinc-400 dark:text-zinc-600 px-1.5 py-0.5 rounded font-black">
            Theme
          </span>
        </button>

        {/* USER PROFILE INFO */}
        {profile && (
          <div className="border-t border-brand-border pt-4 flex items-center justify-between gap-2">
            <Link href="/profile" className="flex items-center gap-2.5 hover:opacity-85 transition-opacity">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={profile.photoUrl} alt="avatar" className="w-8 h-8 rounded-full border border-brand-border bg-zinc-100" />
              <div className="flex flex-col text-left">
                <span className="text-xs font-black text-zinc-800 dark:text-white leading-tight">{profile.name}</span>
                <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold lowercase">@{profile.name.toLowerCase().replace(/\s+/g, '')}</span>
              </div>
            </Link>
          </div>
        )}
      </aside>

      {/* MAIN CONTAINER */}
      <main className="flex-1 overflow-y-auto bg-transparent">
        <div className="mx-auto max-w-[1240px] px-6 py-6 pb-20 w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
