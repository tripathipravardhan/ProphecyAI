import React from 'react';
import { motion } from 'framer-motion';

export function BackgroundBeams({ className = '' }) {
  // Beams curved paths anchored around top-left flowing downwards and towards center
  const paths = [
    "M -100 -50 C 150 100, 300 300, 450 750",
    "M -50 -100 C 200 150, 380 400, 520 850",
    "M 0 -150 C 280 200, 420 500, 600 900",
    "M 100 -200 C 350 250, 500 550, 680 950",
    "M -150 50 C 100 250, 250 500, 400 800",
    "M -200 150 C 50 350, 200 600, 350 900"
  ];

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.35,
        maskImage: 'radial-gradient(ellipse 70% 80% at 20% 30%, black 40%, transparent 85%)',
        WebkitMaskImage: 'radial-gradient(ellipse 70% 80% at 20% 30%, black 40%, transparent 85%)'
      }}
      className={`background-beams-container ${className}`}
    >
      <svg
        style={{ width: '100%', height: '100%' }}
        viewBox="0 0 1000 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="cyan-beam-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#62d4e4" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0b0f14" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="cyan-beam-2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8ee8f1" stopOpacity="0.7" />
            <stop offset="60%" stopColor="#62d4e4" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#14323b" stopOpacity="0" />
          </linearGradient>

          <filter id="beam-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient ray lines */}
        {paths.map((path, idx) => (
          <g key={idx}>
            {/* Background trace line */}
            <path
              d={path}
              stroke="rgba(98, 212, 228, 0.08)"
              strokeWidth="1"
              fill="none"
            />

            {/* Moving active beam light */}
            <motion.path
              d={path}
              stroke={idx % 2 === 0 ? "url(#cyan-beam-1)" : "url(#cyan-beam-2)"}
              strokeWidth={idx % 3 === 0 ? "1.8" : "1.2"}
              fill="none"
              filter="url(#beam-glow)"
              initial={{ pathLength: 0.2, strokeDashoffset: 1000 }}
              animate={{
                strokeDashoffset: [-1000, 1000],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{
                duration: 12 + idx * 3,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                strokeDasharray: "250 600"
              }}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}

export default BackgroundBeams;
