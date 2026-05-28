'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Terminal, ArrowRight, Flame, Award, Zap, Sun, Moon } from 'lucide-react';
import { useUserState } from '../context/UserStateContext';

export default function LandingPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useUserState();

  return (
    <div className="relative w-full min-h-screen bg-brand-background text-zinc-900 dark:text-white overflow-hidden select-none transition-colors duration-300">
      
      {/* AMBIENT BACKGROUND LAYERS */}
      <div className="absolute inset-0 z-0 opacity-50 dark:opacity-100">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-xp-glow rounded-full blur-3xl opacity-30 dark:opacity-40" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-cyber-glow rounded-full blur-3xl opacity-30 dark:opacity-40" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-brand-level-glow rounded-full blur-3xl opacity-20 dark:opacity-30" />
      </div>

      {/* HEADER */}
      <div className="relative z-20 pt-8 px-6 lg:pt-12 lg:px-12 flex items-center justify-between">
        <div className="flex items-center justify-start gap-2 lg:gap-3">
          <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl lg:rounded-2xl bg-gradient-to-tr from-brand-xp to-brand-cyber flex items-center justify-center text-white dark:text-black font-black shadow-neon-xp">
            <Terminal size={18} className="lg:hidden stroke-[2.5]" />
            <Terminal size={24} className="hidden lg:block stroke-[2.5]" />
          </div>
          <span className="text-xs lg:text-sm font-black text-zinc-800 dark:text-white tracking-widest uppercase">
            DevHub Launchpad
          </span>
        </div>

        {/* Theme Switcher in header */}
        <button 
          onClick={toggleTheme}
          className="p-2.5 rounded-xl border border-brand-border bg-brand-card hover:bg-zinc-100 dark:hover:bg-zinc-800/50 text-zinc-600 dark:text-zinc-300 transition-colors duration-200"
          title="Toggle Theme"
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} className="text-brand-xp" />}
        </button>
      </div>

      {/* MAIN HERO GRID */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-center justify-between gap-8 lg:gap-16 px-6 lg:px-12 py-12 lg:py-24 min-h-[calc(100vh-120px)]">
        
        {/* LEFT COLUMN: TEXT CONTENT */}
        <div className="flex flex-col items-center lg:items-start justify-center gap-6 lg:gap-8 flex-1 w-full lg:w-auto">
          
          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4 text-center lg:text-left"
          >
            <h1 className="text-4xl lg:text-6xl font-black text-zinc-900 dark:text-white tracking-tight leading-tight">
              Build. Grow.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-xp via-brand-cyber to-brand-level">
                Get Recognized.
              </span>
            </h1>
            
            <p className="text-sm lg:text-lg text-zinc-500 dark:text-zinc-400 max-w-md font-medium leading-relaxed">
              The platform for ambitious developers. Ship daily, build proof-of-work, and connect with the fastest-growing tech communities.
            </p>
          </motion.div>

          {/* CTA SECTION */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-4 w-full lg:w-auto"
          >
            <button
              onClick={() => router.push('/onboarding')}
              className="px-8 lg:px-10 py-4 lg:py-5 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-100 active:scale-95 text-xs lg:text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all duration-200 shadow-glass"
            >
              Start Building <ArrowRight size={16} className="stroke-[3]" />
            </button>

            <p className="text-[11px] lg:text-xs text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-widest text-center lg:text-left">
              ✨ No credit card required
            </p>
          </motion.div>

          {/* SOCIAL PROOF */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-3 gap-6 lg:gap-8 mt-4 lg:mt-8 pt-8 lg:pt-12 border-t border-brand-border w-full lg:w-auto"
          >
            <div className="flex flex-col gap-1.5">
              <span className="text-lg lg:text-2xl font-black text-brand-xp">500+</span>
              <span className="text-[10px] lg:text-xs text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Active Builders</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-lg lg:text-2xl font-black text-brand-cyber">50K+</span>
              <span className="text-[10px] lg:text-xs text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Daily Logs</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-lg lg:text-2xl font-black text-brand-level">99%</span>
              <span className="text-[10px] lg:text-xs text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Retention</span>
            </div>
          </motion.div>

        </div>

        {/* RIGHT COLUMN: VISUAL SHOWCASE */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="hidden lg:flex relative w-full flex-1 h-[600px] items-center justify-center"
        >
          {/* ANIMATED LEVEL RING - CENTER */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="relative w-56 h-56 flex items-center justify-center"
          >
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
              <circle
                stroke="var(--border)"
                fill="transparent"
                strokeWidth="2"
                r="56"
                cx="64"
                cy="64"
              />
              <motion.circle
                stroke="var(--brand-xp)"
                fill="transparent"
                strokeWidth="3"
                strokeDasharray="352"
                initial={{ strokeDashoffset: 352 }}
                animate={{ strokeDashoffset: 100 }}
                transition={{ duration: 3, ease: 'easeOut', repeat: Infinity, repeatType: 'reverse' }}
                r="56"
                cx="64"
                cy="64"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-xs uppercase font-bold text-zinc-400 dark:text-zinc-500 tracking-wider">Level</span>
              <span className="text-5xl font-black text-zinc-800 dark:text-white tracking-tighter leading-none">1</span>
            </div>
          </motion.div>

          {/* FLOATING MILESTONE CARD - TOP LEFT */}
          <motion.div
            animate={{ y: [0, -30, 0], x: [0, -15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-0 left-0 bg-brand-card backdrop-blur-lg border border-brand-border rounded-2xl p-4 w-48 shadow-glass"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-brand-xp-glow flex items-center justify-center">
                <Flame size={16} className="text-brand-streak" />
              </div>
              <span className="text-xs font-black text-brand-streak uppercase tracking-wider">Streak</span>
            </div>
            <div className="text-2xl font-black text-zinc-800 dark:text-white">7 Days</div>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-2 font-medium">Keep building daily</p>
          </motion.div>

          {/* FLOATING MILESTONE CARD - BOTTOM RIGHT */}
          <motion.div
            animate={{ y: [0, 30, 0], x: [0, 15, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            className="absolute bottom-0 right-0 bg-brand-card backdrop-blur-lg border border-brand-border rounded-2xl p-4 w-48 shadow-glass"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-brand-cyber-glow flex items-center justify-center">
                <Award size={16} className="text-brand-cyber" />
              </div>
              <span className="text-xs font-black text-brand-cyber uppercase tracking-wider">XP Gained</span>
            </div>
            <div className="text-2xl font-black text-zinc-800 dark:text-white">2,450 XP</div>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-2 font-medium">Level up faster daily</p>
          </motion.div>

          {/* FLOATING MILESTONE CARD - LEFT CENTER */}
          <motion.div
            animate={{ y: [0, 15, 0], x: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
            className="absolute left-0 top-1/3 bg-brand-card backdrop-blur-lg border border-brand-border rounded-2xl p-4 w-44 shadow-glass"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-brand-level-glow flex items-center justify-center">
                <Zap size={16} className="text-brand-level" />
              </div>
              <span className="text-xs font-black text-brand-level uppercase tracking-wider">Projects</span>
            </div>
            <div className="text-2xl font-black text-zinc-800 dark:text-white">12</div>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-2 font-medium">Proof of work</p>
          </motion.div>

        </motion.div>

      </div>

      {/* MOBILE-ONLY VISUAL */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="lg:hidden relative w-full flex flex-col items-center gap-8 px-6 py-8"
      >
        <div className="relative w-40 h-40 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              stroke="var(--border)"
              fill="transparent"
              strokeWidth="4"
              r="60"
              cx="80"
              cy="80"
            />
            <motion.circle
              stroke="var(--brand-xp)"
              fill="transparent"
              strokeWidth="4"
              strokeDasharray="377"
              initial={{ strokeDashoffset: 377 }}
              animate={{ strokeDashoffset: 100 }}
              transition={{ duration: 2.5, ease: 'easeOut', repeat: Infinity, repeatType: 'reverse' }}
              r="60"
              cx="80"
              cy="80"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500 tracking-wider">Level</span>
            <span className="text-4xl font-black text-zinc-850 dark:text-white tracking-tighter leading-none">1</span>
          </div>
        </div>
      </motion.div>

    </div>
  );
}
