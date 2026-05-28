'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, ArrowRight, ArrowLeft, Target, 
  Sparkles, ShieldCheck, Compass, CheckCircle2,
  Code2, Rocket, Cpu, Award
} from 'lucide-react';
import { useUserState } from '../../context/UserStateContext';

export default function OnboardingPage() {
  const router = useRouter();
  const { onboardUser, profile } = useUserState();

  // If already onboarded, send to home immediately
  useEffect(() => {
    if (profile) {
      router.push('/home');
    }
  }, [profile, router]);

  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [focusArea, setFocusArea] = useState('');
  const [stage, setStage] = useState('');
  const [techStack, setTechStack] = useState<string[]>([]);
  const [goals, setGoals] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);

  // Console compilation state
  const [isCompiling, setIsCompiling] = useState(true);
  const [compilingIndex, setCompilingIndex] = useState(0);

  const compilingLogs = [
    'Initializing DevHub core vectors...',
    'Calibrating builder ambition index...',
    'Generating 6-dimensional Radar coordinates...',
    'Mapping Builder DNA helix parameters...',
    'Injecting Level 1 Starter Daily Missions...',
    'Syncing profile metrics with Supabase ledger...',
    'Identity successfully locked in! 🚀'
  ];

  useEffect(() => {
    if (step === 4 && isCompiling) {
      const interval = setInterval(() => {
        setCompilingIndex((prev) => {
          if (prev >= compilingLogs.length - 1) {
            clearInterval(interval);
            setTimeout(() => {
              setIsCompiling(false);
            }, 600);
            return prev;
          }
          return prev + 1;
        });
      }, 400);
      return () => clearInterval(interval);
    }
  }, [step, isCompiling, compilingLogs.length]);

  const handleNextStep = () => {
    if (step === 1 && (!name.trim() || !stage)) return;
    if (step === 2 && (!focusArea || techStack.length === 0)) return;
    if (step === 3 && (goals.length === 0 || interests.length === 0)) return;
    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleLaunch = () => {
    onboardUser(
      name,
      focusArea,
      stage,
      interests.join(', '),
      techStack,
      goals,
      interests
    );
    router.push('/home');
  };

  // Configurations
  const stageOptions = [
    { id: 'Just Starting', label: 'Just Starting', desc: 'Learning core fundamentals & algorithms' },
    { id: 'Built Some Projects', label: 'Built Projects', desc: 'Shipped dynamic apps and UI prototypes' },
    { id: 'Hackathon Builder', label: 'Hackathon Veteran', desc: 'Experienced in rapid 36-hour ship cycles' },
    { id: 'Internship Ready', label: 'Internship Ready', desc: 'Preparing to join fast-paced engineering cells' }
  ];

  const focusCards = [
    { id: 'AI Builder', label: 'AI Engineer', desc: 'LLM agents, models & custom wrappers' },
    { id: 'Web Builder', label: 'Frontend/Web Architect', desc: 'Premium responsive UI & serverless backends' },
    { id: 'Cybersecurity', label: 'Cyber Sec & Protocols', desc: 'Secure APIs, smart contracts & encryption' },
    { id: 'Data Science', label: 'Data Science & ML', desc: 'Pipelines, analytics & Python tooling' },
    { id: 'App Developer', label: 'Mobile Developer', desc: 'iOS/Android applications & liquid design' }
  ];

  const techStackOptions = [
    'React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'Tailwind CSS', 'Framer Motion', 'Solidity', 'Rust', 'Gemini API'
  ];

  const goalOptions = [
    { id: 'Get Internship', label: 'Secure Internships', desc: 'Match with startup incubation cells' },
    { id: 'Win Hackathons', label: 'Win Hackathons', desc: 'Form teams & build high-velocity MVPs' },
    { id: 'Build Startup', label: 'Build Next Startup', desc: 'Deploy SaaS products to real users' },
    { id: 'Learn New Tech', label: 'Upskill Consistently', desc: 'Master production frameworks' }
  ];

  const interestOptions = [
    'Generative AI', 'Decentralized Apps', 'Interactive UI/UX', 'Cloud Infrastructure', 'Developer Tools', 'Fintech Systems'
  ];

  const toggleTag = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    if (list.includes(item)) {
      setList(list.filter(x => x !== item));
    } else {
      setList([...list, item]);
    }
  };

  return (
    <div className="flex-1 flex flex-col px-6 py-8 select-none relative z-10 max-w-xl mx-auto w-full justify-center">
      {/* Background radial highlight */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-brand-xp/5 rounded-full blur-3xl pointer-events-none" />

      {step > 1 && step < 4 && (
        <button 
          onClick={handlePrevStep}
          className="self-start text-zinc-500 hover:text-zinc-300 py-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors duration-150 mb-6"
        >
          <ArrowLeft size={12} /> Back
        </button>
      )}

      <div className="flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: INITIAL IDENTITY & LEVEL */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-6"
            >
              <div>
                <span className="text-[9px] bg-brand-xp/10 text-brand-xp border border-brand-xp/25 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest">
                  Step 1 of 3: Core Identity
                </span>
                <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight mt-3">
                  Let&apos;s map your builder foundation
                </h1>
                <p className="text-xs text-zinc-550 dark:text-zinc-400 mt-1 font-medium leading-relaxed">
                  Every metric, skill radar, and daily suggestion calibrates around this.
                </p>
              </div>

              {/* Name Input */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Builder Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name (e.g., Aarya)"
                  maxLength={18}
                  className="w-full bg-zinc-100/50 dark:bg-zinc-900/30 border border-brand-border rounded-2xl px-4 py-3.5 text-sm text-zinc-900 dark:text-white font-semibold placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-brand-xp focus:shadow-[0_0_12px_rgba(37,99,235,0.15)] transition-all duration-200"
                />
              </div>

              {/* Stage Selection */}
              <div className="flex flex-col gap-2.5">
                <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Experience Index</label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {stageOptions.map((opt) => {
                    const isSelected = stage === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setStage(opt.id)}
                        className={`glass-panel p-3.5 rounded-2xl border text-left flex flex-col gap-1 transition-all duration-200 ${
                          isSelected
                            ? 'border-brand-xp bg-brand-xp/5 shadow-[0_0_15px_rgba(37,99,235,0.1)]'
                            : 'border-brand-border hover:border-zinc-200 dark:hover:border-white/10 bg-white/50 dark:bg-zinc-950/30'
                        }`}
                      >
                        <span className={`text-xs font-black ${isSelected ? 'text-brand-xp' : 'text-zinc-800 dark:text-white'}`}>
                          {opt.label}
                        </span>
                        <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold leading-normal">
                          {opt.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={handleNextStep}
                disabled={!name.trim() || !stage}
                className="w-full mt-2 py-4 px-4 rounded-2xl bg-gradient-to-r from-brand-xp to-brand-cyber text-black disabled:opacity-40 disabled:pointer-events-none active:scale-98 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-200 shadow-[0_4px_20px_rgba(0,255,204,0.15)]"
              >
                Choose Domain & Tech <ArrowRight size={14} className="stroke-[2.5]" />
              </button>
            </motion.div>
          )}

          {/* STEP 2: FOCUS AREA & TECH STACK */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-6"
            >
              <div>
                <span className="text-[9px] bg-brand-cyber/10 text-brand-cyber border border-brand-cyber/25 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest">
                  Step 2 of 3: Focus & Skills
                </span>
                <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight mt-3">
                  Align your tech stack
                </h1>
                <p className="text-xs text-zinc-550 dark:text-zinc-400 mt-1 font-medium leading-relaxed">
                  Choose a primary focus domain and the languages/frameworks you build with.
                </p>
              </div>

              {/* Focus Area */}
              <div className="flex flex-col gap-2.5">
                <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Focus Domain</label>
                <div className="flex flex-col gap-2">
                  {focusCards.map((card) => {
                    const isSelected = focusArea === card.id;
                    return (
                      <button
                        key={card.id}
                        type="button"
                        onClick={() => setFocusArea(card.id)}
                        className={`glass-panel p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all duration-200 ${
                          isSelected
                            ? 'border-brand-cyber bg-brand-cyber/5 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                            : 'border-brand-border hover:border-zinc-200 dark:hover:border-white/10 bg-white/50 dark:bg-zinc-950/30'
                        }`}
                      >
                        <div className="flex flex-col gap-0.5">
                          <span className={`text-xs font-black ${isSelected ? 'text-brand-cyber' : 'text-zinc-800 dark:text-white'}`}>
                            {card.label}
                          </span>
                          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold leading-normal">
                            {card.desc}
                          </span>
                        </div>
                        {isSelected && <CheckCircle2 size={16} className="text-brand-cyber" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tech Stack Tags */}
              <div className="flex flex-col gap-2.5">
                <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Tech Stack (Select multiple)</label>
                <div className="flex flex-wrap gap-2">
                  {techStackOptions.map((tech) => {
                    const isSelected = techStack.includes(tech);
                    return (
                      <button
                        key={tech}
                        type="button"
                        onClick={() => toggleTag(techStack, setTechStack, tech)}
                        className={`px-3 py-1.5 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${
                          isSelected
                            ? 'bg-brand-cyber text-white border-brand-cyber shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                            : 'bg-zinc-150/50 dark:bg-zinc-900/30 border-brand-border text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
                        }`}
                      >
                        {tech}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={handleNextStep}
                disabled={!focusArea || techStack.length === 0}
                className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-brand-cyber to-brand-level text-white disabled:opacity-40 disabled:pointer-events-none active:scale-98 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-200 shadow-[0_4px_20px_rgba(59,130,246,0.15)]"
              >
                Define Goals & Drivers <ArrowRight size={14} className="stroke-[2.5]" />
              </button>
            </motion.div>
          )}

          {/* STEP 3: GOALS & INTERESTS */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-6"
            >
              <div>
                <span className="text-[9px] bg-brand-level/10 text-brand-level border border-brand-level/25 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest">
                  Step 3 of 3: Goals & Interests
                </span>
                <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight mt-3">
                  Set your builder objectives
                </h1>
                <p className="text-xs text-zinc-550 dark:text-zinc-400 mt-1 font-medium leading-relaxed">
                  We match project opportunities and compatible teammates based on these preferences.
                </p>
              </div>

              {/* Goals */}
              <div className="flex flex-col gap-2.5">
                <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Core Objectives</label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {goalOptions.map((opt) => {
                    const isSelected = goals.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => toggleTag(goals, setGoals, opt.id)}
                        className={`glass-panel p-3.5 rounded-2xl border text-left flex flex-col gap-1 transition-all duration-200 ${
                          isSelected
                            ? 'border-brand-level bg-brand-level/5 shadow-[0_0_15px_rgba(139,92,246,0.1)]'
                            : 'border-brand-border hover:border-zinc-200 dark:hover:border-white/10 bg-white/50 dark:bg-zinc-950/30'
                        }`}
                      >
                        <span className={`text-xs font-black ${isSelected ? 'text-brand-level' : 'text-zinc-800 dark:text-white'}`}>
                          {opt.label}
                        </span>
                        <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold leading-normal">
                          {opt.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Focus Interests */}
              <div className="flex flex-col gap-2.5">
                <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Excited By (Select multiple)</label>
                <div className="flex flex-wrap gap-2">
                  {interestOptions.map((interest) => {
                    const isSelected = interests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleTag(interests, setInterests, interest)}
                        className={`px-3 py-1.5 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${
                          isSelected
                            ? 'bg-brand-level text-white border-brand-level shadow-[0_0_10px_rgba(139,92,246,0.25)]'
                            : 'bg-zinc-150/50 dark:bg-zinc-900/30 border-brand-border text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
                        }`}
                      >
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={handleNextStep}
                disabled={goals.length === 0 || interests.length === 0}
                className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-brand-level to-brand-xp text-white disabled:opacity-40 disabled:pointer-events-none active:scale-98 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-200 shadow-[0_4px_20px_rgba(139,92,246,0.15)]"
              >
                Compile Identity <ArrowRight size={14} className="stroke-[2.5]" />
              </button>
            </motion.div>
          )}

          {/* STEP 4: COMPILING & ID DISCLOSURE CARD */}
          {step === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col gap-6 items-center justify-center w-full"
            >
              <AnimatePresence mode="wait">
                {isCompiling ? (
                  <motion.div
                    key="compiling"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="glass-panel p-5 rounded-2xl border border-white/5 font-mono text-[10px] text-zinc-400 flex flex-col gap-3 w-full select-none"
                  >
                    <div className="flex items-center gap-1.5 pb-2.5 border-b border-white/5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                      <span className="text-[9px] uppercase font-bold text-zinc-500 ml-1.5">DevHub Console</span>
                    </div>

                    <div className="flex flex-col gap-2 min-h-[160px]">
                      {compilingLogs.slice(0, compilingIndex + 1).map((log, lIdx) => (
                        <div key={lIdx} className="flex items-start gap-1.5">
                          <span className="text-brand-xp shrink-0">{'>'}</span>
                          <span className={lIdx === compilingIndex ? 'text-white font-bold' : ''}>
                            {log}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="w-full bg-white/5 rounded-full h-1 relative overflow-hidden mt-1.5">
                      <motion.div 
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 2.8 }}
                        className="bg-brand-xp h-full shadow-[0_0_8px_#00ffcc]"
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="disclosure"
                    initial={{ opacity: 0, scale: 0.9, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: 'spring', duration: 0.5 }}
                    className="glass-panel p-6 rounded-3xl border border-white/10 text-center relative overflow-hidden flex flex-col items-center gap-5 w-full select-none"
                  >
                    <div className="absolute -top-12 w-48 h-48 bg-brand-xp/10 rounded-full blur-3xl" />

                    <span className="text-[9px] bg-brand-xp/10 text-brand-xp border border-brand-xp/20 px-3 py-1 rounded-full font-bold uppercase tracking-widest relative z-10">
                      Identity Generated
                    </span>

                    {/* Avatar wrapped in double glow rings */}
                    <div className="w-20 h-20 rounded-full border-2 border-brand-xp p-1 relative z-10 shadow-[0_0_20px_rgba(0,255,204,0.25)] bg-zinc-950">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(name)}`} 
                        alt="avatar" 
                        className="w-full h-full rounded-full object-cover bg-black"
                      />
                    </div>

                    <div className="relative z-10">
                      <h2 className="text-2xl font-black text-white tracking-tight leading-none">
                        {name}
                      </h2>
                      <p className="text-xs text-brand-xp font-bold mt-2.5 uppercase tracking-wider">
                        Lvl 1 • {focusArea} Explorer
                      </p>
                    </div>

                    {/* Details lists */}
                    <div className="w-full bg-black/45 border border-white/5 rounded-2xl p-4 flex flex-col gap-4 text-left relative z-10">
                      
                      <div className="flex gap-3">
                        <Code2 size={16} className="text-brand-cyber shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-[9px] uppercase font-black tracking-widest text-zinc-500">Core Stack</h4>
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {techStack.map(tech => (
                              <span key={tech} className="text-[9px] bg-zinc-800/40 border border-white/5 text-zinc-300 px-2 py-0.5 rounded font-bold uppercase">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 border-t border-white/5 pt-3">
                        <Target size={16} className="text-brand-level shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-[9px] uppercase font-black tracking-widest text-zinc-500">Active Goals</h4>
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {goals.map(g => (
                              <span key={g} className="text-[9px] bg-zinc-800/40 border border-white/5 text-zinc-300 px-2 py-0.5 rounded font-bold uppercase">
                                {g.replace('Get ', '').replace('Win ', '').replace('Build ', '').replace('Learn ', '')}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 border-t border-white/5 pt-3">
                        <Compass size={16} className="text-brand-xp shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-[9px] uppercase font-black tracking-widest text-zinc-500">Starting Mission</h4>
                          <p className="text-xs text-zinc-200 font-semibold mt-1 leading-snug">
                            {focusArea === 'AI Builder' 
                              ? 'Integrate your first AI Model API (+50 XP)' 
                              : 'Deploy to Vercel in 1-Click (+50 XP)'}
                          </p>
                        </div>
                      </div>

                    </div>

                    <button
                      onClick={handleLaunch}
                      className="w-full relative z-10 py-4 px-4 rounded-xl bg-gradient-to-r from-brand-xp via-brand-cyber to-brand-level text-black text-xs font-black uppercase tracking-widest shadow-[0_4px_20px_rgba(0,255,204,0.35)] hover:shadow-[0_4px_30px_rgba(0,255,204,0.5)] active:scale-95 transition-all duration-200 flex items-center justify-center gap-1.5"
                    >
                      Enter Builder Studio <ShieldCheck size={14} />
                    </button>

                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
