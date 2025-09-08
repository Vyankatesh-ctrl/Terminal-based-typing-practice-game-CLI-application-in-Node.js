export function createDifficultySettings(level) {
  const clamped = Math.max(1, Math.min(10, Number(level) || 1));

  // Speed: interval ms between ticks (lower is faster)
  const baseIntervalMs = 700; // level 1 baseline
  const intervalMs = Math.max(80, Math.floor(baseIntervalMs - (clamped - 1) * 60));

  // Word length bounds scale with difficulty
  const minWordLength = Math.min(10, 3 + Math.floor((clamped - 1) * 0.5));
  const maxWordLength = Math.min(16, 6 + Math.floor((clamped - 1) * 1.2));

  // Spawn rate: probability a new word spawns each tick
  const spawnProbability = Math.min(0.9, 0.15 + clamped * 0.07);

  // Max concurrent falling words
  const maxActiveWords = Math.min(30, 6 + clamped * 2);

  return {
    level: clamped,
    intervalMs,
    minWordLength,
    maxWordLength,
    spawnProbability,
    maxActiveWords
  };
}


