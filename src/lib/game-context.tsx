"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { PokemonData } from "@/lib/pokemon-api";
import { GameTask } from "@/lib/tasks";

export interface CaughtPokemon extends PokemonData {
  caughtAt: number;
  taskCompleted?: GameTask;
  xpEarned: number;
  evolvedFrom?: number;
}

interface GameState {
  // Collection
  collection: CaughtPokemon[];
  totalXP: number;
  availableXP: number;
  trainerLevel: number;
  // Current session
  currentPokemon: PokemonData | null;
  currentTask: GameTask | null;
  isSpinning: boolean;
  showResult: boolean;
  // Actions
  setCurrentPokemon: (p: PokemonData | null) => void;
  setCurrentTask: (t: GameTask | null) => void;
  setIsSpinning: (v: boolean) => void;
  setShowResult: (v: boolean) => void;
  catchPokemon: (pokemon: PokemonData, task?: GameTask) => void;
  evolvePokemon: (fromId: number, evolvedPokemon: PokemonData, xpCost: number) => void;
  clearCollection: () => void;
  exportProgress: () => void;
  importProgress: (file: File) => Promise<void>;
}

const GameContext = createContext<GameState | null>(null);

function calculateLevel(xp: number): number {
  // Level up every 200 XP
  return Math.floor(xp / 200) + 1;
}

const STORAGE_KEY = "pokedex-collection";
const SPENT_XP_KEY = "pokedex-spent-xp";

function loadCollection(): CaughtPokemon[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveCollection(collection: CaughtPokemon[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(collection));
}

function loadSpentXP(): number {
  if (typeof window === "undefined") return 0;
  try {
    const saved = localStorage.getItem(SPENT_XP_KEY);
    return saved ? parseInt(saved, 10) : 0;
  } catch {
    return 0;
  }
}

function saveSpentXP(xp: number) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SPENT_XP_KEY, String(xp));
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [collection, setCollection] = useState<CaughtPokemon[]>([]);
  const [spentXP, setSpentXP] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [currentPokemon, setCurrentPokemon] = useState<PokemonData | null>(null);
  const [currentTask, setCurrentTask] = useState<GameTask | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // Load from localStorage after hydration to avoid mismatch
  useEffect(() => {
    const saved = loadCollection();
    if (saved.length > 0) setCollection(saved);
    const savedXP = loadSpentXP();
    if (savedXP > 0) setSpentXP(savedXP);
    setHydrated(true);
  }, []);

  const totalXP = collection.reduce((sum, p) => sum + p.xpEarned, 0);
  const availableXP = totalXP - spentXP;
  const trainerLevel = calculateLevel(totalXP);

  const catchPokemon = useCallback(
    (pokemon: PokemonData, task?: GameTask) => {
      const caught: CaughtPokemon = {
        ...pokemon,
        caughtAt: Date.now(),
        taskCompleted: task,
        xpEarned: task?.xpReward || 25,
      };
      setCollection((prev) => {
        const updated = [...prev, caught];
        saveCollection(updated);
        return updated;
      });
    },
    []
  );

  const evolvePokemon = useCallback(
    (fromId: number, evolvedPokemon: PokemonData, xpCost: number) => {
      setCollection((prev) => {
        // Find the latest catch of this species
        let targetIdx = -1;
        for (let i = prev.length - 1; i >= 0; i--) {
          if (prev[i].id === fromId) {
            targetIdx = i;
            break;
          }
        }
        if (targetIdx === -1) return prev;

        const oldEntry = prev[targetIdx];
        const newEntry: CaughtPokemon = {
          ...evolvedPokemon,
          caughtAt: oldEntry.caughtAt,
          taskCompleted: oldEntry.taskCompleted,
          xpEarned: oldEntry.xpEarned,
          evolvedFrom: fromId,
        };

        const updated = [...prev];
        updated[targetIdx] = newEntry;
        saveCollection(updated);
        return updated;
      });

      setSpentXP((prev) => {
        const updated = prev + xpCost;
        saveSpentXP(updated);
        return updated;
      });
    },
    []
  );

  const clearCollection = useCallback(() => {
    setCollection([]);
    saveCollection([]);
    setSpentXP(0);
    saveSpentXP(0);
  }, []);

  const exportProgress = useCallback(() => {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      collection,
      spentXP,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pokedex-save-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [collection, spentXP]);

  const importProgress = useCallback(async (file: File) => {
    const text = await file.text();
    const data = JSON.parse(text);
    if (!data.collection || !Array.isArray(data.collection)) {
      throw new Error("Invalid save file");
    }
    setCollection(data.collection);
    saveCollection(data.collection);
    const xp = typeof data.spentXP === "number" ? data.spentXP : 0;
    setSpentXP(xp);
    saveSpentXP(xp);
  }, []);

  // Don't render children until hydrated to avoid flash
  if (!hydrated) {
    return null;
  }

  return (
    <GameContext.Provider
      value={{
        collection,
        totalXP,
        availableXP,
        trainerLevel,
        currentPokemon,
        currentTask,
        isSpinning,
        showResult,
        setCurrentPokemon,
        setCurrentTask,
        setIsSpinning,
        setShowResult,
        catchPokemon,
        evolvePokemon,
        clearCollection,
        exportProgress,
        importProgress,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameState {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
