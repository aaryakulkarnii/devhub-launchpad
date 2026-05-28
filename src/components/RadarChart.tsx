'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface RadarChartProps {
  metrics: {
    coding: number;
    consistency: number;
    community: number;
    learning: number;
    building: number;
  };
}

export default function RadarChart({ metrics }: RadarChartProps) {
  // Center coordinates and radius of the radar SVG
  const cx = 100;
  const cy = 100;
  const r = 65;

  const keys = ['Coding', 'Consistency', 'Community', 'Learning', 'Building'];
  const values = [
    metrics.coding,
    metrics.consistency,
    metrics.community,
    metrics.learning,
    metrics.building,
  ];

  // Radar math: 5 nodes, 72deg angles (2 * PI / 5)
  // Starts straight up: -90 degrees (-PI / 2)
  const getCoordinates = () => {
    return keys.map((_, i) => {
      const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
      const value = Math.max(10, Math.min(100, values[i])); // clamp between 10 and 100
      const distance = (value / 100) * r;
      return {
        x: cx + distance * Math.cos(angle),
        y: cy + distance * Math.sin(angle),
        labelX: cx + (r + 15) * Math.cos(angle),
        labelY: cy + (r + 12) * Math.sin(angle),
        gridX: (fraction: number) => cx + r * fraction * Math.cos(angle),
        gridY: (fraction: number) => cy + r * fraction * Math.sin(angle),
      };
    });
  };

  const pointsData = getCoordinates();

  // Create SVG path string for the polygon
  const polygonPointsStr = pointsData.map(p => `${p.x},${p.y}`).join(' ');

  // Outer grid lines
  const gridFractions = [0.2, 0.4, 0.6, 0.8, 1.0];

  return (
    <div className="w-full flex items-center justify-center p-2 select-none relative">
      
      <svg viewBox="0 0 200 200" className="w-full max-w-[220px] h-auto drop-shadow-[0_0_15px_rgba(0,114,255,0.15)]">
        
        {/* Gradients declarations */}
        <defs>
          <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0072ff" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#00ffcc" stopOpacity="0.0" />
          </radialGradient>
          <linearGradient id="polyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(0, 255, 204, 0.65)" />
            <stop offset="100%" stopColor="rgba(0, 114, 255, 0.65)" />
          </linearGradient>
        </defs>

        {/* 1. Ambient radial circle backdrop */}
        <circle cx={cx} cy={cy} r={r} fill="url(#radarGlow)" />

        {/* 2. Concentric Pentagonal Grids (20% to 100%) */}
        {gridFractions.map((fraction, fIdx) => {
          const gridPoints = pointsData.map(p => `${p.gridX(fraction)},${p.gridY(fraction)}`).join(' ');
          return (
            <polygon
              key={`grid-${fIdx}`}
              points={gridPoints}
              fill="none"
              stroke="rgba(255, 255, 255, 0.04)"
              strokeWidth="0.75"
            />
          );
        })}

        {/* 3. Radial axis lines extending from center to vertices */}
        {pointsData.map((p, i) => (
          <line
            key={`axis-${i}`}
            x1={cx}
            y1={cy}
            x2={p.gridX(1.0)}
            y2={p.gridY(1.0)}
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="0.75"
            strokeDasharray="1,2"
          />
        ))}

        {/* 4. Active Glowing Builder Skill Polygon */}
        <motion.polygon
          points={polygonPointsStr}
          fill="url(#polyGradient)"
          stroke="#00ffcc"
          strokeWidth="1.5"
          strokeLinejoin="round"
          className="shadow-neon-xp"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', duration: 1.0 }}
        />

        {/* 5. Vertices handles/pulsing dots */}
        {pointsData.map((p, i) => (
          <g key={`vertex-${i}`}>
            <circle
              cx={p.x}
              cy={p.y}
              r="2.5"
              fill="#00ffcc"
              className="animate-pulse"
            />
            <circle
              cx={p.x}
              cy={p.y}
              r="5"
              fill="none"
              stroke="rgba(0, 255, 204, 0.4)"
              strokeWidth="1"
              className="scale-105"
            />
          </g>
        ))}

        {/* 6. Dynamic Labels rendering */}
        {pointsData.map((p, i) => {
          // Label tweaks for alignment
          let textAnchor: "end" | "inherit" | "middle" | "start" = 'middle';
          let dy = '0.35em';
          if (p.labelX < cx - 10) textAnchor = 'end';
          else if (p.labelX > cx + 10) textAnchor = 'start';
          if (p.labelY < cy - r) dy = '-0.2em';
          else if (p.labelY > cy + r) dy = '0.8em';

          return (
            <g key={`label-group-${i}`}>
              {/* Text label */}
              <text
                x={p.labelX}
                y={p.labelY}
                textAnchor={textAnchor}
                dy={dy}
                className="fill-zinc-550 dark:fill-zinc-400 tracking-wider uppercase select-none text-[6.5px] font-bold"
              >
                {keys[i]}
              </text>
              {/* Metric numeric value */}
              <text
                x={p.labelX}
                y={p.labelY + (p.labelY > cy + r ? 5 : -5)}
                textAnchor={textAnchor}
                dy={dy}
                className="fill-brand-xp dark:fill-brand-cyber font-mono select-none text-[5.5px] font-black"
              >
                {values[i]}
              </text>
            </g>
          );
        })}

      </svg>
      
    </div>
  );
}
