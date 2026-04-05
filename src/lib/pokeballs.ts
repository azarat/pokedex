// Pokeball variants — different balls for different Pokemon
// Based on type, rarity, and base stat total

export interface PokeballVariant {
  name: string;
  nameRu: string;
  topColor: string;
  bottomColor: string;
  bandColor: string;
  buttonColor: string;
  buttonGlow: string;
  accentPattern?: "stripes" | "spots" | "star" | "rings" | "gradient";
  accentColor?: string;
  rarity: number; // 1=common, 2=uncommon, 3=rare, 4=legendary
}

export const POKEBALL_VARIANTS: Record<string, PokeballVariant> = {
  pokeball: {
    name: "Poké Ball",
    nameRu: "Покебол",
    topColor: "#EE1515",
    bottomColor: "#FFFFFF",
    bandColor: "#222224",
    buttonColor: "#FFFFFF",
    buttonGlow: "#CCCCCC",
    rarity: 1,
  },
  greatball: {
    name: "Great Ball",
    nameRu: "Грейт Бол",
    topColor: "#3B82F6",
    bottomColor: "#FFFFFF",
    bandColor: "#222224",
    buttonColor: "#FFFFFF",
    buttonGlow: "#60A5FA",
    accentPattern: "stripes",
    accentColor: "#EF4444",
    rarity: 2,
  },
  ultraball: {
    name: "Ultra Ball",
    nameRu: "Ультра Бол",
    topColor: "#1A1A2E",
    bottomColor: "#FFFFFF",
    bandColor: "#F59E0B",
    buttonColor: "#FFFFFF",
    buttonGlow: "#FBBF24",
    accentPattern: "gradient",
    accentColor: "#F59E0B",
    rarity: 3,
  },
  masterball: {
    name: "Master Ball",
    nameRu: "Мастер Бол",
    topColor: "#7C3AED",
    bottomColor: "#FFFFFF",
    bandColor: "#222224",
    buttonColor: "#FFFFFF",
    buttonGlow: "#C084FC",
    accentPattern: "star",
    accentColor: "#EC4899",
    rarity: 4,
  },
  premierball: {
    name: "Premier Ball",
    nameRu: "Премьер Бол",
    topColor: "#FFFFFF",
    bottomColor: "#FFFFFF",
    bandColor: "#EF4444",
    buttonColor: "#FFFFFF",
    buttonGlow: "#FCA5A5",
    rarity: 2,
  },
  luxuryball: {
    name: "Luxury Ball",
    nameRu: "Люкс Бол",
    topColor: "#1A1A2E",
    bottomColor: "#1A1A2E",
    bandColor: "#F59E0B",
    buttonColor: "#F59E0B",
    buttonGlow: "#FBBF24",
    accentPattern: "rings",
    accentColor: "#EF4444",
    rarity: 3,
  },
  diveball: {
    name: "Dive Ball",
    nameRu: "Дайв Бол",
    topColor: "#06B6D4",
    bottomColor: "#FFFFFF",
    bandColor: "#222224",
    buttonColor: "#FFFFFF",
    buttonGlow: "#22D3EE",
    accentPattern: "spots",
    accentColor: "#0E7490",
    rarity: 2,
  },
  duskball: {
    name: "Dusk Ball",
    nameRu: "Даск Бол",
    topColor: "#065F46",
    bottomColor: "#1A1A2E",
    bandColor: "#222224",
    buttonColor: "#10B981",
    buttonGlow: "#34D399",
    accentPattern: "gradient",
    accentColor: "#064E3B",
    rarity: 2,
  },
  healball: {
    name: "Heal Ball",
    nameRu: "Хил Бол",
    topColor: "#F9A8D4",
    bottomColor: "#FFFFFF",
    bandColor: "#222224",
    buttonColor: "#FFFFFF",
    buttonGlow: "#F472B6",
    accentPattern: "spots",
    accentColor: "#EC4899",
    rarity: 2,
  },
  timerball: {
    name: "Timer Ball",
    nameRu: "Таймер Бол",
    topColor: "#FFFFFF",
    bottomColor: "#EF4444",
    bandColor: "#222224",
    buttonColor: "#FFFFFF",
    buttonGlow: "#F87171",
    accentPattern: "stripes",
    accentColor: "#1A1A2E",
    rarity: 2,
  },
  moonball: {
    name: "Moon Ball",
    nameRu: "Мун Бол",
    topColor: "#1E3A5F",
    bottomColor: "#F5E642",
    bandColor: "#222224",
    buttonColor: "#FFFFFF",
    buttonGlow: "#93C5FD",
    accentPattern: "star",
    accentColor: "#F5E642",
    rarity: 3,
  },
  dreamball: {
    name: "Dream Ball",
    nameRu: "Дрим Бол",
    topColor: "#EC4899",
    bottomColor: "#FBBF24",
    bandColor: "#222224",
    buttonColor: "#FFFFFF",
    buttonGlow: "#F9A8D4",
    accentPattern: "gradient",
    accentColor: "#F472B6",
    rarity: 3,
  },
};

// Determine which Pokeball a Pokemon gets based on types and base stat total
export function getPokeballForPokemon(
  types: string[],
  baseStatTotal: number,
  id: number
): PokeballVariant {
  const mainType = types[0] || "normal";

  // Legendary / Mythical IDs
  const legendaryIds = new Set([
    144, 145, 146, 150, 151, // Gen 1
    243, 244, 245, 249, 250, 251, // Gen 2
    377, 378, 379, 380, 381, 382, 383, 384, 385, 386, // Gen 3
    480, 481, 482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492, 493, // Gen 4
    494, 638, 639, 640, 641, 642, 643, 644, 645, 646, 647, 648, 649, // Gen 5
  ]);

  if (legendaryIds.has(id)) {
    return POKEBALL_VARIANTS.masterball;
  }

  // Very strong Pokemon (BST >= 550)
  if (baseStatTotal >= 550) {
    return POKEBALL_VARIANTS.ultraball;
  }

  // Type-based selection
  switch (mainType) {
    case "water":
    case "ice":
      return POKEBALL_VARIANTS.diveball;
    case "dark":
    case "ghost":
      return POKEBALL_VARIANTS.duskball;
    case "fairy":
    case "normal":
      if (baseStatTotal < 350) return POKEBALL_VARIANTS.healball;
      return POKEBALL_VARIANTS.premierball;
    case "psychic":
      return POKEBALL_VARIANTS.dreamball;
    case "dragon":
      return POKEBALL_VARIANTS.ultraball;
    case "steel":
    case "rock":
      return POKEBALL_VARIANTS.timerball;
    case "fire":
    case "electric":
      return POKEBALL_VARIANTS.luxuryball;
    default:
      break;
  }

  // BST-based fallback
  if (baseStatTotal >= 450) {
    return POKEBALL_VARIANTS.greatball;
  }

  return POKEBALL_VARIANTS.pokeball;
}
