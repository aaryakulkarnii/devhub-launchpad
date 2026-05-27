'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Terminal, ArrowRight, Sparkles, CheckCircle2, Zap } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="flex-1 flex flex-col items-center justify-between px-6 py-10 relative overflow-hidden select-none min-h-full">
      
      {/* Background glowing particles */}
      <div className="absolute top-1/4 w-32 h-32 bg-brand-cyber/20 rounded-full blur-3xl z-0" />
      <div className="absolute bottom-1/4 w-32 h-32 bg-brand-level/20 rounded-full blur-3xl z-0" />

      {/* 1. Header logo */}
      <div className="w-full flex items-center justify-center gap-2 relative z-10">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-xp to-brand-cyber flex items-center justify-center text-black font-black shadow-[0_0_15px_rgba(0,255,204,0.3)]">
          <Terminal size={18} className="stroke-[2.5]" />
        </div>
        <span className="text-xs font-black text-white tracking-widest uppercase">
          DevHub Launchpad
        </span>
      </div>

      {/* 2. Hero Section */}
      <div className="text-center my-auto flex flex-col gap-6 relative z-10 w-full max-w-[340px]">
        
        {/* Dynamic Visuals Showcase */}
        <div className="relative w-full h-[190px] flex items-center justify-center mb-2">
          
          {/* Animated XP Ring Visual */}
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                stroke="rgba(255, 255, 255, 0.03)"
                fill="transparent"
                strokeWidth="4"
                r="46"
                cx="56"
                cy="56"
              />
              <motion.circle
                stroke="#00ffcc"
                fill="transparent"
                strokeWidth="4"
                strokeDasharray="289"
                initial={{ strokeDashoffset: 289 }}
                animate={{ strokeDashoffset: 80 }}
                transition={{ duration: 2, ease: 'easeOut', repeat: Infinity, repeatType: 'reverse' }}
                r="46"
                cx="56"
                cy="56"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider">Level</span>
              <span className="text-xl font-black text-white tracking-tighter leading-none">0</span>
            </div>
          </div>

          {/* Progress Timeline Preview */}
          <motion.div
            animate={{ y: [6, -6, 6] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-2 left-2 bg-black/80 border border-white/5 backdrop-blur-md p-2.5 rounded-xl shadow-lg text-left w-[125px] flex flex-col gap-1.5"
          >
            <div className="flex items-center gap-1.5 text-[8px] text-zinc-300 font-semibold">
              <CheckCircle2 size={10} className="text-brand-xp shrink-0" />
              <span>Profile Built</span>
            </div>
            <div className="flex items-center gap-1.5 text-[8px] text-zinc-300 font-semibold border-t border-white/5 pt-1">
              <CheckCircle2 size={10} className="text-brand-cyber shrink-0" />
              <span>First log shipped</span>
            </div>
          </motion.div>

        </div>

        {/* Text Headers */}
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-3xl font-black text-white tracking-tight leading-none"
          >
            Build. Grow.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-xp to-brand-cyber">
              Get Recognized.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="text-xs text-zinc-400 mt-4 leading-relaxed font-medium px-4"
          >
            The platform that helps developers turn effort into visible progress. Feel momentum in 5 minutes.
          </motion.p>
        </div>

      </div>

      {/* 3. Primary CTA let's start */}
      <div className="w-full max-w-[340px] relative z-10 flex flex-col items-center gap-4">
        
        <button
          onClick={() => router.push('/onboarding')}
          className="w-full py-4 px-6 rounded-2xl bg-white text-black hover:bg-zinc-200 active:scale-98 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all duration-200 shadow-[0_4px_25px_rgba(255,255,255,0.15)]"
        >
          Let&apos;s Start <ArrowRight size={14} className="stroke-[2.5]" />
        </button>

        <div className="text-[8px] text-zinc-600 font-black uppercase tracking-widest flex items-center gap-1.5">
          <Zap size={10} className="text-brand-xp" />
          <span>No login required to build profile</span>
        </div>

      </div>

    </div>
  );
}
