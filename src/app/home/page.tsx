'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Flame, Zap, Trophy, ExternalLink, Calendar, Bell, Search, Award, CheckSquare, Square, ChevronRight, Users, Sparkles, AlertTriangle, ShieldCheck, ArrowRight
} from 'lucide-react';
import { useUserState } from '../../context/UserStateContext';
import { MOCK_LEADERBOARD } from '../../lib/dummy-data';
import { getAIRecommendations, getInterviewInsights } from '../../lib/momentum-ai';
import ResumeIntelligence from '../../components/ResumeIntelligence';

export default function HomePage() {
  const router = useRouter();
  const { 
    profile, 
    isOnboarded,
    opportunities,
    awardXpAction,
    dailyGoals,
    toggleDailyGoal
  } = useUserState();

  // Guard onboarding
  useEffect(() => {
    if (!isOnboarded || !profile) {
      router.push('/');
    }
  }, [isOnboarded, profile, router]);

  if (!profile) return null;

  const interview = getInterviewInsights(profile);
  const recommendations = getAIRecommendations(profile);



  // Mock Activity summary for other builders
  const recentActivity = [
    { name: 'Rohan Sharma', text: 'shipped "Build Timeline" component', time: '5m ago', icon: '🚀' },
    { name: 'Ananya Sharma', text: 'solved "3-Sum" coding challenge', time: '12m ago', icon: '🏆' },
    { name: 'Vivek Singh', text: 'joined Razerpay Labs hackathon team', time: '1h ago', icon: '⚡' }
  ];

  return (
    <div className="flex-1 flex flex-col px-1 py-1 gap-6 pb-20 text-left w-full transition-all duration-300">
      
      {/* GREETING STATUS */}

      {/* GREETING STATUS */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex flex-col text-left">
          <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
            Welcome back, {profile.name}! 👋
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold mt-1">
            Here is your builder workspace overview for today.
          </p>
        </div>

        {/* Streak floating */}
        <div className="flex items-center gap-2 bg-zinc-100/50 dark:bg-zinc-900/30 border border-brand-border px-3.5 py-1.5 rounded-2xl shadow-glass font-extrabold text-xs text-brand-streak animate-bounce">
          <Flame size={14} className="fill-current animate-pulse" />
          <span>{profile.currentStreak} Day Streak</span>
        </div>
      </div>

      {/* QUICK STATS ROW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
        <div className="glass-panel p-4 rounded-2xl border border-brand-border bg-white dark:bg-zinc-900/10 flex flex-col gap-1">
          <span className="text-[9px] text-zinc-450 dark:text-zinc-500 font-black uppercase tracking-wider">Level</span>
          <span className="text-xl font-black text-zinc-850 dark:text-white mt-1">{profile.level}</span>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-brand-border bg-white dark:bg-zinc-900/10 flex flex-col gap-1">
          <span className="text-[9px] text-zinc-450 dark:text-zinc-500 font-black uppercase tracking-wider">Total Experience</span>
          <span className="text-xl font-black text-brand-xp mt-1">{profile.xp} XP</span>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-brand-border bg-white dark:bg-zinc-900/10 flex flex-col gap-1">
          <span className="text-[9px] text-zinc-450 dark:text-zinc-500 font-black uppercase tracking-wider">Problems Solved</span>
          <span className="text-xl font-black text-brand-cyber mt-1">37</span>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-brand-border bg-white dark:bg-zinc-900/10 flex flex-col gap-1">
          <span className="text-[9px] text-zinc-450 dark:text-zinc-500 font-black uppercase tracking-wider">Projects Shipped</span>
          <span className="text-xl font-black text-brand-level mt-1">4</span>
        </div>
      </div>

      {/* MAIN TWO-COLUMN DASHBOARD CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Goals, AI recommendations, and Resume Intelligence */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* AI Mentor Recommendations Panel */}
          <div className="glass-panel p-5 rounded-3xl border border-brand-border bg-white dark:bg-zinc-900/10">
            <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-4 flex items-center gap-2">
              <Sparkles size={16} className="text-brand-xp animate-pulse" /> Momentum AI Mentor Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {recommendations.map((rec) => (
                <div 
                  key={rec.id} 
                  onClick={() => router.push(`/${rec.actionType}`)}
                  className="flex flex-col justify-between p-3.5 rounded-2xl border border-brand-border bg-zinc-50 dark:bg-black/35 hover:border-zinc-350 dark:hover:border-white/10 transition-colors cursor-pointer text-left"
                >
                  <div>
                    <span className="text-[8px] bg-brand-cyber/15 text-brand-cyber px-2 py-0.5 rounded font-black uppercase tracking-wider">
                      {rec.highlight}
                    </span>
                    <h4 className="text-xs font-black text-zinc-800 dark:text-white tracking-tight mt-2">
                      {rec.title}
                    </h4>
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed mt-1">
                      {rec.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-t border-brand-border/60 pt-2.5 mt-3 text-[9px] text-brand-xp font-black uppercase">
                    <span>Explore Action</span>
                    <span>+{rec.xpReward} XP</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Goals Checklist */}
          <div className="glass-panel p-5 rounded-3xl border border-brand-border bg-white dark:bg-zinc-900/10">
            <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-4 flex items-center gap-2">
              <CheckSquare size={16} className="text-brand-cyber" /> Daily Momentum Goals
            </h3>
            <div className="flex flex-col gap-3">
              {dailyGoals.map(goal => (
                <div 
                  key={goal.id} 
                  onClick={() => toggleDailyGoal(goal.id)}
                  className="flex items-center gap-3 p-3 rounded-xl border border-brand-border bg-zinc-50/50 dark:bg-black/10 hover:bg-zinc-100 dark:hover:bg-black/25 cursor-pointer transition-colors"
                >
                  {goal.done ? (
                    <Trophy size={16} className="text-amber-500 shrink-0" />
                  ) : (
                    <Square size={16} className="text-zinc-400 shrink-0" />
                  )}
                  <span className={`text-xs font-semibold ${goal.done ? 'line-through text-zinc-400 dark:text-zinc-650' : 'text-zinc-700 dark:text-zinc-300'}`}>
                    {goal.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Resume Intelligence ATS reviewer */}
          <ResumeIntelligence />

          {/* AI Match Recommendations preview */}
          <div className="glass-panel p-5 rounded-3xl border border-brand-border bg-white dark:bg-zinc-900/10">
            <div className="flex items-center justify-between pb-3 border-b border-brand-border mb-4">
              <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                <Sparkles size={15} className="text-brand-cyber animate-pulse" /> AI Matches For You
              </h3>
              <button 
                onClick={() => router.push('/opportunities')}
                className="text-[9px] font-black text-brand-xp uppercase tracking-wider hover:opacity-85"
              >
                View matches
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {opportunities.slice(0, 2).map((opp) => (
                <div key={opp.id} className="flex items-center justify-between gap-3 p-3.5 rounded-2xl border border-brand-border bg-zinc-50 dark:bg-black/35 shadow-glass">
                  <div className="flex flex-col gap-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-zinc-800 dark:text-white leading-tight">{opp.title}</span>
                      <span className="text-[8px] uppercase font-bold text-zinc-450 dark:text-zinc-500 tracking-wider">by {opp.organizer}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      {opp.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[9px] bg-zinc-150 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 px-1.5 py-0.5 rounded font-semibold">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-right shrink-0">
                    <span className="text-[10px] font-black text-brand-cyber">AI Recommendation</span>
                    <ChevronRight size={14} className="text-zinc-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Leaderboard & Ecosystem Feed */}
        <div className="flex flex-col gap-6">
          
          {/* Interview Intelligence Widget */}
          <div className="glass-panel p-5 rounded-3xl border border-brand-border bg-white dark:bg-zinc-900/10">
            <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-4 flex items-center gap-2">
              <Zap size={15} className="text-brand-level" /> Interview Intelligence
            </h3>
            
            <div className="flex flex-col gap-4 text-left">
              <div className="flex items-center justify-between gap-3 bg-zinc-50 dark:bg-black/25 p-3 rounded-2xl border border-brand-border">
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase font-bold text-zinc-500">Readiness Score</span>
                  <span className="text-xl font-black text-brand-level mt-0.5">{interview.readinessScore}%</span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-[9px] uppercase font-bold text-zinc-500">Confidence</span>
                  <span className="text-[10px] font-black uppercase text-brand-cyber mt-0.5">{interview.confidence}</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 p-3 bg-brand-xp/5 rounded-2xl border border-brand-xp/10">
                <span className="text-[9px] font-black uppercase text-brand-xp tracking-wider">Top Company Fit</span>
                <span className="text-xs font-black text-zinc-800 dark:text-white leading-tight">{interview.companyFit}</span>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed mt-0.5">{interview.fitReason}</p>
              </div>

              {interview.missingSkills.length > 0 && (
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-black uppercase text-zinc-450 dark:text-zinc-400 tracking-wider">Missing core skills</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {interview.missingSkills.map(skill => (
                      <span key={skill} className="text-[8px] bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded font-black uppercase">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2 border-t border-brand-border pt-3.5">
                <span className="text-[9px] font-black uppercase text-zinc-450 dark:text-zinc-400 tracking-wider">Preparation Tips</span>
                {interview.suggestions.map((sug, i) => (
                  <div key={i} className="flex items-start gap-2 text-[10px] text-zinc-650 dark:text-zinc-300 font-medium leading-relaxed">
                    <ShieldCheck size={12} className="text-brand-level shrink-0 mt-0.5" />
                    <span>{sug}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => router.push('/resume-intelligence')}
                className="w-full mt-2.5 py-2.5 rounded-xl border border-brand-border hover:bg-zinc-50 dark:hover:bg-white/5 text-[9px] font-black uppercase tracking-wider text-zinc-600 dark:text-zinc-300 transition-colors flex items-center justify-center gap-1.5"
              >
                Analyze Target Fits <ArrowRight size={11} />
              </button>
            </div>
          </div>

          {/* Weekly Leaderboard mini preview */}
          <div className="glass-panel p-5 rounded-3xl border border-brand-border bg-white dark:bg-zinc-900/10">
            <div className="flex items-center justify-between pb-3 border-b border-brand-border mb-4">
              <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                <Award size={15} className="text-brand-level" /> Top Builders This Week
              </h3>
              <button 
                onClick={() => router.push('/people')}
                className="text-[9px] font-black text-brand-xp uppercase tracking-wider hover:opacity-85"
              >
                View board
              </button>
            </div>
            
            <div className="flex flex-col gap-3">
              {MOCK_LEADERBOARD.slice(0, 3).map((u, i) => (
                <div key={u.name} className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 dark:bg-black/20 border border-brand-border">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-black font-mono text-zinc-400">#{i + 1}</span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={u.avatar} alt="avatar" className="w-6 h-6 rounded-full border border-brand-border bg-zinc-100" />
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-black text-zinc-800 dark:text-white">{u.name}</span>
                      <span className="text-[9px] text-zinc-450 dark:text-zinc-500 font-bold">{u.xp} XP</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-brand-streak font-black">🔥 {u.streak}d</span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed summary */}
          <div className="glass-panel p-5 rounded-3xl border border-brand-border bg-white dark:bg-zinc-900/10">
            <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-4 flex items-center gap-2">
              <Users size={15} className="text-zinc-500" /> Ecosystem Activity
            </h3>
            <div className="flex flex-col gap-3.5">
              {recentActivity.map((act, i) => (
                <div key={i} className="flex items-start gap-2.5 text-left text-xs">
                  <span className="text-sm select-none">{act.icon}</span>
                  <div className="flex flex-col">
                    <p className="text-[11px] text-zinc-700 dark:text-zinc-300 font-semibold leading-snug">
                      <span className="font-black text-zinc-900 dark:text-white">{act.name}</span> {act.text}
                    </p>
                    <span className="text-[8px] text-zinc-450 dark:text-zinc-550 font-bold mt-0.5">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
