// PokeAPI service — fetches Pokemon data + sprites
export interface PokemonData {
  id: number;
  name: string;
  nameRu: string;
  types: string[];
  typesRu: string[];
  sprite: string;
  spriteAnimated: string | null;
  height: number;
  weight: number;
  stats: { name: string; value: number }[];
  abilities: string[];
  cry: string | null;
}

// Russian Pokemon type names
const TYPE_MAP_RU: Record<string, string> = {
  normal: "Нормальный",
  fire: "Огненный",
  water: "Водный",
  electric: "Электрический",
  grass: "Травяной",
  ice: "Ледяной",
  fighting: "Боевой",
  poison: "Ядовитый",
  ground: "Земляной",
  flying: "Летающий",
  psychic: "Психический",
  bug: "Насекомый",
  rock: "Каменный",
  ghost: "Призрачный",
  dragon: "Драконий",
  dark: "Тёмный",
  steel: "Стальной",
  fairy: "Волшебный",
};

// Russian names for the most popular Pokemon (Gen 1-2 coverage + extras)
export const POKEMON_NAMES_RU: Record<number, string> = {
  1: "Бульбазавр", 2: "Ивизавр", 3: "Венузавр", 4: "Чармандер",
  5: "Чармелеон", 6: "Чаризард", 7: "Сквиртл", 8: "Вартортл",
  9: "Бластойз", 10: "Катерпи", 11: "Метапод", 12: "Баттерфри",
  13: "Видл", 14: "Какуна", 15: "Бидрилл", 16: "Пиджи",
  17: "Пиджеотто", 18: "Пиджот", 19: "Раттата", 20: "Ратикейт",
  21: "Спироу", 22: "Фироу", 23: "Эканс", 24: "Арбок",
  25: "Пикачу", 26: "Райчу", 27: "Сэндшру", 28: "Сэндслэш",
  29: "Нидоран♀", 30: "Нидорина", 31: "Нидоквин", 32: "Нидоран♂",
  33: "Нидорино", 34: "Нидокинг", 35: "Клефэйри", 36: "Клефэйбл",
  37: "Вульпикс", 38: "Найнтейлс", 39: "Джигглипаф", 40: "Вигглитаф",
  41: "Зубат", 42: "Голбат", 43: "Оддиш", 44: "Глум",
  45: "Вайлплум", 46: "Парас", 47: "Парасект", 48: "Венонат",
  49: "Веномот", 50: "Диглетт", 51: "Дагтрио", 52: "Мяут",
  53: "Персиан", 54: "Псидак", 55: "Голдак", 56: "Манки",
  57: "Праймэйп", 58: "Гроулит", 59: "Арканайн", 60: "Поливаг",
  61: "Поливирл", 62: "Поливрат", 63: "Абра", 64: "Кадабра",
  65: "Алаказам", 66: "Мачоп", 67: "Мачок", 68: "Мачамп",
  69: "Белспраут", 70: "Випинбел", 71: "Виктрибел", 72: "Тентакул",
  73: "Тентакруэл", 74: "Геодуд", 75: "Гравелер", 76: "Голем",
  77: "Понита", 78: "Рапидаш", 79: "Слоупок", 80: "Слоубро",
  81: "Магнемайт", 82: "Магнетон", 83: "Фарфетчд", 84: "Додуо",
  85: "Додрио", 86: "Сил", 87: "Дьюгонг", 88: "Граймер",
  89: "Мак", 90: "Шеллдер", 91: "Клойстер", 92: "Гастли",
  93: "Хонтер", 94: "Генгар", 95: "Оникс", 96: "Дроузи",
  97: "Гипно", 98: "Крабби", 99: "Кинглер", 100: "Вольторб",
  101: "Электрод", 102: "Экзеггкут", 103: "Экзеггутор", 104: "Кубон",
  105: "Маровак", 106: "Хитмонли", 107: "Хитмончан", 108: "Ликитанг",
  109: "Коффинг", 110: "Визинг", 111: "Райхорн", 112: "Райдон",
  113: "Ченси", 114: "Тангела", 115: "Кангасхан", 116: "Хорси",
  117: "Сидра", 118: "Голдин", 119: "Сикинг", 120: "Старью",
  121: "Старми", 122: "Мр. Майм", 123: "Сайтер", 124: "Джинкс",
  125: "Электабазз", 126: "Магмар", 127: "Пинсир", 128: "Таурос",
  129: "Мэджикарп", 130: "Гайярадос", 131: "Лапрас", 132: "Дитто",
  133: "Иви", 134: "Вапореон", 135: "Джолтеон", 136: "Флареон",
  137: "Поригон", 138: "Оманайт", 139: "Омастар", 140: "Кабуто",
  141: "Кабутопс", 142: "Аэродактиль", 143: "Снорлакс", 144: "Артикуно",
  145: "Запдос", 146: "Молтрес", 147: "Дратини", 148: "Драгонэйр",
  149: "Драгонайт", 150: "Мьюту", 151: "Мью",
};

// Stat name translation
const STAT_NAMES_RU: Record<string, string> = {
  hp: "ОЗ",
  attack: "Атака",
  defense: "Защита",
  "special-attack": "Спец. Атака",
  "special-defense": "Спец. Защита",
  speed: "Скорость",
};

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export async function fetchPokemon(id: number): Promise<PokemonData> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch pokemon ${id}`);
  const data = await res.json();

  const types = data.types.map((t: { type: { name: string } }) => t.type.name);
  const stats = data.stats.map(
    (s: { stat: { name: string }; base_stat: number }) => ({
      name: STAT_NAMES_RU[s.stat.name] || s.stat.name,
      value: s.base_stat,
    })
  );
  const abilities = data.abilities.map(
    (a: { ability: { name: string } }) => capitalize(a.ability.name.replace("-", " "))
  );

  const sprite =
    data.sprites.other?.["official-artwork"]?.front_default ||
    data.sprites.front_default;

  const spriteAnimated =
    data.sprites.other?.showdown?.front_default ||
    data.sprites.versions?.["generation-v"]?.["black-white"]?.animated
      ?.front_default ||
    null;

  return {
    id: data.id,
    name: capitalize(data.name),
    nameRu: POKEMON_NAMES_RU[data.id] || capitalize(data.name),
    types,
    typesRu: types.map((t: string) => TYPE_MAP_RU[t] || t),
    sprite,
    spriteAnimated,
    height: data.height / 10,   // decimetres -> metres
    weight: data.weight / 10,   // hectograms -> kg
    stats,
    abilities,
    cry: data.cries?.latest || null,
  };
}

export function getRandomPokemonId(): number {
  // First 5 generations (898 pokemon) — best sprite coverage
  return Math.floor(Math.random() * 649) + 1;
}

// Pokemon type colors for UI
export const TYPE_COLORS: Record<string, string> = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};
