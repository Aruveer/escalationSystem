// Uses Web Audio API to generate a calm, non-alarming chime
class SoundUtil {
  private audioContext: AudioContext | null = null;

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  public playSoftChime() {
    try {
      const ctx = this.getContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Soft sine wave for a "round" sound
      oscillator.type = 'sine';
      
      // A gentle major third arpeggio feel (C5 -> E5)
      const now = ctx.currentTime;
      
      oscillator.frequency.setValueAtTime(523.25, now); // C5
      oscillator.frequency.exponentialRampToValueAtTime(659.25, now + 0.1); // E5
      
      // Volume envelope: Attack -> Decay
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.3, now + 0.05); // Soft attack
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.5); // Long decay

      oscillator.start(now);
      oscillator.stop(now + 1.5);
    } catch (e) {
      console.warn("Audio playback failed", e);
    }
  }

  public playAlertTone() {
    try {
      const ctx = this.getContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = 'triangle';
      const now = ctx.currentTime;

      // Two soft pulses
      oscillator.frequency.setValueAtTime(440, now);
      
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.2, now + 0.1);
      gainNode.gain.linearRampToValueAtTime(0, now + 0.3);
      
      gainNode.gain.linearRampToValueAtTime(0.2, now + 0.4);
      gainNode.gain.linearRampToValueAtTime(0, now + 0.6);

      oscillator.start(now);
      oscillator.stop(now + 0.7);
    } catch (e) {
      console.warn("Audio playback failed", e);
    }
  }
}

export const soundUtil = new SoundUtil();