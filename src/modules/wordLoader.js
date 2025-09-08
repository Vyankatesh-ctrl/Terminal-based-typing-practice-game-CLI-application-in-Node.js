import fs from 'node:fs/promises';
import path from 'node:path';

export async function loadWords(wordsPath, minLength, maxLength) {
  const resolved = path.resolve(process.cwd(), wordsPath);
  let content;
  try {
    content = await fs.readFile(resolved, 'utf8');
  } catch (err) {
    throw new Error(`Failed to read words from ${resolved}: ${err.message}`);
  }

  const all = content
    .split(/\r?\n/)
    .map((w) => w.trim())
    .filter(Boolean)
    .filter((w) => /^[a-zA-Z]+$/.test(w))
    .map((w) => w.toLowerCase());

  const filtered = all.filter((w) => w.length >= minLength && w.length <= maxLength);
  if (filtered.length === 0) {
    throw new Error(
      `No words matched length range ${minLength}-${maxLength}. Consider adjusting difficulty or word list.`
    );
  }
  return filtered;
}


