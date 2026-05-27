'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUserState } from '../context/UserStateContext';

export default function BottomNav() {
  const pathname = usePathname();
  const { profile } = useUserState();

  // If not onboarded yet, do not render navigation
  if (!profile) return null;

  const tabs = [
    { name: 'Home', path: '/home', icon: Home, color: 'brand-xp' },
    { name: 'Moves', path: '/opportunities', icon: Compass, color: 'brand-cyber' },
    { name: 'Profile', path: '/profile', icon: User, color: 'brand-level' },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 h-[68px] bg-black/50 backdrop-blur-xl border-t border-white/5 flex items-center justify-around px-4 z-40 select-none sm:rounded-b-[40px]">
      
      {tabs.map((tab) => {
        const isActive = pathname === tab.path;
        const Icon = tab.icon;

        return (
          <Link key={tab.path} href={tab.path} className="relative flex flex-col items-center justify-center w-16 h-full text-zinc-400 focus:outline-none">
            
            {/* Sliding active glow badge using Framer Motion */}
            {isActive && (
              <motion.span 
                layoutId="activeTabGlow"
                className={`absolute w-12 h-8 rounded-full bg-${tab.color}/10 border border-${tab.color}/20 shadow-[0_0_15px_rgba(0,255,204,0.15)] z-0`}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}

            {/* Custom avatar rendering on profile tab */}
            {tab.name === 'Profile' && profile.photoUrl ? (
              <div className={`relative z-10 flex items-center justify-center w-7 h-7 rounded-full border-2 ${isActive ? 'border-brand-level shadow-[0_0_8px_rgba(157,78,221,0.5)]' : 'border-zinc-500'} overflow-hidden transition-all duration-200`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={profile.photoUrl} 
                  alt="avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <Icon 
                size={20} 
                className={`relative z-10 transition-colors duration-200 ${
                  isActive 
                    ? tab.color === 'brand-xp' 
                      ? 'text-brand-xp' 
                      : tab.color === 'brand-cyber'
                      ? 'text-brand-cyber'
                      : 'text-brand-level'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              />
            )}

            <span className={`text-[10px] mt-1 font-semibold tracking-wide relative z-10 transition-colors duration-200 ${
              isActive 
                ? tab.color === 'brand-xp' 
                  ? 'text-brand-xp' 
                  : tab.color === 'brand-cyber'
                  ? 'text-brand-cyber'
                  : 'text-brand-level'
                : 'text-zinc-500 font-medium'
            }`}>
              {tab.name}
            </span>

          </Link>
        );
      })}

    </div>
  );
}
