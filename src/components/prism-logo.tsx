"use client";

import { motion } from "framer-motion";

export function PrismLogo({ size = 64 }: { size?: number }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      style={{ filter: "drop-shadow(0 0 24px rgba(168,85,247,0.35))" }}
    >
      <defs>
        <linearGradient id="prism-edge" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="20%" stopColor="#fbbf24" />
          <stop offset="40%" stopColor="#34d399" />
          <stop offset="60%" stopColor="#38bdf8" />
          <stop offset="80%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#f472b6" />
        </linearGradient>
        <linearGradient id="prism-face" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
        </linearGradient>
      </defs>
      {/* Triangle prism */}
      <polygon
        points="50,12 88,82 12,82"
        fill="url(#prism-face)"
        stroke="url(#prism-edge)"
        strokeWidth="1.5"
      />
      {/* Inner refraction lines */}
      <line x1="50" y1="12" x2="50" y2="82" stroke="rgba(255,255,255,0.18)" strokeWidth="0.6" />
      <line x1="32" y1="55" x2="68" y2="55" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
    </motion.svg>
  );
}
