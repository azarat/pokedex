// Evolution chain service — fetches evolution data from PokeAPI
// and calculates XP costs for in-game evolution spending

import { POKEMON_NAMES_RU } from "./pokemon-api";

export interface EvolutionTarget {
  id: number;
  name: string;
  nameRu: string;
  sprite: string;
  xpCost: number;
  methodRu: string;
}

// Extra Russian names for Pokemon beyond Gen 1 (evolution targets)
const EXTRA_NAMES_RU: Record<number, string> = {
  // Gen 2 — cross-gen evolutions of Gen 1
  169: "Кробат",
  182: "Белоссом",
  186: "Политоед",
  196: "Эспеон",
  197: "Амбреон",
  199: "Слоукинг",
  208: "Стиликс",
  212: "Сайзор",
  230: "Кингдра",
  233: "Поригон2",
  242: "Блисси",
  // Gen 2 babies
  172: "Пичу",
  173: "Клеффа",
  174: "Иглибафф",
  175: "Тогепи",
  176: "Тогетик",
  236: "Тирог",
  237: "Хитмонтоп",
  238: "Смучум",
  239: "Элекид",
  240: "Магби",
  // Gen 2 popular lines
  152: "Чикорита", 153: "Бэйлиф", 154: "Мэганиум",
  155: "Синдаквил", 156: "Квилава", 157: "Тайфложн",
  158: "Тотодайл", 159: "Кроконоу", 160: "Фералигатр",
  161: "Сентрет", 162: "Фуррет",
  163: "Хуту", 164: "Ноктаул",
  165: "Ледиба", 166: "Ледиан",
  167: "Спинарак", 168: "Ариадос",
  170: "Чинчоу", 171: "Лантурн",
  177: "Нату", 178: "Ксату",
  179: "Мэрип", 180: "Флааффи", 181: "Амфарос",
  183: "Марилл", 184: "Азумарилл",
  187: "Хоппип", 188: "Скиплум", 189: "Джамплафф",
  190: "Эйпом",
  191: "Санкерн", 192: "Санфлора",
  193: "Янма",
  194: "Вупер", 195: "Квагзайр",
  198: "Маркроу",
  200: "Миздривус",
  204: "Пайнко", 205: "Форретресс",
  207: "Глайгар",
  209: "Снаббулл", 210: "Гранбулл",
  215: "Снизел",
  216: "Тедиурса", 217: "Урсаринг",
  218: "Слагма", 219: "Магкарго",
  220: "Свинаб", 221: "Пилосвайн",
  223: "Реморейд", 224: "Октиллери",
  228: "Хаундур", 229: "Хаундум",
  231: "Фанпи", 232: "Донфан",
  246: "Ларвитар", 247: "Пупитар", 248: "Тиранитар",
  // Gen 3 starters + popular
  252: "Трико", 253: "Гровайл", 254: "Скептайл",
  255: "Торчик", 256: "Комбаскен", 257: "Блейзикен",
  258: "Мадкип", 259: "Маршторп", 260: "Свамперт",
  263: "Зигзагун", 264: "Лайнун",
  265: "Вурмпл", 266: "Силкун", 267: "Бофлай",
  268: "Каскун", 269: "Дастокс",
  270: "Лотад", 271: "Ломбрэ", 272: "Лудиколо",
  273: "Сидот", 274: "Нузлиф", 275: "Шифтри",
  280: "Рэлтс", 281: "Кирлия", 282: "Гарденвуар",
  285: "Шрумиш", 286: "Брелум",
  293: "Вишмер", 294: "Лаудред", 295: "Эксплауд",
  304: "Арон", 305: "Лайрон", 306: "Аггрон",
  328: "Трэпинч", 329: "Вибрава", 330: "Флайгон",
  355: "Даскулл", 356: "Даскклопс",
  371: "Бэгон", 372: "Шелгон", 373: "Саламенс",
  374: "Бельдум", 375: "Метанг", 376: "Метагросс",
  // Gen 4 cross-gen evolutions
  424: "Амбипом",
  429: "Мизмагиус",
  430: "Хончкроу",
  461: "Уивайл",
  462: "Магнезон",
  463: "Ликилики",
  464: "Райперион",
  465: "Тангроуф",
  466: "Элективайр",
  467: "Магмортар",
  468: "Тогекисс",
  469: "Янмега",
  470: "Лифеон",
  471: "Глейсеон",
  472: "Глайскор",
  473: "Мамосвайн",
  474: "Поригон-Z",
  475: "Галлейд",
  477: "Даскнуар",
  // Gen 4 starters
  387: "Тартвиг", 388: "Гротл", 389: "Тортерра",
  390: "Чимчар", 391: "Монферно", 392: "Инфернейп",
  393: "Пиплап", 394: "Принплап", 395: "Эмполеон",
  // Gen 4 popular
  396: "Старли", 397: "Старавиа", 398: "Сталаптор",
  403: "Шинкс", 404: "Лаксио", 405: "Лаксрей",
  443: "Гибл", 444: "Габайт", 445: "Гарчомп",
  447: "Риолу", 448: "Лукарио",
  // Gen 5 starters
  495: "Сниви", 496: "Сервайн", 497: "Серпериор",
  498: "Тепиг", 499: "Пигнайт", 500: "Эмбоар",
  501: "Ошаватт", 502: "Дьютт", 503: "Самуротт",
  // Gen 5 popular
  532: "Тимбер", 533: "Гёрдер", 534: "Конкелдерр",
  540: "Свадлун", 541: "Свадун", 542: "Леванни",
  607: "Литвик", 608: "Лампент", 609: "Шанделюр",
  610: "Аксью", 611: "Фраксюр", 612: "Хаксорус",
  633: "Деино", 634: "Цвайлус", 635: "Хайдрейгон",
};

// Get Russian name — check Gen 1 names first, then extra names, then fallback
function getRuName(id: number, englishName: string): string {
  return POKEMON_NAMES_RU[id] || EXTRA_NAMES_RU[id] || capitalize(englishName);
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// PokeAPI types for evolution chain
interface ChainLink {
  species: { name: string; url: string };
  evolves_to: ChainLink[];
  evolution_details: EvolutionDetail[];
}

interface EvolutionDetail {
  min_level: number | null;
  trigger: { name: string } | null;
  item: { name: string } | null;
  held_item: { name: string } | null;
  min_happiness: number | null;
  known_move_type: { name: string } | null;
  location: { name: string } | null;
  time_of_day: string;
}

// In-memory cache for evolution chain data (keyed by chain ID)
const chainCache = new Map<number, { chain: ChainLink }>();

// Sprite URL builder (uses the same domain already in next.config images)
function spriteUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

// Extract species ID from PokeAPI URL like ".../pokemon-species/25/"
function getIdFromUrl(url: string): number {
  const parts = url.split("/").filter(Boolean);
  return parseInt(parts[parts.length - 1], 10);
}

// Stone names → Russian
const STONE_NAMES_RU: Record<string, string> = {
  "fire-stone": "Огненный камень",
  "water-stone": "Водный камень",
  "thunder-stone": "Камень грома",
  "leaf-stone": "Лиственный камень",
  "moon-stone": "Лунный камень",
  "sun-stone": "Солнечный камень",
  "shiny-stone": "Блестящий камень",
  "dusk-stone": "Сумеречный камень",
  "dawn-stone": "Камень рассвета",
  "ice-stone": "Ледяной камень",
  "oval-stone": "Овальный камень",
};

function getMethodRu(details: EvolutionDetail): string {
  if (details.min_level) return `Уровень ${details.min_level}`;
  if (details.item) {
    return STONE_NAMES_RU[details.item.name] || "Особый предмет";
  }
  if (details.held_item) return "Особый предмет";
  if (details.trigger?.name === "trade") return "Обмен";
  if (details.min_happiness) {
    if (details.time_of_day === "day") return "Дружба (день)";
    if (details.time_of_day === "night") return "Дружба (ночь)";
    return "Дружба";
  }
  if (details.known_move_type) return "Особый приём";
  if (details.location) return "Особое место";
  if (details.trigger?.name === "level-up") return "Повышение уровня";
  return "Эволюция";
}

function calculateXpCost(details: EvolutionDetail): number {
  if (details.min_level) {
    // Level-based: scale cost with level
    // Level 7→42, Level 16→96, Level 25→150, Level 36→216, Level 50→300
    return Math.max(50, Math.min(300, Math.round(details.min_level * 6)));
  }
  // Stone evolution
  if (details.item) return 150;
  // Trade evolution
  if (details.trigger?.name === "trade") return 120;
  // Friendship evolution
  if (details.min_happiness) return 100;
  // Default for other methods
  return 150;
}

// Walk the chain tree to find evolutions for a specific Pokemon ID
function findEvolutions(chain: ChainLink, targetId: number): EvolutionTarget[] {
  const speciesId = getIdFromUrl(chain.species.url);

  if (speciesId === targetId) {
    // Found our Pokemon — return its direct evolutions
    return chain.evolves_to.map((evo) => {
      const evoId = getIdFromUrl(evo.species.url);
      const details = evo.evolution_details[0] || ({} as EvolutionDetail);
      return {
        id: evoId,
        name: capitalize(evo.species.name),
        nameRu: getRuName(evoId, evo.species.name),
        sprite: spriteUrl(evoId),
        xpCost: calculateXpCost(details),
        methodRu: getMethodRu(details),
      };
    });
  }

  // Recurse into child chains
  for (const child of chain.evolves_to) {
    const result = findEvolutions(child, targetId);
    if (result.length > 0) return result;
  }

  return [];
}

/**
 * Fetch evolution targets for a given Pokemon ID.
 * Uses PokeAPI evolution chain endpoint with caching.
 * Returns array of possible evolutions (empty if fully evolved / no evolutions).
 */
export async function fetchEvolutionTargets(
  pokemonId: number
): Promise<EvolutionTarget[]> {
  try {
    // 1. Get species to find evolution chain URL
    const speciesRes = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`
    );
    if (!speciesRes.ok) return [];
    const speciesData = await speciesRes.json();
    const chainUrl: string = speciesData.evolution_chain?.url;
    if (!chainUrl) return [];

    // Extract chain ID for caching
    const chainId = getIdFromUrl(chainUrl);

    // 2. Check cache or fetch chain
    let chainData: { chain: ChainLink };
    if (chainCache.has(chainId)) {
      chainData = chainCache.get(chainId)!;
    } else {
      const chainRes = await fetch(chainUrl);
      if (!chainRes.ok) return [];
      chainData = await chainRes.json();
      chainCache.set(chainId, chainData);
    }

    // 3. Walk the chain to find this Pokemon's evolutions
    return findEvolutions(chainData.chain, pokemonId);
  } catch {
    return [];
  }
}
