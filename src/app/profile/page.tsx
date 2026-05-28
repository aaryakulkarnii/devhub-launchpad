'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Award, Shield, Calendar, Terminal,
  Sparkles, CheckCircle2, ChevronRight, Activity
} from 'lucide-react';
import { useUserState } from '../../context/UserStateContext';
import RadarChart from '../../components/RadarChart';
import DNAVisualizer from '../../components/DNAVisualizer';
import HeatmapCalendar from '../../components/HeatmapCalendar';

export default function ProfilePage() {
  const router = useRouter();
  const { profile, completedMissionIds, isOnboarded } = useUserState();

  const [activeTab, setActiveTab] = useState<'DNA' | 'Timeline' | 'Logs'>('DNA');

  // 1. Guard onboarding
  useEffect(() => {
    if (!isOnboarded || !profile) {
      router.push('/');
    }
  }, [isOnboarded, profile, router]);

  if (!profile) return null;

  return (
    <div className="flex-1 flex flex-col px-4 py-5 select-none relative z-10 gap-5 pb-20">
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-brand-border mb-1 select-none">
        <button
          onClick={() => router.push('/home')}
          className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 py-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider transition-colors duration-150"
        >
          ← Back
        </button>
        <span className="text-[9px] bg-brand-level/10 text-brand-level border border-brand-level/20 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest">
          Builder Identity
        </span>
      </div>

      {/* 1. Shareable Builder Card Header */}
      <div className="glass-panel p-5 rounded-3xl border border-brand-border relative overflow-hidden flex flex-col items-center gap-3 bg-gradient-to-b from-zinc-50 dark:from-white/5 to-transparent">

        {/* Glowing badge background */}
        <div className="absolute top-0 w-32 h-32 bg-brand-level/10 rounded-full blur-2xl" />

        {/* DiceBear Avatar wrapped in Level Core Ring */}
        <div className="w-16 h-16 rounded-full border-2 border-brand-level p-1 bg-zinc-100 dark:bg-black relative z-10 shadow-[0_0_15px_rgba(157,78,221,0.3)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={profile.photoUrl}
            alt="avatar"
            className="w-full h-full rounded-full object-cover"
          />
        </div>

        {/* Identity Headings */}
        <div className="text-center relative z-10">
          <h2 className="text-lg font-black text-zinc-900 dark:text-white tracking-tight">
            {profile.name}
          </h2>
          <p className="text-xs text-brand-level font-black uppercase tracking-wide mt-1">
            {profile.builderTitle}
          </p>
          <span className="text-[9px] bg-zinc-100 dark:bg-white/5 border border-brand-border text-zinc-550 dark:text-zinc-400 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider mt-2.5 inline-block">
            {profile.currentStage}
          </span>
        </div>

        {/* XP Ledger Info */}
        <div className="w-full grid grid-cols-3 gap-2 mt-2 pt-3 border-t border-brand-border text-center relative z-10">
          <div>
            <span className="text-[8px] uppercase font-bold text-zinc-500 dark:text-zinc-400 tracking-wider">Level</span>
            <span className="text-sm font-black text-zinc-900 dark:text-white block mt-0.5">{profile.level}</span>
          </div>
          <div className="border-l border-r border-brand-border">
            <span className="text-[8px] uppercase font-bold text-zinc-500 dark:text-zinc-400 tracking-wider">Total XP</span>
            <span className="text-sm font-black text-brand-xp block mt-0.5">{profile.xp}</span>
          </div>
          <div>
            <span className="text-[8px] uppercase font-bold text-zinc-500 dark:text-zinc-400 tracking-wider">Streak</span>
            <span className="text-sm font-black text-brand-streak block mt-0.5">🔥 {profile.currentStreak}d</span>
          </div>
        </div>

      </div>

      {/* 2. Community invite */}
      <div className="glass-panel rounded-3xl border border-brand-border bg-white dark:bg-white/5 p-4 text-left relative z-10">
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-450">Builder community</p>
            <h2 className="text-base font-black text-zinc-900 dark:text-white mt-2">Join the DevHub builder community</h2>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Connect with other builders, discover hackathons, projects, and opportunities in one place.
          </p>
          <a
            href="https://chat.whatsapp.com/FzBACCacUxiLciCcs0KlEz"
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-fit rounded-2xl bg-brand-xp/10 border border-brand-xp/20 px-4 py-3 text-sm font-semibold text-brand-xp transition hover:bg-brand-xp/15"
          >
            Join community
          </a>
        </div>
      </div>

      {/* 3. Horizontal navigation tab capsules */}
      <div className="grid grid-cols-3 bg-zinc-100 dark:bg-black/45 border border-brand-border p-1 rounded-2xl relative z-10 select-none">
        {(['DNA', 'Timeline', 'Logs'] as const).map((tab) => {
          const isSelected = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-200 ${isSelected
                  ? 'bg-white dark:bg-white/10 text-zinc-900 dark:text-white shadow-inner font-extrabold border border-brand-border'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 font-medium'
                }`}
            >
              {tab === 'DNA' ? 'DNA & Radar' : tab === 'Timeline' ? 'Timeline' : 'Build Logs'}
            </button>
          );
        })}
      </div>

      {/* 3. Tab contents displays */}
      <div className="flex-1 flex flex-col relative z-10">

        {/* TAB A: DNA & RADAR VISUALIZER */}
        {activeTab === 'DNA' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-5"
          >
            {/* DNA Orb Badge */}
            <div className="glass-panel rounded-3xl p-4 border border-brand-border flex flex-col items-center">
              <DNAVisualizer dna={profile.dna} />
            </div>

            {/* Radar metrics chart */}
            <div className="glass-panel rounded-3xl p-4 border border-brand-border flex flex-col items-center">
              <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest self-start pl-2 mb-2 flex items-center gap-1.5">
                <Activity size={12} className="text-brand-cyber animate-pulse" /> Skill Radar Profile
              </h3>
              <RadarChart metrics={profile.radar} />
            </div>
          </motion.div>
        )}

        {/* TAB B: GROWTH VERTICAL TIMELINE */}
        {activeTab === 'Timeline' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4 pl-3"
          >
            <div className="relative border-l border-dashed border-brand-border flex flex-col gap-6 pl-5 py-2 select-none text-left">
              {profile.timeline.map((milestone, idx) => (
                <div key={idx} className="relative">
                  {/* Glowing vertical node */}
                  <span className="absolute -left-[27px] top-0.5 w-3 h-3 rounded-full bg-brand-level border-2 border-zinc-150 dark:border-black shadow-[0_0_8px_#9d4edd] animate-pulse" />

                  <div>
                    <span className="text-[8px] uppercase font-black tracking-widest text-zinc-500">
                      Day {milestone.dayNumber} milestone
                    </span>
                    <h4 className="text-xs font-black text-zinc-900 dark:text-white mt-0.5">
                      {milestone.title}
                    </h4>
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium mt-1 leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* TAB C: SHIPPED DAILY BUILD LOGS */}
        {activeTab === 'Logs' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-3"
          >
            <div className="glass-panel rounded-3xl border border-brand-border bg-white dark:bg-black/30 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-550 dark:text-zinc-500 font-bold">Proof Of Work</p>
                  <h3 className="text-sm font-black text-zinc-900 dark:text-white tracking-tight mt-2">Builder Consistency</h3>
                </div>
                <div className="text-[10px] uppercase tracking-[0.24em] text-brand-xp font-black">Consistency creates growth</div>
              </div>
              <div className="mt-4">
                <HeatmapCalendar logs={profile.logs} streak={profile.currentStreak} />
              </div>
            </div>

            {profile.logs.length === 0 ? (
              /* Beautiful active empty state encouraging them to ship! */
              <div className="glass-panel p-6 rounded-3xl border border-brand-border text-center flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-xp/10 border border-brand-xp/20 flex items-center justify-center text-brand-xp shadow-neon-xp">
                  <Terminal size={18} className="animate-bounce" />
                </div>
                <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                  No Proof-of-Work Logs Shipped
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed px-4">
                  Commit your first daily log from the <b>Home</b> tab to activate your streak fires and claim starting XP!
                </p>
                <button
                  onClick={() => router.push('/home')}
                  className="px-5 py-2.5 rounded-xl bg-zinc-100 dark:bg-white/5 border border-brand-border hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-800 dark:text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors duration-150"
                >
                  Post Logs <ChevronRight size={12} />
                </button>
              </div>
            ) : (
              profile.logs.map((log) => (
                <div key={log.id} className="glass-panel p-4 rounded-2xl border border-brand-border flex flex-col gap-2 select-none text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] bg-brand-xp/10 text-brand-xp border border-brand-xp/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">
                      Daily Shipped Log
                    </span>
                    <span className="text-[9px] text-zinc-500 font-bold uppercase">
                      {log.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-800 dark:text-zinc-200 font-semibold leading-relaxed mt-1">
                    {log.content}
                  </p>

                  <div className="flex items-center gap-2 border-t border-brand-border pt-2.5 mt-1 text-[9px] text-zinc-500 dark:text-zinc-450 font-bold uppercase tracking-wider">
                    <span>🔥 Streak Multiplier Locked</span>
                    <span>•</span>
                    <span>+15 XP Earned</span>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}

      </div>

    </div>
  );
}
