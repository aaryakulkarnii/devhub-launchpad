'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flame, Zap, Plus, X, 
  Terminal, Sparkles, AlertCircle,
  CheckCircle2, Compass, User, Award, Play
} from 'lucide-react';
import { useUserState } from '../../context/UserStateContext';
import MissionCard from '../../components/MissionCard';
import HeatmapCalendar from '../../components/HeatmapCalendar';

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

  const [aiResponse, setAiResponse] = useState<{ recommendation: string; why: string; estimatedEffort: string; raw: string } | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiTyping, setAiTyping] = useState('');

  const loadMomentumAI = useCallback(async () => {
    if (!profile) return;

    setAiLoading(true);
    setAiError(null);

    try {
      const payload = {
        builderType: profile.focusArea || profile.builderTitle,
        streak: profile.currentStreak,
        consistency: profile.radar.consistency,
        logs: profile.logs.slice(-4).map((log) => log.content),
        projects: profile.timeline.slice(0,3).map((item) => item.title),
        proofOfWork: `Level ${profile.level}, ${profile.xp} XP, ${completedMissionIds.length} missions complete`,
        focusArea: profile.focusArea,
        currentMission: activeMission?.title,
        level: profile.level,
        xp: profile.xp
      };

      const response = await fetch('/api/momentum-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Momentum AI failed to load.');
      }

      setAiResponse(data);
      setAiTyping('');

      const text = data.recommendation || 'Focus your next build on proof of work.';
      let index = 0;
      const interval = window.setInterval(() => {
        index += 1;
        setAiTyping(text.slice(0, index));

        if (index >= text.length) {
          window.clearInterval(interval);
        }
      }, 20);
    } catch (error: any) {
      setAiError(error?.message || 'Unable to load Momentum AI guidance.');
    } finally {
      setAiLoading(false);
    }
  }, [profile, completedMissionIds, activeMission]);

  useEffect(() => {
    if (profile) {
      loadMomentumAI();
    }
  }, [profile, loadMomentumAI]);

  const hasStrongStreak = profile.currentStreak >= 7;
  const isAIFocused = profile.focusArea.toLowerCase().includes('ai');
  const hasOpenSourceFocus = profile.focusArea.toLowerCase().includes('web') || profile.focusArea.toLowerCase().includes('open source') || profile.focusArea.toLowerCase().includes('app');
  const recentLogsCount = profile.logs.length;

  const aiTips = [
    {
      id: 'ai-1',
      title: hasStrongStreak ? 'You’ve been consistent for 7 days' : 'Keep the momentum going',
      description: hasStrongStreak
        ? 'Now deploy your first project and make your progress visible in a live portfolio.'
        : 'Ship one more build log this week to strengthen your consistency streak.',
      highlight: hasStrongStreak ? 'Deploy your first project' : 'Log today',
    },
    {
      id: 'ai-2',
      title: isAIFocused ? 'Your AI skills are improving' : 'Your core skills are growing',
      description: isAIFocused
        ? 'Try contributing to open source or building an AI event project to turn learning into proof-of-work.'
        : 'A short open source contribution or hackathon entry will amplify your builder reputation.',
      highlight: isAIFocused ? 'Join an AI event' : 'Contribute to open source',
    },
    {
      id: 'ai-3',
      title: recentLogsCount >= 2 ? 'Your portfolio is forming' : 'Build more proof-of-work',
      description: recentLogsCount >= 2
        ? 'Select a strong project and deploy it with a short case note to showcase growth.'
        : 'Add one more shipped update to make your builder story feel concrete.',
      highlight: recentLogsCount >= 2 ? 'Deploy a project' : 'Ship another log',
    }
  ];

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

      {/* 3. MOMENTUM AI */}
      <div className="glass-panel p-5 rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.16),_transparent_44%),_rgba(8,10,16,0.8)] shadow-[0_0_40px_rgba(16,185,129,0.12)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.08),_transparent_35%)] pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-emerald-300 font-bold flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300 shadow-[0_0_16px_rgba(16,185,129,0.22)]">⚡</span>
              momentum ai
            </p>
            <h3 className="mt-3 text-lg sm:text-xl font-black text-white tracking-tight">
              Quiet mentor guidance for your next builder move.
            </h3>
          </div>
          <button
            type="button"
            onClick={loadMomentumAI}
            className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.35em] text-emerald-200 hover:bg-emerald-400/15 transition"
          >
            refresh guidance
          </button>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[1.7fr_1fr]">
          <div className="relative rounded-3xl border border-white/10 bg-black/60 p-5 shadow-[0_25px_80px_rgba(0,0,0,0.35)] overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-emerald-300 via-emerald-500 to-brand-cyber opacity-60 blur-xl" />
            <div className="relative z-10">
              <span className="text-[9px] uppercase tracking-[0.4em] text-zinc-500 font-bold">
                recommended next move
              </span>
              <div className="mt-3 min-h-[76px] text-sm leading-6 text-white font-semibold">
                {aiLoading ? (
                  <div className="space-y-3">
                    <div className="h-4 w-5/6 rounded-full bg-zinc-700/80 animate-pulse" />
                    <div className="h-4 w-4/6 rounded-full bg-zinc-700/80 animate-pulse" />
                    <div className="h-4 w-3/6 rounded-full bg-zinc-700/80 animate-pulse" />
                  </div>
                ) : aiError ? (
                  <p className="text-sm text-rose-300">{aiError}</p>
                ) : (
                  <p className="whitespace-pre-wrap text-sm leading-6 text-white">{aiTyping || aiResponse?.recommendation || 'Build a clear, shareable proof-of-work item this week.'}</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="rounded-3xl border border-white/10 bg-zinc-950/75 p-4">
              <span className="text-[9px] uppercase tracking-[0.35em] text-zinc-500 font-bold">
                why it matters
              </span>
              <p className="mt-3 text-sm leading-6 text-zinc-300">
                {aiLoading ? 'Analyzing your streak and proof of work…' : aiResponse?.why || 'This guidance keeps your work focused on momentum and visibility.'}
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-zinc-950/75 p-4">
              <span className="text-[9px] uppercase tracking-[0.35em] text-zinc-500 font-bold">
                estimated effort
              </span>
              <p className="mt-3 text-sm font-black text-white tracking-tight">
                {aiLoading ? 'loading' : aiResponse?.estimatedEffort || 'weekend sprint'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. BUILDER JOURNEY TIMELINE */}
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

      {/* 4. BUILDER CONSISTENCY */}
      <div>
        <HeatmapCalendar logs={profile.logs} streak={profile.currentStreak} />
      </div>

      {/* 5. PROGRESS OVERVIEW GRID */}
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
