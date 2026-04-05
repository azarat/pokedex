"use client";

import { GameProvider } from "@/lib/game-context";
import GameScreen from "@/components/GameScreen";

export default function Home() {
  return (
    <GameProvider>
      <GameScreen />
    </GameProvider>
  );
}
