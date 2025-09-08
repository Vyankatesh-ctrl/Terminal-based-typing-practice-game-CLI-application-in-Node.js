#!/usr/bin/env node
import { Command } from 'commander';
import { startGame } from '../src/index.js';

const program = new Command();

program
  .name('tpg')
  .description('Typing Practice Game - words fall, type to clear them!')
  .option('-l, --level <number>', 'difficulty level 1-10', (value) => {
    const parsed = Number(value);
    if (Number.isNaN(parsed) || parsed < 1 || parsed > 10) {
      throw new Error('Level must be a number between 1 and 10');
    }
    return parsed;
  }, 3)
  .option('-w, --words <path>', 'path to words.txt', 'words/words.txt')
  .option('--width <cols>', 'override terminal width', (v) => Number(v))
  .option('--height <rows>', 'override terminal height', (v) => Number(v))
  .action(async (opts) => {
    const level = opts.level ?? 3;
    const wordsPath = opts.words || 'words/words.txt';
    const cols = opts.width || process.stdout.columns || 80;
    const rows = opts.height || process.stdout.rows || 24;

    await startGame({ level, wordsPath, cols, rows });
  });

program.parseAsync(process.argv);


