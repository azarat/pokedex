"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useGame } from "@/lib/game-context";
import { fetchPokemon, getRandomPokemonId } from "@/lib/pokemon-api";
import { getRandomTask } from "@/lib/tasks";
import { getPokeballForPokemon, PokeballVariant } from "@/lib/pokeballs";
import Header from "@/components/Header";
import PokemonCard from "@/components/PokemonCard";
import TaskCard from "@/components/TaskCard";
import PokeballSpinner from "@/components/PokeballSpinner";
import CollectionView from "@/components/CollectionView";
import ParticlesBackground from "@/components/ParticlesBackground";
import PokedexFrame from "@/components/PokedexFrame";
import PokeballSVG from "@/components/PokeballSVG";

type GamePhase = "idle" | "reveal" | "task" | "caught";

export default function GameScreen() {
  const {
    currentPokemon,
    currentTask,
    isSpinning,
    setCurrentPokemon,
    setCurrentTask,
    setIsSpinning,
    catchPokemon,
    collection,
    trainerLevel,
  } = useGame();

  const [phase, setPhase] = useState<GamePhase>("idle");
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentBall, setCurrentBall] = useState<PokeballVariant | null>(null);

  const handleRandomize = useCallback(async () => {
    setError(null);
    setPhase("idle");
    setIsSpinning(true);

    try {
      const id = getRandomPokemonId();
      const pokemon = await fetchPokemon(id);

      // Determine Pokeball variant
      const bst = pokemon.stats.reduce((sum, s) => sum + s.value, 0);
      const ball = getPokeballForPokemon(pokemon.types, bst, pokemon.id);
      setCurrentBall(ball);

      // Play cry if available
      if (pokemon.cry) {
        try {
          const audio = new Audio(pokemon.cry);
          audio.volume = 0.3;
          audio.play().catch(() => {});
        } catch {
          // ignore audio errors
        }
      }

      setCurrentPokemon(pokemon);
      setCurrentTask(getRandomTask());
      setIsSpinning(false);

      // Small delay for dramatic reveal
      await new Promise((r) => setTimeout(r, 200));
      setPhase("reveal");
    } catch {
      setIsSpinning(false);
      setError("Не удалось найти покемона! Проверь интернет и попробуй снова.");
    }
  }, [setCurrentPokemon, setCurrentTask, setIsSpinning]);

  const handleShowTask = () => {
    setPhase("task");
  };

  const handleCatch = useCallback(
    (withTask: boolean) => {
      if (!currentPokemon) return;

      catchPokemon(currentPokemon, withTask ? currentTask! : undefined);
      setPhase("caught");

      // 🎉 Confetti!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#22d3ee", "#a855f7", "#ec4899", "#facc15"],
      });

      // Extra confetti for milestone catches
      if ((collection.length + 1) % 10 === 0) {
        setTimeout(() => {
          confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.4 },
          });
        }, 500);
      }
    },
    [currentPokemon, currentTask, catchPokemon, collection.length]
  );

  const handleSkipTask = () => {
    handleCatch(false);
  };

  const handleCompleteTask = () => {
    handleCatch(true);
  };

  const handleNewRound = () => {
    setPhase("idle");
    setCurrentPokemon(null);
    setCurrentTask(null);
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-[#070714] overflow-hidden">
      <ParticlesBackground />
      <PokeballSpinner />
      <CollectionView
        isOpen={collectionOpen}
        onClose={() => setCollectionOpen(false)}
      />

      <Header onOpenCollection={() => setCollectionOpen(true)} />

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-2 sm:px-4 pb-4 sm:pb-8">
        <AnimatePresence mode="wait">
          {/* IDLE PHASE — Pokedex device with spin button */}
          {phase === "idle" && !isSpinning && (
            <motion.div
              key="idle"
              className="flex flex-col items-center gap-6 w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <PokedexFrame
                topLeft={
                  <span className="text-white/50 text-[9px] sm:text-[10px] tracking-widest uppercase">
                    Рандомайзер
                  </span>
                }
              >
                <div className="flex flex-col items-center justify-center py-8 sm:py-12 px-4 sm:px-6 gap-4 sm:gap-6">
                  {/* Futuristic title */}
                  <motion.h2
                    className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-cyan-300 text-center"
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{ duration: 5, repeat: Infinity }}
                    style={{ backgroundSize: "200% 200%" }}
                  >
                    Кто это?!
                  </motion.h2>
                  <p className="text-white/40 text-[11px] sm:text-xs text-center max-w-xs">
                    Нажми покебол, чтобы найти покемона и получить задание для
                    всей семьи!
                  </p>

                  {/* Spinning Pokeball button */}
                  <motion.button
                    onClick={handleRandomize}
                    className="relative group cursor-pointer"
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    disabled={isSpinning}
                  >
                    {/* Glow ring */}
                    <motion.div
                      className="absolute inset-[-12px] rounded-full"
                      style={{
                        background:
                          "conic-gradient(from 0deg, #22d3ee, #a855f7, #ec4899, #facc15, #22d3ee)",
                        filter: "blur(12px)",
                        opacity: 0.35,
                      }}
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />

                    <div className="relative">
                      <PokeballSVG
                        variant={
                          currentBall || {
                            name: "Poké Ball",
                            nameRu: "Покебол",
                            topColor: "#EE1515",
                            bottomColor: "#FFFFFF",
                            bandColor: "#222224",
                            buttonColor: "#FFFFFF",
                            buttonGlow: "#CCCCCC",
                            rarity: 1,
                          }
                        }
                        size={90}
                        animate
                        className="sm:hidden"
                      />
                      <PokeballSVG
                        variant={
                          currentBall || {
                            name: "Poké Ball",
                            nameRu: "Покебол",
                            topColor: "#EE1515",
                            bottomColor: "#FFFFFF",
                            bandColor: "#222224",
                            buttonColor: "#FFFFFF",
                            buttonGlow: "#CCCCCC",
                            rarity: 1,
                          }
                        }
                        size={120}
                        animate
                        className="hidden sm:block"
                      />
                    </div>
                  </motion.button>

                  <span className="text-white/60 text-xs sm:text-sm font-bold tracking-wider uppercase">
                    Крутить!
                  </span>

                  {/* Achievement hints */}
                  {collection.length === 0 ? (
                    <motion.p
                      className="text-cyan-300/40 text-xs text-center"
                      animate={{ opacity: [0.3, 0.7, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      👆 Нажми, чтобы начать приключение!
                    </motion.p>
                  ) : collection.length < 10 ? (
                    <p className="text-white/20 text-xs text-center">
                      Поймано: {collection.length} • До награды:{" "}
                      {10 - collection.length}
                    </p>
                  ) : null}
                </div>
              </PokedexFrame>
            </motion.div>
          )}

          {/* REVEAL PHASE — Pokemon inside Pokedex frame */}
          {phase === "reveal" && currentPokemon && (
            <motion.div
              key="reveal"
              className="flex flex-col items-center gap-6 w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <PokemonCard pokemon={currentPokemon} pokeball={currentBall} />

              <div className="flex gap-2 sm:gap-3 w-full max-w-[340px] sm:max-w-sm px-1">
                <motion.button
                  onClick={() => handleCatch(false)}
                  className="flex-1 py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-base text-white/60 bg-white/5 border border-white/10 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {currentBall && (
                    <span className="inline-block mr-1 align-middle">
                      <PokeballSVG variant={currentBall} size={16} />
                    </span>
                  )}
                  Поймать
                </motion.button>
                <motion.button
                  onClick={handleShowTask}
                  className="flex-1 py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-purple-500 to-pink-500 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    boxShadow: "0 4px 20px rgba(168,85,247,0.3)",
                  }}
                >
                  🎯 Задание!
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* TASK PHASE — Show the task */}
          {phase === "task" && currentPokemon && currentTask && (
            <motion.div
              key="task"
              className="flex flex-col items-center gap-6 w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Mini pokemon preview */}
              <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/5 border border-white/10">
                <img
                  src={currentPokemon.sprite}
                  alt={currentPokemon.nameRu}
                  className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                />
                <span className="text-white/80 font-bold text-sm sm:text-base">
                  {currentPokemon.nameRu}
                </span>
                {currentBall && <PokeballSVG variant={currentBall} size={16} />}
              </div>

              <TaskCard
                task={currentTask}
                onComplete={handleCompleteTask}
                onSkip={handleSkipTask}
              />
            </motion.div>
          )}

          {/* CAUGHT PHASE — Celebration with Pokeball */}
          {phase === "caught" && currentPokemon && (
            <motion.div
              key="caught"
              className="flex flex-col items-center gap-4 sm:gap-5 px-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Pokeball catch animation */}
              {currentBall && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", duration: 0.8 }}
                >
                  <PokeballSVG variant={currentBall} size={64} animate className="sm:hidden" />
                  <PokeballSVG variant={currentBall} size={80} animate className="hidden sm:block" />
                </motion.div>
              )}

              <motion.div
                className="text-3xl sm:text-4xl"
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{ duration: 0.6 }}
              >
                🎉
              </motion.div>

              <h2 className="text-2xl sm:text-3xl font-black text-white text-center">
                {currentPokemon.nameRu} пойман!
              </h2>

              {currentBall && (
                <p className="text-white/30 text-[11px] sm:text-xs">
                  Использован: {currentBall.nameRu}
                </p>
              )}

              {currentTask && (
                <div className="text-center">
                  <p className="text-green-400 font-bold text-base sm:text-lg">
                    +{currentTask.xpReward} XP
                  </p>
                  <p className="text-white/40 text-xs sm:text-sm mt-1">
                    Задание выполнено!
                  </p>
                </div>
              )}

              <div className="flex items-center gap-2 text-white/50 text-xs sm:text-sm">
                <span>Уровень тренера:</span>
                <span className="text-yellow-400 font-bold">
                  ⚡ {trainerLevel}
                </span>
              </div>

              <motion.button
                onClick={handleNewRound}
                className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-bold text-base sm:text-lg text-white bg-gradient-to-r from-cyan-500 to-purple-500 cursor-pointer"
                style={{
                  boxShadow: "0 4px 25px rgba(34,211,238,0.3)",
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🔄 Ещё покемона!
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="fixed bottom-6 left-3 right-3 sm:bottom-8 sm:left-4 sm:right-4 max-w-sm mx-auto p-3 sm:p-4 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-300 text-center text-xs sm:text-sm"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-2 sm:py-3 text-white/15 text-[10px] sm:text-xs">
        Покедекс Рандомайзер • Данные: PokeAPI
      </footer>
    </div>
  );
}
