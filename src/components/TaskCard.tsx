"use client";

import { motion } from "framer-motion";
import { GameTask, getCategoryLabel, getDifficultyStars } from "@/lib/tasks";

interface TaskCardProps {
  task: GameTask;
  onComplete: () => void;
  onSkip: () => void;
}

export default function TaskCard({ task, onComplete, onSkip }: TaskCardProps) {
  const categoryColors: Record<string, string> = {
    creative: "#F59E0B",
    active: "#10B981",
    brain: "#8B5CF6",
    team: "#3B82F6",
    fun: "#EC4899",
  };

  const color = categoryColors[task.category] || "#888";

  return (
    <motion.div
      className="relative rounded-xl sm:rounded-2xl p-4 sm:p-5 max-w-[340px] sm:max-w-sm mx-auto overflow-hidden w-full"
      style={{
        background: `linear-gradient(145deg, ${color}22, #0a0a1a)`,
        border: `2px solid ${color}55`,
        boxShadow: `0 0 30px ${color}22`,
      }}
      initial={{ y: 50, opacity: 0, scale: 0.9 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ type: "spring", delay: 0.2 }}
    >
      {/* Animated border glow */}
      <motion.div
        className="absolute inset-0 rounded-xl sm:rounded-2xl pointer-events-none"
        style={{
          boxShadow: `inset 0 0 30px ${color}15`,
        }}
        animate={{
          boxShadow: [
            `inset 0 0 30px ${color}15`,
            `inset 0 0 50px ${color}25`,
            `inset 0 0 30px ${color}15`,
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Category badge */}
      <div className="flex justify-between items-center mb-2 sm:mb-3">
        <span
          className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold"
          style={{ background: `${color}33`, color }}
        >
          {getCategoryLabel(task.category)}
        </span>
        <span className="text-xs sm:text-sm">{getDifficultyStars(task.difficulty)}</span>
      </div>

      {/* Task emoji */}
      <div className="text-4xl sm:text-5xl text-center mb-2 sm:mb-3">{task.emoji}</div>

      {/* Title */}
      <h3 className="text-lg sm:text-xl font-black text-white text-center mb-1.5 sm:mb-2">
        {task.titleRu}
      </h3>

      {/* Description */}
      <p className="text-xs sm:text-sm text-white/70 text-center mb-3 sm:mb-4 leading-relaxed">
        {task.descriptionRu}
      </p>

      {/* XP Reward */}
      <div className="text-center mb-3 sm:mb-4">
        <span
          className="inline-block px-3 sm:px-4 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-bold"
          style={{ background: `${color}22`, color }}
        >
          +{task.xpReward} XP
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-2 sm:gap-3">
        <motion.button
          onClick={onSkip}
          className="flex-1 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white/50 bg-white/5 border border-white/10 cursor-pointer"
          whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
          whileTap={{ scale: 0.98 }}
        >
          Пропустить
        </motion.button>
        <motion.button
          onClick={onComplete}
          className="flex-1 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white cursor-pointer"
          style={{
            background: `linear-gradient(135deg, ${color}, ${color}bb)`,
            boxShadow: `0 4px 15px ${color}44`,
          }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          ✅ Выполнено!
        </motion.button>
      </div>
    </motion.div>
  );
}
