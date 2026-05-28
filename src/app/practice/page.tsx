'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  BrainCircuit, Terminal, Play, CheckCircle, ShieldAlert, Award, Sparkles, BookOpen
} from 'lucide-react';
import { useUserState } from '../../context/UserStateContext';

export default function PracticePage() {
  const router = useRouter();
  const { profile, isOnboarded } = useUserState();

  const [code, setCode] = useState('// Write your solution here...\nfunction twoSum(nums, target) {\n  \n}');
  const [output, setOutput] = useState('Run test cases to see console output.');
  const [testResult, setTestResult] = useState<'idle' | 'success' | 'failed'>('idle');

  // Guard onboarding
  useEffect(() => {
    if (!isOnboarded || !profile) {
      router.push('/');
    }
  }, [isOnboarded, profile, router]);

  if (!profile) return null;

  const handleRunCode = () => {
    setOutput('Running test cases...\n> Test Case 1: nums = [2,7,11,15], target = 9\n> Passed!\n\nAll test cases compiled successfully.');
    setTestResult('success');
  };

  const topics = [
    { name: 'Arrays & Hashing', progress: 85, color: 'bg-brand-xp' },
    { name: 'Two Pointers / Sliders', progress: 60, color: 'bg-brand-cyber' },
    { name: 'Trees & Graphs', progress: 30, color: 'bg-brand-level' },
    { name: 'Dynamic Programming', progress: 15, color: 'bg-brand-streak' }
  ];

  return (
    <div className="flex-1 flex flex-col px-4 py-5 select-none relative z-10 gap-6 pb-20 max-w-5xl mx-auto w-full text-left">
      
      {/* Title Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
          <BrainCircuit className="text-brand-cyber" /> DSA Training OS
        </h1>
        <p className="text-xs text-zinc-550 dark:text-zinc-400 mt-1 font-medium leading-relaxed">
          Solve daily algorithms challenge, track DSA progress roadmaps, and review interview readiness.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Double-Column: Interactive DSA Code editor */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Daily DSA editor pane */}
          <div className="glass-panel p-5 rounded-3xl border border-brand-border bg-white dark:bg-zinc-900/10 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-[9px] bg-zinc-100 dark:bg-zinc-800 border border-brand-border text-zinc-500 dark:text-zinc-400 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                ⚡ Daily Challenge: Two Sum
              </span>
              <span className="text-[9px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded font-black uppercase">Easy</span>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-300 font-semibold leading-relaxed">
              Given an array of integers <code className="font-mono text-brand-xp bg-zinc-100 dark:bg-zinc-800 px-1 rounded">nums</code> and an integer <code className="font-mono text-brand-xp bg-zinc-100 dark:bg-zinc-800 px-1 rounded">target</code>, return indices of the two numbers such that they add up to target.
            </p>

            {/* Simulated Editor */}
            <div className="flex flex-col border border-brand-border rounded-2xl overflow-hidden bg-zinc-950 text-stone-200">
              <div className="bg-zinc-900 border-b border-brand-border px-4 py-2 flex items-center justify-between text-[10px] text-zinc-500 select-none">
                <span className="font-bold font-mono">solution.js</span>
                <span>JavaScript</span>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-44 p-4 bg-transparent font-mono text-xs text-emerald-400 focus:outline-none resize-none leading-relaxed"
              />
            </div>

            {/* Test Case Output */}
            <div className="border border-brand-border rounded-xl p-3.5 bg-zinc-50 dark:bg-black/25">
              <span className="text-[9px] text-zinc-450 dark:text-zinc-500 font-black uppercase tracking-wider">Console Output</span>
              <pre className="text-[10px] font-mono text-zinc-650 dark:text-zinc-300 mt-2 whitespace-pre-wrap leading-relaxed">{output}</pre>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={handleRunCode}
                className="px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black hover:opacity-95 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors"
              >
                Run Tests <Play size={12} className="fill-current" />
              </button>
              
              {testResult === 'success' && (
                <span className="text-xs text-emerald-500 font-black flex items-center gap-1">
                  <CheckCircle size={14} /> Passed! +50 XP claimed
                </span>
              )}
            </div>

          </div>

          {/* DSA Roadmaps list */}
          <div className="glass-panel p-5 rounded-3xl border border-brand-border bg-white dark:bg-zinc-900/10">
            <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-4 flex items-center gap-2">
              <BookOpen size={16} className="text-brand-level" /> DSA Topic Roadmaps
            </h3>

            <div className="flex flex-col gap-4">
              {topics.map(t => (
                <div key={t.name} className="flex flex-col gap-1.5 p-3 rounded-2xl bg-zinc-50 dark:bg-black/10 border border-brand-border">
                  <div className="flex items-center justify-between text-xs font-black text-zinc-800 dark:text-white">
                    <span>{t.name}</span>
                    <span>{t.progress}% Complete</span>
                  </div>
                  <div className="w-full bg-zinc-150 dark:bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full ${t.color}`} style={{ width: `${t.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Single-Column: Readiness, rewards tracker */}
        <div className="flex flex-col gap-6">
          
          {/* Interview Readiness score */}
          <div className="glass-panel p-4 rounded-3xl border border-brand-border bg-white dark:bg-zinc-900/10 flex flex-col gap-4">
            <h3 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={14} className="text-brand-cyber" /> Interview Readiness
            </h3>

            <div className="flex flex-col items-center justify-center p-4 border border-brand-border rounded-2xl bg-zinc-50 dark:bg-black/25 gap-2">
              <span className="text-4xl font-black text-brand-xp">68%</span>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Estimated Score</span>
              <p className="text-[10px] text-zinc-450 text-center leading-normal mt-1 max-w-[150px]">
                Solve <b>Trees & Graphs</b> topics to raise your readiness for Tier-1 internships.
              </p>
            </div>
          </div>

          {/* XP multipliers */}
          <div className="glass-panel p-4 rounded-3xl border border-brand-border bg-white dark:bg-zinc-900/10 flex flex-col gap-3">
            <h3 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Award size={14} className="text-amber-500" /> Reward Booster
            </h3>
            
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">Daily Streak Multiplier</span>
                <span className="text-brand-streak font-black">1.2x XP</span>
              </div>
              <div className="flex items-center justify-between text-xs border-t border-brand-border pt-2.5">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">Weekly Completion Boost</span>
                <span className="text-brand-cyber font-black">+100 XP</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
