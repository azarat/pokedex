"use client";

import { motion } from "framer-motion";
import { useGame } from "@/lib/game-context";

interface HeaderProps {
  onOpenCollection: () => void;
}

export default function Header({ onOpenCollection }: HeaderProps) {
  const { collection, totalXP, trainerLevel } = useGame();

  return (
    <motion.header
      className="relative z-20 px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", delay: 0.1 }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 sm:gap-3">
        <motion.div
          className="text-2xl sm:text-3xl"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          ⚡
        </motion.div>
        <div>
          <h1 className="text-lg sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
            ПОКЕДЕКС
          </h1>
          <p className="text-[9px] sm:text-[10px] text-white/30 tracking-[0.2em] sm:tracking-[0.3em] uppercase">
            Рандомайзер
          </p>
        </div>
      </div>

      {/* Stats + Collection btn */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Level badge — compact on mobile */}
        <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/5 border border-white/10">
          <span className="text-yellow-400 text-xs">⚡{trainerLevel}</span>
          <span className="text-white/30 hidden sm:inline">|</span>
          <span className="text-cyan-400 text-xs hidden sm:inline">{totalXP} XP</span>
        </div>

        {/* Collection button */}
        <motion.button
          onClick={onOpenCollection}
          className="relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/5 border border-white/10 text-white/80 cursor-pointer"
          whileHover={{
            scale: 1.05,
            backgroundColor: "rgba(255,255,255,0.1)",
            borderColor: "rgba(255,255,255,0.2)",
          }}
          whileTap={{ scale: 0.95 }}
        >
          <span>🎒</span>
          <span className="text-sm font-bold">{collection.length}</span>

          {/* Notification dot */}
          {collection.length > 0 && (
            <motion.div
              className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-400"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </motion.button>
      </div>
    </motion.header>
  );
}
