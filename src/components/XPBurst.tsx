'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ShieldAlert, Award, Star, Flame } from 'lucide-react';
import { useUserState } from '../context/UserStateContext';

export default function XPBurst() {
  const { 
    xpEarnedAlert, 
    justLeveledUp, 
    setJustLeveledUp, 
    profile 
  } = useUserState();

  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);

  // 1. Listen for Level-up trigger to fire canvas-confetti
  useEffect(() => {
    if (justLeveledUp) {
      // Audio cue simulation (could add real sound later)
      
      // Fire beautiful dual-burst confetti
      const duration = 2.5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 25, spread: 360, ticks: 50, zIndex: 100 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval: any = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        // Confetti shoots from the center bottom of simulated viewport
        confetti({ 
          ...defaults, 
          particleCount, 
          origin: { x: randomInRange(0.4, 0.6), y: randomInRange(0.6, 0.8) } 
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [justLeveledUp]);

  // 2. Generate random particle offsets for XP floaters
  useEffect(() => {
    if (xpEarnedAlert !== null) {
      const newParticles = Array.from({ length: 6 }).map((_, i) => ({
        id: Date.now() + i,
        x: (Math.random() - 0.5) * 80,
        y: (Math.random() - 0.5) * 80
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [xpEarnedAlert]);

  return (
    <>
      {/* A. XP TRANSACTION ALERT (FLOATER) */}
      <AnimatePresence>
        {xpEarnedAlert !== null && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50 overflow-hidden">
            
            {/* Main Floating Glowing Number */}
            <motion.div
              initial={{ scale: 0.5, y: 50, opacity: 0 }}
              animate={{ 
                scale: [1, 1.2, 1], 
                y: -100, 
                opacity: [0, 1, 1, 0] 
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="flex flex-col items-center bg-black/80 backdrop-blur-md border border-brand-xp/30 px-4 py-2 rounded-2xl shadow-[0_0_20px_rgba(0,255,204,0.4)] text-brand-xp font-black text-2xl tracking-wider select-none z-50"
            >
              <span className="flex items-center gap-1">
                +{xpEarnedAlert} XP
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">
                Momentum Gained
              </span>
            </motion.div>

            {/* Glowing Pixel Particles floating outwards */}
            {particles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ x: 0, y: 50, opacity: 0 }}
                animate={{ 
                  x: p.x, 
                  y: -100 + p.y, 
                  opacity: [0, 1, 0],
                  scale: [0.5, 1.2, 0.2]
                }}
                transition={{ duration: 1.3, ease: 'easeOut' }}
                className="absolute w-2 h-2 rounded-full bg-brand-xp shadow-[0_0_6px_#00ffcc] z-40"
              />
            ))}

          </div>
        )}
      </AnimatePresence>

      {/* B. MASSIVE GLASSMORPHIC LEVEL-UP CELEBRATION MODAL */}
      <AnimatePresence>
        {justLeveledUp && profile && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/85 backdrop-blur-lg flex items-center justify-center px-6 z-50 select-none sm:rounded-[40px]"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ type: 'spring', duration: 0.6 }}
              className="w-full max-w-[320px] glass-panel p-6 rounded-3xl text-center relative overflow-hidden flex flex-col items-center gap-4"
            >
              {/* Spinning Radiant Halo */}
              <div className="absolute -top-12 w-48 h-48 bg-brand-level/20 rounded-full blur-3xl z-0 animate-pulse" />

              <div className="w-16 h-16 rounded-full bg-brand-level/10 border-2 border-brand-level flex items-center justify-center text-brand-level relative z-10 shadow-[0_0_20px_rgba(157,78,221,0.4)]">
                <Award size={36} className="animate-bounce" />
              </div>

              <div className="relative z-10">
                <span className="text-[10px] bg-brand-level/20 text-brand-level border border-brand-level/30 px-3 py-1 rounded-full font-bold uppercase tracking-widest">
                  Level Up!
                </span>
                <h2 className="text-3xl font-extrabold text-white mt-3 tracking-tight">
                  LEVEL {profile.level}
                </h2>
                <p className="text-sm text-brand-level font-bold mt-1.5 uppercase tracking-wide">
                  {profile.builderTitle}
                </p>
              </div>

              <p className="text-xs text-zinc-400 px-2 relative z-10 leading-relaxed">
                Your coding radar metrics and builder DNA have recalibrated. You are shipping with high momentum. Keep going!
              </p>

              {/* Stat Upgrades Indicator */}
              <div className="w-full bg-black/40 border border-white/5 rounded-2xl p-3 flex flex-col gap-2 z-10 text-left">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-zinc-400 flex items-center gap-1">
                    <Flame size={12} className="text-brand-streak" /> Streaks Multiplier
                  </span>
                  <span className="font-bold text-white">1.5x XP</span>
                </div>
                <div className="flex items-center justify-between text-[11px] border-t border-white/5 pt-2">
                  <span className="text-zinc-400 flex items-center gap-1">
                    <Star size={12} className="text-brand-xp" /> Current Status
                  </span>
                  <span className="font-bold text-brand-xp">ACTIVE</span>
                </div>
              </div>

              <button
                onClick={() => setJustLeveledUp(false)}
                className="w-full relative z-10 py-3 rounded-xl bg-gradient-to-r from-brand-level to-brand-cyber text-white text-xs font-bold uppercase tracking-wider shadow-[0_4px_15px_rgba(157,78,221,0.4)] hover:shadow-[0_4px_20px_rgba(157,78,221,0.6)] active:scale-95 transition-all duration-200"
              >
                Keep Building ⚡
              </button>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
