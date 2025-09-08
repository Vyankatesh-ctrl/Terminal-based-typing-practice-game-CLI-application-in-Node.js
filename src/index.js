import { createDifficultySettings } from './modules/difficulty.js';
import { loadWords } from './modules/wordLoader.js';
import { createRenderer } from './modules/renderer.js';
import { createInputHandler } from './modules/inputHandler.js';
import { createGame } from './modules/game.js';

export async function startGame({ level, wordsPath, cols, rows }) {
  const difficulty = createDifficultySettings(level);
  const words = await loadWords(wordsPath, difficulty.minWordLength, difficulty.maxWordLength);

  const renderer = createRenderer({ cols, rows });
  const input = createInputHandler();

  const game = createGame({
    words,
    difficulty,
    renderer,
    input,
    grid: { cols, rows }
  });

  await game.run();
}


