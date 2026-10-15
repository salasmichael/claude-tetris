'use strict';
// Menú de pausa: depende de globals de game.js (init, togglePause, startLevel, paused).
(function () {
  const resumeBtn = document.getElementById('pm-resume');
  const restartBtn2 = document.getElementById('pm-restart');
  const controlsBtn = document.getElementById('pm-controls');
  const controlsList = document.getElementById('pm-controls-list');
  const levelSel = document.getElementById('pm-start-level');

  for (let i = 1; i <= 15; i++) {
    const o = document.createElement('option');
    o.value = o.textContent = String(i);
    levelSel.appendChild(o);
  }
  levelSel.value = String(startLevel);

  resumeBtn.addEventListener('click', () => { if (paused) togglePause(); });
  restartBtn2.addEventListener('click', () => init());
  controlsBtn.addEventListener('click', () => {
    const open = controlsList.hidden;
    controlsList.hidden = !open;
    controlsBtn.setAttribute('aria-expanded', String(open));
  });
  levelSel.addEventListener('change', () => {
    startLevel = Math.min(15, Math.max(1, parseInt(levelSel.value, 10) || 1));
    levelSel.blur();
  });
})();
