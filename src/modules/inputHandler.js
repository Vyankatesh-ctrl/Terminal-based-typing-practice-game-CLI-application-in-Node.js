import readline from 'node:readline';

export function createInputHandler() {
  const listeners = new Set();
  let buffer = '';

  const rl = readline.createInterface({
    input: process.stdin,
    escapeCodeTimeout: 50,
    terminal: true
  });

  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }
  readline.emitKeypressEvents(process.stdin, rl);

  function emit(event, payload) {
    for (const fn of listeners) fn(event, payload);
  }

  function onEvent(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  function getBuffer() {
    return buffer;
  }

  function clearBuffer() {
    buffer = '';
    emit('buffer', buffer);
  }

  function close() {
    rl.close();
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(false);
    }
  }

  process.stdin.on('keypress', (_str, key) => {
    if (!key) return;
    if (key.name === 'escape' || (key.ctrl && key.name === 'c')) {
      emit('exit');
      return;
    }
    if (key.name === 'backspace') {
      buffer = buffer.slice(0, -1);
      emit('buffer', buffer);
      return;
    }
    if (key.sequence && key.sequence.length === 1 && !key.ctrl && !key.meta) {
      const ch = key.sequence;
      if (/^[a-zA-Z]$/.test(ch)) {
        buffer += ch.toLowerCase();
        emit('buffer', buffer);
      }
    }
  });

  return { onEvent, getBuffer, clearBuffer, close };
}


