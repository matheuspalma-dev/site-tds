// Web Audio API Sound Synthesizer for Arcade Gameplay
class SoundManager {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private musicEnabled: boolean = true;
  private musicInterval: number | null = null;
  private currentDroneGain: GainNode | null = null;

  constructor() {
    // AudioContext will be initialized on first user interaction
    try {
      const savedSound = localStorage.getItem("ceuLimiteSound");
      if (savedSound !== null) this.soundEnabled = savedSound === "true";
      const savedMusic = localStorage.getItem("ceuLimiteMusic");
      if (savedMusic !== null) this.musicEnabled = savedMusic === "true";
    } catch {
      // ignore
    }
  }

  public init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public isSoundEnabled() {
    return this.soundEnabled;
  }

  public isMusicEnabled() {
    return this.musicEnabled;
  }

  public toggleSound(): boolean {
    this.soundEnabled = !this.soundEnabled;
    try {
      localStorage.setItem("ceuLimiteSound", String(this.soundEnabled));
    } catch {}
    return this.soundEnabled;
  }

  public toggleMusic(): boolean {
    this.musicEnabled = !this.musicEnabled;
    try {
      localStorage.setItem("ceuLimiteMusic", String(this.musicEnabled));
    } catch {}
    if (!this.musicEnabled) {
      this.stopMusic();
    } else {
      this.startMusic();
    }
    return this.musicEnabled;
  }

  public playJump(isHigh = false) {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    const startFreq = isHigh ? 380 : 260;
    const endFreq = isHigh ? 780 : 540;

    osc.frequency.setValueAtTime(startFreq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(endFreq, this.ctx.currentTime + 0.14);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.16);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.16);
  }

  public playBooster() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.25);
    osc.frequency.exponentialRampToValueAtTime(1100, this.ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.38);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.38);
  }

  public playLand() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(160, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.09);
  }

  public playBreak() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(180, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(80, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  public playDash() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    // Noise buffer for whoosh
    const bufferSize = this.ctx.sampleRate * 0.18;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(2400, this.ctx.currentTime + 0.1);
    filter.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.18);
    filter.Q.setValueAtTime(3, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start();
    noise.stop(this.ctx.currentTime + 0.18);
  }

  public playImpact() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(140, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.35);
  }

  public playFloat() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(520, this.ctx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }

  public playFenixRebirth() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const notes = [330, 440, 550, 660, 880, 1100];
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.08 + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + idx * 0.08);
      osc.stop(this.ctx.currentTime + idx * 0.08 + 0.3);
    });
  }

  public playRareCollect() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.05);

      gain.gain.setValueAtTime(0.18, this.ctx.currentTime + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.05 + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + i * 0.05);
      osc.stop(this.ctx.currentTime + i * 0.05 + 0.2);
    });
  }

  public playLevelUp() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const chords = [440, 554.37, 659.25, 880];
    chords.forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.06);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.06 + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + i * 0.06);
      osc.stop(this.ctx.currentTime + i * 0.06 + 0.45);
    });
  }

  public playBiomeWelcome(phase: number = 1) {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    // Rich harmonic triumphant fanfare for new biome discovery
    const melodyByPhase: { [key: number]: number[] } = {
      1: [261.63, 329.63, 392.0, 523.25], // Forest - Warm pastoral C Major
      2: [293.66, 369.99, 440.0, 587.33, 739.99], // Desert - Exotic radiant D Major / Lydian
      3: [349.23, 440.0, 523.25, 698.46, 880.0], // Sky - Ethereal F Major 
      4: [440.0, 554.37, 659.25, 880.0, 1108.73, 1318.51], // Cosmic Space - Stellar high arpeggio
      5: [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98], // Cyber Dimension - High tech synth arpeggio
    };

    const notes = melodyByPhase[phase] || [392.0, 523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = phase === 5 ? "square" : phase === 4 ? "sine" : (phase === 2 ? "sawtooth" : "triangle");
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.08);

      gain.gain.setValueAtTime(phase === 5 ? 0.14 : 0.18, this.ctx.currentTime + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.08 + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + i * 0.08);
      osc.stop(this.ctx.currentTime + i * 0.08 + 0.45);
    });
  }

  public playPortalWarp(isReturn: boolean = false) {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    // Sci-fi warp sound with frequency sweep & laser burst
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = isReturn ? "sine" : "sawtooth";
    if (isReturn) {
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.45);
    } else {
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.45);
    }

    gain.gain.setValueAtTime(0.24, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.5);

    // Chime sweep
    const chords = isReturn ? [523.25, 659.25, 783.99, 1046.5] : [1046.5, 783.99, 659.25, 523.25];
    chords.forEach((freq, idx) => {
      if (!this.ctx) return;
      const cOsc = this.ctx.createOscillator();
      const cGain = this.ctx.createGain();
      cOsc.type = "sine";
      cOsc.frequency.setValueAtTime(freq, now + idx * 0.06);
      cGain.gain.setValueAtTime(0.15, now + idx * 0.06);
      cGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.35);
      cOsc.connect(cGain);
      cGain.connect(this.ctx.destination);
      cOsc.start(now + idx * 0.06);
      cOsc.stop(now + idx * 0.06 + 0.35);
    });
  }

  public playHighScore() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
    notes.forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "square";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.07);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.07 + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + i * 0.07);
      osc.stop(this.ctx.currentTime + i * 0.07 + 0.25);
    });
  }

  public playGameOver() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const notes = [330, 311.13, 293.66, 261.63, 220, 164.81];
    notes.forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.1);

      gain.gain.setValueAtTime(0.22, this.ctx.currentTime + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.1 + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + i * 0.1);
      osc.stop(this.ctx.currentTime + i * 0.1 + 0.35);
    });
  }

  public playClick() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.03);

    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }

  public playLavaWarning() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(110, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(220, this.ctx.currentTime + 0.1);
    osc.frequency.linearRampToValueAtTime(110, this.ctx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.22);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.22);
  }

  public startMusic() {
    if (!this.musicEnabled) return;
    this.init();
    if (!this.ctx || this.musicInterval) return;

    // Pleasant minimalist ambient synth arpeggio
    let step = 0;
    const scale = [261.63, 329.63, 392.0, 523.25, 392.0, 329.63, 293.66, 349.23, 440.0, 587.33, 440.0, 349.23];

    this.musicInterval = window.setInterval(() => {
      if (!this.musicEnabled || !this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(scale[step % scale.length], this.ctx.currentTime);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.35);

      step++;
    }, 450);
  }

  public stopMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }
}

export const sound = new SoundManager();
