/* touch.js - touch controls for Doodle BATTLES.
 *
 * Written as its own file rather than patched into the minified game.js so the
 * controls stay readable and the desktop build keeps a zero-byte control layer.
 *
 * It talks to the game through seams that already exist in the input object
 * (window.__ds.input, the `nt` instance):
 *
 *   nt.tmx / nt.tmy  analog stick, summed into move by di.update()
 *   nt.mouseBtns     held actions, merged into the per-frame state
 *   nt.keys          held actions, merged into the per-frame state
 *   nt.mx / nt.my    the same delta the mouse path writes, so look sensitivity,
 *                    invert-Y and the ADS multiplier all keep working
 *
 * Every button therefore behaves exactly like its keyboard or gamepad twin and
 * the game never needs to know touch exists. The one thing that cannot be
 * shared is pointer lock, which mobile browsers do not have; game.js checks
 * nt.touchMode at every place it would otherwise grab or demand the pointer.
 *
 * The control layer markup is built here instead of living in index.html so the
 * class names, the button-to-action table and the CSS can never drift apart.
 */
(() => {
  'use strict';

  const doc = document;
  const root = doc.documentElement;

  const mq = q => !!(window.matchMedia && window.matchMedia(q).matches);
  const hasTouch = 'ontouchstart' in window || (navigator.maxTouchPoints || 0) > 0;

  /* ?touch=1 forces the layer on and ?touch=0 keeps it off, which is what the
     automated touch tests use instead of emulating a real handset. */
  const forced = /[?&]touch=1(?:&|$)/.test(location.search);
  const vetoed = /[?&]touch=0(?:&|$)/.test(location.search);

  /* go touch-first as soon as the primary pointer is coarse, or when the
     device has touch but never claims a fine primary pointer (older Android
     WebViews report neither). */
  const obvious = hasTouch && (mq('(pointer: coarse)') || !mq('(pointer: fine)'));

  const isTouch = !vetoed && (forced || obvious);

  let booted = false;

  /* ------------------------------------------------------------------ markup */

  /* Every action is a drawn glyph, not a word.

     Words were the reason the old cluster was cramped. "RELOAD" will not sit on
     one line inside a 40px circle at a size you can read mid-firefight, so it
     either wrapped to two lines or forced the label below legibility, and the
     columns then needed 4.8u of daylight between them to keep the text from
     touching. A glyph is square and has no minimum, so the columns can close up
     and every button in the cluster gets bigger instead.

     All of them are 24x24 stroked paths inheriting currentColor, so a button
     recolours for free when the pressed state or the theme changes it, and none
     of them is a font that might not be there on a locked-down device. */
  const ICONS = {
    /* Crosshair with a filled centre: the universally read "shoot here". */
    fire: '<circle cx="12" cy="12" r="6.4"/><circle cx="12" cy="12" r="2"/><path d="M12 2.2v3.4M12 18.4v3.4M2.2 12h3.4M18.4 12h3.4"/>',
    /* Open brackets plus a fine cross: a scope, not a target. Distinguishable
       from fire at a glance, which is the whole point of separating them. */
    aim: '<path d="M8.6 4.5h-4v4M15.4 4.5h4v4M8.6 19.5h-4v-4M15.4 19.5h4v-4"/><path d="M12 8.4v7.2M8.4 12h7.2"/>',
    /* Two opposed arcs with square leaders: reload. */
    reload: '<path d="M4.2 12.4a7.8 7.8 0 0 1 13.2-5.8l2.3 2.3"/><path d="M20.2 4.2v4.7h-4.7"/><path d="M19.8 11.6a7.8 7.8 0 0 1-13.2 5.8L4.3 15.1"/><path d="M3.8 19.8v-4.7h4.7"/>',
    /* A ladder, for the climb. */
    grapple: '<path d="M3.6 20.6h16.8"/><path d="M8 20.6V8.6M16 20.6V8.6"/><path d="M8 12.6h8M8 16.6h8"/>',
    /* Two arrows crossing: switch, not reload. */
    slot: '<path d="M3.4 8.4h13.4l-3.4-3.4"/><path d="M20.6 15.6H7.2l3.4 3.4"/>',
    jump: '<path d="M12 19.6V5.4"/><path d="M7 10.4 12 5.4l5 5"/>',
    /* Arrow down onto a floor line: crouch. The mirror of jump, so the two read
       as the same axis and stay apart by direction alone. */
    duck: '<path d="M12 4.4v14.2"/><path d="M7 13.6 12 18.6l5-5"/><path d="M3.4 20.6h17.2"/>',
    melee: '<path d="M20.6 3.4 11 13l-1.5 4.5-4.5 1.5L6.5 14.5 16.1 4.9l4.5-1.5Z"/><path d="M3.2 20.8l3.4-3.4"/>',
    dash: '<path d="M3.4 7.4h5.6M3.4 12h8.2M3.4 16.6h5.6"/><path d="M13.4 5.6 20 12l-6.6 6.4"/>',
    nade: '<circle cx="12" cy="14.6" r="5.6"/><path d="M9.3 8.8 12 6.2l2.7 2.6"/><path d="M12 6.2V3.4"/><path d="M12 3.4h4.2"/>',
    pausa: '<path d="M9.2 4.8v14.4M14.8 4.8v14.4"/>',
    score: '<rect x="3.8" y="4.2" width="16.4" height="15.6" rx="2.4"/><path d="M8 9h8M8 12.6h8M8 16.2h4.6"/>',
    music: '<path d="M9.4 18.2V5.2l9.4-2.1v12.9"/><circle cx="6.6" cy="18.2" r="2.6"/><circle cx="16" cy="15.9" r="2.6"/>',
    /* Two sliders: the control-settings affordance. */
    size: '<path d="M3.6 8h9.6M17.6 8h2.8M3.6 16h3.4M11.4 16h9"/><circle cx="15.4" cy="8" r="2.4"/><circle cx="9.2" cy="16" r="2.4"/>'
  };

  const ic = name =>
    '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + ICONS[name] + '</svg>';

  const LAYER_HTML = [
    '<div class="tz-izq" aria-hidden="true"></div>',
    '<div class="tz-der" aria-hidden="true"></div>',
    '<div class="tpalanca" aria-hidden="true"></div>',

    /* Current weapon. It used to be a label inside the switch button, which
       cannot hold a word and a glyph at a readable size at the same time, so it
       gets its own line in the left column where there is room to spell it. */
    '<div class="twpn" aria-live="polite"></div>',

    /* System row, top-LEFT. The whole right side belongs to combat controls so
       the thumb never has to cross the screen mid-fight. */
    '<button type="button" class="tb tb-tl tb-pausa" aria-label="Pause">' + ic('pausa') + '</button>',
    '<button type="button" class="tb tb-tl tb-score" aria-label="Scoreboard">' + ic('score') + '</button>',
    '<button type="button" class="tb tb-tl tb-music" aria-label="Toggle music">' + ic('music') + '</button>',
    '<button type="button" class="tb tb-tl tb-size" aria-label="Button size" aria-expanded="false">' + ic('size') + '</button>',

    /* Size control. Lives in the layer rather than in the pause menu because
       the thing it changes has to be visible while it is being changed. */
    '<div class="tset" role="group" aria-label="Touch control size">' +
      '<label class="tset-l" for="tsize">Button size</label>' +
      '<input class="tset-r" id="tsize" type="range" min="75" max="135" step="5" value="100" aria-label="Touch button size">' +
      '<output class="tset-v" id="tsizev" for="tsize">100%</output>' +
    '</div>',

    /* Combat cluster, all on the right. FIRE is the oversized anchor in the
       bottom-right corner; the column beside it holds the other primary
       actions (scope, reload, climb) nearest the thumb. */
    '<button type="button" class="tb tb-fire" aria-label="Fire">' + ic('fire') + '</button>',
    '<button type="button" class="tb tb-aim" aria-label="Aim down sights (scope)">' + ic('aim') + '</button>',
    '<button type="button" class="tb tb-reload" aria-label="Reload">' + ic('reload') + '</button>',
    '<button type="button" class="tb tb-grapple" aria-label="Climb / grapple (Q)">' + ic('grapple') + '</button>',
    '<button type="button" class="tb tb-slot" aria-label="Switch weapon">' + ic('slot') + '</button>',
    '<button type="button" class="tb tb-jump" aria-label="Jump">' + ic('jump') + '</button>',
    '<button type="button" class="tb tb-duck" aria-label="Crouch">' + ic('duck') + '</button>',
    '<button type="button" class="tb tb-melee" aria-label="Melee">' + ic('melee') + '</button>',
    '<button type="button" class="tb tb-dash" aria-label="Dash">' + ic('dash') + '</button>',
    '<button type="button" class="tb tb-nade" aria-label="Grenade">' + ic('nade') + '</button>'
  ].join('');

  /* Which bag each button writes to, and whether it holds or pulses. "hold" is
     for anything the game reads with down(), "pulse" is for pressed(), which is
     edge detected and therefore needs the flag to outlive the frame. */
  const BTN_ACTIONS = {
    fire: { obj: 'mouseBtns', hold: true },
    aim: { obj: 'mouseBtns', hold: true },
    grapple: { obj: 'mouseBtns', hold: true },
    melee: { obj: 'keys' },
    jump: { obj: 'keys' },
    duck: { obj: 'keys', key: 'crouch', hold: true },
    reload: { obj: 'keys' },
    dash: { obj: 'keys' },
    nade: { obj: 'keys', key: 'grenade', hold: true },
    slot: { obj: 'keys', key: 'nextWeapon' },
    score: { obj: 'keys', hold: true },
    music: { obj: 'keys' },
    pausa: { obj: 'keys', key: 'pause' }
  };

  /* Stick geometry. These two numbers are duplicated in touch.css (.tpalanca and
     .tpalanca::after) and must stay in step with it. */
  const STICK_D = 24;       /* ring diameter, in --u */
  const STICK_TRAVEL = 0.4; /* fraction of that diameter a full push covers */

  /* Cluster footprint at --k:1, in --u, and the share of the width it is
     allowed to take. These must match the --x/--d table in touch.css; the fit
     calculation divides the room left over by them, so a button can only get
     bigger while the whole cluster still clears the movement zone.

     ZONE_W is 0.52 rather than the 0.54 the look zone actually occupies, on
     purpose: that leaves a visible strip of dead space between the two halves
     so a thumb sliding across the screen never grabs a button by accident. */
  const CLUSTER_W = 62.4;
  const CLUSTER_H = 42.4;
  const ZONE_W = 0.52;

  /* Player-chosen button size, as a percentage of the fitted base. It is a
     preference, not a promise: applyScale() clamps it to what fits. */
  const SIZE_MIN = 75;
  const SIZE_MAX = 135;
  const SIZE_DEF = 100;
  const SIZE_KEY = 'doodle_tsize';

  const U_MIN = 2.8;
  const U_MAX = 4.4;
  const DEAD = 0.14;       /* below this the stick reads as centred */
  const SPRINT_AT = 0.82;  /* push nearly all the way out to sprint */
  const PULSE_MS = 200;    /* how long a tapped flag stays set */

  /* Haptics. Android honours the Vibration API; iOS Safari ignores it, which is
   * why this is a pure enhancement and never load-bearing. Guarded because
   * navigator.vibrate is absent on iOS and throws in some embedded webviews. */
  const canBuzz = typeof navigator.vibrate === 'function';
  const buzz = (ms) => { if (canBuzz) { try { navigator.vibrate(ms); } catch (err) { /* no haptics */ } } };

  function boot() {
    /* Idempotent: a late-armed device can reach here from both the pointerdown
       and the touchstart listener, and only one build may happen. */
    if (booted) return;
    booted = true;

    /* Set before any DOM work: every rule in touch.css is gated on this class,
       so it has to be in place the instant the layer is attached. */
    root.classList.add('tactil');
    /* ------------------------------------------------------------ the layer */

    const layer = doc.createElement('div');
    layer.id = 'touch';
    layer.className = 'oculto';
    layer.innerHTML = LAYER_HTML;
    doc.body.appendChild(layer);

    const girar = doc.createElement('div');
    girar.id = 'girar';
    girar.className = 'oculto';
    girar.innerHTML =
      '<div><div class="g-icon"></div><h2>Rotate your device</h2>' +
      '<p>Rotate your device to landscape mode.</p></div>';
    doc.body.appendChild(girar);

    const hint = doc.createElement('div');
    hint.id = 'ioshint';
    hint.innerHTML =
      '<span>Tap <b>Share</b>, then <b>Add to Home Screen</b> to play fullscreen.</span>' +
      '<span class="ih-x">&#10005;</span>';
    doc.body.appendChild(hint);

    const zoneL = layer.querySelector('.tz-izq');
    const zoneR = layer.querySelector('.tz-der');
    const stickEl = layer.querySelector('.tpalanca');

    /* Size control nodes. Held as locals rather than re-queried per frame. */
    const sizeBtn = layer.querySelector('.tb-size');
    const cfgEl = layer.querySelector('.tset');
    const cfgRange = layer.querySelector('#tsize');
    const cfgOut = layer.querySelector('#tsizev');
    const weaponNameEl = layer.querySelector('.twpn');

    /* ------------------------------------------------------------ unit size

     * Every control and every mobile HUD rule is sized in --u, derived from the
     * height the browser is actually showing. vh is wrong on iOS: 1vh is the
     * height with the address bar hidden, so with the bar visible the top row
     * of buttons lands underneath the browser chrome. visualViewport.height is
     * the real visible height, and it is deliberately not combined with
     * innerHeight, which on iOS is the taller bar-hidden value. */
    let lastU = 0;

    function applyUnit() {
      const vv = window.visualViewport;
      const h = Math.max(1, vv ? vv.height : window.innerHeight);
      const u = Math.max(U_MIN, Math.min(U_MAX, h / 100));
      if (Math.abs(u - lastU) < 0.02) return;
      lastU = u;
      root.style.setProperty('--u', u.toFixed(3) + 'px');
    }

    /* ------------------------------------------------------------ orientation

     * A 3D shooter needs the long axis, so landscape is the preferred
     * orientation and any touch device held upright gets the prompt. This used
     * to exempt tablets, on the grounds that one held upright is big enough to
     * play; portrait on a tablet is still a 46/54 split between the stick and
     * the combat cluster once browser chrome is subtracted, and every layout
     * rule in touch.css assumes the long axis is horizontal. */
    function orientCheck() {
      const vv = window.visualViewport;
      const w = vv ? vv.width : window.innerWidth;
      const h = vv ? vv.height : window.innerHeight;
      girar.classList.toggle('oculto', !(h > w));
    }

    /* ------------------------------------------------------------ button size

     * The player picks a size, the screen decides how much of it they get.

     * --k is the fitted scale, and it is the smaller of two things: whatever
     * the player asked for, and the largest scale at which the whole cluster
     * still fits in the space next to the movement zone. That order matters.
     * Asking for 135% on a phone that only has room for 80% must shrink the
     * buttons, not push the leftmost column out under the thumb, because
     * buttons overlapping the stick are worse than buttons that are not quite
     * the size the player picked.

     * The fit is a division rather than a hand-written media query, so it
     * follows the browser chrome on iOS, where the usable height changes as the
     * address bar collapses, and it needs no new breakpoint for a new device.
     * --k is only ever written to the layer, not to <html>, because the HUD
     * rules that also read --u must keep the fitted size rather than inheriting
     * a button-scale factor. */
    let userSize = SIZE_DEF;
    try {
      const stored = parseInt(localStorage.getItem(SIZE_KEY), 10);
      if (stored >= SIZE_MIN && stored <= SIZE_MAX) userSize = stored;
    } catch (err) { /* private mode: fall back to the default */ }

    function applyScale() {
      const vv = window.visualViewport;
      const w = Math.max(1, vv ? vv.width : window.innerWidth);
      const u = lastU || U_MAX;
      /* Room to the left of the movement zone, in --u. The 6px is the same dead
         strip ZONE_W already leaves, subtracted again so the fit and the
         visible gap cannot disagree at the boundary. */
      const roomU = (w * ZONE_W - 6) / u;
      const fit = Math.min(roomU / CLUSTER_W, 1);
      const want = userSize / 100;
      /* Never above 1 either: the fitted scale already uses the whole zone on
         a tablet, and letting it go past would only push the cluster toward the
         screen edge for no readability gain. */
      const k = Math.max(0.55, Math.min(want, fit));
      layer.style.setProperty('--k', k.toFixed(3));
      /* Tell the player what they actually got, so a clamped value reads as
         the screen's doing and not as a broken slider. */
      const shown = Math.round(k * 100);
      if (cfgOut) cfgOut.textContent = shown + '%';
      if (cfgRange && parseInt(cfgRange.value, 10) !== userSize) {
        cfgRange.value = String(userSize);
      }
      sizeBtn && sizeBtn.setAttribute(
        'aria-label', 'Button size, currently ' + shown + '%');
    }

    function relayout() { applyUnit(); applyScale(); orientCheck(); }

    /* ------------------------------------------------------------ HUD nodes

     * The game fills #hud from a template when it boots, and game.js is a
     * deferred module, so the nodes below may not exist yet. Resolve them late
     * and re-resolve whenever #hud changes shape. */
    let hudEl = doc.getElementById('hud');
    let screenEl = null;
    let weaponEl = null;

    function resolveHudNodes() {
      if (!hudEl) hudEl = doc.getElementById('hud');
      if (!hudEl) return;
      if (!screenEl) screenEl = hudEl.querySelector('#screen');
      if (!weaponEl) weaponEl = hudEl.querySelector('#weapon');
    }

    /* The control layer must never sit on top of the menu or the pause panel.
     * Watch the two class attributes the game already toggles instead of
     * polling: #hud.nogame means not in a run, #screen.show means a panel is
     * open. One observer on #hud with subtree covers both. */
    /* Must start true: the layer is created with class "oculto" (line ~101), so
     * "not hidden" is not the starting truth. Starting at false made the first
     * syncVisible() with want===false return early and leave the class in place,
     * which strands the controls off-screen for the whole session whenever the
     * game reaches a running state without passing a .show/.nogame state. */
    let hidden = true;

    function syncVisible() {
      const nongame = hudEl && hudEl.classList.contains('nogame');
      const menu = screenEl && screenEl.classList.contains('show');
      const want = !!(nongame || menu);
      if (want === hidden) return;
      hidden = want;
      layer.classList.toggle('oculto', want);
      if (want) {
        releaseAll();
        closeCfgOnHide();
      } else {
        hint.classList.remove('mostrar');
      }
    }

    /* Observe #hud itself when it is already there, otherwise fall back to
     * <body> and let the first callback pick #hud up once the game injects it. */
    if (window.MutationObserver) {
      new MutationObserver(() => {
        resolveHudNodes();
        syncVisible();
        syncWeapon();
      }).observe(hudEl || doc.body, {
        attributes: true, attributeFilter: ['class'],
        childList: true, subtree: true
      });
    }
    resolveHudNodes();
    syncVisible();

    /* -------------------------------------------------------------- game seam

     * window.__ds is exported by game.js for exactly this. Poll until it shows
     * up: a module script may not have executed yet when this file runs, and
     * the controls must simply be inert until then rather than throw. */
    let nt = null;
    let renderer = null;
    const quality = { cap: 1, acc: 0, n: 0, low: 0, high: 0 };

    function bind() {
      if (nt) return true;
      const ds = window.__ds;
      if (!ds || !ds.input || !ds.hud) return false;
      nt = ds.input;
      nt.touchMode = true;
      ds.hud.setTouch(true);
      renderer = ds.renderer || null;
      if (renderer && typeof renderer.pixelRatio === 'number') {
        quality.cap = renderer.pixelRatio;
      }
      return true;
    }

    bind();
    let tries = 0;
    const bindTimer = setInterval(() => {
      if (bind() || ++tries > 200) clearInterval(bindTimer);
    }, 50);

    /* --------------------------------------------------------- write helpers */

    const bag = obj => (nt ? nt[obj] : null);

    /* A tap that must survive at least one frame.

     * pressed() is edge detected against the previous frame, so a flag set and
     * cleared inside one frame is invisible to the game. Holding it for a few
     * frames is safe, it can only read as "new" on the first one, and 200ms
     * outlives a dropped frame on a struggling phone. Deadlines live in a map
     * rather than timeouts so a second tap inside the window refreshes the flag
     * instead of being swallowed. */
    const pulses = new Map(); /* "obj.key" -> deadline */

    function pulse(obj, key) {
      const b = bag(obj);
      if (b) b[key] = true;
      pulses.set(obj + '.' + key, performance.now() + PULSE_MS);
    }

    function expirePulses() {
      if (!nt || !pulses.size) return;
      const now = performance.now();
      pulses.forEach((deadline, id) => {
        if (now < deadline) return;
        pulses.delete(id);
        const dot = id.indexOf('.');
        const b = nt[id.slice(0, dot)];
        if (b) b[id.slice(dot + 1)] = false;
      });
    }

    /* -------------------------------------------------------- analog movement */

    const stick = { active: false, id: -1, ox: 0, oy: 0, x: 0, y: 0, radius: 60 };

    function stickMove(x, y) {
      const max = stick.radius;
      let dx = x - stick.ox;
      let dy = y - stick.oy;
      const len = Math.hypot(dx, dy);
      if (len > max && len > 0) {
        /* Drag the origin along, so a thumb that runs past the rim keeps
         * steering instead of pinning the stick at full tilt. */
        stick.ox = x - (dx / len) * max;
        stick.oy = y - (dy / len) * max;
        dx = (dx / len) * max;
        dy = (dy / len) * max;
      }
      if (stickEl) stickEl.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';

      const mag = Math.hypot(dx, dy) / max;
      if (mag < DEAD) { stick.x = 0; stick.y = 0; return; }
      const scaled = (mag - DEAD) / (1 - DEAD);
      const len2 = Math.hypot(dx, dy) || 1;
      stick.x = (dx / len2) * scaled;
      stick.y = -(dy / len2) * scaled; /* screen down is world back */
    }

    function stickEnd() {
      stick.active = false;
      stick.id = -1;
      stick.x = 0;
      stick.y = 0;
      if (stickEl) {
        stickEl.classList.remove('on');
        stickEl.style.transform = '';
      }
      if (nt) { nt.tmx = 0; nt.tmy = 0; }
    }

    /* The stick is also the sprint control: pushing it most of the way out
     * engages sprint. That removes the need for a sprint button and matches
     * what people reach for on a phone. */
    function feedMove() {
      if (!nt) return;
      nt.tmx = stick.x;
      nt.tmy = stick.y;
      const k = bag('keys');
      if (k) k.sprint = Math.hypot(stick.x, stick.y) > SPRINT_AT;
    }

    /* -------------------------------------------------------------- look drag */

    const look = { active: false, id: -1, lx: 0, ly: 0, t: 0 };

    function lookMove(x, y) {
      if (!nt) return;
      const now = performance.now();
      /* A gap longer than a frame means the finger was lifted rather than
       * flicked, so the jump is a new gesture and not camera movement. */
      if (now - look.t > 120) { look.lx = x; look.ly = y; look.t = now; return; }
      let dx = x - look.lx;
      let dy = y - look.ly;
      look.lx = x;
      look.ly = y;
      look.t = now;
      /* Same spike guard the mouse path uses, for a stray touchmove burst. */
      if (Math.abs(dx) > 400) dx = 0;
      if (Math.abs(dy) > 400) dy = 0;
      nt.mx += dx;
      nt.my += dy;
      nt.lastActive = now;
      nt.anyInput = true;
    }

    function touchActive() {
      if (!nt) return;
      nt.lastActive = performance.now();
      nt.anyInput = true;
    }

    /* ------------------------------------------------------------------ wiring */

    /* Left zone: a floating joystick that appears wherever the thumb lands. */
    if (zoneL) {
      zoneL.addEventListener('pointerdown', e => {
        if (stick.active || hidden) return;
        touchActive();
        const r = layer.getBoundingClientRect();
        stick.active = true;
        stick.id = e.pointerId;
        stick.ox = e.clientX - r.left;
        stick.oy = e.clientY - r.top;
        stick.radius = STICK_TRAVEL * STICK_D * (lastU || U_MAX);
        if (stickEl) {
          stickEl.classList.add('on');
          stickEl.style.left = stick.ox + 'px';
          stickEl.style.top = stick.oy + 'px';
          stickEl.style.transform = '';
        }
        try { zoneL.setPointerCapture(e.pointerId); } catch (err) { /* not fatal */ }
        stickMove(e.clientX - r.left, e.clientY - r.top);
        e.preventDefault();
      });

      zoneL.addEventListener('pointermove', e => {
        if (!stick.active || e.pointerId !== stick.id) return;
        const r = layer.getBoundingClientRect();
        stickMove(e.clientX - r.left, e.clientY - r.top);
        e.preventDefault();
      });

      const upL = e => { if (e.pointerId === stick.id) stickEnd(); };
      zoneL.addEventListener('pointerup', upL);
      zoneL.addEventListener('pointercancel', upL);
      zoneL.addEventListener('lostpointercapture', upL);
    }

    /* Right zone: drag anywhere that is not a button to look around. */
    if (zoneR) {
      zoneR.addEventListener('pointerdown', e => {
        if (look.active || hidden) return;
        touchActive();
        look.active = true;
        look.id = e.pointerId;
        look.lx = e.clientX;
        look.ly = e.clientY;
        look.t = performance.now();
        try { zoneR.setPointerCapture(e.pointerId); } catch (err) { /* not fatal */ }
        e.preventDefault();
      });

      zoneR.addEventListener('pointermove', e => {
        if (!look.active || e.pointerId !== look.id) return;
        lookMove(e.clientX, e.clientY);
        e.preventDefault();
      });

      const upR = e => {
        if (e.pointerId !== look.id) return;
        look.active = false;
        look.id = -1;
      };
      zoneR.addEventListener('pointerup', upR);
      zoneR.addEventListener('pointercancel', upR);
      zoneR.addEventListener('lostpointercapture', upR);
    }

    /* Action buttons. */
    const held = new Map(); /* pointerId -> {obj, key} */

    layer.querySelectorAll('.tb').forEach(btn => {
      const cls = Array.prototype.find.call(btn.classList, c => BTN_ACTIONS[c.replace(/^tb-/, '')]);
      if (!cls) return;
      const name = cls.replace(/^tb-/, '');
      const cfg = BTN_ACTIONS[name];
      const key = cfg.key || name;

      const press = e => {
        /* The layer is display:none behind a menu, so a real finger can never
         * reach this. The guard makes "no input leaks into the pause panel" a
         * property of the code rather than of the paint order. */
        if (!nt || hidden) return;
        touchActive();
        btn.classList.add('on');
        if (cfg.hold) {
          const b = bag(cfg.obj);
          if (b) b[key] = true;
          held.set(e.pointerId, { obj: cfg.obj, key: key });
        } else {
          pulse(cfg.obj, key);
        }
        /* A short tick confirms the tap landed without waiting to see the
         * on-screen result, which matters for the held actions where the
         * effect is not always obvious. Fire gets a longer buzz because it is
         * the one you press hardest and most often. */
        buzz(name === 'fire' ? 12 : 8);
        /* Keep a fast tap from turning into a scroll, a zoom or a long-press
         * selection menu. */
        e.preventDefault();
        e.stopPropagation();
      };

      const release = e => {
        const h = held.get(e.pointerId);
        if (h) {
          const b = bag(h.obj);
          if (b) b[h.key] = false;
          held.delete(e.pointerId);
        }
        btn.classList.remove('on');
      };

      btn.addEventListener('pointerdown', press);
      btn.addEventListener('pointerup', release);
      btn.addEventListener('pointercancel', release);
      btn.addEventListener('pointerleave', release);
      btn.addEventListener('contextmenu', e => e.preventDefault());
    });

    /* Release every held input: when the menu opens, when the app is
     * backgrounded, and whenever the system cancels a pointer, so a finger that
     * slides off a button can never leave the player walking. */
    function releaseAll() {
      held.forEach(h => {
        const b = bag(h.obj);
        if (b) b[h.key] = false;
      });
      held.clear();
      pulses.forEach((deadline, id) => {
        const dot = id.indexOf('.');
        const b = bag(id.slice(0, dot));
        if (b) b[id.slice(dot + 1)] = false;
      });
      pulses.clear();
      stickEnd();
      look.active = false;
      look.id = -1;
      layer.querySelectorAll('.tb.on').forEach(b => b.classList.remove('on'));
    }

    doc.addEventListener('visibilitychange', () => {
      if (!doc.hidden) return;
      releaseAll();
      closeCfgOnHide();
      /* Backgrounding mid-fight should not cost a run, so pulse pause and let
       * the frame loop take the same path the Esc key takes. */
      pulse('keys', 'pause');
    });
    window.addEventListener('blur', releaseAll);

    /* iOS does not always fire blur when you swipe away, but it does fire
     * touchstart, which is enough to mark the player as present. */
    doc.addEventListener('touchstart', touchActive, { passive: true });

    /* ------------------------------------------------------------ weapon label

     * The desktop slot list is hidden on touch, so the switch button has to say
     * what it switches to. The game writes the name into #weapon on every
     * weapon change, so read it once a frame and only touch the DOM on a real
     * change. */
    let lastWeapon = '';

    function syncWeapon() {
      if (!weaponEl) return;
      const t = (weaponEl.textContent || '').trim();
      if (!t || t === lastWeapon) return;
      lastWeapon = t;
      if (weaponNameEl) weaponNameEl.textContent = t.toLowerCase();
    }

    /* -------------------------------------------------------- size control

     * The panel sits in the layer, above the buttons, and only exists while it
     * is open. A range input is used rather than a row of presets because the
     * whole point is that the player can stop at whatever size suits their
     * hands, and a slider also tells them there is more room in both
     * directions.

     * The slider is native so it inherits the platform's own touch handling,
     * which is a large part of why a range input is easier to get right on a
     * phone than a custom drag would be. The one thing it does not do by
     * itself is stop the game reading the drag as a look, so pointerdown is
     * captured and killed on the panel. Without that, dragging the thumb across
     * the slider would spin the camera at the same time. */
    function closeCfg() {
      cfgEl.classList.remove('open');
      sizeBtn.setAttribute('aria-expanded', 'false');
    }

    sizeBtn.addEventListener('pointerdown', e => {
      /* Stop the tap that opens the panel from also being a look drag. */
      e.preventDefault();
      e.stopPropagation();
      const open = !cfgEl.classList.contains('open');
      cfgEl.classList.toggle('open', open);
      sizeBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      buzz(8);
    }, true);

    /* input covers mouse, touch and keyboard, so one listener covers all three
     * and applyScale() is the single place the size is written. */
    cfgRange.addEventListener('input', () => {
      const v = Math.max(SIZE_MIN, Math.min(SIZE_MAX, parseInt(cfgRange.value, 10) || SIZE_DEF));
      userSize = v;
      try { localStorage.setItem(SIZE_KEY, String(v)); } catch (err) { /* private mode */ }
      applyScale();
    });

    /* Swallow pointer events anywhere inside the panel, so neither a slider
     * drag nor a stray tap on its background reaches the look zone. */
    cfgEl.addEventListener('pointerdown', e => {
      e.preventDefault();
      e.stopPropagation();
    }, true);

    /* Tapping anywhere else in the layer dismisses it. The layer is a sibling
     * of #hud, so a tap that closes this can still reach the pause button and
     * the game menus underneath, which is the behaviour a player expects. */
    layer.addEventListener('pointerdown', e => {
      if (cfgEl.classList.contains('open') && !cfgEl.contains(e.target)) closeCfg();
    });

    /* Opening a menu or backgrounding the app should not leave the panel open
       behind the pause screen, where there is no way to see or reach it. */
    const closeCfgOnHide = () => { if (cfgEl.classList.contains('open')) closeCfg(); };

    /* ------------------------------------------------------------ quality scaler

     * game.js caps the pixel ratio at 1 on a coarse pointer, which is the right
     * starting point but still too much for a weak phone. Watch the frame rate
     * and step the render scale down when the device cannot hold 45fps, then
     * creep back up if it turns out there was headroom. Two consecutive bad
     * seconds are required before dropping, so one hitch does not permanently
     * soften the image. */
    function floorRatio() { return Math.max(0.55, quality.cap * 0.55); }

    function setRatio(v) {
      if (!renderer) return;
      const next = Math.round(Math.max(floorRatio(), Math.min(quality.cap, v)) * 100) / 100;
      if (Math.abs(next - renderer.pixelRatio) < 0.01) return;
      renderer.pixelRatio = next;
      if (typeof renderer.resize === 'function') renderer.resize();
    }

    function sampleQuality(ms) {
      if (!renderer) return;
      quality.acc += ms;
      quality.n++;
      if (quality.acc < 1000) return;
      const fps = quality.n * 1000 / quality.acc;
      quality.acc = 0;
      quality.n = 0;
      if (fps < 45 && renderer.pixelRatio > floorRatio()) {
        quality.high = 0;
        if (++quality.low >= 2) { quality.low = 0; setRatio(renderer.pixelRatio - 0.15); }
      } else if (fps > 58 && renderer.pixelRatio < quality.cap - 0.01) {
        quality.low = 0;
        if (++quality.high >= 5) { quality.high = 0; setRatio(renderer.pixelRatio + 0.1); }
      } else {
        quality.low = 0;
        quality.high = 0;
      }
    }

    /* ------------------------------------------------------------------- loop */

    let prevT = 0;
    function frame(t) {
      const ms = prevT ? t - prevT : 0;
      prevT = t;
      /* A long gap is a backgrounded tab, not a slow device. */
      if (ms > 0 && ms < 500) sampleQuality(ms);
      feedMove();
      expirePulses();
      syncWeapon();
      applyUnit();
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    /* --------------------------------------------------------------- resizing */

    window.addEventListener('resize', relayout);
    window.addEventListener('orientationchange', () => setTimeout(relayout, 120));
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', relayout);
      window.visualViewport.addEventListener('scroll', relayout);
    }
    relayout();

    /* ------------------------------------------------------------ iOS install */

    /* iOS cannot install a PWA from a banner, so it is worth one line of text
     * telling people where the button is. Never shown in standalone mode, and
     * dismissed for good once tapped. */
    const plat = navigator.platform || '';
    const iOS = /iPad|iPhone|iPod/.test(plat) ||
      (plat === 'MacIntel' && (navigator.maxTouchPoints || 0) > 1);
    const standalone = !!window.navigator.standalone || mq('(display-mode: standalone)');
    let dismissed = null;
    try { dismissed = localStorage.getItem('doodle_ioshint'); } catch (err) { dismissed = null; }
    if (iOS && !standalone && dismissed !== 'off') {
      hint.classList.add('mostrar');
      const off = () => {
        hint.classList.remove('mostrar');
        try { localStorage.setItem('doodle_ioshint', 'off'); } catch (err) { /* private mode */ }
        hint.removeEventListener('pointerdown', off);
      };
      hint.addEventListener('pointerdown', off);
    }

    /* ---------------------------------------------------------- fullscreen */

    /* Android and desktop browsers have a real Fullscreen API, and a shooter
     * wants every pixel: the browser bars eat height, and the game already
     * re-measures on resize. It only works from a user gesture, so this hangs
     * off the first tap that lands anywhere rather than firing on load.
     *
     * iOS Safari exposes no element fullscreen for non-video and rejects
     * requestFullscreen on iPhone entirely, so there the only route to real
     * fullscreen is installing to the home screen, which the iOS hint above
     * already covers. Attempting it anyway just logs a console error. */
    const dse = doc.documentElement;
    const requestFS = dse.requestFullscreen || dse.webkitRequestFullscreen;
    if (requestFS && !standalone) {
      let asked = false;
      const goFS = () => {
        /* One shot. A second call throws and would only add noise, and the
         * browser has already refused once, so there is nothing to retry. */
        if (asked) return;
        asked = true;
        doc.removeEventListener('pointerdown', goFS, true);
        try {
          const p = dse.requestFullscreen || dse.webkitRequestFullscreen;
          const r = p.call(dse);
          /* Safari returns a promise, some builds return undefined. */
          if (r && typeof r.catch === 'function') r.catch(() => {});
        } catch (err) { /* denied, or not supported after all */ }
      };
      doc.addEventListener('pointerdown', goFS, true);
    }

    /* Fullscreen changes the reported viewport size, and the game rebuilds its
     * render targets from it. It already listens for window "resize", but not
     * every browser fires one when fullscreen is entered or exited -- notably
     * when only the system bars come and go. Dispatch one so the renderer and
     * camera aspect follow regardless, which is what keeps a half-swapped or
     * stretched canvas from being possible. */
    const afterFS = () => {
      relayout();
      /* Prefer the game's own resize: it knows how to rebuild the render
       * targets and the post-process resolution alongside the camera aspect. */
      try {
        const r = window.__ds && window.__ds.renderer;
        if (r && typeof r.resize === 'function') { r.resize(); return; }
      } catch (err) { /* fall through to the event */ }
      /* Fall back to a synthetic resize for the game's own window listener. */
      try { window.dispatchEvent(new Event('resize')); } catch (err) { /* ignore */ }
    };
    doc.addEventListener('fullscreenchange', afterFS);
    /* Safari still exposes the prefixed name on some versions. */
    doc.addEventListener('webkitfullscreenchange', afterFS);

    /* Signals that a touch session is live, for anything watching the page. */
    root.classList.add('tactil-listo');
  }

  /* ------------------------------------------------------------ late arming
   *
   * A tablet with a paired mouse or trackpad reports (pointer: fine) for its
   * PRIMARY pointer, because that is what the cursor is, even though the screen
   * is a touchscreen and the player is holding it. The obvious check above
   * cannot tell that device from a touchscreen laptop, so it stays off and the
   * player gets no buttons at all.
   *
   * There is no reliable static test for that case, so stop guessing and watch
   * for the truth: the first event whose pointerType is genuinely "touch" means
   * this is a touch device no matter what the media queries claimed. Boot then,
   * and drop the listeners. Costs one passive listener and nothing else. */
  function armLateTouch() {
    if (!hasTouch) return;
    let done = false;
    const go = (e) => {
      /* A mouse-driven click on a hybrid laptop must not switch layouts. */
      if (e && e.pointerType && e.pointerType !== 'touch') return;
      if (done) return;
      done = true;
      window.removeEventListener('pointerdown', go, true);
      window.removeEventListener('touchstart', go, true);
      boot();
    };
    window.addEventListener('pointerdown', go, true);
    window.addEventListener('touchstart', go, true);
  }

  /* Started last, once every const above has been initialised. */
  if (isTouch) {
    if (doc.body) boot();
    else doc.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    if (doc.body) armLateTouch();
    else doc.addEventListener('DOMContentLoaded', armLateTouch, { once: true });
  }
})();
