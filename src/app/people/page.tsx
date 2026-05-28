'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Users, Sparkles, Trophy, Handshake, Check, Star, Zap, UserPlus
} from 'lucide-react';
import { useUserState } from '../../context/UserStateContext';

export default function PeoplePage() {
  const router = useRouter();
  const { profile, isOnboarded, teammates } = useUserState();

  const [connectedIds, setConnectedIds] = useState<string[]>([]);
  const [requests, setRequests] = useState([
    { id: 'req-1', name: 'Tanvi Joshi', role: 'UX Designer', match: '96% Fit', reason: 'Matches your Next.js frontend projects stack.' }
  ]);

  // Guard onboarding
  useEffect(() => {
    if (!isOnboarded || !profile) {
      router.push('/');
    }
  }, [isOnboarded, profile, router]);

  if (!profile) return null;

  const toggleConnect = (id: string) => {
    if (connectedIds.includes(id)) {
      setConnectedIds(connectedIds.filter(cid => cid !== id));
    } else {
      setConnectedIds([...connectedIds, id]);
    }
  };

  const handleAcceptRequest = (id: string) => {
    setRequests(requests.filter(r => r.id !== id));
  };

  const teamFinder = [
    { hackathon: 'Tether India Hackathon', roleNeeded: 'Solidity Dev', poster: 'Kabir Das', matchesStack: true },
    { hackathon: 'Voice Agent Challenge', roleNeeded: 'Python Agent Developer', poster: 'Ananya Sharma', matchesStack: true }
  ];

  return (
    <div className="flex-1 flex flex-col px-4 py-5 select-none relative z-10 gap-6 pb-20 max-w-5xl mx-auto w-full text-left">
      
      {/* Title Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
          <Users className="text-brand-level" /> Builder Network
        </h1>
        <p className="text-xs text-zinc-550 dark:text-zinc-400 mt-1 font-medium leading-relaxed">
          Discover compatible teammates, accept collaboration invites, and join hackathon teams.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: AI Matching, Connected list */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* AI Teammate Matching cards */}
          <div className="glass-panel p-5 rounded-3xl border border-brand-border bg-white dark:bg-zinc-900/10">
            <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-4 flex items-center gap-2">
              <Sparkles size={16} className="text-brand-cyber animate-pulse" /> AI Teammate Compatibility
            </h3>
            
            <div className="flex flex-col gap-4">
              {teammates.map((mate) => {
                const isConnected = connectedIds.includes(mate.id);
                return (
                  <div key={mate.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl border border-brand-border bg-zinc-50 dark:bg-black/35 shadow-glass">
                    <div className="flex items-start gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={mate.avatar} alt="avatar" className="w-10 h-10 rounded-full border border-brand-border bg-zinc-100" />
                      <div className="flex flex-col text-left gap-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-zinc-850 dark:text-white leading-tight">{mate.name}</span>
                          <span className="text-[9px] bg-brand-cyber/10 text-brand-cyber px-2 py-0.5 rounded font-black uppercase tracking-wider">{mate.matchScore}% Match</span>
                        </div>
                        <span className="text-[10px] text-brand-level font-black uppercase tracking-wider">{mate.role}</span>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-semibold">Skills: {mate.skills.join(', ')}</p>
                      </div>
                    </div>

                    <button 
                      onClick={() => toggleConnect(mate.id)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all self-end md:self-center flex items-center gap-1.5 ${
                        isConnected 
                          ? 'bg-brand-cyber text-white' 
                          : 'bg-zinc-900 dark:bg-white text-white dark:text-black hover:opacity-95'
                      }`}
                    >
                      {isConnected ? (
                        <>Connected <Check size={11} /></>
                      ) : (
                        <>Connect <UserPlus size={11} /></>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hackathon Team Finder */}
          <div className="glass-panel p-5 rounded-3xl border border-brand-border bg-white dark:bg-zinc-900/10">
            <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-4 flex items-center gap-2">
              <Trophy size={16} className="text-brand-xp" /> Hackathon Team Recruitment
            </h3>
            
            <div className="flex flex-col gap-3">
              {teamFinder.map((t, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 rounded-2xl border border-brand-border bg-zinc-50 dark:bg-black/20">
                  <div className="flex flex-col text-left gap-0.5">
                    <span className="text-[10px] text-zinc-450 dark:text-zinc-500 font-black uppercase tracking-wider">{t.hackathon}</span>
                    <span className="text-xs font-black text-zinc-800 dark:text-white mt-0.5">Needs: {t.roleNeeded}</span>
                    <span className="text-[9px] text-zinc-500 font-semibold mt-1">Posted by {t.poster}</span>
                  </div>
                  
                  <button 
                    onClick={() => toggleConnect(`rec-${idx}`)}
                    className="py-1.5 px-3 rounded-lg bg-zinc-150 dark:bg-zinc-800 text-zinc-800 dark:text-white text-[9px] font-black uppercase tracking-wider border border-brand-border hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  >
                    Send Request
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Connection requests, reputation cards */}
        <div className="flex flex-col gap-6">
          
          {/* Collaboration Requests */}
          <div className="glass-panel p-4 rounded-3xl border border-brand-border bg-white dark:bg-zinc-900/10 flex flex-col gap-3">
            <h3 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-wider pb-2 border-b border-brand-border flex items-center gap-1.5">
              <Handshake size={14} className="text-brand-level" /> Collaboration Invites
            </h3>
            {requests.length === 0 ? (
              <span className="text-[10px] text-zinc-500 font-semibold py-2">No pending requests.</span>
            ) : (
              requests.map(r => (
                <div key={r.id} className="flex flex-col gap-2 p-3 bg-zinc-50 dark:bg-black/20 border border-brand-border rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-zinc-850 dark:text-white">{r.name} ({r.role})</span>
                    <span className="text-[9px] text-brand-cyber font-black font-mono">{r.match}</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 leading-normal">{r.reason}</p>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <button 
                      onClick={() => handleAcceptRequest(r.id)}
                      className="py-1 bg-brand-cyber text-white text-[9px] font-black uppercase tracking-wider rounded"
                    >
                      Accept
                    </button>
                    <button 
                      onClick={() => handleAcceptRequest(r.id)}
                      className="py-1 bg-zinc-150 dark:bg-zinc-800 text-zinc-800 dark:text-white text-[9px] font-black uppercase tracking-wider rounded border border-brand-border"
                    >
                      Ignore
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Builder Reputation Card */}
          <div className="glass-panel p-4 rounded-3xl border border-brand-border bg-white dark:bg-zinc-900/10 flex flex-col gap-3">
            <h3 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Star size={14} className="text-amber-500" /> Reputation Badges
            </h3>
            <div className="flex items-center gap-3 p-2 bg-amber-500/5 border border-amber-500/20 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-500 font-black text-sm shrink-0">
                🏆
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-black text-zinc-850 dark:text-white">Consistency Leader</span>
                <span className="text-[9px] text-zinc-500 font-semibold">Awarded for 7+ consecutive daily shipped logs</span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 bg-indigo-500/5 border border-indigo-500/20 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center text-indigo-500 font-black text-sm shrink-0">
                🚀
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-black text-zinc-850 dark:text-white">Rapid Shipper</span>
                <span className="text-[9px] text-zinc-500 font-semibold">Shipped 3 production-live app deploys</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
