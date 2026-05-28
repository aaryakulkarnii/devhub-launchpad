'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Award, User, Terminal } from 'lucide-react';
import { useUserState } from '../context/UserStateContext';

const MENU_ITEMS = [
  { label: 'Home', href: '/home', icon: Home },
  { label: 'Journey', href: '/home', icon: Award },
  { label: 'Profile', href: '/profile', icon: User }
];

export default function DesktopShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="hidden lg:flex h-screen w-full bg-[#050508] text-white overflow-hidden">
      <aside className="flex h-screen w-[220px] flex-col gap-6 border-r border-white/10 bg-black/70 backdrop-blur-xl px-5 py-6 sticky top-0">
        <div className="flex flex-col gap-4">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-3xl bg-brand-xp/10 border border-brand-xp/20 text-brand-xp shadow-[0_0_18px_rgba(0,255,204,0.18)]">
            <Terminal size={20} />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">DevHub Launchpad</p>
            <h1 className="text-xl font-extrabold tracking-tight text-white">Builder Studio</h1>
          </div>
        </div>

        <nav className="space-y-2">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                  isActive ? 'bg-brand-xp/10 text-brand-xp border border-brand-xp/20 shadow-[0_0_20px_rgba(0,255,204,0.12)]' : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={18} className="shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-3xl border border-white/10 bg-white/5 p-4 text-[11px] text-zinc-300">
          <p className="uppercase tracking-[0.24em] text-zinc-500">Builder pulse</p>
          <p className="mt-3 text-sm font-bold text-white leading-tight">Keep the streak alive with daily logs.</p>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-transparent">
        <div className="mx-auto max-w-[720px] px-6 py-6 pb-20">
          {children}
        </div>
      </main>
    </div>
  );
}
