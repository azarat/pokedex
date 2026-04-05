"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface PokedexFrameProps {
  children: ReactNode;
  topLeft?: ReactNode;
  topRight?: ReactNode;
}

// Pokedex device frame inspired by the anime-style rotom phone Pokédex
export default function PokedexFrame({
  children,
  topLeft,
  topRight,
}: PokedexFrameProps) {
  return (
    <div className="relative mx-auto w-full max-w-md px-1 sm:px-0">
      {/* Outer device shell */}
      <div
        className="relative rounded-[1.5rem] sm:rounded-[2rem] p-[4px] sm:p-[6px]"
        style={{
          background: "linear-gradient(145deg, #DC2626, #991B1B, #7F1D1D)",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2), 0 0 60px rgba(220,38,38,0.15)",
        }}
      >
        {/* Inner bevel */}
        <div
          className="rounded-[1.3rem] sm:rounded-[1.7rem] p-[2px] sm:p-[3px]"
          style={{
            background: "linear-gradient(145deg, #B91C1C, #991B1B)",
          }}
        >
          {/* Top decoration bar */}
          <div className="flex items-center justify-between px-3 sm:px-4 py-1.5 sm:py-2">
            {/* Camera lens (like the Pokedex blue lens) */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <motion.div
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white/30"
                style={{
                  background:
                    "radial-gradient(circle at 35% 35%, #67E8F9, #06B6D4, #0E7490)",
                  boxShadow:
                    "0 0 10px rgba(6,182,212,0.5), inset 0 -2px 4px rgba(0,0,0,0.3)",
                }}
                animate={{
                  boxShadow: [
                    "0 0 10px rgba(6,182,212,0.3), inset 0 -2px 4px rgba(0,0,0,0.3)",
                    "0 0 20px rgba(6,182,212,0.6), inset 0 -2px 4px rgba(0,0,0,0.3)",
                    "0 0 10px rgba(6,182,212,0.3), inset 0 -2px 4px rgba(0,0,0,0.3)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div className="flex gap-1 sm:gap-1.5">
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-400/80" />
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-yellow-400/80" />
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-green-400/80" />
              </div>
            </div>
            {/* Title / status */}
            <div className="flex items-center gap-2 sm:gap-3">
              {topLeft}
              {topRight}
            </div>
          </div>

          {/* Screen area */}
          <div
            className="relative mx-1.5 sm:mx-2 mb-1.5 sm:mb-2 rounded-xl sm:rounded-2xl overflow-hidden"
            style={{
              background:
                "linear-gradient(160deg, #0C4A6E, #164E63, #083344)",
              boxShadow:
                "inset 0 2px 8px rgba(0,0,0,0.5), inset 0 0 30px rgba(6,182,212,0.05)",
            }}
          >
            {/* Screen scanlines overlay */}
            <div
              className="absolute inset-0 pointer-events-none z-20 opacity-[0.03]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 4px)",
              }}
            />

            {/* Blue holographic grid background */}
            <div
              className="absolute inset-0 pointer-events-none z-10 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(34,211,238,0.3) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(34,211,238,0.3) 1px, transparent 1px)
                `,
                backgroundSize: "28px 28px",
              }}
            />

            {/* Sparkles / stars */}
            <div className="absolute inset-0 pointer-events-none z-10">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-white/60"
                  style={{
                    left: `${10 + ((i * 37) % 80)}%`,
                    top: `${8 + ((i * 53) % 84)}%`,
                  }}
                  animate={{
                    opacity: [0, 0.8, 0],
                    scale: [0.5, 1.2, 0.5],
                  }}
                  transition={{
                    duration: 2 + (i % 3),
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                />
              ))}
            </div>

            {/* Content */}
            <div className="relative z-15 min-h-[320px] sm:min-h-[400px]">{children}</div>
          </div>

          {/* Bottom controls */}
          <div className="flex items-center justify-between px-3 sm:px-4 py-1.5 sm:py-2">
            {/* D-pad */}
            <div className="relative w-10 h-10 sm:w-14 sm:h-14">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3.5 sm:w-4 sm:h-5 rounded-t-sm bg-gray-800" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3.5 sm:w-4 sm:h-5 rounded-b-sm bg-gray-800" />
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3.5 h-3 sm:w-5 sm:h-4 rounded-l-sm bg-gray-800" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3 sm:w-5 sm:h-4 rounded-r-sm bg-gray-800" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 bg-gray-700" />
            </div>

            {/* Pokeball logo */}
            <div className="relative w-5 h-5 sm:w-6 sm:h-6">
              <div className="absolute top-0 left-0 w-full h-1/2 rounded-t-full bg-white/20" />
              <div className="absolute bottom-0 left-0 w-full h-1/2 rounded-b-full bg-white/10" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white/30" />
            </div>

            {/* Action buttons */}
            <div className="flex gap-1.5 sm:gap-2">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gray-800 border border-gray-600" />
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gray-800 border border-gray-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
