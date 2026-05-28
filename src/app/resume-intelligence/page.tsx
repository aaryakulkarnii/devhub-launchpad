'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Sparkles, AlertTriangle, Lightbulb, CheckCircle2, 
  Upload, Terminal, ExternalLink, ArrowRight, ShieldCheck, HelpCircle, RefreshCw
} from 'lucide-react';
import { useUserState } from '../../context/UserStateContext';

export default function ResumeIntelligencePage() {
  const router = useRouter();
  const { profile, isOnboarded, resumeData, analyzeResume, opportunities } = useUserState();

  const [inputText, setInputText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  // Guard onboarding
  useEffect(() => {
    if (!isOnboarded || !profile) {
      router.push('/');
    }
  }, [isOnboarded, profile, router]);

  if (!profile) return null;

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    triggerAnalysis(inputText.trim());
  };

  const triggerAnalysis = (content: string) => {
    setAnalyzing(true);
    setTimeout(() => {
      analyzeResume(content);
      setAnalyzing(false);
    }, 1800);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file.name);
      // Simulate file content reading
      const mockResumeContent = `
        Name: ${profile.name}
        Role Focus: ${profile.focusArea}
        Skills: ${profile.techStack?.join(', ')}, JavaScript, HTML, CSS, Git
        Projects: Built a micro-frontend landing dashboard and optimized static page loading speeds by 45% using Next.js.
        Interests: Web development, AI integrations, scaling systems.
      `;
      triggerAnalysis(mockResumeContent);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file.name);
      const mockResumeContent = `
        Name: ${profile.name}
        Role Focus: ${profile.focusArea}
        Skills: ${profile.techStack?.join(', ')}, React, Tailwind, SQL, Node.js
        Experience: Interned at tech startups building modular checkouts and database migration queries.
      `;
      triggerAnalysis(mockResumeContent);
    }
  };

  return (
    <div className="flex-1 flex flex-col px-4 py-5 select-none relative z-10 gap-6 pb-20 max-w-5xl mx-auto w-full text-left">
      
      {/* Navigation Header */}
      <div className="flex items-center justify-between pb-2 border-b border-brand-border mb-1 select-none">
        <button
          onClick={() => router.push('/home')}
          className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 py-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider transition-colors duration-150"
        >
          ← Dashboard
        </button>
        <span className="text-[9px] bg-brand-xp/10 text-brand-xp border border-brand-xp/20 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest">
          AI Career Mentor
        </span>
      </div>

      {/* Page Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
          <FileText className="text-brand-xp" /> Interactive Resume Intelligence
        </h1>
        <p className="text-xs text-zinc-550 dark:text-zinc-400 mt-1 font-medium leading-relaxed">
          Upload your PDF/DOC resume or paste text to perform dynamic keyword scanning, skills gap evaluations, and startup fit indexing.
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Upload / Paste Section */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          
          {/* drag and drop card */}
          <div 
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`glass-panel p-6 rounded-3xl border-2 border-dashed transition-all text-center flex flex-col items-center justify-center gap-3 relative overflow-hidden bg-white dark:bg-zinc-900/10 ${
              dragActive ? 'border-brand-xp bg-brand-xp/5' : 'border-brand-border'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-zinc-50 dark:bg-black/45 border border-brand-border flex items-center justify-center text-zinc-500">
              {analyzing ? (
                <RefreshCw size={20} className="animate-spin text-brand-xp" />
              ) : (
                <Upload size={20} />
              )}
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-xs font-black text-zinc-800 dark:text-white uppercase tracking-tight">
                {selectedFile ? selectedFile : 'Drag & Drop Resume'}
              </span>
              <p className="text-[10px] text-zinc-450 dark:text-zinc-550 font-semibold">
                Supports PDF, DOCX up to 5MB
              </p>
            </div>

            <label className="px-4 py-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black hover:opacity-90 text-[10px] font-black uppercase tracking-wider cursor-pointer select-none">
              Browse Files
              <input 
                type="file" 
                accept=".pdf,.docx,.doc" 
                onChange={handleFileChange}
                className="hidden" 
              />
            </label>
          </div>

          {/* Pasting area */}
          <div className="glass-panel p-5 rounded-3xl border border-brand-border bg-white dark:bg-zinc-900/10">
            <h3 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-wider mb-3">
              Or Paste Resume Markdown / Text
            </h3>
            <form onSubmit={handleTextSubmit} className="flex flex-col gap-3">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste your professional experience bullet points or Markdown outline here..."
                className="w-full h-36 p-3 bg-zinc-50 dark:bg-black/20 border border-brand-border rounded-2xl text-[11px] text-zinc-900 dark:text-white focus:outline-none focus:border-brand-xp placeholder-zinc-450 dark:placeholder-zinc-650 resize-none font-medium leading-relaxed"
              />
              <button
                type="submit"
                disabled={analyzing || !inputText.trim()}
                className="w-full py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black hover:opacity-95 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {analyzing ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" /> Analyzing...
                  </>
                ) : (
                  <>
                    Analyze Resume Content <Sparkles size={13} />
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

        {/* Right Double-Column: Dynamic Reports */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <AnimatePresence mode="wait">
            {!resumeData ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass-panel p-8 rounded-3xl border border-brand-border text-center flex flex-col items-center justify-center gap-3.5 bg-white dark:bg-zinc-900/10"
              >
                <div className="w-12 h-12 rounded-full bg-brand-xp/10 border border-brand-xp/20 flex items-center justify-center text-brand-xp animate-bounce">
                  <Terminal size={22} className="stroke-[2.5]" />
                </div>
                <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                  No Resume Analyzed
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-450 max-w-sm leading-relaxed font-semibold">
                  Upload a document or paste text in the left panel to dynamically compute your ATS keywords alignment, interview readiness, and developer job compatibility.
                </p>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-6"
              >
                
                {/* Score Summary Banner */}
                <div className="glass-panel p-5 rounded-3xl border border-brand-border bg-gradient-to-r from-brand-xp/5 to-brand-cyber/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 text-left">
                    {/* Ring score */}
                    <div className="relative w-20 h-20 shrink-0 flex items-center justify-center bg-white dark:bg-zinc-950 rounded-2xl border border-brand-border shadow-neon-xp">
                      <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-zinc-150 dark:text-zinc-800"
                          strokeWidth="3.2"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-brand-xp"
                          strokeDasharray={`${resumeData.score}, 100`}
                          strokeWidth="3.2"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <span className="absolute text-sm font-black text-zinc-900 dark:text-white">{resumeData.score}%</span>
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] uppercase font-black text-zinc-450 dark:text-zinc-500 tracking-wider">ATS Score Label</span>
                      <h3 className="text-base font-black text-zinc-900 dark:text-white tracking-tight">{resumeData.label}</h3>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-semibold leading-relaxed">
                        Evaluated across skill diversity, project depth, and production deployment keywords.
                      </p>
                    </div>
                  </div>

                  <span className="text-[9px] bg-brand-level/10 text-brand-level border border-brand-level/20 px-3 py-1 rounded-full font-black uppercase tracking-wider self-start sm:self-center shrink-0">
                    ATS Audit Complete
                  </span>
                </div>

                {/* Skills Section Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Skills completed extracted */}
                  <div className="glass-panel p-5 rounded-3xl border border-brand-border bg-white dark:bg-zinc-900/10">
                    <h4 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-1.5 border-b border-brand-border pb-2">
                      <CheckCircle2 size={13} className="text-emerald-500" /> Extracted Completed Skills
                    </h4>
                    <div className="flex flex-col gap-3 max-h-56 overflow-y-auto pr-1 text-left">
                      {resumeData.skillsCompleted.map(skill => (
                        <div key={skill.name} className="flex flex-col gap-1 p-2 rounded-xl bg-zinc-50 dark:bg-black/20 border border-brand-border">
                          <div className="flex items-center justify-between text-[10px] font-bold">
                            <span className="text-zinc-800 dark:text-white uppercase">{skill.name}</span>
                            <span className="text-brand-cyber">{skill.level} ({skill.confidence}%)</span>
                          </div>
                          <div className="w-full bg-zinc-200 dark:bg-white/5 h-1 rounded-full overflow-hidden">
                            <div className="h-full bg-brand-cyber" style={{ width: `${skill.confidence}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Gaps / Skills needed */}
                  <div className="glass-panel p-5 rounded-3xl border border-brand-border bg-white dark:bg-zinc-900/10">
                    <h4 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-1.5 border-b border-brand-border pb-2">
                      <AlertTriangle size={13} className="text-amber-500" /> Missing Profile Gaps
                    </h4>
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-semibold mb-3 leading-relaxed text-left">
                      Identified gaps between your resume text and target company roles:
                    </p>
                    <div className="flex flex-wrap gap-2 text-left">
                      {resumeData.skillsNeeded.map(skill => (
                        <span key={skill} className="text-[9px] bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-lg font-black uppercase">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Interview Readiness Scores */}
                <div className="glass-panel p-5 rounded-3xl border border-brand-border bg-white dark:bg-zinc-900/10 text-left">
                  <h4 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-wider mb-4 border-b border-brand-border pb-2">
                    Interview Readiness Matrix
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { label: 'Frontend', val: resumeData.readiness.frontend, color: 'text-brand-xp' },
                      { label: 'Backend', val: resumeData.readiness.backend, color: 'text-brand-cyber' },
                      { label: 'AI Models', val: resumeData.readiness.ai, color: 'text-brand-level' },
                      { label: 'Startup Autonomy', val: resumeData.readiness.startup, color: 'text-amber-500' }
                    ].map(r => (
                      <div key={r.label} className="p-3 bg-zinc-50 dark:bg-black/25 rounded-2xl border border-brand-border text-center flex flex-col gap-1">
                        <span className="text-[9px] font-black uppercase text-zinc-500">{r.label}</span>
                        <span className={`text-xl font-black mt-1 ${r.color}`}>{r.val}%</span>
                        <div className="w-full bg-zinc-200 dark:bg-white/5 h-1 rounded-full overflow-hidden mt-1">
                          <div className={`h-full ${r.color.replace('text-', 'bg-')}`} style={{ width: `${r.val}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Company Fit */}
                <div className="glass-panel p-5 rounded-3xl border border-brand-border bg-white dark:bg-zinc-900/10 text-left">
                  <h4 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-wider mb-4 border-b border-brand-border pb-2 flex items-center gap-1.5">
                    <Lightbulb size={13} className="text-brand-cyber" /> Target Company Fit & Rationale
                  </h4>
                  <div className="flex flex-col gap-3">
                    {resumeData.companyFits.map(fit => (
                      <div key={fit.name} className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-black/35 border border-brand-border flex items-center justify-between gap-4">
                        <div className="flex flex-col text-left gap-1">
                          <span className="text-xs font-black text-zinc-850 dark:text-white leading-tight">{fit.name}</span>
                          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-semibold leading-relaxed mt-0.5">{fit.reason}</p>
                        </div>
                        <span className="text-[10px] font-mono font-black text-brand-cyber shrink-0">{fit.matchScore}% Match</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ATS Missing Keywords & Recommendations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Missing keywords */}
                  <div className="glass-panel p-5 rounded-3xl border border-brand-border bg-white dark:bg-zinc-900/10">
                    <h4 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-1.5 border-b border-brand-border pb-2">
                      Missing ATS Keywords
                    </h4>
                    <div className="flex flex-wrap gap-1.5 text-left">
                      {resumeData.missingKeywords.map(kw => (
                        <span key={kw} className="text-[9px] bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 px-2 py-0.5 rounded font-black uppercase">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Growth suggestions */}
                  <div className="glass-panel p-5 rounded-3xl border border-brand-border bg-white dark:bg-zinc-900/10">
                    <h4 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-1.5 border-b border-brand-border pb-2">
                      Growth Recommendations
                    </h4>
                    <div className="flex flex-col gap-2.5 text-left">
                      {resumeData.growthRecommendations.map((rec, i) => (
                        <div key={i} className="flex items-start gap-2 text-[10px] text-zinc-650 dark:text-zinc-300 font-semibold leading-normal">
                          <CheckCircle2 size={12} className="text-brand-level shrink-0 mt-0.5" />
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Recommended Projects */}
                <div className="glass-panel p-5 rounded-3xl border border-brand-border bg-white dark:bg-zinc-900/10 text-left">
                  <h4 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-wider mb-4 border-b border-brand-border pb-2">
                    Recommended Skill-Building Projects
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {resumeData.recommendedProjects.map((proj, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-zinc-50 dark:bg-black/35 border border-brand-border flex flex-col justify-between gap-3 text-left">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-black text-zinc-800 dark:text-white leading-tight">{proj.title}</span>
                          <p className="text-[10px] text-zinc-550 dark:text-zinc-400 font-semibold mt-1 leading-relaxed">
                            {proj.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {proj.stack.map(tag => (
                            <span key={tag} className="text-[8px] bg-brand-cyber/10 text-brand-cyber border border-brand-cyber/20 px-1.5 py-0.5 rounded font-black uppercase">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suggested Opportunities link matches */}
                <div className="glass-panel p-5 rounded-3xl border border-brand-border bg-white dark:bg-zinc-900/10 text-left">
                  <div className="flex items-center justify-between pb-3 border-b border-brand-border mb-4">
                    <h4 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-wider">
                      Suggested Opportunity matches
                    </h4>
                    <button 
                      onClick={() => router.push('/opportunities')}
                      className="text-[9px] font-black text-brand-xp uppercase tracking-wider hover:opacity-85"
                    >
                      Explore opportunities
                    </button>
                  </div>
                  <div className="flex flex-col gap-3">
                    {opportunities.slice(0, 2).map(opp => (
                      <div key={opp.id} className="p-3 bg-zinc-50 dark:bg-black/25 border border-brand-border rounded-2xl flex items-center justify-between gap-4">
                        <div className="flex flex-col text-left gap-1">
                          <span className="text-xs font-black text-zinc-850 dark:text-white leading-tight">{opp.title}</span>
                          <span className="text-[9px] font-bold text-zinc-500 uppercase">Organized by {opp.organizer}</span>
                        </div>
                        <div className="flex items-center gap-2 font-black uppercase text-[9px] text-brand-xp shrink-0">
                          <span>+{opp.rewardXp} XP</span>
                          <ArrowRight size={12} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
