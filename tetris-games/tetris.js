// テトリス - HTML/CSS/JS版

const COLS = 10;
const ROWS = 20;
const BLOCK = 30;
const COLORS = [
  null,
  '#00f0f0', // I - シアン
  '#f0f000', // O - 黄
  '#a000f0', // T - 紫
  '#00f000', // S - 緑
  '#f00000', // Z - 赤
  '#0000f0', // J - 青
  '#f0a000', // L - オレンジ
];

// テトリミノの形状定義
const SHAPES = [
  null,
  [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]], // I
  [[2,2],[2,2]],                               // O
  [[0,3,0],[3,3,3],[0,0,0]],                   // T
  [[0,4,4],[4,4,0],[0,0,0]],                   // S
  [[5,5,0],[0,5,5],[0,0,0]],                   // Z
  [[6,0,0],[6,6,6],[0,0,0]],                   // J
  [[0,0,7],[7,7,7],[0,0,0]],                   // L
];

const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const nextCanvas = document.getElementById('nextCanvas');
const nextCtx = nextCanvas.getContext('2d');
const holdCanvas = document.getElementById('holdCanvas');
const holdCtx = holdCanvas.getContext('2d');
const overlay = document.getElementById('overlay');
const overlayMessage = document.getElementById('overlayMessage');
const scoreEl = document.getElementById('score');
const linesEl = document.getElementById('lines');
const levelEl = document.getElementById('level');

// ゲーム状態
let board = [];
let current = null;
let currentX = 0;
let currentY = 0;
let nextQueue = [];
let holdPiece = null;
let canHold = true;
let score = 0;
let lines = 0;
let level = 1;
let gameOver = false;
let paused = false;
let dropInterval = 1000;
let lastDrop = 0;
let animationId = null;
let bag = [];

// 7-bagランダマイザ
function fillBag() {
  bag = [1, 2, 3, 4, 5, 6, 7];
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
}

function nextPieceType() {
  if (bag.length === 0) fillBag();
  return bag.pop();
}

function createPiece(type) {
  return SHAPES[type].map(row => [...row]);
}

function initBoard() {
  board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

function resetGame() {
  initBoard();
  bag = [];
  fillBag();
  nextQueue = [];
  for (let i = 0; i < 3; i++) nextQueue.push(nextPieceType());
  holdPiece = null;
  canHold = true;
  score = 0;
  lines = 0;
  level = 1;
  dropInterval = 1000;
  gameOver = false;
  paused = false;
  overlay.classList.add('hidden');
  spawnPiece();
  updateUI();
  lastDrop = performance.now();
}

function spawnPiece() {
  const type = nextQueue.shift();
  nextQueue.push(nextPieceType());
  current = createPiece(type);
  currentX = Math.floor((COLS - current[0].length) / 2);
  currentY = 0;
  if (collides(current, currentX, currentY)) {
    gameOver = true;
    overlayMessage.textContent = 'GAME OVER';
    overlay.classList.remove('hidden');
  }
}

function collides(piece, px, py) {
  for (let y = 0; y < piece.length; y++) {
    for (let x = 0; x < piece[y].length; x++) {
      if (piece[y][x]) {
        const nx = px + x;
        const ny = py + y;
        if (nx < 0 || nx >= COLS || ny >= ROWS) return true;
        if (ny >= 0 && board[ny][nx]) return true;
      }
    }
  }
  return false;
}

function merge() {
  for (let y = 0; y < current.length; y++) {
    for (let x = 0; x < current[y].length; x++) {
      if (current[y][x]) {
        board[currentY + y][currentX + x] = current[y][x];
      }
    }
  }
}

function clearLines() {
  let cleared = 0;
  for (let y = ROWS - 1; y >= 0; y--) {
    if (board[y].every(cell => cell !== 0)) {
      board.splice(y, 1);
      board.unshift(Array(COLS).fill(0));
      cleared++;
      y++;
    }
  }
  if (cleared > 0) {
    const points = [0, 100, 300, 500, 800];
    score += points[cleared] * level;
    lines += cleared;
    level = Math.floor(lines / 10) + 1;
    dropInterval = Math.max(100, 1000 - (level - 1) * 80);
    updateUI();
  }
}

function rotate(piece) {
  const size = piece.length;
  const rotated = Array.from({ length: size }, () => Array(size).fill(0));
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      rotated[x][size - 1 - y] = piece[y][x];
    }
  }
  return rotated;
}

function tryRotate() {
  const rotated = rotate(current);
  const kicks = [0, -1, 1, -2, 2];
  for (const kick of kicks) {
    if (!collides(rotated, currentX + kick, currentY)) {
      current = rotated;
      currentX += kick;
      return;
    }
  }
}

function moveLeft() {
  if (!collides(current, currentX - 1, currentY)) currentX--;
}

function moveRight() {
  if (!collides(current, currentX + 1, currentY)) currentX++;
}

function moveDown() {
  if (!collides(current, currentX, currentY + 1)) {
    currentY++;
    return true;
  }
  return false;
}

function hardDrop() {
  while (!collides(current, currentX, currentY + 1)) {
    currentY++;
    score += 2;
  }
  merge();
  clearLines();
  canHold = true;
  spawnPiece();
  updateUI();
}

function hold() {
  if (!canHold) return;
  canHold = false;
  const type = current.flat().find(v => v > 0);
  if (holdPiece === null) {
    holdPiece = type;
    spawnPiece();
  } else {
    const tmp = holdPiece;
    holdPiece = type;
    current = createPiece(tmp);
    currentX = Math.floor((COLS - current[0].length) / 2);
    currentY = 0;
  }
}

function getGhostY() {
  let gy = currentY;
  while (!collides(current, currentX, gy + 1)) gy++;
  return gy;
}

// 描画
function drawBlock(context, x, y, color, size = BLOCK) {
  context.fillStyle = color;
  context.fillRect(x * size, y * size, size - 1, size - 1);
  context.fillStyle = 'rgba(255,255,255,0.15)';
  context.fillRect(x * size, y * size, size - 1, 3);
  context.fillRect(x * size, y * size, 3, size - 1);
}

function drawBoard() {
  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // グリッド
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = 0.5;
  for (let x = 0; x <= COLS; x++) {
    ctx.beginPath(); ctx.moveTo(x * BLOCK, 0); ctx.lineTo(x * BLOCK, ROWS * BLOCK); ctx.stroke();
  }
  for (let y = 0; y <= ROWS; y++) {
    ctx.beginPath(); ctx.moveTo(0, y * BLOCK); ctx.lineTo(COLS * BLOCK, y * BLOCK); ctx.stroke();
  }

  // 固定ブロック
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (board[y][x]) drawBlock(ctx, x, y, COLORS[board[y][x]]);
    }
  }

  if (current && !gameOver) {
    // ゴースト
    const ghostY = getGhostY();
    for (let y = 0; y < current.length; y++) {
      for (let x = 0; x < current[y].length; x++) {
        if (current[y][x]) {
          ctx.fillStyle = 'rgba(255,255,255,0.1)';
          ctx.fillRect((currentX + x) * BLOCK, (ghostY + y) * BLOCK, BLOCK - 1, BLOCK - 1);
        }
      }
    }

    // 現在のピース
    for (let y = 0; y < current.length; y++) {
      for (let x = 0; x < current[y].length; x++) {
        if (current[y][x]) {
          drawBlock(ctx, currentX + x, currentY + y, COLORS[current[y][x]]);
        }
      }
    }
  }
}

function drawPreview(context, piece, cw, ch) {
  context.fillStyle = 'transparent';
  context.clearRect(0, 0, cw, ch);
  if (!piece) return;
  const shape = typeof piece === 'number' ? createPiece(piece) : piece;
  const size = 20;
  const offsetX = (cw - shape[0].length * size) / 2;
  const offsetY = (ch / (typeof piece === 'number' && nextQueue ? 1 : 1) - shape.length * size) / 2;
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        context.fillStyle = COLORS[shape[y][x]];
        context.fillRect(offsetX + x * size, offsetY + y * size, size - 1, size - 1);
      }
    }
  }
}

function drawNext() {
  nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
  const size = 20;
  for (let i = 0; i < nextQueue.length; i++) {
    const shape = createPiece(nextQueue[i]);
    const offsetX = (nextCanvas.width - shape[0].length * size) / 2;
    const offsetY = 15 + i * 95;
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          nextCtx.fillStyle = COLORS[shape[y][x]];
          nextCtx.fillRect(offsetX + x * size, offsetY + y * size, size - 1, size - 1);
        }
      }
    }
  }
}

function drawHold() {
  holdCtx.clearRect(0, 0, holdCanvas.width, holdCanvas.height);
  if (holdPiece) {
    drawPreview(holdCtx, holdPiece, holdCanvas.width, holdCanvas.height);
  }
}

function updateUI() {
  scoreEl.textContent = score;
  linesEl.textContent = lines;
  levelEl.textContent = level;
}

// ゲームループ
function gameLoop(timestamp) {
  animationId = requestAnimationFrame(gameLoop);
  if (gameOver || paused) {
    drawBoard();
    drawNext();
    drawHold();
    return;
  }

  if (timestamp - lastDrop > dropInterval) {
    if (!moveDown()) {
      merge();
      clearLines();
      canHold = true;
      spawnPiece();
    }
    lastDrop = timestamp;
  }

  drawBoard();
  drawNext();
  drawHold();
}

// キー入力
document.addEventListener('keydown', (e) => {
  if (gameOver) {
    if (e.code === 'Space') { resetGame(); return; }
    return;
  }
  if (e.code === 'KeyP') {
    paused = !paused;
    if (paused) {
      overlayMessage.textContent = 'PAUSE';
      overlay.classList.remove('hidden');
    } else {
      overlay.classList.add('hidden');
    }
    return;
  }
  if (paused) return;

  switch (e.code) {
    case 'ArrowLeft': moveLeft(); break;
    case 'ArrowRight': moveRight(); break;
    case 'ArrowDown': moveDown(); score += 1; updateUI(); break;
    case 'ArrowUp': tryRotate(); break;
    case 'Space': e.preventDefault(); hardDrop(); break;
    case 'KeyC': hold(); break;
  }
});

// モバイルボタン
document.getElementById('btnLeft').addEventListener('click', () => { if (!gameOver && !paused) moveLeft(); });
document.getElementById('btnRight').addEventListener('click', () => { if (!gameOver && !paused) moveRight(); });
document.getElementById('btnDown').addEventListener('click', () => { if (!gameOver && !paused) { moveDown(); score += 1; updateUI(); } });
document.getElementById('btnRotate').addEventListener('click', () => { if (!gameOver && !paused) tryRotate(); });
document.getElementById('btnDrop').addEventListener('click', () => { if (!gameOver && !paused) hardDrop(); });
document.getElementById('btnHold').addEventListener('click', () => { if (!gameOver && !paused) hold(); });

// タッチスワイプ対応
let touchStartX = 0;
let touchStartY = 0;
canvas.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
});
canvas.addEventListener('touchend', (e) => {
  if (gameOver || paused) return;
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
    tryRotate();
  }
});

// 開始
resetGame();
requestAnimationFrame(gameLoop);
