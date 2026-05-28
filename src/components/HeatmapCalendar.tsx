'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Flame } from 'lucide-react';
import { BuildLog } from '../lib/dummy-data';

interface HeatmapCalendarProps {
  logs: BuildLog[];
  streak: number;
}

const toDayKey = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
};

const formatShortDate = (date: Date) =>
  date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

const buildDays = (logs: BuildLog[]) => {
  const today = new Date();
  const buildDates = new Set<string>();

  logs.forEach((log) => {
    if (log.date) {
      const key = toDayKey(log.date);
      if (key) buildDates.add(key);
      return;
    }
    const fallbackKey = toDayKey(log.timestamp);
    if (fallbackKey) buildDates.add(fallbackKey);
  });

  return Array.from({ length: 30 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (29 - index));
    const key = date.toISOString().slice(0, 10);
    return {
      date,
      key,
      isActive: buildDates.has(key),
      isToday: key === today.toISOString().slice(0, 10)
    };
  });
};

export default function HeatmapCalendar({ logs, streak }: HeatmapCalendarProps) {
  const { days, activeCount, consistency } = useMemo(() => {
    const days = buildDays(logs);
    const activeCount = days.filter(day => day.isActive).length;
    const consistency = Math.round((activeCount / 30) * 100);
    return { days, activeCount, consistency };
  }, [logs]);

  return (
    <div className="glass-panel rounded-3xl border border-white/10 bg-zinc-950/75 p-4 overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.35)]">
      <div className="flex flex-col gap-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-zinc-400">
          <CalendarDays size={14} />
          Last 30 days
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-black text-white tracking-tight">Builder Consistency</h3>
          <p className="text-xs text-zinc-500 max-w-sm leading-relaxed">
            Consistency creates growth. Every daily log adds a small, meaningful square to your streak.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="rounded-full bg-zinc-900/70 px-3 py-2 border border-white/10 text-[10px] uppercase tracking-[0.18em] text-zinc-300">
            <span className="block text-base font-black text-brand-xp">{consistency}%</span>
            consistency
          </div>
          <div className="rounded-full bg-zinc-900/70 px-3 py-2 border border-white/10 text-[10px] uppercase tracking-[0.18em] text-zinc-300">
            <span className="block text-base font-black text-white">{activeCount}</span>
            days built
          </div>
          <div className="rounded-full bg-zinc-900/70 px-3 py-2 border border-white/10 text-[10px] uppercase tracking-[0.18em] text-zinc-300">
            <span className="block text-base font-black text-brand-streak">🔥 {streak}</span>
            streak
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-7 gap-1.5 justify-center">
        {days.map((day) => (
          <motion.div
            key={day.key}
            layout
            animate={{
              backgroundColor: day.isActive ? 'rgba(16,185,129,0.95)' : 'rgba(255,255,255,0.07)',
              boxShadow: day.isActive ? '0 0 14px rgba(16,185,129,0.16)' : 'none'
            }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className={`relative flex items-center justify-center h-9 w-9 rounded-full border ${day.isActive ? 'border-transparent' : 'border-white/10'} ${day.isToday ? 'ring-2 ring-brand-xp/25' : ''}`}
          >
            <span className={`text-[9px] font-semibold ${day.isActive ? 'text-white' : 'text-zinc-500'}`}>
              {day.date.getDate()}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 text-[11px] text-zinc-500">
        Effort over productivity. Keep shipping logs to keep the heatmap alive.
      </div>
    </div>
  );
}
