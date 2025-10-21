const KEY = 'beatpe_scores';
const keys = { 'KeyA': 0, 'KeyS': 1, 'KeyD': 2, 'KeyF': 3 };

const screens = {
  start: document.getElementById('start-screen'),
  game: document.getElementById('game-screen'),
  over: document.getElementById('over-screen')
};

const cols = document.querySelectorAll('.col');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const finalScoreEl = document.getElementById('final-score');
const gameScreen = document.getElementById('game-screen');

let playing = false;
let score = 0;
let lives = 3;
let currentLit = null;
let timer = null;
let lightTime = 1200;

function show(screen) {
  Object.values(screens).forEach(s => s.classList.add('hidden'));
  screen.classList.remove('hidden');
}

function update() {
  scoreEl.textContent = score;
  livesEl.textContent = `Lives: ${lives}`;
}

function shake() {
  gameScreen.style.animation = 'none';
  setTimeout(() => gameScreen.style.animation = 'shake 0.4s', 10);
}

function startGame() {
  playing = true;
  score = 0;
  lives = 3;
  lightTime = 1200;
  update();
  show(screens.game);
  nextRound();
}

function endGame() {
  playing = false;
  clearTimeout(timer);
  cols.forEach(c => c.classList.remove('lit'));
  finalScoreEl.textContent = score;
  
  if (score > 0) {
    const scores = JSON.parse(localStorage.getItem(KEY) || '[]');
    scores.push({ score, time: new Date().toISOString() });
    localStorage.setItem(KEY, JSON.stringify(scores));
  }
  
  show(screens.over);
}

function nextRound() {
  if (!playing) return;

  cols.forEach(c => c.classList.remove('lit'));
  currentLit = Math.floor(Math.random() * 4);
  cols[currentLit].classList.add('lit');

  timer = setTimeout(() => {
    lives--;
    shake();
    update();
    if (lives <= 0) endGame();
    else nextRound();
  }, lightTime);

  lightTime = Math.max(400, lightTime * 0.99);
}

function handlePress(index) {
  if (!playing) return;

  const col = cols[index];

  if (index === currentLit) {
    score += 100;
    col.classList.add('success');
    col.classList.remove('lit')
    setTimeout(() => col.classList.remove('success'), 200);
    clearTimeout(timer);
    update();
    setTimeout(nextRound, 400);
  } else {
    score = Math.max(0, score - 50);
    lives--;
    col.classList.add('fail');
    setTimeout(() => col.classList.remove('fail'), 200);
    shake();
    update();
    if (lives <= 0) endGame();
  }
}

document.addEventListener('keydown', e => {
  if (e.code === 'Space') {
    e.preventDefault();
    if (!playing) startGame();
  }
  
  if (playing && keys[e.code] !== undefined) {
    e.preventDefault();
    handlePress(keys[e.code]);
  }
});

cols.forEach((col, i) => {
  col.addEventListener('click', () => {
    if (playing) handlePress(i);
  });
});



const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
document.querySelectorAll('.mobi').forEach(btn => {
  if (isMobile) btn.classList.remove('hidden');
  else btn.classList.add('hidden');
});
document.querySelectorAll('.subtitle').forEach(txt => {
  if (isMobile) txt.style.display = 'none';
  else txt.style.display = 'block';
});
