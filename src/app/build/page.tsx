'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Hammer, Terminal, Plus
} from 'lucide-react';
import { useUserState } from '../../context/UserStateContext';
import HeatmapCalendar from '../../components/HeatmapCalendar';

export default function BuildPage() {
  const router = useRouter();
  const { profile, isOnboarded, postBuildLog } = useUserState();

  const [logInput, setLogInput] = useState('');
  const [activeTab, setActiveTab] = useState<'timeline' | 'sprint'>('timeline');

  // Guard onboarding
  useEffect(() => {
    if (!isOnboarded || !profile) {
      router.push('/');
    }
  }, [isOnboarded, profile, router]);

  if (!profile) return null;

  const handlePostLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logInput.trim()) return;
    postBuildLog(logInput.trim());
    setLogInput('');
  };

  const sprints = [
    { id: 's1', title: 'Route Decoupling Sprint', status: 'In Progress', progress: 75, due: 'May 30' },
    { id: 's2', title: 'Reputation System V2', status: 'Backlog', progress: 0, due: 'June 10' }
  ];

  return (
    <div className="flex-1 flex flex-col px-4 py-5 select-none relative z-10 gap-6 pb-20 max-w-5xl mx-auto w-full text-left">
      
      {/* Page Title Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
          <Hammer className="text-brand-xp" /> Shipping Workspace
        </h1>
        <p className="text-xs text-zinc-550 dark:text-zinc-400 mt-1 font-medium leading-relaxed">
          Log daily proof-of-work, track git commits, and sync deployment updates.
        </p>
      </div>

      {/* Grid container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Double-Column: Logs creator & active shipping logs */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Post Build Log Form */}
          <div className="glass-panel p-5 rounded-3xl border border-brand-border bg-white dark:bg-zinc-900/10">
            <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-3">
              Ship Daily Proof-of-Work Log
            </h3>
            <form onSubmit={handlePostLog} className="flex flex-col gap-3">
              <textarea
                value={logInput}
                onChange={(e) => setLogInput(e.target.value)}
                placeholder="What did you build today? Share code updates, fixed bugs, or deployed features..."
                className="w-full h-24 p-3.5 bg-zinc-50 dark:bg-black/20 border border-brand-border rounded-2xl text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-brand-xp placeholder-zinc-400 dark:placeholder-zinc-650 resize-none font-medium leading-relaxed"
              />
              <button 
                type="submit"
                className="w-fit px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black hover:opacity-95 text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all"
              >
                Log Build <Plus size={14} className="stroke-[3]" />
              </button>
            </form>
          </div>

          {/* Toggle between Shipped timeline & Sprint progress */}
          <div className="flex gap-2 border-b border-brand-border pb-1">
            <button 
              onClick={() => setActiveTab('timeline')}
              className={`pb-2 px-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'timeline' ? 'border-brand-xp text-zinc-900 dark:text-white font-extrabold' : 'border-transparent text-zinc-500 hover:text-zinc-800'}`}
            >
              Build Timeline
            </button>
            <button 
              onClick={() => setActiveTab('sprint')}
              className={`pb-2 px-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'sprint' ? 'border-brand-xp text-zinc-900 dark:text-white font-extrabold' : 'border-transparent text-zinc-500 hover:text-zinc-800'}`}
            >
              Current Sprint
            </button>
          </div>

          {/* Tab content */}
          {activeTab === 'timeline' ? (
            <div className="flex flex-col gap-4">
              {profile.logs.length === 0 ? (
                <div className="glass-panel p-6 rounded-3xl border border-brand-border text-center flex flex-col items-center gap-2.5">
                  <Terminal size={20} className="text-zinc-400 animate-pulse" />
                  <h3 className="text-xs font-black text-zinc-800 dark:text-zinc-200 uppercase tracking-tight">No Build Logs Shipped Yet</h3>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-450 max-w-xs leading-normal">
                    Post your first log above to unlock your consistency streak tracker.
                  </p>
                </div>
              ) : (
                profile.logs.map((log) => (
                  <div key={log.id} className="glass-panel p-4 rounded-2xl border border-brand-border bg-white dark:bg-zinc-900/10 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] bg-brand-xp/10 text-brand-xp border border-brand-xp/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">
                        Daily Shipped Log
                      </span>
                      <span className="text-[9px] text-zinc-450 dark:text-zinc-500 font-semibold">{log.timestamp}</span>
                    </div>
                    <p className="text-xs text-zinc-700 dark:text-zinc-250 font-semibold leading-relaxed mt-1">{log.content}</p>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {sprints.map(s => (
                <div key={s.id} className="glass-panel p-4 rounded-2xl border border-brand-border bg-white dark:bg-zinc-900/10 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-zinc-850 dark:text-white">{s.title}</span>
                    <span className={`text-[8px] border px-2 py-0.5 rounded font-black uppercase ${s.status === 'In Progress' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 'bg-zinc-500/10 text-zinc-500 border-zinc-550/20'}`}>
                      {s.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-zinc-500 mt-1">
                    <span>Progress</span>
                    <span className="font-black">{s.progress}%</span>
                  </div>
                  <div className="w-full bg-zinc-150 dark:bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-xp" style={{ width: `${s.progress}%` }} />
                  </div>
                  <span className="text-[9px] text-zinc-450 dark:text-zinc-550 font-bold self-end mt-1">Due: {s.due}</span>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Right Single-Column: Shipping stats */}
        <div className="flex flex-col gap-6">
          
          {/* Consistency calendar panel */}
          <div className="glass-panel p-4 rounded-3xl border border-brand-border bg-white dark:bg-zinc-900/10">
            <h3 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-wider mb-3">
              Shipping Consistency
            </h3>
            <HeatmapCalendar logs={profile.logs} streak={profile.currentStreak} />
          </div>

        </div>

      </div>

    </div>
  );
}
