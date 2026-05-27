'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, ArrowRight, ArrowLeft, Target, 
  Sparkles, ShieldCheck, Compass, CheckCircle2 
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
  const [excites, setExcites] = useState<string[]>([]);
  
  // Terminal compilation loading state for Screen 4
  const [isCompiling, setIsCompiling] = useState(true);
  const [compilingIndex, setCompilingIndex] = useState(0);

  const compilingLogs = [
    'Initializing DevHub core vectors...',
    'Calibrating builder ambition index...',
    'Generating 6-dimensional Radar coordinates...',
    'Mapping Builder DNA helix parameters...',
    'Injecting Level 1 Starter Daily Missions...',
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
      }, 500);
      return () => clearInterval(interval);
    }
  }, [step, isCompiling, compilingLogs.length]);

  const handleNextStep = () => {
    if (step === 1 && (!name.trim() || !focusArea)) return;
    if (step === 2 && !stage) return;
    if (step === 3 && excites.length === 0) return;
    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setStep(prev => prev - 1);
  };

  // Submit and enter Launchpad
  const handleLaunch = () => {
    onboardUser(name, focusArea, stage, excites.join(', '));
    router.push('/home');
  };
  // Onboarding Options Configs
  const focusCards = [
    { id: 'AI Builder', label: 'AI Builder', desc: 'LLM agents, models & neural wrappers', color: 'border-brand-xp' },
    { id: 'Web Builder', label: 'Web Builder', desc: 'Premium responsive UI & scalable backends', color: 'border-brand-cyber' },
    { id: 'Cybersecurity', label: 'Cybersecurity', desc: 'Secure APIs, encryption & whitehat hacking', color: 'border-brand-level' },
    { id: 'Data Science', label: 'Data Science', desc: 'Data structures, math & python analysis', color: 'border-yellow-500' },
    { id: 'App Developer', label: 'App Developer', desc: 'Responsive mobile UX & iOS layouts', color: 'border-teal-500' }
  ];

  const stageOptions = [
    { id: 'Just Starting', label: 'Just Starting', desc: 'I am learning foundations' },
    { id: 'Built Some Projects', label: 'Built Some Projects', desc: 'I have shipped simple code blocks' },
    { id: 'Hackathon Builder', label: 'Hackathon Builder', desc: 'I love shipping in 36-hour sprints' },
    { id: 'Internship Ready', label: 'Internship Ready', desc: 'I want to join high-growth tech teams' }
  ];

  const excitesOptions = [
    { id: 'Build Projects', label: 'Build Projects', desc: 'Build real-world projects and ship updates' },
    { id: 'Get Internship', label: 'Get Internship', desc: 'Secure internships at fast-paced tech cells' },
    { id: 'Win Hackathons', label: 'Win Hackathons', desc: 'Compete and build in 36-hour sprint challenges' },
    { id: 'Learn New Skills', label: 'Learn New Skills', desc: 'Master new frameworks and programming systems' }
  ];

  // Motion variants for smooth slide animation
  const slideVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  return (
    <div className="flex-1 flex flex-col px-5 py-6 select-none relative z-10">
      
      {/* Back arrow for early steps */}
      {step > 1 && step < 4 && (
        <button 
          onClick={handlePrevStep}
          className="self-start text-zinc-500 hover:text-zinc-300 py-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors duration-150"
        >
          ← Previous Step
        </button>
      )}
      <div className="flex-1 flex flex-col justify-center mt-2">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: NAME INPUT & FOCUS AREA */}
          {step === 1 && (
            <motion.div
              key="step-1"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-5"
            >
              <div>
                <span className="text-[9px] bg-brand-xp/10 text-brand-xp border border-brand-xp/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">
                  Step 1 of 4
                </span>
                <h1 className="text-xl font-black text-white tracking-tight mt-3">
                  What is your name & focus area?
                </h1>
                <p className="text-xs text-zinc-400 mt-1 font-medium leading-relaxed">
                  We use this to construct your specialized Builder Identity and recommended moves.
                </p>
              </div>

              {/* Glowing Name Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Builder Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name (e.g. Aarya)"
                  maxLength={18}
                  className="w-full bg-black/45 border border-white/8 rounded-2xl px-4 py-3 text-sm text-white font-semibold placeholder-zinc-600 focus:outline-none focus:border-brand-xp focus:shadow-[0_0_12px_rgba(0,255,204,0.15)] transition-all duration-200"
                />
              </div>

              {/* Focus cards list */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Select Focus Domain</label>
                <div className="grid grid-cols-2 gap-2.5">
                  {focusCards.map((card) => {
                    const isSelected = focusArea === card.id;
                    return (
                      <button
                        key={card.id}
                        onClick={() => {
                          setFocusArea(card.id);
                          // Auto advance if name is already populated!
                          if (name.trim()) {
                            setTimeout(() => setStep(2), 250);
                          }
                        }}
                        className={`glass-panel p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all duration-300 ${
                          isSelected
                            ? `border-brand-xp bg-brand-xp/5 shadow-[0_0_15px_rgba(0,255,204,0.15)]`
                            : 'border-white/5 hover:border-white/10 bg-black/20'
                        }`}
                      >
                        <span className={`text-xs font-black ${isSelected ? 'text-brand-xp' : 'text-white'}`}>
                          {card.label}
                        </span>
                        <span className="text-[9px] text-zinc-500 font-bold leading-normal">
                          {card.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bouncy Action button */}
              <button
                onClick={handleNextStep}
                disabled={!name.trim() || !focusArea}
                className="w-full mt-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-brand-xp to-brand-cyber text-black disabled:opacity-50 disabled:pointer-events-none active:scale-98 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200"
              >
                Unlock Stages <ArrowRight size={14} />
              </button>

            </motion.div>
          )}

          {/* STEP 2: STAGE SELECTION */}
          {step === 2 && (
            <motion.div
              key="step-2"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-5"
            >
              <div>
                <span className="text-[9px] bg-brand-cyber/10 text-brand-cyber border border-brand-cyber/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">
                  Step 2 of 4
                </span>
                <h1 className="text-xl font-black text-white tracking-tight mt-3">
                  What is your current builder stage?
                </h1>
                <p className="text-xs text-zinc-400 mt-1 font-medium leading-relaxed">
                  We adapt starting radar metric values based on your practical shipping index.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                {stageOptions.map((opt) => {
                  const isSelected = stage === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setStage(opt.id);
                        setTimeout(() => setStep(3), 250);
                      }}
                      className={`w-full glass-panel p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all duration-300 ${
                        isSelected
                          ? 'border-brand-cyber bg-brand-cyber/5 shadow-[0_0_15px_rgba(0,114,255,0.15)]'
                          : 'border-white/5 hover:border-white/10 bg-black/20'
                      }`}
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className={`text-xs font-black ${isSelected ? 'text-brand-cyber' : 'text-white'}`}>
                          {opt.label}
                        </span>
                        <span className="text-[9px] text-zinc-500 font-bold leading-normal">
                          {opt.desc}
                        </span>
                      </div>
                      {isSelected && <CheckCircle2 size={16} className="text-brand-cyber" />}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleNextStep}
                disabled={!stage}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-brand-cyber to-brand-level text-white disabled:opacity-50 disabled:pointer-events-none active:scale-98 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200"
              >
                Define Exciters <ArrowRight size={14} />
              </button>
            </motion.div>
          )}

          {/* STEP 3: EXCITEMENT FACTOR */}
          {step === 3 && (
            <motion.div
              key="step-3"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-5"
            >
              <div>
                <span className="text-[9px] bg-brand-level/10 text-brand-level border border-brand-level/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">
                  Step 3 of 4
                </span>
                <h1 className="text-xl font-black text-white tracking-tight mt-3">
                  What excites you most?
                </h1>
                <p className="text-xs text-zinc-400 mt-1 font-medium leading-relaxed">
                  We generate your Builder DNA composition helix percentages from these drivers.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                {excitesOptions.map((opt) => {
                  const isSelected = excites.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setExcites((prev) => {
                          if (prev.includes(opt.id)) {
                            return prev.filter((id) => id !== opt.id);
                          }
                          return [...prev, opt.id];
                        });
                      }}
                      className={`w-full glass-panel p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all duration-300 ${
                        isSelected
                          ? 'border-brand-level bg-brand-level/5 shadow-[0_0_15px_rgba(157,78,221,0.15)]'
                          : 'border-white/5 hover:border-white/10 bg-black/20'
                      }`}
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className={`text-xs font-black ${isSelected ? 'text-brand-level' : 'text-white'}`}>
                          {opt.label}
                        </span>
                        <span className="text-[9px] text-zinc-500 font-bold leading-normal">
                          {opt.desc}
                        </span>
                      </div>
                      {isSelected && <CheckCircle2 size={16} className="text-brand-level" />}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleNextStep}
                disabled={excites.length === 0}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-brand-level to-brand-xp text-white disabled:opacity-50 disabled:pointer-events-none active:scale-98 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200"
              >
                Compile Identity <ArrowRight size={14} />
              </button>
            </motion.div>
          )}

          {/* STEP 4: IDENTITY REVEAL & COMPILING */}
          {step === 4 && (
            <motion.div
              key="step-4"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex-1 flex flex-col gap-5 justify-center"
            >
              <AnimatePresence mode="wait">
                {isCompiling ? (
                  /* Loading Compile Terminal View */
                  <motion.div
                    key="compiling"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="glass-panel p-5 rounded-2xl border border-white/5 font-mono text-[10px] text-zinc-400 flex flex-col gap-3 max-w-[340px] mx-auto w-full select-none"
                  >
                    <div className="flex items-center gap-1.5 pb-2.5 border-b border-white/5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                      <span className="text-[9px] uppercase font-bold text-zinc-500 ml-1.5">DevHub Console</span>
                    </div>

                    <div className="flex flex-col gap-2 min-h-[140px]">
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
                        transition={{ duration: 3 }}
                        className="bg-brand-xp h-full shadow-[0_0_8px_#00ffcc]"
                      />
                    </div>
                  </motion.div>
                ) : (
                  /* Dopamine Profile Identity Disclosure Card */
                  <motion.div
                    key="disclosure"
                    initial={{ opacity: 0, scale: 0.9, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: 'spring', duration: 0.5 }}
                    className="glass-panel p-5 rounded-3xl border border-white/10 text-center relative overflow-hidden flex flex-col items-center gap-4 max-w-[340px] mx-auto w-full select-none"
                  >
                    {/* Glowing highlight core */}
                    <div className="absolute -top-12 w-48 h-48 bg-brand-xp/10 rounded-full blur-3xl" />

                    <span className="text-[9px] bg-brand-xp/20 text-brand-xp border border-brand-xp/30 px-3 py-1 rounded-full font-bold uppercase tracking-widest relative z-10">
                      Identity Generated
                    </span>

                    {/* Avatar Ring */}
                    <div className="w-16 h-16 rounded-full border-2 border-brand-xp p-1 relative z-10 shadow-[0_0_15px_rgba(0,255,204,0.3)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(name)}`} 
                        alt="avatar" 
                        className="w-full h-full rounded-full object-cover bg-black"
                      />
                    </div>

                    <div className="relative z-10">
                      <h2 className="text-xl font-black text-white tracking-tight leading-none">
                        {name}
                      </h2>
                      <p className="text-xs text-brand-xp font-bold mt-1.5 uppercase tracking-wide">
                        Lvl 1 {focusArea.replace(' Builder', '').replace(' Contributor', '')} Explorer
                      </p>
                    </div>

                    {/* Starter pack description lists */}
                    <div className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 flex flex-col gap-3.5 text-left relative z-10">
                      
                      <div className="flex gap-3">
                        <Target size={16} className="text-brand-cyber shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-[10px] uppercase font-black tracking-widest text-zinc-500">Starting Mission</h4>
                          <p className="text-xs text-zinc-200 font-semibold mt-0.5 leading-snug">
                            {focusArea === 'AI Builder' 
                              ? 'Integrate your first AI Model API' 
                              : focusArea === 'Web Builder'
                              ? 'Deploy to Vercel in 1-Click'
                              : 'Create a Glassmorphic Mobile Card UI'}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3 border-t border-white/5 pt-3">
                        <Compass size={16} className="text-brand-level shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-[10px] uppercase font-black tracking-widest text-zinc-500">Starter Path Recommendation</h4>
                          <p className="text-xs text-zinc-400 font-medium mt-0.5 leading-relaxed">
                            Master React, publish GitHub repos, log daily momentum logs, register for YC startup intern challenges.
                          </p>
                        </div>
                      </div>

                    </div>

                    <button
                      onClick={handleLaunch}
                      className="w-full relative z-10 py-3.5 px-4 rounded-xl bg-gradient-to-r from-brand-xp to-brand-cyber text-black text-xs font-bold uppercase tracking-wider shadow-[0_4px_15px_rgba(0,255,204,0.3)] hover:shadow-[0_4px_20px_rgba(0,255,204,0.5)] active:scale-95 transition-all duration-200 flex items-center justify-center gap-1.5"
                    >
                      Enter Launchpad <ShieldCheck size={14} />
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
