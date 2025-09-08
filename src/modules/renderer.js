import chalk from 'chalk';

export function createRenderer({ cols, rows }) {
  const borderChar = '│';
  const topBorder = '┌' + '─'.repeat(cols) + '┐';
  const bottomBorder = '└' + '─'.repeat(cols) + '┘';

  function clearScreen() {
    process.stdout.write('\x1b[2J');
    process.stdout.write('\x1b[0f');
  }

  function draw(gameState) {
    const buffer = new Array(rows).fill('').map(() => new Array(cols).fill(' '));

    // Place falling words
    for (const falling of gameState.fallingWords) {
      const { row, col, text, matchedChars } = falling;
      for (let i = 0; i < text.length; i++) {
        const c = col + i;
        if (row >= 0 && row < rows && c >= 0 && c < cols) {
          buffer[row][c] = i < matchedChars ? chalk.green(text[i]) : chalk.cyan(text[i]);
        }
      }
    }

    const lines = [];
    lines.push(chalk.gray(topBorder));
    for (let r = 0; r < rows; r++) {
      const line = buffer[r].join('');
      lines.push(chalk.gray(borderChar) + line + chalk.gray(borderChar));
    }
    lines.push(chalk.gray(bottomBorder));

    const hud = [
      chalk.bold(` Score: ${gameState.score} `),
      chalk.bold(` Level: ${gameState.difficulty.level} `),
      chalk.bold(` Lives: ${gameState.lives} `)
    ].join(' ');

    clearScreen();
    process.stdout.write(lines.join('\n') + '\n');
    process.stdout.write(hud + '\n');
    if (gameState.inputBuffer) {
      process.stdout.write(chalk.dim(`Typing: ${gameState.inputBuffer}\n`));
    }
  }

  function drawGameOver(gameState) {
    draw(gameState);
    process.stdout.write('\n' + chalk.red.bold('Game Over!') + '\n');
  }

  return { draw, drawGameOver, clearScreen };
}


