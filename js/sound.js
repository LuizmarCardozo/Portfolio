/* Efeitos sonoros 8-bit gerados no navegador (sem arquivos de áudio). */
const Sound = (() => {
  const freq = { up: 660, down: 520, left: 580, right: 600, a: 880, b: 330,
                 start: 990, select: 440, eat: 1200, over: 150 };
  let ctx = null;
  let muted = false;

  function play(key) {
    if (muted) return;
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.value = freq[key] || 500;
      gain.gain.value = 0.04;
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);
      osc.stop(ctx.currentTime + 0.12);
    } catch (e) { /* áudio indisponível */ }
  }

  return { play, toggle() { muted = !muted; return muted; } };
})();
