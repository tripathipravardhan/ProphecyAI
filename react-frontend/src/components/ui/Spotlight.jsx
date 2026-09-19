import React from 'react';
import { motion } from 'framer-motion';

export function Spotlight({ className = '', fill = '#62d4e4' }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ 
        opacity: [0.35, 0.55, 0.35],
        scale: [1, 1.04, 1],
        x: [-5, 10, -5],
        y: [-5, 5, -5]
      }}
      transition={{
        duration: 12,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut'
      }}
      style={{
        position: 'absolute',
        top: '-20%',
        left: '-15%',
        width: '120%',
        maxWidth: '850px',
        height: '140%',
        pointerEvents: 'none',
        zIndex: 1,
        overflow: 'visible'
      }}
      className={`spotlight-glow-wrapper ${className}`}
    >
      <svg
        style={{ width: '100%', height: '100%', overflow: 'visible' }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 3787 2842"
        fill="none"
      >
        <g filter="url(#spotlight-filter)">
          <ellipse
            cx="1924.71"
            cy="273.501"
            rx="1924.71"
            ry="273.501"
            transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
            fill={fill}
            fillOpacity="0.28"
          />
          <ellipse
            cx="1700"
            cy="400"
            rx="1300"
            ry="240"
            transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3400 2100)"
            fill="#38bdf8"
            fillOpacity="0.16"
          />
        </g>
        <defs>
          <filter
            id="spotlight-filter"
            x="0"
            y="0"
            width="3785"
            height="2840"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="150"
              result="effect1_foregroundBlur"
            />
          </filter>
        </defs>
      </svg>
    </motion.div>
  );
}

export default Spotlight;
