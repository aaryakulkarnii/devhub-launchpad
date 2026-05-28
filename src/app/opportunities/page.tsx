'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass, Zap, Award, Sparkles,
  Terminal, ShieldCheck, ExternalLink, Filter, Users
} from 'lucide-react';
import { useUserState } from '../../context/UserStateContext';
import { Opportunity } from '../../lib/dummy-data';

export default function OpportunitiesPage() {
  const router = useRouter();
  const { profile, opportunities, joinOpportunity, isOnboarded, teammates } = useUserState();

  const [activeTab, setActiveTab] = useState<'All' | 'Hackathon' | 'Internship' | 'Open Source' | 'AI Challenge'>('All');
  const [acceptedId, setAcceptedId] = useState<string | null>(null);

  // 1. Onboarding Guard
  useEffect(() => {
    if (!isOnboarded || !profile) {
      router.push('/');
    }
  }, [isOnboarded, profile, router]);

  if (!profile) return null;

  // Personalized matching logic based on focus area & tech stack
  const getMatchScore = (opp: Opportunity) => {
    const focus = profile.focusArea.toLowerCase();
    const tags = opp.tags.map(t => t.toLowerCase());
    const userStack = (profile.techStack || []).map(t => t.toLowerCase());

    let matchCount = 0;
    tags.forEach(t => {
      if (userStack.includes(t)) matchCount++;
    });

    let score = 50 + matchCount * 10;
    let label = 'Skill Expand Move';
    let reason = 'Allows you to expand your developer stack into adjacent libraries.';
    let suggestedTeammate = teammates[2]; // Default to Ananya

    if (focus.includes('ai') && (opp.type === 'AI Challenge' || tags.includes('ai') || tags.includes('gemini api'))) {
      score = 98;
      label = 'Dominant Match';
      reason = 'Perfect alignment with your AI Builder goals & LLM agents focus.';
      suggestedTeammate = teammates[0]; // Aarav Gupta
    } else if (focus.includes('web') && (opp.type === 'Internship' || tags.includes('next.js') || tags.includes('react'))) {
      score = 95;
      label = 'Perfect UI Fit';
      reason = 'Matches your frontend expertise in building responsive, high-performance UIs.';
      suggestedTeammate = teammates[1]; // Rohan Sharma
    } else if (opp.type === 'Open Source') {
      score = 90;
      label = 'OS Contributor';
      reason = 'Build public proof-of-work and gain global developer reputation.';
      suggestedTeammate = teammates[1]; // Rohan Sharma
    } else if (opp.type === 'Hackathon') {
      score = 88;
      label = 'High-Momentum Challenge';
      reason = 'Rapid ship cycle. Great opportunity to collaborate with AI architects.';
      suggestedTeammate = teammates[0]; // Aarav Gupta
    }

    return {
      score: Math.min(100, score),
      label,
      reason,
      teammate: suggestedTeammate
    };
  };

  const handleAcceptOpportunity = (oppId: string) => {
    joinOpportunity(oppId);
    setAcceptedId(oppId);

    // Clear check alert after 2 seconds
    setTimeout(() => {
      setAcceptedId(null);
    }, 2000);
  };

  // Filtering opportunities
  const filteredOpps = opportunities.filter(opp => {
    if (activeTab === 'All') return true;
    return opp.type === activeTab;
  });

  // Sort by highest match score
  const sortedOpps = [...filteredOpps].sort((a, b) => getMatchScore(b).score - getMatchScore(a).score);

  const tabs: ('All' | 'Hackathon' | 'Internship' | 'Open Source' | 'AI Challenge')[] = [
    'All', 'Hackathon', 'Internship', 'Open Source', 'AI Challenge'
  ];

  return (
    <div className="flex-1 flex flex-col px-4 py-5 select-none relative z-10 gap-5 pb-20 max-w-5xl mx-auto w-full">

      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-brand-border mb-1 select-none">
        <button
          onClick={() => router.push('/home')}
          className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 py-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider transition-colors duration-150"
        >
          ← Dashboard
        </button>
        <span className="text-[9px] bg-brand-cyber/10 text-brand-cyber border border-brand-cyber/20 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest">
          Curated Opportunities
        </span>
      </div>

      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight mt-3">
          AI-Matched Builder Gigs & Challenges
        </h1>
        <p className="text-xs text-zinc-550 dark:text-zinc-400 mt-1 font-medium leading-relaxed">
          Dynamic matches based on your tech stack, goals, and focus areas.
        </p>
      </div>

      {/* Horizontal filter capsules */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 shrink-0 -mx-4 px-4 select-none scrollbar-none">
        {tabs.map((tab) => {
          const isSelected = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full border text-[9px] font-black uppercase tracking-wider transition-all duration-200 shrink-0 ${isSelected
                  ? 'bg-brand-cyber text-white border-brand-cyber shadow-[0_0_10px_rgba(0,114,255,0.3)]'
                  : 'bg-white dark:bg-zinc-900/30 border-brand-border text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Cards list grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedOpps.map((opp) => {
          const match = getMatchScore(opp);
          const isAccepting = acceptedId === opp.id;

          return (
            <motion.div
              key={opp.id}
              layout
              className="glass-panel rounded-3xl p-5 border border-brand-border bg-white dark:bg-zinc-900/10 hover:border-zinc-350 dark:hover:border-white/10 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
            >
              <div>
                {/* Match Fit Score */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[9px] bg-zinc-100 dark:bg-zinc-800/40 border border-brand-border text-zinc-550 dark:text-zinc-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    {opp.type}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black text-brand-cyber uppercase tracking-wider">
                      {match.score}% Fit
                    </span>
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-cyber animate-pulse" />
                  </div>
                </div>

                <h3 className="text-base font-black text-zinc-900 dark:text-white tracking-tight mt-3 leading-snug">
                  {opp.title}
                </h3>

                <span className="text-[10px] text-zinc-500 dark:text-zinc-450 font-bold uppercase tracking-wider">
                  by {opp.organizer}
                </span>

                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-3 leading-relaxed">
                  {opp.description}
                </p>

                {/* AI Rationale Tip */}
                <div className="mt-3 p-3 rounded-xl border border-brand-cyber/10 bg-brand-cyber/5 text-[11px] text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed">
                  💡 <b>AI Recommendation:</b> {match.reason}
                </div>

                {/* Suggested Teammate */}
                {match.teammate && (
                  <div className="mt-3 p-2.5 rounded-xl border border-brand-border bg-zinc-50 dark:bg-black/35 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users size={12} className="text-brand-level" />
                      <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400">Suggested Partner:</span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={match.teammate.avatar} alt="avatar" className="w-4 h-4 rounded-full border border-brand-border" />
                      <span className="text-[10px] font-black text-zinc-850 dark:text-white">{match.teammate.name}</span>
                    </div>
                    <span className="text-[8px] bg-brand-level/10 text-brand-level border border-brand-level/20 px-1.5 py-0.5 rounded font-bold uppercase">
                      {match.teammate.role}
                    </span>
                  </div>
                )}

                {/* Tag Capsules */}
                <div className="flex items-center gap-1.5 flex-wrap mt-3.5">
                  {opp.tags.map((tag) => (
                    <span key={tag} className="text-[9px] bg-zinc-50 dark:bg-black/45 border border-brand-border text-zinc-550 dark:text-zinc-500 px-2 py-0.5 rounded-md font-bold uppercase tracking-wide">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                {/* Reward Highlights */}
                <div className="mt-4 bg-zinc-50 dark:bg-black/35 border border-brand-border rounded-2xl p-3.5 flex items-center justify-between">
                  <div>
                    <span className="text-[8px] uppercase font-bold text-zinc-500 dark:text-zinc-450 tracking-wider">Stipend / Prize Pool</span>
                    <span className="text-xs font-black text-zinc-850 dark:text-white block mt-0.5">{opp.rewardDetails}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] uppercase font-bold text-zinc-500 dark:text-zinc-450 tracking-wider">XP Reward</span>
                    <span className="text-xs font-black text-brand-xp block mt-0.5">+{opp.rewardXp} XP</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <a
                    href={opp.actionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 rounded-xl border border-brand-border hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-700 dark:text-white text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors duration-150 select-none"
                  >
                    Details <ExternalLink size={10} />
                  </a>

                  <button
                    onClick={() => handleAcceptOpportunity(opp.id)}
                    disabled={isAccepting}
                    className={`py-2.5 rounded-xl text-black text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-200 select-none ${isAccepting
                        ? 'bg-brand-xp border border-brand-xp/30'
                        : 'bg-brand-cyber hover:shadow-[0_0_12px_rgba(0,114,255,0.25)] active:scale-95 text-white'
                      }`}
                  >
                    {isAccepting ? (
                      <>
                        Accepted <ShieldCheck size={12} className="stroke-[3px] text-black" />
                      </>
                    ) : (
                      <>
                        Accept Move <Zap size={11} className="fill-white" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Interactive Slide overlay for accepted status */}
              <AnimatePresence>
                {isAccepting && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-white/95 dark:bg-[#08080c]/98 backdrop-blur-sm flex flex-col items-center justify-center gap-2 p-5 text-center"
                  >
                    <div className="w-10 h-10 rounded-full bg-brand-xp/10 border border-brand-xp/30 flex items-center justify-center text-brand-xp animate-bounce shadow-neon-xp">
                      <ShieldCheck size={20} className="stroke-[2.5]" />
                    </div>
                    <h4 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                      Momentum Triggered!
                    </h4>
                    <p className="text-[9px] text-zinc-650 dark:text-zinc-400 font-medium max-w-[220px]">
                      Added milestone to your growth timeline and awarded you <b>+{Math.floor(opp.rewardXp / 2)} XP</b> starting acceleration!
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
}
