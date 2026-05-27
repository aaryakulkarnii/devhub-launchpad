'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, Zap, Award, Sparkles, 
  Terminal, ShieldCheck, ExternalLink, Filter 
} from 'lucide-react';
import { useUserState } from '../../context/UserStateContext';
import { Opportunity } from '../../lib/dummy-data';

export default function OpportunitiesPage() {
  const router = useRouter();
  const { profile, opportunities, joinOpportunity, isOnboarded } = useUserState();

  const [activeTab, setActiveTab] = useState<'All' | 'Hackathon' | 'Internship' | 'Open Source' | 'AI Challenge'>('All');
  const [acceptedId, setAcceptedId] = useState<string | null>(null);

  // 1. Onboarding Guard
  useEffect(() => {
    if (!isOnboarded || !profile) {
      router.push('/');
    }
  }, [isOnboarded, profile, router]);

  if (!profile) return null;

  // Personalized matching logic based on focus area
  const getMatchScore = (opp: Opportunity) => {
    const focus = profile.focusArea.toLowerCase();
    const tags = opp.tags.map(t => t.toLowerCase());

    if (focus.includes('ai') && (opp.type === 'AI Challenge' || tags.includes('ai') || tags.includes('gemini'))) {
      return { score: 100, label: 'Dominant Match' };
    }
    if (focus.includes('web') && (opp.type === 'Internship' || tags.includes('next.js') || tags.includes('react') || tags.includes('tailwind'))) {
      return { score: 95, label: 'Perfect UI Fit' };
    }
    if (focus.includes('app') && (tags.includes('mobile') || tags.includes('viewport') || tags.includes('framer motion'))) {
      return { score: 90, label: 'Mobile Architect' };
    }
    if (focus.includes('open source') && (opp.type === 'Open Source' || tags.includes('github'))) {
      return { score: 95, label: 'OS Contributor' };
    }
    if (focus.includes('security') && (tags.includes('solidity') || tags.includes('secure') || opp.type === 'Hackathon')) {
      return { score: 85, label: 'Cyber Analyst' };
    }

    return { score: 50, label: 'Skill Expand Move' };
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

  // Sort by highest match score to prioritize matches first!
  const sortedOpps = [...filteredOpps].sort((a, b) => getMatchScore(b).score - getMatchScore(a).score);

  const tabs: ('All' | 'Hackathon' | 'Internship' | 'Open Source' | 'AI Challenge')[] = [
    'All', 'Hackathon', 'Internship', 'Open Source', 'AI Challenge'
  ];

  return (
    <div className="flex-1 flex flex-col px-4 py-5 select-none relative z-10 gap-5 pb-20">
      
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-white/5 mb-1 select-none">
        <button 
          onClick={() => router.push('/home')} 
          className="text-zinc-500 hover:text-zinc-300 py-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider transition-colors duration-150"
        >
          ← Back
        </button>
        <span className="text-[9px] bg-brand-cyber/10 text-brand-cyber border border-brand-cyber/20 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest">
          Recommended Moves
        </span>
      </div>

      {/* Page Header */}
      <div>
        <h1 className="text-xl font-black text-white tracking-tight mt-3">
          Rocket Growth Challenges
        </h1>
        <p className="text-xs text-zinc-400 mt-1 font-medium leading-relaxed">
          No generic job listings. Only curated, high-momentum moves to establish your proof-of-work.
        </p>
      </div>

      {/* Horizontal filter capsules */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none shrink-0 -mx-4 px-4 select-none">
        {tabs.map((tab) => {
          const isSelected = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-wider transition-all duration-200 shrink-0 ${
                isSelected
                  ? 'bg-brand-cyber text-white border-brand-cyber shadow-[0_0_10px_rgba(0,114,255,0.3)]'
                  : 'bg-white/5 border-white/5 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Cards list */}
      <div className="flex flex-col gap-4">
        {sortedOpps.map((opp) => {
          const match = getMatchScore(opp);
          const isMatchedFit = match.score >= 85;
          const isAccepting = acceptedId === opp.id;

          return (
            <motion.div
              key={opp.id}
              layout
              className={`glass-panel rounded-3xl p-5 border relative overflow-hidden transition-all duration-300 ${
                isMatchedFit 
                  ? 'border-brand-cyber/30 bg-gradient-to-br from-brand-cyber/5 via-[#12121a]/60 to-[#12121a]/60 shadow-[0_0_20px_rgba(0,114,255,0.06)]' 
                  : 'border-white/5 hover:border-white/10'
              }`}
            >
              
              {/* Match Fit Tag Floating */}
              {isMatchedFit && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-brand-cyber/30 to-transparent text-brand-cyber text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-bl-xl border-l border-b border-brand-cyber/20">
                  ⚡ {match.label}
                </div>
              )}

              {/* Card Meta */}
              <div className="flex flex-col items-start gap-1">
                <span className="text-[9px] bg-white/5 border border-white/8 text-zinc-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  {opp.type}
                </span>

                <h3 className="text-base font-black text-white tracking-tight mt-2.5 leading-snug">
                  {opp.title}
                </h3>
                
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                  by {opp.organizer}
                </span>
              </div>

              <p className="text-xs text-zinc-400 font-medium mt-2 leading-relaxed">
                {opp.description}
              </p>

              {/* Tag Capsules */}
              <div className="flex items-center gap-1.5 flex-wrap mt-3">
                {opp.tags.map((tag) => (
                  <span key={tag} className="text-[8px] bg-black/40 border border-white/5 text-zinc-500 px-2 py-0.5 rounded-md font-bold uppercase tracking-wide">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Reward Highlights */}
              <div className="mt-4 bg-black/35 border border-white/5 rounded-2xl p-3 flex items-center justify-between">
                <div>
                  <span className="text-[8px] uppercase font-bold text-zinc-500 tracking-wider">stipend / award pool</span>
                  <span className="text-xs font-black text-white block mt-0.5">{opp.rewardDetails}</span>
                </div>
                <div className="text-right">
                  <span className="text-[8px] uppercase font-bold text-zinc-500 tracking-wider">Reward Points</span>
                  <span className="text-xs font-black text-brand-xp block mt-0.5">+{opp.rewardXp} XP</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                
                <a
                  href={opp.actionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-white text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors duration-150 select-none"
                >
                  Details <ExternalLink size={10} />
                </a>

                <button
                  onClick={() => handleAcceptOpportunity(opp.id)}
                  disabled={isAccepting}
                  className={`py-2.5 rounded-xl text-black text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-200 select-none ${
                    isAccepting
                      ? 'bg-brand-xp border border-brand-xp/30'
                      : 'bg-brand-cyber hover:shadow-[0_0_12px_rgba(0,114,255,0.25)] active:scale-95'
                  }`}
                >
                  {isAccepting ? (
                    <>
                      Challenge Accepted <ShieldCheck size={12} className="stroke-[3px]" />
                    </>
                  ) : (
                    <>
                      Accept Move <Zap size={11} className="fill-black" />
                    </>
                  )}
                </button>

              </div>

              {/* Interactive Slide overlay for accepted status */}
              <AnimatePresence>
                {isAccepting && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-[#08080c]/95 backdrop-blur-sm flex flex-col items-center justify-center gap-2 p-5 text-center"
                  >
                    <div className="w-10 h-10 rounded-full bg-brand-xp/10 border border-brand-xp/30 flex items-center justify-center text-brand-xp animate-bounce shadow-neon-xp">
                      <ShieldCheck size={20} className="stroke-[2.5]" />
                    </div>
                    <h4 className="text-xs font-black text-white uppercase tracking-tight">
                      Momentum Triggered!
                    </h4>
                    <p className="text-[9px] text-zinc-400 font-medium max-w-[200px]">
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
