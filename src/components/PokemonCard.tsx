"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { PokemonData, TYPE_COLORS } from "@/lib/pokemon-api";
import { PokeballVariant } from "@/lib/pokeballs";
import PokeballSVG from "./PokeballSVG";

interface PokemonCardProps {
  pokemon: PokemonData;
  onCatch?: () => void;
  compact?: boolean;
  pokeball?: PokeballVariant | null;
}

export default function PokemonCard({
  pokemon,
  onCatch,
  compact = false,
  pokeball,
}: PokemonCardProps) {
  const mainType = pokemon.types[0] || "normal";
  const mainColor = TYPE_COLORS[mainType] || "#888";

  if (compact) {
    return (
      <motion.div
        className="relative rounded-2xl p-3 cursor-pointer group overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${mainColor}33, ${mainColor}11)`,
          border: `2px solid ${mainColor}55`,
        }}
        whileHover={{ scale: 1.05, y: -4 }}
        whileTap={{ scale: 0.95 }}
        layout
      >
        <div className="flex flex-col items-center gap-1">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20">
            <Image
              src={pokemon.sprite}
              alt={pokemon.nameRu}
              fill
              className="object-contain drop-shadow-lg"
              sizes="80px"
            />
          </div>
          <p className="text-xs font-bold text-white/90 text-center truncate w-full">
            {pokemon.nameRu}
          </p>
          <p className="text-[10px] text-white/50">#{String(pokemon.id).padStart(3, "0")}</p>
        </div>

        {/* Glow on hover */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            boxShadow: `0 0 20px ${mainColor}44, inset 0 0 20px ${mainColor}22`,
          }}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      className="relative rounded-2xl sm:rounded-3xl p-4 sm:p-6 max-w-[340px] sm:max-w-sm mx-auto overflow-hidden w-full"
      style={{
        background: `linear-gradient(145deg, ${mainColor}44, #0a0a1a)`,
        border: `2px solid ${mainColor}66`,
        boxShadow: `0 0 40px ${mainColor}33, 0 0 80px ${mainColor}11`,
      }}
      initial={{ scale: 0.3, opacity: 0, rotateY: 180 }}
      animate={{ scale: 1, opacity: 1, rotateY: 0 }}
      transition={{ type: "spring", duration: 0.8 }}
    >
      {/* Holographic shimmer */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 45%, transparent 50%)",
        }}
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
      />

      {/* Number badge + Pokeball */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-1.5 sm:gap-2">
        {pokeball && <PokeballSVG variant={pokeball} size={22} />}
        <span className="text-white/20 text-2xl sm:text-3xl font-black">
          #{String(pokemon.id).padStart(3, "0")}
        </span>
      </div>

      {/* Pokemon image */}
      <div className="relative w-36 h-36 sm:w-48 sm:h-48 mx-auto mb-3 sm:mb-4">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src={pokemon.sprite}
            alt={pokemon.nameRu}
            width={192}
            height={192}
            className="object-contain drop-shadow-2xl w-full h-full"
            priority
          />
        </motion.div>

        {/* Shadow */}
        <div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 sm:w-24 h-3 sm:h-4 rounded-full blur-md"
          style={{ background: `${mainColor}44` }}
        />
      </div>

      {/* Name */}
      <h2 className="text-2xl sm:text-3xl font-black text-center text-white mb-0.5 sm:mb-1 tracking-wide">
        {pokemon.nameRu}
      </h2>
      <p className="text-center text-white/40 text-xs sm:text-sm mb-2 sm:mb-3">{pokemon.name}</p>

      {/* Types */}
      <div className="flex justify-center gap-2 mb-3 sm:mb-4">
        {pokemon.typesRu.map((type, i) => (
          <span
            key={type}
            className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-bold text-white/90 uppercase tracking-wider"
            style={{
              background: `${TYPE_COLORS[pokemon.types[i]] || mainColor}99`,
              boxShadow: `0 0 10px ${TYPE_COLORS[pokemon.types[i]] || mainColor}44`,
            }}
          >
            {type}
          </span>
        ))}
      </div>

      {/* Stats */}
      <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
        {pokemon.stats.map((stat) => (
          <div key={stat.name} className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-[10px] sm:text-xs text-white/60 w-20 sm:w-24 text-right truncate">
              {stat.name}
            </span>
            <div className="flex-1 h-1.5 sm:h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${mainColor}, ${mainColor}cc)`,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (stat.value / 255) * 100)}%` }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </div>
            <span className="text-[10px] sm:text-xs text-white/80 w-7 sm:w-8 font-mono">
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Info row */}
      <div className="flex justify-around text-center mb-3 sm:mb-4 py-1.5 sm:py-2 border-y border-white/10">
        <div>
          <p className="text-base sm:text-lg font-bold text-white">{pokemon.height} м</p>
          <p className="text-[10px] sm:text-xs text-white/40">Рост</p>
        </div>
        <div>
          <p className="text-base sm:text-lg font-bold text-white">{pokemon.weight} кг</p>
          <p className="text-[10px] sm:text-xs text-white/40">Вес</p>
        </div>
        {pokeball && (
          <div>
            <div className="flex justify-center">
              <PokeballSVG variant={pokeball} size={20} />
            </div>
            <p className="text-[10px] sm:text-xs text-white/40 mt-0.5">{pokeball.nameRu}</p>
          </div>
        )}
      </div>

      {/* Catch button */}
      {onCatch && (
        <motion.button
          onClick={onCatch}
          className="w-full py-3 px-6 rounded-xl font-bold text-lg text-white cursor-pointer"
          style={{
            background: `linear-gradient(135deg, ${mainColor}, ${mainColor}bb)`,
            boxShadow: `0 4px 20px ${mainColor}55`,
          }}
          whileHover={{ scale: 1.03, boxShadow: `0 6px 30px ${mainColor}77` }}
          whileTap={{ scale: 0.97 }}
        >
          ✨ Поймать! ✨
        </motion.button>
      )}
    </motion.div>
  );
}
