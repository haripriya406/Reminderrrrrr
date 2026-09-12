/**
 * Forgetful Reminder — 🐈 Cat Easter Egg Animation Engine
 *
 * The 4-part surprise sequence triggered when the user clicks "I forgive you"
 * after the app says "I forgot 😔".
 *
 * Part 1 — Cat runs in from the left with running animation & dust clouds
 * Part 2 — Cute happy moment
 * Part 3 — Meme reveal: "I FORGOT." 💀
 * Part 4 — Cat runs away embarrassed, screen returns to normal
 */

class CatAnimationEngine {
  constructor() {
    this.isRunning = false;
    this.overlay = null;
    this.cat = null;
    this.bubble = null;
    this.memeBox = null;
    this._timers = [];
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Public API
  // ─────────────────────────────────────────────────────────────────────────

  /** Called by the "I forgive you" button */
  trigger() {
    if (this.isRunning) return;
    this.isRunning = true;
    this._build();
    this._part1_catRunsIn();
  }

  // ─────────────────────────────────────────────────────────────────────────
  // DOM Construction
  // ─────────────────────────────────────────────────────────────────────────

  _build() {
    // Remove any leftover overlay
    const old = document.getElementById('catEasterEggOverlay');
    if (old) old.remove();

    // Backdrop
    const overlay = document.createElement('div');
    overlay.id = 'catEasterEggOverlay';
    overlay.className = 'cat-overlay';
    document.body.appendChild(overlay);
    this.overlay = overlay;

    // Cat SVG
    const cat = document.createElement('div');
    cat.id = 'catEasterEggCat';
    cat.className = 'cat-sprite';
    cat.innerHTML = this._catSVG('normal');
    overlay.appendChild(cat);
    this.cat = cat;

    // Speech Bubble
    const bubble = document.createElement('div');
    bubble.id = 'catEasterEggBubble';
    bubble.className = 'cat-bubble';
    overlay.appendChild(bubble);
    this.bubble = bubble;

    // Dust container
    const dust = document.createElement('div');
    dust.id = 'catEasterEggDust';
    dust.className = 'cat-dust';
    overlay.appendChild(dust);
    this.dust = dust;

    // Meme Banner
    const meme = document.createElement('div');
    meme.id = 'catEasterEggMeme';
    meme.className = 'cat-meme-banner';
    overlay.appendChild(meme);
    this.memeBox = meme;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Cat SVG faces
  // ─────────────────────────────────────────────────────────────────────────

  _catSVG(mood) {
    // Fat chonky cat palette
    const colorBody   = '#E8924A'; // warm orange
    const colorBelly  = '#FDDCB5'; // cream belly
    const colorStripe = '#A0380A'; // deep stripe
    const colorNose   = '#E06080'; // pink nose
    const colorInner  = '#F5B07A'; // inner ear / cheek

    // Eyes — drawn for 140-wide viewBox now
    const eyes = {
      normal:     `<ellipse cx="47" cy="46" rx="6" ry="7" fill="#1a1a2e"/>
                   <ellipse cx="93" cy="46" rx="6" ry="7" fill="#1a1a2e"/>
                   <circle cx="49.5" cy="43.5" r="2.2" fill="white"/>
                   <circle cx="95.5" cy="43.5" r="2.2" fill="white"/>`,
      happy:      `<path d="M40 46 Q47 37 54 46" stroke="#1a1a2e" stroke-width="3.5" fill="none" stroke-linecap="round"/>
                   <path d="M86 46 Q93 37 100 46" stroke="#1a1a2e" stroke-width="3.5" fill="none" stroke-linecap="round"/>`,
      confused:   `<ellipse cx="47" cy="46" rx="6" ry="7" fill="#1a1a2e"/>
                   <ellipse cx="93" cy="46" rx="6" ry="7" fill="#1a1a2e"/>
                   <circle cx="49.5" cy="43.5" r="2.2" fill="white"/>
                   <circle cx="95.5" cy="43.5" r="2.2" fill="white"/>
                   <path d="M40 35 L52 31" stroke="#1a1a2e" stroke-width="2.5" stroke-linecap="round"/>
                   <path d="M86 35 L100 31" stroke="#1a1a2e" stroke-width="2.5" stroke-linecap="round"/>`,
      embarrassed:`<path d="M40 45 Q47 52 54 45" stroke="#1a1a2e" stroke-width="3" fill="none" stroke-linecap="round"/>
                   <path d="M86 45 Q93 52 100 45" stroke="#1a1a2e" stroke-width="3" fill="none" stroke-linecap="round"/>
                   <ellipse cx="36" cy="55" rx="8" ry="5" fill="#ff9999" opacity="0.7"/>
                   <ellipse cx="104" cy="55" rx="8" ry="5" fill="#ff9999" opacity="0.7"/>`,
      dead:       `<line x1="38" y1="40" x2="56" y2="55" stroke="#1a1a2e" stroke-width="4" stroke-linecap="round"/>
                   <line x1="56" y1="40" x2="38" y2="55" stroke="#1a1a2e" stroke-width="4" stroke-linecap="round"/>
                   <line x1="84" y1="40" x2="102" y2="55" stroke="#1a1a2e" stroke-width="4" stroke-linecap="round"/>
                   <line x1="102" y1="40" x2="84" y2="55" stroke="#1a1a2e" stroke-width="4" stroke-linecap="round"/>`,
    };

    const mouth = {
      normal:     `<path d="M58 62 Q70 70 82 62" stroke="#1a1a2e" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,
      happy:      `<path d="M54 60 Q70 76 86 60" stroke="#1a1a2e" stroke-width="3" fill="${colorNose}" fill-opacity="0.15" stroke-linecap="round"/>`,
      confused:   `<path d="M60 63 Q70 59 80 63" stroke="#1a1a2e" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,
      embarrassed:`<path d="M60 65 Q70 59 80 65" stroke="#1a1a2e" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,
      dead:       `<path d="M56 66 Q70 58 84 66" stroke="#1a1a2e" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,
    };

    const m = mood in eyes ? mood : 'normal';
    const mk = mood in mouth ? mood : 'normal';

    // viewBox is 140 wide x 170 tall to fit the chonky boi
    return `
    <svg class="cat-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 170" width="140" height="170">
      <!-- ░░ TAIL — wrapped in <g> so CSS transform-origin works at base ░░ -->
      <g class="cat-tail-group">
        <path d="M102 120 Q138 105 134 82 Q130 62 114 74"
              stroke="${colorBody}" stroke-width="11" fill="none" stroke-linecap="round"/>
        <!-- tail tip lighter -->
        <circle cx="114" cy="74" r="7" fill="${colorInner}"/>
      </g>

      <!-- ░░ CHONKY BODY ░░ -->
      <ellipse cx="70" cy="118" rx="52" ry="40" fill="${colorBody}"/>
      <!-- fat belly roll -->
      <ellipse cx="70" cy="124" rx="34" ry="27" fill="${colorBelly}"/>
      <!-- belly bottom shadow -->
      <ellipse cx="70" cy="145" rx="30" ry="8" fill="${colorStripe}" opacity="0.12"/>

      <!-- ░░ STRIPES ░░ -->
      <path d="M28 105 Q50 97 68 105" stroke="${colorStripe}" stroke-width="3" fill="none" opacity="0.5"/>
      <path d="M32 117 Q52 110 70 117" stroke="${colorStripe}" stroke-width="2.5" fill="none" opacity="0.4"/>
      <path d="M30 128 Q50 122 68 128" stroke="${colorStripe}" stroke-width="2" fill="none" opacity="0.3"/>

      <!-- ░░ HEAD ░░ -->
      <ellipse cx="70" cy="56" rx="42" ry="40" fill="${colorBody}"/>
      <!-- chubby cheeks -->
      <ellipse cx="28" cy="62" rx="16" ry="13" fill="${colorInner}" opacity="0.7"/>
      <ellipse cx="112" cy="62" rx="16" ry="13" fill="${colorInner}" opacity="0.7"/>

      <!-- ░░ EARS ░░ -->
      <polygon points="28,22 14,2 46,16" fill="${colorBody}"/>
      <polygon points="112,22 126,2 94,16" fill="${colorBody}"/>
      <polygon points="30,20 20,6 42,15" fill="${colorNose}" opacity="0.6"/>
      <polygon points="110,20 120,6 98,15" fill="${colorNose}" opacity="0.6"/>

      <!-- ░░ EYES ░░ -->
      ${eyes[m]}

      <!-- ░░ NOSE ░░ -->
      <ellipse cx="70" cy="59" rx="5" ry="3.5" fill="${colorNose}"/>
      <!-- nose highlight -->
      <circle cx="68" cy="57.5" r="1.4" fill="white" opacity="0.6"/>

      <!-- ░░ WHISKERS left ░░ -->
      <line x1="4"  y1="55" x2="56" y2="59" stroke="#1a1a2e" stroke-width="1.2" opacity="0.5"/>
      <line x1="4"  y1="63" x2="56" y2="63" stroke="#1a1a2e" stroke-width="1.2" opacity="0.38"/>
      <line x1="8"  y1="70" x2="56" y2="65" stroke="#1a1a2e" stroke-width="1"   opacity="0.28"/>
      <!-- ░░ WHISKERS right ░░ -->
      <line x1="136" y1="55" x2="84" y2="59" stroke="#1a1a2e" stroke-width="1.2" opacity="0.5"/>
      <line x1="136" y1="63" x2="84" y2="63" stroke="#1a1a2e" stroke-width="1.2" opacity="0.38"/>
      <line x1="132" y1="70" x2="84" y2="65" stroke="#1a1a2e" stroke-width="1"   opacity="0.28"/>

      <!-- ░░ MOUTH ░░ -->
      ${mouth[mk]}

      <!-- ░░ STUBBY FRONT LEGS ░░ -->
      <g class="cat-legs-front">
        <rect class="cat-leg-fl" x="32" y="148" width="18" height="18" rx="9" fill="${colorBody}"/>
        <rect class="cat-leg-fr" x="90" y="148" width="18" height="18" rx="9" fill="${colorBody}"/>
      </g>
      <!-- ░░ STUBBY BACK LEGS ░░ -->
      <g class="cat-legs-back">
        <rect class="cat-leg-bl" x="14" y="144" width="18" height="20" rx="9" fill="${colorBody}"/>
        <rect class="cat-leg-br" x="108" y="144" width="18" height="20" rx="9" fill="${colorBody}"/>
      </g>
    </svg>`;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Part 1 — Cat Runs In
  // ─────────────────────────────────────────────────────────────────────────

  _part1_catRunsIn() {
    const cat = this.cat;

    // Start: tiny, far left, invisible
    cat.style.left = '-120px';
    cat.style.bottom = '15%';
    cat.style.transform = 'scale(0.25)';
    cat.style.transformOrigin = 'bottom center';
    cat.style.opacity = '0';

    // Fade in overlay
    this.overlay.style.opacity = '1';

    // Show bubble
    this._setBubble('🐈💨 "COMING TO SAY THANK YOU…"', 'running');

    // Play running sound
    if (window.soundEngine) window.soundEngine.playCatRunning();

    // Start leg animation
    cat.classList.add('cat-running');

    this._after(200, () => {
      cat.style.opacity = '1';
      cat.style.transition = 'left 2.2s cubic-bezier(0.12, 0, 0.39, 0), transform 2.2s cubic-bezier(0.12, 0, 0.39, 0)';

      const vw = window.innerWidth;
      const centerX = Math.max(vw / 2 - 50, 60);

      cat.style.left = centerX + 'px';
      cat.style.transform = 'scale(1)';

      // Spawn dust puffs during run
      this._spawnDust(2200);

      // When cat arrives at center
      this._after(2300, () => this._part1_catArrives());
    });
  }

  _part1_catArrives() {
    const cat = this.cat;

    // Stop running legs
    cat.classList.remove('cat-running');

    // Bounce stop
    cat.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
    cat.style.transform = 'scale(1.18)';

    this._after(250, () => {
      cat.style.transform = 'scale(1)';
    });

    this._after(400, () => {
      this._setBubble('🥹 "You forgave me!"', 'happy');
    });

    this._after(650, () => {
      cat.innerHTML = this._catSVG('happy');
      cat.classList.add('cat-head-tilt');
    });

    this._after(1100, () => this._part2_cuteMoment());
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Part 2 — Cute Moment
  // ─────────────────────────────────────────────────────────────────────────

  _part2_cuteMoment() {
    const cat = this.cat;

    cat.classList.remove('cat-head-tilt');
    this._setBubble('"You\'re too kind. 🥹"', 'happy');

    cat.classList.add('cat-happy-bounce');

    this._after(1000, () => {
      cat.classList.remove('cat-happy-bounce');
    });

    // 2 second pause then confusion
    this._after(2200, () => {
      cat.innerHTML = this._catSVG('confused');
      this._setBubble('🤔 "Wait…"', 'think');
      cat.classList.add('cat-head-tilt-slow');
    });

    this._after(3100, () => this._part3_memeReveal());
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Part 3 — Meme Reveal
  // ─────────────────────────────────────────────────────────────────────────

  _part3_memeReveal() {
    const cat = this.cat;
    cat.classList.remove('cat-head-tilt-slow');

    this._setBubble('"What did you forgive me for?"', 'think');

    this._after(1900, () => {
      cat.innerHTML = this._catSVG('dead');

      if (window.soundEngine) window.soundEngine.playDramaticReveal();

      this._setBubble('"I FORGOT." 💀', 'skull');

      // Screen shake
      document.body.classList.add('cat-screen-shake');
      this._after(750, () => document.body.classList.remove('cat-screen-shake'));

      this._after(350, () => {
        this._showMemeBanner();
      });

      this._after(3400, () => this._part4_catRunsAway());
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Part 4 — Cat Runs Away
  // ─────────────────────────────────────────────────────────────────────────

  _part4_catRunsAway() {
    const cat = this.cat;

    this.memeBox.classList.remove('cat-meme-visible');

    cat.innerHTML = this._catSVG('embarrassed');
    this._setBubble('"I should probably leave now…"', 'embarrassed');

    this._after(1300, () => {
      this._setBubble('', '');
      cat.classList.add('cat-running', 'cat-facing-right');

      if (window.soundEngine) window.soundEngine.playCatRunning();

      const vw = window.innerWidth;
      cat.style.transition = 'left 2s cubic-bezier(0.55, 0, 1, 0.45), transform 2s cubic-bezier(0.55, 0, 1, 0.45)';
      cat.style.left = (vw + 150) + 'px';
      cat.style.transform = 'scale(0.2)';

      this._spawnDust(1800, true);

      this._after(1500, () => {
        this._setBubble('"Bye. I forgot you were here." 💀', 'ghost');
      });

      // Fade out and cleanup
      this._after(2700, () => {
        this.overlay.style.opacity = '0';
        this._after(700, () => this._cleanup());
      });
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────────────────────────────────────

  _setBubble(text, style) {
    if (!text) {
      this.bubble.style.opacity = '0';
      return;
    }

    const styleMap = {
      running:    'cat-bubble--running',
      happy:      'cat-bubble--happy',
      think:      'cat-bubble--think',
      skull:      'cat-bubble--skull',
      embarrassed:'cat-bubble--embarrassed',
      ghost:      'cat-bubble--ghost',
    };

    this.bubble.className = 'cat-bubble ' + (styleMap[style] || '');
    this.bubble.textContent = text;
    this.bubble.style.opacity = '1';
  }

  _showMemeBanner() {
    this.memeBox.innerHTML = `
      <span class="cat-meme-emoji">😭💀</span>
      <span class="cat-meme-text">BRO FORGOT<br>WHAT HE FORGOT</span>
      <span class="cat-meme-emoji">💀😭</span>
    `;
    this.memeBox.classList.add('cat-meme-visible');
  }

  _spawnDust(durationMs, rightSide = false) {
    const dustContainer = this.dust;
    const interval = 180;
    const count = Math.floor(durationMs / interval);
    let i = 0;

    const spawnOne = () => {
      if (i++ >= count) return;
      const puff = document.createElement('span');
      puff.className = 'cat-dust-puff';
      puff.textContent = '💨';

      const catRect = this.cat.getBoundingClientRect();
      const overlayRect = this.overlay.getBoundingClientRect();
      const relLeft = catRect.left - overlayRect.left + (rightSide ? catRect.width + 5 : -10);
      const relTop  = catRect.bottom - overlayRect.top - 24;
      puff.style.left = relLeft + 'px';
      puff.style.top  = relTop  + 'px';
      if (rightSide) puff.style.transform = 'scaleX(-1)';

      dustContainer.appendChild(puff);
      this._after(900, () => { if (puff.parentNode) puff.remove(); });
      this._after(interval, spawnOne);
    };
    spawnOne();
  }

  _after(ms, fn) {
    const id = setTimeout(fn, ms);
    this._timers.push(id);
    return id;
  }

  _cleanup() {
    this._timers.forEach(clearTimeout);
    this._timers = [];
    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
    }
    this.isRunning = false;
  }
}

// Export singleton
window.catAnimationEngine = new CatAnimationEngine();
