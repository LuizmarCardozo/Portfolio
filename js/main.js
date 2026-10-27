/* Navegação do console: telas, controles e temas. */
(() => {
  const screenEl = document.getElementById("screen");
  const THEMES = ["lime", "classic", "amber", "ice"];
  const MENU = [
    { label: "PROJETOS", go: "projects" },
    { label: "SOBRE MIM", go: "about" },
    { label: "SKILLS", go: "skills" },
    { label: "CONTATO", go: "contact" },
    { label: "JOGAR SNAKE", go: "game" }
  ];
  const state = { name: "boot", index: 0 };
  let themeIdx = 0;
  let snake = null;

  const esc = s => String(s).replace(/[&<>"]/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const list = (items, label) =>
    `<ul class="list">${items.map((it, i) =>
      `<li class="${i === state.index ? "sel" : ""}" data-i="${i}">${esc(label(it))}</li>`).join("")}</ul>`;

  const foot = (left, right) => `<div class="foot"><span>${left}</span><span>${right}</span></div>`;

  /* ---------- Telas ---------- */
  const screens = {
    boot: () => `
      <div class="page boot">
        <div class="logo">PORT<span>FOLIO</span></div>
        <div class="sub">${esc(DATA.name)}<br>${esc(DATA.role)}</div>
        <div class="sub blink">PRESS START</div>
      </div>`,

    menu: () => `
      <div class="page"><h1>MENU</h1>${list(MENU, m => m.label)}
      ${foot("A: OK", "SELECT: TEMA")}</div>`,

    projects: () => {
      const p = DATA.projects[state.index];
      return `<div class="page"><h1>PROJETOS</h1>
        ${list(DATA.projects, x => x.name)}
        <div class="detail">${esc(p.desc)}
          <div class="tags">${p.stack.map(t => `<b>${esc(t)}</b>`).join("")}</div></div>
        ${foot("A: ABRIR", "B: VOLTAR")}</div>`;
    },

    about: () => `
      <div class="page"><h1>SOBRE MIM</h1>
        <div class="about">
          <div class="avatar"><img src="${esc(DATA.photo)}" alt="Foto de ${esc(DATA.name)}"
            onerror="this.replaceWith(document.createTextNode('☺'))"></div>
          <div><h2>${esc(DATA.name)}</h2>${DATA.about.map(t => `<p>${esc(t)}</p>`).join("")}</div>
        </div>${foot("", "B: VOLTAR")}</div>`,

    skills: () => `
      <div class="page"><h1>SKILLS</h1>
        ${DATA.skills.map(s => `<div class="skill"><span>${esc(s.name)}</span>
          <div class="bar">${Array.from({ length: 10 }, (_, i) =>
            `<i class="${i < s.level ? "on" : ""}"></i>`).join("")}</div></div>`).join("")}
        ${foot("", "B: VOLTAR")}</div>`,

    contact: () => `
      <div class="page"><h1>CONTATO</h1>${list(DATA.contacts, c => c.name)}
      ${foot("A: ABRIR", "B: VOLTAR")}</div>`,

    game: () => `
      <div class="page game"><div class="score"><span>SNAKE</span><span id="score">PTS 0</span></div>
      <canvas id="canvas" aria-label="Jogo da cobrinha"></canvas>
      ${foot("SETAS: MOVER", "B: SAIR")}</div>`
  };

  function render() {
    screenEl.innerHTML = screens[state.name]();
    if (state.name === "game") {
      const score = document.getElementById("score");
      snake = createSnake(document.getElementById("canvas"), n => score.textContent = "PTS " + n);
    }
  }

  function go(name) {
    if (snake) { snake.stop(); snake = null; }
    state.name = name; state.index = 0; render();
  }

  function cycleTheme() {
    themeIdx = (themeIdx + 1) % THEMES.length;
    document.documentElement.dataset.theme = THEMES[themeIdx];
    if (state.name === "game") { go("game"); }
  }

  const open = url => url.startsWith("mailto:")
    ? (location.href = url) : window.open(url, "_blank", "noopener");

  const listSize = () => ({ menu: MENU.length, projects: DATA.projects.length,
                            contact: DATA.contacts.length }[state.name] || 0);

  function activate() {
    if (state.name === "menu") go(MENU[state.index].go);
    else if (state.name === "projects") open(DATA.projects[state.index].url);
    else if (state.name === "contact") open(DATA.contacts[state.index].url);
  }

  /* ---------- Controles ---------- */
  function press(key) {
    Sound.play(key);
    if (key === "start") return go("menu");
    if (key === "select") return cycleTheme();
    if (state.name === "boot") return key === "a" ? go("menu") : null;
    if (state.name === "game") { if (key === "b") return go("menu"); return snake && snake.input(key); }
    if (key === "b") return go("menu");
    if (key === "a") return activate();

    const n = listSize();
    if (!n) return;
    if (key === "up") state.index = (state.index - 1 + n) % n;
    if (key === "down") state.index = (state.index + 1) % n;
    render();
  }

  const KEYMAP = {
    ArrowUp: "up", w: "up", ArrowDown: "down", s: "down",
    ArrowLeft: "left", a: "left", ArrowRight: "right", d: "right",
    Enter: "a", z: "a", Escape: "b", Backspace: "b", x: "b",
    Shift: "select", " ": "start"
  };

  document.addEventListener("keydown", e => {
    if (e.key.toLowerCase() === "m") { Sound.toggle(); return; }
    const k = KEYMAP[e.key.length === 1 ? e.key.toLowerCase() : e.key];
    if (!k) return;
    e.preventDefault();
    press(k);
  });

  document.querySelectorAll("[data-key]").forEach(b => {
    // pointerdown responde na hora no toque (sem atraso nem zoom)
    b.addEventListener("pointerdown", e => { e.preventDefault(); press(b.dataset.key); });
    // clique sem ponteiro (leitores de tela)
    b.addEventListener("click", e => { if (e.detail === 0) press(b.dataset.key); });
  });

  // Deslizar o dedo na tela controla a cobrinha
  let touch = null;
  screenEl.addEventListener("touchstart", e => {
    const t = e.touches[0]; touch = { x: t.clientX, y: t.clientY };
  }, { passive: true });
  screenEl.addEventListener("touchend", e => {
    if (!touch || state.name !== "game") { touch = null; return; }
    const t = e.changedTouches[0];
    const dx = t.clientX - touch.x, dy = t.clientY - touch.y;
    touch = null;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
    press(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up"));
  }, { passive: true });

  // Toque/clique direto nos itens da lista
  screenEl.addEventListener("click", e => {
    const li = e.target.closest("li[data-i]");
    if (!li) return;
    state.index = Number(li.dataset.i);
    render(); Sound.play("a"); activate();
  });

  document.documentElement.dataset.theme = THEMES[0];
  render();
})();
                            
