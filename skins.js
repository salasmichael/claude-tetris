'use strict';

// Skins visuales. Cada skin define: palette (indices 1-7), bg (null = fondo CSS),
// grid (color de la rejilla) y draw(ctx, px, py, size, color).
// px/py son coordenadas en pixeles; el alpha global ya viene aplicado por drawBlock.

function skinRoundRect(c, x, y, w, h, r) {
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}

const SKINS = {
  retro: {
    name: 'Retro',
    palette: [null, '#4dd0e1', '#ffd54f', '#ba68c8', '#81c784', '#e57373', '#7986cb', '#ffb74d'],
    bg: null,
    grid: '#22222e',
    draw(c, px, py, s, color) {
      c.fillStyle = color;
      c.fillRect(px + 1, py + 1, s - 2, s - 2);
      c.fillStyle = 'rgba(255,255,255,0.12)';
      c.fillRect(px + 1, py + 1, s - 2, 4);
    },
  },
  neon: {
    name: 'Neon',
    palette: [null, '#00f0ff', '#fff700', '#d400ff', '#39ff14', '#ff073a', '#4d6bff', '#ff9100'],
    bg: '#000000',
    grid: '#1a1a24',
    draw(c, px, py, s, color) {
      c.shadowColor = color;
      c.shadowBlur = 12;
      c.strokeStyle = color;
      c.lineWidth = 2;
      c.strokeRect(px + 3, py + 3, s - 6, s - 6);
      c.shadowBlur = 0;
      c.shadowColor = 'transparent';
      c.fillStyle = color;
      c.globalAlpha *= 0.35;
      c.fillRect(px + 4, py + 4, s - 8, s - 8);
      c.globalAlpha /= 0.35;
    },
  },
  pastel: {
    name: 'Pastel',
    palette: [null, '#a8e6ef', '#fff2b3', '#d9b8f0', '#b8ecc0', '#f7b9b9', '#b6bff0', '#ffd6a5'],
    bg: '#fdf6f0',
    grid: '#eadfd6',
    draw(c, px, py, s, color) {
      c.fillStyle = color;
      skinRoundRect(c, px + 2, py + 2, s - 4, s - 4, 7);
      c.fill();
      c.fillStyle = 'rgba(255,255,255,0.5)';
      skinRoundRect(c, px + 5, py + 5, s - 14, 5, 2.5);
      c.fill();
    },
  },
  pixel: {
    name: 'Pixel art',
    palette: [null, '#3fc1d6', '#f2c230', '#9b45b0', '#4caf50', '#d84a4a', '#4b5bbd', '#f08a24'],
    bg: '#101018',
    grid: '#1c1c28',
    draw(c, px, py, s, color) {
      const u = Math.max(2, Math.floor(s / 6));
      c.fillStyle = color;
      c.fillRect(px, py, s, s);
      // bordes claro/oscuro
      c.fillStyle = 'rgba(255,255,255,0.35)';
      c.fillRect(px, py, s, u);
      c.fillRect(px, py, u, s);
      c.fillStyle = 'rgba(0,0,0,0.35)';
      c.fillRect(px, py + s - u, s, u);
      c.fillRect(px + s - u, py, u, s);
      // textura de tablero de ajedrez
      c.fillStyle = 'rgba(0,0,0,0.18)';
      for (let i = 1; i < 5; i++)
        for (let j = 1; j < 5; j++)
          if ((i + j) % 2 === 0) c.fillRect(px + i * u, py + j * u, u, u);
    },
  },
};

const SKIN_KEY = 'tetris.skin';
let activeSkin = SKINS.retro;

function loadSkinName() {
  try {
    const v = localStorage.getItem(SKIN_KEY);
    if (v && Object.prototype.hasOwnProperty.call(SKINS, v)) return v;
  } catch (e) { /* ignorar */ }
  return 'retro';
}

function setSkin(name, persist) {
  if (!Object.prototype.hasOwnProperty.call(SKINS, name)) name = 'retro';
  activeSkin = SKINS[name];
  document.body.setAttribute('data-skin', name);
  const sel = document.getElementById('skin-select');
  if (sel && sel.value !== name) sel.value = name;
  if (persist) {
    try { localStorage.setItem(SKIN_KEY, name); } catch (e) { /* ignorar */ }
  }
  if (typeof redrawAll === 'function') redrawAll();
}

function initSkinSelect() {
  const sel = document.getElementById('skin-select');
  if (!sel) return;
  sel.addEventListener('change', () => {
    setSkin(sel.value, true);
    sel.blur();
  });
  // Evitar que las teclas de juego cambien el select o lo activen
  sel.addEventListener('keydown', e => {
    if (e.code === 'Space' || e.code.startsWith('Arrow')) {
      e.preventDefault();
      sel.blur();
    }
  });
}
