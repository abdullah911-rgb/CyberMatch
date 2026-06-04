# 👾 CyberMatch // Neural Memory Matrix

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Web Audio API](https://img.shields.io/badge/Web%20Audio%20API-000000?style=for-the-badge&logo=soundcharts&logoColor=cyan)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> **CyberMatch** is a premium, high-fidelity cyberpunk memory matrix matching game built completely with vanilla HTML5, CSS3, and JavaScript. Featuring dynamic runtime synthesizer audio effects, glassmorphic design language, neon responsive grids, and combo-based scoring systems, it is a fully immersive browser-based arcade experience.

---

## ⚡ Live Demo & Preview

*Experience the neural synchronization:* Simply open `index.html` in any modern web browser or host it via GitHub Pages!


---

## 🚀 Key Features

*   **🎧 Real-Time Audio Synthesis:** No bulky audio assets or asset folders! Using the native browser **Web Audio API**, CyberMatch dynamically synthesizes futuristic oscillators, low-pass chirps, dissonant error alerts, and triumphant victory arpeggios directly in the browser.
*   **🌌 Neo-Glassmorphism UI:** Stunning aesthetic featuring custom radial glow-spheres, responsive backdrop filters, cyberpunk neon borders, pulsating animations, and a retro-futuristic glitch title sequence.
*   **🧩 Dynamic Grid Calibration:** Choose your neural density in real time:
    *   **Easy:** 4x4 Grid (8 pairs)
    *   **Medium:** 6x4 Grid (12 pairs)
    *   **Hard:** 6x6 Grid (18 pairs)
*   **🎨 High-Contrast Neural Themes:** Match different data sets with interactive emoji blocks:
    *   `👾 Cyberpunk` (Decryption nodes, chips, batteries, holograms)
    *   `🍕 Neo Food` (Neon snacks and drinks)
    *   `🐼 Bio Animals` (Fluorescent bio-organisms)
    *   `🚀 Star Odyssey` (Cosmic probes, planets, spacecraft)
*   **📈 Advanced Scoring & Combos:** Matches earn points dynamically. Consistently matching cards builds a **Combo Streak** (e.g. `x2`, `x3`), which acts as a multiplier. Speed and move-count bonuses are computed at victory to reward neural efficiency.
*   **🏆 Stored High Scores:** Automatically tracks and saves your personal best records (Score + Time) for each difficulty tier using `localStorage`.

---

## 📂 File Architecture

The game has a streamlined, modular architecture with zero external runtime dependencies:

```markdown
game/
│
├── index.html     # Semantic layout, SVG icons, and neural modal structures
├── style.css      # Core Design System, keyframe animations, glass panels, grids
└── script.js     # SoundSynth oscillator engine, game states, and localStorage controllers

2. High-Performance Styling
Backdrop Filters: Uses modern backdrop-filter: blur(...) to create realistic glass panels.
Flex & Grid: Flexbox for layout control; CSS Grid custom variables for changing layout dimensions dynamically (e.g. grid-template-columns: repeat(var(--cols), 1fr)).
Custom Animation Keyframes: Handles matrix card flipping, shake errors, neon border pulse, and victory modal scales.

🎮 How to Run
Since CyberMatch relies entirely on client-side vanilla technologies, there are zero build steps required.

Local Execution:
Clone this repository or download the source files.
bash


git clone https://github.com/your-username/cybermatch.git
cd cybermatch
Open index.html directly in your browser:
Windows: Double-click index.html or run in terminal:
powershell


Start-Process "index.html"
macOS/Linux: Run in terminal:
bash


open index.html
