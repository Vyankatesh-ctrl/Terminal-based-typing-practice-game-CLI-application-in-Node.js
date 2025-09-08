## Typing Practice Game (CLI)

Words fall from the top of your terminal. Type them before they reach the bottom. Difficulty levels (1-10) change speed, word length, and spawn frequency.

### Install

```bash
npm install
```

Optionally link the CLI globally:

```bash
npm link
```

### Run

```bash
npx tpg --level 3 --words words/words.txt
```
run this 
Or, if linked:

```bash
tpg -l 5
```

Options:
- `-l, --level <1-10>`: Difficulty level (default: 3)
- `-w, --words <path>`: Path to words.txt (default: words/words.txt)
- `--width <cols>`: Override terminal width
- `--height <rows>`: Override terminal height

Controls:
- Type letters to match falling words
- Backspace to delete
- Esc or Ctrl+C to quit

### Word List

Place your words in `words/words.txt`, one word per line, letters only. Words are filtered by difficulty for length.


