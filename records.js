'use strict';

// Tabla de records local (localStorage). Cargado antes de game.js.
const Records = (() => {
  const KEY = 'tetris.records';
  const MAX = 5;

  function empty() {
    return { top: [], bestCombo: 0, maxLines: 0 };
  }

  function load() {
    const data = empty();
    try {
      const raw = JSON.parse(localStorage.getItem(KEY));
      if (raw && typeof raw === 'object') {
        if (Array.isArray(raw.top)) {
          data.top = raw.top
            .filter(e => e && Number.isFinite(e.score))
            .map(e => ({
              name: String(e.name || '').slice(0, 12),
              score: e.score,
              lines: Number.isFinite(e.lines) ? e.lines : 0,
              date: String(e.date || ''),
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, MAX);
        }
        if (Number.isFinite(raw.bestCombo)) data.bestCombo = raw.bestCombo;
        if (Number.isFinite(raw.maxLines)) data.maxLines = raw.maxLines;
      }
    } catch (_) { /* storage no disponible o JSON invalido */ }
    return data;
  }

  function save(data) {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (_) {}
  }

  function qualifies(score) {
    if (score <= 0) return false;
    const top = load().top;
    return top.length < MAX || score > top[top.length - 1].score;
  }

  // Actualiza mejor combo y maximo de lineas; no toca el top.
  function updateStats(combo, lines) {
    const data = load();
    let changed = false;
    if (combo > data.bestCombo) { data.bestCombo = combo; changed = true; }
    if (lines > data.maxLines) { data.maxLines = lines; changed = true; }
    if (changed) save(data);
  }

  // Inserta una entrada y devuelve su posicion (o -1 si no entra).
  function add(name, score, lines) {
    const data = load();
    const entry = {
      name: (String(name).trim() || 'ANON').slice(0, 12),
      score,
      lines,
      date: new Date().toISOString().slice(0, 10),
    };
    // Empates: la entrada nueva va despues de las existentes.
    let idx = data.top.findIndex(e => score > e.score);
    if (idx === -1) idx = data.top.length;
    data.top.splice(idx, 0, entry);
    data.top = data.top.slice(0, MAX);
    save(data);
    return idx < MAX ? idx : -1;
  }

  function reset() {
    try { localStorage.removeItem(KEY); } catch (_) {}
  }

  // Dibuja la tabla dentro de `el` usando solo textContent.
  function render(el, highlightIdx) {
    const data = load();
    el.textContent = '';
    const list = document.createElement('ol');
    list.className = 'records-list';
    if (!data.top.length) {
      const li = document.createElement('li');
      li.className = 'records-empty';
      li.textContent = 'Sin records todavía';
      list.appendChild(li);
    }
    data.top.forEach((e, i) => {
      const li = document.createElement('li');
      if (i === highlightIdx) li.className = 'records-new';
      const n = document.createElement('span');
      n.className = 'rec-name';
      n.textContent = e.name;
      const s = document.createElement('span');
      s.className = 'rec-score';
      s.textContent = e.score.toLocaleString();
      li.append(n, s);
      list.appendChild(li);
    });
    const stats = document.createElement('div');
    stats.className = 'records-stats';
    stats.textContent = `Mejor combo: ${data.bestCombo} · Líneas máx: ${data.maxLines}`;
    el.append(list, stats);
  }

  return { qualifies, updateStats, add, reset, render };
})();
