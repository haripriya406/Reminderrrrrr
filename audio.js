/**
 * Forgetful Reminder - Procedural Web Audio Engine
 * Uses the Web Audio API to synthesize 100% original, copyright-free sound effects.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  // Lazily initialize audio context on user gesture to obey browser autoplay policies
  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(isMuted) {
    this.muted = isMuted;
  }

  isMuted() {
    return this.muted;
  }

  /**
   * 1. Reminder Notification Sound: A pleasant, classic dual-tone bell chime
   */
  playReminderChime() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    
    // Note 1: E5 (659.25 Hz)
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.5);

    // Note 2: B5 (987.77 Hz) - played slightly delayed
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(987.77, now + 0.12);
    gain2.gain.setValueAtTime(0, now);
    gain2.gain.setValueAtTime(0.25, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.85);
  }

  /**
   * 2. Success Ding: Crisp cheerful chime when creating a reminder
   */
  playSuccessDing() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1046.50, now); // C6
    osc.frequency.exponentialRampToValueAtTime(1318.51, now + 0.08); // E6

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.4);
  }

  /**
   * 3. Thinking Sound: Soft harmonic tick/computing pulse
   */
  playThinking() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.06);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  /**
   * 4. Forgetting Sound: Funny cartoon "boing", vinyl scratch chirp, or error bonk
   */
  playForgetting() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    const variants = ['boing', 'bonk', 'scratch'];
    const choice = variants[Math.floor(Math.random() * variants.length)];

    const now = this.ctx.currentTime;

    if (choice === 'boing') {
      // Classic cartoon rubber boing
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      
      // Pitch sweeps up then wobbles down
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(580, now + 0.15);
      osc.frequency.linearRampToValueAtTime(180, now + 0.45);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
    } else if (choice === 'bonk') {
      // Windows-style dull error bonk
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.25);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } else {
      // Quick record scratch chirp
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.18);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    }
  }

  /**
   * 5. Critical Memory Failure (0% Health): Dramatic comedic sad fail chord
   */
  playCriticalFail() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    
    // Sad trombone notes sequence: D4 -> C#4 -> C4 -> B3 (drawn out with vibrato)
    const notes = [
      { freq: 293.66, start: 0.0, dur: 0.28 },
      { freq: 277.18, start: 0.3, dur: 0.28 },
      { freq: 261.63, start: 0.6, dur: 0.28 },
      { freq: 246.94, start: 0.9, dur: 0.75 }
    ];

    notes.forEach(n => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(n.freq, now + n.start);

      // Low pass filter to make it sound brassy / muffled
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, now + n.start);

      gain.gain.setValueAtTime(0, now + n.start);
      gain.gain.linearRampToValueAtTime(0.18, now + n.start + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + n.start + n.dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + n.start);
      osc.stop(now + n.start + n.dur + 0.05);
    });
  }

  /**
   * 6. Cat Running Sound: rapid cartoon gallop / pitter-patter
   *    Plays 5 quick percussive clicks with slight pitch variation.
   */
  playCatRunning() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const stepCount = 14;      // number of paw-tap blips
    const stepInterval = 0.10; // seconds between each blip

    for (let i = 0; i < stepCount; i++) {
      const t = now + i * stepInterval;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Alternating high / low pitch for left/right paw feel
      const pitch = i % 2 === 0 ? 380 : 290;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(pitch, t);
      osc.frequency.exponentialRampToValueAtTime(pitch * 0.6, t + 0.055);

      gain.gain.setValueAtTime(0.09, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.065);
    }

    // Add a whoosh underneath to feel the speed
    const whoosh = this.ctx.createOscillator();
    const whooshGain = this.ctx.createGain();
    const whooshFilter = this.ctx.createBiquadFilter();
    whoosh.type = 'sawtooth';
    whoosh.frequency.setValueAtTime(80, now);
    whoosh.frequency.exponentialRampToValueAtTime(40, now + stepCount * stepInterval);
    whooshFilter.type = 'bandpass';
    whooshFilter.frequency.setValueAtTime(200, now);
    whooshGain.gain.setValueAtTime(0.04, now);
    whooshGain.gain.exponentialRampToValueAtTime(0.001, now + stepCount * stepInterval);
    whoosh.connect(whooshFilter);
    whooshFilter.connect(whooshGain);
    whooshGain.connect(this.ctx.destination);
    whoosh.start(now);
    whoosh.stop(now + stepCount * stepInterval + 0.05);
  }

  /**
   * 7. Dramatic Reveal Sound: "DUN DUN DUN" comedic shock chord
   *    Three staccato low hits + a final reverberating DOOM note.
   */
  playDramaticReveal() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Three staccato "DUN" hits
    [0, 0.28, 0.56].forEach(offset => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, now + offset);
      osc.frequency.exponentialRampToValueAtTime(55, now + offset + 0.18);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now + offset);

      gain.gain.setValueAtTime(0, now + offset);
      gain.gain.linearRampToValueAtTime(0.28, now + offset + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.22);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.25);
    });

    // Final reverberating DOOM chord at 0.85s
    const doomFreqs = [55, 82.41, 110];
    doomFreqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + 0.85);

      gain.gain.setValueAtTime(0, now + 0.85);
      gain.gain.linearRampToValueAtTime(0.15 - idx * 0.03, now + 0.87);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + 0.85);
      osc.stop(now + 2.25);
    });

    // High-pitched "scratch" accent on the doom hit
    const scratch = this.ctx.createOscillator();
    const scratchGain = this.ctx.createGain();
    scratch.type = 'sawtooth';
    scratch.frequency.setValueAtTime(1200, now + 0.85);
    scratch.frequency.exponentialRampToValueAtTime(80, now + 1.05);
    scratchGain.gain.setValueAtTime(0.1, now + 0.85);
    scratchGain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);
    scratch.connect(scratchGain);
    scratchGain.connect(this.ctx.destination);
    scratch.start(now + 0.85);
    scratch.stop(now + 1.15);
  }

  /**
   * 8. Remind Me Meme Sound: "modi-ji-bhojyam"
   * Plays modi-ji-bhojyam.mp3 when the remind me meme image is shown
   */
  playModiJiBhojyam() {
    if (this.muted) return;
    try {
      const audio = new Audio('modi-ji-bhojyam.mp3');
      audio.volume = 0.85;
      audio.currentTime = 0;
      audio.play().catch(() => {
        // Fallback relative path
        const audioFallback = new Audio('assets/modi-ji-bhojyam.mp3');
        audioFallback.volume = 0.85;
        audioFallback.play().catch((err) => {
          console.warn('Audio play failed:', err);
          this.playForgetting();
        });
      });
    } catch (e) {
      this.playForgetting();
    }
  }

  playModiOhMyGod() {
    this.playModiJiBhojyam();
  }

  playSryBeb() {
    this.playModiJiBhojyam();
  }
}

// Export singleton
window.soundEngine = new SoundEngine();
