'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { useUserState } from '../context/UserStateContext';
import { Mission } from '../lib/dummy-data';

interface MissionCardProps {
  mission: Mission;
}

export default function MissionCard({ mission }: MissionCardProps) {
  const { completedMissionIds, completeMission } = useUserState();
  const isCompleted = completedMissionIds.includes(mission.id);

  // Divide mission into 3 easy micro-steps for high momentum!
  const microSteps = [
    { id: 1, label: 'Review the setup guide & files' },
    { id: 2, label: 'Code local feature block' },
    { id: 3, label: 'Deploy & verify production preview' },
  ];

  const [checkedSteps, setCheckedSteps] = useState<number[]>([]);

  // Reset steps if completed state changes (e.g. in resetting)
  useEffect(() => {
    if (isCompleted) {
      setCheckedSteps([1, 2, 3]);
    } else {
      setCheckedSteps([]);
    }
  }, [isCompleted]);

  const toggleStep = (stepId: number) => {
    if (isCompleted) return;

    let updated = [...checkedSteps];
    if (checkedSteps.includes(stepId)) {
      updated = updated.filter(id => id !== stepId);
    } else {
      updated.push(stepId);
    }
    setCheckedSteps(updated);

    // If checking all 3 steps, trigger complete!
    if (updated.length === 3) {
      setTimeout(() => {
        completeMission(mission.id);
      }, 400);
    }
  };

  const progressPercent = Math.round((checkedSteps.length / 3) * 100);

  // Circular Progress Ring attributes
  const radius = 24;
  const stroke = 3.5;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className={`w-full glass-panel rounded-3xl p-5 relative overflow-hidden transition-all duration-300 ${
      isCompleted 
        ? 'border-brand-xp/30 bg-gradient-to-br from-brand-xp/5 via-[#12121a]/60 to-[#12121a]/60 shadow-[0_0_20px_rgba(0,255,204,0.06)]' 
        : 'border-white/8 hover:border-white/12'
    }`}>
      
      {/* Glow highlight */}
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-10 pointer-events-none ${
        isCompleted ? 'bg-brand-xp' : 'bg-brand-cyber'
      }`} />

      {/* Header Info */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[9px] bg-brand-cyber/20 text-brand-cyber border border-brand-cyber/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              {mission.category} Mission
            </span>
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest flex items-center gap-0.5">
              <Sparkles size={10} className="text-brand-xp" /> +{mission.xpReward} XP
            </span>
          </div>

          <h3 className={`text-base font-black tracking-tight mt-2 ${isCompleted ? 'text-zinc-400 line-through' : 'text-white'}`}>
            {mission.title}
          </h3>
          <p className="text-xs text-zinc-400 font-medium mt-1 leading-relaxed">
            {mission.description}
          </p>
        </div>

        {/* Circular Progress Ring Container */}
        <div className="relative flex items-center justify-center select-none shrink-0 w-14 h-14">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background Ring */}
            <circle
              stroke="rgba(255, 255, 255, 0.05)"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={radius + 4}
              cy={radius + 4}
            />
            {/* Active Colored Progress */}
            <motion.circle
              stroke={isCompleted ? '#00ffcc' : '#0072ff'}
              fill="transparent"
              strokeWidth={stroke}
              strokeDasharray={circumference + ' ' + circumference}
              style={{ strokeDashoffset }}
              r={normalizedRadius}
              cx={radius + 4}
              cy={radius + 4}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
          </svg>
          <span className="absolute text-[10px] font-black font-mono">
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Micro Checklist Sub-section */}
      <div className="mt-4 border-t border-white/5 pt-4 flex flex-col gap-2">
        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1">
          <Target size={11} /> Mission Steps to build momentum
        </h4>

        <div className="flex flex-col gap-2 mt-1">
          {microSteps.map((step) => {
            const isChecked = checkedSteps.includes(step.id);

            return (
              <button
                key={step.id}
                onClick={() => toggleStep(step.id)}
                disabled={isCompleted}
                className={`w-full flex items-center justify-between text-left p-2.5 rounded-xl border transition-all duration-200 ${
                  isChecked
                    ? 'bg-white/5 border-white/8 text-zinc-400'
                    : 'bg-black/20 border-white/5 hover:bg-white/5 text-zinc-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors duration-200 shrink-0 ${
                    isChecked
                      ? 'bg-brand-xp text-black'
                      : 'border border-white/20'
                  }`}>
                    {isChecked && <CheckCircle2 size={12} className="stroke-[3px]" />}
                  </div>
                  <span className={`text-xs ${isChecked ? 'line-through text-zinc-500 font-medium' : 'font-semibold'}`}>
                    {step.label}
                  </span>
                </div>
                <ChevronRight size={12} className="text-zinc-600 shrink-0" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Completion Overlay Banner */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full mt-3 bg-brand-xp/10 border border-brand-xp/20 rounded-xl p-2.5 flex items-center justify-center gap-2"
          >
            <Sparkles size={14} className="text-brand-xp animate-pulse" />
            <span className="text-[10px] font-bold text-brand-xp uppercase tracking-widest">
              Mission Locked in! +{mission.xpReward} XP Earned
            </span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
