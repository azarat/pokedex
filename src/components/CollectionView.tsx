"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useGame, CaughtPokemon } from "@/lib/game-context";
import { TYPE_COLORS, fetchPokemon } from "@/lib/pokemon-api";
import { getPokeballForPokemon } from "@/lib/pokeballs";
import { EvolutionTarget } from "@/lib/evolutions";
import PokeballSVG from "./PokeballSVG";
import EvolutionSection from "./EvolutionSection";

interface CollectionViewProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CollectionView({ isOpen, onClose }: CollectionViewProps) {
  const { collection, totalXP, availableXP, trainerLevel, clearCollection, evolvePokemon, exportProgress, importProgress } = useGame();
  const [selected, setSelected] = useState<CaughtPokemon | null>(null);
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);
  const [evolving, setEvolving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await importProgress(file);
      setSelected(null);
    } catch {
      alert("Ошибка: неверный файл сохранения");
    }
    // Reset so same file can be re-selected
    e.target.value = "";
  }, [importProgress]);

  const handleEvolve = useCallback(
    async (target: EvolutionTarget) => {
      if (!selectedPokemonRef || availableXP < target.xpCost || evolving) return;
      setEvolving(true);
      try {
        const evolvedData = await fetchPokemon(target.id);
        evolvePokemon(selectedPokemonRef.id, evolvedData, target.xpCost);
        // Switch selection to evolved form
        setSelected({
          ...evolvedData,
          caughtAt: selectedPokemonRef.caughtAt,
          taskCompleted: selectedPokemonRef.taskCompleted,
          xpEarned: selectedPokemonRef.xpEarned,
          evolvedFrom: selectedPokemonRef.id,
        } as CaughtPokemon);
        // Celebration!
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.5 },
          colors: ["#34d399", "#a78bfa", "#fbbf24", "#22d3ee"],
        });
      } catch (err) {
        console.error("Evolution failed:", err);
      } finally {
        setEvolving(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [availableXP, evolving, evolvePokemon]
  );

  // Deduplicate — keep latest catch of each species
  const uniqueMap = new Map<number, CaughtPokemon>();
  collection.forEach((p) => {
    if (!uniqueMap.has(p.id) || p.caughtAt > uniqueMap.get(p.id)!.caughtAt) {
      uniqueMap.set(p.id, p);
    }
  });
  const uniqueList = Array.from(uniqueMap.values()).sort((a, b) => a.id - b.id);
  const uniqueCount = uniqueList.length;

  // Auto-select first if nothing selected
  const selectedPokemon =
    selected && uniqueMap.has(selected.id) ? selected : uniqueList[0] || null;

  // Stable ref for the evolve handler (avoid stale closure)
  const selectedPokemonRef = selectedPokemon;

  const handleSelect = (pokemon: CaughtPokemon) => {
    setSelected(pokemon);
    setMobilePreviewOpen(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-40 bg-black/90 backdrop-blur-md overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Pokedex device frame */}
          <div className="h-full flex flex-col">
            {/* Top bar */}
            <div
              className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 shrink-0"
              style={{
                background: "linear-gradient(145deg, #DC2626, #991B1B)",
              }}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Blue camera lens */}
                <motion.div
                  className="w-5 h-5 sm:w-7 sm:h-7 rounded-full border-2 border-white/30"
                  style={{
                    background:
                      "radial-gradient(circle at 35% 35%, #67E8F9, #06B6D4, #0E7490)",
                    boxShadow: "0 0 10px rgba(6,182,212,0.5)",
                  }}
                  animate={{
                    boxShadow: [
                      "0 0 10px rgba(6,182,212,0.3)",
                      "0 0 20px rgba(6,182,212,0.6)",
                      "0 0 10px rgba(6,182,212,0.3)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <h2 className="text-base sm:text-lg font-black text-white tracking-wider">
                  ПОКЕДЕКС
                </h2>
              </div>

              <div className="flex items-center gap-2 sm:gap-4">
                {/* Caught / total */}
                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-400" />
                    <span className="text-white font-bold">{uniqueCount}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white/40" />
                    <span className="text-white/60">{collection.length}</span>
                  </span>
                </div>

                {/* Sort label */}
                <span className="text-white/40 text-xs hidden sm:block">
                  По номеру
                </span>

                <motion.button
                  onClick={onClose}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 flex items-center justify-center text-white/80 text-xs sm:text-sm font-bold cursor-pointer"
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
                  whileTap={{ scale: 0.9 }}
                >
                  ✕
                </motion.button>
              </div>
            </div>

            {/* Main content — split layout */}
            <div className="flex-1 flex overflow-hidden relative">
              {/* LEFT PANEL — Selected Pokemon Preview */}
              <div
                className="hidden sm:flex flex-col items-center justify-center w-2/5 relative"
                style={{
                  background:
                    "linear-gradient(160deg, #0C4A6E, #164E63, #083344)",
                }}
              >
                {/* Holographic grid */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-15"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(34,211,238,0.4) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(34,211,238,0.4) 1px, transparent 1px)
                    `,
                    backgroundSize: "32px 32px",
                  }}
                />

                {/* Sparkle stars */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1.5 h-1.5 rounded-full bg-white/50"
                    style={{
                      left: `${12 + ((i * 41) % 76)}%`,
                      top: `${10 + ((i * 59) % 80)}%`,
                    }}
                    animate={{ opacity: [0, 0.7, 0], scale: [0.5, 1.3, 0.5] }}
                    transition={{
                      duration: 2.5 + (i % 3),
                      repeat: Infinity,
                      delay: i * 0.4,
                    }}
                  />
                ))}

                {/* Circular scan ring */}
                <motion.div
                  className="absolute w-56 h-56 rounded-full border border-cyan-400/20"
                  animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />

                <AnimatePresence mode="wait">
                  {selectedPokemon ? (
                    <motion.div
                      key={selectedPokemon.id}
                      className="relative z-10 flex flex-col items-center gap-3 p-6"
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ type: "spring", duration: 0.5 }}
                    >
                      {/* Pokemon image with float animation */}
                      <motion.div
                        className="relative"
                        animate={{ y: [0, -10, 0] }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <Image
                          src={selectedPokemon.sprite}
                          alt={selectedPokemon.nameRu}
                          width={180}
                          height={180}
                          className="object-contain drop-shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                          priority
                        />
                      </motion.div>

                      {/* Shadow under pokemon */}
                      <div
                        className="w-24 h-3 rounded-full blur-sm -mt-2"
                        style={{
                          background: `${
                            TYPE_COLORS[selectedPokemon.types[0]] || "#22d3ee"
                          }33`,
                        }}
                      />

                      {/* Number badge */}
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/30 border border-white/10">
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        <span className="text-white/80 font-mono text-sm font-bold">
                          {String(selectedPokemon.id).padStart(3, "0")}
                        </span>
                      </div>

                      {/* Name */}
                      <h3 className="text-2xl font-black text-white text-center">
                        {selectedPokemon.nameRu}
                      </h3>

                      {/* Types */}
                      <div className="flex gap-2">
                        {selectedPokemon.typesRu.map((type, i) => (
                          <span
                            key={type}
                            className="px-2.5 py-0.5 rounded-full text-xs font-bold text-white/90 uppercase"
                            style={{
                              background: `${
                                TYPE_COLORS[selectedPokemon.types[i]] ||
                                "#888"
                              }88`,
                            }}
                          >
                            {type}
                          </span>
                        ))}
                      </div>

                      {/* Pokeball used */}
                      {(() => {
                        const bst = selectedPokemon.stats.reduce(
                          (sum, s) => sum + s.value,
                          0
                        );
                        const ball = getPokeballForPokemon(
                          selectedPokemon.types,
                          bst,
                          selectedPokemon.id
                        );
                        return (
                          <div className="flex items-center gap-2 mt-1">
                            <PokeballSVG variant={ball} size={22} />
                            <span className="text-white/50 text-xs">
                              {ball.nameRu}
                            </span>
                          </div>
                        );
                      })()}

                      {/* Mini stats */}
                      <div className="w-full max-w-[200px] space-y-1 mt-2">
                        {selectedPokemon.stats.slice(0, 3).map((stat) => (
                          <div
                            key={stat.name}
                            className="flex items-center gap-2"
                          >
                            <span className="text-[10px] text-white/40 w-16 text-right truncate">
                              {stat.name}
                            </span>
                            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full rounded-full"
                                style={{
                                  background:
                                    TYPE_COLORS[selectedPokemon.types[0]] ||
                                    "#22d3ee",
                                }}
                                initial={{ width: 0 }}
                                animate={{
                                  width: `${Math.min(
                                    100,
                                    (stat.value / 255) * 100
                                  )}%`,
                                }}
                                transition={{ duration: 0.6 }}
                              />
                            </div>
                            <span className="text-[10px] text-white/60 w-6 font-mono">
                              {stat.value}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Evolution */}
                      <EvolutionSection
                        pokemonId={selectedPokemon.id}
                        availableXP={availableXP}
                        onEvolve={handleEvolve}
                        evolving={evolving}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      className="text-center p-8"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <p className="text-5xl mb-3">🔍</p>
                      <p className="text-white/40 text-sm">
                        Поймай покемонов
                        <br />
                        чтобы заполнить Покедекс!
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* RIGHT PANEL — Pokemon Grid */}
              <div
                className="flex-1 flex flex-col"
                style={{
                  background:
                    "linear-gradient(180deg, #1E3A5F, #172554)",
                }}
              >
                {/* Stats row */}
                <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 sm:py-2 bg-black/20 border-b border-white/5 shrink-0">
                  <div className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg bg-yellow-400/10">
                    <span className="text-yellow-400 text-[10px] sm:text-xs font-bold">
                      ⚡ Ур.{trainerLevel}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg bg-cyan-400/10">
                    <span className="text-cyan-400 text-[10px] sm:text-xs font-bold">
                      💰 {availableXP} XP
                    </span>
                  </div>
                  <div className="flex-1" />
                  {collection.length > 0 && (
                    <motion.button
                      onClick={exportProgress}
                      className="text-[10px] text-emerald-400/60 hover:text-emerald-400 cursor-pointer transition-colors"
                      whileTap={{ scale: 0.95 }}
                      title="Сохранить в файл"
                    >
                      💾 Сохранить
                    </motion.button>
                  )}
                  <motion.button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[10px] text-blue-400/60 hover:text-blue-400 cursor-pointer transition-colors"
                    whileTap={{ scale: 0.95 }}
                    title="Загрузить из файла"
                  >
                    📂 Загрузить
                  </motion.button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={handleImport}
                  />
                  {collection.length > 0 && (
                    <motion.button
                      onClick={() => {
                        if (
                          window.confirm(
                            "Очистить всю коллекцию? Это нельзя отменить!"
                          )
                        ) {
                          clearCollection();
                          setSelected(null);
                        }
                      }}
                      className="text-[10px] text-red-400/40 hover:text-red-400/70 cursor-pointer transition-colors"
                    >
                      Очистить
                    </motion.button>
                  )}
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto p-1.5 sm:p-3">
                  {uniqueList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6 sm:p-8">
                      <p className="text-4xl sm:text-5xl mb-3 sm:mb-4">📦</p>
                      <p className="text-white/40 text-xs sm:text-sm">
                        Коллекция пуста!
                      </p>
                      <p className="text-white/25 text-[10px] sm:text-xs mt-1">
                        Нажми «Крутить» чтобы найти покемонов
                      </p>
                    </div>
                  ) : (
                    <motion.div
                      className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-1 sm:gap-2"
                      initial="hidden"
                      animate="show"
                      variants={{
                        hidden: {},
                        show: {
                          transition: { staggerChildren: 0.02 },
                        },
                      }}
                    >
                      {uniqueList.map((pokemon) => {
                        const isSelected =
                          selectedPokemon?.id === pokemon.id;
                        const mainType = pokemon.types[0] || "normal";
                        const color = TYPE_COLORS[mainType] || "#888";
                        const bst = pokemon.stats.reduce(
                          (sum, s) => sum + s.value,
                          0
                        );
                        const ball = getPokeballForPokemon(
                          pokemon.types,
                          bst,
                          pokemon.id
                        );

                        return (
                          <motion.button
                            key={pokemon.id}
                            onClick={() => handleSelect(pokemon)}
                            className={`relative rounded-lg sm:rounded-xl p-1 sm:p-1.5 cursor-pointer transition-all group overflow-hidden ${
                              isSelected
                                ? "ring-2 ring-cyan-400 bg-cyan-400/10"
                                : "bg-white/5 hover:bg-white/10"
                            }`}
                            variants={{
                              hidden: { opacity: 0, scale: 0.8 },
                              show: { opacity: 1, scale: 1 },
                            }}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {/* Selection indicator arrow */}
                            {isSelected && (
                              <motion.div
                                className="absolute -top-1 left-1/2 -translate-x-1/2 text-cyan-400 text-xs z-20"
                                initial={{ y: -5, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                              >
                                ▼
                              </motion.div>
                            )}

                            {/* Pokemon image */}
                            <div className="relative w-full aspect-square">
                              <Image
                                src={pokemon.sprite}
                                alt={pokemon.nameRu}
                                fill
                                className="object-contain drop-shadow-md p-0.5"
                                sizes="80px"
                              />
                            </div>

                            {/* Number + Pokeball indicator */}
                            <div className="flex items-center justify-center gap-1 mt-0.5">
                              <PokeballSVG variant={ball} size={12} />
                              <span className="text-[10px] text-white/50 font-mono font-bold">
                                {String(pokemon.id).padStart(3, "0")}
                              </span>
                            </div>

                            {/* Type color bar at bottom */}
                            <div
                              className="absolute bottom-0 left-0 right-0 h-0.5"
                              style={{ background: color }}
                            />
                          </motion.button>
                        );
                      })}
                    </motion.div>
                  )}
                </div>
              </div>

              {/* MOBILE BOTTOM SHEET — Selected Pokemon Preview */}
              <AnimatePresence>
                {mobilePreviewOpen && selectedPokemon && (
                  <motion.div
                    className="sm:hidden absolute inset-x-0 bottom-0 z-30 rounded-t-2xl overflow-hidden"
                    style={{
                      background: "linear-gradient(160deg, #0C4A6E, #164E63, #083344)",
                      boxShadow: "0 -4px 30px rgba(0,0,0,0.5)",
                    }}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  >
                    {/* Drag handle + close */}
                    <div className="relative flex items-center justify-center px-4 pt-2 pb-1">
                      <div className="w-10 h-1 rounded-full bg-white/20" />
                      <motion.button
                        onClick={() => setMobilePreviewOpen(false)}
                        className="absolute right-3 top-2 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/60 text-xs cursor-pointer"
                        whileTap={{ scale: 0.9 }}
                      >
                        ✕
                      </motion.button>
                    </div>

                    {/* Content */}
                    <div className="flex items-center gap-3 px-4 pb-4 pt-1">
                      {/* Pokemon image */}
                      <motion.div
                        className="shrink-0"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <Image
                          src={selectedPokemon.sprite}
                          alt={selectedPokemon.nameRu}
                          width={100}
                          height={100}
                          className="object-contain drop-shadow-[0_0_12px_rgba(34,211,238,0.3)]"
                          priority
                        />
                      </motion.div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white/40 font-mono text-xs font-bold">
                            #{String(selectedPokemon.id).padStart(3, "0")}
                          </span>
                          {(() => {
                            const bst = selectedPokemon.stats.reduce(
                              (sum, s) => sum + s.value,
                              0
                            );
                            const ball = getPokeballForPokemon(
                              selectedPokemon.types,
                              bst,
                              selectedPokemon.id
                            );
                            return <PokeballSVG variant={ball} size={16} />;
                          })()}
                        </div>
                        <h3 className="text-lg font-black text-white truncate">
                          {selectedPokemon.nameRu}
                        </h3>

                        {/* Types */}
                        <div className="flex gap-1.5 mt-1.5 mb-2">
                          {selectedPokemon.typesRu.map((type, i) => (
                            <span
                              key={type}
                              className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white/90 uppercase"
                              style={{
                                background: `${
                                  TYPE_COLORS[selectedPokemon.types[i]] || "#888"
                                }88`,
                              }}
                            >
                              {type}
                            </span>
                          ))}
                        </div>

                        {/* Mini stats */}
                        <div className="space-y-1">
                          {selectedPokemon.stats.slice(0, 3).map((stat) => (
                            <div
                              key={stat.name}
                              className="flex items-center gap-1.5"
                            >
                              <span className="text-[9px] text-white/40 w-12 text-right truncate">
                                {stat.name}
                              </span>
                              <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full rounded-full"
                                  style={{
                                    background:
                                      TYPE_COLORS[selectedPokemon.types[0]] ||
                                      "#22d3ee",
                                  }}
                                  initial={{ width: 0 }}
                                  animate={{
                                    width: `${Math.min(
                                      100,
                                      (stat.value / 255) * 100
                                    )}%`,
                                  }}
                                  transition={{ duration: 0.6 }}
                                />
                              </div>
                              <span className="text-[9px] text-white/60 w-5 font-mono">
                                {stat.value}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Evolution (compact) */}
                        <EvolutionSection
                          pokemonId={selectedPokemon.id}
                          availableXP={availableXP}
                          onEvolve={handleEvolve}
                          evolving={evolving}
                          compact
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
