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
- 📱 Touch controls for phones and tablets: floating movement stick, drag to
  look, and auto-sprint
- 📲 Installable as a PWA and runs fullscreen on iOS and Android
- 📉 Adaptive render scale keeps the frame rate up on weaker phones
- ⚙️ Sensitivity, invert-look, trackpad mode, and music toggles
- 💾 Best score and wave checkpoint saved locally
- 🖥️ Responsive layout from ultrawide down to a landscape phone
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

### Touch Screen

Phones and tablets get an on-screen control layer instead: the movement stick
on the left, every combat action on the right, and the oversized **FIRE** button
in the middle of them, with the other actions flanking it in two columns.

```
        climb                             nade
        jump         .----------.        dash
     .---.---.      |   FIRE   |       .---.---.
     | reload |     |          |       | melee  |
     '---'---'      '----------'       '---'---'
        duck          .----.          aim
     .---.---.      '----'
     | jump  |
     '---'---'
        climb
```

Every control is a drawn icon, not a word. A 45px circle cannot hold "reload" at
a size you can read mid-firefight, so the labels went and the buttons grew.

| Action                | Control                                                |
| --------------------- | ------------------------------------------------------ |
| Move                  | Left half of the screen — a stick appears where you touch |
| Sprint                | Push the stick most of the way out                     |
| Look / Aim            | Drag anywhere on the right half                        |
| Fire / Slash          | **◎** crosshair, dead centre — hold                    |
| Aim / Katana Guard    | **⌐¬** scope brackets, centre bottom — hold            |
| Reload                | **↻** circular arrow, centre top                       |
| Grapple               | **ladder**, outer column top — hold to reel, tap to swing |
| Jump / Wall Jump      | **↑** arrow up, outer column middle                    |
| Slide / Air Dash      | **↓** arrow down onto the floor, outer column bottom   |
| Quick Katana Slash    | **blade**, near column bottom                          |
| Dash-Slash            | **»** speed lines, near column middle — once the focus gauge is lit |
| Grenade               | **bomb**, near column top — hold to throw further      |
| Switch Weapon         | **⇄** crossed arrows, top left; the name you will switch to is spelled out under it |
| Scoreboard            | **☰** lines, top left — hold (online)                   |
| Music                 | **♪** note, top left                                    |
| Button size           | **⛭** sliders, top left                                 |
| Pause                 | **❙❙** bars, top left                                   |

Switch-weapon is in the top-left system row rather than in the cluster. A 3×3
grid minus its centre has exactly eight free slots, which is precisely the eight
secondary actions that are left once FIRE and switch are accounted for, so
switch had to go somewhere. It is a low-frequency action — once a fight, not
during one — and the system row is the one part of the layer no thumb covers, so
it costs nothing there.

The system buttons sit on the opposite side from the combat cluster, so your
thumb never has to cross the screen mid-fight. They also ignore the size slider,
because the slider is for the combat buttons and the fit calculation exists to
keep the cluster clear of the movement stick, which this corner is nowhere near.

The buttons are translucent circles drawn in the same ink-and-paper style as the
rest of the game, so they read as part of the drawing rather than as a platform
overlay sitting on top of it. The icons are stroked paths rather than a font, so
they cannot fail to load and they recolour with the pressed state on their own.
Every one is at least 32px across, and the adjacent pairs keep a gap of at least
2.6 layout units, so no button ever overlaps another or leaves the screen.

**FIRE in the middle has a cost, and it is worth knowing about.** The thumb
pivots near the bottom-right corner, and centring FIRE moves it from 1.6 layout
units off that edge to 20.2. It is now the fourth nearest of the nine combat
buttons by centre distance, behind melee, aim and dash. If it turns out to be a
stretch while you are moving, the fix is to drop it into the bottom-centre cell
and give the centre column three buttons above it, which has to be paid for out
of the flanking columns.

**Button size is yours to set.** The slider button in the top-left opens a
control you can drag from 75% to 135%. Two rules apply to it:

- Your choice is remembered, so it is still there next session.
- It is a preference, not a promise. The buttons are sized to fit whatever room
  the screen has next to the movement zone, and if your number is bigger than
  the screen allows, the buttons come out smaller than you asked and the readout
  tells you the real percentage. On a phone held upright, 135% will be refused
  and you will see roughly 76% next to the slider. A combat button sitting on
  top of the movement stick is a worse outcome than a smaller button.

The 14 buttons are sized against the live viewport, so the same layout works in
portrait, landscape, and while iOS browser bars collapse. There is no per-device
breakpoint to fall out of date.

Movement, look and any button all work at the same time, so you can run, turn
and shoot without lifting a thumb.

The layer is gated on a real coarse pointer, so a desktop browser never sees
it. A hybrid machine — a laptop or tablet with both a touchscreen and a mouse —
keeps its keyboard layout until you actually touch the screen, at which point
the controls appear. Add `?touch=1` to force them on, or `?touch=0` to force
them off.

On Android the game asks for fullscreen on your first tap. iOS does not allow
fullscreen for anything but video, so on iPhone and iPad the way to get it is
**Share → Add to Home Screen**, which the game nudges you toward once.

Notes:

- The stick is a floating joystick: it appears wherever your thumb lands in the
  left half, and its origin follows if you drag past the rim.
- Three fingers work at once, so you can move, turn and shoot at the same time
  without lifting a thumb.
- Landscape is the preferred orientation. Any touch device held upright gets a
  "Rotate your device to landscape mode" prompt, phones and tablets alike, since
  portrait splits the screen between the stick and the combat cluster and every
  layout rule assumes the long axis is horizontal.
- On Android the game asks for fullscreen on your first tap, which removes the
  browser bars and gives the canvas the whole screen.
- On iOS, use **Share → Add to Home Screen** to get a fullscreen, installable
  version. iOS does not permit fullscreen for anything but video, so this is
  the only route there. The game shows a one-time hint for it.
- A hybrid machine with both a touchscreen and a mouse keeps the keyboard
  layout until you actually touch the screen, so a touchscreen laptop is not
  forced into the thumb controls. Append `?touch=1` to force them on, or
  `?touch=0` to force them off.

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
- 🔤 Type is set in **Fredericka the Great** for the logo and headings, and
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
- Pointer Lock — mouse look (desktop only; touch uses pointer events)
- Pointer / Touch / Keyboard Events — input
- `visualViewport` — control sizing follows the height the browser actually
  shows, so a collapsing address bar does not push buttons off screen
- Web App Manifest and Apple touch icons — installable PWA
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
| Google Fonts | Fredericka the Great, Comic Relief |

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

- [x] Control layer appears on touch devices and stays off on desktop
- [x] Late arms on first real touch, so a tablet with a paired mouse still gets
      controls while a hybrid laptop keeps its keyboard
- [x] Combat cluster on the right with an oversized centred FIRE, system buttons opposite
- [x] All 14 controls are drawn icons, no text labels, every one with an accessible name
- [x] Button size adjustable 75-135%, remembered across sessions, clamped to what the screen can fit
- [x] Layout fits landscape phone and tablet screens, portrait included
- [x] All tap targets are at least 32px and none overlap
- [x] Combat cluster never reaches into the movement zone at any size setting
- [x] Page does not scroll or rubber-band while playing
- [x] Floating stick feeds movement, drag feeds look, auto-sprint works
- [x] Every action has a button, and input cannot leak into the pause panel
- [x] Dragging the size slider does not turn the camera
- [x] Haptic tick on button press where the device supports it
- [x] Move, look and a button all live at the same time (three fingers)
- [x] Rotate prompt on any touch device held upright
- [x] Fullscreen on first tap, with the iOS add-to-home-screen route as fallback
- [x] Renderer, render targets and camera aspect refit on fullscreen change
- [x] Safe-area insets respected for notches and home indicators
- [x] Device pixel ratio capped, and lowered further if the frame rate drops
- [x] Installable PWA with fullscreen display and safe-area insets

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

## The touch controls did not appear

The on-screen controls only load for a device whose primary pointer is coarse,
so a touchscreen laptop with a mouse keeps the keyboard layout on purpose. Add
`?touch=1` to the URL to force them on.

## The controls are the wrong size or half off screen

The control layer is sized from `visualViewport`, so it should follow the
browser chrome. If it looks stale, pull the page down once to force a
re-measure, or close any in-app browser panel that was left open.

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
- [x] Offline / PWA support
- [ ] Replay and score sharing
- [ ] Accessibility improvements
- [x] Touch controls and adaptive performance on low-end devices
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

# 📜 License

Doodle BATTLES' original source code is released under the **MIT License**.

See [`LICENSE`](LICENSE) for the complete license text.

Third-party libraries, fonts, sounds, images, APIs, and other external
components may have separate license and attribution requirements:

| Component            | License      |
| -------------------- | ------------ |
| Three.js             | MIT          |
| PeerJS               | MIT          |
| Fredericka the Great  | OFL 1.1      |
| Comic Relief font    | OFL 1.1      |

**Fredericka the Great** is designed by **Tart Workshop** and is used for the
logo and headings. It ships as a single weight, so the headings are set at that
one weight rather than being synthetically emboldened. Both fonts are served
from Google Fonts under the SIL Open Font License 1.1.

All original game code, art, sounds, music, and level design in this
repository are covered by the MIT License above unless a specific file
states otherwise.

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
