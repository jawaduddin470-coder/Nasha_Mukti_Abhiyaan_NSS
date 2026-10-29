/**
 * Continuous Web Audio API Engine for the NSS MJCET Cinematic Opening Sequence.
 * - Single continuous audio session spanning all 5 story beats and final reveal.
 * - Zero clicks, no restarting on beat transitions, no gaps or repetitive sound effects.
 * - Smooth filter cutoff sweeps and harmonic pad swells for emotional progression.
 * - Graceful handling of browser autoplay policies with state reporting.
 */

class CinematicSoundtrack {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private padGain: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private shimmerGain: GainNode | null = null;
  private activeOscillators: OscillatorNode[] = [];
  private isMuted: boolean = false;
  private isStarted: boolean = false;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }
    return this.ctx;
  }

  /**
   * Attempt to start continuous playback.
   * Returns true if audio context is active ('running'), false if suspended by browser autoplay policy.
   */
  public async play(): Promise<boolean> {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return false;

      if (ctx.state === 'suspended') {
        try {
          await ctx.resume();
        } catch {
          // Autoplay blocked by browser
        }
      }

      if (ctx.state !== 'running') {
        // Blocked: will require user gesture
        return false;
      }

      if (this.isStarted && this.masterGain) {
        // Already running, unmute if needed
        this.unmute();
        return true;
      }

      this.isStarted = true;
      this.isMuted = false;
      const now = ctx.currentTime;

      // Master output gain
      this.masterGain = ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.0001, now);
      // Gentle fade in over 2.2s
      this.masterGain.gain.exponentialRampToValueAtTime(0.22, now + 2.2);

      // Warm cinematic low-pass filter (film score resonance)
      this.filterNode = ctx.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(360, now);
      this.filterNode.Q.setValueAtTime(1.1, now);

      // Sub-bus for pad harmonics
      this.padGain = ctx.createGain();
      this.padGain.gain.setValueAtTime(0.85, now);

      // Sub-bus for high emotional shimmer
      this.shimmerGain = ctx.createGain();
      this.shimmerGain.gain.setValueAtTime(0.0001, now);

      // Connect graph: Pad -> Filter -> Master -> Destination
      this.padGain.connect(this.filterNode);
      this.shimmerGain.connect(this.filterNode);
      this.filterNode.connect(this.masterGain);
      this.masterGain.connect(ctx.destination);

      // Cinematic Harmonic Chord Foundation:
      // D2 (73.4Hz fundamental), A2 (110.0Hz perfect fifth), D3 (146.8Hz octave), F#3 (185.0Hz major third)
      const baseChords = [
        { freq: 73.42, type: 'sine' as OscillatorType, detune: -3 },
        { freq: 110.0, type: 'triangle' as OscillatorType, detune: 2 },
        { freq: 146.83, type: 'sine' as OscillatorType, detune: -1 },
        { freq: 185.0, type: 'triangle' as OscillatorType, detune: 4 },
      ];

      baseChords.forEach(({ freq, type, detune }) => {
        if (!ctx || !this.padGain) return;
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, now);
        osc.detune.setValueAtTime(detune, now);

        oscGain.gain.setValueAtTime(0.24, now);
        osc.connect(oscGain);
        oscGain.connect(this.padGain);

        osc.start(now);
        this.activeOscillators.push(osc);
      });

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Called on user gesture to unblock or activate the audio session
   */
  public async resumeOrPlay(): Promise<boolean> {
    const ctx = this.getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch {
        // Failed
      }
    }
    return this.play();
  }

  public isAudioActive(): boolean {
    return this.ctx !== null && this.ctx.state === 'running' && this.isStarted && !this.isMuted;
  }

  /**
   * Modulate harmonics continuously across story beats without restarting
   */
  public triggerBeat(beatIndex: number) {
    if (!this.ctx || !this.filterNode || !this.padGain || this.ctx.state !== 'running') return;
    const now = this.ctx.currentTime;

    try {
      switch (beatIndex) {
        case 0: // Beat 1: Possibility — Gentle calm dawn
          this.filterNode.frequency.exponentialRampToValueAtTime(360, now + 1.2);
          if (this.shimmerGain) {
            this.shimmerGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.0);
          }
          break;

        case 1: // Beat 2: Pressure / Crossroads — Subtly deeper tone with restrained tension
          this.filterNode.frequency.exponentialRampToValueAtTime(280, now + 1.4);
          if (this.shimmerGain) {
            this.shimmerGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.0);
          }
          break;

        case 2: // Beat 3: Awareness — Filter smoothly opens with clarity and hope
          this.filterNode.frequency.exponentialRampToValueAtTime(620, now + 1.5);
          if (this.shimmerGain) {
            this.shimmerGain.gain.exponentialRampToValueAtTime(0.08, now + 1.2);
          }
          break;

        case 3: // Beat 4: Community & Support — Warm emotional expansion
          this.filterNode.frequency.exponentialRampToValueAtTime(860, now + 1.4);
          if (this.shimmerGain) {
            this.shimmerGain.gain.exponentialRampToValueAtTime(0.14, now + 1.2);
          }
          break;

        case 4: // Beat 5: Campaign Reveal — Dignified, triumphant resolution
          this.filterNode.frequency.exponentialRampToValueAtTime(1100, now + 1.5);
          if (this.shimmerGain) {
            this.shimmerGain.gain.exponentialRampToValueAtTime(0.2, now + 1.5);
          }
          break;
      }
    } catch {
      // Non-critical audio parameter scheduling
    }
  }

  public mute() {
    this.isMuted = true;
    if (this.masterGain && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
        this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
      } catch {
        // Ignore ramp error
      }
    }
  }

  public unmute() {
    this.isMuted = false;
    if (this.masterGain && this.ctx && this.ctx.state === 'running') {
      try {
        const now = this.ctx.currentTime;
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
        this.masterGain.gain.exponentialRampToValueAtTime(0.22, now + 0.5);
      } catch {
        // Ignore ramp error
      }
    }
  }

  /**
   * Smooth exit fade out over 1.2s
   */
  public stop() {
    this.isStarted = false;
    if (this.masterGain && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
        this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.0);
      } catch {
        // Ignore ramp error
      }
    }

    setTimeout(() => {
      this.activeOscillators.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // Ignore
        }
      });
      this.activeOscillators = [];
    }, 1100);
  }

  public dispose() {
    this.stop();
    if (this.ctx && this.ctx.state !== 'closed') {
      try {
        this.ctx.close();
      } catch {
        // Ignore
      }
      this.ctx = null;
    }
  }
}

export const cinematicSoundtrack = new CinematicSoundtrack();
