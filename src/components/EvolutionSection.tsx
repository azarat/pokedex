"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { EvolutionTarget, fetchEvolutionTargets } from "@/lib/evolutions";

interface EvolutionSectionProps {
  pokemonId: number;
  availableXP: number;
  onEvolve: (target: EvolutionTarget) => void;
  evolving: boolean;
  compact?: boolean;
}

export default function EvolutionSection({
  pokemonId,
  availableXP,
  onEvolve,
  evolving,
  compact = false,
}: EvolutionSectionProps) {
  const [targets, setTargets] = useState<EvolutionTarget[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setTargets([]);
    fetchEvolutionTargets(pokemonId)
      .then((t) => {
        if (!cancelled) setTargets(t);
      })
      .catch(() => {
        if (!cancelled) setTargets([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [pokemonId]);

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center gap-2 ${compact ? "mt-2" : "mt-3"}`}
      >
        <motion.span
          className="inline-block text-sm"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        >
          ✨
        </motion.span>
        <span className="text-white/30 text-[10px]">
          Проверяем эволюцию...
        </span>
      </div>
    );
  }

  if (targets.length === 0) return null;

  // ─── Compact (mobile bottom sheet) ────────────────────────
  if (compact) {
    return (
      <div className="mt-2 space-y-1.5">
        <p className="text-white/40 text-[9px] font-bold tracking-wider uppercase">
          ✨ Эволюция
        </p>
        {targets.map((target) => {
          const canAfford = availableXP >= target.xpCost;
          return (
            <motion.button
              key={target.id}
              onClick={() => onEvolve(target)}
              disabled={!canAfford || evolving}
              className="w-full flex items-center gap-2 p-1.5 rounded-lg bg-emerald-400/10 border border-emerald-400/20 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              whileTap={{ scale: 0.97 }}
            >
              <Image
                src={target.sprite}
                alt={target.nameRu}
                width={36}
                height={36}
                className="object-contain drop-shadow-md"
              />
              <div className="flex-1 text-left min-w-0">
                <p className="text-white font-bold text-xs truncate">
                  {target.nameRu}
                </p>
                <p className="text-white/30 text-[9px]">{target.methodRu}</p>
              </div>
              <div className="text-right shrink-0">
                <span
                  className={`text-[10px] font-bold ${canAfford ? "text-emerald-400" : "text-red-400"}`}
                >
                  {target.xpCost} XP
                </span>
              </div>
            </motion.button>
          );
        })}
        <p className="text-white/20 text-[8px] text-center">
          Доступно: {availableXP} XP
        </p>
      </div>
    );
  }

  // ─── Desktop (left panel) ─────────────────────────────────
  return (
    <div className="w-full max-w-[220px] mt-4">
      <h4 className="text-white/50 text-[10px] font-bold tracking-wider uppercase text-center mb-2">
        ✨ Эволюция
      </h4>

      <AnimatePresence>
        {targets.map((target) => {
          const canAfford = availableXP >= target.xpCost;
          return (
            <motion.button
              key={target.id}
              onClick={() => onEvolve(target)}
              disabled={!canAfford || evolving}
              className="w-full flex items-center gap-2.5 p-2.5 rounded-xl bg-emerald-400/10 border border-emerald-400/20 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed group mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={
                canAfford && !evolving
                  ? { scale: 1.03, borderColor: "rgba(52,211,153,0.5)" }
                  : {}
              }
              whileTap={canAfford && !evolving ? { scale: 0.97 } : {}}
            >
              {/* Target sprite with float animation */}
              <motion.div
                className="shrink-0"
                animate={
                  canAfford && !evolving ? { y: [0, -3, 0] } : {}
                }
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Image
                  src={target.sprite}
                  alt={target.nameRu}
                  width={52}
                  height={52}
                  className="object-contain drop-shadow-lg"
                />
              </motion.div>

              {/* Info */}
              <div className="flex-1 text-left min-w-0">
                <p className="text-white font-bold text-sm truncate">
                  {target.nameRu}
                </p>
                <p className="text-white/30 text-[10px]">
                  {target.methodRu}
                </p>
                <p
                  className={`text-xs font-bold mt-0.5 ${canAfford ? "text-emerald-400" : "text-red-400"}`}
                >
                  {target.xpCost} XP
                </p>
              </div>

              {/* Arrow indicator */}
              {canAfford && !evolving && (
                <motion.span
                  className="text-emerald-400 text-lg shrink-0"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  ⬆
                </motion.span>
              )}

              {/* Evolving spinner */}
              {evolving && (
                <motion.span
                  className="text-sm shrink-0"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  ✨
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </AnimatePresence>

      <p className="text-white/20 text-[9px] text-center mt-1">
        Доступно: {availableXP} XP
      </p>
    </div>
  );
}
