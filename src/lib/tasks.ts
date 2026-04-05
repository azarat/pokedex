// Family & kid tasks system — random fun challenges in Russian

export interface GameTask {
  id: string;
  emoji: string;
  titleRu: string;
  descriptionRu: string;
  category: "creative" | "active" | "brain" | "team" | "fun";
  difficulty: 1 | 2 | 3;
  xpReward: number;
}

const TASKS: GameTask[] = [
  // 🎨 Creative tasks
  {
    id: "draw-pokemon",
    emoji: "🎨",
    titleRu: "Нарисуй покемона!",
    descriptionRu: "Нарисуй этого покемона за 2 минуты. Покажи всем свой шедевр!",
    category: "creative",
    difficulty: 1,
    xpReward: 50,
  },
  {
    id: "make-sound",
    emoji: "🎤",
    titleRu: "Озвучь покемона!",
    descriptionRu: "Придумай и изобрази звук, который издаёт этот покемон. Чем смешнее — тем лучше!",
    category: "creative",
    difficulty: 1,
    xpReward: 40,
  },
  {
    id: "invent-story",
    emoji: "📖",
    titleRu: "Сочини историю!",
    descriptionRu: "Придумай короткую историю про приключения этого покемона. 3 предложения минимум!",
    category: "creative",
    difficulty: 2,
    xpReward: 70,
  },
  {
    id: "create-dance",
    emoji: "💃",
    titleRu: "Танец покемона!",
    descriptionRu: "Придумай фирменный танец для этого покемона и покажи его!",
    category: "creative",
    difficulty: 1,
    xpReward: 60,
  },
  {
    id: "clay-pokemon",
    emoji: "🏺",
    titleRu: "Слепи покемона!",
    descriptionRu: "Слепи этого покемона из пластилина или теста. Передай его характер!",
    category: "creative",
    difficulty: 3,
    xpReward: 100,
  },

  // 🏃 Active tasks
  {
    id: "pose-pokemon",
    emoji: "🧍",
    titleRu: "Покемон-поза!",
    descriptionRu: "Покажи позу этого покемона. Замри на 10 секунд!",
    category: "active",
    difficulty: 1,
    xpReward: 30,
  },
  {
    id: "pokemon-walk",
    emoji: "🚶",
    titleRu: "Походка покемона!",
    descriptionRu: "Пройдись по комнате так, как ходил бы этот покемон!",
    category: "active",
    difficulty: 1,
    xpReward: 40,
  },
  {
    id: "pokemon-battle",
    emoji: "⚔️",
    titleRu: "Бой покемонов!",
    descriptionRu: "Изобрази атаку этого покемона! Сделай 5 ударов в воздух с криком покемона!",
    category: "active",
    difficulty: 2,
    xpReward: 50,
  },
  {
    id: "spin-move",
    emoji: "🌀",
    titleRu: "Вихрь!",
    descriptionRu: "Покрутись на месте 5 раз и попробуй устоять на ногах как этот покемон!",
    category: "active",
    difficulty: 1,
    xpReward: 35,
  },

  // 🧠 Brain tasks
  {
    id: "guess-type",
    emoji: "🤔",
    titleRu: "Угадай тип!",
    descriptionRu: "Не подглядывая, попробуй угадать тип этого покемона по его внешности!",
    category: "brain",
    difficulty: 2,
    xpReward: 60,
  },
  {
    id: "math-stats",
    emoji: "🔢",
    titleRu: "Покемон-математика!",
    descriptionRu: "Сложи ОЗ и Атаку этого покемона. Кто первый назовёт ответ — получает бонус!",
    category: "brain",
    difficulty: 2,
    xpReward: 55,
  },
  {
    id: "compare",
    emoji: "⚖️",
    titleRu: "Сравни покемонов!",
    descriptionRu: "Сравни этого покемона с предыдущим. Кто сильнее и почему? Докажи!",
    category: "brain",
    difficulty: 3,
    xpReward: 80,
  },
  {
    id: "weakness",
    emoji: "🎯",
    titleRu: "Найди слабость!",
    descriptionRu: "Подумай, какой тип покемонов будет сильнее этого? Объясни почему!",
    category: "brain",
    difficulty: 3,
    xpReward: 75,
  },
  {
    id: "rhyme",
    emoji: "📝",
    titleRu: "Покемон-рифма!",
    descriptionRu: "Придумай рифму к имени этого покемона! Чем необычнее — тем больше очков!",
    category: "brain",
    difficulty: 2,
    xpReward: 65,
  },

  // 👨‍👩‍👧‍👦 Team tasks
  {
    id: "team-quiz",
    emoji: "❓",
    titleRu: "Семейная викторина!",
    descriptionRu: "Каждый член семьи задаёт вопрос про этого покемона. Кто больше знает?",
    category: "team",
    difficulty: 2,
    xpReward: 80,
  },
  {
    id: "team-build",
    emoji: "🏗️",
    titleRu: "Командная стройка!",
    descriptionRu: "Вместе постройте дом для этого покемона из подручных материалов за 3 минуты!",
    category: "team",
    difficulty: 3,
    xpReward: 100,
  },
  {
    id: "group-pose",
    emoji: "📸",
    titleRu: "Семейное фото!",
    descriptionRu: "Всей семьёй изобразите этого покемона и сделайте фото!",
    category: "team",
    difficulty: 1,
    xpReward: 60,
  },
  {
    id: "team-story",
    emoji: "🎭",
    titleRu: "Покемон-театр!",
    descriptionRu: "Разыграйте сценку! Один — покемон, остальные — тренеры. Импровизация 1 минута!",
    category: "team",
    difficulty: 2,
    xpReward: 90,
  },

  // 😄 Fun tasks
  {
    id: "funny-face",
    emoji: "🤪",
    titleRu: "Смешная рожица!",
    descriptionRu: "Скорчи рожицу как этот покемон! Самый смешной получает бонус!",
    category: "fun",
    difficulty: 1,
    xpReward: 30,
  },
  {
    id: "pokemon-song",
    emoji: "🎵",
    titleRu: "Песня покемона!",
    descriptionRu: "Спой песенку про этого покемона на любой мотив! Минимум 4 строчки!",
    category: "fun",
    difficulty: 2,
    xpReward: 70,
  },
  {
    id: "secret-power",
    emoji: "✨",
    titleRu: "Секретная сила!",
    descriptionRu: "Придумай суперсилу, которой нет ни у одного покемона, и дай ей название!",
    category: "fun",
    difficulty: 2,
    xpReward: 65,
  },
  {
    id: "pokemon-food",
    emoji: "🍕",
    titleRu: "Любимая еда!",
    descriptionRu: "Придумай, что любит есть этот покемон. Опиши блюдо с названием!",
    category: "fun",
    difficulty: 1,
    xpReward: 40,
  },
  {
    id: "catchphrase",
    emoji: "💬",
    titleRu: "Коронная фраза!",
    descriptionRu: "Придумай коронную фразу для этого покемона. Скажи её с выражением!",
    category: "fun",
    difficulty: 1,
    xpReward: 45,
  },
];

const CATEGORY_LABELS_RU: Record<string, string> = {
  creative: "🎨 Творчество",
  active: "🏃 Активность",
  brain: "🧠 Смекалка",
  team: "👨‍👩‍👧‍👦 Команда",
  fun: "😄 Веселье",
};

export function getCategoryLabel(category: string): string {
  return CATEGORY_LABELS_RU[category] || category;
}

export function getRandomTask(): GameTask {
  return TASKS[Math.floor(Math.random() * TASKS.length)];
}

export function getRandomTasks(count: number): GameTask[] {
  const shuffled = [...TASKS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getDifficultyStars(difficulty: number): string {
  return "⭐".repeat(difficulty);
}
