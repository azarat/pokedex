"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/lib/game-context";

export default function PokeballSpinner() {
  const { isSpinning } = useGame();

  return (
    <AnimatePresence>
      {isSpinning && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex flex-col items-center gap-6">
            {/* Pokeball spinner */}
            <motion.div
              className="relative w-40 h-40"
              animate={{ rotate: 360 }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {/* Top half - red */}
              <div className="absolute top-0 left-0 w-full h-1/2 rounded-t-full bg-red-500 border-4 border-gray-800" />
              {/* Bottom half - white */}
              <div className="absolute bottom-0 left-0 w-full h-1/2 rounded-b-full bg-white border-4 border-gray-800" />
              {/* Center band */}
              <div className="absolute top-1/2 left-0 w-full h-2 -translate-y-1/2 bg-gray-800" />
              {/* Center button */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white border-4 border-gray-800 z-10">
                <div className="absolute inset-2 rounded-full bg-gray-200 animate-pulse" />
              </div>
            </motion.div>

            {/* Loading text */}
            <motion.p
              className="text-2xl font-bold text-white tracking-widest"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ПОИСК ПОКЕМОНА...
            </motion.p>

            {/* Glowing ring */}
            <motion.div
              className="absolute w-56 h-56 rounded-full border-2 border-cyan-400/50"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.div
              className="absolute w-56 h-56 rounded-full border-2 border-purple-400/50"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0, 0.3],
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
