'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flame, Zap, Plus, X, 
  Terminal, Sparkles, AlertCircle,
  CheckCircle2, Compass, User, Award, Play
} from 'lucide-react';
import { useUserState } from '../../context/UserStateContext';
import MissionCard from '../../components/MissionCard';

export default function HomePage() {
  const router = useRouter();
  const { 
    profile, 
    missions, 
    completedMissionIds, 
    postBuildLog, 
    isOnboarded 
  } = useUserState();

  const [isLogOpen, setIsLogOpen] = useState(false);
  const [logContent, setLogContent] = useState('');

  // 1. Guard onboarding
  useEffect(() => {
    if (!isOnboarded || !profile) {
      router.push('/');
    }
  }, [isOnboarded, profile, router]);

  if (!profile) return null;

  // Determine starting/current daily mission for user
  const activeMission = missions.find(m => !completedMissionIds.includes(m.id)) || missions[0];

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logContent.trim()) return;

    postBuildLog(logContent.trim());
    setLogContent('');
    setIsLogOpen(false);
  };

  // Quick autofill suggestions for high speed logging
  const suggestions = [
    'Solved 2 Leetcode problems on Strings 💻',
    'Built beautiful glassmorphic navbar with Framer Motion 💎',
    'Learned SQL joins & indexed table schema 📊',
    'Deployed mobile responsive app layout on Vercel 🚀'
  ];

  // Dynamic Builder Journey statuses
  const journeySteps = [
    { label: 'Joined DevHub', done: true },
    { label: 'Created Builder Profile', done: true },
    { label: 'Complete First Mission', done: completedMissionIds.length > 0 },
    { label: 'Reach Level 3', done: profile.level >= 3 },
    { label: 'Deploy Project', done: completedMissionIds.includes('m2') || profile.logs.length >= 1 }
  ];

  return (
    <div className="flex-1 flex flex-col px-4 py-5 select-none relative z-10 gap-6 pb-20 text-left">
      
      {/* 1. WELCOME SECTION */}
      <div className="flex flex-col gap-1.5 bg-gradient-to-b from-white/5 to-transparent p-4 rounded-3xl border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-brand-xp/10 rounded-full blur-2xl pointer-events-none" />
        <span className="text-[9px] bg-brand-xp/10 text-brand-xp border border-brand-xp/25 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest self-start">
          Builder Space
        </span>
        <h2 className="text-xl font-black text-white tracking-tight mt-2.5">
          Welcome back, {profile.name}
        </h2>
        <div className="flex items-center gap-2 text-xs text-zinc-400 font-semibold mt-1">
          <span className="text-brand-cyber font-bold">{profile.builderTitle}</span>
          <span>•</span>
          <span className="text-brand-level font-black">Level {profile.level}</span>
        </div>
      </div>

      {/* 2. TODAY'S MISSION */}
      <div>
        <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-1.5 pl-1">
          <Terminal size={12} className="text-brand-cyber" /> Today&apos;s Challenger Mission
        </h3>
        <MissionCard mission={activeMission} />
      </div>

      {/* 3. BUILDER JOURNEY TIMELINE */}
      <div>
        <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-1.5 pl-1">
          <Award size={12} className="text-brand-level" /> Builder Journey
        </h3>
        <div className="glass-panel p-4 rounded-3xl border border-white/5 flex flex-col gap-4">
          <div className="relative pl-6 flex flex-col gap-4 border-l border-dashed border-zinc-700/60">
            {journeySteps.map((step, idx) => (
              <div key={idx} className="relative flex items-center gap-3">
                <span className={`absolute -left-[29.5px] w-4 h-4 rounded-full flex items-center justify-center border bg-[#08080c] transition-all duration-300 ${
                  step.done 
                    ? 'border-brand-xp text-brand-xp shadow-[0_0_8px_rgba(0,255,204,0.3)]' 
                    : 'border-zinc-700 text-zinc-600'
                }`}>
                  {step.done ? (
                    <CheckCircle2 size={10} className="stroke-[3px]" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                  )}
                </span>
                <span className={`text-xs font-semibold ${step.done ? 'text-zinc-200' : 'text-zinc-500'}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. PROGRESS OVERVIEW GRID */}
      <div>
        <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-1.5 pl-1">
          <Sparkles size={12} className="text-brand-xp" /> Progress Overview
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="glass-panel p-3.5 rounded-2xl border border-white/5 flex flex-col gap-1">
            <span className="text-[8px] uppercase font-bold text-zinc-500 tracking-wider">Current Level</span>
            <span className="text-base font-black text-white">LVL {profile.level}</span>
          </div>
          <div className="glass-panel p-3.5 rounded-2xl border border-white/5 flex flex-col gap-1">
            <span className="text-[8px] uppercase font-bold text-zinc-500 tracking-wider">Total XP</span>
            <span className="text-base font-black text-brand-xp">{profile.xp} XP</span>
          </div>
          <div className="glass-panel p-3.5 rounded-2xl border border-white/5 flex flex-col gap-1">
            <span className="text-[8px] uppercase font-bold text-zinc-500 tracking-wider">Current Streak</span>
            <span className="text-base font-black text-brand-streak">🔥 {profile.currentStreak} Days</span>
          </div>
          <div className="glass-panel p-3.5 rounded-2xl border border-white/5 flex flex-col gap-1">
            <span className="text-[8px] uppercase font-bold text-zinc-500 tracking-wider">Projects Completed</span>
            <span className="text-base font-black text-brand-cyber">{profile.logs.length} Updates</span>
          </div>
        </div>
      </div>

      {/* 5. QUICK ACTIONS */}
      <div>
        <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-1.5 pl-1">
          <Zap size={12} className="text-yellow-400 animate-pulse" /> Quick Actions
        </h3>
        <div className="flex flex-col gap-2">
          
          <button
            onClick={() => setIsLogOpen(true)}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-brand-xp via-emerald-400 to-brand-cyber text-black hover:shadow-[0_0_20px_rgba(0,255,204,0.3)] active:scale-98 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300"
          >
            <Plus size={16} className="stroke-[3px]" /> Add Build Log
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => router.push('/profile')}
              className="py-3 rounded-xl border border-white/8 hover:bg-white/5 text-white text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors duration-150"
            >
              <User size={12} /> View Profile
            </button>
            <button
              onClick={() => router.push('/opportunities')}
              className="py-3 rounded-xl border border-white/8 hover:bg-white/5 text-white text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors duration-150"
            >
              <Compass size={12} /> Explore moves
            </button>
          </div>

        </div>
      </div>

      {/* SLIDE-UP BUILD LOG INPUT DRAWER */}
      <AnimatePresence>
        {isLogOpen && (
          <div className="absolute inset-0 z-50 select-none">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLogOpen(false)}
              className="absolute inset-0 bg-black"
            />

            {/* Glass Drawer */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="absolute bottom-0 left-0 right-0 max-h-[90%] rounded-t-[35px] border-t border-white/15 bg-zinc-950/95 shadow-[0_-20px_60px_rgba(0,0,0,0.55)] p-6 flex flex-col gap-4 z-50 sm:rounded-b-[40px]"
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-brand-xp/10 border border-brand-xp/20 flex items-center justify-center text-brand-xp">
                    <Flame size={12} className="fill-brand-xp" />
                  </div>
                  <h3 className="text-sm font-black text-white uppercase tracking-tight">
                    Add Today&apos;s Build Log
                  </h3>
                </div>
                <button 
                  onClick={() => setIsLogOpen(false)}
                  className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white"
                >
                  <X size={14} />
                </button>
              </div>

              <form onSubmit={handleLogSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">
                    What did you build/ship today?
                  </label>
                  <textarea
                    rows={4}
                    value={logContent}
                    onChange={(e) => setLogContent(e.target.value)}
                    placeholder="e.g. Solved 2 Leetcode problems, built glassmorphic cards, worked on database integrations..."
                    maxLength={150}
                    required
                    className="w-full bg-black/45 border border-white/8 rounded-2xl p-4 text-xs text-white font-semibold placeholder-zinc-600 focus:outline-none focus:border-brand-xp focus:shadow-[0_0_12px_rgba(0,255,204,0.15)] transition-all duration-200 resize-none text-left"
                  />
                  <div className="text-right text-[9px] text-zinc-600 font-bold uppercase">
                    {logContent.length}/150 Characters
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-500 flex items-center gap-1">
                    <AlertCircle size={10} /> Quick autofill examples
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {suggestions.map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setLogContent(s)}
                        className="w-full text-left p-2 rounded-xl bg-white/5 border border-white/5 hover:border-white/8 text-[10px] font-semibold text-zinc-400 hover:text-white transition-colors duration-150"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!logContent.trim()}
                  className="w-full py-3 px-4 rounded-xl bg-brand-xp text-black disabled:opacity-40 disabled:pointer-events-none active:scale-95 text-xs font-black uppercase tracking-wider shadow-[0_4px_15px_rgba(0,255,204,0.2)] hover:shadow-[0_4px_20px_rgba(0,255,204,0.4)] transition-all duration-200 flex items-center justify-center gap-1.5"
                >
                  Post Log & Gain XP (+15 XP) <Sparkles size={13} className="fill-black" />
                </button>
              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
