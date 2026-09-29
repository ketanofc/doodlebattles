# ✏️ Doodle BATTLES

> A doodle-style, notebook-drawn 3D survival shooter that runs entirely in
> the browser.

Doodle BATTLES is an independent browser shooter built on a hand-drawn
notebook idea: the whole world looks like it was scribbled in pen and ink
onto the page of a school exercise book, then turned into a real 3D
battleground.

The goal is simple: survive as many waves as you can, read the arena, and
beat your best score.

---

## 👤 Author

**Ketan**

- GitHub: [@ketanofc](https://github.com/ketanofc)
- Twitter / X: [@ketanofc](https://twitter.com/ketanofc)

---

## ✨ Features

- 🖊️ Original doodle / notebook visual style built entirely from code
- 📓 Ruled-paper menus, sticky-note pause screen, and wobbly ink buttons
- 🔫 Automatic Rifle with reflex red dot sight
- 💥 Shotgun with heavy close-range punch
- 🎯 Sniper with a custom-drawn scope
- ⚔️ Katana with bullet parry, reflection, and a focus-slash meter
- 🪂 Grappling Hook with swing, reel-in, and launch
- 💣 Grenades with charge-to-throw distance
- 🌀 Dash-slash unlocked by filling the katana focus gauge
- 🧗 Wall jumps, double jumps, slides, and air dashes
- 🌊 Endless wave survival with a modifier rolled every wave
- 🏆 Boss waves every 5 waves, scaling in health as you climb
- ⏩ Checkpoints every 5 waves so you can skip ahead
- 🌐 Online free-for-all for up to 10 players with lobbies
- 🏅 Live scoreboard and kill feed during matches
- 🔊 Fully procedural audio: every sound and the music are synthesised at
  runtime with the Web Audio API, no audio files
- 🕹️ Mouse and keyboard plus full PS5 controller support
- ⚙️ Sensitivity, invert-look, trackpad mode, and music toggles
- 💾 Best score and wave checkpoint saved locally
- 📱 Responsive layout from ultrawide down to mobile
- ⚡ No build step, no bundler, no framework

---

## 🎮 Game Overview

A Doodle BATTLES run works like this:

1. Pick your map on the main menu.
2. Press **START** to drop into the arena.
3. Clear the incoming wave of enemies.
4. A modifier is rolled and announced for the next wave.
5. Every fifth wave is a boss. Survive it and you keep going.
6. Between waves you get a short breather to reposition and reload.
7. Die and the run ends with your wave, kills, and score.
8. Your best score is remembered for next time.

The controls are intentionally simple for a shooter, and most of the
difficulty comes from movement, timing, and reading the arena rather than
from memorising buttons.

---

## 🕹️ Controls

### Mouse + Keyboard

| Action                    | Key                                        |
| ------------------------- | ------------------------------------------ |
| Move                      | `W` `A` `S` `D`                            |
| Look                      | Mouse                                      |
| Sprint                    | `Shift` (or double-tap `W` in trackpad mode) |
| Fire / Slash              | Left Mouse                                 |
| Aim / Katana Guard        | Right Mouse (`Shift` in trackpad mode)     |
| Jump / Wall Jump          | `Space` (again on a wall)                  |
| Double Jump               | `Space` in mid-air                         |
| Slide / Air Dash          | `C` or `Ctrl`                              |
| Grapple                   | `Q` or `E` — tap to swing, hold to reel, jump to launch |
| Quick Katana Slash        | `F`                                        |
| Dash-Slash                | Both mouse buttons, once the gauge is lit  |
| Reload                    | `R`                                        |
| Grenade                   | `G` — hold to throw further                |
| Switch Weapon             | `1` `2` `3` `4` or the mouse wheel         |
| Scoreboard                | `Tab` (online)                             |
| Pause                     | `Esc`                                      |
| Music                     | `M`                                        |

### PS5 Controller

| Action          | Button                                  |
| --------------- | --------------------------------------- |
| Move / Look     | Left Stick / Right Stick               |
| Sprint          | `L3`                                    |
| Fire / Slash    | `R2`                                    |
| Aim / Block     | `L2`                                    |
| Jump            | `✕`                                     |
| Slide / Dash    | `○`                                     |
| Grapple         | `L1` — hold to reel, `✕` to launch      |
| Dash-Slash      | `L2` + `R2`, once the gauge is lit      |
| Quick Slash     | `R1`                                    |
| Reload          | `□`                                     |
| Next Weapon     | `△`                                     |
| Grenade         | `R3` or D-pad up — hold to throw further |
| Scoreboard      | `Create` (online)                       |
| Pause           | `Options`                               |

The game swaps control prompts automatically when it detects a gamepad.

---

## 🎯 Game Modes

### Solo Survival

The main mode. A wave-based survival run against escalating enemy waves.

- One modifier is rolled for each wave and changes the fight
- Every fifth wave is a boss with health that scales as you climb
- Score climbs with kills, and combos push it further
- Every fifth wave becomes a checkpoint you can restart from
- Difficulty scales continuously: more enemies, tougher modifiers,
  faster spawns

### Wave Modifiers

Each wave announces one of the following:

- **CAFFEINATED** — they move fast, but they hit softly
- **HEAVY INK** — they hit hard, but they move slowly
- **SWARM** — many more enemies, but each one is thin
- and further modifiers as you push deeper

### Online Free-for-All

Peer-to-peer free-for-all for up to 10 players.

- Create a lobby, or use **QUICK PLAY** to drop into an open one
- First to **20** kills wins
- Roughly a 10-minute match
- Everyone is fair game — there are no teams
- Live scoreboard with kills and deaths
- Leave and rejoin with a lobby code if you disconnect

---

# 📜 Game Rules

### Scoring

- Solo score rises with every enemy you defeat
- Consecutive kills build a combo that increases the points per kill
- The combo drops if you stop scoring for a short window
- Online score is kills and deaths; the goal is the kill target, not points

### Survival

- You have a health bar that regenerates a short while after taking damage
- Falling out of the arena returns you to the map
- Death ends the run and shows your final wave, kills, and score
- Checkpoints let you resume at the start of a multiple-of-5 wave

### Best Score

Your best solo score is stored in the browser using `localStorage`, along
with the highest wave checkpoint you reached and your settings.

---

## ⚖️ Fair Play

Please do not:

- Modify game files to create artificial scores or waves
- Manipulate browser storage to unlock content
- Alter network requests to lobby peers
- Use automation or aimbots to gain an unfair advantage
- Harass or grief other players online

The scoreboard is meant to represent genuine gameplay.

No client-side game can be considered completely cheat-proof, because the
game runs on the player's own device.

---

# 🎨 Art & Visual Design

Everything in Doodle BATTLES is drawn in code, not in an image editor.

- 🖊️ The world is built from flat ink-coloured geometry so it reads like
  marker on paper
- 📓 Menus sit on ruled notebook paper with a red margin line
- 📌 The pause screen is a tilted sticky note with wave, score, and best
- 🔲 Every button is a cut-paper card with a wobbly hand-drawn border and
  a hard offset shadow that collapses when pressed
- 🔤 Type is set in **Chelsea Market** for the logo and headings, and
  **Comic Relief** for body text
- 🎨 All HUD elements use multiply blending, so ink reads correctly over
  whatever is behind them

The look is deliberately plain on purpose: everything is a line, a fill,
and a wobbly border.

---

# 🧱 Technology Stack

Doodle BATTLES is a lightweight web application with **no build step**.
There is nothing to compile, bundle, or install.

## Frontend

### HTML5

Used for the page shell, HUD containers, the screen/panel overlay, and the
file-protocol warning.

### CSS3

Used for the paper panels, doodle buttons, responsive layouts, HUD
positioning, and the scanline-free hand-drawn animations.

### JavaScript / ECMAScript

Used for the game loop, physics, collision, enemy AI, wave spawning, boss
behaviour, scoring, game states, input handling, audio, and storage.

## Rendering

- **Three.js** for the 3D scene, ink-materials, and custom sniper scope
- **WebGL** through Three.js, rendered to a single fullscreen canvas
- **HTML5 Canvas** is not used; all rendering goes through Three.js

## Browser APIs

- Web Audio API — all sound effects and music are synthesised
- `localStorage` — best score, checkpoint, name, and settings
- `requestAnimationFrame` — the game loop
- Pointer Lock — mouse look
- Pointer / Touch / Keyboard Events — input
- Gamepad API — controller support
- WebRTC via **PeerJS** for peer-to-peer multiplayer

## Multiplayer

- **PeerJS 1.5.4** hosts and joins lobbies
- Lobbies are public or private and can be shared with a code
- The host is authoritative for match start and map selection
- No dedicated game server is required

## Third-party Libraries

| Library     | Use                                  |
| ----------- | ------------------------------------ |
| Three.js   | 3D rendering                         |
| PeerJS     | Peer-to-peer multiplayer             |
| Google Fonts | Chelsea Market, Comic Relief       |

---

## 🤖 Built With AI

Doodle BATTLES was developed with AI coding assistants:

- **Claude Opus 5** (Anthropic)
- **OpenAI GPT-5.6 Luna** (OpenAI)

The AI tools were used to help write gameplay code, build the procedural
audio engine, design the menu and pause interfaces, and debug rendering
issues. The art, audio, and game design are all original to this project.

---

# 🧪 Testing Checklist

## Gameplay

- [ ] Move, sprint, slide, and air dash feel right
- [ ] Wall jump and double jump work
- [ ] Grapple swings, reels, and launches
- [ ] Every weapon fires and reloads
- [ ] Katana parries and reflects bullets
- [ ] Focus gauge fills and enables dash-slash
- [ ] Waves spawn and clear
- [ ] Boss waves appear every 5 waves
- [ ] Modifiers apply and are announced
- [ ] Health regenerates after damage
- [ ] Death ends the run and shows the summary
- [ ] Checkpoints restore at wave 5, 10, 15, ...

## Interface

- [ ] Menu renders on every screen size
- [ ] Controls and settings drawers open and close
- [ ] Pause screen shows and RESUME returns to play
- [ ] MAIN MENU returns from pause
- [ ] Map picker switches maps
- [ ] No horizontal overflow on mobile

## Mobile

- [ ] Layout fits portrait screens
- [ ] Buttons are large enough to tap
- [ ] Page does not accidentally scroll

## Desktop

- [ ] Mouse look works via pointer lock
- [ ] Keyboard input works
- [ ] Gamepad input and prompts switch correctly

## Online

- [ ] Lobby can be created and joined
- [ ] Quick Play finds open lobbies
- [ ] Scoreboard and kill feed update
- [ ] Network errors do not break solo play

---

# 🐛 Troubleshooting

## The game does not load

Browsers block ES modules on direct `file://` URLs. Use the launcher or a
local server:

```bash
python -m http.server 8000
```

On Windows, double-click `play.bat`.

## Sound does not play

Modern browsers block autoplay audio. Interact with the page first, then
start the run. Also check the music toggle in settings.

## Mouse look does not work

Click the canvas to capture the mouse. If the pointer is not captured, the
game shows a reminder to grab it.

## The game feels laggy

- Close unnecessary browser tabs
- Check for other heavy WebGL pages
- Lower your monitor refresh expectations, the game is not GPU-bound
- Update your graphics drivers and browser

## Online lobbies are not appearing

- Check your internet connection
- Try **QUICK PLAY** to open a new lobby
- Check the browser console for errors
- Some networks block WebRTC; a different network may be required

---

# 🤝 Contributing

Contributions are welcome. Good contribution ideas:

- New wave modifiers or enemy types
- New maps in the doodle style
- Performance improvements
- Accessibility improvements
- New doodle animations and interface polish
- Better mobile controls
- Bug fixes
- Documentation improvements

Please keep new features consistent with the hand-drawn notebook identity.

---

# 📋 Roadmap

- [ ] More wave modifiers and enemy types
- [ ] Daily challenge
- [ ] Global leaderboard
- [ ] Achievements
- [ ] More doodle maps
- [ ] Offline / PWA support
- [ ] Replay and score sharing
- [ ] Accessibility improvements
- [ ] Performance profiling on low-end devices
- [ ] Gamepad remapping

The roadmap may change as development continues.

---

# ⚖️ Disclaimer

Doodle BATTLES is an **independent, original browser game project**.

All game artwork, sounds, music, level design, interface design, and code
in this project are original works created for this repository. The
doodle aesthetic is inspired by the general look of hand-drawn
notebooks and children's sketches.

Doodle BATTLES is not affiliated with, endorsed by, sponsored by, or
officially connected to any other game, studio, publisher, or rights
holder.

Third-party names, trademarks, libraries, services, fonts, sounds,
images, and other external components remain the property of their
respective owners and may have separate licenses.

---

# 📩 Support

If something is not working, the game feels laggy, you find a bug, or you
have a suggestion, please get in touch.

When reporting an issue, include:

- Device
- Browser and version
- Operating system
- Map and wave
- Approximate score
- What happened
- Steps to reproduce
- A screenshot or screen recording if possible

You can reach out directly:

- GitHub: [@ketanofc](https://github.com/ketanofc)
- Twitter / X: [@ketanofc](https://twitter.com/ketanofc)

---

# 💬 Feedback

Doodle BATTLES is an ongoing project, and player feedback helps improve it.

If you enjoy the game, find a bug, have an idea for a new map, or want to
suggest an improvement, open an issue or contact the project team.

Please keep feedback constructive and respectful.

---

# ❤️ Final Note

Doodle BATTLES is built around a simple idea:

> **Drawn by hand. Fought in 3D.**

The whole game is pen lines and flat fills pretending to be a real
battleground. Keep moving, keep your guard up, and try to beat your wave.

---

## ⭐ If You Like Doodle BATTLES

If you enjoy the project, consider giving the repository a ⭐ and sharing
the game with your friends.

**How many waves can you reach?**

---

<p align="center">
Made with ❤️ by <a href="https://github.com/ketanofc">@ketanofc</a>
</p>
