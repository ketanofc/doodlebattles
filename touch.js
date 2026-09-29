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

  /* A laptop with both a touchscreen and a mouse reports (pointer:fine), and
     those people want the keyboard layout. Only go touch-first when the
     primary pointer really is coarse. ?touch=1 forces the control layer on,
     which is the escape hatch for a hybrid laptop and the only way to test the
     touch build on a desktop browser. */
  const isTouch = /[?&]touch=1(?:&|$)/.test(location.search) ||
    (hasTouch && (mq('(pointer: coarse)') || !mq('(pointer: fine)')));
  if (!isTouch) return;

  root.classList.add('tactil');

  /* ------------------------------------------------------------------ markup */

  /* The two long words break over two lines: a 32px circle cannot hold six
     characters on one row without shrinking the label past legibility. */
  const LAYER_HTML = [
    '<div class="tz-izq" aria-hidden="true"></div>',
    '<div class="tz-der" aria-hidden="true"></div>',
    '<div class="tpalanca" aria-hidden="true"></div>',
    '<button type="button" class="tb tb-top tb-grapple" aria-label="Grapple">HOOK</button>',
    '<button type="button" class="tb tb-top tb-slot tb-gun" aria-label="Next weapon"><span class="t-lbl">gun</span></button>',
    '<button type="button" class="tb tb-top tb-score" aria-label="Scoreboard">SC<br>ORE</button>',
    '<button type="button" class="tb tb-top tb-music" aria-label="Toggle music">&#9834;</button>',
    '<button type="button" class="tb tb-tl tb-pausa" aria-label="Pause">&#10073;&#10073;</button>',
    '<button type="button" class="tb tb-fire" aria-label="Fire">FIRE</button>',
    '<button type="button" class="tb tb-aim" aria-label="Aim">AIM</button>',
    '<button type="button" class="tb tb-jump" aria-label="Jump">JUMP</button>',
    '<button type="button" class="tb tb-duck" aria-label="Duck">DUCK</button>',
    '<button type="button" class="tb tb-reload" aria-label="Reload">RE<br>LOAD</button>',
    '<button type="button" class="tb tb-melee" aria-label="Melee">SLASH</button>',
    '<button type="button" class="tb tb-nade" aria-label="Grenade">NADE</button>',
    '<button type="button" class="tb tb-dash" aria-label="Dash">DASH</button>'
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

  const U_MIN = 2.8;
  const U_MAX = 4.4;
  const DEAD = 0.14;       /* below this the stick reads as centred */
  const SPRINT_AT = 0.82;  /* push nearly all the way out to sprint */
  const PULSE_MS = 200;    /* how long a tapped flag stays set */

  function boot() {
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
      '<div><div class="g-icon"></div><h2>Rotate</h2>' +
      '<p>Turn the phone sideways to fight.</p></div>';
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
    const slotLabel = layer.querySelector('.tb-gun .t-lbl');

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

     * A 3D shooter needs the long axis. Phones get a prompt; a tablet held
     * upright is big enough to play and nagging about it would be wrong. */
    function orientCheck() {
      const vv = window.visualViewport;
      const w = vv ? vv.width : window.innerWidth;
      const h = vv ? vv.height : window.innerHeight;
      const phoneish = Math.min(w, h) < 560;
      girar.classList.toggle('oculto', !(phoneish && h > w));
    }

    function relayout() { applyUnit(); orientCheck(); }

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
    let hidden = false;

    function syncVisible() {
      const nongame = hudEl && hudEl.classList.contains('nogame');
      const menu = screenEl && screenEl.classList.contains('show');
      const want = !!(nongame || menu);
      if (want === hidden) return;
      hidden = want;
      layer.classList.toggle('oculto', want);
      if (want) {
        releaseAll();
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
      if (slotLabel) slotLabel.textContent = t.toLowerCase();
    }

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

    /* Signals that a touch session is live, for anything watching the page. */
    root.classList.add('tactil-listo');
  }

  /* Started last, once every const above has been initialised. */
  if (doc.body) boot();
  else doc.addEventListener('DOMContentLoaded', boot, { once: true });
})();
