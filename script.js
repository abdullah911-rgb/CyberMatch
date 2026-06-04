/* ==========================================================================
   CYBERMATCH // CORE ENGINE & AUDIO SYNTHESIS
   ========================================================================== */

/**
 * SoundSynth - Dynamic Web Audio API sound effect generator
 * Synthesizes retro-futuristic sound effects at runtime without static assets.
 */
class SoundSynth {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  playOscillator(freqStart, freqEnd, duration, type = 'sine', volume = 0.1) {
    if (this.muted) return;
    this.init();
    
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freqStart, this.ctx.currentTime);
    if (freqEnd && freqEnd !== freqStart) {
      osc.frequency.exponentialRampToValueAtTime(freqEnd, this.ctx.currentTime + duration);
    }
    
    gainNode.gain.setValueAtTime(volume, this.ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
    
    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playFlip() {
    // A quick, ascending high-pass chirp
    this.playOscillator(350, 700, 0.08, 'triangle', 0.15);
  }

  playMatch(combo = 1) {
    // A pleasant chord arpeggio based on combo multiplier
    const multiplier = 1 + (combo - 1) * 0.1;
    const notes = [261.63, 329.63, 392.00, 523.25].map(n => n * multiplier); // C4, E4, G4, C5 scaled
    
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playOscillator(freq, freq * 1.05, 0.15, 'sine', 0.12);
      }, idx * 60);
    });
  }

  playMismatch() {
    // Two rapid, descending, dissonant low tones
    this.playOscillator(220, 160, 0.12, 'sawtooth', 0.08);
    setTimeout(() => {
      this.playOscillator(180, 110, 0.18, 'sawtooth', 0.08);
    }, 100);
  }

  playVictory() {
    // An upbeat cyberpunk celebratory arpeggio sequence
    const notes = [
      261.63, 329.63, 392.00, 523.25, 
      392.00, 523.25, 659.25, 783.99
    ];
    
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        const oscType = idx % 2 === 0 ? 'sine' : 'triangle';
        this.playOscillator(freq, freq * 1.02, 0.25, oscType, 0.1);
      }, idx * 90);
    });
  }

  playReset() {
    // Low mechanical sub rumble for resets
    this.playOscillator(150, 80, 0.2, 'sine', 0.2);
  }
}

/**
 * CyberMatch Game Logic
 */
const Themes = {
  cyberpunk: ['👾', '🤖', '💻', '💾', '💿', '🕹️', '🔌', '🔋', '📡', '🔮', '🧬', '🚀', '🛸', '🌌', '🛰️', '🖲️', '⚙️', '🧠'],
  foods: ['🍕', '🍩', '🍔', '🍟', '🍇', '🍉', '🍎', '🍓', '🌮', '🍣', '🥑', '🥞', '🧁', '🍪', '🍿', '🍦', '🥤', '🍺'],
  animals: ['🐼', '🦁', '🐯', '🐨', '🦊', '🐰', '🐸', '🐙', '🦋', '🦖', '🦄', '🐒', '🐧', '🦉', '🦅', '🐝', '🐬', '🐋'],
  space: ['🚀', '🛸', '🌌', '🪐', '🌙', '☀️', '🛰️', '☄️', '🔭', '👨‍🚀', '👽', '🌋', '✨', '🕳️', '📡', '🌍', '🗺️', '🚩']
};

const Configs = {
  easy: { cols: 4, rows: 4, pairs: 8, gridClass: 'grid-easy' },
  medium: { cols: 6, rows: 4, pairs: 12, gridClass: 'grid-medium' },
  hard: { cols: 6, rows: 6, pairs: 18, gridClass: 'grid-hard' }
};

// State Variables
let currentConfig = Configs.medium;
let currentThemeKey = 'cyberpunk';
let cards = [];
let flippedCards = [];
let matchedCount = 0;
let moves = 0;
let score = 0;
let combo = 1;
let timer = 0;
let timerInterval = null;
let isLockBoard = false;
let gameStarted = false;

// Audio System Instance
const synth = new SoundSynth();

// DOM References
const board = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score-display');
const timerDisplay = document.getElementById('timer');
const movesDisplay = document.getElementById('moves');
const comboDisplay = document.getElementById('combo-display');
const comboCard = document.getElementById('combo-card');
const difficultySelect = document.getElementById('difficulty-select');
const themeSelect = document.getElementById('theme-select');
const soundToggleBtn = document.getElementById('sound-toggle-btn');
const resetLeaderboardBtn = document.getElementById('reset-leaderboard-btn');

// Records DOM
const records = {
  easy: document.getElementById('record-easy'),
  medium: document.getElementById('record-medium'),
  hard: document.getElementById('record-hard')
};

// Modal DOM
const modal = document.getElementById('win-modal');
const finalDifficulty = document.getElementById('final-difficulty');
const finalScore = document.getElementById('final-score');
const finalTime = document.getElementById('final-time');
const finalMoves = document.getElementById('final-moves');
const newRecordBanner = document.getElementById('new-record-banner');
const restartBtn = document.getElementById('restart-btn');

/**
 * Setup Event Listeners
 */
function initGame() {
  difficultySelect.addEventListener('change', (e) => {
    currentConfig = Configs[e.target.value];
    synth.playReset();
    resetGame();
  });

  themeSelect.addEventListener('change', (e) => {
    currentThemeKey = e.target.value;
    synth.playReset();
    resetGame();
  });

  soundToggleBtn.addEventListener('click', () => {
    const isMuted = synth.toggleMute();
    if (!isMuted) {
      synth.init();
      synth.playFlip();
    }
    const icon = isMuted ? '🔇' : '🔊';
    const stateText = isMuted ? 'Muted' : 'On';
    soundToggleBtn.querySelector('.btn-icon').textContent = icon;
    soundToggleBtn.querySelector('.btn-text').textContent = `Audio: ${stateText}`;
  });

  resetLeaderboardBtn.addEventListener('click', () => {
    if (confirm("Reset all stored records?")) {
      localStorage.removeItem('cybermatch_records');
      synth.playReset();
      loadLeaderboard();
    }
  });

  restartBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    resetGame();
  });

  // Load and display previous records
  loadLeaderboard();

  // Initial Start
  resetGame();
}

/**
 * Game Setup & Controller Logic
 */
function resetGame() {
  clearInterval(timerInterval);
  board.innerHTML = '';
  
  // Re-apply correct class list to game-board grid
  board.className = 'game-board ' + currentConfig.gridClass;
  
  // Reset states
  flippedCards = [];
  matchedCount = 0;
  moves = 0;
  score = 0;
  combo = 1;
  timer = 0;
  isLockBoard = false;
  gameStarted = false;

  updateStatsDisplay();

  // Shuffle and assemble card deck
  const items = selectThemeItems(currentThemeKey, currentConfig.pairs);
  cards = shuffle([...items, ...items]);

  // Construct board elements
  cards.forEach((val, idx) => {
    const cardEl = createCardElement(val, idx);
    board.appendChild(cardEl);
  });
}

function selectThemeItems(themeName, count) {
  const fullList = [...Themes[themeName]];
  // Shuffle list and slice required number of pairs
  const shuffled = shuffle(fullList);
  return shuffled.slice(0, count);
}

function shuffle(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function createCardElement(value, index) {
  const card = document.createElement('div');
  card.className = 'card';
  card.dataset.index = index;
  card.dataset.value = value;

  const inner = document.createElement('div');
  inner.className = 'card-inner';

  const back = document.createElement('div');
  back.className = 'card-back';
  back.textContent = '//'; // Cyber design placeholder for back

  const front = document.createElement('div');
  front.className = 'card-front';
  front.textContent = value;

  inner.appendChild(front);
  inner.appendChild(back);
  card.appendChild(inner);

  card.addEventListener('click', () => handleCardClick(card));
  return card;
}

/**
 * Gameplay Loops
 */
function handleCardClick(card) {
  if (isLockBoard) return;
  if (card.classList.contains('flip') || card.classList.contains('matched')) return;

  // Initialize context on first click if muted toggle is on
  synth.init();

  // Start timer on first flip
  if (!gameStarted) {
    gameStarted = true;
    startTimer();
  }

  // Visual Flip
  card.classList.add('flip');
  flippedCards.push(card);
  synth.playFlip();

  if (flippedCards.length === 2) {
    moves++;
    isLockBoard = true;
    checkMatch();
  }
}

function checkMatch() {
  const [first, second] = flippedCards;
  const match = first.dataset.value === second.dataset.value;

  if (match) {
    // Process successful match
    matchedCount++;
    
    // Add custom matched classes
    first.classList.add('matched');
    second.classList.add('matched');
    
    // Score updates: Combo builds!
    score += 100 * combo;
    synth.playMatch(combo);
    
    // Increase combo tracker
    combo++;
    updateComboDisplay(true);

    // Clean active checks
    flippedCards = [];
    isLockBoard = false;

    // Check Win condition
    if (matchedCount === currentConfig.pairs) {
      handleVictory();
    }
  } else {
    // Reset combo
    combo = 1;
    updateComboDisplay(false);
    synth.playMismatch();

    // Trigger mismatch visual shake
    first.classList.add('shake');
    second.classList.add('shake');

    setTimeout(() => {
      first.classList.remove('flip', 'shake');
      second.classList.remove('flip', 'shake');
      flippedCards = [];
      isLockBoard = false;
    }, 700);
  }

  updateStatsDisplay();
}

/**
 * Scoreboard & Data State Updates
 */
function startTimer() {
  timerInterval = setInterval(() => {
    timer++;
    timerDisplay.textContent = formatTime(timer);
  }, 1000);
}

function formatTime(seconds) {
  const min = Math.floor(seconds / 60).toString().padStart(2, '0');
  const sec = (seconds % 60).toString().padStart(2, '0');
  return `${min}:${sec}`;
}

function updateStatsDisplay() {
  scoreDisplay.textContent = score.toString().padStart(4, '0');
  movesDisplay.textContent = moves.toString().padStart(2, '0');
  timerDisplay.textContent = formatTime(timer);
}

function updateComboDisplay(active) {
  if (active && combo > 2) {
    comboDisplay.textContent = `x${combo - 1}`;
    comboCard.className = 'stat-card glass-panel neon-border-green combo-active';
  } else {
    comboDisplay.textContent = 'x1';
    comboCard.className = 'stat-card glass-panel neon-border-green combo-inactive';
  }
}

/**
 * Victory Resolution & Leaderboards
 */
function handleVictory() {
  clearInterval(timerInterval);
  synth.playVictory();

  // Add ultimate victory bonus score: speed and moves efficiency
  const speedBonus = Math.max(100, 2000 - (timer * 8) - (moves * 12));
  score += Math.round(speedBonus);
  updateStatsDisplay();

  // Find difficulty name key
  const difficultyName = difficultySelect.value;
  
  // Persist score & check for new personal high score
  const isNewRecord = saveScoreRecord(difficultyName, score, timer, moves);

  // Setup modal dashboard
  finalDifficulty.textContent = difficultyName.toUpperCase();
  finalScore.textContent = score.toString().padStart(4, '0');
  finalTime.textContent = formatTime(timer);
  finalMoves.textContent = moves.toString().padStart(2, '0');

  if (isNewRecord) {
    newRecordBanner.className = 'new-record-active';
  } else {
    newRecordBanner.className = 'hidden-banner';
  }

  // Load and refresh leaderboard values
  loadLeaderboard();

  // Modal display
  setTimeout(() => {
    modal.style.display = 'flex';
  }, 600);
}

function saveScoreRecord(level, scoreVal, timeVal, movesVal) {
  let recordsData = JSON.parse(localStorage.getItem('cybermatch_records')) || {};
  const currentRecord = recordsData[level];

  // We determine "better" record primarily based on high score
  const isBetter = !currentRecord || scoreVal > currentRecord.score;

  if (isBetter) {
    recordsData[level] = {
      score: scoreVal,
      time: timeVal,
      moves: movesVal
    };
    localStorage.setItem('cybermatch_records', JSON.stringify(recordsData));
    return true;
  }
  return false;
}

function loadLeaderboard() {
  const recordsData = JSON.parse(localStorage.getItem('cybermatch_records')) || {};
  
  const levels = ['easy', 'medium', 'hard'];
  levels.forEach(level => {
    const data = recordsData[level];
    if (data) {
      records[level].textContent = `${data.score.toString().padStart(4, '0')}pts / ${formatTime(data.time)}`;
    } else {
      records[level].textContent = '-- / --';
    }
  });
}

// Initialise Game Engine
document.addEventListener('DOMContentLoaded', initGame);