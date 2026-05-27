'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles, Terminal, BookOpen, Compass, Code } from 'lucide-react';

interface DNAVisualizerProps {
  dna: {
    hacker: number;
    creator: number;
    explorer: number;
    researcher: number;
    leader: number;
    builder: number;
  };
}

export default function DNAVisualizer({ dna }: DNAVisualizerProps) {
  // Normalize DNA to percentages (sum to 100)
  const total = dna.hacker + dna.creator + dna.explorer + dna.researcher + dna.leader + dna.builder || 100;
  const pct = {
    hacker: Math.round((dna.hacker / total) * 100),
    creator: Math.round((dna.creator / total) * 100),
    explorer: Math.round((dna.explorer / total) * 100),
    researcher: Math.round((dna.researcher / total) * 100),
    leader: Math.round((dna.leader / total) * 100),
    builder: Math.round((dna.builder / total) * 100),
  };

  // DNA Class Configurations
  const DNA_METADATA = [
    { key: 'hacker', name: 'Hacker', color: '#39ff14', icon: Terminal, value: pct.hacker },
    { key: 'creator', name: 'Creator', color: '#ff007f', icon: Sparkles, value: pct.creator },
    { key: 'explorer', name: 'Explorer', color: '#00f0ff', icon: Compass, value: pct.explorer },
    { key: 'researcher', name: 'Researcher', color: '#b026ff', icon: BookOpen, value: pct.researcher },
    { key: 'leader', name: 'Leader', color: '#ffd700', icon: Shield, value: pct.leader },
    { key: 'builder', name: 'Builder', color: '#ff5f1f', icon: Code, value: pct.builder },
  ];

  // Sort by highest value to find dominant DNA class
  const dominantDNA = [...DNA_METADATA].sort((a, b) => b.value - a.value)[0];

  return (
    <div className="w-full flex flex-col items-center justify-center p-4 select-none relative gap-5">
      
      {/* 1. The Spinning kinetic glass sphere */}
      <div className="relative w-36 h-36 flex items-center justify-center">
        
        {/* Core Pulsing Glow Backdrop */}
        <div 
          className="absolute inset-2 rounded-full blur-2xl opacity-40 animate-pulse transition-colors duration-500"
          style={{ backgroundColor: dominantDNA.color }}
        />

        {/* Outer Dotted Rotating Orbit */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border border-dashed border-white/10 p-1"
        >
          <div className="w-2 h-2 rounded-full absolute -top-1 left-1/2 -translate-x-1/2" style={{ backgroundColor: dominantDNA.color }} />
        </motion.div>

        {/* Inner Solid Spinning Ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-3 rounded-full border-2 border-white/5 border-t-white/20"
        />

        {/* The Core Glass Orb itself */}
        <div className="absolute inset-6 rounded-full glass-panel flex flex-col items-center justify-center shadow-inner overflow-hidden border border-white/15">
          {/* Floating Energy particles mapping DNA values */}
          {DNA_METADATA.map((d, index) => {
            const scale = 0.4 + (d.value / 100) * 1.2;
            const angle = (index * 2 * Math.PI) / 6;
            const tx = Math.cos(angle) * 16;
            const ty = Math.sin(angle) * 16;

            return (
              <motion.div
                key={d.key}
                initial={{ x: 0, y: 0 }}
                animate={{ 
                  x: [tx, tx * 1.2, tx], 
                  y: [ty, ty * 0.8, ty],
                  scale: [scale, scale * 1.1, scale]
                }}
                transition={{ 
                  duration: 3 + index, 
                  repeat: Infinity, 
                  ease: 'easeInOut' 
                }}
                className="absolute w-3.5 h-3.5 rounded-full blur-[1px] opacity-75"
                style={{ 
                  backgroundColor: d.color, 
                  boxShadow: `0 0 10px ${d.color}` 
                }}
              />
            );
          })}

          {/* Central Active Core Icon */}
          <div className="relative z-10 flex flex-col items-center gap-0.5 pointer-events-none">
            {React.createElement(dominantDNA.icon, {
              size: 18,
              style: { color: dominantDNA.color },
              className: "drop-shadow-[0_0_8px_currentColor] animate-bounce"
            })}
            <span className="text-[9px] font-black text-white uppercase tracking-wider">
              {pct[dominantDNA.key as keyof typeof pct]}%
            </span>
          </div>

        </div>

      </div>

      {/* 2. Dominant DNA Summary Text */}
      <div className="text-center">
        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
          Dominant Archetype
        </h3>
        <h2 
          className="text-lg font-black tracking-wide uppercase transition-colors duration-500"
          style={{ color: dominantDNA.color }}
        >
          {dominantDNA.name}
        </h2>
      </div>

      {/* 3. Horizontal Grid list showing DNA distribution percentages */}
      <div className="w-full grid grid-cols-3 gap-2 bg-white/5 border border-white/5 p-3 rounded-2xl">
        {DNA_METADATA.map((d) => (
          <div key={d.key} className="flex flex-col items-center justify-center p-1 bg-black/20 rounded-xl border border-white/5">
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">{d.name}</span>
            <span className="text-xs font-black mt-0.5" style={{ color: d.color }}>
              {d.value}%
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}
