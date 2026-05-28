'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useUserState } from '../context/UserStateContext';
import { FileText, ArrowRight } from 'lucide-react';

export default function ResumeIntelligence() {
  const router = useRouter();
  const { resumeData } = useUserState();

  return (
    <div className="glass-panel p-5 rounded-3xl border border-brand-border bg-white dark:bg-zinc-900/10 text-left">
      <div className="flex items-center justify-between pb-3 border-b border-brand-border mb-4">
        <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
          <FileText size={16} className="text-brand-xp" /> Resume Intelligence Hub
        </h3>
        <span className="text-[8px] bg-brand-xp/10 text-brand-xp border border-brand-xp/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">
          AI Career Mentor
        </span>
      </div>

      <div className="flex flex-col gap-3.5">
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
          Evaluate your resume against top tech recruiters (Vercel, Notion, Stripe), calculate ATS score labels, extract skill profiles, and discover critical keyword gaps.
        </p>

        {resumeData ? (
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-brand-xp/5 border border-brand-xp/10">
            <div className="flex flex-col gap-0.5">
              <span className="text-[8px] uppercase font-bold text-zinc-400">Current ATS Score</span>
              <span className="text-sm font-black text-zinc-850 dark:text-white">{resumeData.score}% - {resumeData.label}</span>
            </div>
            <span className="text-[8px] bg-brand-xp text-white px-2 py-0.5 rounded font-black uppercase">Active Audit</span>
          </div>
        ) : (
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-50 dark:bg-black/25 border border-brand-border">
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold uppercase">Resume Status</span>
            <span className="text-[10px] font-black uppercase text-amber-500">Not Uploaded</span>
          </div>
        )}

        <button
          onClick={() => router.push('/resume-intelligence')}
          className="w-full py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black hover:opacity-95 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
        >
          Open Resume Portal <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}
