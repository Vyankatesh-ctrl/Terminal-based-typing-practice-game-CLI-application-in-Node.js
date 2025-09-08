function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function createGame({ words, difficulty, renderer, input, grid }) {
  const fallingWords = [];
  let score = 0;
  let lives = 3;
  let isRunning = false;
  let ticker;

  function spawnWord() {
    if (fallingWords.length >= difficulty.maxActiveWords) return;
    if (Math.random() > difficulty.spawnProbability) return;
    const text = words[randomInt(0, words.length - 1)];
    const col = Math.max(0, Math.min(grid.cols - text.length, randomInt(0, grid.cols - text.length)));
    const word = {
      id: Math.random().toString(36).slice(2),
      text,
      row: 0,
      col,
      matchedChars: 0
    };
    fallingWords.push(word);
  }

  function tick() {
    // Move words down
    for (const w of fallingWords) {
      w.row += 1;
    }

    // Check bottom collision
    const survivors = [];
    for (const w of fallingWords) {
      if (w.row >= grid.rows) {
        lives -= 1;
      } else {
        survivors.push(w);
      }
    }
    fallingWords.length = 0;
    fallingWords.push(...survivors);

    if (lives <= 0) {
      stop(false);
      return;
    }

    // Possibly spawn new word(s)
    spawnWord();

    // Match input buffer against words
    const buffer = input.getBuffer();
    if (buffer) {
      let clearedAny = false;
      for (const w of fallingWords) {
        if (w.text.startsWith(buffer)) {
          w.matchedChars = buffer.length;
          if (buffer.length === w.text.length) {
            // remove word and score
            score += 10 + Math.max(0, w.text.length - 3) * 2;
            w.matchedChars = w.text.length;
            // mark for removal by id
            w.__clear = true;
            clearedAny = true;
          }
        } else {
          w.matchedChars = 0;
        }
      }
      if (clearedAny) {
        // remove cleared
        const remaining = fallingWords.filter((w) => !w.__clear);
        fallingWords.length = 0;
        fallingWords.push(...remaining);
        input.clearBuffer();
      }
    } else {
      for (const w of fallingWords) w.matchedChars = 0;
    }

    renderer.draw({
      fallingWords,
      score,
      lives,
      difficulty,
      inputBuffer: input.getBuffer()
    });
  }

  function stop(clearScreenAfter = true) {
    if (!isRunning) return;
    isRunning = false;
    clearInterval(ticker);
    input.close();
    if (!clearScreenAfter) {
      renderer.drawGameOver({
        fallingWords,
        score,
        lives,
        difficulty,
        inputBuffer: input.getBuffer()
      });
    }
  }

  function setupExitHandlers() {
    const onExit = () => stop(false);
    input.onEvent((event) => {
      if (event === 'exit') onExit();
    });
    process.on('SIGINT', onExit);
    process.on('SIGTERM', onExit);
  }

  async function run() {
    if (isRunning) return;
    isRunning = true;
    setupExitHandlers();

    ticker = setInterval(tick, difficulty.intervalMs);
  }

  return { run };
}


