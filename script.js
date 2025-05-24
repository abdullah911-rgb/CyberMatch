const emojis = ['🍕', '🍩', '🍔', '🍟', '🍇', '🍉', '🍎', '🍓'];
let cards = [...emojis, ...emojis]; // 8 pairs
let flippedCards = [];
let matched = 0;
let moves = 0;
let timer = 0;
let timerInterval = null;

const board = document.getElementById('game-board');
const movesDisplay = document.getElementById('moves');
const timerDisplay = document.getElementById('timer');
const modal = document.getElementById('win-modal');
const finalMoves = document.getElementById('final-moves');
const finalTime = document.getElementById('final-time');
const restartBtn = document.getElementById('restart-btn');

function shuffle(array) {
  return array.sort(() => 0.5 - Math.random());
}

function startGame() {
  cards = shuffle(cards);
  board.innerHTML = '';
  matched = 0;
  moves = 0;
  timer = 0;
  flippedCards = [];

  updateStats();

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timer++;
    updateStats();
  }, 1000);

  for (let i = 0; i < cards.length; i++) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.emoji = cards[i];

    const front = document.createElement('div');
    front.classList.add('front');
    front.textContent = cards[i];

    const back = document.createElement('div');
    back.classList.add('back');
    back.textContent = '?';

    card.appendChild(front);
    card.appendChild(back);

    card.addEventListener('click', () => flipCard(card));

    board.appendChild(card);
  }
}

function flipCard(card) {
  if (
    card.classList.contains('flip') ||
    flippedCards.length === 2
  ) return;

  card.classList.add('flip');
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    moves++;
    updateStats();
    checkMatch();
  }
}

function checkMatch() {
  const [first, second] = flippedCards;
  if (first.dataset.emoji === second.dataset.emoji) {
    matched += 1;
    flippedCards = [];

    if (matched === emojis.length) {
      clearInterval(timerInterval);
      showWinModal();
    }
  } else {
    setTimeout(() => {
      first.classList.remove('flip');
      second.classList.remove('flip');
      flippedCards = [];
    }, 800);
  }
}

function updateStats() {
  movesDisplay.textContent = `Moves: ${moves}`;
  timerDisplay.textContent = `Time: ${timer}s`;
}

function showWinModal() {
  modal.style.display = 'flex';
  finalMoves.textContent = `Moves: ${moves}`;
  finalTime.textContent = `Time: ${timer} seconds`;
}

restartBtn.addEventListener('click', () => {
  modal.style.display = 'none';
  startGame();
});

startGame();