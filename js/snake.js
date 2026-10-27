/* Jogo da cobrinha em canvas. */
function createSnake(canvas, onScore) {
  const COLS = 16, ROWS = 14, CELL = 10, SPEED = 130;
  canvas.width = COLS * CELL;
  canvas.height = ROWS * CELL;
  const ctx = canvas.getContext("2d");
  const css = getComputedStyle(document.documentElement);
  let snake, dir, next, food, score, over, timer;

  const rand = n => Math.floor(Math.random() * n);

  function placeFood() {
    do { food = { x: rand(COLS), y: rand(ROWS) }; }
    while (snake.some(p => p.x === food.x && p.y === food.y));
  }

  function reset() {
    snake = [{ x: 8, y: 7 }, { x: 7, y: 7 }, { x: 6, y: 7 }];
    dir = next = { x: 1, y: 0 };
    score = 0; over = false;
    placeFood(); onScore(score); draw();
  }

  function tick() {
    if (over) return;
    dir = next;
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
    const hit = head.x < 0 || head.y < 0 || head.x >= COLS || head.y >= ROWS ||
                snake.some(p => p.x === head.x && p.y === head.y);
    if (hit) { over = true; Sound.play("over"); draw(); return; }
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      score++; onScore(score); Sound.play("eat"); placeFood();
    } else snake.pop();
    draw();
  }

  function draw() {
    const bg = css.getPropertyValue("--bg").trim();
    const ink = css.getPropertyValue("--ink").trim();
    ctx.fillStyle = bg; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = ink;
    snake.forEach(p => ctx.fillRect(p.x * CELL + 1, p.y * CELL + 1, CELL - 2, CELL - 2));
    ctx.fillRect(food.x * CELL + 3, food.y * CELL + 3, CELL - 6, CELL - 6);
    if (over) {
      ctx.fillRect(20, 48, 120, 44);
      ctx.fillStyle = bg; ctx.textAlign = "center";
      ctx.font = "bold 14px monospace"; ctx.fillText("GAME OVER", 80, 66);
      ctx.font = "9px monospace"; ctx.fillText("A = jogar de novo", 80, 82);
    }
  }

  function input(key) {
    if (over) { if (key === "a") reset(); return; }
    if (key === "up" && dir.y !== 1) next = { x: 0, y: -1 };
    if (key === "down" && dir.y !== -1) next = { x: 0, y: 1 };
    if (key === "left" && dir.x !== 1) next = { x: -1, y: 0 };
    if (key === "right" && dir.x !== -1) next = { x: 1, y: 0 };
  }

  reset();
  timer = setInterval(tick, SPEED);
  return { input, stop() { clearInterval(timer); } };
}
